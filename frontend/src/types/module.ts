export type LessonDto = {
    id: number;
    title: string;
    description: string;
};

export type LearningModuleDto = {
    id: number;
    title: string;
    description: string;
    lessons: LessonDto[];
};