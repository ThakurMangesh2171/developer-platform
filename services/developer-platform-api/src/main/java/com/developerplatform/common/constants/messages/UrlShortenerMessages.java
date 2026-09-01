package com.developerplatform.common.constants.messages;

public final class UrlShortenerMessages {

    private UrlShortenerMessages() {
    }

    // Success
    public static final String URL_SHORTENED_SUCCESSFULLY = "URL shortened successfully";
    public static final String URL_DELETED_SUCCESSFULLY = "Short URL deleted successfully";
    public static final String URL_ANALYTICS_RETRIEVED = "URL analytics retrieved successfully";

    // Errors
    public static final String URL_NOT_FOUND = "Short URL not found";
    public static final String URL_EXPIRED = "This short URL has expired.";
    public static final String EXPIRATION_DATE_TOO_FAR = "Expiration date cannot be more than 1 year in the future.";
}
