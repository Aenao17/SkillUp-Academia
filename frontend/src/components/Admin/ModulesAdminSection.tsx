import {
    IonButton,
    IonCard,
    IonCardContent,
    IonCheckbox,
    IonIcon,
    IonInput,
    IonItem,
    IonLabel,
    IonList,
    IonSearchbar,
    IonSpinner,
    IonText,
    IonTextarea,
    IonToast,
} from "@ionic/react";

import {
    addOutline,
    closeOutline,
    layersOutline,
} from "ionicons/icons";

import { useEffect, useMemo, useState } from "react";

import {
    AdminLessonDto,
    AdminModuleDto,
    createAdminModule,
    deleteAdminModule,
    getAdminLessons,
    getAdminModules,
    updateAdminModule,
} from "../../api/api";

const ModulesAdminSection: React.FC = () => {
    const [modules, setModules] = useState<AdminModuleDto[]>([]);
    const [lessons, setLessons] = useState<AdminLessonDto[]>([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [toastMessage, setToastMessage] = useState("");

    const [search, setSearch] = useState("");
    const [showCreateForm, setShowCreateForm] = useState(false);

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [selectedLessonIds, setSelectedLessonIds] = useState<number[]>([]);

    const [editingModuleId, setEditingModuleId] = useState<number | null>(null);
    const [editTitle, setEditTitle] = useState("");
    const [editDescription, setEditDescription] = useState("");
    const [editSelectedLessonIds, setEditSelectedLessonIds] = useState<number[]>([]);

    useEffect(() => {
        loadData();
    }, []);

    const filteredModules = useMemo(() => {
        const value = search.toLowerCase().trim();

        return modules
            .filter((module) =>
                module.title.toLowerCase().includes(value) ||
                module.description.toLowerCase().includes(value) ||
                String(module.id).includes(value)
            )
            .sort((a, b) => a.id - b.id);
    }, [modules, search]);

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

    const closeCreateForm = () => {
        setShowCreateForm(false);
        setTitle("");
        setDescription("");
        setSelectedLessonIds([]);
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

            closeCreateForm();
            setError("");
            setToastMessage("Modulul a fost creat.");
        } catch {
            setError("Modulul nu a putut fi creat.");
        }
    };

    const startEditModule = (module: AdminModuleDto) => {
        setEditingModuleId(module.id);
        setEditTitle(module.title);
        setEditDescription(module.description);
        setEditSelectedLessonIds(module.lessons?.map((lesson) => lesson.id) || []);
    };

    const cancelEditModule = () => {
        setEditingModuleId(null);
        setEditTitle("");
        setEditDescription("");
        setEditSelectedLessonIds([]);
    };

    const toggleEditLesson = (lessonId: number) => {
        setEditSelectedLessonIds((prev) =>
            prev.includes(lessonId)
                ? prev.filter((id) => id !== lessonId)
                : [...prev, lessonId]
        );
    };

    const handleUpdateModule = async (moduleId: number) => {
        if (!editTitle.trim() || !editDescription.trim()) {
            setError("Titlul și descrierea sunt obligatorii.");
            return;
        }

        try {
            const updatedModule = await updateAdminModule(moduleId, {
                title: editTitle,
                description: editDescription,
                lessonIds: editSelectedLessonIds,
            });

            setModules((prev) =>
                prev.map((module) =>
                    module.id === moduleId ? updatedModule : module
                )
            );

            cancelEditModule();
            setError("");
            setToastMessage("Modulul a fost actualizat.");
        } catch {
            setError("Modulul nu a putut fi actualizat.");
        }
    };

    const handleDeleteModule = async (moduleId: number) => {
        const confirmed = window.confirm("Sigur vrei să ștergi modulul?");
        if (!confirmed) return;

        try {
            await deleteAdminModule(moduleId);

            setModules((prev) =>
                prev.filter((module) => module.id !== moduleId)
            );

            setError("");
            setToastMessage("Modulul a fost șters.");
        } catch {
            setError("Modulul nu a putut fi șters.");
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

            <div className="admin-top-bar">
                <IonCard className="admin-stat-card admin-compact-stat-card">
                    <IonCardContent>
                        <IonIcon icon={layersOutline} />
                        <div>
                            <h3>{modules.length}</h3>
                            <p>Total modules</p>
                        </div>
                    </IonCardContent>
                </IonCard>

                <div className="admin-toolbar">
                    <IonSearchbar
                        value={search}
                        placeholder="Caută modul după titlu, descriere sau ID..."
                        onIonInput={(e) => setSearch(e.detail.value || "")}
                    />

                    <IonButton
                        className="admin-add-button"
                        onClick={() => setShowCreateForm((prev) => !prev)}
                    >
                        <IonIcon icon={addOutline} />
                    </IonButton>
                </div>
            </div>

            {showCreateForm && (
                <IonCard className="admin-form-card admin-slide-form-card">
                    <IonCardContent>
                        <div className="admin-form-header">
                            <h2>Adaugă modul</h2>

                            <IonButton
                                fill="clear"
                                className="admin-close-button"
                                onClick={closeCreateForm}
                            >
                                <IonIcon icon={closeOutline} />
                            </IonButton>
                        </div>

                        <IonItem className="admin-input-item">
                            <IonInput
                                label="Titlu modul"
                                labelPlacement="stacked"
                                value={title}
                                onIonInput={(e) => setTitle(e.detail.value || "")}
                            />
                        </IonItem>

                        <IonItem className="admin-input-item">
                            <IonTextarea
                                label="Descriere modul"
                                labelPlacement="stacked"
                                value={description}
                                onIonInput={(e) => setDescription(e.detail.value || "")}
                            />
                        </IonItem>

                        <IonCard className="admin-inner-card">
                            <IonCardContent>
                                <h2>Selectează lecții</h2>

                                <IonList lines="none">
                                    {lessons.map((lesson) => (
                                        <IonItem
                                            key={lesson.id}
                                            className="admin-checkbox-item"
                                        >
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

                        <IonButton
                            expand="block"
                            fill="outline"
                            className="admin-secondary-button"
                            onClick={closeCreateForm}
                        >
                            Anulează
                        </IonButton>
                    </IonCardContent>
                </IonCard>
            )}

            {filteredModules.length === 0 ? (
                <div className="admin-empty-state">
                    Nu există module pentru căutarea introdusă.
                </div>
            ) : (
                <div className="admin-grid">
                    {filteredModules.map((module) => (
                        <IonCard className="admin-card" key={module.id}>
                            <IonCardContent>
                                <div className="admin-card-header-row">
                                    <div>
                                        <h2>{module.title}</h2>
                                        <p>ID: {module.id}</p>
                                        <p>Lecții: {module.lessons?.length ?? 0}</p>
                                    </div>

                                    {editingModuleId !== module.id && (
                                        <div className="admin-card-actions">
                                            <IonButton
                                                fill="outline"
                                                onClick={() => startEditModule(module)}
                                            >
                                                Editează
                                            </IonButton>

                                            <IonButton
                                                className="admin-danger-button"
                                                onClick={() =>
                                                    handleDeleteModule(module.id)
                                                }
                                            >
                                                Șterge
                                            </IonButton>
                                        </div>
                                    )}
                                </div>

                                <p>{module.description}</p>

                                <div className="admin-module-lessons">
                                    {module.lessons?.map((lesson) => (
                                        <span
                                            className="admin-module-chip"
                                            key={lesson.id}
                                        >
                                            {lesson.title}
                                        </span>
                                    ))}
                                </div>

                                {editingModuleId === module.id && (
                                    <div className="admin-edit-box">
                                        <IonItem className="admin-input-item">
                                            <IonInput
                                                label="Titlu modul"
                                                labelPlacement="stacked"
                                                value={editTitle}
                                                onIonInput={(e) =>
                                                    setEditTitle(e.detail.value || "")
                                                }
                                            />
                                        </IonItem>

                                        <IonItem className="admin-input-item">
                                            <IonTextarea
                                                label="Descriere modul"
                                                labelPlacement="stacked"
                                                value={editDescription}
                                                onIonInput={(e) =>
                                                    setEditDescription(
                                                        e.detail.value || ""
                                                    )
                                                }
                                            />
                                        </IonItem>

                                        <IonCard className="admin-inner-card">
                                            <IonCardContent>
                                                <h2>Lecții modul</h2>

                                                <IonList lines="none">
                                                    {lessons.map((lesson) => (
                                                        <IonItem
                                                            key={lesson.id}
                                                            className="admin-checkbox-item"
                                                        >
                                                            <IonCheckbox
                                                                slot="start"
                                                                checked={editSelectedLessonIds.includes(
                                                                    lesson.id
                                                                )}
                                                                onIonChange={() =>
                                                                    toggleEditLesson(lesson.id)
                                                                }
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

                                        <div className="admin-card-actions">
                                            <IonButton
                                                className="admin-button"
                                                onClick={() =>
                                                    handleUpdateModule(module.id)
                                                }
                                            >
                                                Salvează
                                            </IonButton>

                                            <IonButton
                                                fill="outline"
                                                className="admin-secondary-button"
                                                onClick={cancelEditModule}
                                            >
                                                Anulează
                                            </IonButton>
                                        </div>
                                    </div>
                                )}
                            </IonCardContent>
                        </IonCard>
                    ))}
                </div>
            )}

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