import React from 'react';

const CreatePool = ({ isOpen, onClose }) => {
    // If modal state is false, don't mount it
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm">
            {/* Modal Container */}
            <div className="w-11/12 max-w-md bg-[#121212] border border-zinc-900 p-6 rounded-2xl flex flex-col shadow-2xl text-white">
                
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-bold">Create a Subscription Pool</h2>
                    <button onClick={onClose} className="text-zinc-400 hover:text-white transition-colors">✕</button>
                </div>

                <div className="space-y-4">
                    <p className="text-sm text-zinc-400">Set up your shared pool credentials here.</p>
                    {/* Your form inputs will go here */}
                </div>

            </div>
        </div>
    );
};

export default CreatePool;