package com.stucanii.backend.service;

import com.stucanii.backend.dto.dtos.UserDTO;
import com.stucanii.backend.model.Role;
import com.stucanii.backend.model.User;
import com.stucanii.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UserAdminService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public List<UserDTO> getAllUsers() {
        return userRepository.findAll()
                .stream()
                .map(this::toDto)
                .toList();
    }

    public UserDTO updateUserRole(Long userId, String role) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Utilizatorul nu există."));

        Role newRole = Role.valueOf(role.toUpperCase());

        user.setRole(newRole);

        User savedUser = userRepository.save(user);

        return toDto(savedUser);
    }

    public void resetUserPassword(Long userId, String newPassword) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Utilizatorul nu există."));

        user.setPassword(passwordEncoder.encode(newPassword));

        userRepository.save(user);
    }

    private UserDTO toDto(User user) {
        return UserDTO.builder()
                .userId(user.getId())
                .username(user.getUsername())
                .role(user.getRole())
                .build();
    }
}