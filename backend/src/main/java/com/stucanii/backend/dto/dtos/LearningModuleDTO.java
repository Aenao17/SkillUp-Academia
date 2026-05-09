package com.stucanii.backend.dto.dtos;

import lombok.*;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LearningModuleDTO {
    private Long id;
    private String title;
    private String description;
    private List<LessonSummaryDTO> lessons;
    private boolean completed;
}
