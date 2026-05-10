
import { Capacitor } from '@capacitor/core';

const getBaseUrl = () => {
    if (Capacitor.getPlatform() === 'android') {
        // 10.0.2.2 este adresa specială prin care Emulatorul Android vede localhost-ul PC-ului
        return "http://10.0.2.2:8080";
    }
    return import.meta.env.VITE_API_URL;
};
export const BASE_URL = getBaseUrl();
// const BASE_URL = "http://10.0.2.2:8080";
export type ApiError = {
    error?: string;
};

import { getAccessToken } from "../auth/authStorage";
import {LearningModuleDto} from "../types/module";

export async function getJsonAuth<TResponse>(path: string): Promise<TResponse> {
    const token = getAccessToken();
    if (!token) throw new Error("Not authenticated");

    const res = await fetch(`${BASE_URL}${path}`, {
        method: "GET",
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    if (!res.ok) {
        let payload: ApiError | null = null;
        try {
            payload = await res.json();
        } catch {
            // ignore
        }
        const msg = payload?.error || `Request failed (${res.status})`;
        throw new Error(msg);
    }

    return (await res.json()) as TResponse;
}

export async function patchJsonAuth<TResponse>(
    path: string,
    body: unknown
): Promise<TResponse> {
    const token = getAccessToken();
    if (!token) throw new Error("Not authenticated");

    const res = await fetch(`${BASE_URL}${path}`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
    });

    if (!res.ok) {
        let payload: ApiError | null = null;
        try {
            payload = await res.json();
        } catch { /* empty */ }
        const msg = payload?.error || `Request failed (${res.status})`;
        throw new Error(msg);
    }

    // majoritatea endpointurilor noastre returnează void
    if (res.status === 204) return undefined as TResponse;
    if (res.headers.get("content-type")?.includes("application/json")) {
        return (await res.json()) as TResponse;
    }
    return undefined as TResponse;
}

export async function deleteAuth(path: string): Promise<void> {
    const token = getAccessToken();
    if (!token) throw new Error("Not authenticated");

    const res = await fetch(`${BASE_URL}${path}`, {
        method: "DELETE",
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    if (!res.ok) {
        let payload: ApiError | null = null;
        try {
            payload = await res.json();
        } catch { /* empty */ }
        const msg = payload?.error || `Request failed (${res.status})`;
        throw new Error(msg);
    }
}

export const getModules = async (): Promise<LearningModuleDto[]> => {
    return getJsonAuth<LearningModuleDto[]>("/api/modules");
};

export async function postJson<TResponse>(
    path: string,
    body: unknown
): Promise<TResponse> {
    const res = await fetch(`${BASE_URL}${path}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
    });

    if (!res.ok) {
        let payload: ApiError | null = null;
        try {
            payload = await res.json();
        } catch {
            // ignore
        }
        const msg = payload?.error || `Request failed (${res.status})`;
        throw new Error(msg);
    }

    return (await res.json()) as TResponse;
}

export async function postJsonAuth<TResponse>(
    path: string,
    body: unknown
): Promise<TResponse> {
    const token = getAccessToken();

    console.log("TOKEN TRIMIS:", token);
    console.log("URL:", `${BASE_URL}${path}`);
    if (!token) throw new Error("Not authenticated");

    const res = await fetch(`${BASE_URL}${path}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
    });

    if (!res.ok) {
        let payload: ApiError | null = null;
        try {
            payload = await res.json();
        } catch { /* empty */ }
        const msg = payload?.error || `Request failed (${res.status})`;
        throw new Error(msg);
    }

    if (res.status === 204) return undefined as TResponse;
    if (res.headers.get("content-type")?.includes("application/json")) {
        return (await res.json()) as TResponse;
    }
    return undefined as TResponse;
}

export type CurrentUserDto ={
    id:number;
    username: string;
    role: string;
};

export type UserProgressDto = {
    lessonId: number;
    lessonTitle: string;
    score: number;
    completed: boolean;
};

export const getCurrentUser = async(): Promise<CurrentUserDto> =>{
    return getJsonAuth("/api/user/me");
};

export const getUserProgress = async(): Promise<UserProgressDto[]>=>{
    return getJsonAuth("/api/user/progress");
}

export type LessonSummaryDto = {
    id: number;
    title: string;
    description: string;
    score: number | null;
    completed: boolean;
};

export type ModuleDetailsDto = {
    id: number;
    title: string;
    description: string;
    completed: boolean;
    lessons: LessonSummaryDto[];
};

export type LessonDetailsDto = {
    id: number;
    title: string;
    description: string;
    content: string;
    completed: boolean;
    score: number | null;
    test?: string;
    passingScore?: number;
};

export const getModuleById = async (id: string): Promise<ModuleDetailsDto> => {
    return getJsonAuth(`/api/modules/${id}`);
};

export const getLessonById = async (id: string): Promise<LessonDetailsDto> => {
    return getJsonAuth(`/api/lessons/${id}`);
};

export type SubmitTestRequest = {
    lessonId: number;
    score: number;
};

export type SubmitTestResponse = {
    lessonId: number;
    lessonTitle: string;
    score: number;
    completed: boolean;
};

export const submitLessonTest = async (
    body: SubmitTestRequest
): Promise<SubmitTestResponse> => {
    return postJsonAuth("/api/progress/submit-test", body);
};

export type AdminUserDto = {
    userId: number;
    username: string;
    role: string;
};

export const getAdminUsers = async (): Promise<AdminUserDto[]> => {
    return getJsonAuth<AdminUserDto[]>("/api/admin/users");
};

export const updateAdminUserRole = async (
    userId: number,
    role: string
): Promise<AdminUserDto> => {
    return patchJsonAuth<AdminUserDto>(`/api/admin/users/${userId}/role`, {
        role,
    });
};

export const resetAdminUserPassword = async (
    userId: number,
    newPassword: string
): Promise<void> => {
    return patchJsonAuth<void>(`/api/admin/users/${userId}/password`, {
        newPassword,
    });
};

export type AdminLessonDto = {
    id: number;
    title: string;
    description: string;
    content?: string;
    completed?: boolean;
    test?: string;
    passingScore?: number;
    score?: number | null;
};

export type AdminLessonRequest = {
    title: string;
    description: string;
    content: string;
    testTitle: string;
    passingScore: number;
};

export type AdminModuleDto = {
    id: number;
    title: string;
    description: string;
    lessons: AdminLessonDto[];
    completed?: boolean;
};

export type AdminModuleRequest = {
    title: string;
    description: string;
    lessonIds: number[];
};

export const getAdminLessons = async (): Promise<AdminLessonDto[]> => {
    return getJsonAuth<AdminLessonDto[]>("/api/lessons");
};

export const createAdminLesson = async (
    body: AdminLessonRequest
): Promise<AdminLessonDto> => {
    return postJsonAuth<AdminLessonDto>("/api/admin/lessons", body);
};

export const getAdminModules = async (): Promise<AdminModuleDto[]> => {
    return getJsonAuth<AdminModuleDto[]>("/api/modules");
};

export const createAdminModule = async (
    body: AdminModuleRequest
): Promise<AdminModuleDto> => {
    return postJsonAuth<AdminModuleDto>("/api/admin/modules", body);
};