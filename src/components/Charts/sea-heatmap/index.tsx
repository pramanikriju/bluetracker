import { PeriodPicker } from "@/components/period-picker";
import { cn } from "@/lib/utils";
import { standardFormat } from "@/lib/format-number";
import { CARBON_SUMMARY, DUMMY_CARBON_DATA, aggregateDataByPeriod } from "@/data/sea-carbon-data";
import { SeaHeatmapChart } from "./chart";
import { SeaHeatmapStats } from "./stats";

type PropsType = {
  timeFrame?: string;
  className?: string;
};

export async function SeaHeatmap({
  timeFrame = "monthly",
  className,
}: PropsType) {
  // Simulate async data fetching
  const data = DUMMY_CARBON_DATA;
  const aggregatedData = aggregateDataByPeriod(data, timeFrame as 'daily' | 'weekly' | 'monthly');
  const summary = CARBON_SUMMARY;

  return (
    <div
      className={cn(
        "grid gap-4 rounded-[10px] bg-white px-7.5 pb-6 pt-7.5 shadow-1 dark:bg-gray-dark dark:shadow-card",
        className,
      )}
    >
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-body-2xlg font-bold text-dark dark:text-white">
            Sea Carbon Capture Heatmap
          </h2>
          <p className="text-sm text-dark-4 dark:text-dark-6 mt-1">
            Real-time monitoring of blue carbon capture by fishers across marine regions
          </p>
        </div>

        <PeriodPicker defaultValue={timeFrame} sectionKey="sea_heatmap" />
      </div>

      <SeaHeatmapChart data={aggregatedData} timeFrame={timeFrame} />

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg bg-blue-50 p-4 dark:bg-blue-900/20">
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-blue-500"></div>
            <span className="text-sm font-medium text-dark-4 dark:text-dark-6">Total Verified</span>
          </div>
          <p className="mt-2 text-2xl font-bold text-dark dark:text-white">
            {standardFormat(summary.totalCapture)} tCO₂e
          </p>
        </div>

        <div className="rounded-lg bg-green-50 p-4 dark:bg-green-900/20">
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-green-500"></div>
            <span className="text-sm font-medium text-dark-4 dark:text-dark-6">Active Fishers</span>
          </div>
          <p className="mt-2 text-2xl font-bold text-dark dark:text-white">
            {summary.uniqueFishers}
          </p>
        </div>

        <div className="rounded-lg bg-purple-50 p-4 dark:bg-purple-900/20">
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-purple-500"></div>
            <span className="text-sm font-medium text-dark-4 dark:text-dark-6">Coverage Regions</span>
          </div>
          <p className="mt-2 text-2xl font-bold text-dark dark:text-white">
            {summary.uniqueRegions}
          </p>
        </div>

        <div className="rounded-lg bg-orange-50 p-4 dark:bg-orange-900/20">
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-orange-500"></div>
            <span className="text-sm font-medium text-dark-4 dark:text-dark-6">Verification Rate</span>
          </div>
          <p className="mt-2 text-2xl font-bold text-dark dark:text-white">
            {summary.verificationRate.toFixed(1)}%
          </p>
        </div>
      </div>

      <SeaHeatmapStats summary={summary} />
    </div>
  );
}
