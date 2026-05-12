import {
    IonIcon,
    IonLabel,
    IonTabBar,
    IonTabButton,
    useIonRouter
} from "@ionic/react";

import {
    homeOutline,
    bookOutline,
    personOutline,
    settingsOutline,
    shieldOutline,
} from "ionicons/icons";

import { useTranslation } from "react-i18next";
import { useLocation } from "react-router-dom";
import { getAccessToken } from "../../auth/authStorage";
import { parseJwt } from "../../auth/jwt";

import "./MobileTabBar.css";

const MobileTabBar: React.FC = () => {
    const { t } = useTranslation();
    const router = useIonRouter();
    const location = useLocation();

    const token = getAccessToken();
    const payload = token ? parseJwt(token) : null;

    const isAdmin = payload?.sub === "admin";

    const isActive = (path: string) =>
        location.pathname === path ||
        location.pathname.startsWith(`${path}/`);

    return (
        <div className="mobile-tabbar-wrapper">
            <IonTabBar className="mobile-tabbar">
                <IonTabButton 
                    tab="home"
                    onClick={() => router.push("/home")}
                    className={isActive("/home") ? "tab-selected" : ""}
                >
                    <IonIcon icon={homeOutline} />
                    <IonLabel>{t("nav.home")}</IonLabel>
                </IonTabButton>

                <IonTabButton 
                    tab="modules"
                    onClick={() => router.push("/modules")}
                    className={isActive("/modules") ? "tab-selected" : ""}
                >
                    <IonIcon icon={bookOutline} />
                    <IonLabel>{t("nav.modules")}</IonLabel>
                </IonTabButton>

                <IonTabButton 
                    tab="profile"
                    onClick={() => router.push("/profile")}
                    className={isActive("/profile") ? "tab-selected" : ""}
                >
                    <IonIcon icon={personOutline} />
                    <IonLabel>{t("nav.profile")}</IonLabel>
                </IonTabButton>

                {isAdmin && (
                    <IonTabButton 
                        tab="admin"
                        onClick={() => router.push("/admin")}
                        className={isActive("/admin") ? "tab-selected" : ""}
                    >
                        <IonIcon icon={shieldOutline} />
                        <IonLabel>{t("nav.admin")}</IonLabel>
                    </IonTabButton>
                )}

                <IonTabButton 
                    tab="settings"
                    onClick={() => router.push("/settings")}
                    className={isActive("/settings") ? "tab-selected" : ""}
                >
                    <IonIcon icon={settingsOutline} />
                    <IonLabel>{t("nav.settings")}</IonLabel>
                </IonTabButton>
            </IonTabBar>
        </div>
    );
};

export default MobileTabBar;