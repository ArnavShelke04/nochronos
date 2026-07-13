import React from 'react'
import { useState, useContext } from 'react'
import PoolsModals from "./PoolsModals"
import { userContext } from '../context';

const Pools = () => {
    const [selectedPool, setselectedPool] = useState(null)
    
    // 1. FIXED: Destructure directly from context (Matches App.jsx setup)
    const { userData } = useContext(userContext);
    
    // Safety guard in case userData hasn't loaded yet
    const myPools = userData?.myPools || [];
    const currentUserId = userData?.user?.id || userData?.user?._id || userData?.id_;

    const handleLeavePool = async (poolId) => {
        try {
            // 2. FIXED: Pointing to port 3000 to match the rest of your app routes
            const response = await fetch(`http://localhost:3000/api/pools/${poolId}/leave`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                alert("You have left the pool successfully.");
                setselectedPool(null); 
            } else {
                const err = await response.json();
                alert(err.message);
            }
        } catch (error) {
            console.error("Failed to leave pool:", error);
        }
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
            {myPools.length > 0 ? (
                myPools.map((pool) => (
                    <div
                        key={pool.id || pool._id}
                        onClick={() => setselectedPool(pool)}
                        className="bg-[#121212] border border-zinc-900 hover:border-zinc-800 p-5 rounded-2xl flex flex-col justify-between transition-all duration-200 shadow-lg group cursor-pointer"
                    >
                        <div>
                            <div className="flex justify-between items-start mb-3">
                                <div>
                                    <span className="text-[10px] font-mono tracking-wider text-zinc-500 uppercase">
                                        {pool.subscription?.category}
                                    </span>
                                    <h3 className="text-base font-bold text-white group-hover:text-red-400 transition-colors mt-0.5">
                                        {pool.subscription?.name}
                                    </h3>
                                </div>
                                <span className="bg-zinc-900 border border-zinc-800 text-zinc-400 text-[11px] font-medium px-2.5 py-1 rounded-full">
                                    {pool.members?.currentCount || pool.members?.length}/{pool.members?.maxCap || pool.maxMembers} spots
                                </span>
                            </div>
                            <div className="flex items-center gap-2 mt-4 text-xs text-zinc-400">
                                <div className="w-5 h-5 bg-zinc-800 rounded-full flex items-center justify-center font-bold text-[10px] text-zinc-300 border border-zinc-700">
                                    {pool.creator?.avatarUrl || pool.author?.name?.charAt(0)}
                                </div>
                                <p>Pool by <span className="font-medium text-zinc-300">{pool.creator?.name || pool.author?.name}</span></p>
                            </div>
                        </div>
                        <div className="border-t border-zinc-900/80 mt-5 pt-4 flex justify-between items-center">
                            <div>
                                <p className="text-[10px] text-zinc-500 uppercase tracking-wider">Your Share</p>
                                <p className="text-lg font-black text-white mt-0.5">
                                    ${pool.payment?.amount?.toFixed(2)}
                                    <span className="text-xs font-normal text-zinc-500">/mo</span>
                                </p>
                            </div>
                            <span className="text-[11px] text-zinc-500 bg-zinc-950 px-2.5 py-1 rounded-lg border border-zinc-900 font-mono">
                                Due Day {pool.payment?.dueDate}
                            </span>
                        </div>
                    </div>
                ))
            ) : (
                <div className="col-span-full border border-dashed border-zinc-800 rounded-2xl p-8 text-center text-zinc-500">
                    <p className="text-sm font-semibold">No active pools found</p>
                    <p className="text-xs text-zinc-600 mt-1">Join or create a pool to get started.</p>
                </div>
            )}
            
            <PoolsModals 
                pool={selectedPool} 
                onClose={() => setselectedPool(null)} 
                onLeavePool={handleLeavePool}
                currentUserId={currentUserId}
            />
        </div>
    )
}

export default Pools