import { useEffect, useRef, useState, type RefObject } from "react";
import NoteCard from "../components/NoteCard";
import type { Note } from "../types/Note";
import { getRandomColor } from "../utils";
import Trash from "../icons/Trash";

const StickyNotesPage: React.FC = () => {
    const [notes, setNotes] = useState<Note[]>([]);
    const trashRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        initNotes();
    }, [])

    const initNotes = (): void => {
        const data: [] = JSON.parse(localStorage.getItem('notes') || '') || [];
        setNotes(data);
    }

    const addNote = (): void => {
        const newNote = {
            id: `${Date.now() - Math.random()}`,
            body: '',
            position: { x: 350, y: 20 },
            color: getRandomColor()
        };
        const allNotes = [...(JSON.parse(localStorage.getItem('notes') || '') || []), newNote];
        localStorage.setItem('notes', JSON.stringify(allNotes));
        setNotes(allNotes);
    }

    const handleDragOverTrash = (noteRef: RefObject<HTMLDivElement | null>, noteId: number): void => {
        const noteRect = noteRef && noteRef.current && noteRef.current.getBoundingClientRect();
        const trashRect = trashRef && trashRef.current && trashRef.current.getBoundingClientRect();
        if (
            noteRect!.right > trashRect!.left &&
            noteRect!.left < trashRect!.right &&
            noteRect!.bottom > trashRect!.top &&
            noteRect!.top < trashRect!.bottom
        ) {
            const updatedNotes = notes.filter((n) => n.id !== noteId);
            localStorage.setItem('notes', JSON.stringify(updatedNotes));
            setNotes(updatedNotes);
        }
    }

    return (
        <div>
            <div className="add-note">
                <button style={{
                    color: "green",
                    width: "120px",
                    height: '40px',
                    fontSize: '14px',
                    backgroundColor: 'hsl(1, 100%, 900%)',
                    borderRadius: '4px'
                }} onClick={addNote}>Add note</button>
            </div>
            {
                notes.map((note) => (
                    <NoteCard key={note.id} note={note} setNotes={setNotes} trashRef={trashRef} onDragOverTrash={handleDragOverTrash} />
                ))
            }

            <div
                ref={trashRef}
                style={{
                    position: 'fixed',
                    bottom: '20px',
                    right: '20px',
                    width: '70px',
                    height: '70px',
                    backgroundColor: 'hsl(1, 100%, 900%)',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 1000,
                    cursor: 'pointer',
                }}
            >
                <Trash />
            </div>
        </div>
    )
}

export default StickyNotesPage;