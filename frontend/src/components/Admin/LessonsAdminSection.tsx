import {
    IonButton,
    IonCard,
    IonCardContent,
    IonCardHeader,
    IonCardTitle,
    IonInput,
    IonItem,
    IonSpinner,
    IonText,
    IonTextarea,
    IonToast,
} from "@ionic/react";

import { useEffect, useState } from "react";

import {
    AdminLessonDto,
    createAdminLesson,
    getAdminLessons,
} from "../../api/api";

const LessonsAdminSection: React.FC = () => {
    const [lessons, setLessons] = useState<AdminLessonDto[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [toastMessage, setToastMessage] = useState("");

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [content, setContent] = useState("");

    const [testTitle, setTestTitle] = useState("");
    const [passingScore, setPassingScore] = useState(75);

    useEffect(() => {
        loadLessons();
    }, []);

    const loadLessons = async () => {
        try {
            setLoading(true);
            setError("");

            const data = await getAdminLessons();
            setLessons(data);
        } catch {
            setError("Nu s-au putut încărca lecțiile.");
        } finally {
            setLoading(false);
        }
    };

    const handleCreateLesson = async () => {
        if (!title.trim() || !description.trim() || !content.trim()) {
            setError("Titlul, descrierea și conținutul sunt obligatorii.");
            return;
        }

        if (!testTitle.trim()) {
            setError("Titlul testului este obligatoriu.");
            return;
        }

        if (passingScore < 1 || passingScore > 100) {
            setError("Scorul de promovare trebuie să fie între 1 și 100.");
            return;
        }

        try {
            const newLesson = await createAdminLesson({
                title,
                description,
                content,
                testTitle,
                passingScore,
            });

            setLessons((prev) => [...prev, newLesson]);

            setTitle("");
            setDescription("");
            setContent("");
            setTestTitle("");
            setPassingScore(75);

            setError("");
            setToastMessage("Lecția și testul au fost create.");
        } catch {
            setError("Lecția nu a putut fi creată.");
        }
    };

    if (loading) {
        return (
            <div className="admin-loading">
                <IonSpinner name="crescent" />
            </div>
        );
    }

    return (
        <>
            {error && (
                <IonText color="danger">
                    <p>{error}</p>
                </IonText>
            )}

            <IonCard className="admin-form-card">
                <IonCardHeader>
                    <IonCardTitle>Adaugă lecție</IonCardTitle>
                </IonCardHeader>

                <IonCardContent>
                    <div className="admin-form">
                        <IonItem className="admin-input-item">
                            <IonInput
                                label="Titlu lecție"
                                labelPlacement="stacked"
                                value={title}
                                onIonInput={(e) =>
                                    setTitle(e.detail.value || "")
                                }
                            />
                        </IonItem>

                        <IonItem className="admin-input-item">
                            <IonTextarea
                                label="Descriere lecție"
                                labelPlacement="stacked"
                                value={description}
                                onIonInput={(e) =>
                                    setDescription(e.detail.value || "")
                                }
                            />
                        </IonItem>

                        <IonItem className="admin-input-item">
                            <IonTextarea
                                label="Conținut lecție"
                                labelPlacement="stacked"
                                autoGrow
                                value={content}
                                onIonInput={(e) =>
                                    setContent(e.detail.value || "")
                                }
                            />
                        </IonItem>

                        <IonItem className="admin-input-item">
                            <IonInput
                                label="Titlu test"
                                labelPlacement="stacked"
                                value={testTitle}
                                placeholder="Ex: Communication Basics Test"
                                onIonInput={(e) =>
                                    setTestTitle(e.detail.value || "")
                                }
                            />
                        </IonItem>

                        <IonItem className="admin-input-item">
                            <IonInput
                                label="Scor promovare (%)"
                                labelPlacement="stacked"
                                type="number"
                                value={passingScore}
                                min={1}
                                max={100}
                                onIonInput={(e) =>
                                    setPassingScore(
                                        Number(e.detail.value)
                                    )
                                }
                            />
                        </IonItem>

                        <IonButton
                            expand="block"
                            className="admin-button"
                            onClick={handleCreateLesson}
                        >
                            Creează lecție + test
                        </IonButton>
                    </div>
                </IonCardContent>
            </IonCard>

            <h2 className="admin-section-title">
                Lecții existente: {lessons.length}
            </h2>

            <div className="admin-grid">
                {lessons.map((lesson) => (
                    <IonCard className="admin-card" key={lesson.id}>
                        <IonCardHeader>
                            <IonCardTitle>{lesson.title}</IonCardTitle>
                        </IonCardHeader>

                        <IonCardContent>
                            <p>
                                <strong>ID:</strong> {lesson.id}
                            </p>

                            <p>{lesson.description}</p>
                        </IonCardContent>
                    </IonCard>
                ))}
            </div>

            <IonToast
                isOpen={!!toastMessage}
                message={toastMessage}
                duration={2000}
                onDidDismiss={() => setToastMessage("")}
            />
        </>
    );
};

export default LessonsAdminSection;