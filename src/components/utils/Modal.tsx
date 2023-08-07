import React, { SetStateAction, useEffect, useRef } from "react";

type Props = {
    showModal: boolean;
    setShowModal: React.Dispatch<SetStateAction<boolean>>;
    children: React.ReactNode;
};

export default function Modal({ showModal, setShowModal, children }: Props) {
    // Make <header> overflow-y visible for small device, otherwise the modal bg doesn't go outside the <header>
    // Remove <body> overflow so that when modal is open, user can't scroll outside it (small devices are guilty of this!)
    useEffect(() => {
        if (showModal) {
            document .querySelector("header") ?.classList.add("header-oveflowY-visible");
            document .querySelector("body") ?.classList.add("body-overflow-hidden");
        } else {
            document .querySelector("header") ?.classList.remove("header-oveflowY-visible");
            document .querySelector("body") ?.classList.remove("body-overflow-hidden");
        }
    }, [showModal]);

    return (
        <ModalContent
            showModal={showModal}
            setShowModal={setShowModal}
            children={children}
        ></ModalContent>
    );
}

function ModalContent({ showModal, setShowModal, children }: Props) {
    if (!showModal) return null;

    const modalRef = useRef(null);
    function handleModalClose(e: React.MouseEvent<HTMLDivElement>) {
        if (e.target === modalRef.current) {
            setShowModal(false);
        }
    }

    return (
        <div
            className="modal-c"
            ref={modalRef}
            onClick={(e) => handleModalClose(e)}
        >
            {children}
        </div>
    );
}

// Note: Could've used MUI Modal component.... would've saved quite some time
// Why using 2 components? 
// Top component to store the useEffect and watch for showModal state change and remove/add the css classes accordingly
// Inner component: contains conditionals, which don't allow hooks so it would be impossible to remove the css styles according to showModal state change  n 

// [ Wrong version ] -------------------------------------------------------------------------------------------------------
// export default function Modal({ showModal, setShowModal, children }: Props) {
//     if (!showModal) return null;

//     useEffect(() => {
//         document.querySelector("header")?.classList.add("header-oveflowY-visible");
//         document.querySelector("body")?.classList.add("body-overflow-hidden");
//         return () => {
//             document.querySelector("header")?.classList.remove("header-oveflowY-visible");
//             document.querySelector("body")?.classList.remove("body-overflow-hidden");
//             console.log('modal unmounts')
//         }
//     }, [])

//     const modalRef = useRef(null);
//     function handleModalClose(e: React.MouseEvent<HTMLDivElement>) {
//         if (e.target === modalRef.current) {
//             document.querySelector("header")?.classList.remove("header-oveflowY-visible");
//             document.querySelector("body")?.classList.remove("body-overflow-hidden");
//             setShowModal(false);
//         }
//     }

//     return (
//         <div className="modal-c" ref={modalRef} onClick={(e) => handleModalClose(e)}>
//             {children}
//         </div>
//     );
// }