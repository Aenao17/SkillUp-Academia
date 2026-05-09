package com.stucanii.backend.dto.mappers;

import com.stucanii.backend.dto.dtos.LessonProgressDTO;
import com.stucanii.backend.model.LessonProgress;
import org.springframework.stereotype.Component;

@Component
public class LessonProgressMapper {

    public LessonProgressDTO toDto(LessonProgress progress) {
        return LessonProgressDTO.builder()
                .lessonId(progress.getLesson().getId())
                .lessonTitle(progress.getLesson().getTitle())
                .score(progress.getScore())
                .completed(progress.isCompleted())
                .build();
    }
}
