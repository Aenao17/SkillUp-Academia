package com.stucanii.backend.service;

import com.stucanii.backend.dto.dtos.LessonDetailsDTO;
import com.stucanii.backend.dto.dtos.LessonSummaryDTO;
import com.stucanii.backend.dto.dtos.LessonTestDTO;
import com.stucanii.backend.dto.mappers.LessonMapper;
import com.stucanii.backend.dto.requests.LessonRequest;
import com.stucanii.backend.model.*;
import com.stucanii.backend.repository.LessonRepository;
import com.stucanii.backend.repository.LessonTestRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class LessonService {

    private final LessonRepository lessonRepository;
    private final LessonMapper lessonMapper;
    private final LessonTestRepository testRepository;

    public LessonDetailsDTO createLesson(LessonRequest request) {
        Lesson lesson = Lesson.builder()
                .title(request.getTitle())
                .description(request.getDescription())
                .content(request.getContent())
                .build();

        Lesson savedLesson = lessonRepository.save(lesson);

        LessonTest test = LessonTest.builder()
                .title(
                        request.getTestTitle() != null
                                ? request.getTestTitle()
                                : savedLesson.getTitle() + " Test"
                )
                .passingScore(
                        request.getPassingScore() != null
                                ? request.getPassingScore()
                                : 75
                )
                .lesson(savedLesson)
                .build();

        if (request.getQuestions() != null) {
            request.getQuestions().forEach(questionRequest -> {
                TestQuestion question = TestQuestion.builder()
                        .questionText(questionRequest.getQuestionText())
                        .optionA(questionRequest.getOptionA())
                        .optionB(questionRequest.getOptionB())
                        .optionC(questionRequest.getOptionC())
                        .optionD(questionRequest.getOptionD())
                        .correctOption(questionRequest.getCorrectOption())
                        .test(test)
                        .build();

                test.getQuestions().add(question);
            });
        }

        testRepository.save(test);

        savedLesson.setTest(test);

        LessonProgress lessonProgress = new LessonProgress();

        return lessonMapper.toDetailsDto(savedLesson, lessonProgress);
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

    public LessonDetailsDTO updateLesson(Long lessonId, LessonRequest request) {
        Lesson lesson = lessonRepository.findById(lessonId)
                .orElseThrow(() -> new RuntimeException("Lesson not found"));

        lesson.setTitle(request.getTitle());
        lesson.setDescription(request.getDescription());
        lesson.setContent(request.getContent());

        Lesson savedLesson = lessonRepository.save(lesson);

        LessonTest test = savedLesson.getTest();

        if (test != null) {
            test.getQuestions().clear();

            if (request.getQuestions() != null) {
                request.getQuestions().forEach(questionRequest -> {
                    TestQuestion question = TestQuestion.builder()
                            .questionText(questionRequest.getQuestionText())
                            .optionA(questionRequest.getOptionA())
                            .optionB(questionRequest.getOptionB())
                            .optionC(questionRequest.getOptionC())
                            .optionD(questionRequest.getOptionD())
                            .correctOption(questionRequest.getCorrectOption())
                            .test(test)
                            .build();

                    test.getQuestions().add(question);
                });
            }
            test.setTitle(request.getTestTitle());

            if (request.getPassingScore() != null) {
                test.setPassingScore(request.getPassingScore());
            }

            testRepository.save(test);
        }

        return lessonMapper.toDetailsDto(savedLesson, null);
    }

    public void deleteLesson(Long lessonId) {
        Lesson lesson = lessonRepository.findById(lessonId)
                .orElseThrow(() -> new RuntimeException("Lesson not found"));

        lessonRepository.delete(lesson);
    }
}
