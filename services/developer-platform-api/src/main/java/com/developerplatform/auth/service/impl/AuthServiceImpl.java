package com.developerplatform.auth.service.impl;

import com.developerplatform.auth.dto.request.LoginRequest;
import com.developerplatform.auth.dto.request.RegisterRequest;
import com.developerplatform.auth.dto.request.UpdateProfileRequest;
import com.developerplatform.auth.dto.request.ChangePasswordRequest;
import com.developerplatform.auth.dto.response.LoginResponse;
import com.developerplatform.auth.dto.response.RegisterResponse;
import com.developerplatform.auth.entity.User;
import com.developerplatform.auth.enums.UserStatus;
import com.developerplatform.auth.mapper.UserMapper;
import com.developerplatform.auth.repository.UserRepository;
import com.developerplatform.auth.repository.UserTokenRepository;
import com.developerplatform.auth.service.interfaces.AuthService;
import com.developerplatform.auth.service.interfaces.EmailService;
import com.developerplatform.common.enums.ErrorCode;
import com.developerplatform.common.constants.messages.UserMessages;
import com.developerplatform.common.exception.BadRequestException;
import com.developerplatform.common.exception.ConflictException;
import com.developerplatform.common.exception.ForbiddenException;
import com.developerplatform.common.exception.UnauthorizedException;
import com.developerplatform.security.JwtTokenProvider;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.developerplatform.auth.dto.response.UserResponse;
import com.developerplatform.common.exception.ResourceNotFoundException;
import com.developerplatform.auth.entity.UserToken;
import com.developerplatform.auth.enums.TokenType;

import java.time.LocalDateTime;
import java.util.UUID;
import java.util.concurrent.TimeUnit;

