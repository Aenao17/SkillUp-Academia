package com.stucanii.backend.controller;

import com.stucanii.backend.dto.dtos.LessonProgressDTO;
import com.stucanii.backend.dto.requests.SubmitLessonTestRequest;
import com.stucanii.backend.model.User;
import com.stucanii.backend.service.LessonProgressService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/progress")
@RequiredArgsConstructor
public class LessonProgressController {

    private final LessonProgressService progressService;

    @PostMapping("/submit-test")
    public ResponseEntity<LessonProgressDTO> submitLessonTest(
            @AuthenticationPrincipal UserDetails user,
            @RequestBody SubmitLessonTestRequest request
    ) {
        return ResponseEntity.ok(
                progressService.submitLessonTest(user, request)
        );
    }

    @GetMapping
    public ResponseEntity<List<LessonProgressDTO>> getUserProgress(
            @AuthenticationPrincipal UserDetails user
    ) {
        return ResponseEntity.ok(progressService.getUserProgress(user));
    }
}