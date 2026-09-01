package com.developerplatform.auth.utils;

import com.developerplatform.auth.repository.UserRepository;
import com.developerplatform.common.constants.messages.UserMessages;
import com.developerplatform.common.enums.ErrorCode;
import com.developerplatform.common.exception.ConflictException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class AuthValidationUtils {

    private final UserRepository userRepository;

    public void validateEmailIsUnique(String email) {
        if (userRepository.existsByEmail(email)) {
            log.warn("Validation failed. User already exists with email: {}", email);
            throw new ConflictException(
                    ErrorCode.USER_ALREADY_EXISTS,
                    UserMessages.USER_ALREADY_EXISTS
            );
        }
    }
}
