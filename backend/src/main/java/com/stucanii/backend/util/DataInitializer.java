package com.stucanii.backend.util;

import com.stucanii.backend.model.*;
import com.stucanii.backend.repository.*;
import lombok.RequiredArgsConstructor;
import org.jspecify.annotations.NonNull;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    private final LearningModuleRepository moduleRepository;
    private final LessonRepository lessonRepository;
    private final LessonProgressRepository progressRepository;

    @Override
    public void run(String @NonNull ... args) {
        User admin = createAdmin();
        User student = createStudent();

        createCompleteSampleModule(student);
    }

    private User createAdmin() {
        return userRepository.findByUsername("admin")
                .orElseGet(() -> {
                    User user = User.builder()
                            .username("admin")
                            .password(passwordEncoder.encode("admin"))
                            .role(Role.ADMIN)
                            .build();

                    System.out.println("✔ Admin created");
                    return userRepository.save(user);
                });
    }

    private User createStudent() {
        return userRepository.findByUsername("student")
                .orElseGet(() -> {
                    User user = User.builder()
                            .username("student")
                            .password(passwordEncoder.encode("student"))
                            .role(Role.USER)
                            .build();

                    System.out.println("✔ Student created");
                    return userRepository.save(user);
                });
    }

    private void createCompleteSampleModule(User student) {
        if (moduleRepository.count() > 0) {
            return;
        }

        Lesson lesson1 = createLesson(
                "Communication Basics",
                "Learn how to communicate effectively.",
                "Communication is the process of exchanging information between people.",
                "Communication Test"
        );

        Lesson lesson2 = createLesson(
                "Active Listening",
                "Improve your listening skills.",
                "Active listening means fully concentrating, understanding and responding.",
                "Listening Test"
        );

        Lesson lesson3 = createLesson(
                "Giving Feedback",
                "Learn how to give constructive feedback.",
                "Constructive feedback helps people improve without discouraging them.",
                "Feedback Test"
        );

        lessonRepository.saveAll(List.of(lesson1, lesson2, lesson3));

        LearningModule module = LearningModule.builder()
                .title("Communication Skills")
                .description("Master essential communication skills.")
                .lessons(List.of(lesson1, lesson2, lesson3))
                .build();

        moduleRepository.save(module);

        createCompletedProgress(student, lesson1, 90);
        createCompletedProgress(student, lesson2, 85);
        createCompletedProgress(student, lesson3, 95);

        System.out.println("✔ Complete sample module created");
    }

    private Lesson createLesson(
            String title,
            String description,
            String content,
            String testTitle
    ) {
        Lesson lesson = Lesson.builder()
                .title(title)
                .description(description)
                .content(content)
                .build();

        LessonTest test = LessonTest.builder()
                .title(testTitle)
                .passingScore(75)
                .build();

        lesson.setTest(test);

        return lesson;
    }

    private void createCompletedProgress(User user, Lesson lesson, int score) {
        LessonProgress progress = LessonProgress.builder()
                .user(user)
                .lesson(lesson)
                .score(score)
                .completed(score >= lesson.getTest().getPassingScore())
                .build();

        progressRepository.save(progress);
    }
}