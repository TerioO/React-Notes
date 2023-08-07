import { useEffect, useState } from "react";
import Header from "../components/Header";
import Main from "../components/Main";
import PopupMessage from "../components/utils/PopupMessage";

// Redux:
import { useAppSelector, useAppDispatch } from "./hooks";
import { setDb, openPopup } from "../slices/db-slice";

type Props = {};

export default function App({}: Props) {
    const db = useAppSelector((state) => state.db);
    const dispatch = useAppDispatch();

    const [rendered, setRendered] = useState<boolean>(false);
    useEffect(() => {
        if (!localStorage.db) {
            localStorage.db = JSON.stringify(db);
        } 
        else {
            dispatch(setDb(JSON.parse(localStorage.db)));
        }
        setRendered(true);
    }, []);

    // Only run this useEffect after the app has mounted, otherwise this runs on initial render as well and localStorage is populated with empty db
    useEffect(() => {
        if (rendered) {
            try {
                localStorage.db = JSON.stringify(db);
            }
            catch(error){
                dispatch(setDb(JSON.parse(localStorage.db)));
                dispatch(openPopup('Storage full!'));
            }
 
        }
    }, [db]);

    return (
        <>
            <Header></Header>
            <Main></Main>
            <PopupMessage></PopupMessage>
        </>
    );
}