import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final UserTokenRepository userTokenRepository;
    private final PasswordEncoder passwordEncoder;
    private final UserMapper userMapper;
    private final JwtTokenProvider jwtTokenProvider;
    private final EmailService emailService;
    private final java.time.Clock clock;

    @Override
    @Transactional
    public RegisterResponse register(RegisterRequest request) {
        log.info("Attempting to register new user with email: {}", request.getEmail());
        
        String encodedPassword = passwordEncoder.encode(request.getPassword());
        User user = userMapper.toEntity(request, encodedPassword);
        User savedUser = userRepository.save(user);
        log.info("Successfully saved user {} to database", savedUser.getId());

        // Generate verification token
        String token = UUID.randomUUID().toString();

        UserToken userToken = UserToken.builder()
                .user(savedUser)
                .token(token)
                .tokenType(TokenType.EMAIL_VERIFICATION)
                .expiresAt(LocalDateTime.now(clock).plusHours(24))
                .isUsed(false)
                .build();
        userTokenRepository.save(userToken);

        // Send email asynchronously
        emailService.sendVerificationEmail(savedUser.getEmail(), token);

        return userMapper.toRegisterResponse(savedUser);
    }

    @Override
    @Transactional(readOnly = true)
    public LoginResponse login(LoginRequest request) {
        log.info("Attempting to login user with email: {}", request.getEmail());
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new UnauthorizedException(
                        ErrorCode.UNAUTHORIZED,
                        UserMessages.INVALID_CREDENTIALS
                ));

        if (!passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
            log.warn("Login failed. Invalid password for email: {}", request.getEmail());
            throw new UnauthorizedException(
                    ErrorCode.UNAUTHORIZED,
                    UserMessages.INVALID_CREDENTIALS
            );
        }

        if (user.getStatus() == UserStatus.PENDING_VERIFICATION) {
            log.warn("Login failed. Email not verified for user ID: {}", user.getId());
            throw new ForbiddenException(
                    ErrorCode.FORBIDDEN,
                    UserMessages.EMAIL_NOT_VERIFIED
            );
        }

        if (user.getStatus() != UserStatus.ACTIVE) {
            log.warn("Login failed. Account status is {} for user ID: {}", user.getStatus(), user.getId());
            throw new ForbiddenException(
                    ErrorCode.FORBIDDEN,
                    "Your account status is: " + user.getStatus() + ". Please contact support."
            );
        }

        String accessToken = jwtTokenProvider.generateAccessToken(user.getEmail(), user.getId());
        String refreshToken = jwtTokenProvider.generateRefreshToken(user.getEmail(), user.getId());
        long expiresIn = jwtTokenProvider.getAccessTokenExpirationInSeconds();

        log.info("User {} successfully logged in. Generating tokens.", user.getId());
        return LoginResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .expiresIn(expiresIn)
                .build();
    }

    @Override
    @Transactional
    public void verifyEmail(String token) {
        log.info("Attempting to verify email with provided token");
        UserToken userToken = userTokenRepository.findByTokenAndTokenType(token, TokenType.EMAIL_VERIFICATION)
                .orElseThrow(() -> new BadRequestException(
                        ErrorCode.BAD_REQUEST,
                        "Verification token is invalid"
                ));

        if (userToken.isUsed() || userToken.getExpiresAt().isBefore(LocalDateTime.now(clock))) {
            throw new BadRequestException(
                    ErrorCode.BAD_REQUEST,
                    "Verification token has expired or already been used"
            );
        }

        User user = userToken.getUser();
        user.setStatus(UserStatus.ACTIVE);
        user.setEmailVerified(true);
        userRepository.save(user);

        userToken.setUsed(true);
        userTokenRepository.save(userToken);
    }
    @Override
    @Transactional
    public void forgotPassword(String email) {
        log.info("Processing forgot password request for email: {}", email);
        User user = userRepository.findByEmail(email)
                .orElse(null);

        // Even if user not found, we don't throw an error to prevent email enumeration
        if (user != null) {
            String token = UUID.randomUUID().toString();
            
            UserToken userToken = UserToken.builder()
                    .user(user)
                    .token(token)
                    .tokenType(TokenType.PASSWORD_RESET)
                    .expiresAt(LocalDateTime.now(clock).plusMinutes(15))
                    .isUsed(false)
                    .build();
            userTokenRepository.save(userToken);
            
            emailService.sendPasswordResetEmail(user.getEmail(), token);
            log.info("Sent password reset email to user ID: {}", user.getId());
        } else {
            log.info("Forgot password requested for non-existent email: {}", email);
        }
    }

    @Override
    @Transactional
    public void resetPassword(String token, String newPassword) {
        log.info("Attempting to reset password with provided token");
        UserToken userToken = userTokenRepository.findByTokenAndTokenType(token, TokenType.PASSWORD_RESET)
                .orElseThrow(() -> new BadRequestException(
                        ErrorCode.BAD_REQUEST,
                        "Reset token is invalid"
                ));

        if (userToken.isUsed() || userToken.getExpiresAt().isBefore(LocalDateTime.now(clock))) {
            throw new BadRequestException(
                    ErrorCode.BAD_REQUEST,
                    "Reset token has expired or already been used"
            );
        }

        User user = userToken.getUser();
        user.setPasswordHash(passwordEncoder.encode(newPassword));
        userRepository.save(user);

        userToken.setUsed(true);
        userTokenRepository.save(userToken);
    }

    @Override
    public UserResponse getUserProfile(UUID userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        ErrorCode.RESOURCE_NOT_FOUND,
                        "User not found"
                ));
        
        return UserResponse.builder()
                .id(user.getId())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .email(user.getEmail())
                .build();
    }

    @Override
    @Transactional
    public UserResponse updateProfile(UUID userId, UpdateProfileRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        ErrorCode.RESOURCE_NOT_FOUND,
                        "User not found"
                ));

        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());
        
        User savedUser = userRepository.save(user);

        return UserResponse.builder()
                .id(savedUser.getId())
                .firstName(savedUser.getFirstName())
                .lastName(savedUser.getLastName())
                .email(savedUser.getEmail())
                .build();
    }

    @Override
    @Transactional
    public void changePassword(UUID userId, ChangePasswordRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        ErrorCode.RESOURCE_NOT_FOUND,
                        "User not found"
                ));

        if (!passwordEncoder.matches(request.getOldPassword(), user.getPasswordHash())) {
            log.warn("Password change failed. Incorrect current password for user ID: {}", userId);
            throw new BadRequestException(
                    ErrorCode.BAD_REQUEST,
                    "Current password is incorrect"
            );
        }

        user.setPasswordHash(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);
        log.info("Successfully changed password for user ID: {}", userId);
    }
}
