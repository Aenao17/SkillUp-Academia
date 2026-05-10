import {
    IonButton,
    IonCard,
    IonCardContent,
    IonCardHeader,
    IonCardTitle,
    IonCheckbox,
    IonInput,
    IonItem,
    IonLabel,
    IonList,
    IonSpinner,
    IonText,
    IonTextarea,
    IonToast,
} from "@ionic/react";

import { useEffect, useState } from "react";

import {
    AdminLessonDto,
    AdminModuleDto,
    createAdminModule,
    getAdminLessons,
    getAdminModules,
} from "../../api/api";

const ModulesAdminSection: React.FC = () => {
    const [modules, setModules] = useState<AdminModuleDto[]>([]);
    const [lessons, setLessons] = useState<AdminLessonDto[]>([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [toastMessage, setToastMessage] = useState("");

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [selectedLessonIds, setSelectedLessonIds] = useState<number[]>([]);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            setLoading(true);
            setError("");

            const [modulesData, lessonsData] = await Promise.all([
                getAdminModules(),
                getAdminLessons(),
            ]);

            setModules(modulesData);
            setLessons(lessonsData);
        } catch {
            setError("Nu s-au putut încărca modulele.");
        } finally {
            setLoading(false);
        }
    };

    const toggleLesson = (lessonId: number) => {
        setSelectedLessonIds((prev) =>
            prev.includes(lessonId)
                ? prev.filter((id) => id !== lessonId)
                : [...prev, lessonId]
        );
    };

    const handleCreateModule = async () => {
        if (!title.trim() || !description.trim()) {
            setError("Titlul și descrierea sunt obligatorii.");
            return;
        }

        try {
            const newModule = await createAdminModule({
                title,
                description,
                lessonIds: selectedLessonIds,
            });

            setModules((prev) => [...prev, newModule]);

            setTitle("");
            setDescription("");
            setSelectedLessonIds([]);
            setError("");
            setToastMessage("Modulul a fost creat.");
        } catch {
            setError("Modulul nu a putut fi creat.");
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
                    <IonCardTitle>Adaugă modul</IonCardTitle>
                </IonCardHeader>

                <IonCardContent>
                    <div className="admin-form">
                        <IonItem className="admin-input-item">
                            <IonInput
                                label="Titlu"
                                labelPlacement="stacked"
                                value={title}
                                onIonInput={(e) => setTitle(e.detail.value || "")}
                            />
                        </IonItem>

                        <IonItem className="admin-input-item">
                            <IonTextarea
                                label="Descriere"
                                labelPlacement="stacked"
                                value={description}
                                onIonInput={(e) => setDescription(e.detail.value || "")}
                            />
                        </IonItem>

                        <IonCard className="admin-inner-card">
                            <IonCardHeader>
                                <IonCardTitle>Selectează lecții</IonCardTitle>
                            </IonCardHeader>

                            <IonCardContent>
                                <IonList lines="none">
                                    {lessons.map((lesson) => (
                                        <IonItem key={lesson.id} className="admin-checkbox-item">
                                            <IonCheckbox
                                                slot="start"
                                                checked={selectedLessonIds.includes(lesson.id)}
                                                onIonChange={() => toggleLesson(lesson.id)}
                                            />

                                            <IonLabel>
                                                <h3>{lesson.title}</h3>
                                                <p>{lesson.description}</p>
                                            </IonLabel>
                                        </IonItem>
                                    ))}
                                </IonList>
                            </IonCardContent>
                        </IonCard>

                        <IonButton
                            expand="block"
                            className="admin-button"
                            onClick={handleCreateModule}
                        >
                            Creează modul
                        </IonButton>
                    </div>
                </IonCardContent>
            </IonCard>

            <h2 className="admin-section-title">Module existente: {modules.length}</h2>

            <div className="admin-grid">
                {modules.map((module) => (
                    <IonCard className="admin-card" key={module.id}>
                        <IonCardHeader>
                            <IonCardTitle>{module.title}</IonCardTitle>
                        </IonCardHeader>

                        <IonCardContent>
                            <p>
                                <strong>ID:</strong> {module.id}
                            </p>

                            <p>{module.description}</p>

                            <p>
                                <strong>Lecții:</strong> {module.lessons?.length ?? 0}
                            </p>

                            <div className="admin-module-lessons">
                                {module.lessons?.map((lesson) => (
                                    <span className="admin-module-chip" key={lesson.id}>
                    {lesson.title}
                  </span>
                                ))}
                            </div>
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

export default ModulesAdminSection;