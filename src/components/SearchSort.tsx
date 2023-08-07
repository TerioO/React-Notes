import React, { useState } from "react";
import Select, { OptionWrapper } from "./utils/Select";

// Redux:
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { sortParams, noteDisplay } from "../slices/db-slice";
import { searchQuery, sortNotes, noteDisplayAction } from "../slices/db-slice";

type Props = {};

export default function SearchSort({}: Props) {
    const db = useAppSelector((state) => state.db);
    const dispatch = useAppDispatch();

    const [sortValue, setSortValue] = useState<string>(db.settings.sort);
    const [searchTerm, setSearchTerm] = useState<string>(db.settings.search);

    function handleSearch(e: React.MouseEvent<HTMLFormElement>) {
        e.preventDefault();
        dispatch(dispatch(searchQuery(searchTerm.toLowerCase())));
    }

    // If using Redux, don't do this, just add a click function to the option and dispatch the payload....
    // useEffect(() => {
    //     dispatch(sortNotes(sortValue));
    // }, [sortValue]);

    const [noteCardSelect, setNoteCardSelect] = useState<string>( db.settings.noteDisplay );

    return (
        <div className="search-sort-c">
            <div className="sort-c">
                <p>Sort Notes</p>
                <div className="select-wrapper">
                    <Select selectValue={db.settings.sort} inputHtmlFor="sort">
                        {sortParams.map((el) => (
                            <React.Fragment key={el}>
                                <OptionWrapper
                                    inputHtmlFor="sort"
                                    setSelectValue={setSortValue}
                                    value={el}
                                    handleClick={() => dispatch(sortNotes(el))}
                                ></OptionWrapper>
                            </React.Fragment>
                        ))}
                    </Select>
                </div>
            </div>
            <div className="note-card-setting">
                <p>Note card aspect</p>
                <div className="select-wrapper">
                    <Select
                        selectValue={db.settings.noteDisplay}
                        inputHtmlFor="input-sel-card"
                    >
                        {noteDisplay.map((el) => (
                            <React.Fragment key={el}>
                                <OptionWrapper
                                    setSelectValue={setNoteCardSelect}
                                    value={el}
                                    inputHtmlFor="input-sel-card"
                                    handleClick={() => dispatch(noteDisplayAction(el))}
                                />
                            </React.Fragment>
                        ))}
                    </Select>
                </div>
            </div>
            <div className="display-search-term">
                <p>Search term:</p>
                <p>{db.settings.search}</p>
            </div>
            <form className="search-c" onSubmit={handleSearch}>
                <input
                    type="text"
                    placeholder="Search in title, description"
                    className="search-input"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <div className="border"></div>
                <button>
                    {" "}
                    <span className="material-symbols-outlined icon">
                        search
                    </span>
                </button>
            </form>
            <p style={{display: 'none'}}>{sortValue}{noteCardSelect}</p>
        </div>
    );
}
