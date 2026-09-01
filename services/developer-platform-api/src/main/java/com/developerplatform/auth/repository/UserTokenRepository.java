package com.developerplatform.auth.repository;

import com.developerplatform.auth.entity.UserToken;
import com.developerplatform.auth.enums.TokenType;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface UserTokenRepository extends JpaRepository<UserToken, UUID> {
    Optional<UserToken> findByTokenAndTokenType(String token, TokenType tokenType);
}
