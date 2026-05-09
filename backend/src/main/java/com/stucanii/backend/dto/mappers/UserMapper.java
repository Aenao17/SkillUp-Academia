package com.stucanii.backend.dto.mappers;

import com.stucanii.backend.dto.dtos.UserDTO;
import com.stucanii.backend.model.User;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class UserMapper {

    public static UserDTO mapUserToUserDTO(User user){
        return UserDTO.builder().
                userId(user.getId()).
                username(user.getUsername()).
                password(user.getPassword()).
                role(user.getRole()).
                build();
    }

    public static User mapUserDTOToUser(UserDTO userDTO){
        return User.builder().
                username(userDTO.username()).
                password(userDTO.password()).
                role(userDTO.role()).
                build();
    }

    public static List<UserDTO> mapUserListToUserDTOList(List<User> userList){
        return userList.stream().map(UserMapper::mapUserToUserDTO).toList();
    }
}