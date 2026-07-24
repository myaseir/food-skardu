// lib/locations.ts
export function getDistanceFromBaseCoords(coords: { lat: number; lng: number }): number {
  return haversineDistance(BASE_LOCATION, coords) * ROAD_DISTANCE_FACTOR;
}
export function getDistanceBetweenCoords(
  a: { lat: number; lng: number },
  b: { lat: number; lng: number }
): number {
  return haversineDistance(a, b) * ROAD_DISTANCE_FACTOR;
}
// ---- Base location — DUMMY for testing, replace with your real hub coordinates ----
export const BASE_LOCATION = {
  lat: 35.311407,
  lng: 75.608147,
};

export const SKARDU_HOTELS: Record<string, { lat: number; lng: number }> = {
  "Rus Olive Lodge": { lat: 35.311407, lng: 75.608147, },
  "Hargisa Resort Skardu": { lat: 35.310978, lng: 75.601885 },
  "LOKAL Rooms x Skardu (Katpana Retreat)": { lat: 35.314685, lng: 75.599871 },
  "Green Orchard Skardu": { lat: 35.306766, lng: 75.616980 },
  "Oasis Resort Katpana Skardu": { lat: 35.314980, lng: 75.598315 },
  "Avari Xpress Skardu Hotel": { lat: 35.303392, lng: 75.623195 },
  "Hotel Mashabrum Skardu": { lat: 35.302685, lng: 75.623377 },
  "Skardu Luxus Hotel": { lat: 35.302837, lng: 75.623511 },
  "The Mountain Cottage Skardu": { lat: 35.295516, lng: 75.612092 },
  "Summit Hotel Skardu": { lat: 35.295183, lng: 75.6107736 },
  "Skardu Saraye Hotel & Resort": { lat: 35.30086, lng: 75.622784 },
  "Baltistan Tourist Cottage - Skardu": { lat: 35.294662, lng: 75.608173 },
  "Glamp Pakistan": { lat: 35.313309, lng: 75.587290 },
  "Montagna Pods": { lat: 35.313712, lng: 75.585431 },
  "Hotel Luxy Skardu": { lat: 35.293692, lng: 75.598939 },
  "Baltistan Fort, Skardu Resort Hotel": { lat: 35.312690, lng: 75.583920 },
  "Hotel Skardu1": { lat: 35.290962, lng: 75.616043},
  "Baltistan Resort": { lat: 35.291061, lng: 75.616048 },
  "Skardu Royal Hotel & Restaurant": { lat: 35.289628, lng: 75.621700 },
  "Sharif Cottages and Hotel Skardu": { lat: 35.294116, lng: 75.586451 },
  "Base Camp Katpana": { lat: 35.314606, lng: 75.575730 },
  "Hotel Dewan-e-Khas": { lat: 35.297131, lng: 75.635994 },
  "Legend Hotel Skardu": { lat: 35.297238, lng: 75.639697 },
  "Northlanders Guest House Skardu": { lat: 35.296224, lng: 75.639507 },
  "Hotel Travellodge Skardu": { lat: 35.2872001, lng: 75.6297769 },
  "Qayam Skardu": { lat: 35.294406, lng: 75.577494 },
  "Rafsal A Countryside Cottage": { lat: 35.282845, lng: 75.593186 },
  "Kentish Lodge Skardu": { lat: 35.287219, lng: 75.631949 },
  "Skardu Villas": { lat: 35.2946755, lng: 75.5732543 },
  "The Cherry Courtyard": { lat: 35.2943624, lng: 75.5730911 },
  "Ringchan Guest House & Restaurant": { lat: 35.2965464, lng: 75.6447761 },
  "Skardu Lodge": { lat: 35.2943293, lng: 75.6445334 },
  "Karakoram Nest": { lat: 35.295559, lng: 75.646619 },
  "Dynasty Skardu": { lat: 35.291683, lng: 75.572374 },
  "Sehrish Guest House Skardu": { lat: 35.287724, lng: 75.640768 },
  "PTDC Motel Skardu": { lat: 35.295372, lng: 75.647257 },
  "Hotel Reego Skardu": { lat: 35.290115, lng: 75.643359 },
  "Lavender Cottage & Guest House": { lat: 35.287208, lng: 75.640896 },
  "Rock View Skardu": { lat: 35.285407, lng: 75.638949 },
  "Dream Guest House Haji Gam Chowk": { lat: 35.283065, lng: 75.636096 },
  "Indus Lodges Skardu": { lat: 35.294855, lng: 75.648375 },
  "Pacific Guest House Skardu": { lat: 35.277476, lng: 75.627812 },
  "Skardu View Point Hotel and Huts": { lat: 35.277582, lng: 75.628114 },
  "Khar Hotel Skardu": { lat: 35.285919, lng: 75.642143 },
  "HIKK Inn Skardu": { lat: 35.277504, lng: 75.628628 },
  "Taaj Residence Skardu": { lat: 35.286193, lng: 75.643090 },
  "Homeland Guest House Skardu": { lat: 35.287944, lng: 75.645624 },
  "Sultan Guest House Skardu": { lat: 35.280719, lng: 75.637105 },
  "The Hill Town Resort": { lat: 35.276981, lng: 75.635154 },
  "AlJannah Guest House Skardu": { lat: 35.276633, lng: 75.636941 },
  "Deosai Gateway Inn Skardu": { lat: 35.276377, lng: 75.636659 },
  "Singay Homestay": { lat: 35.281832, lng: 75.644928 },
  "Skardu Arcadian Resort": { lat: 35.332459, lng: 75.563134 },
  "Areena Hotel Skardu": { lat: 35.284208, lng: 75.649936 },
  "Skardu Farmhouse for stay": { lat: 35.271210, lng: 75.637006 },
  "Adventure Sarai Hotel Skardu": { lat: 35.277564, lng: 75.649406 },
  "Maple Resort": { lat: 35.300490, lng: 75.549875 },
  "Candela Resorts": { lat: 35.267646, lng: 75.637557 },
  "Hispar Hotel Skardu": { lat: 35.267737, lng: 75.638158 },
  "K2 Paradise Guest House": { lat: 35.286314, lng: 75.662563 },
  "Holiday Mountain Resort & Camping Site": { lat: 35.267372, lng: 75.641693 },
  "Mountain Lodge Skardu": { lat: 35.266681, lng: 75.641188 },
  "Mulberry Continental Hotel Skardu": { lat: 35.321385, lng: 75.532726 },
  "PC Legacy Skardu": { lat: 35.322734, lng: 75.532062 },
  "GB Lodges": { lat: 35.328043, lng: 75.529147 },
  "Bilafond Cottage": { lat: 35.315943, lng: 75.693780 },
  "Pinnacle Executive Lodges": { lat: 35.333767, lng: 75.526399 },
  "Broq Resort, HussainAbad Nala": { lat: 35.280634, lng: 75.705931 },
  "Safena Hotel Skardu": { lat: 35.353392, lng: 75.510445 },
  "Khoj Resorts Shigar": { lat: 35.3702394, lng: 75.7385099 },
  "Dera Lamsa Resort, Shigar": { lat: 35.3738208, lng: 75.7439149 },
 
  "Byarsa Hotel Skardu": { lat: 35.420028, lng: 75.463517 },
  "Dream Nest Resort Hotels Skardu": { lat: 35.404635, lng: 75.443454 },
  
  "Shangrila Resort Skardu": { lat: 35.425960, lng: 75.456421 },
  "Kachura Inn Skardu": { lat: 35.424978, lng: 75.433406 },
  "Tibet Hotel Kachura Skardu": { lat: 35.425473, lng: 75.453743 },
  "Hotel Mountain Lagoon Skardu": { lat: 35.425442, lng: 75.453232 },
  "Skardu River Resort": { lat: 35.426085, lng: 75.452293 },
  "Morning Resort": { lat: 35.4390467, lng: 75.4505393 },
  "TheQue Skardu": { lat: 35.443078, lng: 75.452045 },
};

