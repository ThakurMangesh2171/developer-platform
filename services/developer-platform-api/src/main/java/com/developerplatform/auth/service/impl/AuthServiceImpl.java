package com.developerplatform.auth.service.impl;

import com.developerplatform.auth.dto.request.LoginRequest;
import com.developerplatform.auth.dto.request.RegisterRequest;
import com.developerplatform.auth.dto.response.LoginResponse;
import com.developerplatform.auth.dto.response.RegisterResponse;
import com.developerplatform.auth.entity.User;
import com.developerplatform.auth.enums.UserStatus;
import com.developerplatform.auth.mapper.UserMapper;
import com.developerplatform.auth.repository.UserRepository;
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
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;
import java.util.concurrent.TimeUnit;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final UserMapper userMapper;
    private final JwtTokenProvider jwtTokenProvider;
    private final StringRedisTemplate redisTemplate;
    private final EmailService emailService;

    @Override
    @Transactional
    public RegisterResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new ConflictException(
                    ErrorCode.USER_ALREADY_EXISTS,
                    UserMessages.USER_ALREADY_EXISTS
            );
        }

        String encodedPassword = passwordEncoder.encode(request.getPassword());
        User user = userMapper.toEntity(request, encodedPassword);
        User savedUser = userRepository.save(user);

        // Generate verification token
        String token = UUID.randomUUID().toString();

        // Store in Redis (key: email_verification:<token> -> value: email, expires in 24 hours)
        String redisKey = "email_verification:" + token;
        redisTemplate.opsForValue().set(redisKey, savedUser.getEmail(), 24, TimeUnit.HOURS);

        // Send email asynchronously
        emailService.sendVerificationEmail(savedUser.getEmail(), token);

        return userMapper.toRegisterResponse(savedUser);
    }

    @Override
    @Transactional(readOnly = true)
    public LoginResponse login(LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new UnauthorizedException(
                        ErrorCode.UNAUTHORIZED,
                        UserMessages.INVALID_CREDENTIALS
                ));

        if (!passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
            throw new UnauthorizedException(
                    ErrorCode.UNAUTHORIZED,
                    UserMessages.INVALID_CREDENTIALS
            );
        }

        if (user.getStatus() == UserStatus.PENDING_VERIFICATION) {
            throw new ForbiddenException(
                    ErrorCode.FORBIDDEN,
                    UserMessages.EMAIL_NOT_VERIFIED
            );
        }

        if (user.getStatus() != UserStatus.ACTIVE) {
            throw new ForbiddenException(
                    ErrorCode.FORBIDDEN,
                    "Your account status is: " + user.getStatus() + ". Please contact support."
            );
        }

        String accessToken = jwtTokenProvider.generateAccessToken(user.getEmail(), user.getId());
        String refreshToken = jwtTokenProvider.generateRefreshToken(user.getEmail(), user.getId());
        long expiresIn = jwtTokenProvider.getAccessTokenExpirationInSeconds();

        return LoginResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .expiresIn(expiresIn)
                .build();
    }

    @Override
    @Transactional
    public void verifyEmail(String token) {
        String redisKey = "email_verification:" + token;
        String email = redisTemplate.opsForValue().get(redisKey);

        if (email == null) {
            throw new BadRequestException(
                    ErrorCode.BAD_REQUEST,
                    "Verification token is invalid or has expired"
            );
        }

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new BadRequestException(
                        ErrorCode.BAD_REQUEST,
                        "User not found for this verification token"
                ));

        user.setStatus(UserStatus.ACTIVE);
        user.setEmailVerified(true);
        userRepository.save(user);

        // Remove token from Redis
        redisTemplate.delete(redisKey);
    }
}
