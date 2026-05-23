package com.stucanii.backend.dto.mappers;

import com.stucanii.backend.dto.dtos.LessonDetailsDTO;
import com.stucanii.backend.dto.dtos.LessonSummaryDTO;
import com.stucanii.backend.dto.dtos.LessonTestDTO;
import com.stucanii.backend.dto.dtos.TestQuestionDTO;
import com.stucanii.backend.dto.requests.LessonRequest;
import com.stucanii.backend.model.Lesson;
import com.stucanii.backend.model.LessonProgress;
import com.stucanii.backend.model.LessonTest;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class LessonMapper {

    public LessonDetailsDTO toDetailsDto(Lesson lesson, LessonProgress progress) {
        return LessonDetailsDTO.builder()
                .id(lesson.getId())
                .title(lesson.getTitle())
                .description(lesson.getDescription())
                .content(lesson.getContent())
                .test(toTestDto(lesson.getTest()))
                .score(progress != null ? progress.getScore() : null)
                .completed(progress != null && progress.isCompleted())
                .build();
    }

    public LessonSummaryDTO toSummaryDto(Lesson lesson, LessonProgress progress) {
        return LessonSummaryDTO.builder()
                .id(lesson.getId())
                .title(lesson.getTitle())
                .description(lesson.getDescription())
                .score(progress != null ? progress.getScore() : null)
                .completed(progress != null && progress.isCompleted())
                .build();
    }

    public LessonTestDTO toTestDto(LessonTest test) {
        if (test == null) {
            return null;
        }

        return LessonTestDTO.builder()
                .id(test.getId())
                .title(test.getTitle())
                .passingScore(test.getPassingScore())
                .questions(
                        test.getQuestions() != null
                                ? test.getQuestions()
                                .stream()
                                .map(question -> TestQuestionDTO.builder()
                                        .id(question.getId())
                                        .questionText(question.getQuestionText())
                                        .optionA(question.getOptionA())
                                        .optionB(question.getOptionB())
                                        .optionC(question.getOptionC())
                                        .optionD(question.getOptionD())
                                        .correctOption(question.getCorrectOption())
                                        .build()
                                )
                                .toList()
                                : List.of()
                )
                .build();
    }

    public Lesson toEntity(LessonRequest request) {
        Lesson lesson = Lesson.builder()
                .title(request.getTitle())
                .description(request.getDescription())
                .content(request.getContent())
                .build();

        if (request.getTestTitle() != null) {
            LessonTest test = LessonTest.builder()
                    .title(request.getTestTitle())
                    .passingScore(
                            request.getPassingScore() != null
                                    ? request.getPassingScore()
                                    : 75
                    )
                    .build();

            lesson.setTest(test);
        }

        return lesson;
    }
}