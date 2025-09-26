import { SeaHeatmap } from "@/components/Charts/sea-heatmap";
import { CarbonInsights } from "./_components/carbon-insights";
import { RegionalBreakdown } from "./_components/regional-breakdown";
import { FisherLeaderboard } from "./_components/fisher-leaderboard";
import { createTimeFrameExtractor } from "@/utils/timeframe-extractor";
import { Suspense } from "react";

type PropsType = {
  searchParams: Promise<{
    selected_time_frame?: string;
  }>;
};

export default async function ConsumerDashboard({ searchParams }: PropsType) {
  const { selected_time_frame } = await searchParams;
  const extractTimeFrame = createTimeFrameExtractor(selected_time_frame);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-dark dark:text-white">
          Blue Carbon Consumer Dashboard
        </h1>
        <p className="mt-2 text-dark-4 dark:text-dark-6">
          Comprehensive analytics and insights for blue carbon capture data
        </p>
      </div>

      {/* Main Heatmap */}
      <SeaHeatmap
        className="col-span-12"
        key={extractTimeFrame("sea_heatmap")}
        timeFrame={extractTimeFrame("sea_heatmap")?.split(":")[1]}
      />

      {/* Analytics Grid */}
      <div className="grid grid-cols-12 gap-4 md:gap-6 2xl:gap-7.5">
        <Suspense fallback={<div className="col-span-12 xl:col-span-8 h-96 bg-gray-100 dark:bg-gray-800 rounded-lg animate-pulse" />}>
          <CarbonInsights className="col-span-12 xl:col-span-8" />
        </Suspense>

        <Suspense fallback={<div className="col-span-12 xl:col-span-4 h-96 bg-gray-100 dark:bg-gray-800 rounded-lg animate-pulse" />}>
          <RegionalBreakdown className="col-span-12 xl:col-span-4" />
        </Suspense>

        <Suspense fallback={<div className="col-span-12 h-64 bg-gray-100 dark:bg-gray-800 rounded-lg animate-pulse" />}>
          <FisherLeaderboard className="col-span-12" />
        </Suspense>
      </div>
    </div>
  );
}
