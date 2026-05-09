package com.stucanii.backend.controller;

import com.stucanii.backend.dto.dtos.LearningModuleDTO;
import com.stucanii.backend.dto.requests.LearningModuleRequest;
import com.stucanii.backend.model.User;
import com.stucanii.backend.service.LearningModuleService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/modules")
@RequiredArgsConstructor
public class LearningModuleController {

    private final LearningModuleService moduleService;

    @PostMapping
    public ResponseEntity<LearningModuleDTO> createModule(
            @RequestBody LearningModuleRequest request
    ) {
        return ResponseEntity.ok(moduleService.createModule(request));
    }

    @GetMapping
    public ResponseEntity<List<LearningModuleDTO>> getAllModules(
            @AuthenticationPrincipal UserDetails user
    ) {
        return ResponseEntity.ok(moduleService.getAllModules(user));
    }

    @GetMapping("/{moduleId}")
    public ResponseEntity<LearningModuleDTO> getModuleById(
            @PathVariable Long moduleId,
            @AuthenticationPrincipal UserDetails user
    ) {
        return ResponseEntity.ok(moduleService.getModuleById(moduleId, user));
    }
}