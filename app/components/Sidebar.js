import { useState } from 'react';
import { Library, FileText, MessageSquare } from 'lucide-react';
import { supabase } from '../../utils/supabaseClient'

export default function Sidebar({ onTabChange, tabsCount }) {
    const [activeTab, setActiveTab] = useState('library');

    const handleTabClick = (tab) => {
        setActiveTab(tab);
        if (onTabChange) onTabChange(tab);
    }

    return (
        <div className='w-64 bg-[#0f0f0f] text-gray-300 min-h-screen p-6 flex flex-col border-r border-[#2a2a2a] font-sans'>
            <h1 className='text-lg font-semibold mb-8 tracking-tight text-gray-100'>Menu</h1>

            <button 
                onClick={() => handleTabClick('library')}
                className={`flex items-center gap-3 mb-2 px-4 py-2 rounded-lg transition-colors
                    ${activeTab === 'library'
                        ? 'bg-[#2a2a2a] text-gray-100'
                        : 'hover:bg-[#1f1f1f] hover:text-gray-100'
                    }`}
            >
                <Library className='w-5 h-5'/> 
                <span className='font-medium text-white'>Images</span>
            </button>
            <button 
                onClick={() => handleTabClick('files')} 
                className={`flex items-center gap-3 mb-2 px-4 py-2 rounded-lg transition-colors
                    ${activeTab === 'files'
                        ? 'bg-[#2a2a2a] text-gray-100'
                        : 'hover:bg-[#1f1f1f] hover:text-gray-100'
                    }`}
            >
                <FileText className='w-5 h-5'/> 
                <span className='text-sm font-medium'>Files</span>
            </button>
            <button 
                onClick={() => handleTabClick('notes')} 
                className={`flex items-center gap-3 mb-2 px-4 py-2 rounded-lg transition-colors
                    ${activeTab === 'notes'
                        ? 'bg-[#2a2a2a] text-gray-100'
                        : 'hover:bg-[#1f1f1f] hover:text-gray-100'
                    }`}
            >
                <MessageSquare className='w-5 h-5'/>
                <span className='text-sm font-medium'>Notes</span>
            </button>

            <button
                onClick={async () => {
                    await supabase.auth.signOut();
                    window.location.href = '/login';
                }}
                className='mt-auto px-4 py-2 rounded-lg text-sm font-medium text-gray-400 hover:bg-[#1f1f1f] hover:text-gray-100 transition-colors'
            >
                Log Out
            </button>
        </div>
    )
}