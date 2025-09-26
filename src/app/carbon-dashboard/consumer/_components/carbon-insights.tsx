"use client";

import { cn } from "@/lib/utils";
import { standardFormat } from "@/lib/format-number";
import { CARBON_SUMMARY, DUMMY_CARBON_DATA, aggregateDataByPeriod } from "@/data/sea-carbon-data";
import dynamic from "next/dynamic";
import type { ApexOptions } from "apexcharts";

const Chart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

type PropsType = {
  className?: string;
};

export function CarbonInsights({ className }: PropsType) {
  const summary = CARBON_SUMMARY;
  const monthlyData = aggregateDataByPeriod(DUMMY_CARBON_DATA, 'monthly');

  // Calculate growth trends
  const currentMonth = monthlyData[monthlyData.length - 1];
  const previousMonth = monthlyData[monthlyData.length - 2];
  const growthRate = previousMonth ? 
    ((currentMonth.verifiedCapture - previousMonth.verifiedCapture) / previousMonth.verifiedCapture) * 100 : 0;

  // Prediction chart options
  const predictionOptions: ApexOptions = {
    chart: {
      height: 300,
      type: "line",
      toolbar: { show: false },
      fontFamily: "inherit",
    },
    colors: ["#10B981", "#F59E0B", "#8B5CF6"],
    stroke: {
      curve: "smooth",
      width: [3, 2, 2],
      dashArray: [0, 0, 5]
    },
    markers: {
      size: 4,
      colors: ["#10B981", "#F59E0B", "#8B5CF6"],
      strokeColors: "#fff",
      strokeWidth: 2,
    },
    fill: {
      type: "gradient",
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.3,
        opacityTo: 0.4,
        stops: [0, 90, 100]
      }
    },
    dataLabels: { enabled: false },
    title: {
      text: "Carbon Capture Trends & Projections",
      style: {
        fontSize: "16px",
        fontWeight: "600"
      }
    },
    xaxis: {
      categories: monthlyData.map(item => item.period),
      labels: {
        style: { fontSize: "12px" }
      }
    },
    yaxis: {
      title: {
        text: "Carbon Capture (tCO₂e)",
        style: { fontSize: "12px" }
      }
    },
    tooltip: {
      y: {
        formatter: function (val) {
          return val.toFixed(2) + " tCO₂e"
        }
      }
    },
    legend: {
      position: "top",
      horizontalAlign: "right"
    }
  };

  const predictionSeries = [
    {
      name: "Verified Capture",
      data: monthlyData.map(item => item.verifiedCapture)
    },
    {
      name: "Total Activity",
      data: monthlyData.map(item => item.totalCapture)
    },
    {
      name: "Projected Trend",
      data: monthlyData.map((item, index) => {
        // Simple linear projection for demo
        if (index < monthlyData.length - 3) return null;
        return item.verifiedCapture * (1 + (growthRate / 100) * (index - monthlyData.length + 4));
      })
    }
  ];

  return (
    <div className={cn(
      "rounded-[10px] bg-white px-7.5 pb-6 pt-7.5 shadow-1 dark:bg-gray-dark dark:shadow-card",
      className
    )}>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <h2 className="text-body-2xlg font-bold text-dark dark:text-white">
          Carbon Capture Insights
        </h2>
        <div className="flex items-center gap-2 text-sm">
          <span className="text-dark-4 dark:text-dark-6">Growth Rate:</span>
          <span className={`font-semibold ${growthRate >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {growthRate >= 0 ? '+' : ''}{growthRate.toFixed(1)}%
          </span>
        </div>
      </div>

      <Chart
        options={predictionOptions}
        series={predictionSeries}
        type="line"
        height={300}
      />

      {/* Key Insights Grid */}
      <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="rounded-lg bg-gradient-to-br from-blue-50 to-blue-100 p-4 dark:from-blue-900/20 dark:to-blue-800/20">
          <div className="flex items-center gap-2 mb-2">
            <div className="h-2 w-2 rounded-full bg-blue-500"></div>
            <span className="text-sm font-medium text-dark-4 dark:text-dark-6">Efficiency Rate</span>
          </div>
          <p className="text-xl font-bold text-dark dark:text-white">
            {(summary.verificationRate * summary.totalCapture / 100 / summary.uniqueFishers).toFixed(2)} tCO₂e
          </p>
          <p className="text-xs text-dark-4 dark:text-dark-6">per verified fisher</p>
        </div>

        <div className="rounded-lg bg-gradient-to-br from-green-50 to-green-100 p-4 dark:from-green-900/20 dark:to-green-800/20">
          <div className="flex items-center gap-2 mb-2">
            <div className="h-2 w-2 rounded-full bg-green-500"></div>
            <span className="text-sm font-medium text-dark-4 dark:text-dark-6">Quality Score</span>
          </div>
          <p className="text-xl font-bold text-dark dark:text-white">
            {((summary.verificationRate / 100) * 10).toFixed(1)}/10
          </p>
          <p className="text-xs text-dark-4 dark:text-dark-6">data reliability</p>
        </div>

        <div className="rounded-lg bg-gradient-to-br from-purple-50 to-purple-100 p-4 dark:from-purple-900/20 dark:to-purple-800/20">
          <div className="flex items-center gap-2 mb-2">
            <div className="h-2 w-2 rounded-full bg-purple-500"></div>
            <span className="text-sm font-medium text-dark-4 dark:text-dark-6">Impact Potential</span>
          </div>
          <p className="text-xl font-bold text-dark dark:text-white">
            {standardFormat(summary.totalCapture * 12)} tCO₂e
          </p>
          <p className="text-xs text-dark-4 dark:text-dark-6">projected annual</p>
        </div>
      </div>

      {/* Environmental Impact */}
      <div className="mt-6 rounded-lg border border-gray-200 bg-gradient-to-r from-emerald-50 to-blue-50 p-4 dark:border-gray-700 dark:from-emerald-900/10 dark:to-blue-900/10">
        <h3 className="mb-3 text-lg font-semibold text-dark dark:text-white">Environmental Impact</h3>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
              {standardFormat(summary.totalCapture * 2.3)} 
            </p>
            <p className="text-sm text-dark-4 dark:text-dark-6">Cars off road (annually)</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {standardFormat(summary.totalCapture * 0.45)}
            </p>
            <p className="text-sm text-dark-4 dark:text-dark-6">Hectares of forest equivalent</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-cyan-600 dark:text-cyan-400">
              {summary.uniqueRegions * 4}
            </p>
            <p className="text-sm text-dark-4 dark:text-dark-6">Marine ecosystems improved</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-teal-600 dark:text-teal-400">
              {standardFormat(summary.totalCapture * 850)}
            </p>
            <p className="text-sm text-dark-4 dark:text-dark-6">Households carbon neutral</p>
          </div>
        </div>
      </div>
    </div>
  );
}
