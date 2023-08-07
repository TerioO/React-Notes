import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { closePopup } from "../../slices/db-slice";

type Props = {};

export default function PopupMessage({}: Props) {
    const popup = useAppSelector((state) => state.db.popup);
    const dispatch = useAppDispatch();

    if (!popup.open) return null;

    return (
        popup.open && (
            <div
                className="popup-message-container"
                onAnimationEnd={() => dispatch(closePopup())}
            >
                <div>
                    <span
                        className="material-symbols-outlined icon"
                        onClick={() => dispatch(closePopup())}
                    >
                        arrow_forward
                    </span>
                </div>
                <p className="message">{popup.message}</p>
            </div>
        )
    );
}
