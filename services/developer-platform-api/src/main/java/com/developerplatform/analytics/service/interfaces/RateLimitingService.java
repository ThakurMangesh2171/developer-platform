package com.developerplatform.analytics.service.interfaces;

public interface RateLimitingService {
    
    /**
     * Checks if the given API key is allowed to make a request.
     * Implements a sliding window or fixed window rate limiter using Redis.
     *
     * @param apiKey The API key to check
     * @return true if allowed, false if rate limit exceeded
     */
    boolean isAllowed(String apiKey);
}
