'use client';

import { useState } from 'react';
import { supabase } from '../../utils/supabaseClient';
import { useRouter } from 'next/navigation';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const router = useRouter();

    const handleLogin = async () => {
        const { error } = await supabase.auth.signInWithPassword({email, password});
        if (error) alert(error.message);
        else router.push('/');
    };

    return (
        <div className='min-h-screen flex items-center justify-center bg-[#0f0f0f]'>
            <div className='w-full max-w-sm bg-[#1a1a1a] p-6 rounded-xl border border-[#2a2a2a]'>
                <h1 className='text-2xl font-semibold text-center mb-6 text-gray-100'>
                    Welcome Back
                </h1>
                
                <div className='space-y-4'>
                    <input
                        type='email'
                        placeholder='Email'
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className='w-full rounded-lg bg-[#0f0f0f] border border-[#2a2a2a] px-4 py-2 text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-400'
                    />
                    <input
                        type='password'
                        placeholder='Password'
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className='w-full rounded-lg bg-[#0f0f0f] border border-[#2a2a2a] px-4 py-2 text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-400'
                    />
                    <button 
                        onClick={handleLogin} 
                        className='w-full bg-gray-100 text-gray-900 font-medium py-2.5 rounded-lg hover:bg-gray-300 transition cursor-pointer'
                    >
                        Login
                    </button>

                    <p className='text-center mt-5 text-sm text-gray-400'>
                        Not Registered? {' '}
                        <button
                            onClick={() => router.push('/signup')}
                            className='text-gray-100 font-medium hover:underline cursor-pointer'
                        >
                            Sign Up
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
}
