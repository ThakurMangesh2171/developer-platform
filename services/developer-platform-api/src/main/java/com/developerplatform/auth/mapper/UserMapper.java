package com.developerplatform.auth.mapper;

import com.developerplatform.auth.dto.request.RegisterRequest;
import com.developerplatform.auth.dto.response.RegisterResponse;
import com.developerplatform.auth.entity.User;
import com.developerplatform.auth.enums.UserStatus;
import org.springframework.stereotype.Component;

@Component
public class UserMapper {

    public User toEntity(RegisterRequest request, String encodedPassword) {
        if (request == null) {
            return null;
        }
        return User.builder()
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .email(request.getEmail())
                .passwordHash(encodedPassword)
                .status(UserStatus.PENDING_VERIFICATION)
                .emailVerified(false)
                .build();
    }

    public RegisterResponse toRegisterResponse(User user) {
        if (user == null) {
            return null;
        }
        return RegisterResponse.builder()
                .id(user.getId())
                .email(user.getEmail())
                .status(user.getStatus())
                .build();
    }
}
