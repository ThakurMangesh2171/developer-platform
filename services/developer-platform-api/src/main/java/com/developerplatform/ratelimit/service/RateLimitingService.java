package com.developerplatform.ratelimit.service;

import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;

import java.time.Duration;

@Service
@RequiredArgsConstructor
public class RateLimitingService {

    private final StringRedisTemplate redisTemplate;

    private static final int MAX_REQUESTS_PER_MINUTE = 60;
    private static final String REDIS_KEY_PREFIX = "rate_limit:api_key:";

    public boolean isAllowed(String apiKeyPrefix) {
        String key = REDIS_KEY_PREFIX + apiKeyPrefix;
        
        // Increment the counter
        Long currentRequests = redisTemplate.opsForValue().increment(key);
        
        // If this is the first request, set the expiration to 1 minute
        if (currentRequests != null && currentRequests == 1L) {
            redisTemplate.expire(key, Duration.ofMinutes(1));
        }

        // Return whether the current request count is within the limit
        return currentRequests != null && currentRequests <= MAX_REQUESTS_PER_MINUTE;
    }
}
