import React, { useState } from "react";
import Modal from "./utils/Modal";
import NoteCard from "./NoteCard";
import Select, { OptionWrapper } from "./utils/Select";

// MUI:
import { DatePicker } from "@mui/x-date-pickers";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import dayjs, { Dayjs } from "dayjs";

// Redux:
import { useAppSelector, useAppDispatch } from "../app/hooks";
import type { Notes } from "../slices/db-slice";
import { editNote, deleteNote } from "../slices/db-slice";

type Props = {};

export default function NotesList({}: Props) {
    const db = useAppSelector((state) => state.db);
    const dispatch = useAppDispatch();

    const [showEditModal, setShowEditModal] = useState<boolean>(false);

    const [title, setTitle] = useState<string>("");
    const [selectCategory, setSelectCategory] = useState<string>(
        db.categories[0].category
    );
    const [date, setDate] = useState<Dayjs | null>(dayjs());
    const [time, setTime] = useState<Dayjs | null>(dayjs());
    const [description, setDescription] = useState<any>("");

    function handleDeleteNote(index: number, category: string) {
        dispatch(deleteNote({ noteIndex: index, noteCategory: category }));
    }

    const [previousCategory, setPreviousCategory] = useState<string>("");
    const [editNoteIndex, setEditNoteIndex] = useState<number>(0);
    function initEditForm(el: Notes, i: number) {
        setTitle(el.title);
        setSelectCategory(el.category);
        setDate(dayjs(JSON.parse(el.date)));
        setTime(dayjs(JSON.parse(el.time)));
        setDescription(el.description);
        setEditNoteIndex(i);
        setPreviousCategory(el.category);
        setShowEditModal(true);
    }

    function handleEdit(e: React.MouseEvent<HTMLFormElement>) {
        e.preventDefault();
        dispatch(
            editNote({
                index: editNoteIndex,
                previousCategory: previousCategory,
                editValues: {
                    title: title,
                    category: selectCategory,
                    date: JSON.stringify(date),
                    time: JSON.stringify(time),
                    description: description,
                },
            })
        );
        setShowEditModal(false);
    }

    return (
        <div className="notes-c " style={{flexDirection: db.settings.noteDisplay == 'Minimal' ? 'column' : 'row'}}>
            {db.notes.map((el, index) => {
                if (
                    db.categories.some(
                        (cat) =>
                            cat.display == true && cat.category === el.category
                    ) &&
                    (el.title.toLowerCase().includes(db.settings.search) ||
                        el.description
                            ?.toLocaleLowerCase()
                            .includes(db.settings.search))
                ) {
                    return (
                        <React.Fragment key={`${el.date}`}>
                            <NoteCard
                                title={el.title}
                                category={el.category}
                                date={el.date}
                                time={el.time}
                                description={el.description}
                                openModal={() => initEditForm(el, index)}
                                deleteNote={() =>
                                    handleDeleteNote(index, el.category)
                                }
                            ></NoteCard>
                        </React.Fragment>
                    );
                }
            })}
            <Modal showModal={showEditModal} setShowModal={setShowEditModal}>
                <form onSubmit={handleEdit} className="add-note-form">
                    <p className="form-title">Edit</p>
                    <div className="title-category-c">
                        <input
                            type="text"
                            className="new-note-title"
                            placeholder="Title ..."
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            autoFocus
                            required
                        />
                        <p>Category</p>
                        <div className="sel-c">
                            <Select
                                selectValue={selectCategory}
                                inputHtmlFor="open-select3"
                            >
                                {db.categories.map((el) => (
                                    <React.Fragment key={el.category}>
                                        <OptionWrapper
                                            inputHtmlFor="open-select3"
                                            setSelectValue={setSelectCategory}
                                            value={el.category}
                                        ></OptionWrapper>
                                    </React.Fragment>
                                ))}
                            </Select>
                        </div>
                    </div>
                    <div className="datepicker-c">
                        <DatePicker
                            value={date}
                            label="Choose a date"
                            onChange={(newValue) => setDate(newValue)}
                        ></DatePicker>
                    </div>
                    <div className="timepicker-c">
                        <TimePicker
                            value={time}
                            label="Choose time"
                            onChange={(newValue) => setTime(newValue)}
                        ></TimePicker>
                    </div>
                    <div className="textarea-c">
                        <p>Description</p>
                        <textarea
                            name=""
                            id=""
                            cols={8}
                            rows={8}
                            placeholder="Description: ..."
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        ></textarea>
                    </div>
                    <button>
                        <span className="material-symbols-outlined icon edit">
                            edit
                        </span>
                        <p>Edit note</p>
                    </button>
                    <div
                        className="close-btn"
                        onClick={() => setShowEditModal(false)}
                    >
                        <span className="material-symbols-outlined icon">
                            close
                        </span>
                    </div>
                </form>
            </Modal>
        </div>
    );
}
