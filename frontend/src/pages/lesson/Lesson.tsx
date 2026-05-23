import {
    IonButton,
    IonCard,
    IonCardContent,
    IonContent,
    IonIcon,
    IonPage,
    IonSpinner,
} from "@ionic/react";
import {
    arrowBackOutline,
    checkmarkCircleOutline,
    documentTextOutline,
    trophyOutline,
    playCircleOutline,
} from "ionicons/icons";
import React, { useEffect, useState } from "react";
import { useIonRouter } from "@ionic/react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router";
import SidebarNav from "../../components/SidebarNav/SidebarNav";
import MobileTabBar from "../../components/MobileTabBar/MobileTabBar";
import { getLessonById, LessonDetailsDto } from "../../api/api";
import "./Lesson.css";

const Lesson: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const router = useIonRouter();

    const [lesson, setLesson] = useState<LessonDetailsDto | null>(null);
    const [loading, setLoading] = useState(true);
    const { t } = useTranslation();

    useEffect(() => {
        const loadLesson = async () => {
            try {
                const data = await getLessonById(id);
                console.log(data);
                setLesson(data);
            } catch (error) {
                console.error("Failed to load lesson", error);
            } finally {
                setLoading(false);
            }
        };

        loadLesson();
    }, [id]);

    return (
        <IonPage>
            <IonContent fullscreen className="lesson-page">
                <div className="lesson-layout">
                    <SidebarNav />

                    <main className="lesson-content">
                        <div className="lesson-container">
                            <IonButton
                                fill="clear"
                                className="back-button"
                                onClick={() => router.goBack()}
                            >
                                <IonIcon icon={arrowBackOutline} slot="start" />
                                {t("lesson.back")}
                            </IonButton>

                            {loading ? (
                                <div className="lesson-loading">
                                    <IonSpinner name="crescent" />
                                    <p>{t("lesson.loading")}</p>
                                </div>
                            ) : lesson ? (
                                <>
                                    <section className="lesson-hero">
                                        <p className="lesson-eyebrow">{t("lesson.eyebrow")}</p>
                                        <h1>{lesson.title}</h1>
                                        <p>{lesson.description}</p>
                                    </section>

                                    <section className="lesson-grid">
                                        <IonCard className="lesson-main-card">
                                            <IonCardContent>
                                                <div className="lesson-section-title">
                                                    <IonIcon icon={documentTextOutline} />
                                                    <h2>{t("lesson.content")}</h2>
                                                </div>

                                                <p className="lesson-text">{lesson.content}</p>
                                            </IonCardContent>
                                        </IonCard>

                                        <aside className="lesson-side">
                                            <IonCard className="lesson-side-card">
                                                <IonCardContent>
                                                    <IonIcon icon={checkmarkCircleOutline} />
                                                    <h3>{t("lesson.status")}</h3>
                                                    <p>
                                                        {lesson.completed
                                                            ? t("lesson.completed")
                                                            : t("lesson.notCompleted")}
                                                    </p>
                                                </IonCardContent>
                                            </IonCard>

                                            <IonCard className="lesson-side-card">
                                                <IonCardContent>
                                                    <IonIcon icon={trophyOutline} />
                                                    <h3>{t("lesson.score")}</h3>
                                                    <p>
                                                        {lesson.score !== null
                                                            ? `${lesson.score}%`
                                                            : t("lesson.noScore")}
                                                    </p>
                                                </IonCardContent>
                                            </IonCard>

                                            {lesson && (
                                                <IonCard className="lesson-side-card">
                                                    <IonCardContent>
                                                        <IonIcon icon={playCircleOutline} />
                                                        <h3>{lesson.test?.title}</h3>
                                                        <p>
                                                            {t("lesson.passingScore", {
                                                                score: lesson.test?.passingScore ?? 75,
                                                            })}
                                                        </p>

                                                        <IonButton
                                                            expand="block"
                                                            onClick={() => router.push(`/lessons/${lesson.id}/test`)}
                                                        >
                                                            {t("lesson.startTest")}
                                                        </IonButton>
                                                    </IonCardContent>
                                                </IonCard>
                                            )}
                                        </aside>
                                    </section>
                                </>
                            ) : (
                                <p>{t("lesson.notFound")}</p>
                            )}
                        </div>
                    </main>
                </div>

                <MobileTabBar />
            </IonContent>
        </IonPage>
    );
};

export default Lesson;