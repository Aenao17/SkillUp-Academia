package com.stucanii.backend.controller;

import com.stucanii.backend.dto.dtos.LearningModuleDTO;
import com.stucanii.backend.dto.dtos.LessonDetailsDTO;
import com.stucanii.backend.dto.dtos.UserDTO;
import com.stucanii.backend.dto.requests.LearningModuleRequest;
import com.stucanii.backend.dto.requests.LessonRequest;
import com.stucanii.backend.service.LearningModuleService;
import com.stucanii.backend.service.LessonService;
import com.stucanii.backend.service.UserAdminService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    private final UserAdminService userAdminService;
    private final LessonService lessonService;
    private final LearningModuleService moduleService;

    @GetMapping("/users")
    public ResponseEntity<List<UserDTO>> getAllUsers() {
        return ResponseEntity.ok(userAdminService.getAllUsers());
    }

    @PostMapping("/lessons")
    public ResponseEntity<LessonDetailsDTO> createLesson(
            @RequestBody LessonRequest request
    ) {
        return ResponseEntity.ok(
                lessonService.createLesson(request)
        );
    }

    @PostMapping("/modules")
    public ResponseEntity<LearningModuleDTO> createModule(
            @RequestBody LearningModuleRequest request
    ) {
        return ResponseEntity.ok(
                moduleService.createModule(request)
        );
    }
}