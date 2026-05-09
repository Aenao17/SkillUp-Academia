package com.stucanii.backend.model;

import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "learning_modules")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LearningModule {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String description;

    @ManyToMany
    @JoinTable(
            name = "module_lessons",
            joinColumns = @JoinColumn(name = "module_id"),
            inverseJoinColumns = @JoinColumn(name = "lesson_id")
    )
    @Builder.Default
    private List<Lesson> lessons = new ArrayList<>();

    public boolean isCompletedBy(User user, List<LessonProgress> progressList) {
        return lessons.stream()
                .allMatch(lesson -> progressList.stream()
                        .anyMatch(progress ->
                                progress.getUser().equals(user)
                                        && progress.getLesson().equals(lesson)
                                        && progress.isCompleted()
                        ));
    }
}
