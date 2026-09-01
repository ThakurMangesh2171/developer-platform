package com.developerplatform.common.constants.messages;

public final class AuthMessages {

    private AuthMessages() {
    }

    /*
     * Success Messages
     */
    public static final String USER_REGISTERED_SUCCESSFULLY = "User registered successfully.";

    public static final String LOGIN_SUCCESSFUL = "Login successful.";

    public static final String PASSWORD_CHANGED_SUCCESSFULLY = "Password changed successfully.";



    /*
     * Error Messages
     */
    public static final String INVALID_CREDENTIALS = "Invalid email or password.";

    public static final String INVALID_REFRESH_TOKEN = "Invalid refresh token.";

    public static final String ACCOUNT_DISABLED = "Account is disabled.";

    public static final String EMAIL_NOT_VERIFIED = "Email is not verified.";

    public static final String VERIFICATION_TOKEN_INVALID = "Verification token is invalid.";

    public static final String VERIFICATION_TOKEN_EXPIRED = "Verification token has expired or already been used.";

    public static final String RESET_TOKEN_INVALID = "Reset token is invalid.";

    public static final String RESET_TOKEN_EXPIRED = "Reset token has expired or already been used.";

    public static final String CURRENT_PASSWORD_INCORRECT = "Current password is incorrect.";
}