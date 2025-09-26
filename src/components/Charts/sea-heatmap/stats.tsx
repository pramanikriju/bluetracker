"use client";

import { standardFormat } from "@/lib/format-number";

type PropsType = {
  summary: {
    totalCapture: number;
    uniqueFishers: number;
    uniqueRegions: number;
    verificationRate: number;
    methodBreakdown: Record<string, number>;
    averageCapturePerFisher: number;
    last7DaysCapture: number;
  };
};

const METHOD_LABELS = {
  seaweed_farming: "Seaweed Farming",
  blue_mussel: "Blue Mussel Cultivation",
  kelp_restoration: "Kelp Forest Restoration",
  mangrove_protection: "Mangrove Protection",
  seagrass_conservation: "Seagrass Conservation"
};

const METHOD_COLORS = {
  seaweed_farming: "bg-emerald-500",
  blue_mussel: "bg-blue-500",
  kelp_restoration: "bg-green-500",
  mangrove_protection: "bg-teal-500",
  seagrass_conservation: "bg-cyan-500"
};

export function SeaHeatmapStats({ summary }: PropsType) {
  const totalMethodCapture = Object.values(summary.methodBreakdown).reduce((sum, val) => sum + val, 0);

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {/* Carbon Capture Methods Breakdown */}
      <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800">
        <h3 className="mb-4 text-lg font-semibold text-dark dark:text-white">
          Carbon Capture Methods
        </h3>
        <div className="space-y-3">
          {Object.entries(summary.methodBreakdown).map(([method, amount]) => {
            const percentage = totalMethodCapture > 0 ? (amount / totalMethodCapture) * 100 : 0;
            return (
              <div key={method} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={`h-3 w-3 rounded-full ${METHOD_COLORS[method as keyof typeof METHOD_COLORS]}`}></div>
                  <span className="text-sm text-dark-4 dark:text-dark-6">
                    {METHOD_LABELS[method as keyof typeof METHOD_LABELS]}
                  </span>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium text-dark dark:text-white">
                    {standardFormat(amount)} tCO₂e
                  </div>
                  <div className="text-xs text-dark-4 dark:text-dark-6">
                    {percentage.toFixed(1)}%
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800">
        <h3 className="mb-4 text-lg font-semibold text-dark dark:text-white">
          Performance Metrics
        </h3>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-sm text-dark-4 dark:text-dark-6">Avg. per Fisher</span>
            <span className="font-semibold text-dark dark:text-white">
              {standardFormat(summary.averageCapturePerFisher)} tCO₂e
            </span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-sm text-dark-4 dark:text-dark-6">Last 7 Days</span>
            <span className="font-semibold text-dark dark:text-white">
              {standardFormat(summary.last7DaysCapture)} tCO₂e
            </span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-sm text-dark-4 dark:text-dark-6">Verification Rate</span>
            <span className="font-semibold text-green-600 dark:text-green-400">
              {summary.verificationRate.toFixed(1)}%
            </span>
          </div>
          
          <div className="pt-3 border-t border-gray-200 dark:border-gray-600">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-dark-4 dark:text-dark-6">Daily Average</span>
              <span className="font-bold text-dark dark:text-white">
                {standardFormat(summary.totalCapture / 90)} tCO₂e/day
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
