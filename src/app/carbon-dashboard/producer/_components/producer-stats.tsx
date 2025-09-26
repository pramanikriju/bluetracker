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

export function ProducerStats({ className }: PropsType) {
  // Simulate current user data (in real app, this would come from user context)
  const currentFisherId = "F001";
  const currentFisherName = "Captain Erik Nordström";
  
  const myData = DUMMY_CARBON_DATA.filter(item => item.fisherId === currentFisherId);
  const verifiedData = myData.filter(item => item.carbonCapture.verification === 'verified');
  const pendingData = myData.filter(item => item.carbonCapture.verification === 'pending');
  
  const totalCapture = verifiedData.reduce((sum, item) => sum + item.carbonCapture.amount, 0);
  const pendingCapture = pendingData.reduce((sum, item) => sum + item.carbonCapture.amount, 0);
  
  // Monthly data for the chart
  const monthlyData = Array.from({ length: 6 }, (_, i) => {
    const date = new Date();
    date.setMonth(date.getMonth() - (5 - i));
    const monthKey = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}`;
    
    const monthData = myData.filter(item => {
      const itemDate = new Date(item.timestamp);
      const itemKey = `${itemDate.getFullYear()}-${(itemDate.getMonth() + 1).toString().padStart(2, '0')}`;
      return itemKey === monthKey && item.carbonCapture.verification === 'verified';
    });
    
    return {
      month: date.toLocaleDateString('en-US', { month: 'short' }),
      capture: monthData.reduce((sum, item) => sum + item.carbonCapture.amount, 0),
      submissions: monthData.length
    };
  });

  const chartOptions: ApexOptions = {
    chart: {
      height: 200,
      type: "area",
      toolbar: { show: false },
      fontFamily: "inherit",
    },
    colors: ["#10B981"],
    fill: {
      type: "gradient",
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.3,
        opacityTo: 0.1,
        stops: [0, 90, 100]
      }
    },
    dataLabels: { enabled: false },
    stroke: {
      curve: "smooth",
      width: 2
    },
    grid: {
      show: false,
    },
    xaxis: {
      categories: monthlyData.map(item => item.month),
      labels: {
        style: { fontSize: "12px" }
      },
      axisBorder: { show: false },
      axisTicks: { show: false }
    },
    yaxis: {
      labels: {
        style: { fontSize: "12px" }
      }
    },
    tooltip: {
      y: {
        formatter: function (val) {
          return val.toFixed(2) + " tCO₂e"
        }
      }
    }
  };

  const chartSeries = [{
    name: "Carbon Capture",
    data: monthlyData.map(item => item.capture)
  }];

  const verificationRate = myData.length > 0 ? (verifiedData.length / myData.length) * 100 : 0;
  
  return (
    <div className={cn(
      "rounded-[10px] bg-white px-7.5 pb-6 pt-7.5 shadow-1 dark:bg-gray-dark dark:shadow-card",
      className
    )}>
      <div className="mb-6">
        <h2 className="text-body-2xlg font-bold text-dark dark:text-white">
          My Performance
        </h2>
        <p className="text-sm text-dark-4 dark:text-dark-6">
          {currentFisherName}
        </p>
      </div>

      {/* Key Stats */}
      <div className="mb-6 space-y-4">
        <div className="rounded-lg bg-green-50 p-4 dark:bg-green-900/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-dark-4 dark:text-dark-6">Total Verified</p>
              <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                {standardFormat(totalCapture)} tCO₂e
              </p>
            </div>
            <div className="h-12 w-12 rounded-full bg-green-500 flex items-center justify-center">
              <span className="text-white text-xl">✓</span>
            </div>
          </div>
        </div>

        <div className="rounded-lg bg-yellow-50 p-4 dark:bg-yellow-900/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-dark-4 dark:text-dark-6">Pending Review</p>
              <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                {standardFormat(pendingCapture)} tCO₂e
              </p>
            </div>
            <div className="h-12 w-12 rounded-full bg-yellow-500 flex items-center justify-center">
              <span className="text-white text-xl">⏳</span>
            </div>
          </div>
        </div>

        <div className="rounded-lg bg-blue-50 p-4 dark:bg-blue-900/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-dark-4 dark:text-dark-6">Verification Rate</p>
              <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {verificationRate.toFixed(1)}%
              </p>
            </div>
            <div className="h-12 w-12 rounded-full bg-blue-500 flex items-center justify-center">
              <span className="text-white text-xl">📊</span>
            </div>
          </div>
        </div>
      </div>

      {/* Performance Chart */}
      <div className="mb-6">
        <h3 className="mb-3 text-lg font-semibold text-dark dark:text-white">
          6-Month Trend
        </h3>
        <Chart
          options={chartOptions}
          series={chartSeries}
          type="area"
          height={200}
        />
      </div>

      {/* Quick Stats */}
      <div className="space-y-3">
        <div className="flex justify-between">
          <span className="text-sm text-dark-4 dark:text-dark-6">Total Submissions</span>
          <span className="font-semibold text-dark dark:text-white">{myData.length}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-sm text-dark-4 dark:text-dark-6">This Month</span>
          <span className="font-semibold text-dark dark:text-white">
            {monthlyData[monthlyData.length - 1]?.submissions || 0}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-sm text-dark-4 dark:text-dark-6">Average per Entry</span>
          <span className="font-semibold text-dark dark:text-white">
            {verifiedData.length > 0 ? (totalCapture / verifiedData.length).toFixed(2) : '0.00'} tCO₂e
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-sm text-dark-4 dark:text-dark-6">Ranking</span>
          <span className="font-semibold text-green-600 dark:text-green-400">
            Top 15%
          </span>
        </div>
      </div>
    </div>
  );
}
