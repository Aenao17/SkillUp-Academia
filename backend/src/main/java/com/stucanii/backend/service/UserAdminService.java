package com.stucanii.backend.service;

import com.stucanii.backend.dto.dtos.UserDTO;
import com.stucanii.backend.model.User;
import com.stucanii.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UserAdminService {

    private final UserRepository userRepository;

    public List<UserDTO> getAllUsers() {
        return userRepository.findAll()
                .stream()
                .map(this::toDto)
                .toList();
    }

    private UserDTO toDto(User user) {
        return UserDTO.builder()
                .userId(user.getId())
                .username(user.getUsername())
                .role(user.getRole())
                .build();
    }
}