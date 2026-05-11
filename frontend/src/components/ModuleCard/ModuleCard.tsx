import { IonIcon } from "@ionic/react";
import { bookOutline, chevronForwardOutline } from "ionicons/icons";
import { useIonRouter } from "@ionic/react";
import { useTranslation } from "react-i18next";
import "./ModuleCard.css";

export type ModuleCardProps = {
    id: number;
    title: string;
    description: string;
    lessonCount: number;
};

const ModuleCard: React.FC<ModuleCardProps> = ({
                                                   id,
                                                   title,
                                                   description,
                                                   lessonCount,
                                               }) => {
    const router = useIonRouter();
    const { t } = useTranslation();

    return (
        <button
            className="module-card"
            onClick={() => router.push(`/modules/${id}`)}
        >
            <div className="module-icon">
                <IonIcon icon={bookOutline} />
            </div>

            <div className="module-info">
                <h3>{title}</h3>
                <p>{description}</p>
                <span>{t("modules.lessonCount", { count: lessonCount })}</span>
            </div>

            <IonIcon className="module-arrow" icon={chevronForwardOutline} />
        </button>
    );
};

export default ModuleCard;