import React, { useState } from 'react';
import { useForm } from 'react-hook-form';

// Organized platforms categorized by sector
const PLATFORMS_BY_CATEGORY = {
    entertainment: [
        { id: "netflix", name: "Netflix Premium", icon: "🍿", maxMembers: 4, totalCost: 22.99 },
        { id: "disney", name: "Disney+ Premium", icon: "🏰", maxMembers: 4, totalCost: 15.99 },
        { id: "hbo", name: "Max Ultimate 4K", icon: "🎬", maxMembers: 4, totalCost: 20.99 }
    ],
    music: [
        { id: "spotify", name: "Spotify Family", icon: "🎵", maxMembers: 6, totalCost: 19.99 },
        { id: "apple_music", name: "Apple Music Family", icon: "🍎", maxMembers: 6, totalCost: 16.99 },
        { id: "youtube_premium", name: "YouTube Premium Fam", icon: "📺", maxMembers: 6, totalCost: 22.99 }
    ],
    education: [
        { id: "duolingo", name: "Duolingo Family", icon: "🦉", maxMembers: 6, totalCost: 14.99 },
        { id: "masterclass", name: "MasterClass Family", icon: "🎓", maxMembers: 6, totalCost: 20.00 },
        { id: "coursera", name: "Coursera Plus Team", icon: "✍️", maxMembers: 5, totalCost: 50.00 }
    ]
};

