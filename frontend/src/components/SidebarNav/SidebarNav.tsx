import { IonIcon, useIonRouter } from "@ionic/react";
import {
    homeOutline,
    bookOutline,
    personOutline,
    settingsOutline,
    shieldOutline,
} from "ionicons/icons";

import { useLocation } from "react-router-dom";

import { getAccessToken } from "../../auth/authStorage";
import { parseJwt } from "../../auth/jwt";

import "./SidebarNav.css";

const SidebarNav: React.FC = () => {
    const router = useIonRouter();
    const location = useLocation();

    const isActive = (path: string) =>
        location.pathname === path ||
        location.pathname.startsWith(`${path}/`);

    const token = getAccessToken();
    const payload = token ? parseJwt(token) : null;

    const isAdmin = payload?.sub === "admin";


    return (
        <div className="sidebar">
            <div className="sidebar-logo">😊</div>

            <button
                className={`side-link ${isActive("/home") ? "active" : ""}`}
                onClick={() => router.push("/home")}
            >
                <IonIcon icon={homeOutline} />
                <span>Home</span>
            </button>

            <button
                className={`side-link ${isActive("/modules") ? "active" : ""}`}
                onClick={() => router.push("/modules")}
            >
                <IonIcon icon={bookOutline} />
                <span>Modules</span>
            </button>

            <button
                className={`side-link ${isActive("/profile") ? "active" : ""}`}
                onClick={() => router.push("/profile")}
            >
                <IonIcon icon={personOutline} />
                <span>Profile</span>
            </button>

            {isAdmin && (
                <button
                    className={`side-link ${
                        isActive("/admin") ? "active" : ""
                    }`}
                    onClick={() => router.push("/admin")}
                >
                    <IonIcon icon={shieldOutline} />
                    <span>Admin</span>
                </button>
            )}

            <button
                className={`side-link side-link-bottom ${
                    isActive("/settings") ? "active" : ""
                }`}
                onClick={() => router.push("/settings")}
            >
                <IonIcon icon={settingsOutline} />
                <span>Settings</span>
            </button>
        </div>
    );
};

export default SidebarNav;
