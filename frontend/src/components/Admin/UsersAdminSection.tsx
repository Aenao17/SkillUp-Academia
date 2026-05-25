import {
    IonButton,
    IonCard,
    IonCardContent,
    IonChip,
    IonIcon,
    IonInput,
    IonItem,
    IonLabel,
    IonSearchbar,
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
    addOutline,
    closeOutline,
} from "ionicons/icons";

import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

import {
    AdminUserDto,
    getAdminUsers,
    updateAdminUserRole,
    resetAdminUserPassword,
    createAdminUser,
    updateAdminUser,
    deleteAdminUser,
} from "../../api/api";

const UsersAdminSection: React.FC = () => {
    const [users, setUsers] = useState<AdminUserDto[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [toastMessage, setToastMessage] = useState("");

    const [search, setSearch] = useState("");
    const [showCreateForm, setShowCreateForm] = useState(false);

    const [passwords, setPasswords] = useState<Record<number, string>>({});

    const [newUsername, setNewUsername] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [newRole, setNewRole] = useState("USER");

    const [editingUserId, setEditingUserId] = useState<number | null>(null);
    const [editUsername, setEditUsername] = useState("");
    const [editRole, setEditRole] = useState("USER");

    const { t } = useTranslation();

    useEffect(() => {
        loadUsers();
    }, []);

    const filteredUsers = useMemo(() => {
        const value = search.toLowerCase().trim();

        return users
            .filter((user) =>
                user.username.toLowerCase().includes(value) ||
                user.role.toLowerCase().includes(value) ||
                String(user.userId).includes(value)
            )
            .sort((a, b) => a.userId - b.userId);
    }, [users, search]);

    const loadUsers = async () => {
        try {
            setLoading(true);
            setError("");

            const data = await getAdminUsers();
            setUsers(data);
        } catch {
            setError(t("admin.errLoadUsers"));
        } finally {
            setLoading(false);
        }
    };

    const closeCreateForm = () => {
        setShowCreateForm(false);
        setNewUsername("");
        setNewPassword("");
        setNewRole("USER");
    };

    const handleCreateUser = async () => {
        if (!newUsername.trim() || !newPassword.trim()) {
            setError(t("admin.errUsernamePasswordRequired"));
            return;
        }

        if (newPassword.length < 6) {
            setError(t("admin.errPasswordMin"));
            return;
        }

        try {
            const createdUser = await createAdminUser({
                username: newUsername,
                password: newPassword,
                role: newRole,
            });

            setUsers((prev) => [...prev, createdUser]);

            closeCreateForm();
            setError("");
            setToastMessage(t("admin.successCreateUser"));
        } catch {
            setError(t("admin.errCreateUser"));
        }
    };

    const handleRoleChange = async (userId: number, newRoleValue: string) => {
        try {
            const updatedUser = await updateAdminUserRole(userId, newRoleValue);

            setUsers((prev) =>
                prev.map((user) =>
                    user.userId === userId ? updatedUser : user
                )
            );

            setToastMessage(t("admin.successUpdateRole"));
        } catch {
            setError(t("admin.errUpdateRole"));
        }
    };

    const handlePasswordReset = async (userId: number) => {
        const newPasswordValue = passwords[userId];

        if (!newPasswordValue || newPasswordValue.length < 6) {
            setError(t("admin.errPasswordMin"));
            return;
        }

        try {
            await resetAdminUserPassword(userId, newPasswordValue);

            setPasswords((prev) => ({
                ...prev,
                [userId]: "",
            }));

            setError("");
            setToastMessage(t("admin.successResetPassword"));
        } catch {
            setError(t("admin.errResetPassword"));
        }
    };

    const startEditUser = (user: AdminUserDto) => {
        setEditingUserId(user.userId);
        setEditUsername(user.username);
        setEditRole(user.role);
    };

    const cancelEditUser = () => {
        setEditingUserId(null);
        setEditUsername("");
        setEditRole("USER");
    };

    const handleUpdateUser = async (userId: number) => {
        if (!editUsername.trim()) {
            setError(t("admin.errUsernameRequired"));
            return;
        }

        try {
            const updatedUser = await updateAdminUser(userId, {
                username: editUsername,
                role: editRole,
            });

            setUsers((prev) =>
                prev.map((user) =>
                    user.userId === userId ? updatedUser : user
                )
            );

            cancelEditUser();
            setError("");
            setToastMessage(t("admin.successUpdateUser"));
        } catch {
            setError(t("admin.errUpdateUser"));
        }
    };

    const handleDeleteUser = async (userId: number) => {
        const confirmed = window.confirm(t("admin.confirmDeleteUser"));

        if (!confirmed) return;

        try {
            await deleteAdminUser(userId);

            setUsers((prev) =>
                prev.filter((user) => user.userId !== userId)
            );

            setError("");
            setToastMessage(t("admin.successDeleteUser"));
        } catch {
            setError(t("admin.errDeleteUser"));
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
                        <IonIcon icon={personOutline} />
                        <div>
                            <h3>{users.length}</h3>
                            <p>Total users</p>
                        </div>
                    </IonCardContent>
                </IonCard>

                <div className="admin-toolbar">
                    <IonSearchbar
                        value={search}
                        placeholder={t("admin.searchUsers")}
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
                            <h2>{t("admin.addUser")}</h2>

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
                                label="Username"
                                labelPlacement="stacked"
                                value={newUsername}
                                onIonInput={(e) => setNewUsername(e.detail.value || "")}
                            />
                        </IonItem>

                        <IonItem className="admin-input-item">
                            <IonInput
                                label={t("admin.password")}
                                labelPlacement="stacked"
                                type="password"
                                value={newPassword}
                                onIonInput={(e) => setNewPassword(e.detail.value || "")}
                            />
                        </IonItem>

                        <IonItem className="admin-input-item">
                            <IonSelect
                                label={t("admin.role")}
                                labelPlacement="stacked"
                                value={newRole}
                                onIonChange={(e) => setNewRole(e.detail.value as string)}
                            >
                                <IonSelectOption value="USER">USER</IonSelectOption>
                                <IonSelectOption value="ADMIN">ADMIN</IonSelectOption>
                            </IonSelect>
                        </IonItem>

                        <IonButton
                            expand="block"
                            className="admin-button"
                            onClick={handleCreateUser}
                        >
                            {t("admin.createUser")}
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

            {filteredUsers.length === 0 ? (
                <div className="admin-empty-state">
                    {t("admin.emptyUsers")}
                </div>
            ) : (
                <div className="admin-grid">
                    {filteredUsers.map((user) => (
                        <IonCard className="admin-card" key={user.userId}>
                            <IonCardContent>
                                <div className="admin-card-header-row">
                                    <div className="admin-user-header">
                                        <div className="admin-user-avatar">
                                            <IonIcon icon={personOutline} />
                                        </div>

                                        <div>
                                            <h2>{user.username}</h2>
                                            <p>User ID: {user.userId}</p>
                                        </div>
                                    </div>

                                    <IonChip
                                        color={user.role === "ADMIN" ? "danger" : "primary"}
                                    >
                                        {user.role}
                                    </IonChip>
                                </div>

                                <div className="admin-card-section">
                                    <IonItem lines="none">
                                        <IonIcon icon={shieldOutline} slot="start" />

                                        <IonLabel>
                                            <h3>{t("admin.changeRoleQuick")}</h3>
                                        </IonLabel>
                                    </IonItem>

                                    <IonItem className="admin-input-item">
                                        <IonSelect
                                            label={t("admin.role")}
                                            labelPlacement="stacked"
                                            value={user.role}
                                            onIonChange={(e) =>
                                                handleRoleChange(
                                                    user.userId,
                                                    e.detail.value as string
                                                )
                                            }
                                        >
                                            <IonSelectOption value="USER">USER</IonSelectOption>
                                            <IonSelectOption value="ADMIN">ADMIN</IonSelectOption>
                                        </IonSelect>
                                    </IonItem>

                                    <IonItem className="admin-input-item">
                                        <IonIcon icon={keyOutline} slot="start" />

                                        <IonInput
                                            label={t("admin.newPassword")}
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
                                        {t("admin.resetPassword")}
                                    </IonButton>

                                    {editingUserId === user.userId ? (
                                        <div className="admin-edit-box">
                                            <IonItem className="admin-input-item">
                                                <IonInput
                                                    label="Username"
                                                    labelPlacement="stacked"
                                                    value={editUsername}
                                                    onIonInput={(e) =>
                                                        setEditUsername(e.detail.value || "")
                                                    }
                                                />
                                            </IonItem>

                                            <IonItem className="admin-input-item">
                                                <IonSelect
                                                    label={t("admin.role")}
                                                    labelPlacement="stacked"
                                                    value={editRole}
                                                    onIonChange={(e) =>
                                                        setEditRole(e.detail.value as string)
                                                    }
                                                >
                                                    <IonSelectOption value="USER">USER</IonSelectOption>
                                                    <IonSelectOption value="ADMIN">ADMIN</IonSelectOption>
                                                </IonSelect>
                                            </IonItem>

                                            <div className="admin-card-actions">
                                                <IonButton
                                                    className="admin-button"
                                                    onClick={() => handleUpdateUser(user.userId)}
                                                >
                                                    {t("admin.save")}
                                                </IonButton>

                                                <IonButton
                                                    className="admin-secondary-button"
                                                    fill="clear"
                                                    onClick={cancelEditUser}
                                                >
                                                    {t("admin.cancel")}
                                                </IonButton>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="admin-card-actions">
                                            <IonButton
                                                fill="outline"
                                                onClick={() => startEditUser(user)}
                                            >
                                                {t("admin.edit")}
                                            </IonButton>

                                            <IonButton
                                                className="admin-danger-button"
                                                onClick={() => handleDeleteUser(user.userId)}
                                            >
                                                {t("admin.delete")}
                                            </IonButton>
                                        </div>
                                    )}
                                </div>
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

export default UsersAdminSection;