const CreatePool = ({ isOpen, onClose }) => {
    const {
        register,
        handleSubmit: handleFormSubmit, // Renamed to avoid naming collision
        formState: { errors, isSubmitting }
    } = useForm();
    
    const [activeCategory, setActiveCategory] = useState('entertainment');
    const [selectedPlatform, setSelectedPlatform] = useState(PLATFORMS_BY_CATEGORY.entertainment[0]);

    // Handle shifting between tabs cleanly
    const handleCategoryChange = (categoryKey) => {
        setActiveCategory(categoryKey);
        // Automatically switch the selected platform to the first item in the new category list
        setSelectedPlatform(PLATFORMS_BY_CATEGORY[categoryKey][0]);
    };

    // Calculate split cost dynamically
    const costPerSlot = (selectedPlatform.totalCost / selectedPlatform.maxMembers).toFixed(2);
    
    // React Hook Form passes validated data directly here
    const onSubmit = (data) => {
        const payload = {
            poolName: data.poolName, // Gathered from RHF register
            platformName: `${selectedPlatform.name} Group`,
            category: activeCategory,
            platformId: selectedPlatform.id,
            appName: selectedPlatform.name,
            maxMembers: selectedPlatform.maxMembers,
            totalMonthlyCost: selectedPlatform.totalCost,
            fixedSlotPrice: parseFloat(costPerSlot)
        };
        console.log(data.poolName)
        console.log("Submitting Categorized Payload to backend:", payload);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm">
            <div className="w-11/12 max-w-md bg-[#121212] border border-zinc-900 p-6 rounded-2xl flex flex-col shadow-2xl text-white">
                
                {/* Header */}
                <div className="flex justify-between items-center mb-5">
                    <h2 className="text-lg font-bold">Create a Subscription Pool</h2>
                    <button onClick={onClose} type="button" className="text-zinc-400 hover:text-white transition-colors text-lg">✕</button>
                </div>

                {/* Submit uses React Hook Form handler wrapper wrapper */}
                <form onSubmit={handleFormSubmit(onSubmit)} className="space-y-5">
                    
                    {/* Category Navigation Tabs */}
                    <div>
                        <label className="block text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2">Select Category</label>
                        <div className="flex bg-zinc-950 p-1 rounded-xl border border-zinc-900 gap-1">
                            {Object.keys(PLATFORMS_BY_CATEGORY).map((category) => (
                                <button
                                    key={category}
                                    type="button"
                                    onClick={() => handleCategoryChange(category)}
                                    className={`flex-1 py-1.5 text-xs font-medium capitalize rounded-lg transition-all ${
                                        activeCategory === category
                                        ? 'bg-zinc-900 border border-zinc-800 text-white font-semibold'
                                        : 'text-zinc-400 hover:text-zinc-200'
                                    }`}
                                >
                                    {category}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Dynamic Platform Selection List */}
                    <div>
                        <label className="block text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2">Choose App Plan</label>
                        <div className="max-h-[160px] overflow-y-auto space-y-2 pr-1 scrollbar-thin scrollbar-thumb-zinc-800">
                            {PLATFORMS_BY_CATEGORY[activeCategory].map((platform) => {
                                const isSelected = selectedPlatform.id === platform.id;
                                return (
                                    <button
                                        key={platform.id}
                                        type="button"
                                        onClick={() => setSelectedPlatform(platform)}
                                        className={`w-full flex items-center justify-between p-3 rounded-xl border text-left transition-all ${
                                            isSelected 
                                            ? 'bg-purple-600/10 border-purple-500 text-white' 
                                            : 'bg-zinc-900/40 border-zinc-900 text-zinc-300 hover:border-zinc-800'
                                        }`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <span className="text-xl bg-zinc-900 p-1.5 rounded-lg border border-zinc-800">{platform.icon}</span>
                                            <div>
                                                <div className="text-sm font-semibold">{platform.name}</div>
                                                <div className="text-xs text-zinc-500">Up to {platform.maxMembers} slots</div>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-xs font-bold text-green-400">${(platform.totalCost / platform.maxMembers).toFixed(2)}/mo</div>
                                            <div className="text-[10px] text-zinc-500">per slot</div>
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Pool Name Input Field */}
                    <div>
                        <label className="block text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2">Pool Display Name</label>
                        <input 
                            type="text" 
                            {...register("poolName", { 
                                required: "This field is required", 
                                minLength: { value: 3, message: "Minimum length is 3 characters" }
                            })}
                            placeholder={`e.g., Share my ${selectedPlatform.name}`} 
                            className={`w-full bg-zinc-950 border rounded-xl px-4 py-2.5 text-sm text-white placeholder-zinc-600 focus:outline-none transition-colors ${
                                errors.poolName ? 'border-red-500 focus:border-red-500' : 'border-zinc-900 focus:border-purple-500'
                            }`}
                        />
                        {errors.poolName && (
                            <span className="text-red-500 text-xs mt-1 block">{errors.poolName.message}</span>
                        )}
                    </div>

                    {/* Calculation Summary Breakout Block */}
                    <div className="bg-zinc-950 border border-zinc-900 rounded-xl p-4 space-y-2 text-xs">
                        <div className="flex justify-between text-zinc-400">
                            <span>Total Platform Bill:</span>
                            <span className="text-white">${selectedPlatform.totalCost.toFixed(2)}/mo</span>
                        </div>
                        <div className="flex justify-between border-t border-zinc-900/60 pt-2 font-bold">
                            <span className="text-purple-400">Your Shared Member Fee:</span>
                            <span className="text-green-400">${costPerSlot}/mo</span>
                        </div>
                    </div>

                    {/* Action buttons */}
                    <div className="flex gap-3">
                        <button 
                            type="button" 
                            onClick={onClose}
                            className="flex-1 bg-zinc-950 hover:bg-zinc-900 border border-zinc-900 text-zinc-400 rounded-xl py-2.5 text-sm font-medium transition-colors"
                        >
                            Cancel
                        </button>
                        <button 
                            type="submit" 
                            disabled={isSubmitting}
                            className="flex-1 bg-purple-600 hover:bg-purple-500 disabled:bg-purple-800 text-white rounded-xl py-2.5 text-sm font-medium transition-colors shadow-lg shadow-purple-600/20"
                        >
                            {isSubmitting ? 'Publishing...' : 'Publish Pool'}
                        </button>
                    </div>

                </form>
            </div>
        </div>
    );
};

export default CreatePool;