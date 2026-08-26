package com.developerplatform.common.util;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;
import java.util.Base64;

public final class ApiKeyUtils {

    private static final String KEY_PREFIX_CONSTANT = "dp_";
    private static final SecureRandom SECURE_RANDOM = new SecureRandom();

    private ApiKeyUtils() {
        // Private constructor to prevent instantiation
    }

    public static String generateRawKey() {
        byte[] randomBytes = new byte[24];
        SECURE_RANDOM.nextBytes(randomBytes);
        String randomString = Base64.getUrlEncoder().withoutPadding().encodeToString(randomBytes);
        return KEY_PREFIX_CONSTANT + randomString;
    }

    public static String extractPrefix(String rawKey) {
        if (rawKey == null || rawKey.length() < 10) {
            throw new IllegalArgumentException("Invalid API key format");
        }
        return rawKey.substring(0, 10);
    }

    public static String hashKey(String rawKey) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] hash = digest.digest(rawKey.getBytes(StandardCharsets.UTF_8));
            StringBuilder hexString = new StringBuilder();
            for (byte b : hash) {
                String hex = Integer.toHexString(0xff & b);
                if (hex.length() == 1) {
                    hexString.append('0');
                }
                hexString.append(hex);
            }
            return hexString.toString();
        } catch (NoSuchAlgorithmException e) {
            throw new IllegalStateException("SHA-256 algorithm not found", e);
        }
    }
}
