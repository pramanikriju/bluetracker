"use client";

export function QuickActions() {
  const actions = [
    {
      title: "Quick Submit",
      description: "Fast data entry for regular activities",
      icon: "⚡",
      color: "bg-blue-500",
      action: () => {
        // Scroll to form
        document.querySelector('form')?.scrollIntoView({ behavior: 'smooth' });
      }
    },
    {
      title: "Photo Upload",
      description: "Add photos to your submissions",
      icon: "📸",
      color: "bg-green-500",
      action: () => {
        alert("Photo upload feature coming soon!");
      }
    },
    {
      title: "GPS Logger",
      description: "Automatically track your location",
      icon: "🗺️",
      color: "bg-purple-500",
      action: () => {
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              alert(`Current location: ${position.coords.latitude.toFixed(6)}, ${position.coords.longitude.toFixed(6)}`);
            },
            (error) => {
              alert('Unable to get location: ' + error.message);
            }
          );
        } else {
          alert('Geolocation is not supported by this browser.');
        }
      }
    },
    {
      title: "Export Data",
      description: "Download your submission history",
      icon: "📊",
      color: "bg-orange-500",
      action: () => {
        alert("Export feature coming soon!");
      }
    }
  ];

  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
      {actions.map((action, index) => (
        <button
          key={index}
          onClick={action.action}
          className="group rounded-lg border border-gray-200 bg-white p-4 text-left transition-all hover:border-blue-300 hover:shadow-md dark:border-gray-700 dark:bg-gray-dark dark:hover:border-blue-600"
        >
          <div className={`mb-3 inline-flex h-12 w-12 items-center justify-center rounded-lg ${action.color} text-white transition-transform group-hover:scale-110`}>
            <span className="text-xl">{action.icon}</span>
          </div>
          <h3 className="mb-1 font-semibold text-dark dark:text-white">
            {action.title}
          </h3>
          <p className="text-sm text-dark-4 dark:text-dark-6">
            {action.description}
          </p>
        </button>
      ))}
    </div>
  );
}
