package com.catlog.catlog_spring_back.auth;

import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import com.catlog.catlog_spring_back.auth.dto.SignupRequest;
import com.catlog.catlog_spring_back.auth.dto.SignupResponse;
import com.catlog.catlog_spring_back.user.User;
import com.catlog.catlog_spring_back.user.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Transactional
    public SignupResponse signup(SignupRequest req) {
        if (userRepository.existsByEmail(req.email())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "이미 사용중인 이메일입니다.");
        }

        User user = new User(
                req.name(),
                req.email(),
                passwordEncoder.encode(req.password()));

        User saved = userRepository.save(user);

        return new SignupResponse(1, "유저 생성 성공", saved.getId().toString());
    }
}
