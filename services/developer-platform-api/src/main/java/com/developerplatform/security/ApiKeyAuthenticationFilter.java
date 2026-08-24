package com.developerplatform.security;

import com.developerplatform.apikey.entity.ApiKey;
import com.developerplatform.apikey.enums.ApiKeyStatus;
import com.developerplatform.apikey.repository.ApiKeyRepository;
import com.developerplatform.common.util.ApiKeyUtils;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Optional;

@Component
@RequiredArgsConstructor
@Slf4j
public class ApiKeyAuthenticationFilter extends OncePerRequestFilter {

    private static final String API_KEY_HEADER = "X-API-Key";

    private final ApiKeyRepository apiKeyRepository;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
        try {
            String rawApiKey = getApiKeyFromRequest(request);

            if (StringUtils.hasText(rawApiKey)) {
                String prefix = ApiKeyUtils.extractPrefix(rawApiKey);
                Optional<ApiKey> apiKeyOpt = apiKeyRepository.findByKeyPrefixAndStatusAndDeletedAtIsNull(prefix, ApiKeyStatus.ACTIVE);

                if (apiKeyOpt.isPresent()) {
                    ApiKey apiKey = apiKeyOpt.get();
                    String hash = ApiKeyUtils.hashKey(rawApiKey);

                    if (hash.equals(apiKey.getKeyHash())) {
                        ApiKeyAuthenticationToken authentication = new ApiKeyAuthenticationToken(apiKey.getProjectId(), prefix);
                        SecurityContextHolder.getContext().setAuthentication(authentication);
                    } else {
                        log.warn("API Key hash mismatch for prefix: {}", prefix);
                    }
                } else {
                    log.warn("API Key not found or inactive for prefix: {}", prefix);
                }
            }
        } catch (Exception ex) {
            log.error("Could not set API Key authentication in security context", ex);
        }

        filterChain.doFilter(request, response);
    }

    private String getApiKeyFromRequest(HttpServletRequest request) {
        return request.getHeader(API_KEY_HEADER);
    }
}
