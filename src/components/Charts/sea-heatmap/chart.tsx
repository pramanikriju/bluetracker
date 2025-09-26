"use client";

import { useIsMobile } from "@/hooks/use-mobile";
import type { ApexOptions } from "apexcharts";
import dynamic from "next/dynamic";

type PropsType = {
  data: Array<{
    period: string;
    totalCapture: number;
    verifiedCapture: number;
    pendingCapture: number;
    fisherCount: number;
    regionBreakdown: Record<string, number>;
  }>;
  timeFrame: string;
};

const Chart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

export function SeaHeatmapChart({ data, timeFrame }: PropsType) {
  const isMobile = useIsMobile();

  // Create a comprehensive heatmap showing regions vs time periods
  const regions = ['North Atlantic', 'Norwegian Sea', 'Baltic Sea', 'Celtic Sea', 'Bay of Biscay', 'Mediterranean West', 'Adriatic Sea', 'Aegean Sea'];
  
  // Prepare data for heatmap - regions vs time periods
  const heatmapSeries = regions.map(region => ({
    name: region,
    data: data.map(item => ({
      x: item.period,
      y: (item.regionBreakdown[region] || 0).toFixed(2)
    }))
  }));

  const options: ApexOptions = {
    chart: {
      height: 400,
      type: "heatmap",
      toolbar: {
        show: false,
      },
      fontFamily: "inherit",
    },
    colors: ["#008FFB"],
    dataLabels: {
      enabled: false,
    },
    title: {
      text: "Carbon Capture Distribution by Region and Time",
      style: {
        fontSize: "16px",
        fontWeight: "600",
        color: "#1f2937"
      }
    },
    xaxis: {
      type: "category",
      labels: {
        rotate: -45,
        style: {
          fontSize: "12px"
        }
      },
      title: {
        text: timeFrame === 'daily' ? 'Days' : timeFrame === 'weekly' ? 'Weeks' : 'Months',
        style: {
          fontSize: "14px",
          fontWeight: "500"
        }
      }
    },
    yaxis: {
      title: {
        text: "Marine Regions",
        style: {
          fontSize: "14px",
          fontWeight: "500"
        }
      }
    },
    plotOptions: {
      heatmap: {
        shadeIntensity: 0.5,
        radius: 0,
        useFillColorAsStroke: true,
        colorScale: {
          ranges: [
            {
              from: 0,
              to: 0.5,
              name: "Very Low",
              color: "#E3F2FD"
            },
            {
              from: 0.5,
              to: 2,
              name: "Low",
              color: "#BBDEFB"
            },
            {
              from: 2,
              to: 5,
              name: "Medium",
              color: "#64B5F6"
            },
            {
              from: 5,
              to: 10,
              name: "High",
              color: "#2196F3"
            },
            {
              from: 10,
              to: 999,
              name: "Very High",
              color: "#0D47A1"
            }
          ]
        }
      }
    },
    tooltip: {
      y: {
        formatter: function (val) {
          return val + " tCO₂e"
        }
      }
    },
    legend: {
      show: true,
      position: "bottom"
    }
  };

  return (
    <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
      <Chart
        options={options}
        series={heatmapSeries}
        type="heatmap"
        height={400}
      />
      
      {/* Additional time series chart for trends */}
      <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
        <TimeSeriesChart data={data} />
      </div>
    </div>
  );
}

function TimeSeriesChart({ data }: { data: PropsType['data'] }) {
  const options: ApexOptions = {
    chart: {
      height: 250,
      type: "area",
      toolbar: {
        show: false,
      },
      fontFamily: "inherit",
    },
    colors: ["#10B981", "#F59E0B", "#EF4444"],
    fill: {
      type: "gradient",
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.3,
        opacityTo: 0.4,
        stops: [0, 90, 100]
      }
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      curve: "smooth",
      width: 2
    },
    title: {
      text: "Carbon Capture Trends Over Time",
      style: {
        fontSize: "14px",
        fontWeight: "500"
      }
    },
    xaxis: {
      categories: data.map(item => item.period),
      labels: {
        style: {
          fontSize: "11px"
        }
      }
    },
    yaxis: {
      title: {
        text: "Carbon Capture (tCO₂e)",
        style: {
          fontSize: "12px"
        }
      }
    },
    tooltip: {
      x: {
        format: 'dd/MM/yy'
      },
      y: {
        formatter: function (val) {
          return val.toFixed(2) + " tCO₂e"
        }
      }
    },
    legend: {
      position: "top",
      horizontalAlign: "right",
      fontSize: "12px"
    }
  };

  const series = [
    {
      name: "Verified Capture",
      data: data.map(item => item.verifiedCapture)
    },
    {
      name: "Pending Verification",
      data: data.map(item => item.pendingCapture)
    }
  ];

  return (
    <Chart
      options={options}
      series={series}
      type="area"
      height={250}
    />
  );
}
