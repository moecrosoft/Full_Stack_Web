import { useState, useEffect, useRef } from 'react';
import { supabase } from '../../utils/supabaseClient';

export default function Files() {
    const [files, setFiles] = useState([]);
    const fileInputRef = useRef(null);

    useEffect(() => {
        fetchFiles();
    }, [])

    const fetchFiles = async () => {
        const { data } = await supabase.from('sources').select('*').order('created_at', {ascending: false});
        setFiles(data);
    };

    const handleUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const fileName = `${Date.now()}_${file.name}`;
        const { error } = await supabase.storage.from('sources').upload(fileName,file);

        if (error) return alert(error.message);

        const url = supabase.storage.from('sources').getPublicUrl(fileName).data.publicUrl;
        await supabase.from('sources').insert([{title: file.name, file_url: url, file_type: file.type}]);
        fetchFiles();
    }

    const handleDelete = async (id, fileUrl) => {
        const { error } = await supabase
            .from('sources')
            .delete()
            .eq('id', id);

        if (error) return alert(error.message);

        try {
            const fileName = fileUrl.split('/').pop().split('?')[0];
            await supabase.storage.from('sources').remove([fileName]);
        } catch (err) {
            console.warn('Storage delete failed:', err.message);
        }

        setFiles((prev) => prev.filter((s) => s.id !== id));
    };

    return (
        <div className='p-6 min-h-screen w-full bg-[#1c1c1c] font-sans text-gray-200'>
            <h2 className='text-2xl font-semibold mb-6 text-gray-100'>Files</h2>

            <input 
                type='file' 
                ref={fileInputRef} 
                onChange={handleUpload} 
                className='hidden' 
            />

            <button
                onClick={() => fileInputRef.current.click()}
                className="bg-blue-600 text-white mb-6 px-4 py-2 rounded-lg hover:bg-blue-700 transition"
            >
                Upload Files
            </button>

            {files && files.length > 0 ? (
                <div className='flex flex-col gap-4'>
                    {files.map((file) => (
                        <div
                            key={file.id}
                            className="relative bg-[#2a2a2a] shadow rounded transition p-3 hover:bg-[#3a3a3a]"
                        >
                            <a 
                                key={file.id} 
                                href={file.file_url} 
                                target='_blank' 
                                className='block p-2 rounded hover:bg-[#3a3a3a]'
                            >
                                <span className='font-medium text-gray-200'>{file.title}</span> {' '}
                                <span className='text-sm text-gray-400'>{file.file_type}</span>
                            </a>   
                            <button
                                onClick={() => handleDelete(file.id, file.file_url)}
                                className='absolute bottom-2 right-2 bg-red-600 text-white px-2 py-1 rounded hover:bg-red-700 transition'
                            >
                                Delete
                            </button> 
                        </div>
                    ))}
                </div>
                ) : (
                    <p className='text-gray-500'>No sources uploaded yet.</p>
            )}
        </div>
    )
}