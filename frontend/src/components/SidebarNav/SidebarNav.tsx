import { IonIcon, useIonRouter } from "@ionic/react";
import {
    homeOutline,
    bookOutline,
    personOutline,
    settingsOutline,
} from "ionicons/icons";
import { useLocation } from "react-router-dom";
import "./SidebarNav.css";

const SidebarNav: React.FC = () => {
    const router = useIonRouter();
    const location = useLocation();

    const isActive = (path: string) => location.pathname === path;

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