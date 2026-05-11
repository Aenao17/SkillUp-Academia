import { IonButton } from "@ionic/react";
import { useIonRouter } from "@ionic/react";
import { useTranslation } from "react-i18next";
import "./InitialAssessmentCard.css";

type Props = {
    show: boolean;
};

const InitialAssessmentCard: React.FC<Props> = ({ show }) => {
    const router = useIonRouter();
    const { t } = useTranslation();

    if (!show) return null;

    return (
        <div className="assessment-card">
            <div className="assessment-content">
                <div className="assessment-text">
                    <h2>{t("assessment.cardTitle")}</h2>
                    <p>{t("assessment.cardText")}</p>
                </div>

                <IonButton
                    className="assessment-button"
                    onClick={() => router.push("/initial-assessment")}
                >
                    {t("assessment.startTest")}
                </IonButton>
            </div>
        </div>
    );
};

export default InitialAssessmentCard;