'use client';

import { useState, useEffect, useRef } from 'react';
import { supabase } from '../../utils/supabaseClient';

export default function Images() {
    const [images, setImages] = useState([]);
    const fileInputRef = useRef(null);
    const [imageName, setImageName] = useState('');
    const [fileSelected, setFileSelected] = useState(null);

    useEffect(() => {
        fetchImages();
    },[]);

    const fetchImages = async () => {
        const { data } = await supabase.from('images').select('*').order('created_at', { ascending: false });
        setImages(data || []);
    }

    const handleUpload = async () => {
        if (!imageName) return alert('Please enter an image name.');
        if (!fileSelected) return alert('Please select a file');

        const fileName = `${Date.now()}_${fileSelected.name}`;
        const { data, error } = await supabase.storage.from('images').upload(fileName,fileSelected);
        if(error) return alert(error.message);

        const url = supabase.storage.from('images').getPublicUrl(fileName).data.publicUrl;

        await supabase.from('images').insert([{image_name: imageName, image_url: url}])

        setImageName('');
        setFileSelected(null);
        fetchImages();
    }

    const handleDelete = async (id, imageUrl) => {
        const { error } = await supabase.from('images').delete().eq('id', id);
        if (error) return alert(error.message);

        try {
            const urlParts = imageUrl.split('/');
            const fileName = urlParts[urlParts.length - 1].split('?')[0]; 
            await supabase.storage.from('images').remove([fileName]);
        } catch (err) {
            console.warn('Failed to delete from storage:', err.message);
        }

        setImages(images.filter(img => img.id !== id));
    }

    return (
        <div className='min-h-screen w-full bg-[#1c1c1c] font-sans text-gray-200 p-6'>
            <h2 className='text-2xl font-semibold mb-6 text-gray-100'>Images</h2>

            <div className="flex flex-col md:flex-row gap-4 mb-6 w-full max-w-lg">
                <input
                    type='text'
                    placeholder='Image Name'
                    value={imageName}
                    onChange={(e) => setImageName(e.target.value)}
                    className='flex-1 bg-[#2a2a2a] border border-[#3a3a3a] p-3 rounded-lg text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500'
                />
                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={(e) => setFileSelected(e.target.files[0])}
                    className="hidden"
                />

                <button
                    onClick={() => {
                        if (!imageName) return;

                        if (!fileSelected) {
                        fileInputRef.current.click(); // choose file
                        } else {
                        handleUpload(); // upload
                        }
                    }}
                    className={`px-4 py-2 rounded-lg cursor-pointer transition ${
                        !imageName
                        ? "bg-gray-600 text-gray-400 cursor-not-allowed"
                        : fileSelected
                        ? "bg-blue-600 text-white hover:bg-blue-700"
                        : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                    }`}
                    disabled={!imageName}
                    >
                    {fileSelected ? "Upload Image" : "Choose File"}
                </button>
            </div>

            <div className='flex flex-col gap-6 w-full max-w-lg'>
                {images.map((image) => (
                    <div 
                        key={image.id} 
                        className='bg-[#2a2a2a] rounded-xl shadow hover:shadow-lg transition-shadow duration-200 overflow-hidden flex flex-col items-center p-4 relative'
                    >
                        <div className='w-full h-64 bg-[#1f1f1f] rounded-md mb-3 flex items-center justify-center overflow-hidden'>
                            <img 
                                src={image.image_url} 
                                alt={image.food_name} 
                                className='max-h-full object-contain'
                            />
                        </div>
                        <p className="text-gray-200 font-medium text-center">{image.image_name}</p>
                        <button
                            onClick={() => handleDelete(image.id, image.image_url)}
                            className='absolute bottom-2 right-2 bg-red-600 text-white px-2 py-1 rounded hover:bg-red-700 transition cursor-pointer'
                        >
                            Delete
                        </button>
                    </div>
                ))}
            </div>
        </div>
    )
}
