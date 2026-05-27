package com.stucanii.backend.service;

import com.stucanii.backend.dto.dtos.LessonProgressDTO;
import com.stucanii.backend.dto.mappers.LessonProgressMapper;
import com.stucanii.backend.dto.requests.SubmitLessonTestRequest;
import com.stucanii.backend.model.Lesson;
import com.stucanii.backend.model.LessonProgress;
import com.stucanii.backend.model.User;
import com.stucanii.backend.repository.LessonProgressRepository;
import com.stucanii.backend.repository.LessonRepository;
import com.stucanii.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class LessonProgressService {

    private final LessonProgressRepository progressRepository;
    private final LessonRepository lessonRepository;
    private final LessonProgressMapper progressMapper;
    private final UserRepository userRepository;

    public LessonProgressDTO submitLessonTest(
            UserDetails user,
            SubmitLessonTestRequest request
    ) {
        Lesson lesson = lessonRepository.findById(request.getLessonId())
                .orElseThrow(() -> new RuntimeException("Lesson not found"));

        User user1  = userRepository.findByUsername(user.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));

        LessonProgress progress = progressRepository
                .findByUserAndLesson(user1, lesson)
                .orElseGet(() -> LessonProgress.builder()
                        .user(user1)
                        .lesson(lesson)
                        .build());

        progress.updateScore(request.getScore());

        LessonProgress savedProgress = progressRepository.save(progress);

        

        return progressMapper.toDto(savedProgress);
    }

    public List<LessonProgressDTO> getUserProgress(UserDetails user) {
        User user1  = userRepository.findByUsername(user.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));
        return progressRepository.findByUser(user1)
                .stream()
                .map(progressMapper::toDto)
                .toList();
    }
}