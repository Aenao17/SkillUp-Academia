import { IonIcon } from "@ionic/react";
import { bookOutline, chevronForwardOutline } from "ionicons/icons";
import { useIonRouter } from "@ionic/react";
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
                <span>{lessonCount} lessons</span>
            </div>

            <IonIcon className="module-arrow" icon={chevronForwardOutline} />
        </button>
    );
};

export default ModuleCard;