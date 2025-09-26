"use client";

import { cn } from "@/lib/utils";
import { useState } from "react";

export function DataSubmissionForm() {
  const [formData, setFormData] = useState({
    location: {
      latitude: '',
      longitude: '',
      regionName: '',
      depth: ''
    },
    carbonCapture: {
      amount: '',
      method: 'seaweed_farming',
      description: ''
    },
    equipment: [] as string[],
    weather: {
      temperature: '',
      salinity: '',
      ph: ''
    },
    photos: [] as File[]
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const methodOptions = [
    { value: 'seaweed_farming', label: 'Seaweed Farming' },
    { value: 'blue_mussel', label: 'Blue Mussel Cultivation' },
    { value: 'kelp_restoration', label: 'Kelp Forest Restoration' },
    { value: 'mangrove_protection', label: 'Mangrove Protection' },
    { value: 'seagrass_conservation', label: 'Seagrass Conservation' }
  ];

  const equipmentOptions = [
    'GPS tracker', 'Salinity meter', 'pH probe', 'Underwater camera',
    'Depth sounder', 'Temperature probe', 'Water quality sensor',
    'Biomass net', 'Current meter', 'ROV drone', 'Sediment sampler',
    'Oxygen meter', 'Algae harvester', 'Kelp knife', 'Buoyancy compensator'
  ];

  const regionOptions = [
    'North Atlantic', 'Norwegian Sea', 'Baltic Sea', 'Celtic Sea',
    'Bay of Biscay', 'Mediterranean West', 'Adriatic Sea', 'Aegean Sea'
  ];

  const handleEquipmentChange = (equipment: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      equipment: checked 
        ? [...prev.equipment, equipment]
        : prev.equipment.filter(eq => eq !== equipment)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Reset form
    setFormData({
      location: { latitude: '', longitude: '', regionName: '', depth: '' },
      carbonCapture: { amount: '', method: 'seaweed_farming', description: '' },
      equipment: [],
      weather: { temperature: '', salinity: '', ph: '' },
      photos: []
    });
    
    setIsSubmitting(false);
    alert('Data submitted successfully! It will be reviewed for verification.');
  };

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setFormData(prev => ({
            ...prev,
            location: {
              ...prev.location,
              latitude: position.coords.latitude.toFixed(6),
              longitude: position.coords.longitude.toFixed(6)
            }
          }));
        },
        (error) => {
          alert('Unable to get location: ' + error.message);
        }
      );
    } else {
      alert('Geolocation is not supported by this browser.');
    }
  };

  return (
    <div className="rounded-[10px] bg-white px-7.5 pb-6 pt-7.5 shadow-1 dark:bg-gray-dark dark:shadow-card">
      <div className="mb-6">
        <h2 className="text-body-2xlg font-bold text-dark dark:text-white">
          Submit Carbon Capture Data
        </h2>
        <p className="mt-2 text-sm text-dark-4 dark:text-dark-6">
          Record your blue carbon capture activities for verification and analytics
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Location Information */}
        <div className="rounded-lg border border-gray-200 p-4 dark:border-gray-700">
          <h3 className="mb-4 text-lg font-semibold text-dark dark:text-white">Location Information</h3>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-dark dark:text-white">
                Latitude <span className="text-red-500">*</span>
              </label>
              <div className="flex gap-2">
                <input
                  type="number"
                  step="any"
                  required
                  value={formData.location.latitude}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    location: { ...prev.location, latitude: e.target.value }
                  }))}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-dark focus:border-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                  placeholder="e.g., 59.123456"
                />
                <button
                  type="button"
                  onClick={getCurrentLocation}
                  className="whitespace-nowrap rounded-lg bg-blue-500 px-3 py-2 text-xs text-white hover:bg-blue-600"
                >
                  Use GPS
                </button>
              </div>
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-dark dark:text-white">
                Longitude <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                step="any"
                required
                value={formData.location.longitude}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  location: { ...prev.location, longitude: e.target.value }
                }))}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-dark focus:border-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                placeholder="e.g., -18.654321"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-dark dark:text-white">
                Region <span className="text-red-500">*</span>
              </label>
              <select
                required
                value={formData.location.regionName}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  location: { ...prev.location, regionName: e.target.value }
                }))}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-dark focus:border-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              >
                <option value="">Select a region</option>
                {regionOptions.map(region => (
                  <option key={region} value={region}>{region}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-dark dark:text-white">
                Depth (meters) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                min="0"
                max="1000"
                required
                value={formData.location.depth}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  location: { ...prev.location, depth: e.target.value }
                }))}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-dark focus:border-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                placeholder="e.g., 25"
              />
            </div>
          </div>
        </div>

        {/* Carbon Capture Information */}
        <div className="rounded-lg border border-gray-200 p-4 dark:border-gray-700">
          <h3 className="mb-4 text-lg font-semibold text-dark dark:text-white">Carbon Capture Details</h3>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-dark dark:text-white">
                Estimated Capture (tCO₂e) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                required
                value={formData.carbonCapture.amount}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  carbonCapture: { ...prev.carbonCapture, amount: e.target.value }
                }))}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-dark focus:border-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                placeholder="e.g., 2.5"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-dark dark:text-white">
                Capture Method <span className="text-red-500">*</span>
              </label>
              <select
                required
                value={formData.carbonCapture.method}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  carbonCapture: { ...prev.carbonCapture, method: e.target.value }
                }))}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-dark focus:border-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              >
                {methodOptions.map(method => (
                  <option key={method.value} value={method.value}>{method.label}</option>
                ))}
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="mb-2 block text-sm font-medium text-dark dark:text-white">
                Activity Description
              </label>
              <textarea
                rows={3}
                value={formData.carbonCapture.description}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  carbonCapture: { ...prev.carbonCapture, description: e.target.value }
                }))}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-dark focus:border-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                placeholder="Describe your carbon capture activities..."
              />
            </div>
          </div>
        </div>

        {/* Equipment Used */}
        <div className="rounded-lg border border-gray-200 p-4 dark:border-gray-700">
          <h3 className="mb-4 text-lg font-semibold text-dark dark:text-white">Equipment Used</h3>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
            {equipmentOptions.map(equipment => (
              <label key={equipment} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={formData.equipment.includes(equipment)}
                  onChange={(e) => handleEquipmentChange(equipment, e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-dark dark:text-white">{equipment}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Environmental Conditions */}
        <div className="rounded-lg border border-gray-200 p-4 dark:border-gray-700">
          <h3 className="mb-4 text-lg font-semibold text-dark dark:text-white">Environmental Conditions</h3>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div>
              <label className="mb-2 block text-sm font-medium text-dark dark:text-white">
                Water Temperature (°C)
              </label>
              <input
                type="number"
                step="0.1"
                value={formData.weather.temperature}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  weather: { ...prev.weather, temperature: e.target.value }
                }))}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-dark focus:border-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                placeholder="e.g., 15.5"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-dark dark:text-white">
                Salinity (ppt)
              </label>
              <input
                type="number"
                step="0.1"
                value={formData.weather.salinity}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  weather: { ...prev.weather, salinity: e.target.value }
                }))}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-dark focus:border-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                placeholder="e.g., 35.0"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-dark dark:text-white">
                pH Level
              </label>
              <input
                type="number"
                step="0.1"
                min="0"
                max="14"
                value={formData.weather.ph}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  weather: { ...prev.weather, ph: e.target.value }
                }))}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-dark focus:border-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                placeholder="e.g., 8.1"
              />
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isSubmitting}
            className={cn(
              "rounded-lg px-6 py-3 font-medium text-white transition-colors",
              isSubmitting
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700 focus:ring-2 focus:ring-blue-500"
            )}
          >
            {isSubmitting ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Submitting...
              </span>
            ) : (
              'Submit Data for Verification'
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
