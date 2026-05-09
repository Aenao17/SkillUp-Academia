package com.stucanii.backend.dto.dtos;

import com.stucanii.backend.model.Role;
import lombok.Builder;

@Builder
public record UserDTO (
        Long userId,
        String username,
        String password,
        Role role
){
}