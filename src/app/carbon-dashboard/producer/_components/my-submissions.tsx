"use client";

import { cn } from "@/lib/utils";
import { standardFormat } from "@/lib/format-number";
import { DUMMY_CARBON_DATA } from "@/data/sea-carbon-data";

type PropsType = {
  className?: string;
};

export function MySubmissions({ className }: PropsType) {
  // Simulate current user data
  const currentFisherId = "F001";
  const mySubmissions = DUMMY_CARBON_DATA
    .filter(item => item.fisherId === currentFisherId)
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, 10); // Show last 10 submissions

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'verified':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'rejected':
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'verified':
        return '✅';
      case 'pending':
        return '⏳';
      case 'rejected':
        return '❌';
      default:
        return '❓';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getMethodLabel = (method: string) => {
    const labels: Record<string, string> = {
      seaweed_farming: "Seaweed Farming",
      blue_mussel: "Blue Mussel",
      kelp_restoration: "Kelp Restoration",
      mangrove_protection: "Mangrove Protection",
      seagrass_conservation: "Seagrass Conservation"
    };
    return labels[method] || method;
  };

  return (
    <div className={cn(
      "rounded-[10px] bg-white px-7.5 pb-6 pt-7.5 shadow-1 dark:bg-gray-dark dark:shadow-card",
      className
    )}>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <h2 className="text-body-2xlg font-bold text-dark dark:text-white">
          My Recent Submissions
        </h2>
        <button className="rounded-lg bg-blue-500 px-4 py-2 text-sm text-white hover:bg-blue-600">
          View All
        </button>
      </div>

      {mySubmissions.length === 0 ? (
        <div className="py-12 text-center">
          <div className="mx-auto mb-4 h-16 w-16 rounded-full bg-gray-100 flex items-center justify-center dark:bg-gray-800">
            <span className="text-2xl">📊</span>
          </div>
          <h3 className="mb-2 text-lg font-semibold text-dark dark:text-white">
            No submissions yet
          </h3>
          <p className="text-dark-4 dark:text-dark-6">
            Start submitting your carbon capture data to see it here.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="pb-3 text-left text-sm font-semibold text-dark-4 dark:text-dark-6">Date</th>
                <th className="pb-3 text-left text-sm font-semibold text-dark-4 dark:text-dark-6">Location</th>
                <th className="pb-3 text-left text-sm font-semibold text-dark-4 dark:text-dark-6">Method</th>
                <th className="pb-3 text-right text-sm font-semibold text-dark-4 dark:text-dark-6">Capture</th>
                <th className="pb-3 text-center text-sm font-semibold text-dark-4 dark:text-dark-6">Status</th>
                <th className="pb-3 text-center text-sm font-semibold text-dark-4 dark:text-dark-6">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {mySubmissions.map((submission) => (
                <tr key={submission.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                  <td className="py-4">
                    <div className="text-sm text-dark dark:text-white">
                      {formatDate(submission.timestamp)}
                    </div>
                  </td>
                  <td className="py-4">
                    <div>
                      <div className="text-sm font-medium text-dark dark:text-white">
                        {submission.location.regionName}
                      </div>
                      <div className="text-xs text-dark-4 dark:text-dark-6">
                        {submission.location.lat.toFixed(3)}°, {submission.location.lng.toFixed(3)}°
                      </div>
                    </div>
                  </td>
                  <td className="py-4">
                    <div className="text-sm text-dark dark:text-white">
                      {getMethodLabel(submission.carbonCapture.method)}
                    </div>
                    <div className="text-xs text-dark-4 dark:text-dark-6">
                      {submission.location.depth}m depth
                    </div>
                  </td>
                  <td className="py-4 text-right">
                    <div className="text-sm font-semibold text-dark dark:text-white">
                      {standardFormat(submission.carbonCapture.amount)} tCO₂e
                    </div>
                  </td>
                  <td className="py-4 text-center">
                    <span className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium ${getStatusColor(submission.carbonCapture.verification)}`}>
                      <span>{getStatusIcon(submission.carbonCapture.verification)}</span>
                      {submission.carbonCapture.verification.charAt(0).toUpperCase() + submission.carbonCapture.verification.slice(1)}
                    </span>
                  </td>
                  <td className="py-4 text-center">
                    <div className="flex justify-center gap-1">
                      <button
                        className="rounded p-1 text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-900/20"
                        title="View Details"
                      >
                        👁️
                      </button>
                      {submission.carbonCapture.verification === 'pending' && (
                        <button
                          className="rounded p-1 text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800"
                          title="Edit"
                        >
                          ✏️
                        </button>
                      )}
                      <button
                        className="rounded p-1 text-green-600 hover:bg-green-100 dark:hover:bg-green-900/20"
                        title="Download Report"
                      >
                        📄
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Summary Footer */}
      <div className="mt-6 grid grid-cols-1 gap-4 rounded-lg bg-gray-50 p-4 dark:bg-gray-800 md:grid-cols-4">
        <div className="text-center">
          <p className="text-lg font-bold text-dark dark:text-white">
            {mySubmissions.length}
          </p>
          <p className="text-sm text-dark-4 dark:text-dark-6">Total Submissions</p>
        </div>
        <div className="text-center">
          <p className="text-lg font-bold text-green-600 dark:text-green-400">
            {mySubmissions.filter(s => s.carbonCapture.verification === 'verified').length}
          </p>
          <p className="text-sm text-dark-4 dark:text-dark-6">Verified</p>
        </div>
        <div className="text-center">
          <p className="text-lg font-bold text-yellow-600 dark:text-yellow-400">
            {mySubmissions.filter(s => s.carbonCapture.verification === 'pending').length}
          </p>
          <p className="text-sm text-dark-4 dark:text-dark-6">Pending</p>
        </div>
        <div className="text-center">
          <p className="text-lg font-bold text-dark dark:text-white">
            {standardFormat(mySubmissions
              .filter(s => s.carbonCapture.verification === 'verified')
              .reduce((sum, s) => sum + s.carbonCapture.amount, 0)
            )} tCO₂e
          </p>
          <p className="text-sm text-dark-4 dark:text-dark-6">Total Verified</p>
        </div>
      </div>
    </div>
  );
}
