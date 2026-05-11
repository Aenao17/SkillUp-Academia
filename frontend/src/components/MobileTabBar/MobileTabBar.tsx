import {
    IonIcon,
    IonLabel,
    IonTabBar,
    IonTabButton,
} from "@ionic/react";

import {
    homeOutline,
    bookOutline,
    personOutline,
    settingsOutline,
    shieldOutline,
} from "ionicons/icons";

import { useTranslation } from "react-i18next";
import { getAccessToken } from "../../auth/authStorage";
import { parseJwt } from "../../auth/jwt";

import "./MobileTabBar.css";

const MobileTabBar: React.FC = () => {
    const { t } = useTranslation();
    const token = getAccessToken();

    const payload = token ? parseJwt(token) : null;

    const isAdmin = payload?.role === "ADMIN";

    return (
        <div className="mobile-tabbar-wrapper">
            <IonTabBar className="mobile-tabbar">
                <IonTabButton href="/home">
                    <IonIcon icon={homeOutline} />
                    <IonLabel>{t("nav.home")}</IonLabel>
                </IonTabButton>

                <IonTabButton href="/modules">
                    <IonIcon icon={bookOutline} />
                    <IonLabel>{t("nav.modules")}</IonLabel>
                </IonTabButton>

                <IonTabButton href="/profile">
                    <IonIcon icon={personOutline} />
                    <IonLabel>{t("nav.profile")}</IonLabel>
                </IonTabButton>

                {isAdmin && (
                    <IonTabButton href="/admin">
                        <IonIcon icon={shieldOutline} />
                        <IonLabel>{t("nav.admin")}</IonLabel>
                    </IonTabButton>
                )}

                <IonTabButton href="/settings">
                    <IonIcon icon={settingsOutline} />
                    <IonLabel>{t("nav.settings")}</IonLabel>
                </IonTabButton>
            </IonTabBar>
        </div>
    );
};

export default MobileTabBar;