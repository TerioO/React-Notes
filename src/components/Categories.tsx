import { useRef, useState } from "react";
import Modal from "./utils/Modal";

// Redux:
import { useAppSelector, useAppDispatch } from "../app/hooks";
import {
    addCategory,
    deleteCategory,
    addNote,
    increaseCategoryCount,
    displayAllCategories,
    displayCategory
} from "../slices/db-slice";
import dayjs, { Dayjs } from "dayjs";
import Select, { OptionWrapper } from "./utils/Select";
import React from "react";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";

type Props = {};

export default function Categories({}: Props) {
    const db = useAppSelector((state) => state.db);
    const dispatch = useAppDispatch();

    // Add new category:
    const [addCategoryModal, setAddCategoryModal] = useState<boolean>(false);
    const [newCategory, setNewCategory] = useState<string>("");
    function handleAddCategory() {
        dispatch(addCategory(newCategory));
        setAddCategoryModal(false);
    }

    // Delete category:
    const [deleteCategoryModal, setDeleteCategoryModal] =
        useState<boolean>(false);
    const [indexToDelete, setIndexToDelete] = useState<number>(0);
    const [categoryToDelete, setCategoryToDelete] = useState<string>("");
    function handleDeleteCategory() {
        dispatch(
            deleteCategory({
                index: indexToDelete,
                categoryDeleted: categoryToDelete,
            })
        );
        setDeleteCategoryModal(false);
    }

    // Add new note to category:
    const [addNoteModal, setAddNoteModal] = useState<boolean>(false);
    const [title, setTitle] = useState<string>("");
    const [selectCategory, setSelectCategory] = useState<string>(
        db.categories[0].category
    );
    const [date, setDate] = useState<Dayjs | null>(dayjs());
    const [time, setTime] = useState<Dayjs | null>(dayjs());
    const [description, setDescription] = useState<string>("");

    function handleAddNoteSubmit(e: React.MouseEvent<HTMLFormElement>) {
        e.preventDefault();
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
        setAddNoteModal(false);
        resetFormValues();
    }

    function resetFormValues() {
        setTitle("");
        setSelectCategory(db.categories[0].category);
        setDate(dayjs());
        setTime(dayjs());
        setDescription("");
    }

    const openCategoriesRef = useRef<HTMLSpanElement>(null);
    function openAllNotes(){
        if(openCategoriesRef.current?.className === "material-symbols-outlined icon open"){
            dispatch(displayAllCategories(false));
        }
        else {
            dispatch(displayAllCategories(true))
        }
    }

    return (
        <>
            <div className="categories-c">
                <div className="title-c">
                    <p>Categories</p>
                    <div className="btns">
                        <span
                            className="material-symbols-outlined icon"
                            title="Add new category"
                            onClick={() => {
                                setNewCategory("");
                                setAddCategoryModal(true);
                            }}
                        >
                            add
                        </span>
                        <span
                            className={db.categories.some((el) => el.display === false) ? "material-symbols-outlined icon" : "material-symbols-outlined icon open"}
                            title="Open categories"
                            onClick={openAllNotes}
                            ref={openCategoriesRef}
                        >
                            folder_open
                        </span>
                    </div>
                </div>
                <div className="items-c">
                    {db.categories.map((el, index) => (
                        <div className="single-item" key={el.category}>
                            <p className="category-name" title={el.category}>{el.category}</p>
                            <div className="btns">
                                <span
                                    className="material-symbols-outlined icon"
                                    title="Add note to category"
                                    onClick={() => {
                                        resetFormValues();
                                        setSelectCategory(el.category);
                                        setAddNoteModal(true);
                                    }}
                                >
                                    add
                                </span>
                                <span
                                    className="material-symbols-outlined icon"
                                    title="Delete cateogy and notes"
                                    onClick={() => {
                                        setIndexToDelete(index);
                                        setCategoryToDelete(el.category);
                                        setDeleteCategoryModal(true);
                                    }}
                                >
                                    delete
                                </span>
                                <span
                                    className={el.display ? "material-symbols-outlined icon open" : "material-symbols-outlined icon"}
                                    title="Open notes in category"
                                    onClick={() => dispatch(displayCategory(index))}
                                >
                                    folder_open
                                </span>
                                <p>{el.count > 9 ? "9+" : el.count}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <Modal
                showModal={addCategoryModal}
                setShowModal={setAddCategoryModal}
            >
                <div className="add-new-category-c">
                    <p>Create a new category</p>
                    <input
                        type="text"
                        placeholder="E.g: Projects"
                        autoFocus
                        value={newCategory}
                        onChange={(e) => setNewCategory(e.target.value)}
                    />
                    <div className="btns">
                        <p onClick={handleAddCategory}>ADD</p>
                        <p onClick={() => setAddCategoryModal(false)}>EXIT</p>
                    </div>
                </div>
            </Modal>
            <Modal
                showModal={deleteCategoryModal}
                setShowModal={setDeleteCategoryModal}
            >
                <div className="add-new-category-c">
                    <p>Delete category and all notes associated?</p>
                    <p className="category">{categoryToDelete}</p>
                    <div className="btns">
                        <p onClick={handleDeleteCategory}>YES</p>
                        <p onClick={() => setDeleteCategoryModal(false)}>NO</p>
                    </div>
                </div>
            </Modal>
            <Modal showModal={addNoteModal} setShowModal={setAddNoteModal}>
                <form onSubmit={handleAddNoteSubmit} className="add-note-form">
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
                            <Select selectValue={selectCategory} inputHtmlFor="open-select2">
                                {db.categories.map((el) => (
                                    <React.Fragment key={el.category}>
                                        <OptionWrapper
                                            inputHtmlFor="open-select2"
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
                        onClick={() => setAddNoteModal(false)}
                    >
                        <span className="material-symbols-outlined icon">
                            close
                        </span>
                    </div>
                </form>
            </Modal>
        </>
    );
}
