package com.stucanii.backend.service;

import com.stucanii.backend.dto.LearningModuleDTO;
import com.stucanii.backend.dto.LessonDTO;
import com.stucanii.backend.model.LearningModule;
import com.stucanii.backend.model.Lesson;
import com.stucanii.backend.repository.LearningModuleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class LearningModuleService {

    private final LearningModuleRepository moduleRepository;

    public List<LearningModuleDTO> getAllModules() {
        return moduleRepository.findAll()
                .stream()
                .map(this::toDto)
                .toList();
    }

    private LearningModuleDTO toDto(LearningModule module) {
        return new LearningModuleDTO(
                module.getModuleId(),
                module.getTitle(),
                module.getDescription(),
                module.getLessons()
                        .stream()
                        .map(this::toLessonDto)
                        .toList()
        );
    }

    private LessonDTO toLessonDto(Lesson lesson) {
        return new LessonDTO(
                lesson.getLessonId(),
                lesson.getTitle(),
                lesson.getDescription()
        );
    }
}