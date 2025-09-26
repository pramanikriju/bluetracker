import { DataSubmissionForm } from "./_components/data-submission-form";
import { MySubmissions } from "./_components/my-submissions";
import { ProducerStats } from "./_components/producer-stats";
import { QuickActions } from "./_components/quick-actions";
import { Suspense } from "react";

export default function ProducerDashboard() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-dark dark:text-white">
          Fisher Data Portal
        </h1>
        <p className="mt-2 text-dark-4 dark:text-dark-6">
          Submit and manage your blue carbon capture data
        </p>
      </div>

      {/* Quick Actions */}
      <QuickActions />

      {/* Main Content Grid */}
      <div className="grid grid-cols-12 gap-4 md:gap-6 2xl:gap-7.5">
        {/* Data Submission Form */}
        <div className="col-span-12 xl:col-span-8">
          <DataSubmissionForm />
        </div>

        {/* Producer Stats */}
        <div className="col-span-12 xl:col-span-4">
          <Suspense fallback={<div className="h-96 bg-gray-100 dark:bg-gray-800 rounded-lg animate-pulse" />}>
            <ProducerStats />
          </Suspense>
        </div>

        {/* My Submissions */}
        <div className="col-span-12">
          <Suspense fallback={<div className="h-64 bg-gray-100 dark:bg-gray-800 rounded-lg animate-pulse" />}>
            <MySubmissions />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
