import {
    IonButton,
    IonContent,
    IonInput,
    IonItem,
    IonLabel,
    IonLoading,
    IonPage,
    IonToast,
} from "@ionic/react";
import React, { useState } from "react";
import { postJson } from "../../api/api";
import { setTokens } from "../../auth/authStorage";
import { useIonRouter } from "@ionic/react";
import { useTranslation } from "react-i18next";

import "./Login.css"
import Signup from "../signup/Signup";

type AuthResponse = {
    accessToken: string;
    refreshToken: string;
    tokenType: string;
};

const Login: React.FC = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [showError, setShowError] = useState(false);

    const router = useIonRouter();
    const { t } = useTranslation();

    const validate = (): string | null => {
        const u = username.trim();
        if (u.length < 3) return t("auth.usernameMin");
        if (password.length < 3) return t("auth.passwordMin");
        return null;
    };

    const onSubmit = async () => {
        const err = validate();
        if (err) {
            setErrorMessage(err);
            setShowError(true);
            return;
        }

        setIsLoading(true);
        try {
            const resp = await postJson<AuthResponse>("/api/auth/login", {
                username: username.trim(),
                password,
            });

            setTokens(resp.accessToken, resp.refreshToken);
            router.push("/home", "root");
        } catch (e) {
            const msg = e instanceof Error ? e.message : "Login failed";
            setErrorMessage(msg);
            setShowError(true);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <IonPage>

            <IonContent className="auth-page">
                <div className="auth-shell">

                    <div className="auth-orb auth-orb--a" />
                    <div className="auth-orb auth-orb--b" />

                    <div className="auth-card">
                        <div className="auth-hero">
                            <div className="auth-badge">SkillUp Academia</div>
                            <h2 className="auth-title">Welcome back</h2>
                            <p className="auth-subtitle">Log in to continue</p>
                        </div>

                        <div className="form-group">
                            <IonItem lines="none" className="form-item">
                                <IonInput
                                    value={username}
                                    placeholder="Enter your username"
                                    onIonInput={(e) => setUsername(e.detail.value ?? "")}
                                    onKeyDown={(e) => { if (e.key === "Enter") onSubmit(); }}
                                    autocomplete="username"
                                    className="form-input"
                                />
                            </IonItem>

                            <IonItem lines="none" className="form-item">
                                <IonInput
                                    value={password}
                                    type="password"
                                    placeholder="Enter your password"
                                    onIonInput={(e) => setPassword(e.detail.value ?? "")}
                                    onKeyDown={(e) => { if (e.key === "Enter") onSubmit(); }}
                                    autocomplete="current-password"
                                    className="form-input"
                                />
                            </IonItem>
                        </div>

                        <div className="auth-actions">
                            <IonButton
                                expand="block"
                                className="primary-button"
                                onClick={onSubmit}
                                disabled={isLoading}
                            >
                                Log in
                            </IonButton>
                            <div className="register-text">
                                <IonLabel>
                                    Don’t have an account?{" "}
                                    <button
                                        type="button"
                                        className="register-link-button"
                                        onClick={() => router.push("/signup")}
                                    >
                                        Register here
                                    </button>
                                </IonLabel>
                            </div>
                        </div>
                    </div>
                </div>


                <IonLoading isOpen={isLoading} message="Logging in..." />

                <IonToast
                    isOpen={showError}
                    message={errorMessage}
                    duration={2000}
                    onDidDismiss={() => setShowError(false)}
                />
            </IonContent>
        </IonPage>
    );
};

export default Login;