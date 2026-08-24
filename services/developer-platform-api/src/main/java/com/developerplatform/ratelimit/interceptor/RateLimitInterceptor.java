package com.developerplatform.ratelimit.interceptor;

import com.developerplatform.common.exception.RateLimitException;
import com.developerplatform.ratelimit.service.RateLimitingService;
import com.developerplatform.security.ApiKeyAuthenticationToken;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;

@Component
@RequiredArgsConstructor
public class RateLimitInterceptor implements HandlerInterceptor {

    private final RateLimitingService rateLimitingService;

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication instanceof ApiKeyAuthenticationToken) {
            ApiKeyAuthenticationToken apiKeyAuth = (ApiKeyAuthenticationToken) authentication;
            // The credentials store the api key prefix
            String apiKeyPrefix = (String) apiKeyAuth.getCredentials();

            if (!rateLimitingService.isAllowed(apiKeyPrefix)) {
                throw new RateLimitException("You have exceeded the maximum number of requests allowed per minute (60). Please try again later.");
            }
        }

        return true;
    }
}