export const SKARDU_AREAS: Record<string, { lat: number; lng: number }> = {
  "Sundus Skilgrong": { lat: 35.311407, lng: 75.608147},
  "Sundus Gond": { lat: 35.318751, lng: 75.606104},
  Newranga: { lat: 35.2742, lng: 75.6234 },
  Katpana: { lat: 35.321459, lng: 75.581781 },
  Khargrong: { lat: 35.291730, lng: 75.646852 },
  "Hasnain Nagar": { lat: 35.288269, lng: 75.633791 },
  "Alamdar Chowk": { lat: 35.289529, lng: 75.635020 },
  "Hassan Colony": { lat: 35.284283, lng: 75.627185 },
  "Hassan Colony Pine": { lat: 35.284393, lng: 75.627201 },
  "Shinkhani Gond": { lat: 35.286916, lng: 75.6298288 },
  "Oldiing Nansoq": { lat: 35.278299, lng: 75.653328 },
  "RHQ Road Harriot Hotel": { lat: 35.292805, lng: 75.655943 },
  "Newranga Near Agha Ali House": { lat: 35.289412, lng: 75.617607 },
  "Newranga ": { lat: 35.2975638, lng: 75.6178595 },
  "Kushmarah": { lat: 35.2824495, lng: 75.6136015 },
  "Sherthang Girls High School": { lat: 35.2769881, lng: 75.6310918 },
  "Marfie Colony": { lat: 35.2780217, lng: 75.6393933 },
  "Chumik": { lat: 35.301296, lng: 75.640535 },
  "Gamba Skardu": { lat: 35.3194498, lng: 75.5352877 },
  "United Line": { lat: 35.2845173, lng: 75.6295549 },
  "Muhib Road Khargrong": { lat: 35.293274, lng: 75.644867 },
  "GB Chief Court Skardu Registry Skardu": { lat: 35.290499, lng: 75.600953 },
  "Shaheen Public School Skardu": { lat: 35.283543, lng: 75.620709 },
  "Mehdi Colony Skardu": { lat: 35.280880, lng: 75.622837 },
  "Agha Hadi Chowk": { lat: 35.289714, lng: 75.645761 },
  "Hussainabad": { lat: 35.296288, lng: 75.694843 },
  "Hameed Garh": { lat: 35.294471, lng: 75.651311 },
  "Shaheed colony": { lat: 35.3073918, lng: 75.6131777 },
  "Tufail colony": { lat: 35.305638, lng: 75.6199754 },
  "Jafferi Mohallah": { lat: 35.302586, lng: 75.6294966 },
  "Chogo Matamsara": { lat: 35.3019392, lng: 75.6350404 },
  "Nagulispang Road": { lat: 35.2916037, lng: 75.6315213 },
  Aliabad: { lat: 35.284291, lng: 75.637408 },
  Gayool: { lat: 35.2737, lng: 75.5669 },
  Patwal: { lat: 35.222, lng: 75.7603 },
  Olding: { lat: 35.28, lng: 75.7417 },
  Karasmathang: { lat: 35.290425, lng: 75.650962 },
  
  Kachura: { lat: 35.434870, lng: 75.4501409 },
};

