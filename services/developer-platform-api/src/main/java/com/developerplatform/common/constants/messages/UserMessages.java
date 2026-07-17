package com.developerplatform.common.constants.messages;

public final class UserMessages {

    private UserMessages() {
    }

    // Success
    public static final String USER_REGISTERED_SUCCESSFULLY = "User registered successfully";

    // Validation
    public static final String FIRST_NAME_REQUIRED = "First name is required";

    public static final String LAST_NAME_REQUIRED = "Last name is required";

    public static final String EMAIL_REQUIRED = "Email is required";

    public static final String INVALID_EMAIL = "Invalid email address";

    public static final String PASSWORD_REQUIRED = "Password is required";

    public static final String INVALID_PASSWORD = "Password must be between 8 and 100 characters";

    // Business
    public static final String USER_ALREADY_EXISTS = "User already exists";

    public static final String INVALID_CREDENTIALS = "Invalid email or password";

    public static final String EMAIL_NOT_VERIFIED = "Please verify your email address first";

}