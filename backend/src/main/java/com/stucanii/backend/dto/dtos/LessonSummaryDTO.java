package com.stucanii.backend.dto.dtos;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LessonSummaryDTO {
    private Long id;
    private String title;
    private String description;
    private boolean completed;
    private Integer score;
}