// Merged lookup for the delivery calculator.
// No name collisions currently exist between hotels and areas —
// if one is ever added to both, the SKARDU_AREAS entry wins here
// since it's spread second.
export const SKARDU_LOCATIONS: Record<string, { lat: number; lng: number }> = {
  ...SKARDU_HOTELS,
  ...SKARDU_AREAS,
};

// ---- Haversine formula — straight-line distance between two coordinates (km) ----
function haversineDistance(
  a: { lat: number; lng: number },
  b: { lat: number; lng: number }
): number {
  const R = 6371; // Earth's radius in km
  const dLat = ((b.lat - a.lat) * Math.PI) / 180;
  const dLng = ((b.lng - a.lng) * Math.PI) / 180;
  const lat1 = (a.lat * Math.PI) / 180;
  const lat2 = (b.lat * Math.PI) / 180;

  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}

// Straight-line distance underestimates real road distance (roads bend around
// the river/mountains in Skardu). This factor corrects for that — calibrate it
// by comparing a real rider's odometer reading on a known route to the raw
// straight-line number, then adjust until they roughly match.
const ROAD_DISTANCE_FACTOR = 1.4;

// ---- Public function: distance from base location to any hotel/area (km) ----
export function getDistanceFromBase(locationName: string): number {
  const coords = SKARDU_LOCATIONS[locationName];
  if (!coords) throw new Error(`Unknown location: ${locationName}`);
  return haversineDistance(BASE_LOCATION, coords) * ROAD_DISTANCE_FACTOR;
}

// ---- Public function: distance between any two hotels/areas (km) ----
export function getDistanceBetweenLocations(a: string, b: string): number {
  const coordsA = SKARDU_LOCATIONS[a];
  const coordsB = SKARDU_LOCATIONS[b];
  if (!coordsA || !coordsB) throw new Error(`Unknown location: ${a} or ${b}`);
  if (a === b) return 0.5; // small buffer for same-location trips
  return haversineDistance(coordsA, coordsB) * ROAD_DISTANCE_FACTOR;
}