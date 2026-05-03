package com.stucanii.backend.service;

import com.stucanii.backend.dto.UserRegistrationDTO;
import com.stucanii.backend.model.Role;
import com.stucanii.backend.model.User;
import com.stucanii.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Objects;

@Service
@RequiredArgsConstructor
public class AuthService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;


    public void registerUser(UserRegistrationDTO registrationDTO){
        if (userRepository.findByUsername(registrationDTO.getUsername()).isPresent())
            throw new RuntimeException("Username already exists");
        User user= User.builder()
                .username(registrationDTO.getUsername())
                .password(Objects.requireNonNull(passwordEncoder.encode(registrationDTO.getPassword())))
                .role(Role.USER)
                .build();
        userRepository.save(user);
    }
}