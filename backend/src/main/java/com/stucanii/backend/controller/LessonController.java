package com.stucanii.backend.controller;

import com.stucanii.backend.dto.dtos.LessonDetailsDTO;
import com.stucanii.backend.dto.dtos.LessonSummaryDTO;
import com.stucanii.backend.dto.requests.LessonRequest;
import com.stucanii.backend.service.LessonService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/lessons")
@RequiredArgsConstructor
public class LessonController {

    private final LessonService lessonService;

    @PostMapping
    public ResponseEntity<LessonDetailsDTO> createLesson(
            @RequestBody LessonRequest request
    ) {
        return ResponseEntity.ok(lessonService.createLesson(request));
    }

    @GetMapping
    public ResponseEntity<List<LessonSummaryDTO>> getAllLessons() {
        return ResponseEntity.ok(lessonService.getAllLessons());
    }

    @GetMapping("/{lessonId}")
    public ResponseEntity<LessonDetailsDTO> getLessonById(
            @PathVariable Long lessonId
    ) {
        return ResponseEntity.ok(lessonService.getLessonById(lessonId));
    }
}