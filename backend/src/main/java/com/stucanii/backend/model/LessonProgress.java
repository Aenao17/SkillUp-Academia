package com.stucanii.backend.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(
        name = "lesson_progress",
        uniqueConstraints = {
                @UniqueConstraint(columnNames = {"user_id", "lesson_id"})
        }
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LessonProgress {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToOne(optional = false)
    @JoinColumn(name = "lesson_id")
    private Lesson lesson;

    private int score;

    private boolean completed;

    public void updateScore(int score) {
        this.score = score;

        if (lesson != null && lesson.getTest() != null) {
            this.completed = score >= lesson.getTest().getPassingScore();
        }
    }
}