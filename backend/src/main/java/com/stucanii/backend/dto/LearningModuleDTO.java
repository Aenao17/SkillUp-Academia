package com.stucanii.backend.dto;

import java.util.List;

public record LearningModuleDTO(
        Long id,
        String title,
        String description,
        List<LessonDTO> lessons
) {}
