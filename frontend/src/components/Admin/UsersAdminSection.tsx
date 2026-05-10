import {
    IonButton,
    IonCard,
    IonCardContent,
    IonChip,
    IonIcon,
    IonInput,
    IonItem,
    IonLabel,
    IonSelect,
    IonSelectOption,
    IonSpinner,
    IonText,
    IonToast,
} from "@ionic/react";

import {
    personOutline,
    shieldOutline,
    keyOutline,
} from "ionicons/icons";

import { useEffect, useState } from "react";

import {
    AdminUserDto,
    getAdminUsers,
    updateAdminUserRole,
    resetAdminUserPassword,
} from "../../api/api";

const UsersAdminSection: React.FC = () => {
    const [users, setUsers] = useState<AdminUserDto[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [passwords, setPasswords] = useState<Record<number, string>>({});
    const [toastMessage, setToastMessage] = useState("");

    useEffect(() => {
        loadUsers();
    }, []);

    const loadUsers = async () => {
        try {
            setLoading(true);
            setError("");

            const data = await getAdminUsers();
            setUsers(data);
        } catch {
            setError("Nu s-au putut încărca utilizatorii.");
        } finally {
            setLoading(false);
        }
    };

    const handleRoleChange = async (userId: number, newRole: string) => {
        try {
            const updatedUser = await updateAdminUserRole(userId, newRole);

            setUsers((prev) =>
                prev.map((user) =>
                    user.userId === userId ? updatedUser : user
                )
            );

            setToastMessage("Rolul utilizatorului a fost actualizat.");
        } catch {
            setError("Rolul nu a putut fi actualizat.");
        }
    };

    const handlePasswordReset = async (userId: number) => {
        const newPassword = passwords[userId];

        if (!newPassword || newPassword.length < 6) {
            setError("Parola trebuie să aibă cel puțin 6 caractere.");
            return;
        }

        try {
            await resetAdminUserPassword(userId, newPassword);

            setPasswords((prev) => ({
                ...prev,
                [userId]: "",
            }));

            setError("");
            setToastMessage("Parola a fost resetată.");
        } catch {
            setError("Parola nu a putut fi resetată.");
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

            <IonCard className="admin-stat-card">
                <IonCardContent>
                    <IonIcon icon={personOutline} />
                    <h3>{users.length}</h3>
                    <p>Total users</p>
                </IonCardContent>
            </IonCard>

            <div className="admin-grid">
                {users.map((user) => (
                    <IonCard className="admin-card" key={user.userId}>
                        <IonCardContent>
                            <div className="admin-user-header">
                                <div className="admin-user-avatar">
                                    <IonIcon icon={personOutline} />
                                </div>

                                <div>
                                    <h2>{user.username}</h2>
                                    <p>User ID: {user.userId}</p>
                                </div>
                            </div>

                            <div className="admin-card-section">
                                <IonItem lines="none">
                                    <IonIcon icon={shieldOutline} slot="start" />

                                    <IonLabel>
                                        <h3>Rol curent</h3>
                                        <IonChip
                                            color={user.role === "ADMIN" ? "danger" : "primary"}
                                        >
                                            {user.role}
                                        </IonChip>
                                    </IonLabel>
                                </IonItem>

                                <IonItem className="admin-input-item">
                                    <IonSelect
                                        label="Schimbă rol"
                                        labelPlacement="stacked"
                                        value={user.role}
                                        onIonChange={(e) =>
                                            handleRoleChange(user.userId, e.detail.value as string)
                                        }
                                    >
                                        <IonSelectOption value="USER">USER</IonSelectOption>
                                        <IonSelectOption value="ADMIN">ADMIN</IonSelectOption>
                                    </IonSelect>
                                </IonItem>

                                <IonItem className="admin-input-item">
                                    <IonIcon icon={keyOutline} slot="start" />

                                    <IonInput
                                        label="Parolă nouă"
                                        labelPlacement="stacked"
                                        type="password"
                                        value={passwords[user.userId] || ""}
                                        onIonInput={(e) =>
                                            setPasswords((prev) => ({
                                                ...prev,
                                                [user.userId]: e.detail.value || "",
                                            }))
                                        }
                                    />
                                </IonItem>

                                <IonButton
                                    expand="block"
                                    className="admin-button admin-warning-button"
                                    onClick={() => handlePasswordReset(user.userId)}
                                >
                                    Resetează parola
                                </IonButton>
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

export default UsersAdminSection;