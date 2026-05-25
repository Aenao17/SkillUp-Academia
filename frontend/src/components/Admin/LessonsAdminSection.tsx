import {
    IonButton,
    IonCard,
    IonCardContent,
    IonIcon,
    IonInput,
    IonItem,
    IonSearchbar,
    IonSelect,
    IonSelectOption,
    IonSpinner,
    IonText,
    IonTextarea,
    IonToast,
} from "@ionic/react";

import {
    addOutline,
    closeOutline,
    documentTextOutline,
} from "ionicons/icons";

import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

import {
    AdminLessonDto,
    createAdminLesson,
    deleteAdminLesson,
    getAdminLessons,
    TestQuestionDto,
    updateAdminLesson,
} from "../../api/api";

const emptyQuestion = (): TestQuestionDto => ({
    questionText: "",
    optionA: "",
    optionB: "",
    optionC: "",
    optionD: "",
    correctOption: 1,
});

const LessonsAdminSection: React.FC = () => {
    const [lessons, setLessons] = useState<AdminLessonDto[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [toastMessage, setToastMessage] = useState("");

    const [search, setSearch] = useState("");
    const [showCreateForm, setShowCreateForm] = useState(false);

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [content, setContent] = useState("");
    const [testTitle, setTestTitle] = useState("");
    const [passingScore, setPassingScore] = useState(75);
    const [questions, setQuestions] = useState<TestQuestionDto[]>([]);

    const [editingLessonId, setEditingLessonId] = useState<number | null>(null);
    const [editTitle, setEditTitle] = useState("");
    const [editDescription, setEditDescription] = useState("");
    const [editContent, setEditContent] = useState("");
    const [editTestTitle, setEditTestTitle] = useState("");
    const [editPassingScore, setEditPassingScore] = useState(75);
    const [editQuestions, setEditQuestions] = useState<TestQuestionDto[]>([]);

    const { t } = useTranslation();

    useEffect(() => {
        loadLessons();
    }, []);

    const filteredLessons = useMemo(() => {
        const value = search.toLowerCase().trim();

        return lessons
            .filter((lesson) =>
                lesson.title.toLowerCase().includes(value) ||
                lesson.description.toLowerCase().includes(value) ||
                String(lesson.id).includes(value)
            )
            .sort((a, b) => a.id - b.id);
    }, [lessons, search]);

    const loadLessons = async () => {
        try {
            setLoading(true);
            setError("");

            const data = await getAdminLessons();
            setLessons(data);
        } catch {
            setError(t("admin.errLoadLessons"));
        } finally {
            setLoading(false);
        }
    };

    const closeCreateForm = () => {
        setShowCreateForm(false);
        setTitle("");
        setDescription("");
        setContent("");
        setTestTitle("");
        setPassingScore(75);
        setQuestions([]);
    };

    const addQuestion = () => {
        setQuestions((prev) => [...prev, emptyQuestion()]);
    };

    const removeQuestion = (index: number) => {
        setQuestions((prev) => prev.filter((_, i) => i !== index));
    };

    const updateQuestion = (
        index: number,
        field: keyof TestQuestionDto,
        value: string | number
    ) => {
        setQuestions((prev) =>
            prev.map((question, i) =>
                i === index ? { ...question, [field]: value } : question
            )
        );
    };

    const addEditQuestion = () => {
        setEditQuestions((prev) => [...prev, emptyQuestion()]);
    };

    const removeEditQuestion = (index: number) => {
        setEditQuestions((prev) => prev.filter((_, i) => i !== index));
    };

    const updateEditQuestion = (
        index: number,
        field: keyof TestQuestionDto,
        value: string | number
    ) => {
        setEditQuestions((prev) =>
            prev.map((question, i) =>
                i === index ? { ...question, [field]: value } : question
            )
        );
    };

    const hasInvalidQuestions = (items: TestQuestionDto[]) => {
        return items.some(
            (question) =>
                !question.questionText.trim() ||
                !question.optionA.trim() ||
                !question.optionB.trim() ||
                !question.optionC.trim() ||
                !question.optionD.trim() ||
                question.correctOption < 1 ||
                question.correctOption > 4
        );
    };

    const handleCreateLesson = async () => {
        if (!title.trim() || !description.trim() || !content.trim()) {
            setError(t("admin.errTitleDescContentRequired"));
            return;
        }

        if (!testTitle.trim()) {
            setError(t("admin.errTestTitleRequired"));
            return;
        }

        if (passingScore < 1 || passingScore > 100) {
            setError(t("admin.errPassingScoreRange"));
            return;
        }

        if (hasInvalidQuestions(questions)) {
            setError(t("admin.errFillQuestions"));
            return;
        }

        try {
            const newLesson = await createAdminLesson({
                title,
                description,
                content,
                testTitle,
                passingScore,
                questions,
            });

            setLessons((prev) => [...prev, newLesson]);
            closeCreateForm();
            setError("");
            setToastMessage(t("admin.successCreateLesson"));
        } catch {
            setError(t("admin.errCreateLesson"));
        }
    };

    const startEditLesson = (lesson: AdminLessonDto) => {
        setEditingLessonId(lesson.id);
        setEditTitle(lesson.title);
        setEditDescription(lesson.description);
        setEditContent(lesson.content || "");
        setEditTestTitle(lesson.test?.title || "");
        setEditPassingScore(lesson.test?.passingScore || 75);
        setEditQuestions(lesson.test?.questions || []);
    };

    const cancelEditLesson = () => {
        setEditingLessonId(null);
        setEditTitle("");
        setEditDescription("");
        setEditContent("");
        setEditTestTitle("");
        setEditPassingScore(75);
        setEditQuestions([]);
    };

    const handleUpdateLesson = async (lessonId: number) => {
        if (!editTitle.trim() || !editDescription.trim() || !editContent.trim()) {
            setError(t("admin.errTitleDescContentRequired"));
            return;
        }

        if (!editTestTitle.trim()) {
            setError(t("admin.errTestTitleRequired"));
            return;
        }

        if (editPassingScore < 1 || editPassingScore > 100) {
            setError(t("admin.errPassingScoreRange"));
            return;
        }

        if (hasInvalidQuestions(editQuestions)) {
            setError(t("admin.errFillQuestions"));
            return;
        }

        try {
            const updatedLesson = await updateAdminLesson(lessonId, {
                title: editTitle,
                description: editDescription,
                content: editContent,
                testTitle: editTestTitle,
                passingScore: editPassingScore,
                questions: editQuestions,
            });

            setLessons((prev) =>
                prev.map((lesson) =>
                    lesson.id === lessonId ? updatedLesson : lesson
                )
            );

            cancelEditLesson();
            setError("");
            setToastMessage(t("admin.successUpdateLesson"));
        } catch {
            setError(t("admin.errUpdateLesson"));
        }
    };

    const handleDeleteLesson = async (lessonId: number) => {
        const confirmed = window.confirm(t("admin.confirmDeleteLesson"));
        if (!confirmed) return;

        try {
            await deleteAdminLesson(lessonId);

            setLessons((prev) =>
                prev.filter((lesson) => lesson.id !== lessonId)
            );

            setError("");
            setToastMessage(t("admin.successDeleteLesson"));
        } catch {
            setError(t("admin.errDeleteLesson"));
        }
    };

    const renderQuestionsEditor = (
        items: TestQuestionDto[],
        onAdd: () => void,
        onRemove: (index: number) => void,
        onUpdate: (
            index: number,
            field: keyof TestQuestionDto,
            value: string | number
        ) => void
    ) => (
        <div className="admin-edit-box">
            <div className="admin-form-header">
                <h2>{t("admin.testQuestions")}</h2>

                <IonButton className="admin-add-button" onClick={onAdd}>
                    <IonIcon icon={addOutline} />
                </IonButton>
            </div>

            {items.length === 0 && (
                <p>{t("admin.noQuestions")}</p>
            )}

            {items.map((question, index) => (
                <IonCard className="admin-inner-card" key={index}>
                    <IonCardContent>
                        <h2>{t("admin.question", { number: index + 1 })}</h2>

                        <IonItem className="admin-input-item">
                            <IonInput
                                label={t("admin.questionText")}
                                labelPlacement="stacked"
                                value={question.questionText}
                                onIonInput={(e) =>
                                    onUpdate(
                                        index,
                                        "questionText",
                                        e.detail.value || ""
                                    )
                                }
                            />
                        </IonItem>

                        <IonItem className="admin-input-item">
                            <IonInput
                                label={t("admin.option1")}
                                labelPlacement="stacked"
                                value={question.optionA}
                                onIonInput={(e) =>
                                    onUpdate(index, "optionA", e.detail.value || "")
                                }
                            />
                        </IonItem>

                        <IonItem className="admin-input-item">
                            <IonInput
                                label={t("admin.option2")}
                                labelPlacement="stacked"
                                value={question.optionB}
                                onIonInput={(e) =>
                                    onUpdate(index, "optionB", e.detail.value || "")
                                }
                            />
                        </IonItem>

                        <IonItem className="admin-input-item">
                            <IonInput
                                label={t("admin.option3")}
                                labelPlacement="stacked"
                                value={question.optionC}
                                onIonInput={(e) =>
                                    onUpdate(index, "optionC", e.detail.value || "")
                                }
                            />
                        </IonItem>

                        <IonItem className="admin-input-item">
                            <IonInput
                                label={t("admin.option4")}
                                labelPlacement="stacked"
                                value={question.optionD}
                                onIonInput={(e) =>
                                    onUpdate(index, "optionD", e.detail.value || "")
                                }
                            />
                        </IonItem>

                        <IonItem className="admin-input-item">
                            <IonSelect
                                label={t("admin.correctAnswer")}
                                labelPlacement="stacked"
                                value={question.correctOption}
                                onIonChange={(e) =>
                                    onUpdate(
                                        index,
                                        "correctOption",
                                        Number(e.detail.value)
                                    )
                                }
                            >
                                <IonSelectOption value={1}>{t("admin.option1")}</IonSelectOption>
                                <IonSelectOption value={2}>{t("admin.option2")}</IonSelectOption>
                                <IonSelectOption value={3}>{t("admin.option3")}</IonSelectOption>
                                <IonSelectOption value={4}>{t("admin.option4")}</IonSelectOption>
                            </IonSelect>
                        </IonItem>

                        <IonButton
                            expand="block"
                            className="admin-danger-button"
                            onClick={() => onRemove(index)}
                        >
                            {t("admin.deleteQuestion")}
                        </IonButton>
                    </IonCardContent>
                </IonCard>
            ))}
        </div>
    );

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
                        <IonIcon icon={documentTextOutline} />
                        <div>
                            <h3>{lessons.length}</h3>
                            <p>Total lessons</p>
                        </div>
                    </IonCardContent>
                </IonCard>

                <div className="admin-toolbar">
                    <IonSearchbar
                        value={search}
                        placeholder={t("admin.searchLessons")}
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
                            <h2>{t("admin.addLesson")}</h2>

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
                                label={t("admin.lessonTitle")}
                                labelPlacement="stacked"
                                value={title}
                                onIonInput={(e) => setTitle(e.detail.value || "")}
                            />
                        </IonItem>

                        <IonItem className="admin-input-item">
                            <IonTextarea
                                label={t("admin.lessonDescription")}
                                labelPlacement="stacked"
                                value={description}
                                onIonInput={(e) =>
                                    setDescription(e.detail.value || "")
                                }
                            />
                        </IonItem>

                        <IonItem className="admin-input-item">
                            <IonTextarea
                                label={t("admin.lessonContent")}
                                labelPlacement="stacked"
                                autoGrow
                                value={content}
                                onIonInput={(e) => setContent(e.detail.value || "")}
                            />
                        </IonItem>

                        <IonItem className="admin-input-item">
                            <IonInput
                                label={t("admin.testTitle")}
                                labelPlacement="stacked"
                                value={testTitle}
                                placeholder="Ex: Communication Basics Test"
                                onIonInput={(e) => setTestTitle(e.detail.value || "")}
                            />
                        </IonItem>

                        <IonItem className="admin-input-item">
                            <IonInput
                                label={t("admin.passingScore")}
                                labelPlacement="stacked"
                                type="number"
                                value={passingScore}
                                min={1}
                                max={100}
                                onIonInput={(e) =>
                                    setPassingScore(Number(e.detail.value))
                                }
                            />
                        </IonItem>

                        {renderQuestionsEditor(
                            questions,
                            addQuestion,
                            removeQuestion,
                            updateQuestion
                        )}

                        <IonButton
                            expand="block"
                            className="admin-button"
                            onClick={handleCreateLesson}
                        >
                            {t("admin.createLessonTest")}
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

            {filteredLessons.length === 0 ? (
                <div className="admin-empty-state">
                    {t("admin.emptyLessons")}
                </div>
            ) : (
                <div className="admin-grid">
                    {filteredLessons.map((lesson) => (
                        <IonCard className="admin-card" key={lesson.id}>
                            <IonCardContent>
                                <div className="admin-card-header-row">
                                    <div>
                                        <h2>{lesson.title}</h2>
                                        <p>ID: {lesson.id}</p>
                                        <p>
                                            {t("admin.testQuestionCount", { count: lesson.test?.questions?.length ?? 0 })}
                                        </p>
                                    </div>

                                    {editingLessonId !== lesson.id && (
                                        <div className="admin-card-actions">
                                            <IonButton
                                                fill="outline"
                                                onClick={() => startEditLesson(lesson)}
                                            >
                                                {t("admin.edit")}
                                            </IonButton>

                                            <IonButton
                                                className="admin-danger-button"
                                                onClick={() =>
                                                    handleDeleteLesson(lesson.id)
                                                }
                                            >
                                                {t("admin.delete")}
                                            </IonButton>
                                        </div>
                                    )}
                                </div>

                                <p>{lesson.description}</p>

                                {editingLessonId === lesson.id && (
                                    <div className="admin-edit-box">
                                        <IonItem className="admin-input-item">
                                            <IonInput
                                                label={t("admin.lessonTitle")}
                                                labelPlacement="stacked"
                                                value={editTitle}
                                                onIonInput={(e) =>
                                                    setEditTitle(e.detail.value || "")
                                                }
                                            />
                                        </IonItem>

                                        <IonItem className="admin-input-item">
                                            <IonTextarea
                                                label={t("admin.lessonDescription")}
                                                labelPlacement="stacked"
                                                value={editDescription}
                                                onIonInput={(e) =>
                                                    setEditDescription(
                                                        e.detail.value || ""
                                                    )
                                                }
                                            />
                                        </IonItem>

                                        <IonItem className="admin-input-item">
                                            <IonTextarea
                                                label={t("admin.lessonContent")}
                                                labelPlacement="stacked"
                                                autoGrow
                                                value={editContent}
                                                onIonInput={(e) =>
                                                    setEditContent(
                                                        e.detail.value || ""
                                                    )
                                                }
                                            />
                                        </IonItem>

                                        <IonItem className="admin-input-item">
                                            <IonInput
                                                label={t("admin.testTitle")}
                                                labelPlacement="stacked"
                                                value={editTestTitle}
                                                onIonInput={(e) =>
                                                    setEditTestTitle(
                                                        e.detail.value || ""
                                                    )
                                                }
                                            />
                                        </IonItem>

                                        <IonItem className="admin-input-item">
                                            <IonInput
                                                label={t("admin.passingScore")}
                                                labelPlacement="stacked"
                                                type="number"
                                                value={editPassingScore}
                                                min={1}
                                                max={100}
                                                onIonInput={(e) =>
                                                    setEditPassingScore(
                                                        Number(e.detail.value)
                                                    )
                                                }
                                            />
                                        </IonItem>

                                        {renderQuestionsEditor(
                                            editQuestions,
                                            addEditQuestion,
                                            removeEditQuestion,
                                            updateEditQuestion
                                        )}

                                        <div className="admin-card-actions">
                                            <IonButton
                                                className="admin-button"
                                                onClick={() =>
                                                    handleUpdateLesson(lesson.id)
                                                }
                                            >
                                                {t("admin.save")}
                                            </IonButton>

                                            <IonButton
                                                fill="outline"
                                                className="admin-secondary-button"
                                                onClick={cancelEditLesson}
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

export default LessonsAdminSection;