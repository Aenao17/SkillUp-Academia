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
import { useTranslation } from "react-i18next";
import { useParams } from "react-router";

import SidebarNav from "../../components/SidebarNav/SidebarNav";
import MobileTabBar from "../../components/MobileTabBar/MobileTabBar";

import {
    getLessonById,
    LessonDetailsDto,
    submitLessonTest,
} from "../../api/api";

import { playSuccessSound, playFailSound } from "../../util/soundEffects";
import "./LessonTest.css";

const LessonTest: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const router = useIonRouter();

    const [lesson, setLesson] = useState<LessonDetailsDto | null>(null);
    const [loading, setLoading] = useState(true);
    const [answers, setAnswers] = useState<number[]>([]);
    const [result, setResult] = useState<number | null>(null);

    const { t } = useTranslation();

    const questions = lesson?.test?.questions || [];
    const passingScore = lesson?.test?.passingScore ?? 75;

    useEffect(() => {
        const loadLesson = async () => {
            try {
                const data = await getLessonById(id);

                setLesson(data);

                setAnswers(
                    new Array(data.test?.questions?.length || 0).fill(-1)
                );
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
        if (questions.length === 0) {
            return;
        }

        const correctAnswers = answers.filter(
            (answer, index) =>
                answer === questions[index].correctOption - 1
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

            if (score >= passingScore) {
                playSuccessSound();
            } else {
                playFailSound();
            }
        } catch (error) {
            console.error("Failed to submit test", error);
        }
    };

    const retakeTest = () => {
        setAnswers(new Array(questions.length).fill(-1));
        setResult(null);
    };

    const allAnswered =
        questions.length > 0 &&
        answers.length === questions.length &&
        answers.every((answer) => answer !== -1);

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
                                    <p>{t("test.loading")}</p>
                                </div>
                            ) : lesson ? (
                                <>
                                    <section className="test-header">
                                        <p>{t("test.eyebrow")}</p>

                                        <h1>
                                            {lesson.test?.title || lesson.title}
                                        </h1>

                                        <span>
                                            {t("test.passingScore", {
                                                score: passingScore,
                                            })}
                                        </span>
                                    </section>

                                    {questions.length === 0 ? (
                                        <IonCard className="test-result-card">
                                            <IonCardContent>
                                                <h2>{t("test.noQuestions")}</h2>

                                                <IonButton
                                                    expand="block"
                                                    fill="outline"
                                                    onClick={() => router.push("/lessons/" + id)}
                                                >
                                                    {t("test.backToLesson")}
                                                </IonButton>
                                            </IonCardContent>
                                        </IonCard>
                                    ) : result === null ? (
                                        <>
                                            <div className="test-questions">
                                                {questions.map((item, questionIndex) => (
                                                    <IonCard
                                                        key={item.id ?? questionIndex}
                                                        className="test-card"
                                                    >
                                                        <IonCardContent>
                                                            <h3>{item.questionText}</h3>

                                                            <div className="test-answers">
                                                                {[
                                                                    item.optionA,
                                                                    item.optionB,
                                                                    item.optionC,
                                                                    item.optionD,
                                                                ].map((answer, answerIndex) => (
                                                                    <button
                                                                        key={`${questionIndex}-${answerIndex}`}
                                                                        className={
                                                                            answers[questionIndex] === answerIndex
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
                                                                        {answer}
                                                                    </button>
                                                                ))}
                                                            </div>
                                                        </IonCardContent>
                                                    </IonCard>
                                                ))}
                                            </div>

                                            <IonButton
                                                expand="block"
                                                disabled={!allAnswered}
                                                onClick={submitTest}
                                            >
                                                {t("test.submit")}
                                            </IonButton>
                                        </>
                                    ) : (
                                        <IonCard className="test-result-card">
                                            <IonCardContent>
                                                <h2>
                                                    {t("test.yourScore", {
                                                        score: result,
                                                    })}
                                                </h2>

                                                <p>
                                                    {result >= passingScore
                                                        ? t("test.passed")
                                                        : t("test.failed")}
                                                </p>

                                                {result < passingScore && (
                                                    <IonButton
                                                        expand="block"
                                                        color="warning"
                                                        onClick={retakeTest}
                                                    >
                                                        {t("test.retake")}
                                                    </IonButton>
                                                )}

                                                <IonButton
                                                    expand="block"
                                                    fill="outline"
                                                    onClick={() => router.goBack()}
                                                >
                                                    {t("test.backToLesson")}
                                                </IonButton>
                                            </IonCardContent>
                                        </IonCard>
                                    )}
                                </>
                            ) : (
                                <p>{t("test.loading")}</p>
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