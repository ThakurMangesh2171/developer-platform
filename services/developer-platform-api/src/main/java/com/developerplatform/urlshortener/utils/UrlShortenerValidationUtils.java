package com.developerplatform.urlshortener.utils;

import com.developerplatform.common.enums.ErrorCode;
import com.developerplatform.common.exception.ConflictException;
import com.developerplatform.urlshortener.repository.ShortenedUrlRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class UrlShortenerValidationUtils {

    private final ShortenedUrlRepository shortenedUrlRepository;

    public void validateCustomAliasUnique(String customAlias) {
        if (customAlias != null && !customAlias.trim().isEmpty()) {
            String alias = customAlias.trim();
            if (shortenedUrlRepository.findByShortCodeAndDeletedAtIsNull(alias).isPresent()) {
                log.warn("Validation failed. Custom alias '{}' is already in use.", alias);
                throw new ConflictException(
                        ErrorCode.BAD_REQUEST,
                        "Custom alias is already in use."
                );
            }
        }
    }
}
