package com.stucanii.backend.dto.dtos;

import lombok.Data;

@Data
public class UserRegistrationDTO {
    private String username;
    private String password;
    private String phoneNumber;
}