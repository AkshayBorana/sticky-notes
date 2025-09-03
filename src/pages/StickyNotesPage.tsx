import { useEffect, useRef, useState, type RefObject } from "react";
import NoteCard from "../components/NoteCard";
import type { Note } from "../types/Note";
import { getRandomColor } from "../utils";

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
            <div>
                <button style={{ color: "#fff" }} onClick={addNote}>Add note</button>
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
                    bottom: '10px',
                    right: '10px',
                    width: '50px',
                    height: '50px',
                    backgroundColor: 'lightgray',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '30px',
                    zIndex: 1000,
                    cursor: 'pointer',
                }}
            >
                🗑️
            </div>
        </div>
    )
}

export default StickyNotesPage;