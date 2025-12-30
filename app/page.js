'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from './components/Sidebar';
import Images from './components/images';
import Files from './components/files';
import Notes from './components/notes';
import { supabase } from '../utils/supabaseClient'

export default function Home() {
    const [activeTab, setActiveTab] = useState('library');
    const [user, setUser] = useState(null);
    const router = useRouter();
    const [counts, setCounts] = useState({library: 0, files: 0, notes: 0})

    useEffect(() => {
        const session = supabase.auth.getSession().then(({data}) => {
            if (!data?.session){
                router.push('/login');
            } else {
                setUser(data.session.user)
            }
        })
    }, [])

    if (!user) return <div>Loading...</div>

    const renderTab = () => {
        if (activeTab === 'library') return <Images/>
        if (activeTab === 'files') return <Files/>
        if (activeTab === 'notes') return <Notes/>
    }

    return (
        <div className='flex'>
            <Sidebar onTabChange={setActiveTab} tabsCount={counts}/>
            <div className='flex-1 p-4'>{renderTab()}</div>
        </div>
    )
}