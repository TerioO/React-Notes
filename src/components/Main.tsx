import Dashboard from "./Dashboard";
import NotesList from "./NotesList";

type Props = {};

export default function Main({}: Props) {
    return (
        <main className="main-c">
            <Dashboard></Dashboard>
            <NotesList></NotesList>
        </main>
    );
}
