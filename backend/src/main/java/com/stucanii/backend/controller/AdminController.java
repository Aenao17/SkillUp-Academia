package com.stucanii.backend.controller;

import com.stucanii.backend.dto.dtos.LearningModuleDTO;
import com.stucanii.backend.dto.dtos.LessonDetailsDTO;
import com.stucanii.backend.dto.dtos.UserDTO;
import com.stucanii.backend.dto.requests.LearningModuleRequest;
import com.stucanii.backend.dto.requests.LessonRequest;
import com.stucanii.backend.dto.requests.ResetPasswordRequest;
import com.stucanii.backend.dto.requests.UpdateUserRoleRequest;
import com.stucanii.backend.service.LearningModuleService;
import com.stucanii.backend.service.LessonService;
import com.stucanii.backend.service.UserAdminService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import com.stucanii.backend.dto.requests.CreateUserRequest;
import com.stucanii.backend.dto.requests.UpdateUserRequest;
import com.stucanii.backend.dto.requests.CreateUserRequest;
import com.stucanii.backend.dto.requests.UpdateUserRequest;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    private final UserAdminService userAdminService;
    private final LessonService lessonService;
    private final LearningModuleService moduleService;

    //USERS

    @GetMapping("/users")
    public ResponseEntity<List<UserDTO>> getAllUsers() {
        return ResponseEntity.ok(userAdminService.getAllUsers());
    }


    @PatchMapping("/users/{userId}/role")
    public ResponseEntity<UserDTO> updateUserRole(
            @PathVariable Long userId,
            @RequestBody UpdateUserRoleRequest request
    ) {
        return ResponseEntity.ok(
                userAdminService.updateUserRole(userId, request.getRole())
        );
    }

    @PatchMapping("/users/{userId}/password")
    public ResponseEntity<Void> resetUserPassword(
            @PathVariable Long userId,
            @RequestBody ResetPasswordRequest request
    ) {
        userAdminService.resetUserPassword(userId, request.getNewPassword());
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/users")
    public ResponseEntity<UserDTO> createUser(
            @RequestBody CreateUserRequest request
    ) {
        return ResponseEntity.ok(
                userAdminService.createUser(
                        request.getUsername(),
                        request.getPassword(),
                        request.getRole()
                )
        );
    }

    @PutMapping("/users/{userId}")
    public ResponseEntity<UserDTO> updateUser(
            @PathVariable Long userId,
            @RequestBody UpdateUserRequest request
    ) {
        return ResponseEntity.ok(
                userAdminService.updateUser(
                        userId,
                        request.getUsername(),
                        request.getRole()
                )
        );
    }

    @DeleteMapping("/users/{userId}")
    public ResponseEntity<Void> deleteUser(
            @PathVariable Long userId
    ) {
        userAdminService.deleteUser(userId);
        return ResponseEntity.noContent().build();
    }

    //LESSONS

    @PostMapping("/lessons")
    public ResponseEntity<LessonDetailsDTO> createLesson(
            @RequestBody LessonRequest request
    ) {
        return ResponseEntity.ok(
                lessonService.createLesson(request)
        );
    }
    @PutMapping("/lessons/{lessonId}")
    public ResponseEntity<LessonDetailsDTO> updateLesson(
            @PathVariable Long lessonId,
            @RequestBody LessonRequest request
    ) {
        return ResponseEntity.ok(
                lessonService.updateLesson(lessonId, request)
        );
    }

    @DeleteMapping("/lessons/{lessonId}")
    public ResponseEntity<Void> deleteLesson(
            @PathVariable Long lessonId
    ) {
        lessonService.deleteLesson(lessonId);

        return ResponseEntity.noContent().build();
    }

    //MODULES
    @PostMapping("/modules")
    public ResponseEntity<LearningModuleDTO> createModule(
            @RequestBody LearningModuleRequest request
    ) {
        return ResponseEntity.ok(
                moduleService.createModule(request)
        );
    }

    @PutMapping("/modules/{moduleId}")
    public ResponseEntity<LearningModuleDTO> updateModule(
            @PathVariable Long moduleId,
            @RequestBody LearningModuleRequest request
    ) {
        return ResponseEntity.ok(
                moduleService.updateModule(moduleId, request)
        );
    }

    @DeleteMapping("/modules/{moduleId}")
    public ResponseEntity<Void> deleteModule(
            @PathVariable Long moduleId
    ) {
        moduleService.deleteModule(moduleId);

        return ResponseEntity.noContent().build();
    }
}