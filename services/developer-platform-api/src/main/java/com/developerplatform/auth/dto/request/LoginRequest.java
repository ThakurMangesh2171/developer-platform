package com.developerplatform.auth.dto.request;

import com.developerplatform.common.constants.ValidationConstants;
import com.developerplatform.common.constants.messages.UserMessages;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.*;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LoginRequest {

    @NotBlank(message = UserMessages.EMAIL_REQUIRED)
    @Email(message = UserMessages.INVALID_EMAIL)
    @Size(max = ValidationConstants.EMAIL_MAX_LENGTH)
    private String email;

    @NotBlank(message = UserMessages.PASSWORD_REQUIRED)
    private String password;

}
