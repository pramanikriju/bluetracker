"use client";

import { cn } from "@/lib/utils";
import { standardFormat } from "@/lib/format-number";
import { DUMMY_CARBON_DATA } from "@/data/sea-carbon-data";

type PropsType = {
  className?: string;
};

export function FisherLeaderboard({ className }: PropsType) {
  // Calculate fisher statistics
  const fisherStats = DUMMY_CARBON_DATA
    .filter(item => item.carbonCapture.verification === 'verified')
    .reduce((acc, item) => {
      const fisherId = item.fisherId;
      if (!acc[fisherId]) {
        acc[fisherId] = {
          name: item.fisherName,
          totalCapture: 0,
          entries: 0,
          regions: new Set(),
          methods: new Set(),
          lastActivity: item.timestamp
        };
      }
      acc[fisherId].totalCapture += item.carbonCapture.amount;
      acc[fisherId].entries += 1;
      acc[fisherId].regions.add(item.location.regionName);
      acc[fisherId].methods.add(item.carbonCapture.method);
      
      // Keep most recent activity
      if (new Date(item.timestamp) > new Date(acc[fisherId].lastActivity)) {
        acc[fisherId].lastActivity = item.timestamp;
      }
      
      return acc;
    }, {} as Record<string, { 
      name: string; 
      totalCapture: number; 
      entries: number; 
      regions: Set<string>; 
      methods: Set<string>;
      lastActivity: string;
    }>);

  // Convert to sorted array
  const topFishers = Object.entries(fisherStats)
    .map(([fisherId, stats]) => ({
      fisherId,
      name: stats.name,
      totalCapture: stats.totalCapture,
      entries: stats.entries,
      regionsCount: stats.regions.size,
      methodsCount: stats.methods.size,
      averageCapture: stats.totalCapture / stats.entries,
      lastActivity: stats.lastActivity
    }))
    .sort((a, b) => b.totalCapture - a.totalCapture)
    .slice(0, 15);

  const getLastActivityDays = (date: string): number => {
    const diffTime = Math.abs(new Date().getTime() - new Date(date).getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const getActivityStatus = (days: number): { label: string; color: string } => {
    if (days <= 3) return { label: 'Active', color: 'text-green-600 bg-green-100 dark:bg-green-900/20' };
    if (days <= 7) return { label: 'Recent', color: 'text-blue-600 bg-blue-100 dark:bg-blue-900/20' };
    if (days <= 14) return { label: 'Moderate', color: 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/20' };
    return { label: 'Inactive', color: 'text-red-600 bg-red-100 dark:bg-red-900/20' };
  };

  return (
    <div className={cn(
      "rounded-[10px] bg-white px-7.5 pb-6 pt-7.5 shadow-1 dark:bg-gray-dark dark:shadow-card",
      className
    )}>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <h2 className="text-body-2xlg font-bold text-dark dark:text-white">
          Top Performing Fishers
        </h2>
        <div className="text-sm text-dark-4 dark:text-dark-6">
          Based on verified carbon capture data
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200 dark:border-gray-700">
              <th className="pb-3 text-left text-sm font-semibold text-dark-4 dark:text-dark-6">Rank</th>
              <th className="pb-3 text-left text-sm font-semibold text-dark-4 dark:text-dark-6">Fisher</th>
              <th className="pb-3 text-right text-sm font-semibold text-dark-4 dark:text-dark-6">Total Capture</th>
              <th className="pb-3 text-right text-sm font-semibold text-dark-4 dark:text-dark-6">Avg./Entry</th>
              <th className="pb-3 text-center text-sm font-semibold text-dark-4 dark:text-dark-6">Coverage</th>
              <th className="pb-3 text-center text-sm font-semibold text-dark-4 dark:text-dark-6">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {topFishers.map((fisher, index) => {
              const lastActivityDays = getLastActivityDays(fisher.lastActivity);
              const activityStatus = getActivityStatus(lastActivityDays);
              
              return (
                <tr key={fisher.fisherId} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                  <td className="py-4">
                    <div className="flex items-center">
                      {index < 3 && (
                        <div className={`mr-2 h-6 w-6 rounded-full flex items-center justify-center text-xs font-bold text-white ${
                          index === 0 ? 'bg-yellow-500' : index === 1 ? 'bg-gray-400' : 'bg-amber-600'
                        }`}>
                          {index + 1}
                        </div>
                      )}
                      {index >= 3 && (
                        <span className="text-sm font-medium text-dark-4 dark:text-dark-6 ml-8">
                          {index + 1}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="py-4">
                    <div>
                      <p className="font-medium text-dark dark:text-white">{fisher.name}</p>
                      <p className="text-sm text-dark-4 dark:text-dark-6">
                        {fisher.entries} entries • {fisher.methodsCount} methods
                      </p>
                    </div>
                  </td>
                  <td className="py-4 text-right">
                    <p className="font-semibold text-dark dark:text-white">
                      {standardFormat(fisher.totalCapture)} tCO₂e
                    </p>
                  </td>
                  <td className="py-4 text-right">
                    <p className="text-dark dark:text-white">
                      {standardFormat(fisher.averageCapture)} tCO₂e
                    </p>
                  </td>
                  <td className="py-4 text-center">
                    <div className="inline-flex items-center gap-1 rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-800 dark:bg-blue-900/20 dark:text-blue-400">
                      {fisher.regionsCount} regions
                    </div>
                  </td>
                  <td className="py-4 text-center">
                    <div className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium ${activityStatus.color}`}>
                      <div className="h-2 w-2 rounded-full bg-current"></div>
                      {activityStatus.label}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Summary Stats */}
      <div className="mt-6 grid grid-cols-1 gap-4 rounded-lg bg-gray-50 p-4 dark:bg-gray-800 md:grid-cols-3">
        <div className="text-center">
          <p className="text-2xl font-bold text-dark dark:text-white">
            {standardFormat(topFishers.reduce((sum, fisher) => sum + fisher.totalCapture, 0))}
          </p>
          <p className="text-sm text-dark-4 dark:text-dark-6">Total from Top 15</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-dark dark:text-white">
            {standardFormat(topFishers.reduce((sum, fisher) => sum + fisher.averageCapture, 0) / topFishers.length)}
          </p>
          <p className="text-sm text-dark-4 dark:text-dark-6">Avg. per Entry</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-dark dark:text-white">
            {topFishers.filter(fisher => getLastActivityDays(fisher.lastActivity) <= 7).length}
          </p>
          <p className="text-sm text-dark-4 dark:text-dark-6">Active This Week</p>
        </div>
      </div>
    </div>
  );
}
