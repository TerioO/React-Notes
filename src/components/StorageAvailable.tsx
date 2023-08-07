import { useState } from "react";
import Modal from "./utils/Modal";

// Redux:
import { useAppSelector, useAppDispatch } from "../app/hooks";
import { deleteDb, openPopup, setDb } from "../slices/db-slice";
import type { DB } from "../slices/db-slice";
import { sortParams, noteDisplay } from "../slices/db-slice";

type Props = {};

export default function StorageAvailable({}: Props) {
    const db = useAppSelector((state) => state.db);
    const dispatch = useAppDispatch();

    const [deleteModal, setDeleteModal] = useState<boolean>(false);
    function handleDeleteStorage() {
        dispatch(deleteDb());
        setDeleteModal(false);
    }

    const [exportModal, setExportModal] = useState<boolean>(false);
    function handleExportDb() {
        if (navigator.clipboard) {
            navigator.clipboard.writeText(JSON.stringify(db)).then(
                () => dispatch(openPopup("Successfully copied to clipboard!")),
                () => dispatch(openPopup("Copying Failed!"))
            );
        } else {
            dispatch(openPopup("Browser doesn't support this feature"));
        }
        setExportModal(false);
    }

    const [importModal, setImportModal] = useState<boolean>(false);
    const [importedDb, setImportedDb] = useState<string>("");
    // Check if user inputed db object contains:
    //      - Correctly named properties and if there aren't added properties
    //      - The correct type of values for those properties
    //      - If the categories from the notes are included in categories array 
    //      - If the sort parameters are not modified from the allowed ones!
    function handleImportDb() {
        try {
            const parsedDb: DB = JSON.parse(importedDb);
            let properties = ['categories', 'notes', 'popup', 'settings'];
            let checks = {
                category: true,
                notes: true,
                popup: true,
                settings: true,
            };
            if (
                typeof parsedDb === "object" &&
                "categories" in parsedDb &&
                "notes" in parsedDb &&
                "popup" in parsedDb &&
                "settings" in parsedDb &&
                properties.length === Object.keys(parsedDb).length &&
                properties.every((el) => {
                    return Object.keys(parsedDb).includes(el);
                })
            ) {
                if (Array.isArray(parsedDb.categories)) {
                    checks.category = parsedDb.categories.every((el) => {
                        return (
                            typeof el == "object" &&
                            typeof el.category == "string" && "category" in el &&
                            typeof el.count == "number" && "count" in el &&
                            typeof el.display == "boolean" && "display" in el                                                    
                        );
                    });
                }
                if(Array.isArray(parsedDb.notes)) {
                    checks.notes = parsedDb.notes.every((el) => {
                        return (
                            typeof el == "object" &&
                            typeof el.category == 'string' && 'category' in el &&
                            typeof el.date == 'string' && 'date' in el &&
                            typeof el.description == 'string' && 'description' in el &&
                            typeof el.time == 'string' && 'time' in el &&
                            typeof el.title == 'string' && 'title' in el &&
                            parsedDb.categories.some(cat => el.category == cat.category)
                        )
                    })
                }
                let p = parsedDb.popup;
                checks.popup = (
                    typeof p.message == 'string' && 'message' in p &&
                    typeof p.open == 'boolean' && 'open' in p    
                )
                let s = parsedDb.settings;
                checks.settings = (
                    typeof s.search == 'string' && 'search' in s &&
                    typeof s.sort == 'string' && 'sort' in s &&
                    typeof s.daysToNotify == 'number' && 'daysToNotify' in s &&
                    s.daysToNotify >= 2 &&
                    noteDisplay.includes(s.noteDisplay) && 'noteDisplay' in s &&
                    sortParams.includes(s.sort)
                )
                if(Object.values(checks).includes(false)) {
                    dispatch(openPopup("Invalid object: missing/modified/changed property or values"));
                }
                else {
                    dispatch(setDb(parsedDb));
                    dispatch(openPopup("Successfully copied Notes!"));
                }
            }
            else {
                dispatch(openPopup("Invalid object: missing/modified/changed property or values"));
            }
        } catch (error) {
            dispatch(openPopup("Parsing error, check if the data is valid."));
        }
        setImportedDb("");
        setImportModal(false);
    }

    return (
        <div className="storage-c">
            <div className="icons-c">
                <div className="import-c" onClick={() => setImportModal(true)}>
                    <p>Import</p>
                    <span className="material-symbols-outlined">upload</span>
                </div>
                <div className="storage-icon-wrapper">
                    <span
                        className="material-symbols-outlined storage-icon"
                        onClick={() => setDeleteModal(true)}
                    >
                        hard_drive
                    </span>
                </div>
                <div className="export-c" onClick={() => setExportModal(true)}>
                    <span className="material-symbols-outlined">download</span>
                    <p>Export</p>
                </div>
            </div>
            <div className="progress-bar-wrapper">
                <div className="progress-bar">
                    <p>
                        {(JSON.stringify(db).length / 1000).toFixed(2)}KB / 5MB
                    </p>
                    <div
                        className="filled"
                        style={{
                            width: `${Math.floor(
                                (JSON.stringify(db).length / 1000 / 5000) * 100
                            )}%`,
                        }}
                    ></div>
                </div>
            </div>
            <Modal showModal={deleteModal} setShowModal={setDeleteModal}>
                <div className="storage-modal">
                    <p>Delete all notes from storage?</p>
                    <p>
                        Unless you get a backup, this action cannot be reversed
                    </p>
                    <div className="btns">
                        <p onClick={handleDeleteStorage}>DELETE</p>
                        <p onClick={() => setDeleteModal(false)}>NEVERMIND</p>
                    </div>
                </div>
            </Modal>
            <Modal showModal={exportModal} setShowModal={setExportModal}>
                <div className="storage-modal">
                    <p>Copy Notes object to clipboard?</p>
                    <div className="btns">
                        <p onClick={() => handleExportDb()}>YES</p>
                        <p onClick={() => setExportModal(false)}>NO</p>
                    </div>
                </div>
            </Modal>
            <Modal showModal={importModal} setShowModal={setImportModal}>
                <div className="storage-modal">
                    <p>Paste the exported notes: </p>
                    <textarea
                        placeholder="Insert data..."
                        value={importedDb}
                        onChange={(e) => setImportedDb(e.target.value)}
                    ></textarea>
                    <div className="btns">
                        <p onClick={() => handleImportDb()}>DONE</p>
                        <p onClick={() => setImportModal(false)}>EXIT</p>
                    </div>
                </div>
            </Modal>
        </div>
    );
}
