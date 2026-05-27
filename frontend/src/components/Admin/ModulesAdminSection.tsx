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
import { useTranslation } from "react-i18next";

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

    const { t } = useTranslation();

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
            setError(t("admin.errLoadModules"));
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
            setError(t("admin.errTitleDescRequired"));
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
            setToastMessage(t("admin.successCreateModule"));
        } catch {
            setError(t("admin.errCreateModule"));
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
            setError(t("admin.errTitleDescRequired"));
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
            setToastMessage(t("admin.successUpdateModule"));
        } catch {
            setError(t("admin.errUpdateModule"));
        }
    };

    const handleDeleteModule = async (moduleId: number) => {
        const confirmed = window.confirm(t("admin.confirmDeleteModule"));
        if (!confirmed) return;

        try {
            await deleteAdminModule(moduleId);

            setModules((prev) =>
                prev.filter((module) => module.id !== moduleId)
            );

            setError("");
            setToastMessage(t("admin.successDeleteModule"));
        } catch {
            setError(t("admin.errDeleteModule"));
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
                        placeholder={t("admin.searchModules")}
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
                            <h2>{t("admin.addModule")}</h2>

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
                                label={t("admin.moduleTitle")}
                                labelPlacement="stacked"
                                value={title}
                                onIonInput={(e) => setTitle(e.detail.value || "")}
                            />
                        </IonItem>

                        <IonItem className="admin-input-item">
                            <IonTextarea
                                label={t("admin.moduleDescription")}
                                labelPlacement="stacked"
                                value={description}
                                onIonInput={(e) => setDescription(e.detail.value || "")}
                            />
                        </IonItem>

                        <IonCard className="admin-inner-card">
                            <IonCardContent>
                                <h2>{t("admin.selectLessons")}</h2>

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
                            {t("admin.createModule")}
                        </IonButton>

                        <IonButton
                            expand="block"
                            fill="outline"
                            className="admin-secondary-button"
                            onClick={closeCreateForm}
                        >
                            {t("admin.cancel")}
                        </IonButton>
                    </IonCardContent>
                </IonCard>
            )}

            {filteredModules.length === 0 ? (
                <div className="admin-empty-state">
                    {t("admin.emptyModules")}
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
                                        <p>{t("admin.lessons", { count: module.lessons?.length ?? 0 })}</p>
                                    </div>

                                    {editingModuleId !== module.id && (
                                        <div className="admin-card-actions">
                                            <IonButton
                                                fill="outline"
                                                onClick={() => startEditModule(module)}
                                            >
                                                {t("admin.edit")}
                                            </IonButton>

                                            <IonButton
                                                className="admin-danger-button"
                                                onClick={() =>
                                                    handleDeleteModule(module.id)
                                                }
                                            >
                                                {t("admin.delete")}
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
                                            {lesson.title + ", "}
                                        </span>
                                    ))}
                                </div>

                                {editingModuleId === module.id && (
                                    <div className="admin-edit-box">
                                        <IonItem className="admin-input-item">
                                            <IonInput
                                                label={t("admin.moduleTitle")}
                                                labelPlacement="stacked"
                                                value={editTitle}
                                                onIonInput={(e) =>
                                                    setEditTitle(e.detail.value || "")
                                                }
                                            />
                                        </IonItem>

                                        <IonItem className="admin-input-item">
                                            <IonTextarea
                                                label={t("admin.moduleDescription")}
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
                                                <h2>{t("admin.moduleLessons")}</h2>

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
                                                {t("admin.save")}
                                            </IonButton>

                                            <IonButton
                                                fill="outline"
                                                className="admin-secondary-button"
                                                onClick={cancelEditModule}
                                            >
                                                {t("admin.cancel")}
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