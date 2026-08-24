package com.developerplatform.common.config;

import com.developerplatform.common.constants.ApiPaths;
import com.developerplatform.ratelimit.interceptor.RateLimitInterceptor;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
@RequiredArgsConstructor
public class WebMvcConfig implements WebMvcConfigurer {

    private final RateLimitInterceptor rateLimitInterceptor;

    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        // Apply rate limiting specifically to the URL shortener endpoints
        registry.addInterceptor(rateLimitInterceptor)
                .addPathPatterns(ApiPaths.URLS + "/**");
    }
}
