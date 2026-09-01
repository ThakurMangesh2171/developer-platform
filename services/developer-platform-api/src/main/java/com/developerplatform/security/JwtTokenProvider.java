package com.developerplatform.security;

import com.auth0.jwt.JWT;
import com.auth0.jwt.JWTVerifier;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.exceptions.JWTVerificationException;
import com.auth0.jwt.interfaces.DecodedJWT;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.time.Instant;
import java.util.UUID;

@Component
public class JwtTokenProvider {

    private static final String CLAIM_USER_ID = "userId";

    @Value("${app.security.jwt.secret}")
    private String secret;

    @Value("${app.security.jwt.access-token-expiration-ms}")
    private long accessTokenExpirationMs;

    @Value("${app.security.jwt.refresh-token-expiration-ms}")
    private long refreshTokenExpirationMs;

    public String generateAccessToken(String email, UUID userId) {
        Algorithm algorithm = Algorithm.HMAC256(secret);
        return JWT.create()
                .withSubject(email)
                .withClaim(CLAIM_USER_ID, userId.toString())
                .withIssuedAt(Instant.now())
                .withExpiresAt(Instant.now().plusMillis(accessTokenExpirationMs))
                .sign(algorithm);
    }

    public String generateRefreshToken(String email, UUID userId) {
        Algorithm algorithm = Algorithm.HMAC256(secret);
        return JWT.create()
                .withSubject(email)
                .withClaim(CLAIM_USER_ID, userId.toString())
                .withIssuedAt(Instant.now())
                .withExpiresAt(Instant.now().plusMillis(refreshTokenExpirationMs))
                .sign(algorithm);
    }

    public boolean validateToken(String token) {
        try {
            Algorithm algorithm = Algorithm.HMAC256(secret);
            JWTVerifier verifier = JWT.require(algorithm).build();
            verifier.verify(token);
            return true;
        } catch (JWTVerificationException exception) {
            return false;
        }
    }

    public String getEmailFromToken(String token) {
        Algorithm algorithm = Algorithm.HMAC256(secret);
        JWTVerifier verifier = JWT.require(algorithm).build();
        DecodedJWT decodedJWT = verifier.verify(token);
        return decodedJWT.getSubject();
    }

    public UUID getUserIdFromToken(String token) {
        Algorithm algorithm = Algorithm.HMAC256(secret);
        JWTVerifier verifier = JWT.require(algorithm).build();
        DecodedJWT decodedJWT = verifier.verify(token);
        return UUID.fromString(decodedJWT.getClaim(CLAIM_USER_ID).asString());
    }

    public long getAccessTokenExpirationInSeconds() {
        return accessTokenExpirationMs / 1000;
    }
}
