import { SeaHeatmap } from "@/components/Charts/sea-heatmap";
import { createTimeFrameExtractor } from "@/utils/timeframe-extractor";

type PropsType = {
  searchParams: Promise<{
    selected_time_frame?: string;
  }>;
};

export default async function HeatmapPage({ searchParams }: PropsType) {
  const { selected_time_frame } = await searchParams;
  const extractTimeFrame = createTimeFrameExtractor(selected_time_frame);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-dark dark:text-white">
          Blue Carbon Sea Heatmap
        </h1>
        <p className="mt-2 text-dark-4 dark:text-dark-6">
          Interactive visualization of carbon capture data across marine regions
        </p>
      </div>

      {/* Full-width Heatmap */}
      <SeaHeatmap
        className="col-span-12"
        key={extractTimeFrame("sea_heatmap")}
        timeFrame={extractTimeFrame("sea_heatmap")?.split(":")[1]}
      />

      {/* Info Cards */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <div className="rounded-lg bg-gradient-to-br from-blue-50 to-blue-100 p-6 dark:from-blue-900/20 dark:to-blue-800/20">
          <div className="mb-3 flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-blue-500"></div>
            <h3 className="text-lg font-semibold text-dark dark:text-white">Data Quality</h3>
          </div>
          <p className="text-sm text-dark-4 dark:text-dark-6 mb-2">
            All displayed data has been verified through our MRV (Monitoring, Reporting, Verification) process
          </p>
          <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">95.2%</div>
          <div className="text-xs text-dark-4 dark:text-dark-6">Verification rate</div>
        </div>

        <div className="rounded-lg bg-gradient-to-br from-green-50 to-green-100 p-6 dark:from-green-900/20 dark:to-green-800/20">
          <div className="mb-3 flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-green-500"></div>
            <h3 className="text-lg font-semibold text-dark dark:text-white">Real-time Updates</h3>
          </div>
          <p className="text-sm text-dark-4 dark:text-dark-6 mb-2">
            Heatmap updates automatically as fishers submit new carbon capture data
          </p>
          <div className="text-2xl font-bold text-green-600 dark:text-green-400">Live</div>
          <div className="text-xs text-dark-4 dark:text-dark-6">Data streaming</div>
        </div>

        <div className="rounded-lg bg-gradient-to-br from-purple-50 to-purple-100 p-6 dark:from-purple-900/20 dark:to-purple-800/20">
          <div className="mb-3 flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-purple-500"></div>
            <h3 className="text-lg font-semibold text-dark dark:text-white">Coverage Area</h3>
          </div>
          <p className="text-sm text-dark-4 dark:text-dark-6 mb-2">
            Monitoring blue carbon activities across 8 major marine regions
          </p>
          <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">850K</div>
          <div className="text-xs text-dark-4 dark:text-dark-6">km² monitored</div>
        </div>
      </div>

      {/* Usage Instructions */}
      <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-dark">
        <h3 className="mb-4 text-lg font-semibold text-dark dark:text-white">How to Use the Heatmap</h3>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <h4 className="mb-2 font-medium text-dark dark:text-white">🎯 Reading the Data</h4>
            <ul className="space-y-1 text-sm text-dark-4 dark:text-dark-6">
              <li>• Darker colors indicate higher carbon capture amounts</li>
              <li>• Each cell represents carbon captured in that region/time period</li>
              <li>• Hover over cells to see detailed information</li>
            </ul>
          </div>
          <div>
            <h4 className="mb-2 font-medium text-dark dark:text-white">⏱️ Time Controls</h4>
            <ul className="space-y-1 text-sm text-dark-4 dark:text-dark-6">
              <li>• Use the period picker to change time granularity</li>
              <li>• Daily: Shows day-by-day carbon capture</li>
              <li>• Monthly: Aggregated monthly totals</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
