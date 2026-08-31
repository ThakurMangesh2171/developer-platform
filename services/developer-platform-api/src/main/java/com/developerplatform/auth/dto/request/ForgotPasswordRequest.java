package com.developerplatform.auth.dto.request;

import com.developerplatform.common.constants.messages.UserMessages;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ForgotPasswordRequest {
    @NotBlank(message = UserMessages.EMAIL_REQUIRED)
    @Email(message = UserMessages.INVALID_EMAIL)
    private String email;
}
