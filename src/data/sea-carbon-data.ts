// Dummy data for carbon capture by fishers in marine environments
export interface FisherCarbonData {
  id: string;
  fisherId: string;
  fisherName: string;
  location: {
    lat: number;
    lng: number;
    regionName: string;
    depth: number; // meters
  };
  carbonCapture: {
    amount: number; // tCO2e
    method: 'seaweed_farming' | 'blue_mussel' | 'kelp_restoration' | 'mangrove_protection' | 'seagrass_conservation';
    verification: 'verified' | 'pending' | 'rejected';
  };
  timestamp: string;
  equipment: string[];
  weather: {
    temperature: number; // celsius
    salinity: number; // ppt
    ph: number;
  };
}

export interface HeatmapDataPoint {
  lat: number;
  lng: number;
  intensity: number; // carbon capture amount
  timestamp: string;
  regionName: string;
}

// Generate realistic coordinates around major fishing areas
const FISHING_REGIONS = [
  // European regions
  { name: 'North Atlantic', center: { lat: 59.0, lng: -18.0 }, radius: 5 },
  { name: 'Norwegian Sea', center: { lat: 65.0, lng: 2.0 }, radius: 4 },
  { name: 'Baltic Sea', center: { lat: 57.0, lng: 18.0 }, radius: 3 },
  { name: 'Celtic Sea', center: { lat: 50.0, lng: -8.0 }, radius: 3 },
  { name: 'Bay of Biscay', center: { lat: 45.0, lng: -4.0 }, radius: 2.5 },
  { name: 'Mediterranean West', center: { lat: 40.0, lng: 2.0 }, radius: 3 },
  { name: 'Adriatic Sea', center: { lat: 43.0, lng: 15.0 }, radius: 2 },
  { name: 'Aegean Sea', center: { lat: 38.0, lng: 25.0 }, radius: 2 },
  
  // African regions
  { name: 'West Africa', center: { lat: 0.0, lng: 0.0 }, radius: 8 },
  { name: 'East Africa', center: { lat: -10.0, lng: 40.0 }, radius: 6 },
  { name: 'North Africa', center: { lat: 35.0, lng: 15.0 }, radius: 4 },
  
  // Asian regions
  { name: 'South Asia', center: { lat: 15.0, lng: 75.0 }, radius: 6 },
  { name: 'Southeast Asia', center: { lat: 5.0, lng: 110.0 }, radius: 7 },
  { name: 'East Asia', center: { lat: 30.0, lng: 125.0 }, radius: 5 },
  
  // Other regions
  { name: 'Pacific Islands', center: { lat: -10.0, lng: 160.0 }, radius: 8 },
  { name: 'Indian Ocean', center: { lat: -10.0, lng: 70.0 }, radius: 6 },
  { name: 'Caribbean', center: { lat: 15.0, lng: -70.0 }, radius: 4 },
  { name: 'South America', center: { lat: -20.0, lng: -50.0 }, radius: 6 },
  { name: 'Middle East', center: { lat: 27.0, lng: 52.0 }, radius: 3 },
];

const FISHER_NAMES = [
  'Captain Erik Nordström', 'Maria Santos', 'Giuseppe Marino', 'Astrid Hansen',
  'Jean-Pierre Dubois', 'Olaf Kristensen', 'Isabella Rodriguez', 'Dimitris Papadopoulos',
  'Liam O\'Connor', 'Sofia Petrova', 'Magnus Eriksson', 'Elena Kozlova',
  'Pedro Fernandez', 'Ingrid Larsson', 'Andreas Müller', 'Catalina Ionescu'
];

const CARBON_METHODS = [
  'seaweed_farming', 'blue_mussel', 'kelp_restoration', 'mangrove_protection', 'seagrass_conservation'
] as const;

const EQUIPMENT_OPTIONS = [
  ['GPS tracker', 'Salinity meter', 'pH probe'],
  ['Underwater camera', 'Depth sounder', 'Temperature probe'],
  ['Water quality sensor', 'Biomass net', 'Current meter'],
  ['ROV drone', 'Sediment sampler', 'Oxygen meter'],
  ['Algae harvester', 'Kelp knife', 'Buoyancy compensator']
];

function generateRandomInRange(min: number, max: number): number {
  return Math.random() * (max - min) + min;
}

function generateCoordinateInRegion(region: typeof FISHING_REGIONS[0]) {
  const angle = Math.random() * 2 * Math.PI;
  const distance = Math.random() * region.radius;
  
  return {
    lat: region.center.lat + (distance * Math.cos(angle)),
    lng: region.center.lng + (distance * Math.sin(angle)),
    regionName: region.name
  };
}

function generateTimestamp(daysAgo: number): string {
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  return date.toISOString();
}

