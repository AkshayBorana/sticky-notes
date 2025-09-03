import React, { useEffect, useRef, useState, type Dispatch, type RefObject, type SetStateAction } from "react";
import type { Note } from "../types/Note";
import { autoGrow, setNewOffset, setZIndex } from "../utils";
import Spinner from "../icons/Spinner";

interface NoteProps {
    note: Note;
    setNotes: Dispatch<SetStateAction<Note[]>>;
    trashRef: RefObject<HTMLDivElement | null>;
    onDragOverTrash: (noteRef: RefObject<HTMLDivElement | null>, noteId: number) => void;
}

const NoteCard: React.FC<NoteProps> = ({ note, setNotes, trashRef, onDragOverTrash }) => {
    // Ref for the card
    const noteCardRef = useRef<HTMLDivElement | null>(null);
    // Ref for the textarea element.
    const textAreaRef = useRef<HTMLTextAreaElement | null>(null);
    // To update X and Y use useState hook
    const [position, setPosition] = useState(note.position);
    const [saving, setSaving] = useState(false);
    const keyUpTimer = useRef<number | null>(null);

    // Set the initial mouse start position, as we don't know what that would be
    let mousePosition = { x: 0, y: 0 };

    // Set the card height to not display the vertical scroll bar.
    useEffect(() => {
        autoGrow(textAreaRef);
    }, []);

    // Change name to autoSetHeight.
    // const autoGrow = (textAreaRef: { current: any; }) => {
    //     const { current } = textAreaRef;
    //     current.style.height = "auto"; // Reset the height
    //     current.style.height = current.scrollHeight + "px"; // Set the new height
    // }

    // Mousedown drag event
    const mouseDown = (e: React.MouseEvent): void => {
        mousePosition.x = e.clientX;
        mousePosition.y = e.clientY;
        document.addEventListener('mousemove', mouseMove);
        document.addEventListener('mouseup', mouseUp);
        setZIndex(noteCardRef.current)
    }

    const mouseMove = (e: React.MouseEvent): void => {
        const mouseDirection = {
            x: mousePosition.x - e.clientX,
            y: mousePosition.y - e.clientY
        }
        mousePosition.x = e.clientX;
        mousePosition.y = e.clientY;
        const newPos = setNewOffset(noteCardRef, mouseDirection);
        setPosition(newPos);
    }

    const mouseUp = (): void => {
        document.removeEventListener("mousemove", mouseMove);
        document.removeEventListener("mouseup", mouseUp);
        const newPos = setNewOffset(noteCardRef);
        const allNotes = (JSON.parse(localStorage.getItem('notes') || '') || [])
            .map((n: Note) => {
                if (n.id === note.id) {
                    const updatedNote = { ...n, position: { ...n.position, x: newPos.x, y: newPos.y } }
                    return updatedNote;
                }
                else return n;
            });
        setNotes(allNotes);
        localStorage.setItem('notes', JSON.stringify(allNotes));

        if (noteCardRef.current && trashRef.current) {
            onDragOverTrash(noteCardRef, note.id)
        }
    };

    const handleKeyUp = (): void => {
        setSaving(true);

        if (keyUpTimer?.current) {
            clearTimeout(keyUpTimer.current);
        }

        keyUpTimer.current = setTimeout(() => {
            const allNotes = (JSON.parse(localStorage.getItem('notes') || '') || []).
                map((n: Note) => {
                    if (n.id === note.id) return { ...n, body: textAreaRef.current?.value };
                    else return n;
                });
            setNotes(allNotes);
            localStorage.setItem('notes', JSON.stringify(allNotes));
            setSaving(false);
        }, 2000);
    }


    return (
        <div
            ref={noteCardRef}
            className="card"
            style={{
                backgroundColor: note.color,
                left: `${position.x}px`,
                top: `${position.y}px`
            }}
        >
            <div
                onMouseDown={mouseDown}
                className="card-header" style={{
                    backgroundColor: note.color,
                }}>
                {
                    saving && (
                        <div className="card-saving">
                            <Spinner />
                            <span style={{ color: '#000000', fontSize: "14px" }}>Saving...</span>
                        </div>
                    )
                }
            </div>

            {/* Card body */}
            <div className="card-body">
                <textarea
                    ref={textAreaRef}
                    style={{ color: '#18181A' }}
                    defaultValue={note.body}
                    placeholder="Type your note here..."
                    onInput={() => autoGrow(textAreaRef)}
                    onFocus={() => { setZIndex(noteCardRef.current) }}
                    onKeyUp={handleKeyUp}
                ></textarea>
            </div>
        </div>
    );
};

export default NoteCard;
