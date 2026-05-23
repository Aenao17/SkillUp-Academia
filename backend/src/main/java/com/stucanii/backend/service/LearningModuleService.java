package com.stucanii.backend.service;

import com.stucanii.backend.dto.dtos.LearningModuleDTO;
import com.stucanii.backend.dto.mappers.LearningModuleMapper;
import com.stucanii.backend.dto.requests.LearningModuleRequest;
import com.stucanii.backend.model.LearningModule;
import com.stucanii.backend.model.Lesson;
import com.stucanii.backend.model.LessonProgress;
import com.stucanii.backend.model.User;
import com.stucanii.backend.repository.LearningModuleRepository;
import com.stucanii.backend.repository.LessonProgressRepository;
import com.stucanii.backend.repository.LessonRepository;
import com.stucanii.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class LearningModuleService {

    private final LearningModuleRepository moduleRepository;
    private final LessonRepository lessonRepository;
    private final LessonProgressRepository progressRepository;
    private final LearningModuleMapper moduleMapper;
    private final UserRepository userRepository;

    public LearningModuleDTO createModule(LearningModuleRequest request) {
        List<Lesson> lessons = lessonRepository.findAllById(request.getLessonIds());

        LearningModule module = moduleMapper.toEntity(request, lessons);
        LearningModule savedModule = moduleRepository.save(module);

        return moduleMapper.toDto(savedModule, List.of());
    }

    public List<LearningModuleDTO> getAllModules(UserDetails user) {
        User user1  = userRepository.findByUsername(user.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));

        List<LessonProgress> progressList = progressRepository.findByUser(user1);

        return moduleRepository.findAll()
                .stream()
                .map(module -> moduleMapper.toDto(module, progressList))
                .toList();
    }

    public LearningModuleDTO getModuleById(Long moduleId, UserDetails user) {
        LearningModule module = moduleRepository.findById(moduleId)
                .orElseThrow(() -> new RuntimeException("Module not found"));

        Optional<User> user1  = userRepository.findByUsername(user.getUsername());

        List<LessonProgress> progressList =
                progressRepository.findByUserAndLessonIn(user1.orElse(null), module.getLessons());

        return moduleMapper.toDto(module, progressList);
    }

    public LearningModuleDTO updateModule(
            Long moduleId,
            LearningModuleRequest request
    ) {
        LearningModule module = moduleRepository.findById(moduleId)
                .orElseThrow(() -> new RuntimeException("Module not found"));

        List<Lesson> lessons =
                lessonRepository.findAllById(request.getLessonIds());

        module.setTitle(request.getTitle());
        module.setDescription(request.getDescription());
        module.setLessons(lessons);

        LearningModule savedModule = moduleRepository.save(module);

        return moduleMapper.toDto(savedModule, List.of());
    }

    public void deleteModule(Long moduleId) {
        LearningModule module = moduleRepository.findById(moduleId)
                .orElseThrow(() -> new RuntimeException("Module not found"));

        moduleRepository.delete(module);
    }
}