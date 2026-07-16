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
}