package com.stucanii.backend.dto.mappers;

import com.stucanii.backend.dto.dtos.LearningModuleDTO;
import com.stucanii.backend.dto.dtos.LessonSummaryDTO;
import com.stucanii.backend.dto.requests.LearningModuleRequest;
import com.stucanii.backend.model.LearningModule;
import com.stucanii.backend.model.Lesson;
import com.stucanii.backend.model.LessonProgress;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@RequiredArgsConstructor
public class LearningModuleMapper {

    private final LessonMapper lessonMapper;

    public LearningModuleDTO toDto(
            LearningModule module,
            List<LessonProgress> progressList
    ) {
        List<LessonSummaryDTO> lessonDtos = module.getLessons()
                .stream()
                .map(lesson -> {
                    LessonProgress progress = progressList.stream()
                            .filter(p -> p.getLesson().getId().equals(lesson.getId()))
                            .findFirst()
                            .orElse(null);

                    return lessonMapper.toSummaryDto(lesson, progress);
                })
                .toList();

        boolean completed = !lessonDtos.isEmpty()
                && lessonDtos.stream().allMatch(LessonSummaryDTO::isCompleted);

        return LearningModuleDTO.builder()
                .id(module.getId())
                .title(module.getTitle())
                .description(module.getDescription())
                .lessons(lessonDtos)
                .completed(completed)
                .build();
    }

    public LearningModule toEntity(
            LearningModuleRequest request,
            List<Lesson> lessons
    ) {
        return LearningModule.builder()
                .title(request.getTitle())
                .description(request.getDescription())
                .lessons(lessons)
                .build();
    }
}