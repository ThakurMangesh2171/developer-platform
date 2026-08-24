package com.developerplatform.auth.dto.request;

import com.developerplatform.common.constants.ValidationConstants;
import com.developerplatform.common.constants.messages.UserMessages;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.*;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ResetPasswordRequest {
    @NotBlank(message = "Token is required")
    private String token;

    @NotBlank(message = UserMessages.PASSWORD_REQUIRED)
    @Size(
            min = ValidationConstants.PASSWORD_MIN_LENGTH,
            max = ValidationConstants.PASSWORD_MAX_LENGTH,
            message = UserMessages.INVALID_PASSWORD
    )
    private String newPassword;
}
