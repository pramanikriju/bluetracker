"use client";

import { cn } from "@/lib/utils";
import { standardFormat } from "@/lib/format-number";
import { DUMMY_CARBON_DATA } from "@/data/sea-carbon-data";
import dynamic from "next/dynamic";
import type { ApexOptions } from "apexcharts";

const Chart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

type PropsType = {
  className?: string;
};

export function RegionalBreakdown({ className }: PropsType) {
  // Calculate regional data
  const regionalData = DUMMY_CARBON_DATA
    .filter(item => item.carbonCapture.verification === 'verified')
    .reduce((acc, item) => {
      const region = item.location.regionName;
      if (!acc[region]) {
        acc[region] = {
          totalCapture: 0,
          fisherCount: new Set(),
          averageDepth: 0,
          methods: new Set()
        };
      }
      acc[region].totalCapture += item.carbonCapture.amount;
      acc[region].fisherCount.add(item.fisherId);
      acc[region].averageDepth += item.location.depth;
      acc[region].methods.add(item.carbonCapture.method);
      return acc;
    }, {} as Record<string, { totalCapture: number; fisherCount: Set<string>; averageDepth: number; methods: Set<string> }>);

  // Convert to sorted array
  const regionArray = Object.entries(regionalData)
    .map(([region, data]) => ({
      region,
      totalCapture: data.totalCapture,
      fisherCount: data.fisherCount.size,
      averageDepth: data.averageDepth / DUMMY_CARBON_DATA.filter(item => item.location.regionName === region).length,
      methodsCount: data.methods.size
    }))
    .sort((a, b) => b.totalCapture - a.totalCapture);

  // Donut chart options
  const donutOptions: ApexOptions = {
    chart: {
      type: "donut",
      height: 300,
      fontFamily: "inherit",
    },
    colors: ["#10B981", "#3B82F6", "#8B5CF6", "#F59E0B", "#EF4444", "#06B6D4", "#84CC16", "#F97316"],
    labels: regionArray.map(item => item.region),
    dataLabels: {
      enabled: true,
      formatter: function (val, opts) {
        return opts.w.config.series[opts.seriesIndex].toFixed(1) + " tCO₂e"
      }
    },
    plotOptions: {
      pie: {
        donut: {
          size: "65%",
          labels: {
            show: true,
            total: {
              show: true,
              label: "Total Capture",
              formatter: function (w) {
                const total = w.globals.seriesTotals.reduce((a: number, b: number) => a + b, 0);
                return standardFormat(total) + " tCO₂e";
              }
            }
          }
        }
      }
    },
    legend: {
      position: "bottom",
      fontSize: "12px"
    },
    tooltip: {
      y: {
        formatter: function (val) {
          return val.toFixed(2) + " tCO₂e"
        }
      }
    }
  };

  const donutSeries = regionArray.map(item => item.totalCapture);

  return (
    <div className={cn(
      "rounded-[10px] bg-white px-7.5 pb-6 pt-7.5 shadow-1 dark:bg-gray-dark dark:shadow-card",
      className
    )}>
      <h2 className="mb-6 text-body-2xlg font-bold text-dark dark:text-white">
        Regional Distribution
      </h2>

      <Chart
        options={donutOptions}
        series={donutSeries}
        type="donut"
        height={300}
      />

      {/* Regional Details */}
      <div className="mt-6 space-y-3 max-h-64 overflow-y-auto">
        {regionArray.map((region, index) => (
          <div key={region.region} className="flex items-center justify-between rounded-lg border border-gray-200 p-3 dark:border-gray-700">
            <div className="flex items-center gap-3">
              <div 
                className="h-4 w-4 rounded-full"
                style={{ backgroundColor: donutOptions.colors![index] }}
              ></div>
              <div>
                <p className="font-medium text-dark dark:text-white">
                  {region.region}
                </p>
                <p className="text-sm text-dark-4 dark:text-dark-6">
                  {region.fisherCount} fishers • {region.methodsCount} methods
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-semibold text-dark dark:text-white">
                {standardFormat(region.totalCapture)} tCO₂e
              </p>
              <p className="text-sm text-dark-4 dark:text-dark-6">
                Avg. {region.averageDepth.toFixed(0)}m depth
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Regional Performance Metrics */}
      <div className="mt-6 rounded-lg bg-gray-50 p-4 dark:bg-gray-800">
        <h3 className="mb-3 text-lg font-semibold text-dark dark:text-white">Regional Performance</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-dark-4 dark:text-dark-6">Most Productive</p>
            <p className="font-semibold text-dark dark:text-white">{regionArray[0]?.region}</p>
            <p className="text-xs text-green-600">{standardFormat(regionArray[0]?.totalCapture)} tCO₂e</p>
          </div>
          <div>
            <p className="text-sm text-dark-4 dark:text-dark-6">Highest Density</p>
            <p className="font-semibold text-dark dark:text-white">
              {regionArray.reduce((max, region) => 
                (region.totalCapture / region.fisherCount) > (max.totalCapture / max.fisherCount) ? region : max
              ).region}
            </p>
            <p className="text-xs text-blue-600">
              {(regionArray.reduce((max, region) => 
                (region.totalCapture / region.fisherCount) > (max.totalCapture / max.fisherCount) ? region : max
              ).totalCapture / regionArray.reduce((max, region) => 
                (region.totalCapture / region.fisherCount) > (max.totalCapture / max.fisherCount) ? region : max
              ).fisherCount).toFixed(2)} tCO₂e/fisher
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
