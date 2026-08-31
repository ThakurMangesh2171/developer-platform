package com.developerplatform.analytics.service.impl;

import com.developerplatform.analytics.service.interfaces.RateLimitingService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.time.Instant;

@Slf4j
@Service
@RequiredArgsConstructor
public class RateLimitingServiceImpl implements RateLimitingService {

    private final RedisTemplate<String, String> redisTemplate;
    
    // Allow 100 requests per minute per API key for this demo.
    private static final int MAX_REQUESTS_PER_MINUTE = 100;

    @Override
    public boolean isAllowed(String apiKey) {
        if (apiKey == null || apiKey.trim().isEmpty()) {
            return false;
        }

        // Fixed window approach based on current minute
        long currentMinute = Instant.now().getEpochSecond() / 60;
        String redisKey = "rate_limit:" + apiKey + ":" + currentMinute;

        try {
            Long currentCount = redisTemplate.opsForValue().increment(redisKey);
            
            // If it's the first request in this minute, set an expiration of 2 minutes to clean up
            if (currentCount != null && currentCount == 1L) {
                redisTemplate.expire(redisKey, Duration.ofMinutes(2));
            }

            if (currentCount != null && currentCount > MAX_REQUESTS_PER_MINUTE) {
                log.warn("Rate limit exceeded for API Key. Key: {}, Count: {}", apiKey, currentCount);
                return false;
            }
            return true;
        } catch (Exception e) {
            log.error("Redis error during rate limiting check, allowing request to pass.", e);
            // Fail open: if Redis is down, we don't want to block legitimate traffic completely in this naive setup
            return true;
        }
    }
}
