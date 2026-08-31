package com.developerplatform.auth.dto.response;

import com.developerplatform.auth.enums.UserStatus;
import lombok.*;

import java.util.UUID;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RegisterResponse {

    private UUID id;

    private String email;

    private UserStatus status;

}