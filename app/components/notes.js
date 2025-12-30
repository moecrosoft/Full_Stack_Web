'use client';

import { useState, useEffect } from 'react';
import { supabase } from '../../utils/supabaseClient';

export default function Notes() {
    const [notes, setNotes] = useState([]);
    const [noteContent, setNoteContent] = useState('');

    useEffect(() => {
        fetchNotes();
    },[]);

    const fetchNotes = async () => {
        const { data } = await supabase.from('notes').select('*').order('created_at', {ascending: false});
        setNotes(data || []);
    }

    const addNote = async () => {
        if (!noteContent) return;
        await supabase.from('notes').insert([{content: noteContent}])
        setNoteContent('');
        fetchNotes();
    }

    const handleDelete = async (id, imageUrl) => {
        const { error } = await supabase.from('notes').delete().eq('id', id);
        if (error) return alert(error.message);

        setNotes(notes.filter(note => note.id !== id));
    }

    return (
        <div className='p-6 min-h-screen bg-[#1c1c1c] font-sans text-gray-200 max-w-3xl mx-auto'>
            <h2 className='text-2xl font-semibold mb-6 text-gray-100'>Notes</h2>
            <div className='flex flex-col md:flex-row items-start md:items-center gap-4 mb-6 w-full max-w-3xl'>
                <textarea
                    value={noteContent}
                    onChange={(e) => setNoteContent(e.target.value)}
                    placeholder='Write a note...'
                    className='flex-1 p-4 bg-[#2a2a2a] border border-[#3a3a3a] rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-200 resize-none min-h-[100px] md:min-h-[120px]'
                    rows={4}
                />
                <button 
                    onClick={addNote} 
                    className='bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-3 rounded-lg transition-shadow shadow-md md:mt-0 mt-2 cursor-pointer'
                >
                    Add Note
                </button>
            </div>

            {notes && notes.length > 0 && (
                <div className='mt-6 space-y-4'>
                {notes.map((note) => (
                    <div 
                        key={note.id} 
                        className='relative bg-[#2a2a2a] p-4 rounded-xl shadow hover:shadow-lg transition-shadow duration-200'
                    >
                        <p className="text-gray-200 font-medium">{note.content}</p>
                        <p className="text-gray-400 text-sm mt-2">
                            {new Date(note.created_at).toLocaleString()}
                        </p>
                        <button
                                onClick={() => handleDelete(note.id)}
                                className='absolute bottom-2 right-2 bg-red-600 text-white px-2 py-1 rounded hover:bg-red-700 transition cursor-pointer'
                            >
                                Delete
                            </button> 
                    </div>
                ))}
            </div>
            )}
        </div>
    )
}
