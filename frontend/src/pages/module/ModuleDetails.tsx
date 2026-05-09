import {
    IonContent,
    IonIcon,
    IonPage,
    IonSpinner,
    useIonRouter,
} from "@ionic/react";
import {
    arrowBackOutline,
    checkmarkCircleOutline,
    ellipseOutline,
    lockClosedOutline,
} from "ionicons/icons";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import SidebarNav from "../../components/SidebarNav/SidebarNav";
import MobileTabBar from "../../components/MobileTabBar/MobileTabBar";
import { getModuleById, ModuleDetailsDto } from "../../api/api";
import "./ModuleDetails.css";

const lessonEmojis = ["📚", "🎯", "🤔", "💬", "⭐"];

const ModuleDetails: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const router = useIonRouter();

    const [module, setModule] = useState<ModuleDetailsDto | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadModule = async () => {
            try {
                const data = await getModuleById(id);
                setModule(data);
            } catch (error) {
                console.error("Failed to load module", error);
            } finally {
                setLoading(false);
            }
        };

        loadModule();
    }, [id]);

    const completedLessons =
        module?.lessons.filter((lesson) => lesson.completed).length ?? 0;

    const totalLessons = module?.lessons.length ?? 0;

    const progressPercent =
        totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

    return (
        <IonPage>
            <IonContent fullscreen className="module-page">
                <div className="module-layout">
                    <SidebarNav />

                    <main className="module-content">
                        <div className="module-phone">
                            {loading ? (
                                <div className="module-loading">
                                    <IonSpinner name="crescent" />
                                    <p>Loading module...</p>
                                </div>
                            ) : module ? (
                                <>
                                    <section className="module-top">
                                        <div className="module-nav">
                                            <button onClick={() => router.push("/modules")}>
                                                <IonIcon icon={arrowBackOutline} />
                                                Modules
                                            </button>

                                            <div className="module-points">
                                                <span>🔥 7</span>
                                                <span>⭐ 340 XP</span>
                                            </div>
                                        </div>

                                        <div className="module-header-content">
                                            <div className="module-bubble">💬</div>

                                            <div className="module-header-text">
                                                <span className="module-unit">
                                                    UNIT {module.id}
                                                </span>

                                                <h1>{module.title}</h1>
                                                <p>{module.description}</p>

                                                <div className="module-progress">
                                                    <div className="module-progress-info">
                                                        <span>Progress</span>
                                                        <span>
                                                            {completedLessons}/{totalLessons} lessons
                                                        </span>
                                                    </div>

                                                    <div className="module-progress-track">
                                                        <div
                                                            className="module-progress-fill"
                                                            style={{ width: `${progressPercent}%` }}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </section>

                                    <section className="lesson-path-map">
                                        {module.lessons.map((lesson, index) => {
                                            const previousLessonCompleted =
                                                index === 0 ||
                                                module.lessons[index - 1].completed;

                                            const completed = lesson.completed;
                                            const locked = !previousLessonCompleted;
                                            const available = !locked && !completed;

                                            const statusClass = completed
                                                ? "completed"
                                                : available
                                                    ? "available"
                                                    : "locked";

                                            return (
                                                <div
                                                    key={lesson.id}
                                                    className={`path-step ${
                                                        index % 2 === 0 ? "left" : "right"
                                                    }`}
                                                >
                                                    <button
                                                        className={`path-circle ${statusClass}`}
                                                        disabled={locked}
                                                        onClick={() =>
                                                            router.push(`/lessons/${lesson.id}`)
                                                        }
                                                    >
                                                        {locked
                                                            ? "🔒"
                                                            : lessonEmojis[index % lessonEmojis.length]}
                                                    </button>

                                                    <button
                                                        className={`path-label ${statusClass}`}
                                                        disabled={locked}
                                                        onClick={() =>
                                                            router.push(`/lessons/${lesson.id}`)
                                                        }
                                                    >
                                                        <IonIcon
                                                            icon={
                                                                completed
                                                                    ? checkmarkCircleOutline
                                                                    : available
                                                                        ? ellipseOutline
                                                                        : lockClosedOutline
                                                            }
                                                        />
                                                        <span>{lesson.title}</span>
                                                    </button>

                                                    {index < module.lessons.length - 1 && (
                                                        <div
                                                            className={`path-connector ${
                                                                index % 2 === 0 ? "to-right" : "to-left"
                                                            }`}
                                                        />
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </section>
                                </>
                            ) : (
                                <p>Module not found.</p>
                            )}
                        </div>
                    </main>
                </div>

                <MobileTabBar />
            </IonContent>
        </IonPage>
    );
};

export default ModuleDetails;