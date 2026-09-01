package com.developerplatform.auth.controller;

import com.developerplatform.auth.dto.request.LoginRequest;
import com.developerplatform.auth.dto.request.RegisterRequest;
import com.developerplatform.auth.dto.request.UpdateProfileRequest;
import com.developerplatform.auth.dto.request.ChangePasswordRequest;
import com.developerplatform.auth.dto.response.LoginResponse;
import com.developerplatform.auth.dto.response.RegisterResponse;
import com.developerplatform.auth.dto.response.UserResponse;
import com.developerplatform.auth.service.interfaces.AuthService;
import com.developerplatform.common.constants.ApiPaths;
import com.developerplatform.common.constants.messages.UserMessages;
import com.developerplatform.common.response.ApiResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;
import java.util.UUID;

@RestController
@RequestMapping(ApiPaths.AUTH)
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping(ApiPaths.REGISTER)
    public ResponseEntity<ApiResponse<RegisterResponse>> register(@Valid @RequestBody RegisterRequest request) {
        RegisterResponse registerResponse = authService.register(request);

        ApiResponse<RegisterResponse> response = ApiResponse.<RegisterResponse>builder()
                .success(true)
                .message(UserMessages.USER_REGISTERED_SUCCESSFULLY)
                .data(registerResponse)
                .timestamp(LocalDateTime.now())
                .build();

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(response);
    }

    @PostMapping(ApiPaths.LOGIN)
    public ResponseEntity<ApiResponse<LoginResponse>> login(@Valid @RequestBody LoginRequest request) {
        LoginResponse loginResponse = authService.login(request);

        ApiResponse<LoginResponse> response = ApiResponse.<LoginResponse>builder()
                .success(true)
                .message("Login successful")
                .data(loginResponse)
                .timestamp(LocalDateTime.now())
                .build();

        return ResponseEntity.ok(response);
    }

    @GetMapping(ApiPaths.VERIFY_EMAIL)
    public ResponseEntity<ApiResponse<Void>> verifyEmail(@RequestParam String token) {
        authService.verifyEmail(token);

        ApiResponse<Void> response = ApiResponse.<Void>builder()
                .success(true)
                .message("Email verified successfully")
                .timestamp(LocalDateTime.now())
                .build();

        return ResponseEntity.ok(response);
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<ApiResponse<Void>> forgotPassword(
            @Valid @RequestBody com.developerplatform.auth.dto.request.ForgotPasswordRequest request
    ) {
        authService.forgotPassword(request.getEmail());
        
        ApiResponse<Void> response = ApiResponse.<Void>builder()
                .success(true)
                .message("If an account exists, a password reset email will be sent.")
                .timestamp(LocalDateTime.now())
                .build();
                
        return ResponseEntity.ok(response);
    }

    @PostMapping("/reset-password")
    public ResponseEntity<ApiResponse<Void>> resetPassword(
            @Valid @RequestBody com.developerplatform.auth.dto.request.ResetPasswordRequest request
    ) {
        authService.resetPassword(request.getToken(), request.getNewPassword());
        
        ApiResponse<Void> response = ApiResponse.<Void>builder()
                .success(true)
                .message("Password reset successfully. You can now login.")
                .timestamp(LocalDateTime.now())
                .build();
                
        return ResponseEntity.ok(response);
    }

    @GetMapping("/me")
    public ResponseEntity<ApiResponse<UserResponse>> getMe(Authentication authentication) {
        com.developerplatform.security.UserPrincipal principal = (com.developerplatform.security.UserPrincipal) authentication.getPrincipal();
        UUID userId = principal.getId();
        UserResponse userResponse = authService.getUserProfile(userId);

        ApiResponse<UserResponse> response = ApiResponse.<UserResponse>builder()
                .success(true)
                .message("User profile retrieved successfully")
                .data(userResponse)
                .timestamp(LocalDateTime.now())
                .build();

        return ResponseEntity.ok(response);
    }
    
    @PutMapping("/me")
    public ResponseEntity<ApiResponse<UserResponse>> updateProfile(
            Authentication authentication,
            @Valid @RequestBody UpdateProfileRequest request) {
        com.developerplatform.security.UserPrincipal principal = (com.developerplatform.security.UserPrincipal) authentication.getPrincipal();
        UUID userId = principal.getId();
        UserResponse userResponse = authService.updateProfile(userId, request);

        ApiResponse<UserResponse> response = ApiResponse.<UserResponse>builder()
                .success(true)
                .message("Profile updated successfully")
                .data(userResponse)
                .timestamp(LocalDateTime.now())
                .build();

        return ResponseEntity.ok(response);
    }
    
    @PutMapping("/password")
    public ResponseEntity<ApiResponse<Void>> changePassword(
            Authentication authentication,
            @Valid @RequestBody ChangePasswordRequest request) {
        com.developerplatform.security.UserPrincipal principal = (com.developerplatform.security.UserPrincipal) authentication.getPrincipal();
        UUID userId = principal.getId();
        authService.changePassword(userId, request);

        ApiResponse<Void> response = ApiResponse.<Void>builder()
                .success(true)
                .message("Password changed successfully")
                .timestamp(LocalDateTime.now())
                .build();

        return ResponseEntity.ok(response);
    }
}