// Generate dummy data for the last 90 days
export function generateDummyCarbonData(): FisherCarbonData[] {
  const data: FisherCarbonData[] = [];
  
  for (let day = 0; day < 90; day++) {
    // Generate 5-15 data points per day
    const pointsPerDay = Math.floor(generateRandomInRange(5, 16));
    
    for (let point = 0; point < pointsPerDay; point++) {
      const region = FISHING_REGIONS[Math.floor(Math.random() * FISHING_REGIONS.length)];
      const location = generateCoordinateInRegion(region);
      const fisherId = `F${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`;
      const fisherName = FISHER_NAMES[Math.floor(Math.random() * FISHER_NAMES.length)];
      const method = CARBON_METHODS[Math.floor(Math.random() * CARBON_METHODS.length)];
      
      // Carbon capture amounts vary by method
      let carbonAmount = 0;
      switch (method) {
        case 'seaweed_farming':
          carbonAmount = generateRandomInRange(0.5, 3.2);
          break;
        case 'kelp_restoration':
          carbonAmount = generateRandomInRange(0.8, 4.1);
          break;
        case 'blue_mussel':
          carbonAmount = generateRandomInRange(0.2, 1.8);
          break;
        case 'mangrove_protection':
          carbonAmount = generateRandomInRange(1.2, 5.5);
          break;
        case 'seagrass_conservation':
          carbonAmount = generateRandomInRange(0.3, 2.1);
          break;
      }
      
      const verification = Math.random() > 0.15 ? 'verified' : (Math.random() > 0.5 ? 'pending' : 'rejected');
      
      data.push({
        id: `${fisherId}-${day}-${point}`,
        fisherId,
        fisherName,
        location: {
          ...location,
          depth: generateRandomInRange(5, 200)
        },
        carbonCapture: {
          amount: carbonAmount,
          method,
          verification
        },
        timestamp: generateTimestamp(day),
        equipment: EQUIPMENT_OPTIONS[Math.floor(Math.random() * EQUIPMENT_OPTIONS.length)],
        weather: {
          temperature: generateRandomInRange(4, 22),
          salinity: generateRandomInRange(30, 38),
          ph: generateRandomInRange(7.8, 8.3)
        }
      });
    }
  }
  
  return data.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
}

// Convert raw data to heatmap format
export function convertToHeatmapData(rawData: FisherCarbonData[]): HeatmapDataPoint[] {
  return rawData
    .filter(item => item.carbonCapture.verification === 'verified')
    .map(item => ({
      lat: item.location.lat,
      lng: item.location.lng,
      intensity: item.carbonCapture.amount,
      timestamp: item.timestamp,
      regionName: item.location.regionName
    }));
}

// Aggregate data by time periods
export function aggregateDataByPeriod(data: FisherCarbonData[], period: 'daily' | 'weekly' | 'monthly') {
  const aggregated = new Map();
  
  data.forEach(item => {
    const date = new Date(item.timestamp);
    let key: string;
    
    switch (period) {
      case 'daily':
        key = date.toISOString().split('T')[0];
        break;
      case 'weekly':
        const weekStart = new Date(date);
        weekStart.setDate(date.getDate() - date.getDay());
        key = weekStart.toISOString().split('T')[0];
        break;
      case 'monthly':
        key = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}`;
        break;
    }
    
    if (!aggregated.has(key)) {
      aggregated.set(key, {
        period: key,
        totalCapture: 0,
        verifiedCapture: 0,
        pendingCapture: 0,
        fisherCount: new Set(),
        regionBreakdown: new Map()
      });
    }
    
    const entry = aggregated.get(key);
    entry.totalCapture += item.carbonCapture.amount;
    
    if (item.carbonCapture.verification === 'verified') {
      entry.verifiedCapture += item.carbonCapture.amount;
    } else if (item.carbonCapture.verification === 'pending') {
      entry.pendingCapture += item.carbonCapture.amount;
    }
    
    entry.fisherCount.add(item.fisherId);
    
    if (!entry.regionBreakdown.has(item.location.regionName)) {
      entry.regionBreakdown.set(item.location.regionName, 0);
    }
    entry.regionBreakdown.set(
      item.location.regionName, 
      entry.regionBreakdown.get(item.location.regionName) + item.carbonCapture.amount
    );
  });
  
  return Array.from(aggregated.values()).map(entry => ({
    ...entry,
    fisherCount: entry.fisherCount.size,
    regionBreakdown: Object.fromEntries(entry.regionBreakdown)
  }));
}

// Get summary statistics
export function getCarbonDataSummary(data: FisherCarbonData[]) {
  const verifiedData = data.filter(item => item.carbonCapture.verification === 'verified');
  const totalCapture = verifiedData.reduce((sum, item) => sum + item.carbonCapture.amount, 0);
  const uniqueFishers = new Set(data.map(item => item.fisherId)).size;
  const uniqueRegions = new Set(data.map(item => item.location.regionName)).size;
  
  const methodBreakdown = CARBON_METHODS.reduce((acc, method) => {
    acc[method] = verifiedData
      .filter(item => item.carbonCapture.method === method)
      .reduce((sum, item) => sum + item.carbonCapture.amount, 0);
    return acc;
  }, {} as Record<string, number>);
  
  return {
    totalCapture,
    uniqueFishers,
    uniqueRegions,
    verificationRate: (verifiedData.length / data.length) * 100,
    methodBreakdown,
    averageCapturePerFisher: totalCapture / uniqueFishers,
    last7DaysCapture: verifiedData
      .filter(item => {
        const date = new Date(item.timestamp);
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        return date >= sevenDaysAgo;
      })
      .reduce((sum, item) => sum + item.carbonCapture.amount, 0)
  };
}

// Generate the dummy data
export const DUMMY_CARBON_DATA = generateDummyCarbonData();
export const HEATMAP_DATA = convertToHeatmapData(DUMMY_CARBON_DATA);
export const CARBON_SUMMARY = getCarbonDataSummary(DUMMY_CARBON_DATA);
