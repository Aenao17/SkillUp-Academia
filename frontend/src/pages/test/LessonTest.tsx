import {
    IonButton,
    IonCard,
    IonCardContent,
    IonContent,
    IonPage,
    IonSpinner,
} from "@ionic/react";
import React, { useEffect, useState } from "react";
import { useIonRouter } from "@ionic/react";
import { useParams } from "react-router";

import SidebarNav from "../../components/SidebarNav/SidebarNav";
import MobileTabBar from "../../components/MobileTabBar/MobileTabBar";

import {
    getLessonById,
    LessonDetailsDto,
    submitLessonTest,
} from "../../api/api";

import "./LessonTest.css";

const questions = [
    {
        question: "Did you understand the main idea of this lesson?",
        answers: ["Yes", "Partially", "No"],
        correctIndex: 0,
    },
    {
        question: "Can you apply this concept in a real situation?",
        answers: ["Yes", "Not sure", "No"],
        correctIndex: 0,
    },
    {
        question: "What is the goal of soft skills learning?",
        answers: [
            "Better communication",
            "Memorizing theory",
            "Avoiding teamwork",
        ],
        correctIndex: 0,
    },
];

const LessonTest: React.FC = () => {
    const { id } = useParams<{ id: string }>();

    const router = useIonRouter();

    const [lesson, setLesson] = useState<LessonDetailsDto | null>(null);

    const [loading, setLoading] = useState(true);

    const [answers, setAnswers] = useState<number[]>([]);

    const [result, setResult] = useState<number | null>(null);

    useEffect(() => {
        const loadLesson = async () => {
            try {
                const data = await getLessonById(id);

                setLesson(data);

                setAnswers(new Array(questions.length).fill(-1));
            } catch (error) {
                console.error("Failed to load lesson test", error);
            } finally {
                setLoading(false);
            }
        };

        loadLesson();
    }, [id]);

    const selectAnswer = (
        questionIndex: number,
        answerIndex: number
    ) => {
        const updated = [...answers];

        updated[questionIndex] = answerIndex;

        setAnswers(updated);
    };

    const submitTest = async () => {
        const correctAnswers = answers.filter(
            (answer, index) =>
                answer === questions[index].correctIndex
        ).length;

        const score = Math.round(
            (correctAnswers / questions.length) * 100
        );

        try {
            await submitLessonTest({
                lessonId: Number(id),
                score,
            });

            setResult(score);
        } catch (error) {
            console.error("Failed to submit test", error);
        }
    };

    const retakeTest = () => {
        setAnswers(new Array(questions.length).fill(-1));
        setResult(null);
    };

    const allAnswered = answers.every(
        (answer) => answer !== -1
    );

    const passingScore = lesson?.passingScore ?? 75;

    return (
        <IonPage>
            <IonContent fullscreen className="test-page">
                <div className="test-layout">
                    <SidebarNav />

                    <main className="test-content">
                        <div className="test-container">
                            {loading ? (
                                <div className="test-loading">
                                    <IonSpinner name="crescent" />

                                    <p>Loading test...</p>
                                </div>
                            ) : lesson ? (
                                <>
                                    <section className="test-header">
                                        <p>Lesson test</p>

                                        <h1>
                                            {lesson.test? lesson.test : "Test"}
                                        </h1>

                                        <span>
                                            Passing score:{" "}
                                            {passingScore}%
                                        </span>
                                    </section>

                                    {result === null ? (
                                        <>
                                            <div className="test-questions">
                                                {questions.map(
                                                    (
                                                        item,
                                                        questionIndex
                                                    ) => (
                                                        <IonCard
                                                            key={
                                                                questionIndex
                                                            }
                                                            className="test-card"
                                                        >
                                                            <IonCardContent>
                                                                <h3>
                                                                    {
                                                                        item.question
                                                                    }
                                                                </h3>

                                                                <div className="test-answers">
                                                                    {item.answers.map(
                                                                        (
                                                                            answer,
                                                                            answerIndex
                                                                        ) => (
                                                                            <button
                                                                                key={
                                                                                    answer
                                                                                }
                                                                                className={
                                                                                    answers[
                                                                                        questionIndex
                                                                                        ] ===
                                                                                    answerIndex
                                                                                        ? "selected"
                                                                                        : ""
                                                                                }
                                                                                onClick={() =>
                                                                                    selectAnswer(
                                                                                        questionIndex,
                                                                                        answerIndex
                                                                                    )
                                                                                }
                                                                            >
                                                                                {
                                                                                    answer
                                                                                }
                                                                            </button>
                                                                        )
                                                                    )}
                                                                </div>
                                                            </IonCardContent>
                                                        </IonCard>
                                                    )
                                                )}
                                            </div>

                                            <IonButton
                                                expand="block"
                                                disabled={
                                                    !allAnswered
                                                }
                                                onClick={submitTest}
                                            >
                                                Submit test
                                            </IonButton>
                                        </>
                                    ) : (
                                        <IonCard className="test-result-card">
                                            <IonCardContent>
                                                <h2>
                                                    Your score: {result}%
                                                </h2>

                                                <p>
                                                    {result >=
                                                    passingScore
                                                        ? "You passed this lesson."
                                                        : "You did not pass yet. You can retake the test."}
                                                </p>

                                                {result <
                                                    passingScore && (
                                                        <IonButton
                                                            expand="block"
                                                            color="warning"
                                                            onClick={
                                                                retakeTest
                                                            }
                                                        >
                                                            Retake test
                                                        </IonButton>
                                                    )}

                                                <IonButton
                                                    expand="block"
                                                    fill="outline"
                                                    onClick={() =>
                                                        router.push(
                                                            "/modules"
                                                        )
                                                    }
                                                >
                                                    Back to modules
                                                </IonButton>
                                            </IonCardContent>
                                        </IonCard>
                                    )}
                                </>
                            ) : (
                                <p>Lesson not found.</p>
                            )}
                        </div>
                    </main>
                </div>

                <MobileTabBar />
            </IonContent>
        </IonPage>
    );
};

export default LessonTest;