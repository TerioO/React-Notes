import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import dayjs from 'dayjs';

const sortParams = ['Default', 'Date asc', 'Date desc', 'Title asc', 'Title desc'];
const noteDisplay = ['Card', 'Minimal'];

interface DB {
    categories: Categories[];
    notes: Notes[];
    popup: Popup;
    settings: Settings;
}

interface Categories {
    category: string;
    count: number;
    display: boolean;
}

interface Notes {
    title: string;
    description: string | null;
    date: string;
    time: string;
    category: string;
}

interface Popup {
    message: string;
    open: boolean;
}

interface Settings {
    search: string;
    sort: string;
    noteDisplay: string;
    daysToNotify: number;
}

const initialState: DB = {
    categories: [
        { category: 'Work', count: 0, display: false },
        { category: 'School', count: 0, display: false, },
        { category: 'Art', count: 0, display: false, },
    ],
    notes: [],
    popup: {
        message: '',
        open: false
    },
    settings: {
        search: '',
        sort: 'Default',
        noteDisplay: noteDisplay[0],
        daysToNotify: 7,
    }
}

const dbSlice = createSlice({
    name: 'db',
    initialState,
    reducers: {
        addNote(state, action: PayloadAction<Notes>) {
            state.notes.push(action.payload);
        },
        deleteNote(state, action: PayloadAction<{ noteIndex: number, noteCategory: string }>) {
            const { noteIndex, noteCategory } = action.payload;

            const updateCategory = state.categories.find((el) => el.category == noteCategory);
            if (updateCategory) updateCategory.count -= 1;

            state.notes.splice(noteIndex, 1);
        },
        setDb(state, action: PayloadAction<DB>) {
            return { ...state, ...action.payload }
        },
        editNote(state, action: PayloadAction<{ index: number, previousCategory: string, editValues: Notes }>) {
            state.notes[action.payload.index] = action.payload.editValues;
            if (action.payload.previousCategory != action.payload.editValues.category) {
                for (let i = 0; i < state.categories.length; i++) {
                    if (state.categories[i].category === action.payload.editValues.category) {
                        state.categories[i].count += 1;
                    }
                    else if (state.categories[i].category === action.payload.previousCategory) {
                        state.categories[i].count -= 1;
                    }
                }
            }
        },
        increaseCategoryCount(state, action: PayloadAction<{ categoryToIncrease: string }>) {
            for (let i = 0; i < state.categories.length; i++) {
                if (state.categories[i].category === action.payload.categoryToIncrease) {
                    state.categories[i].count += 1;
                    break;
                }
            }
        },
        addCategory(state, action: PayloadAction<string>) {
            const name = action.payload;
            if (name.length > 0 && !state.categories.some((el) => el.category === name)) {
                state.categories.push({ category: name, count: 0, display: false });
            }
            else {
                state.popup.message = "Category already exists!"
                state.popup.open = true;
            }
        },
        deleteCategory(state, action: PayloadAction<{ index: number, categoryDeleted: string }>) {
            if (state.categories.length > 1) {
                const { index, categoryDeleted } = action.payload;
                state.categories.splice(index, 1);
                state.notes = state.notes.filter((el) => el.category != categoryDeleted)
            }
            else {
                state.popup.message = "At least 1 category must exist!"
                state.popup.open = true;
                return state;
            }
        },
        displayCategory(state, action: PayloadAction<number>) {
            const i = action.payload;
            if (state.categories[i].display == true) {
                state.categories[i].display = false;
            }
            else {
                state.categories[i].display = true;
            }
        },
        displayAllCategories(state, action: PayloadAction<boolean>) {
            state.categories.forEach((el) => {
                el.display = action.payload;
            })
        },
        // Called inside Popup Component when animation ends!
        closePopup(state) {
            state.popup.message = '';
            state.popup.open = false;
        },
        openPopup(state, action: PayloadAction<string>){
            state.popup.message = action.payload;
            state.popup.open = true;
        },
        searchQuery(state, action: PayloadAction<string>) {
            state.settings.search = action.payload;
        },
        sortNotes(state, action: PayloadAction<string>) {
            state.settings.sort = action.payload;
            if(action.payload == sortParams[1]){
                state.notes.sort((a, b) => {
                    const date1 = dayjs(JSON.parse(a.date));
                    const date2 = dayjs(JSON.parse(b.date));
                    return date1.diff(date2);
                })
            }
            else if(action.payload == sortParams[2]){
                state.notes.sort((a, b) => {
                    const date1 = dayjs(JSON.parse(a.date));
                    const date2 = dayjs(JSON.parse(b.date));
                    return date2.diff(date1);
                })
            }
            else if(action.payload == sortParams[3]){
                state.notes.sort((a, b) => {
                    if(a.title > b.title) return 1;
                    else if(a.title < b.title) return -1;
                    return 0;
                })
            }
            else if(action.payload == sortParams[4]){
                state.notes.sort((a, b) => {
                    if(a.title > b.title) return -1;
                    else if(a.title < b.title) return 1;
                    return 0;
                })
            }
            else if(action.payload == sortParams[0]){
                state.notes.sort((a, b) => {
                    if(a.category > b.category) return 1;
                    else if(a.category < b.category) return -1;
                    return 0;
                });
            }
        },
        deleteDb(){
            return initialState;
        },
        noteDisplayAction(state, action: PayloadAction<string>){
            state.settings.noteDisplay = action.payload;
        },
        setNotificationDays(state, action: PayloadAction<number>){
            state.settings.daysToNotify = action.payload;
        }
    }
})

export const { 
    addNote,
    deleteNote,
    setDb,
    editNote, 
    increaseCategoryCount, 
    addCategory, 
    deleteCategory, 
    closePopup, 
    displayCategory, 
    displayAllCategories, 
    searchQuery, 
    sortNotes,
    deleteDb,
    openPopup,
    noteDisplayAction,
    setNotificationDays
} = dbSlice.actions;
export default dbSlice.reducer;
export type { Notes, Categories, DB }
export { sortParams, noteDisplay }