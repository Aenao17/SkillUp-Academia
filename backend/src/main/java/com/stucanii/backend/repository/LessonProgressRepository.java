package com.stucanii.backend.repository;

import com.stucanii.backend.model.Lesson;
import com.stucanii.backend.model.LessonProgress;
import com.stucanii.backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface LessonProgressRepository extends JpaRepository<LessonProgress, Long> {

    Optional<LessonProgress> findByUserAndLesson(User user, Lesson lesson);

    List<LessonProgress> findByUser(User user);

    List<LessonProgress> findByUserAndLessonIn(User user, List<Lesson> lessons);

    boolean existsByUserAndLessonAndCompletedTrue(User user, Lesson lesson);

    Optional<LessonProgress> findByLesson(Lesson lesson);

    Optional<LessonProgress> findByUserUsernameAndLesson(String username, Lesson lesson);
}