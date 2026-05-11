import {
    IonButton,
    IonContent,
    IonInput,
    IonItem,
    IonLabel,
    IonLoading,
    IonPage,
    IonToast,
    useIonRouter,
} from "@ionic/react";
import React, { useState } from "react";
import { postJson } from "../../api/api";
import { useTranslation } from "react-i18next";
import "./Signup.css";

type SignupRequest = {
    username: string;
    email: string;
    password: string;
};

const Signup: React.FC = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [showError, setShowError] = useState(false);

    const router = useIonRouter();
    const { t } = useTranslation();

    const validate = (): string | null => {
        if (username.trim().length < 3) {
            return t("auth.usernameMin");
        }

        if (password.length < 3) {
            return t("auth.passwordMin");
        }

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
            await postJson("/api/auth/register", {
                username: username.trim(),
                password,
            } as SignupRequest);

            console.log("Registration successful");
            router.push("/login", "root");
        } catch (e) {
            const msg = e instanceof Error ? e.message : "Registration failed";
            setErrorMessage("Registration failed: " + msg);
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
                            <div className="auth-badge">{t("auth.appName")}</div>
                            <h2 className="auth-title">{t("auth.signupTitle")}</h2>
                            <p className="auth-subtitle">{t("auth.signupSubtitle")}</p>
                        </div>

                        <div className="form-group">
                            <IonItem lines="none" className="form-item">
                                <IonLabel position="stacked" className="form-label">
                                    {t("auth.usernameLabel")}
                                </IonLabel>
                                <IonInput
                                    value={username}
                                    placeholder={t("auth.chooseUsername")}
                                    onIonInput={(e) => setUsername(e.detail.value ?? "")}
                                    autocomplete="username"
                                    className="form-input"
                                />
                            </IonItem>

                            <IonItem lines="none" className="form-item">
                                <IonLabel position="stacked" className="form-label">
                                    {t("auth.passwordLabel")}
                                </IonLabel>
                                <IonInput
                                    value={password}
                                    type="password"
                                    placeholder={t("auth.createPassword")}
                                    onIonInput={(e) => setPassword(e.detail.value ?? "")}
                                    autocomplete="new-password"
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
                                {t("auth.signupButton")}
                            </IonButton>
                        </div>

                        <div className="register-text">
                            <IonLabel>
                                {t("auth.hasAccount")}{" "}
                                <button
                                    type="button"
                                    className="register-link-button"
                                    onClick={() => router.push("/login")}
                                >
                                    {t("auth.loginLink")}
                                </button>
                            </IonLabel>
                        </div>
                    </div>
                </div>

                <IonLoading isOpen={isLoading} message="Creating account..." />

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

export default Signup;