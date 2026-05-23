package com.stucanii.backend.dto.dtos;

import lombok.*;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LessonTestDTO {
    private Long id;
    private String title;
    private int passingScore;
    private List<TestQuestionDTO> questions;
}