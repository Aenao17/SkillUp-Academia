package com.stucanii.backend.service;

import com.stucanii.backend.dto.dtos.LessonDetailsDTO;
import com.stucanii.backend.dto.dtos.LessonSummaryDTO;
import com.stucanii.backend.dto.dtos.LessonTestDTO;
import com.stucanii.backend.dto.mappers.LessonMapper;
import com.stucanii.backend.dto.requests.LessonRequest;
import com.stucanii.backend.model.Lesson;
import com.stucanii.backend.model.LessonProgress;
import com.stucanii.backend.model.LessonTest;
import com.stucanii.backend.model.User;
import com.stucanii.backend.repository.LessonRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class LessonService {

    private final LessonRepository lessonRepository;
    private final LessonMapper lessonMapper;

    public LessonDetailsDTO createLesson(LessonRequest request) {
        Lesson lesson = lessonMapper.toEntity(request);
        Lesson savedLesson = lessonRepository.save(lesson);

        return lessonMapper.toDetailsDto(savedLesson, null);
    }

    public LessonDetailsDTO getLessonById(Long lessonId) {
        Lesson lesson = lessonRepository.findById(lessonId)
                .orElseThrow(() -> new RuntimeException("Lesson not found"));

        return lessonMapper.toDetailsDto(lesson, null);
    }

    public List<LessonSummaryDTO> getAllLessons() {
        return lessonRepository.findAll()
                .stream()
                .map(lesson -> lessonMapper.toSummaryDto(lesson, null))
                .toList();
    }
}
