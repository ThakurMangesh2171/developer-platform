package com.developerplatform.auth.entity;

import com.developerplatform.auth.enums.TokenType;
import com.developerplatform.common.entity.UuidEntity;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;

import java.time.LocalDateTime;

@Entity
@Table(name = "user_tokens")
@Getter
@Setter
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
public class UserToken extends UuidEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "token", nullable = false, unique = true)
    private String token;

    @Enumerated(EnumType.STRING)
    @Column(name = "token_type", nullable = false, length = 50)
    private TokenType tokenType;

    @Column(name = "expires_at", nullable = false)
    private LocalDateTime expiresAt;

    @Column(name = "is_used", nullable = false)
    @Builder.Default
    private boolean isUsed = false;
}
