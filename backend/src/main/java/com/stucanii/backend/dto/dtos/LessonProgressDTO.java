package com.stucanii.backend.dto.dtos;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LessonProgressDTO {
    private Long lessonId;
    private String lessonTitle;
    private int score;
    private boolean completed;
}