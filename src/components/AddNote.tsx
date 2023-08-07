import { useState } from "react";
import Modal from "./utils/Modal";
import Select, { OptionWrapper } from "./utils/Select";

// Redux:
import { useAppSelector, useAppDispatch } from "../app/hooks";
import { addNote, increaseCategoryCount } from "../slices/db-slice";

// MUI:
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import dayjs, { Dayjs } from "dayjs";
import React from "react";

type Props = {};

export default function AddNote({}: Props) {
    const db = useAppSelector((state) => state.db);
    const dispatch = useAppDispatch();

    const [showModal, setShowModal] = useState<boolean>(false);

    const [title, setTitle] = useState<string>("");
    const [selectCategory, setSelectCategory] = useState<string>(
        db.categories[0].category
    );
    const [date, setDate] = useState<Dayjs | null>(dayjs());
    const [time, setTime] = useState<Dayjs | null>(dayjs());
    const [description, setDescription] = useState<string>("");

    function handleSubmit(e: React.MouseEvent<HTMLFormElement>) {
        e.preventDefault();
        // If returning directly dayjs date to redux this error occurs:
        // Error: A non-serializable value was detected in the state
        // So format it beforehand
        dispatch(
            addNote({
                title: title,
                category: selectCategory,
                date: JSON.stringify(date),
                time: JSON.stringify(time),
                description: description,
            })
        );
        dispatch(increaseCategoryCount({ categoryToIncrease: selectCategory }));
        resetFormValues();
        setShowModal(false);
    }

    function resetFormValues() {
        setTitle("");
        setSelectCategory(db.categories[0].category);
        setDate(dayjs());
        setTime(dayjs());
        setDescription("");
    }

    return (
        <div className="add-note-c">
            <span
                className="material-symbols-outlined icon"
                onClick={() => setShowModal(true)}
            >
                &#xe147;
            </span>
            <Modal showModal={showModal} setShowModal={setShowModal}>
                <form onSubmit={handleSubmit} className="add-note-form">
                    <p className="form-title">Add a new note</p>
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
                                inputHtmlFor="open-select1"
                            >
                                {db.categories.map((el) => (
                                    <React.Fragment key={el.category}>
                                        <OptionWrapper
                                            inputHtmlFor="open-select1"
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
                        <span className="material-symbols-outlined icon">
                            add
                        </span>
                        <p>Add note</p>
                    </button>
                    <div
                        className="close-btn"
                        onClick={() => setShowModal(false)}
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
