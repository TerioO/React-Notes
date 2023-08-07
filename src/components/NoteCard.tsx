import dayjs from "dayjs";
import { useAppSelector } from "../app/hooks";
import { noteDisplay } from "../slices/db-slice";

type Props = {
    title: string;
    category: string;
    date: string;
    time: string;
    description: string | null;
    openModal?: () => void;
    deleteNote?: () => void;
};

export default function NoteCard({
    title,
    category,
    date,
    time,
    description,
    openModal,
    deleteNote,
}: Props) {
    const db = useAppSelector((state) => state.db);
    const delete_color = dayjs(JSON.parse(date)).diff(dayjs()) < 0 ? 'red' : 'inherit'
    return (
        <div className={db.settings.noteDisplay}>
            <div className="btns">
                <span
                    className="material-symbols-outlined icon"
                    onClick={openModal}
                >
                    edit_document
                </span>
                <span
                    className="material-symbols-outlined icon"
                    onClick={deleteNote}  
                    style={{color: delete_color}}
                    title={delete_color === 'red' ? "Overdue, delete note" : ""}
                >
                    delete_forever
                </span>
            </div>
            <div className="title-c">
                <p>{title}</p>
            </div>
            <div className="date-time-c">
                <div className="icon-date">
                    <span className="material-symbols-outlined icon">
                        event
                    </span>
                    <p>
                        {db.settings.noteDisplay == noteDisplay[0]
                            ? dayjs(JSON.parse(date)).format(
                                  "dddd - DD/MM/YYYY"
                              )
                            : dayjs(JSON.parse(date)).format("dddd - DD/MM/YYYY")}
                    </p>
                </div>
                <div className="icon-date">
                    <span className="material-symbols-outlined icon">
                        schedule
                    </span>
                    <p>{dayjs(JSON.parse(time)).format("HH:mm")}</p>
                </div>
            </div>
            <div className="description-c">
                <input type="checkbox" id={date} />
                <label htmlFor={date}>
                    Description {description?.length == 0 ? '[empty]' : ''}
                    <span className="material-symbols-outlined icon">
                        change_history
                    </span>
                </label>
                <pre>{description}</pre>
            </div>
            <div className="category-c">
                <p>{category}</p>
            </div>
        </div>
    );
}
