import AddNote from "./AddNote";
import Categories from "./Categories";
import StorageAvailable from "./StorageAvailable";
import SearchSort from "./SearchSort";

type Props = {};

export default function Header({}: Props) {
    function  handleBodyOverflow(){
        // Use different class to hide body overflow from modal one otherwise user opens header then modal, closes modal and overflow is reset --> user scrolls when header open
        const checkbox = document.querySelector('#header-checkbox') as HTMLInputElement;
        if(checkbox.checked === false){
            document.querySelector('body')?.classList.add('body-input-overflow-hidden')
        }
        else {
            document.querySelector('body')?.classList.remove('body-input-overflow-hidden')
        }
    }

    return (
        <>
            <input type="checkbox" id="header-checkbox" />
            <header>
                <AddNote></AddNote>
                <Categories></Categories>
                <SearchSort></SearchSort>
                <StorageAvailable></StorageAvailable>
            </header>
            <label htmlFor="header-checkbox">
                <div className="checkbox-label-c" onClick={handleBodyOverflow}>
                    <span className="material-symbols-outlined icon">
                        &#xe5cf;
                    </span>
                </div>
            </label>
        </>
    );
}
