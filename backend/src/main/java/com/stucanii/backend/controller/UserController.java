package com.stucanii.backend.controller;

import com.stucanii.backend.dto.dtos.LearningModuleDTO;
import com.stucanii.backend.dto.dtos.LessonProgressDTO;
import com.stucanii.backend.dto.dtos.UserDTO;
import com.stucanii.backend.service.LearningModuleService;
import com.stucanii.backend.service.LessonProgressService;
import com.stucanii.backend.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/user")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;
    private final LessonProgressService progressService;
    private final LearningModuleService moduleService;

    @GetMapping("/me")
    public ResponseEntity<UserDTO> getCurrentUser(
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        return ResponseEntity.ok(
                userService.getCurrentUser(userDetails.getUsername())
        );
    }

    @GetMapping("/progress")
    public ResponseEntity<List<LessonProgressDTO>> getMyProgress(
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        return ResponseEntity.ok(
                progressService.getUserProgress(userDetails)
        );
    }

    @GetMapping("/modules")
    public ResponseEntity<List<LearningModuleDTO>> getMyModules(
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        return ResponseEntity.ok(
                moduleService.getAllModules(userDetails)
        );
    }

    @DeleteMapping("/me")
    public ResponseEntity<Void> deleteCurrentUser(
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        UserDTO dto = userService.getCurrentUser(userDetails.getUsername());
        userService.delete(dto.userId());
        return ResponseEntity.noContent().build();
    }
}
