package com.stucanii.backend.controller;

import com.stucanii.backend.dto.requests.AuthRequest;
import com.stucanii.backend.dto.responses.AuthResponse;
import com.stucanii.backend.dto.dtos.UserDTO;
import com.stucanii.backend.service.JwtService;
import com.stucanii.backend.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:8100")
public class AuthController {

    private final UserService userService;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    @PostMapping("/register")
    public ResponseEntity<UserDTO> createUser(@RequestBody UserDTO userDTO){
        Long id = userService.save(userDTO);
        UserDTO newUser = userService.getUserById(id);
        return ResponseEntity.ok(newUser);
    }

    @PostMapping("/login")
    public AuthResponse authenticateAndGenerateToken(@RequestBody AuthRequest authRequest){

        Authentication authentication= authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(authRequest.getUsername(), authRequest.getPassword())
        );
        if(authentication.isAuthenticated()){
            String accessToken = jwtService.generateToken(authRequest.getUsername());

            return new AuthResponse(
                    accessToken,
                    "",
                    "Bearer"
            );
        }else{
            throw new UsernameNotFoundException("Invalid username or password");
        }
    }

}