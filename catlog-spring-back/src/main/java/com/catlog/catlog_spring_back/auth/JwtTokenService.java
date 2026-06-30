package com.catlog.catlog_spring_back.auth;

import java.nio.charset.StandardCharsets;
import java.time.Instant;

import javax.crypto.spec.SecretKeySpec;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.oauth2.jose.jws.MacAlgorithm;
import org.springframework.security.oauth2.jwt.JwsHeader;
import org.springframework.security.oauth2.jwt.JwtClaimsSet;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.jwt.JwtEncoder;
import org.springframework.security.oauth2.jwt.JwtEncoderParameters;
import org.springframework.security.oauth2.jwt.NimbusJwtDecoder;
import org.springframework.security.oauth2.jwt.NimbusJwtEncoder;
import org.springframework.stereotype.Service;

import com.catlog.catlog_spring_back.user.User;
import com.nimbusds.jose.jwk.source.ImmutableSecret;

@Service
public class JwtTokenService {

    private final JwtEncoder jwtEncoder;
    private final JwtEncoder refreshJwtEncoder;
    private final JwtDecoder refreshJwtDecoder;
    private final long accessTokenValiditySeconds;
    private final long refreshTokenValiditySeconds;

    public JwtTokenService(
            JwtEncoder jwtEncoder,
            @Value("${app.jwt.refresh-secret}") String refreshSecret,
            @Value("${app.jwt.access-token-validity-seconds}") long accessTokenValiditySeconds,
            @Value("${app.jwt.refresh-token-validity-seconds}") long refreshTokenValiditySeconds) {
        this.jwtEncoder = jwtEncoder;
        this.refreshJwtEncoder = new NimbusJwtEncoder(new ImmutableSecret<>(hmacKey(refreshSecret)));
        this.refreshJwtDecoder = NimbusJwtDecoder.withSecretKey(hmacKey(refreshSecret))
                .macAlgorithm(MacAlgorithm.HS256)
                .build();
        this.accessTokenValiditySeconds = accessTokenValiditySeconds;
        this.refreshTokenValiditySeconds = refreshTokenValiditySeconds;
    }

    public String issueAccessToken(User user) {
        return issueToken(user, accessTokenValiditySeconds, "access");
    }

    public String issueRefreshToken(User user) {
        return issueToken(refreshJwtEncoder, user, refreshTokenValiditySeconds, "refresh");
    }

    public void verifyRefreshToken(String refreshToken) {
        refreshJwtDecoder.decode(refreshToken);
    }

    private String issueToken(User user, long validitySeconds, String tokenType) {
        return issueToken(jwtEncoder, user, validitySeconds, tokenType);
    }

    private String issueToken(JwtEncoder encoder, User user, long validitySeconds, String tokenType) {
        Instant now = Instant.now();
        JwtClaimsSet claims = JwtClaimsSet.builder()
                .issuer("catlog-spring-back")
                .issuedAt(now)
                .expiresAt(now.plusSeconds(validitySeconds))
                .subject(user.getId().toString())
                .claim("email", user.getEmail())
                .claim("userId", user.getId().toString())
                .claim("tokenType", tokenType)
                .build();

        JwsHeader headers = JwsHeader.with(MacAlgorithm.HS256).build();
        return encoder.encode(JwtEncoderParameters.from(headers, claims)).getTokenValue();
    }

    private SecretKeySpec hmacKey(String secret) {
        byte[] bytes = secret.getBytes(StandardCharsets.UTF_8);
        if (bytes.length < 32) {
            throw new IllegalStateException("JWT secret은 HS256 기준 32바이트 이상이어야 합니다.");
        }
        return new SecretKeySpec(bytes, "HmacSHA256");
    }
}
