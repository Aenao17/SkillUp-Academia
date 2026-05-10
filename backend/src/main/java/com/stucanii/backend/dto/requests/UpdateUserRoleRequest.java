package com.stucanii.backend.dto.requests;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UpdateUserRoleRequest {
    private String role;
}