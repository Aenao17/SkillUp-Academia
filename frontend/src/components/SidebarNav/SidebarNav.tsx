import { IonIcon } from "@ionic/react";
import {
    homeOutline,
    bookOutline,
    personOutline,
    settingsOutline,
} from "ionicons/icons";
import { useIonRouter } from "@ionic/react";
import "./SidebarNav.css";

const SidebarNav: React.FC = () => {
    const router = useIonRouter();

    return (
        <div className="sidebar">
            <div className="sidebar-logo">😊</div>

            <button className="side-link active" onClick={() => router.push("/home")}>
                <IonIcon icon={homeOutline} />
                <span>Home</span>
            </button>

            <button className="side-link" onClick={() => router.push("/modules")}>
                <IonIcon icon={bookOutline} />
                <span>Modules</span>
            </button>

            <button className="side-link" onClick={() => router.push("/profile")}>
                <IonIcon icon={personOutline} />
                <span>Profile</span>
            </button>

            <button
                className="side-link side-link-bottom"
                onClick={() => router.push("/settings")}
            >
                <IonIcon icon={settingsOutline} />
                <span>Settings</span>
            </button>
        </div>
    );
};

export default SidebarNav;