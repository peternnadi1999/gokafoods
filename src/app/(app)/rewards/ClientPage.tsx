"use client";
import { useMemo } from "react";
import { useClaimReward, useRewards } from "@/lib/hooks/use-api";
import { formatNaira } from "@/lib/utils/utils";

// SEO Metadata

const RewardPage = () => {
  const { data: rewards, isLoading, isError } = useRewards();
  const {mutateAsync: claimReward}=useClaimReward()

  const handleRedeem = async (rewardId: string) => {
 
      await claimReward(rewardId);
  }
  
  const rewardItems = useMemo(() => {
    if (!rewards) return [];
    if (Array.isArray(rewards)) return rewards;
    return [rewards];
  }, [rewards]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="sticky top-0 bg-gray-50 backdrop-blur-sm border-b border-gray-200/60 z-10 px-5 lg:px-8 pt-12 lg:pt-8 pb-4">
        <div className="max-w-screen-xl mx-auto">
          <h1 className="text-2xl font-bold text-gray-900">Your Rewards</h1>
          <p className="mt-2 text-sm text-gray-500 max-w-2xl">
            View your available rewards below. Each card shows the reward value, status, and issue date.
          </p>
        </div>
      </div>

      <div className="px-5 lg:px-8 py-6 max-w-screen-xl mx-auto">
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="bg-white rounded-2xl p-5 h-32 skeleton" />
            ))}
          </div>
        ) : isError ? (
          <div className="rounded-3xl bg-white p-10 shadow-card text-center">
            <p className="text-red-500">Unable to load rewards. Please try again later.</p>
          </div>
        ) : rewardItems.length === 0 ? (
          <div className="rounded-3xl bg-white p-10 shadow-card text-center">
            <p className="text-gray-500">No rewards found yet.</p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {rewardItems.map((reward: any) => (
              <div
                key={reward.rewardId}
                className="rounded-[2rem] border border-gray-200 bg-white p-6 shadow-card transition hover:-translate-y-1 hover:shadow-xl"
              >
                <div className="flex items-center justify-between gap-4">

                  <div className="flex gap-2">
                    <p className="text-lg font-semibold text-gray-900">Reward:</p>
                    <p className="text-lg font-bold text-primary-600">{formatNaira(reward.theReward)}</p>
                  </div>
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${reward.isTheRewardUsed ? 'bg-gray-100 text-gray-600' : 'bg-emerald-100 text-emerald-700'}`}
                  >
                    {reward.isTheRewardUsed ? 'Used' : 'Available'}
                  </span>
                </div>

                <div className="mt-6 space-y-4 text-sm text-gray-600">
                  {reward.date && (
                    <div className="flex items-center gap-2">
                      <p className="text-xs uppercase tracking-[0.2em] text-gray-400">Issued:</p>
                      <p className="text-gray-900 text-xs">{new Date(reward.date).toLocaleDateString()}</p>
                    </div>
                  )}
                  <button onClick={() => handleRedeem(reward.rewardId)} className="w-full bg-primary-500 hover:bg-primary-600 text-white py-2 rounded-xl transition-colors">
                    Redeem
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default RewardPage
