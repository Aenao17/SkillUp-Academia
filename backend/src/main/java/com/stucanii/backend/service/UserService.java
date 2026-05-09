package com.stucanii.backend.service;

import com.stucanii.backend.dto.dtos.UserDTO;
import com.stucanii.backend.dto.mappers.UserMapper;
import com.stucanii.backend.model.Role;
import com.stucanii.backend.model.User;
import com.stucanii.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.NoSuchElementException;
import java.util.Objects;

@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepository userRepository;
    private final static Logger LOGGER = LoggerFactory.getLogger(UserService.class.getName());
    private final PasswordEncoder passwordEncoder;

    public Long save(UserDTO userDTO){
        User user = UserMapper.mapUserDTOToUser(userDTO);
        user.setPassword(Objects.requireNonNull(passwordEncoder.encode(user.getPassword())));
        user.setRole(Role.USER);
        User userSaved = userRepository.save(user);
        LOGGER.debug("user with id {} was inserted in db", user.getId());
        return userSaved.getId();
    }

    public UserDTO update(Long id, UserDTO userDTO) {
        User existingUser = userRepository.findById(id).orElseThrow(() -> {
            LOGGER.error("user with id {} was not found", id);
            return new NoSuchElementException("user not found");
        });

        if (userDTO.username() != null) {
            existingUser.setUsername(userDTO.username());
        }

        if (userDTO.password() != null && !userDTO.password().isBlank()) {
            existingUser.setPassword(Objects.requireNonNull(passwordEncoder.encode(userDTO.password())));
        }

        if (userDTO.role() != null) {
            existingUser.setRole(userDTO.role());
        }

        User updatedUser = userRepository.save(existingUser);

        LOGGER.info("user with id {} was updated successfully", id);
        return UserMapper.mapUserToUserDTO(updatedUser);
    }

    public void delete(Long id) {
        User user = userRepository.findById(id).orElseThrow(() -> {
            LOGGER.error("user with id {} was not found", id);
            return new NoSuchElementException("user not found");
        });
        userRepository.delete(user);
        LOGGER.info("user with id {} was deleted successfully", id);
    }

    public List<UserDTO> findAll(){
        List<User> userList = userRepository.findAll();
        LOGGER.info("found all users in db");
        return UserMapper.mapUserListToUserDTOList(userList);
    }

    public UserDTO getUserById(Long id){
        User user = userRepository.findById(id).orElse(null);
        if (user == null){
            LOGGER.error("user with id {} was not found", id);
            throw new NoSuchElementException(User.class.getSimpleName() + " with id " + id + " was not found");
        }
        LOGGER.info("found user with id {} ", id);
        return UserMapper.mapUserToUserDTO(user);
    }

    public User getUserByUsername(String username){
        User user = userRepository.findByUsername(username).orElse(null);
        if (user == null){
            LOGGER.error("user with username {} was not found", username);
            throw new NoSuchElementException(User.class.getSimpleName() + " with username " + username + " was not found");
        }
        LOGGER.info("found user with username {} ", username);
        return user;
    }

    public UserDTO getCurrentUser(String username) {
        User user = userRepository.findByUsername(username).orElse(null);
        if (user == null){
            LOGGER.error("user with username {} was not found", username);
            throw new NoSuchElementException(User.class.getSimpleName() + " with username " + username + " was not found");
        }
        LOGGER.info("found user with username {} ", username);
        return UserMapper.mapUserToUserDTO(user);
    }
}
