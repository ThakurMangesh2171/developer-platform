package com.developerplatform.auth.service.interfaces;

import com.developerplatform.auth.dto.request.LoginRequest;
import com.developerplatform.auth.dto.request.RegisterRequest;
import com.developerplatform.auth.dto.response.LoginResponse;
import com.developerplatform.auth.dto.response.RegisterResponse;
import com.developerplatform.auth.dto.response.UserResponse;

import java.util.UUID;

public interface AuthService {

    RegisterResponse register(RegisterRequest request);

    LoginResponse login(LoginRequest request);

    void verifyEmail(String token);

    void forgotPassword(String email);

    void resetPassword(String token, String newPassword);

    UserResponse getUserProfile(UUID userId);
}
