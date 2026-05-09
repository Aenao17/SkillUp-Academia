package com.stucanii.backend.dto.dtos;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LessonTestDTO {
    private Long id;
    private String title;
    private int passingScore;
}