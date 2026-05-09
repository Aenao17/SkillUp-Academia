package com.stucanii.backend.dto.dtos;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LessonDetailsDTO {
    private Long id;
    private String title;
    private String description;
    private String content;
    private LessonTestDTO test;
    private boolean completed;
    private Integer score;
}