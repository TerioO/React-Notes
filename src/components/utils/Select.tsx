import { SetStateAction } from "react";

type Props = {
    children: React.ReactNode;
    selectValue: string;
    inputHtmlFor: string;
};

export default function Select({children, selectValue, inputHtmlFor}: Props) {

    return (
        <>
            <input
                type="checkbox"
                // open-select
                id={inputHtmlFor}
                className="select-component-checkbox"
            />
            <div className="select-c">
                <label htmlFor={inputHtmlFor}>
                    <div className="initial">
                        <p className="value">{selectValue}</p>
                        <span className="material-symbols-outlined icon">
                            change_history
                        </span>
                    </div>
                </label>
                <div className="options">
                    {children}
                </div>
            </div>
        </>
    );
}

type OptionProps = {
    setSelectValue: React.Dispatch<SetStateAction<string>>;
    value: string;
    inputHtmlFor: string;
    handleClick?: () => void;
}

export function OptionWrapper({setSelectValue, value, inputHtmlFor, handleClick}: OptionProps) {
    return (
        <label htmlFor={inputHtmlFor} onClick={handleClick}>
            <p onClick={() => setSelectValue(value)}>{value}</p>
        </label>
    );
}
