// data/deliveryRawDistances.ts
//
// RAW manually-measured data ONLY. This file just stores numbers you
// personally check on Google Maps and type in — no lookup helpers, no
// fee formulas, no aggregation. All of that calculation logic lives in
// data/deliveryDistanceTime.ts, which imports the tables below and does
// the math. Splitting it this way means:
//   - this file stays a clean, boring, easy-to-scan data entry surface
//   - deliveryDistanceTime.ts can change its calculation logic freely
//     without ever risking a typo in the raw numbers
//
// Still fully independent from data/location.ts (coordinates) — nothing
// here touches that file.
//
// NOTE ON THE NUMBERS BELOW: every distance_km / estimated_minutes value
// in this file is DUMMY PLACEHOLDER DATA, generated so the structure is
// fully populated (every restaurant × every area × every hotel, both
// directions to/from the office, and every restaurant pair). None of it
// has been checked on Google Maps yet. Replace each entry with a real
// measurement as you get to it — nothing here is meant to ship as-is.
//
// DATA ENTRY RULES (unchanged):
// - distance_km is a FLOAT. 3.4 stays 3.4 — never rounded.
// - estimated_minutes is a plain number of minutes.
// - Leave unmeasured routes as UNMEASURED / null. Never guess.
// - Use real restaurant, area, and hotel names.

// ---------------------------------------------------------------------
// Shared value shape
// ---------------------------------------------------------------------

/** One manually-measured road distance + travel time pair. */
export interface DistanceTimeEntry {
  /** Road distance in kilometers, as a float (e.g. 2.1, 3.4, 5.7). Null = not measured yet. */
  distance_km: number | null;
  /** Approximate road travel time in minutes (e.g. 6, 9, 14). Null = not measured yet. */
  estimated_minutes: number | null;
}

/** A still-unmeasured entry — use this instead of hand-typing {null, null}. */
export const UNMEASURED: DistanceTimeEntry = Object.freeze({
  distance_km: null,
  estimated_minutes: null,
});

/** Distinguishes the two kinds of customer destination that share one table (Table 4 below). */
export type DestinationType = "Area" | "Hotel";

export interface DestinationToOfficeEntry extends DistanceTimeEntry {
  destinationType: DestinationType;
}

// ---------------------------------------------------------------------
// Name registries
// ---------------------------------------------------------------------
// Single source of truth for the names used across all four tables.
// Pulled directly from shops.ts (restaurants) and location.ts (areas/hotels).
// Add a new name here, then call the scaffolding helpers at the bottom to
// generate blank/null rows for it everywhere it is needed.

export const RESTAURANTS: string[] = [
  "Yak and Bull Cafe Skardu",
  "Baltistan Tea and Grill House",
  "The Kitchen",
  "Domino's Pizza Skardu",
  "The Balti Table",
  "Skyway Pizza Skardu",
  "The Food Corridor Skardu",
  "Sungum Hotel Restaurant Skardu ",
  "MFC Skardu",
  "Hassan Hussain Host",
  "Pizza King Skardu",
  "Yak Grill Skardu",
];

export const AREAS: string[] = [
  "Sundus Skilgrong",
  "Sundus Gond",
  "Katpana",
  "Khargrong",
  "Hasnain Nagar",
  "Alamdar Chowk",
  "Hassan Colony",
  "Hassan Colony Pine",
  "Shinkhani Gond",
  "Oldiing Nansoq",
  "RHQ Road Harriot Hotel",
  "Newranga Near Agha Ali House",
  "Newranga ",
  "Kushmarah",
  "Sherthang Girls High School",
  "Marfie Colony",
  "Chumik",
  "Gamba Skardu",
  "United Line, Hassan Colony",
  "Muhib Road Khargrong",
  "GB Chief Court Skardu Registry Skardu",
  "Shaheen Public School Skardu",
  "Mehdi Colony Skardu",
  "Agha Hadi Chowk",
  "Hussainabad",
  "Hameed Garh",
  "Shaheed colony",
  "Tufail colony",
  "Jafferi Mohallah",
  "Teen Talwar",
  "Chogo Matamsara",
  "Nagulispang Road",
  "Eidgah,Sundus ",
  "Sukemaidan ",
  "Hargissa shakthang",
  "Bhutto Bazar Skardu",
  "Devision",
  "Abbas Town",
  "Musa Line",
  "Clifton pull",
  "Sheikh ijaz masjid",
  "Khila Toq Road",
  "Public school area",
  "Xhathang",
  "Brolmo colony sundus",
  "Ghazi Colony sundus",
  "Hyderabad Gangupi Area",
  "LT Col ihsan Ali rd",
  "Astana skardu",
  "Bintul Huda Girls model school",
  "Brolmo colony astana",
  "Raees mohalla Haji Gam",
  "Haji Gam",
  "Gulshan e Ali skardu",
  "Jamia masjid road",
  "Gayool skardu",
  "Toqrangah Skardu",
  "Maqponsar skardu",
  "Newranga road",
  "Quaidabad",
  "Kharpocho Road",
  "Patwal",
  "Olding",
  "Karasmathang",
   "3 talwar chowk chowk",
   "Teen talwar chowk chowk",
    "Sahara Complex",
    "Ali plaza",
    "Radio Pakistan Chowk",
    "Manthal" 
  // "Kachura",
];

export const HOTELS: string[] = [
  "Rus Olive Lodge",
  "Hargisa Resort Skardu",
  "LOKAL Rooms x Skardu (Katpana Retreat)",
  "Green Orchard Skardu",
  "Oasis Resort Katpana Skardu",
  "Avari Xpress Skardu Hotel",
  "Hotel Mashabrum Skardu",
  "Skardu Luxus Hotel",
  "The Mountain Cottage Skardu",
  "Summit Hotel Skardu",
  "Skardu Saraye Hotel & Resort",
  "Baltistan Tourist Cottage - Skardu",
  "Glamp Pakistan",
  "Montagna Pods",
  "Hotel Luxy Skardu",
  "Baltistan Fort, Skardu Resort Hotel",
  "Hotel Skardu1",
  "Baltistan Resort",
  "Skardu Royal Hotel & Restaurant",
  "Sharif Cottages and Hotel Skardu",
  "Base Camp Katpana",
  "Hotel Dewan-e-Khas",
  "Legend Hotel Skardu",
  "Northlanders Guest House Skardu",
  "Hotel Travellodge Skardu",
  "Qayam Skardu",
  "Rafsal A Countryside Cottage",
  "Kentish Lodge Skardu",
  "Skardu Villas",
  "The Cherry Courtyard",
  "Ringchan Guest House & Restaurant",
  "Skardu Lodge",
  "Karakoram Nest",
  "Dynasty Skardu",
  "Sehrish Guest House Skardu",
  "PTDC Motel Skardu",
  "Hotel Reego Skardu",
  "Lavender Cottage & Guest House",
  "Rock View Skardu",
  "Dream Guest House Haji Gam Chowk",
  "Indus Lodges Skardu",
  "Pacific Guest House Skardu",
  "Skardu View Point Hotel and Huts",
  "Khar Hotel Skardu",
  "HIKK Inn Skardu",
  "Taaj Residence Skardu",
  "Homeland Guest House Skardu",
  "Sultan Guest House Skardu",
  "The Hill Town Resort",
  "AlJannah Guest House Skardu",
  "Deosai Gateway Inn Skardu",
  "Skardu Arcadian Resort",
  "Areena Hotel Skardu",
  "Skardu Farmhouse for stay",
  "Adventure Sarai Hotel Skardu",
  "Maple Resort",
  "Candela Resorts",
  "Hispar Hotel Skardu",
  "K2 Paradise Guest House",
  "Holiday Mountain Resort & Camping Site",
  "Mountain Lodge Skardu",
  "Mulberry Continental Hotel Skardu",
  "PC Legacy Skardu",
  "GB Lodges",
  "Bilafond Cottage",
  "North Hills Skardu",
  "Pinnacle Executive Lodges",
  "Safena Hotel Skardu",
  "Byarsa Hotel Skardu",
  "Dream Nest Resort Hotels Skardu",
  "Stream view guest house skardu",
  "Shangrila Resort Skardu",
  "Kachura Inn Skardu",
  "Tibet Hotel Kachura Skardu",
  "Hotel Mountain Lagoon Skardu",
  "Skardu River Resort",
  "Morning Resort",
  "Hotel Desert Bloom Skardu",
  "TheQue Skardu",
  "Singay Homestay Skardu",
  "Baltistan Crown Resort",
  "Fatah inn Guest House",
  "Kunhar",
  "Maltoro guest house",
  "Apex Hotels and Resorts Skardu",
  "Hotel virsa",
  "Elli's Luxus",
  "Skardu Gateway Hotel & Restaurant",
  "Polo Land Hotel by Skyline",
  "Baltistan White House Hotel",
  "The Pioneer Hotel",
  "Ramovi Guest House",
  "Friends & Family Guest House",
  "SKY LAKE GUEST HOUSE",
  "Skardu bliss hotel",
  "Comfort inn hotel",
  "Grand Hotel Skardu",
  "Baltistan inn hotel",
  "Grand view hotel",
  "Hotel walnut",
  "ABC hotel",
  "Lashari Resort Skardu",
  "Melody Hills Skardu",
  "NJM House Near Skardu Airport",
  "Le Yurt Skardu",
  "FearLess lodge",
  "Wamiq Skardu Resort",
  "Hosho Guest House",
  "Orgventure Resorts Skardu",
  "Green orchard skardu",
  "Mount View hotel skardu",
  "Laal Haveli",
  "Skardu view Guest house",
  "Baltistan Mountain Chalet Hotel",
  "Hotel Five star & restaurant skardu",
  "Tufail palace hotel & restaurant",
  "Indus motel",
  "Paradise hotel",
  "Hotel Red sun",
  "Haks hotel",
  "Hotel inn skardu",
  "Skardu embassy hotel",
  "Hotel Delight Skardu",
  "Ayan Hotel",
  "Hotel Highlander inn",
  "The North face inn hotel skardu",
  "The yak Hotel skardu",
  "Indus lodge skardu",
  "Stay inn hotel",
  "Eden Rock skardu",
  "Concordia Motel Baltistan",
  "Harriot Skardu",
  "Hotel PeakNest",
  "Royal Glaxy Hotel",
  "Sarfaranga view rock Guest house skardu",
  "Eat and Read Guesthouse skardu",
  "North Face explorers",
  "Holiday resort skardu",
  "Kallisto Resort",
  "Sagar hotel skardu",
  "Hotel Elite skardu",
  "SnowLand Resort",
  "Bismillah Guest House",
  "Hotel Yak sarai",
  "The North Palace",
  "Duqsa Family Guest House",
  "Wazir's villa",
  "Hotel Rewaaj",
  "Comfort Hotel & Huts skardu",
  "Zam Zam Guest House",
  "The Mountain Gypsy Resort",
  "Rigo Resort Skardu",
  "Arish Luxury Sites",
  "InterContinental Hotel",
  "Royal fort resort skardu",
  "Meer Stay and Dine skardu",
  "Dream Land Guest House",
  "Hotel GraceLand",
  "MOUNTAIN MAJESTY INN SKARDU",
  "Alnoor Lodges",
  "Jasper House",
  "The Himalayan Guest House",
  "Epoch Inn Guest House Skardu",
  "Mountaindale Guest House",
  "Al Jannah Guest House Skardu",
  "Biafo Resort Skardu",
  "Skardu Blossom Inn",
  "The Diamond Guest House Skardu",
  "Anarres | A Creative Residency",
  "Submit Embassy Hotel",
  "Alpine Abode Skardu",
  "Relax Inn Skardu",
  "Gumaan Resort Skardu",
  "Yuligo Resort Skardu",
  "Urban escape resort",
  "Mohsin Lodge Skardu",
  "Back To Home Lodging",
  "Royal Brangsa Guest House",
  "Wazir Guest House Skardu",
  "Golden Ibex Guest House",
  "Up Way Guest House",
  "Kunlun Peak Inn skardu",
  "Markhor Hotel",
  "Tibet hotel skardu",
  "Alpha Nomads House",
  "Dirleh Hotel",
  "North Home Skardu",
  "Valhalla Guest House",
  "Creek villa skardu",
  "Prince Tourist Hut",
  "Mountain House",
  "Reechan Resort House",
  "Himalayan Guest House Hassan colony",
  "Jasmine Skardu",
  "Mountain Face Skardu",
  "Four Seasons Bed and Breakfast",
  "Flora Inn skardu",
  "Broadpeak Resort skardu",
  "Chinar Residency",
  "Buddha Rock Guest House Skardu",
  "Buddha view Resort skardu",
  "Moonal Residency",
  "Skarchan Resort skardu",
  "ZAGO Guest House",
  "Skardu Blossom Guest House",
  "Harpo Resorts",
  "Baltistan Continental Hotel skardu",
  "Al Abbas Guest House",
  "Apricot Spring Resort Skardu",
  "Executive Guest House Skardu",
  "Hotel Bloom Hills,Skardu",
  "Siachen Stay&Tours",
  "Mountain Guest House and Desi Restaurant",
  "Decent Baltistan guest house",
  "Baltistan Village Guest House",
  "Bareen",
  "SUMMIT GUEST HOUSE",
  "Serene Baltistan Hotel",
  "Alpha Hotel & Restaurant",
  "Saani Rooms",
  "Ridakh Inn",
  "Clifton Spachan Hotel",
  "K2 Tourism Guest House",
  "Heaven's Adventure.pk",
  "Desert one hotel and restaurant skardu",
  "Yazgar Residency Skardu",
  "The Next Home Skardu",
  "Heaven Hotel Skardu",
  "Skardu Midway hotel",
  "Sarfaranga Reaidency",
  "Skengoo Inn Hotel",
  "Alnoor Starlet Hotel",
  "Top Hill Resort",
  "Royal Resort Skardu",
  "Signature Skardu Hotel",
  "Shama Resort Skardu",
  "Pearl of Skardu Resort",
  "Crystal Mountain Lodge",
  "H A K S RESSORT",
  "Shaheen Guest House Skardu",
  "Nirvana Resort Skardu",
  "Himalaya Hotel Hussainabad, Skardu",
];

// ---------------------------------------------------------------------
// TABLE 1 — Restaurant -> Restaurant
// ---------------------------------------------------------------------
// The leg between two pickup stops when a cart has more than one
// restaurant in it (rider goes Office -> Restaurant A -> Restaurant B ->
// Destination -> Office). Only needs to be filled in for restaurant
// PAIRS that can actually end up in the same cart/order.
//
// Shape: RESTAURANT_TO_RESTAURANT[restaurantA][restaurantB] = { distance_km, estimated_minutes }
//
// Only enter ONE direction per pair (A->B OR B->A) — road distance
// between two points is effectively the same either way in Skardu, so
// the calculation layer checks both directions and uses whichever one
// you filled in.
// DUMMY DATA — every pair below is placeholder, not yet measured for real.
// DONE 
export const RESTAURANT_TO_RESTAURANT: Record<string, Record<string, DistanceTimeEntry>> = {
  "Yak and Bull Cafe Skardu": {
    "Baltistan Tea and Grill House": { distance_km: 1.7, estimated_minutes: 7 },
    "The Kitchen": { distance_km: 0.11, estimated_minutes: 1 },
    "Domino's Pizza Skardu": { distance_km: 1.9, estimated_minutes: 6 },
    "The Balti Table": { distance_km: 1.0, estimated_minutes: 4 },
    "Skyway Pizza Skardu": { distance_km: 0.2, estimated_minutes: 1 },
    "The Food Corridor Skardu": { distance_km: 0.85, estimated_minutes: 3 },
    "Sungum Hotel Restaurant Skardu ": { distance_km: 0.6, estimated_minutes: 3 },
    "MFC Skardu": { distance_km: 0.6, estimated_minutes: 3 },
    "Hassan Hussain Host": { distance_km: 1.0, estimated_minutes: 4 },
    "Pizza King Skardu": { distance_km: 0.5, estimated_minutes: 2 },
    "Yak Grill Skardu": { distance_km: 1.6, estimated_minutes: 5 },
  },
  "Baltistan Tea and Grill House": {
    "The Kitchen": { distance_km: 1.9, estimated_minutes: 8 },
    "Domino's Pizza Skardu": { distance_km: 1.2, estimated_minutes: 5 },
    "The Balti Table": { distance_km: 1.5, estimated_minutes: 6 },
    "Skyway Pizza Skardu": { distance_km: 2.0, estimated_minutes: 8 },
    "The Food Corridor Skardu": { distance_km: 1.4, estimated_minutes: 5 },
    "Sungum Hotel Restaurant Skardu ": { distance_km: 1.2, estimated_minutes: 5 },
    "MFC Skardu": { distance_km: 1.2, estimated_minutes: 5 },
    "Hassan Hussain Host": { distance_km: 1.5, estimated_minutes: 6 },
    "Pizza King Skardu": { distance_km: 1.3, estimated_minutes: 5 },
    "Yak Grill Skardu": { distance_km: 0.9, estimated_minutes: 4 },
  },
  "The Kitchen": {
    "Domino's Pizza Skardu": { distance_km: 2.0, estimated_minutes: 6 },
    "The Balti Table": { distance_km: 1.1, estimated_minutes: 4 },
    "Skyway Pizza Skardu": { distance_km: 0.1, estimated_minutes: 1 },
    "The Food Corridor Skardu": { distance_km: 0.95, estimated_minutes: 4 },
    "Sungum Hotel Restaurant Skardu ": { distance_km: 0.7 , estimated_minutes: 3 },
    "MFC Skardu": { distance_km: 0.7, estimated_minutes: 3 },
    "Hassan Hussain Host": { distance_km: 1.1, estimated_minutes: 4 },
    "Pizza King Skardu": { distance_km: 0.6, estimated_minutes: 2 },
    "Yak Grill Skardu": { distance_km: 2.1, estimated_minutes: 7 },
  },
  "Domino's Pizza Skardu": {
    "The Balti Table": { distance_km: 2.6, estimated_minutes: 10 },
    "Skyway Pizza Skardu": { distance_km: 2.0, estimated_minutes: 7 },
    "The Food Corridor Skardu": { distance_km: 2.5, estimated_minutes: 9 },
    "Sungum Hotel Restaurant Skardu ": { distance_km: 2.2, estimated_minutes: 8 },
    "MFC Skardu": { distance_km: 2.2, estimated_minutes: 8 },
    "Hassan Hussain Host": { distance_km: 2.6, estimated_minutes: 10 },
    "Pizza King Skardu": { distance_km: 2.1, estimated_minutes: 8 },
    "Yak Grill Skardu": { distance_km: 1.9, estimated_minutes: 8 },
  },
  "The Balti Table": {
    "Skyway Pizza Skardu": { distance_km: 1.2, estimated_minutes: 6 },
    "The Food Corridor Skardu": { distance_km: 0.15, estimated_minutes: 2 },
    "Sungum Hotel Restaurant Skardu ": { distance_km: 0.4, estimated_minutes: 3 },
    "MFC Skardu": { distance_km: 0.4, estimated_minutes: 3 },
    "Hassan Hussain Host": { distance_km: 0.1, estimated_minutes: 1 },
    "Pizza King Skardu": { distance_km: 0.55, estimated_minutes: 3 },
    "Yak Grill Skardu": { distance_km: 1.1, estimated_minutes: 3 },
  },
  "Skyway Pizza Skardu": {
    "The Food Corridor Skardu": { distance_km: 1.1, estimated_minutes: 5 },
    "Sungum Hotel Restaurant Skardu ": { distance_km: 0.8, estimated_minutes: 4},
    "MFC Skardu": { distance_km: 0.8, estimated_minutes: 4 },
    "Hassan Hussain Host": { distance_km: 1.2, estimated_minutes: 5 },
    "Pizza King Skardu": { distance_km: 0.7, estimated_minutes: 3 },
    "Yak Grill Skardu": { distance_km: 2.2, estimated_minutes: 8 },
  },
  "The Food Corridor Skardu": {
    "Sungum Hotel Restaurant Skardu ": { distance_km: 0.27, estimated_minutes: 1 },
    "MFC Skardu": { distance_km: 0.27, estimated_minutes: 1 },
    "Hassan Hussain Host": { distance_km: 0.15, estimated_minutes: 1 },
    "Pizza King Skardu": { distance_km: 0.4, estimated_minutes: 2 },
    "Yak Grill Skardu": { distance_km: 1.2, estimated_minutes: 3 },
  },
  "Sungum Hotel Restaurant Skardu ": {
    "MFC Skardu": { distance_km: 0.1, estimated_minutes: 1 },
    "Hassan Hussain Host": { distance_km: 0.4, estimated_minutes: 2 },
    "Pizza King Skardu": { distance_km: 0.11, estimated_minutes: 1 },
    "Yak Grill Skardu": { distance_km: 1.5, estimated_minutes: 4 },
  },
  "MFC Skardu": {
    "Hassan Hussain Host": { distance_km: 0.4, estimated_minutes: 2 },
    "Pizza King Skardu": { distance_km: 0.11, estimated_minutes: 1 },
    "Yak Grill Skardu": { distance_km: 1.5, estimated_minutes: 4 },
  },
  "Hassan Hussain Host": {
    "Pizza King Skardu": { distance_km: 0.55, estimated_minutes: 3 },
    "Yak Grill Skardu": { distance_km: 1.1, estimated_minutes: 3 },
  },
  "Pizza King Skardu": {
    "Yak Grill Skardu": { distance_km: 1.6, estimated_minutes: 5},
  },
};

// ---------------------------------------------------------------------
// TABLE 2 — Restaurant -> Area
// ---------------------------------------------------------------------
// Covers BOTH area and hotel destinations (a hotel is just a customer
// destination too) — which type a given name is gets resolved via
// Table 4 (AREA_TO_OFFICE) below, so it isn't duplicated here.
//
// Shape: RESTAURANT_TO_AREA[restaurantName][destinationName] = { distance_km, estimated_minutes }
// DUMMY DATA — every cell below is placeholder, not yet measured for real.

export const RESTAURANT_TO_AREA: Record<string, Record<string, DistanceTimeEntry>> = {
  "Yak and Bull Cafe Skardu": {
    "Sundus Skilgrong": { distance_km: 3.8, estimated_minutes: 11 },
    "Sundus Gond": { distance_km: 4.7, estimated_minutes: 14 },
    
    "Katpana": { distance_km: 6.7, estimated_minutes: 19 },
    "Khargrong": { distance_km: 1.5, estimated_minutes: 6 },
    "Hasnain Nagar": { distance_km: 0.6, estimated_minutes: 3 },
    "Alamdar Chowk": { distance_km: 0.35, estimated_minutes: 2 },
    "Hassan Colony": { distance_km: 0.85, estimated_minutes: 3 },
    "Hassan Colony Pine": { distance_km: 0.95, estimated_minutes: 3 },
    "Shinkhani Gond": { distance_km: 0.75, estimated_minutes: 3 },
    "Oldiing Nansoq": { distance_km: 2.9, estimated_minutes: 9 },
    "RHQ Road Harriot Hotel": { distance_km: 2.5, estimated_minutes: 9 },
    "Newranga Near Agha Ali House": { distance_km: 1.3, estimated_minutes: 5 },
    "Newranga ": { distance_km: 3.0, estimated_minutes: 8 },
    "Kushmarah": { distance_km: 2.4, estimated_minutes: 6 },
    "Sherthang Girls High School": { distance_km: 2.2, estimated_minutes: 8 },
    "Marfie Colony": { distance_km: 2.0, estimated_minutes: 7 },
    "Chumik": { distance_km: 2.0, estimated_minutes: 8 },
    "Gamba Skardu": { distance_km: 12, estimated_minutes: 22 },
    "United Line, Hassan Colony": { distance_km: 0.75, estimated_minutes: 3 },
    "Muhib Road Khargrong": { distance_km: 1.6, estimated_minutes: 6 },
    "GB Chief Court Skardu Registry Skardu": { distance_km: 3.0, estimated_minutes: 9 },
    "Shaheen Public School Skardu": { distance_km: 1.8, estimated_minutes: 7 },
    "Mehdi Colony Skardu": { distance_km: 1.2, estimated_minutes: 4 },
    "Agha Hadi Chowk": { distance_km: 1.3, estimated_minutes: 4 },
    "Hussainabad": { distance_km: 6.9, estimated_minutes: 18 },
    "Himalaya Hotel Hussainabad, Skardu": { distance_km: 6.9, estimated_minutes: 18 },
    "Hameed Garh": { distance_km: 2.2, estimated_minutes: 7 },
    "Shaheed colony": { distance_km: 3.8, estimated_minutes: 11 },
    "Tufail colony": { distance_km: 3.1, estimated_minutes: 10 },
    "Jafferi Mohallah": { distance_km: 2.4, estimated_minutes: 8 },
    "Chogo Matamsara": { distance_km: 2.2, estimated_minutes: 9 },
    "Nagulispang Road": { distance_km: 0.75, estimated_minutes: 2 },
    "Eidgah,Sundus ": { distance_km: 3.2, estimated_minutes: 9 },
    "Sukemaidan ": { distance_km: 1.1, estimated_minutes: 3 },
    "Hargissa shakthang": { distance_km: 1.3, estimated_minutes: 4 },
    "Bhutto Bazar Skardu": { distance_km: 1.2, estimated_minutes: 3 },
    "Devision": { distance_km: 1.6, estimated_minutes: 5 },
    "Abbas Town": { distance_km: 2.0, estimated_minutes: 6 },
    "Musa Line": { distance_km: 0.75, estimated_minutes: 2 },
    "Clifton pull": { distance_km: 0.45, estimated_minutes: 1 },
    "Sheikh ijaz masjid": { distance_km: 1.1, estimated_minutes: 3 },
    "Khila Toq Road": { distance_km: 2.1, estimated_minutes: 6 },
    "Public school area": { distance_km: 2.8, estimated_minutes: 9 },
    "Xhathang": { distance_km: 3.0, estimated_minutes: 10 },
    "Brolmo colony sundus": { distance_km: 3.9, estimated_minutes: 11 },
    "Ghazi Colony sundus": { distance_km: 4.3, estimated_minutes: 12 },
    "Hyderabad Gangupi Area": { distance_km: 0.85, estimated_minutes: 3 },
    "LT Col ihsan Ali rd": { distance_km: 0.9, estimated_minutes: 3 },
    "Astana skardu": { distance_km: 3.0, estimated_minutes: 7 },
    "Bintul Huda Girls model school": { distance_km: 4.1, estimated_minutes: 10 },
    "Brolmo colony astana": { distance_km: 3.3, estimated_minutes: 8 },
    "Raees mohalla Haji Gam": { distance_km: 2.2, estimated_minutes: 8 },
    "Haji Gam": { distance_km: 1.4, estimated_minutes: 4 },
    "Gulshan e Ali skardu": { distance_km: 2.6, estimated_minutes: 8 },
    "Jamia masjid road": { distance_km: 1.4, estimated_minutes: 5 },
    "Gayool skardu": { distance_km: 5.0, estimated_minutes: 10 },
    "Toqrangah Skardu": { distance_km: 3.3, estimated_minutes: 8 },
    "Maqponsar skardu": { distance_km: 3.1, estimated_minutes: 7 },
    "Newranga road": { distance_km: 2.5, estimated_minutes: 8 },
    "Quaidabad": { distance_km: 1.4, estimated_minutes: 4 },
    "Kharpocho Road": { distance_km: 2.0, estimated_minutes: 8 },
    "Patwal": { distance_km: 1.9, estimated_minutes: 5 },
    "Olding": { distance_km: 2.8, estimated_minutes: 8 },
    "Karasmathang": { distance_km: 1.8, estimated_minutes: 5 },
    "Kachura": { distance_km: 27, estimated_minutes: 50 },
    "3 talwar chowk chowk": { distance_km: 3.0, estimated_minutes: 7 },
    "Teen talwar chowk chowk": { distance_km: 3.0, estimated_minutes: 7 },
    "Sahara Complex": { distance_km: 2.9, estimated_minutes: 7 },
    "Ali plaza": { distance_km: 1.5, estimated_minutes: 4 },
    "Radio Pakistan Chowk": { distance_km: 2.1, estimated_minutes: 5 },
    "Manthal": { distance_km: 4.6, estimated_minutes: 13 },


    
   "Rus Olive Lodge": {
      distance_km: 5.6,
      estimated_minutes: 19
    },
    "Hargisa Resort Skardu": {
      distance_km: 8.3,
      estimated_minutes: 32
    },
    "LOKAL Rooms x Skardu (Katpana Retreat)": {
      distance_km: 5.3,
      estimated_minutes: 20
    },
    "Green Orchard Skardu": {
      distance_km: 6.3,
      estimated_minutes: 23
    },
    "Oasis Resort Katpana Skardu": {
      distance_km: 2.3,
      estimated_minutes: 10
    },
    "Avari Xpress Skardu Hotel": {
      distance_km: 4.1,
      estimated_minutes: 29
    },
    "Hotel Mashabrum Skardu": {
      distance_km: 3.2,
      estimated_minutes: 13
    },
    "Skardu Luxus Hotel": {
      distance_km: 6.5,
      estimated_minutes: 24
    },
    "The Mountain Cottage Skardu": {
      distance_km: 4.6,
      estimated_minutes: 18
    },
    "Summit Hotel Skardu": {
      distance_km: 6.2,
      estimated_minutes: 23
    },
    "Skardu Saraye Hotel & Resort": {
      distance_km: 9.1,
      estimated_minutes: 34
    },
    "Baltistan Tourist Cottage - Skardu": {
      distance_km: 2.4,
      estimated_minutes: 10
    },
    "Glamp Pakistan": {
      distance_km: 6.5,
      estimated_minutes: 25
    },
    "Montagna Pods": {
      distance_km: 6.2,
      estimated_minutes: 21
    },
    "Hotel Luxy Skardu": {
      distance_km: 5.9,
      estimated_minutes: 23
    },
    "Baltistan Fort, Skardu Resort Hotel": {
      distance_km: 9.4,
      estimated_minutes: 36
    },
    "Hotel Skardu1": {
      distance_km: 7.6,
      estimated_minutes: 28
    },
    "Baltistan Resort": {
      distance_km: 2.2,
      estimated_minutes: 9
    },
    "Skardu Royal Hotel & Restaurant": {
      distance_km: 5.0,
      estimated_minutes: 18
    },
    "Sharif Cottages and Hotel Skardu": {
      distance_km: 6.1,
      estimated_minutes: 22
    },
    "Base Camp Katpana": {
      distance_km: 7.7,
      estimated_minutes: 28
    },
    "Hotel Dewan-e-Khas": {
      distance_km: 4.8,
      estimated_minutes: 18
    },
    "Legend Hotel Skardu": {
      distance_km: 5.3,
      estimated_minutes: 21
    },
    "Northlanders Guest House Skardu": {
      distance_km: 7.1,
      estimated_minutes: 28
    },
    "Hotel Travellodge Skardu": {
      distance_km: 3.6,
      estimated_minutes: 12
    },
    "Qayam Skardu": {
      distance_km: 6.4,
      estimated_minutes: 25
    },
    "Rafsal A Countryside Cottage": {
      distance_km: 3.3,
      estimated_minutes: 11
    },
    "Kentish Lodge Skardu": {
      distance_km: 0.9,
      estimated_minutes: 3
    },
    "Skardu Villas": {
      distance_km: 8.2,
      estimated_minutes: 31
    },
    "The Cherry Courtyard": {
      distance_km: 1.1,
      estimated_minutes: 3
    },
    "Ringchan Guest House & Restaurant": {
      distance_km: 0.7,
      estimated_minutes: 5
    },
    "Skardu Lodge": {
      distance_km: 6.0,
      estimated_minutes: 21
    },
    "Karakoram Nest": {
      distance_km: 7.9,
      estimated_minutes: 30
    },
    "Dynasty Skardu": {
      distance_km: 1.6,
      estimated_minutes: 6
    },
    "Sehrish Guest House Skardu": {
      distance_km: 7.1,
      estimated_minutes: 27
    },
    "PTDC Motel Skardu": {
      distance_km: 9.0,
      estimated_minutes: 32
    },
    "Hotel Reego Skardu": {
      distance_km: 8.7,
      estimated_minutes: 33
    },
    "Lavender Cottage & Guest House": {
      distance_km: 7.7,
      estimated_minutes: 29
    },
    "Rock View Skardu": {
      distance_km: 4.1,
      estimated_minutes: 14
    },
    "Dream Guest House Haji Gam Chowk": {
      distance_km: 6.7,
      estimated_minutes: 23
    },
    "Indus Lodges Skardu": {
      distance_km: 4.7,
      estimated_minutes: 16
    },
    "Pacific Guest House Skardu": {
      distance_km: 5.8,
      estimated_minutes: 23
    },
    "Skardu View Point Hotel and Huts": {
      distance_km: 1.4,
      estimated_minutes: 7
    },
    "Khar Hotel Skardu": {
      distance_km: 1.1,
      estimated_minutes: 4
    },
    "HIKK Inn Skardu": {
      distance_km: 5.3,
      estimated_minutes: 21
    },
    "Taaj Residence Skardu": {
      distance_km: 7.5,
      estimated_minutes: 29
    },
    "Homeland Guest House Skardu": {
      distance_km: 2.1,
      estimated_minutes: 7
    },
    "Sultan Guest House Skardu": {
      distance_km: 5.9,
      estimated_minutes: 20
    },
    "The Hill Town Resort": {
      distance_km: 5.3,
      estimated_minutes: 19
    },
    "AlJannah Guest House Skardu": {
      distance_km: 5.5,
      estimated_minutes: 19
    },
    "Deosai Gateway Inn Skardu": {
      distance_km: 3.9,
      estimated_minutes: 15
    },
    "Skardu Arcadian Resort": {
      distance_km: 2.6,
      estimated_minutes: 11
    },
    "Areena Hotel Skardu": {
      distance_km: 1.5,
      estimated_minutes: 6
    },
    "Skardu Farmhouse for stay": {
      distance_km: 5.4,
      estimated_minutes: 21
    },
    "Adventure Sarai Hotel Skardu": {
      distance_km: 8.3,
      estimated_minutes: 30
    },
    "Maple Resort": {
      distance_km: 5.8,
      estimated_minutes: 23
    },
    "Candela Resorts": {
      distance_km: 0.4,
      estimated_minutes: 2
    },
    "Hispar Hotel Skardu": {
      distance_km: 8.5,
      estimated_minutes: 31
    },
    "K2 Paradise Guest House": {
      distance_km: 5.5,
      estimated_minutes: 22
    },
    "Holiday Mountain Resort & Camping Site": {
      distance_km: 7.4,
      estimated_minutes: 27
    },
    "Mountain Lodge Skardu": {
      distance_km: 7.8,
      estimated_minutes: 29
    },
    "Mulberry Continental Hotel Skardu": {
      distance_km: 4.8,
      estimated_minutes: 18
    },
    "PC Legacy Skardu": {
      distance_km: 6.2,
      estimated_minutes: 21
    },
    "GB Lodges": {
      distance_km: 5.3,
      estimated_minutes: 18
    },
    "Bilafond Cottage": {
      distance_km: 8.6,
      estimated_minutes: 32
    },
    "North Hills Skardu": {
      distance_km: 6.9,
      estimated_minutes: 25
    },
    "Pinnacle Executive Lodges": {
      distance_km: 7.2,
      estimated_minutes: 26
    },
    "Safena Hotel Skardu": {
      distance_km: 4.7,
      estimated_minutes: 16
    },
    "Byarsa Hotel Skardu": {
      distance_km: 6.4,
      estimated_minutes: 23
    },
    "Dream Nest Resort Hotels Skardu": {
      distance_km: 8.5,
      estimated_minutes: 33
    },
    "Stream view guest house skardu": {
      distance_km: 7.9,
      estimated_minutes: 27
    },
    "Shangrila Resort Skardu": {
      distance_km: 5.1,
      estimated_minutes: 18
    },
    "Kachura Inn Skardu": {
      distance_km: 6.8,
      estimated_minutes: 26
    },
    "Tibet Hotel Kachura Skardu": {
      distance_km: 2.4,
      estimated_minutes: 9
    },
    "Hotel Mountain Lagoon Skardu": {
      distance_km: 6.1,
      estimated_minutes: 22
    },
    "Skardu River Resort": {
      distance_km: 3.2,
      estimated_minutes: 13
    },
    "Morning Resort": {
      distance_km: 6.4,
      estimated_minutes: 23
    },
    "Hotel Desert Bloom Skardu": {
      distance_km: 8.8,
      estimated_minutes: 31
    },
    "TheQue Skardu": {
      distance_km: 0.7,
      estimated_minutes: 4
    },
    "Singay Homestay Skardu": {
      distance_km: 3.8,
      estimated_minutes: 16
    },
    "Baltistan Crown Resort": {
      distance_km: 8.9,
      estimated_minutes: 33
    },
    "Fatah inn Guest House": {
      distance_km: 4.6,
      estimated_minutes: 17
    },
    "Kunhar": {
      distance_km: 7.3,
      estimated_minutes: 27
    },
    "Maltoro guest house": {
      distance_km: 9.0,
      estimated_minutes: 33
    },
    "Apex Hotels and Resorts Skardu": {
      distance_km: 8.1,
      estimated_minutes: 30
    },
    "Hotel virsa": {
      distance_km: 3.4,
      estimated_minutes: 12
    },
    "Elli's Luxus": {
      distance_km: 0.5,
      estimated_minutes: 4
    },
    "Skardu Gateway Hotel & Restaurant": {
      distance_km: 4.9,
      estimated_minutes: 18
    },
    "Polo Land Hotel by Skyline": {
      distance_km: 6.3,
      estimated_minutes: 24
    },
    "Baltistan White House Hotel": {
      distance_km: 7.0,
      estimated_minutes: 26
    },
    "The Pioneer Hotel": {
      distance_km: 6.7,
      estimated_minutes: 24
    },
    "Ramovi Guest House": {
      distance_km: 5.3,
      estimated_minutes: 21
    },
    "Friends & Family Guest House": {
      distance_km: 6.0,
      estimated_minutes: 24
    },
    "SKY LAKE GUEST HOUSE": {
      distance_km: 8.0,
      estimated_minutes: 30
    },
    "Skardu bliss hotel": {
      distance_km: 7.3,
      estimated_minutes: 27
    },
    "Comfort inn hotel": {
      distance_km: 7.2,
      estimated_minutes: 26
    },
    "Grand Hotel Skardu": {
      distance_km: 5.5,
      estimated_minutes: 21
    },
    "Baltistan inn hotel": {
      distance_km: 3.4,
      estimated_minutes: 14
    },
    "Grand view hotel": {
      distance_km: 2.0,
      estimated_minutes: 6
    },
    "Hotel walnut": {
      distance_km: 4.9,
      estimated_minutes: 20
    },
    "ABC hotel": {
      distance_km: 1.1,
      estimated_minutes: 6
    },
    "Lashari Resort Skardu": {
      distance_km: 5.9,
      estimated_minutes: 22
    },
    "Melody Hills Skardu": {
      distance_km: 5.4,
      estimated_minutes: 21
    },
    "NJM House Near Skardu Airport": {
      distance_km: 4.9,
      estimated_minutes: 17
    },
    "Le Yurt Skardu": {
      distance_km: 5.6,
      estimated_minutes: 20
    },
    "FearLess lodge": {
      distance_km: 6.0,
      estimated_minutes: 21
    },
    "Wamiq Skardu Resort": {
      distance_km: 2.6,
      estimated_minutes: 9
    },
    "Hosho Guest House": {
      distance_km: 2.1,
      estimated_minutes: 9
    },
    "Orgventure Resorts Skardu": {
      distance_km: 7.3,
      estimated_minutes: 25
    },
    "Green orchard skardu": {
      distance_km: 8.5,
      estimated_minutes: 31
    },
    "Mount View hotel skardu": {
      distance_km: 8.0,
      estimated_minutes: 28
    },
    "Laal Haveli": {
      distance_km: 9.3,
      estimated_minutes: 35
    },
    "Skardu view Guest house": {
      distance_km: 0.8,
      estimated_minutes: 5
    },
    "Baltistan Mountain Chalet Hotel": {
      distance_km: 2.7,
      estimated_minutes: 9
    },
    "Hotel Five star & restaurant skardu": {
      distance_km: 0.9,
      estimated_minutes: 5
    },
    "Tufail palace hotel & restaurant": {
      distance_km: 8.2,
      estimated_minutes: 32
    },
    "Indus motel": {
      distance_km: 9.4,
      estimated_minutes: 33
    },
    "Paradise hotel": {
      distance_km: 8.4,
      estimated_minutes: 31
    },
    "Hotel Red sun": {
      distance_km: 6.5,
      estimated_minutes: 25
    },
    "Haks hotel": {
      distance_km: 9.0,
      estimated_minutes: 31
    },
    "Hotel inn skardu": {
      distance_km: 7.9,
      estimated_minutes: 29
    },
    "Skardu embassy hotel": {
      distance_km: 6.7,
      estimated_minutes: 24
    },
    "Hotel Delight Skardu": {
      distance_km: 5.1,
      estimated_minutes: 17
    },
    "Ayan Hotel": {
      distance_km: 5.9,
      estimated_minutes: 20
    },
    "Hotel Highlander inn": {
      distance_km: 3.4,
      estimated_minutes: 11
    },
    "The North face inn hotel skardu": {
      distance_km: 0.9,
      estimated_minutes: 5
    },
    "The yak Hotel skardu": {
      distance_km: 1.9,
      estimated_minutes: 7
    },
    "Indus lodge skardu": {
      distance_km: 9.5,
      estimated_minutes: 36
    },
    "Stay inn hotel": {
      distance_km: 3.4,
      estimated_minutes: 12
    },
    "Eden Rock skardu": {
      distance_km: 7.4,
      estimated_minutes: 29
    },
    "Concordia Motel Baltistan": {
      distance_km: 3.6,
      estimated_minutes: 13
    },
    "Harriot Skardu": {
      distance_km: 1.4,
      estimated_minutes: 5
    },
    "Hotel PeakNest": {
      distance_km: 8.6,
      estimated_minutes: 30
    },
    "Royal Glaxy Hotel": {
      distance_km: 8.0,
      estimated_minutes: 30
    },
    "Sarfaranga view rock Guest house skardu": {
      distance_km: 3.5,
      estimated_minutes: 12
    },
    "Eat and Read Guesthouse skardu": {
      distance_km: 6.2,
      estimated_minutes: 21
    },
    "North Face explorers": {
      distance_km: 6.4,
      estimated_minutes: 25
    },
    "Holiday resort skardu": {
      distance_km: 3.5,
      estimated_minutes: 14
    },
    "Kallisto Resort": {
      distance_km: 0.7,
      estimated_minutes: 2
    },
    "Sagar hotel skardu": {
      distance_km: 2.7,
      estimated_minutes: 12
    },
    "Hotel Elite skardu": {
      distance_km: 5.7,
      estimated_minutes: 23
    },
    "SnowLand Resort": {
      distance_km: 5.9,
      estimated_minutes: 20
    },
    "Bismillah Guest House": {
      distance_km: 3.9,
      estimated_minutes: 16
    },
    "Hotel Yak sarai": {
      distance_km: 0.8,
      estimated_minutes: 4
    },
    "The North Palace": {
      distance_km: 6.6,
      estimated_minutes: 23
    },
    "Duqsa Family Guest House": {
      distance_km: 3.6,
      estimated_minutes: 13
    },
    "Wazir's villa": {
      distance_km: 5.1,
      estimated_minutes: 20
    },
    "Hotel Rewaaj": {
      distance_km: 8.5,
      estimated_minutes: 32
    },
    "Comfort Hotel & Huts skardu": {
      distance_km: 1.7,
      estimated_minutes: 6
    },
    "Zam Zam Guest House": {
      distance_km: 8.1,
      estimated_minutes: 28
    },
    "The Mountain Gypsy Resort": {
      distance_km: 1.9,
      estimated_minutes: 9
    },
    "Rigo Resort Skardu": {
      distance_km: 5.8,
      estimated_minutes: 20
    },
    "Arish Luxury Sites": {
      distance_km: 9.5,
      estimated_minutes: 35
    },
    "InterContinental Hotel": {
      distance_km: 4.6,
      estimated_minutes: 17
    },
    "Royal fort resort skardu": {
      distance_km: 5.1,
      estimated_minutes: 18
    },
    "Meer Stay and Dine skardu": {
      distance_km: 8.6,
      estimated_minutes: 33
    },
    "Dream Land Guest House": {
      distance_km: 9.5,
      estimated_minutes: 36
    },
    "Hotel GraceLand": {
      distance_km: 6.5,
      estimated_minutes: 25
    },
    "MOUNTAIN MAJESTY INN SKARDU": {
      distance_km: 4.8,
      estimated_minutes: 17
    },
    "Alnoor Lodges": {
      distance_km: 7.4,
      estimated_minutes: 26
    },
    "Jasper House": {
      distance_km: 5.1,
      estimated_minutes: 17
    },
    "The Himalayan Guest House": {
      distance_km: 4.5,
      estimated_minutes: 18
    },
    "Epoch Inn Guest House Skardu": {
      distance_km: 4.3,
      estimated_minutes: 15
    },
    "Mountaindale Guest House": {
      distance_km: 4.7,
      estimated_minutes: 16
    },
    "Al Jannah Guest House Skardu": {
      distance_km: 6.7,
      estimated_minutes: 23
    },
    "Biafo Resort Skardu": {
      distance_km: 4.9,
      estimated_minutes: 17
    },
    "Skardu Blossom Inn": {
      distance_km: 2.8,
      estimated_minutes: 12
    },
    "The Diamond Guest House Skardu": {
      distance_km: 5.6,
      estimated_minutes: 21
    },
    "Anarres | A Creative Residency": {
      distance_km: 5.5,
      estimated_minutes: 21
    },
    "Submit Embassy Hotel": {
      distance_km: 5.6,
      estimated_minutes: 20
    },
    "Alpine Abode Skardu": {
      distance_km: 7.2,
      estimated_minutes: 26
    },
    "Relax Inn Skardu": {
      distance_km: 3.5,
      estimated_minutes: 13
    },
    "Gumaan Resort Skardu": {
      distance_km: 5.5,
      estimated_minutes: 20
    },
    "Yuligo Resort Skardu": {
      distance_km: 6.6,
      estimated_minutes: 23
    },
    "Urban escape resort": {
      distance_km: 5.2,
      estimated_minutes: 18
    },
    "Mohsin Lodge Skardu": {
      distance_km: 9.3,
      estimated_minutes: 32
    },
    "Back To Home Lodging": {
      distance_km: 2.8,
      estimated_minutes: 9
    },
    "Royal Brangsa Guest House": {
      distance_km: 2.4,
      estimated_minutes: 8
    },
    "Wazir Guest House Skardu": {
      distance_km: 7.0,
      estimated_minutes: 27
    },
    "Golden Ibex Guest House": {
      distance_km: 1.6,
      estimated_minutes: 7
    },
    "Up Way Guest House": {
      distance_km: 2.8,
      estimated_minutes: 11
    },
    "Kunlun Peak Inn skardu": {
      distance_km: 6.5,
      estimated_minutes: 24
    },
    "Markhor Hotel": {
      distance_km: 5.4,
      estimated_minutes: 18
    },
    "Tibet hotel skardu": {
      distance_km: 9.3,
      estimated_minutes: 35
    },
    "Alpha Nomads House": {
      distance_km: 2.0,
      estimated_minutes: 9
    },
    "Dirleh Hotel": {
      distance_km: 7.8,
      estimated_minutes: 27
    },
    "North Home Skardu": {
      distance_km: 8.7,
      estimated_minutes: 31
    },
    "Valhalla Guest House": {
      distance_km: 8.4,
      estimated_minutes: 32
    },
    "Creek villa skardu": {
      distance_km: 5.4,
      estimated_minutes: 21
    },
    "Prince Tourist Hut": {
      distance_km: 6.3,
      estimated_minutes: 24
    },
    "Mountain House": {
      distance_km: 8.5,
      estimated_minutes: 30
    },
    "Reechan Resort House": {
      distance_km: 2.0,
      estimated_minutes: 9
    },
    "Himalayan Guest House Hassan colony": {
      distance_km: 5.4,
      estimated_minutes: 21
    },
    "Jasmine Skardu": {
      distance_km: 3.2,
      estimated_minutes: 12
    },
    "Mountain Face Skardu": {
      distance_km: 9.1,
      estimated_minutes: 35
    },
    "Four Seasons Bed and Breakfast": {
      distance_km: 8.9,
      estimated_minutes: 34
    },
    "Flora Inn skardu": {
      distance_km: 9.3,
      estimated_minutes: 35
    },
    "Broadpeak Resort skardu": {
      distance_km: 5.6,
      estimated_minutes: 20
    },
    "Chinar Residency": {
      distance_km: 8.6,
      estimated_minutes: 32
    },
    "Buddha Rock Guest House Skardu": {
      distance_km: 5.4,
      estimated_minutes: 19
    },
    "Buddha view Resort skardu": {
      distance_km: 2.8,
      estimated_minutes: 11
    },
    "Moonal Residency": {
      distance_km: 7.6,
      estimated_minutes: 29
    },
    "Skarchan Resort skardu": {
      distance_km: 5.1,
      estimated_minutes: 17
    },
    "ZAGO Guest House": {
      distance_km: 1.1,
      estimated_minutes: 6
    },
    "Skardu Blossom Guest House": {
      distance_km: 3.0,
      estimated_minutes: 11
    },
    "Harpo Resorts": {
      distance_km: 5.3,
      estimated_minutes: 21
    },
    "Baltistan Continental Hotel skardu": {
      distance_km: 8.4,
      estimated_minutes: 30
    },
    "Al Abbas Guest House": {
      distance_km: 5.4,
      estimated_minutes: 19
    },
    "Apricot Spring Resort Skardu": {
      distance_km: 6.7,
      estimated_minutes: 24
    },
    "Executive Guest House Skardu": {
      distance_km: 4.1,
      estimated_minutes: 15
    },
    "Hotel Bloom Hills,Skardu": {
      distance_km: 5.6,
      estimated_minutes: 20
    },
    "Siachen Stay&Tours": {
      distance_km: 5.8,
      estimated_minutes: 22
    },
    "Mountain Guest House and Desi Restaurant": {
      distance_km: 4.4,
      estimated_minutes: 18
    },
    "Decent Baltistan guest house": {
      distance_km: 2.0,
      estimated_minutes: 9
    },
    "Baltistan Village Guest House": {
      distance_km: 3.9,
      estimated_minutes: 15
    },
    "Bareen": {
      distance_km: 5.4,
      estimated_minutes: 19
    },
    "SUMMIT GUEST HOUSE": {
      distance_km: 7.3,
      estimated_minutes: 28
    },
    "Serene Baltistan Hotel": {
      distance_km: 0.8,
      estimated_minutes: 2
    },
    "Alpha Hotel & Restaurant": {
      distance_km: 2.4,
      estimated_minutes: 9
    },
    "Saani Rooms": {
      distance_km: 9.2,
      estimated_minutes: 35
    },
    "Ridakh Inn": {
      distance_km: 1.7,
      estimated_minutes: 7
    },
    "Clifton Spachan Hotel": {
      distance_km: 7.1,
      estimated_minutes: 27
    },
    "K2 Tourism Guest House": {
      distance_km: 2.3,
      estimated_minutes: 8
    },
    "Heaven's Adventure.pk": {
      distance_km: 6.2,
      estimated_minutes: 24
    },
    "Desert one hotel and restaurant skardu": {
      distance_km: 6.8,
      estimated_minutes: 24
    },
    "Yazgar Residency Skardu": {
      distance_km: 3.1,
      estimated_minutes: 12
    },
    "The Next Home Skardu": {
      distance_km: 6.2,
      estimated_minutes: 21
    },
    "Heaven Hotel Skardu": {
      distance_km: 6.0,
      estimated_minutes: 22
    },
    "Skardu Midway hotel": {
      distance_km: 2.2,
      estimated_minutes: 10
    },
    "Sarfaranga Reaidency": {
      distance_km: 6.2,
      estimated_minutes: 21
    },
    "Skengoo Inn Hotel": {
      distance_km: 4.4,
      estimated_minutes: 17
    },
    "Alnoor Starlet Hotel": {
      distance_km: 3.6,
      estimated_minutes: 13
    },
    "Top Hill Resort": {
      distance_km: 0.5,
      estimated_minutes: 2
    },
    "Royal Resort Skardu": {
      distance_km: 1.7,
      estimated_minutes: 6
    },
    "Signature Skardu Hotel": {
      distance_km: 3.3,
      estimated_minutes: 14
    },
    "Shama Resort Skardu": {
      distance_km: 5.3,
      estimated_minutes: 19
    },
    "Pearl of Skardu Resort": {
      distance_km: 8.1,
      estimated_minutes: 28
    },
    "Crystal Mountain Lodge": {
      distance_km: 4.3,
      estimated_minutes: 15
    },
    "H A K S RESSORT": {
      distance_km: 3.0,
      estimated_minutes: 13
    },
    "Shaheen Guest House Skardu": {
      distance_km: 3.0,
      estimated_minutes: 11
    },
    "Nirvana Resort Skardu": {
      distance_km: 9.3,
      estimated_minutes: 34
    },

  },
   "Baltistan Tea and Grill House": {
    "Sundus Skilgrong": { distance_km: 3.3, estimated_minutes: 12 },
    "Sundus Gond": { distance_km: 4.0, estimated_minutes: 13 },
   
    "Katpana": { distance_km: 6, estimated_minutes: 19 },
    "Khargrong": { distance_km: 1.9, estimated_minutes: 6 },
    "Hasnain Nagar": { distance_km: 1.7, estimated_minutes: 7 },
    "Alamdar Chowk": { distance_km: 1.4, estimated_minutes: 6 },
    "Hassan Colony": { distance_km: 2.6, estimated_minutes: 10 },
    "Hassan Colony Pine": { distance_km: 2.6, estimated_minutes: 11 },
    "Shinkhani Gond": { distance_km: 2.2, estimated_minutes: 9 },
    "Oldiing Nansoq": { distance_km: 3.7, estimated_minutes: 12 },
    "RHQ Road Harriot Hotel": { distance_km: 2.1, estimated_minutes: 7 },
    "Newranga Near Agha Ali House": { distance_km: 3.0, estimated_minutes: 12 },
    "Newranga ": { distance_km: 4.0, estimated_minutes: 13 },
    "Kushmarah": { distance_km: 4.2, estimated_minutes: 14 },
    "Sherthang Girls High School": { distance_km: 3.4, estimated_minutes: 13 },
    "Marfie Colony": { distance_km: 3.2, estimated_minutes: 10 },
    "Chumik": { distance_km: 0.85, estimated_minutes: 4 },
    "Gamba Skardu": { distance_km: 12, estimated_minutes: 25 },
    "United Line, Hassan Colony": { distance_km: 2.6, estimated_minutes: 10 },
    "Muhib Road Khargrong": { distance_km: 1.3, estimated_minutes: 5 },
    "GB Chief Court Skardu Registry Skardu": { distance_km: 5.1, estimated_minutes: 15 },
    "Shaheen Public School Skardu": { distance_km: 3.6, estimated_minutes: 15 },
    "Mehdi Colony Skardu": { distance_km: 3.7, estimated_minutes: 16 },
    "Agha Hadi Chowk": { distance_km: 1.7, estimated_minutes: 6 },
    "Hussainabad": { distance_km: 7, estimated_minutes: 18 },
    "Himalaya Hotel Hussainabad, Skardu": { distance_km: 7, estimated_minutes: 18 },
    "Hameed Garh": { distance_km: 1.7, estimated_minutes: 6 },
    "Shaheed colony": { distance_km: 2.6, estimated_minutes: 10 },
    "Tufail colony": { distance_km: 1.9, estimated_minutes: 8 },
    "Jafferi Mohallah": { distance_km: 1, estimated_minutes: 5 },
    "Chogo Matamsara": { distance_km: 0.7, estimated_minutes: 4 },
    "Nagulispang Road": { distance_km: 1.5, estimated_minutes: 7 },
    "Eidgah,Sundus ": { distance_km: 1.6, estimated_minutes: 8 },
    "Sukemaidan ": { distance_km: 0.8, estimated_minutes: 4 },
    "Hargissa shakthang": { distance_km: 2.6, estimated_minutes: 11 },
    "Bhutto Bazar Skardu": { distance_km: 0.75, estimated_minutes: 5 },
    "Devision": { distance_km: 3.8, estimated_minutes: 12 },
    "Abbas Town": { distance_km: 3.1, estimated_minutes: 10 },
    "Musa Line": { distance_km: 2.5, estimated_minutes: 9 },
    "Clifton pull": { distance_km: 2.2, estimated_minutes: 10 },
    "Sheikh ijaz masjid": { distance_km: 1.5, estimated_minutes: 7 },
    "Khila Toq Road": { distance_km: 2.4, estimated_minutes: 8 },
    "Public school area": { distance_km: 4.3, estimated_minutes: 13 },
    "Xhathang": { distance_km: 4.4, estimated_minutes: 13 },
    "Brolmo colony sundus": { distance_km: 2.2, estimated_minutes: 12 },
    "Ghazi Colony sundus": { distance_km: 3.6, estimated_minutes: 13 },
    "Hyderabad Gangupi Area": { distance_km: 0.9, estimated_minutes: 4 },
    "LT Col ihsan Ali rd": { distance_km: 1.6, estimated_minutes: 7 },
    "Astana skardu": { distance_km: 5.1, estimated_minutes: 14 },
    "Bintul Huda Girls model school": { distance_km: 5.8, estimated_minutes: 17 },
    "Brolmo colony astana": { distance_km: 4.8, estimated_minutes: 14 },
    "Raees mohalla Haji Gam": { distance_km: 3.3, estimated_minutes: 13 },
    "Haji Gam": { distance_km: 2.4, estimated_minutes: 9 },
    "Gulshan e Ali skardu": { distance_km: 2.1, estimated_minutes: 7 },
    "Jamia masjid road": { distance_km: 0.45, estimated_minutes: 2 },
    "Gayool skardu": { distance_km: 6.7, estimated_minutes: 19 },
    "Toqrangah Skardu": { distance_km: 3.7, estimated_minutes: 12 },
    "Maqponsar skardu": { distance_km: 3.0, estimated_minutes: 10 },
    "Newranga road": { distance_km: 4.4, estimated_minutes: 13 },
    "Quaidabad": { distance_km: 3.1, estimated_minutes: 13 },
    "Kharpocho Road": { distance_km: 0.6, estimated_minutes: 4 },
    "Patwal": { distance_km: 2.1, estimated_minutes: 7 },
    "Olding": { distance_km: 3.2, estimated_minutes: 10 },
    "Karasmathang": { distance_km: 2.0, estimated_minutes: 7 },
    "Kachura": { distance_km: 29, estimated_minutes: 56 },
    "3 talwar chowk": { distance_km: 3.3, estimated_minutes: 10 },
    "Teen talwar chowk": { distance_km: 3.3, estimated_minutes: 10 },
    "Sahara Complex": { distance_km: 3.1, estimated_minutes: 9 },
    "Ali plaza": { distance_km: 0.35, estimated_minutes: 2 },
    "Radio Pakistan Chowk": { distance_km: 3.7, estimated_minutes: 12 },
    "Manthal": { distance_km: 4.4, estimated_minutes: 16 },
   "Rus Olive Lodge": {
      distance_km: 3.2,
      estimated_minutes: 4
    },
    "Hargisa Resort Skardu": {
      distance_km: 4.1,
      estimated_minutes: 6
    },
    "LOKAL Rooms x Skardu (Katpana Retreat)": {
      distance_km: 4,
      estimated_minutes: 5
    },
    "Green Orchard Skardu": {
      distance_km: 2.2,
      estimated_minutes: 3
    },
    "Oasis Resort Katpana Skardu": {
      distance_km: 4.4,
      estimated_minutes: 6
    },
    "Avari Xpress Skardu Hotel": {
      distance_km: 2.5,
      estimated_minutes: 3
    },
    "Hotel Mashabrum Skardu": {
      distance_km: 1.4,
      estimated_minutes: 3
    },
    "Skardu Luxus Hotel": {
      distance_km: 1.4,
      estimated_minutes: 3
    },
    "The Mountain Cottage Skardu": {
      distance_km: 2.5,
      estimated_minutes: 4
    },
    "Summit Hotel Skardu": {
      distance_km: 2.7,
      estimated_minutes: 4
    },
    "Skardu Saraye Hotel & Resort": {
      distance_km: 2.8,
      estimated_minutes: 5
    },
    "Baltistan Tourist Cottage - Skardu": {
      distance_km: 2.9,
      estimated_minutes: 4
    },
    "Glamp Pakistan": {
      distance_km: 5.4,
      estimated_minutes: 8
    },
    "Montagna Pods": {
      distance_km: 5.6,
      estimated_minutes: 9
    },
    "Hotel Luxy Skardu": {
      distance_km: 3.7,
      estimated_minutes: 5
    },
    "Baltistan Fort, Skardu Resort Hotel": {
      distance_km: 8.3,
      estimated_minutes: 13
    },
    "Hotel Skardu1": {
      distance_km: 3.3,
      estimated_minutes: 5
    },
    "Baltistan Resort": {
      distance_km: 3.3,
      estimated_minutes: 5
    },
    "Skardu Royal Hotel & Restaurant": {
      distance_km: 2.7,
      estimated_minutes: 4
    },
    "Sharif Cottages and Hotel Skardu": {
      distance_km: 4.9,
      estimated_minutes: 5
    },
    "Base Camp Katpana": {
      distance_km: 6.5,
      estimated_minutes: 11
    },
    "Hotel Dewan-e-Khas": {
      distance_km: 0.3,
      estimated_minutes: 1
    },
    "Legend Hotel Skardu": {
      distance_km: 0.5,
      estimated_minutes: 1
    },
    "Northlanders Guest House Skardu": {
      distance_km: 0.6,
      estimated_minutes: 2
    },
    "Hotel Travellodge Skardu": {
      distance_km: 2.2,
      estimated_minutes: 4
    },
    "Qayam Skardu": {
      distance_km: 5.7,
      estimated_minutes: 6
    },
    "Rafsal A Countryside Cottage": {
      distance_km: 5.9,
      estimated_minutes: 9
    },
    "Kentish Lodge Skardu": {
      distance_km: 2,
      estimated_minutes: 3
    },
    "Skardu Villas": {
      distance_km: 6.1,
      estimated_minutes: 6
    },
    "The Cherry Courtyard": {
      distance_km: 6.1,
      estimated_minutes: 7
    },
    "Ringchan Guest House & Restaurant": {
      distance_km: 1,
      estimated_minutes: 2
    },
    "Skardu Lodge": {
      distance_km: 1.2,
      estimated_minutes: 2
    },
    "Karakoram Nest": {
      distance_km: 1.3,
      estimated_minutes: 2
    },
    "Dynasty Skardu": {
      distance_km: 6.4,
      estimated_minutes: 7
    },
    "Sehrish Guest House Skardu": {
      distance_km: 1.7,
      estimated_minutes: 4
    },
    "PTDC Motel Skardu": {
      distance_km: 1.2,
      estimated_minutes: 2
    },
    "Hotel Reego Skardu": {
      distance_km: 1.8,
      estimated_minutes: 2
    },
    "Lavender Cottage & Guest House": {
      distance_km: 1.7,
      estimated_minutes: 4
    },
    "Rock View Skardu": {
      distance_km: 1.7,
      estimated_minutes: 3
    },
    "Dream Guest House Haji Gam Chowk": {
      distance_km: 2.3,
      estimated_minutes: 3
    },
    "Indus Lodges Skardu": {
      distance_km: 1.3,
      estimated_minutes: 2
    },
    "Pacific Guest House Skardu": {
      distance_km: 3.2,
      estimated_minutes: 5
    },
    "Skardu View Point Hotel and Huts": {
      distance_km: 3.2,
      estimated_minutes: 5
    },
    "Khar Hotel Skardu": {
      distance_km: 2.6,
      estimated_minutes: 3
    },
    "HIKK Inn Skardu": {
      distance_km: 3.2,
      estimated_minutes: 5
    },
    "Taaj Residence Skardu": {
      distance_km: 2.5,
      estimated_minutes: 3
    },
    "Homeland Guest House Skardu": {
      distance_km: 1.9,
      estimated_minutes: 2
    },
    "Sultan Guest House Skardu": {
      distance_km: 2.6,
      estimated_minutes: 4
    },
    "The Hill Town Resort": {
      distance_km: 3.6,
      estimated_minutes: 5
    },
    "AlJannah Guest House Skardu": {
      distance_km: 3.5,
      estimated_minutes: 4
    },
    "Deosai Gateway Inn Skardu": {
      distance_km: 3.5,
      estimated_minutes: 4
    },
    "Skardu Arcadian Resort": {
      distance_km: 8.1,
      estimated_minutes: 10
    },
    "Areena Hotel Skardu": {
      distance_km: 2.6,
      estimated_minutes: 3
    },
    "Skardu Farmhouse for stay": {
      distance_km: 4.1,
      estimated_minutes: 4
    },
    "Adventure Sarai Hotel Skardu": {
      distance_km: 3.6,
      estimated_minutes: 4
    },
    "Maple Resort": {
      distance_km: 12.7,
      estimated_minutes: 16
    },
    "Candela Resorts": {
      distance_km: 4.5,
      estimated_minutes: 5
    },
    "Hispar Hotel Skardu": {
      distance_km: 4.5,
      estimated_minutes: 5
    },
    "K2 Paradise Guest House": {
      distance_km: 3.2,
      estimated_minutes: 3
    },
    "Holiday Mountain Resort & Camping Site": {
      distance_km: 5,
      estimated_minutes: 7
    },
    "Mountain Lodge Skardu": {
      distance_km: 5,
      estimated_minutes: 7
    },
    "Mulberry Continental Hotel Skardu": {
      distance_km: 11.1,
      estimated_minutes: 10
    },
    "PC Legacy Skardu": {
      distance_km: 11.3,
      estimated_minutes: 10
    },
    "GB Lodges": {
      distance_km: 12.1,
      estimated_minutes: 11
    },
    "Bilafond Cottage": {
      distance_km: 8.2,
      estimated_minutes: 10
    },
    "North Hills Skardu": {
      distance_km: 2.5,
      estimated_minutes: 3
    },
    "Pinnacle Executive Lodges": {
      distance_km: 12.6,
      estimated_minutes: 11
    },
    "Safena Hotel Skardu": {
      distance_km: 15.4,
      estimated_minutes: 13
    },
    "Byarsa Hotel Skardu": {
      distance_km: 25.3,
      estimated_minutes: 21
    },
    "Dream Nest Resort Hotels Skardu": {
      distance_km: 33.9,
      estimated_minutes: 35
    },
    "Stream view guest house skardu": {
      distance_km: 2.1,
      estimated_minutes: 4
    },
    "Shangrila Resort Skardu": {
      distance_km: 26.2,
      estimated_minutes: 24
    },
    "Kachura Inn Skardu": {
      distance_km: 31,
      estimated_minutes: 29
    },
    "Tibet Hotel Kachura Skardu": {
      distance_km: 29.5,
      estimated_minutes: 25
    },
    "Hotel Mountain Lagoon Skardu": {
      distance_km: 26.6,
      estimated_minutes: 26
    },
    "Skardu River Resort": {
      distance_km: 26.8,
      estimated_minutes: 26
    },
    "Morning Resort": {
      distance_km: 30,
      estimated_minutes: 26
    },
    "Hotel Desert Bloom Skardu": {
      distance_km: 3.3,
      estimated_minutes: 4
    },
    "TheQue Skardu": {
      distance_km: 30.5,
      estimated_minutes: 26
    },
    "Singay Homestay Skardu": {
      distance_km: 3,
      estimated_minutes: 4
    },
    "Baltistan Crown Resort": {
      distance_km: 6.3,
      estimated_minutes: 8
    },
    "Fatah inn Guest House": {
      distance_km: 6.4,
      estimated_minutes: 8
    },
    "Kunhar": {
      distance_km: 6.1,
      estimated_minutes: 7
    },
    "Maltoro guest house": {
      distance_km: 6.2,
      estimated_minutes: 6
    },
    "Apex Hotels and Resorts Skardu": {
      distance_km: 6.2,
      estimated_minutes: 6
    },
    "Hotel virsa": {
      distance_km: 6.3,
      estimated_minutes: 6
    },
    "Elli's Luxus": {
      distance_km: 6.9,
      estimated_minutes: 7
    },
    "Skardu Gateway Hotel & Restaurant": {
      distance_km: 7,
      estimated_minutes: 7
    },
    "Polo Land Hotel by Skyline": {
      distance_km: 7.1,
      estimated_minutes: 7
    },
    "Baltistan White House Hotel": {
      distance_km: 7.4,
      estimated_minutes: 7
    },
    "The Pioneer Hotel": {
      distance_km: 7.5,
      estimated_minutes: 7
    },
    "Ramovi Guest House": {
      distance_km: 7.5,
      estimated_minutes: 7
    },
    "Friends & Family Guest House": {
      distance_km: 7.9,
      estimated_minutes: 8
    },
    "SKY LAKE GUEST HOUSE": {
      distance_km: 8.2,
      estimated_minutes: 8
    },
    "Skardu bliss hotel": {
      distance_km: 9.5,
      estimated_minutes: 9
    },
    "Comfort inn hotel": {
      distance_km: 9.5,
      estimated_minutes: 9
    },
    "Grand Hotel Skardu": {
      distance_km: 9.8,
      estimated_minutes: 9
    },
    "Baltistan inn hotel": {
      distance_km: 9.9,
      estimated_minutes: 9
    },
    "Grand view hotel": {
      distance_km: 9.9,
      estimated_minutes: 9
    },
    "Hotel walnut": {
      distance_km: 10.9,
      estimated_minutes: 10
    },
    "ABC hotel": {
      distance_km: 11.1,
      estimated_minutes: 10
    },
    "Lashari Resort Skardu": {
      distance_km: 11.2,
      estimated_minutes: 10
    },
    "Melody Hills Skardu": {
      distance_km: 11.6,
      estimated_minutes: 10
    },
    "NJM House Near Skardu Airport": {
      distance_km: 11.6,
      estimated_minutes: 10
    },
    "Le Yurt Skardu": {
      distance_km: 11.8,
      estimated_minutes: 10
    },
    "FearLess lodge": {
      distance_km: 13,
      estimated_minutes: 13
    },
    "Wamiq Skardu Resort": {
      distance_km: 15.7,
      estimated_minutes: 16
    },
    "Hosho Guest House": {
      distance_km: 14.4,
      estimated_minutes: 12
    },
    "Orgventure Resorts Skardu": {
      distance_km: 15.6,
      estimated_minutes: 13
    },
    "Green orchard skardu": {
      distance_km: 2.2,
      estimated_minutes: 3
    },
    "Mount View hotel skardu": {
      distance_km: 2,
      estimated_minutes: 3
    },
    "Laal Haveli": {
      distance_km: 1.8,
      estimated_minutes: 3
    },
    "Skardu view Guest house": {
      distance_km: 1.7,
      estimated_minutes: 3
    },
    "Baltistan Mountain Chalet Hotel": {
      distance_km: 1.7,
      estimated_minutes: 3
    },
    "Hotel Five star & restaurant skardu": {
      distance_km: 1.6,
      estimated_minutes: 3
    },
    "Tufail palace hotel & restaurant": {
      distance_km: 1.6,
      estimated_minutes: 3
    },
    "Indus motel": {
      distance_km: 1.3,
      estimated_minutes: 2
    },
    "Paradise hotel": {
      distance_km: 1.2,
      estimated_minutes: 2
    },
    "Hotel Red sun": {
      distance_km: 1.2,
      estimated_minutes: 2
    },
    "Haks hotel": {
      distance_km: 1.1,
      estimated_minutes: 2
    },
    "Hotel inn skardu": {
      distance_km: 1,
      estimated_minutes: 2
    },
    "Skardu embassy hotel": {
      distance_km: 1,
      estimated_minutes: 2
    },
    "Hotel Delight Skardu": {
      distance_km: 0.9,
      estimated_minutes: 2
    },
    "Ayan Hotel": {
      distance_km: 0.4,
      estimated_minutes: 1
    },
    "Hotel Highlander inn": {
      distance_km: 0.7,
      estimated_minutes: 1
    },
    "The North face inn hotel skardu": {
      distance_km: 1.3,
      estimated_minutes: 2
    },
    "The yak Hotel skardu": {
      distance_km: 1.3,
      estimated_minutes: 2
    },
    "Indus lodge skardu": {
      distance_km: 1.3,
      estimated_minutes: 2
    },
    "Stay inn hotel": {
      distance_km: 1.4,
      estimated_minutes: 2
    },
    "Eden Rock skardu": {
      distance_km: 1.4,
      estimated_minutes: 2
    },
    "Concordia Motel Baltistan": {
      distance_km: 1.7,
      estimated_minutes: 2
    },
    "Harriot Skardu": {
      distance_km: 2.1,
      estimated_minutes: 2
    },
    "Hotel PeakNest": {
      distance_km: 2.1,
      estimated_minutes: 2
    },
    "Royal Glaxy Hotel": {
      distance_km: 2.3,
      estimated_minutes: 3
    },
    "Sarfaranga view rock Guest house skardu": {
      distance_km: 3,
      estimated_minutes: 3
    },
    "Eat and Read Guesthouse skardu": {
      distance_km: 3.1,
      estimated_minutes: 3
    },
    "North Face explorers": {
      distance_km: 3.1,
      estimated_minutes: 3
    },
    "Holiday resort skardu": {
      distance_km: 3.1,
      estimated_minutes: 3
    },
    "Kallisto Resort": {
      distance_km: 3.2,
      estimated_minutes: 3
    },
    "Sagar hotel skardu": {
      distance_km: 3.5,
      estimated_minutes: 3
    },
    "Hotel Elite skardu": {
      distance_km: 3.5,
      estimated_minutes: 3
    },
    "SnowLand Resort": {
      distance_km: 2.7,
      estimated_minutes: 4
    },
    "Bismillah Guest House": {
      distance_km: 2.8,
      estimated_minutes: 4
    },
    "Hotel Yak sarai": {
      distance_km: 2.7,
      estimated_minutes: 4
    },
    "The North Palace": {
      distance_km: 2.8,
      estimated_minutes: 4
    },
    "Duqsa Family Guest House": {
      distance_km: 2.2,
      estimated_minutes: 3
    },
    "Wazir's villa": {
      distance_km: 2.3,
      estimated_minutes: 4
    },
    "Hotel Rewaaj": {
      distance_km: 2.1,
      estimated_minutes: 4
    },
    "Comfort Hotel & Huts skardu": {
      distance_km: 1.6,
      estimated_minutes: 3
    },
    "Zam Zam Guest House": {
      distance_km: 1.4,
      estimated_minutes: 2
    },
    "The Mountain Gypsy Resort": {
      distance_km: 1.4,
      estimated_minutes: 2
    },
    "Rigo Resort Skardu": {
      distance_km: 4.8,
      estimated_minutes: 7
    },
    "Arish Luxury Sites": {
      distance_km: 2.8,
      estimated_minutes: 4
    },
    "InterContinental Hotel": {
      distance_km: 2.4,
      estimated_minutes: 3
    },
    "Royal fort resort skardu": {
      distance_km: 2.4,
      estimated_minutes: 3
    },
    "Meer Stay and Dine skardu": {
      distance_km: 2.3,
      estimated_minutes: 3
    },
    "Dream Land Guest House": {
      distance_km: 2.9,
      estimated_minutes: 4
    },
    "Hotel GraceLand": {
      distance_km: 2.4,
      estimated_minutes: 3
    },
    "MOUNTAIN MAJESTY INN SKARDU": {
      distance_km: 2.8,
      estimated_minutes: 4
    },
    "Alnoor Lodges": {
      distance_km: 3,
      estimated_minutes: 3
    },
    "Jasper House": {
      distance_km: 3.2,
      estimated_minutes: 4
    },
    "The Himalayan Guest House": {
      distance_km: 3.3,
      estimated_minutes: 4
    },
    "Epoch Inn Guest House Skardu": {
      distance_km: 3.4,
      estimated_minutes: 4
    },
    "Mountaindale Guest House": {
      distance_km: 3.4,
      estimated_minutes: 4
    },
    "Al Jannah Guest House Skardu": {
      distance_km: 3.5,
      estimated_minutes: 4
    },
    "Biafo Resort Skardu": {
      distance_km: 3.5,
      estimated_minutes: 4
    },
    "Skardu Blossom Inn": {
      distance_km: 3.5,
      estimated_minutes: 4
    },
    "The Diamond Guest House Skardu": {
      distance_km: 3.7,
      estimated_minutes: 4
    },
    "Anarres | A Creative Residency": {
      distance_km: 4.1,
      estimated_minutes: 4
    },
    "Submit Embassy Hotel": {
      distance_km: 4.1,
      estimated_minutes: 5
    },
    "Alpine Abode Skardu": {
      distance_km: 4.5,
      estimated_minutes: 5
    },
    "Relax Inn Skardu": {
      distance_km: 4.5,
      estimated_minutes: 5
    },
    "Gumaan Resort Skardu": {
      distance_km: 4.6,
      estimated_minutes: 5
    },
    "Yuligo Resort Skardu": {
      distance_km: 4.9,
      estimated_minutes: 5
    },
    "Urban escape resort": {
      distance_km: 2.5,
      estimated_minutes: 3
    },
    "Mohsin Lodge Skardu": {
      distance_km: 2.6,
      estimated_minutes: 3
    },
    "Back To Home Lodging": {
      distance_km: 2.6,
      estimated_minutes: 3
    },
    "Royal Brangsa Guest House": {
      distance_km: 1.8,
      estimated_minutes: 3
    },
    "Wazir Guest House Skardu": {
      distance_km: 1.5,
      estimated_minutes: 3
    },
    "Golden Ibex Guest House": {
      distance_km: 1.4,
      estimated_minutes: 3
    },
    "Up Way Guest House": {
      distance_km: 1.6,
      estimated_minutes: 3
    },
    "Kunlun Peak Inn skardu": {
      distance_km: 2.3,
      estimated_minutes: 3
    },
    "Markhor Hotel": {
      distance_km: 2.4,
      estimated_minutes: 4
    },
    "Tibet hotel skardu": {
      distance_km: 2.8,
      estimated_minutes: 5
    },
    "Alpha Nomads House": {
      distance_km: 3.7,
      estimated_minutes: 5
    },
    "Dirleh Hotel": {
      distance_km: 3.8,
      estimated_minutes: 5
    },
    "North Home Skardu": {
      distance_km: 3.8,
      estimated_minutes: 5
    },
    "Valhalla Guest House": {
      distance_km: 2.9,
      estimated_minutes: 5
    },
    "Creek villa skardu": {
      distance_km: 3,
      estimated_minutes: 5
    },
    "Prince Tourist Hut": {
      distance_km: 3.3,
      estimated_minutes: 5
    },
    "Mountain House": {
      distance_km: 3.4,
      estimated_minutes: 5
    },
    "Reechan Resort House": {
      distance_km: 3.1,
      estimated_minutes: 5
    },
    "Himalayan Guest House Hassan colony": {
      distance_km: 3.1,
      estimated_minutes: 5
    },
    "Jasmine Skardu": {
      distance_km: 3.2,
      estimated_minutes: 5
    },
    "Mountain Face Skardu": {
      distance_km: 3.3,
      estimated_minutes: 5
    },
    "Four Seasons Bed and Breakfast": {
      distance_km: 3.2,
      estimated_minutes: 5
    },
    "Flora Inn skardu": {
      distance_km: 3.3,
      estimated_minutes: 5
    },
    "Broadpeak Resort skardu": {
      distance_km: 3.3,
      estimated_minutes: 5
    },
    "Chinar Residency": {
      distance_km: 4,
      estimated_minutes: 5
    },
    "Buddha Rock Guest House Skardu": {
      distance_km: 4.1,
      estimated_minutes: 5
    },
    "Buddha view Resort skardu": {
      distance_km: 4.1,
      estimated_minutes: 5
    },
    "Moonal Residency": {
      distance_km: 4.3,
      estimated_minutes: 5
    },
    "Skarchan Resort skardu": {
      distance_km: 4.4,
      estimated_minutes: 6
    },
    "ZAGO Guest House": {
      distance_km: 2.8,
      estimated_minutes: 4
    },
    "Skardu Blossom Guest House": {
      distance_km: 2.8,
      estimated_minutes: 4
    },
    "Harpo Resorts": {
      distance_km: 2.9,
      estimated_minutes: 4
    },
    "Baltistan Continental Hotel skardu": {
      distance_km: 2,
      estimated_minutes: 3
    },
    "Al Abbas Guest House": {
      distance_km: 2,
      estimated_minutes: 3
    },
    "Apricot Spring Resort Skardu": {
      distance_km: 1.9,
      estimated_minutes: 3
    },
    "Executive Guest House Skardu": {
      distance_km: 1.9,
      estimated_minutes: 3
    },
    "Hotel Bloom Hills,Skardu": {
      distance_km: 2.9,
      estimated_minutes: 4
    },
    "Siachen Stay&Tours": {
      distance_km: 3.1,
      estimated_minutes: 4
    },
    "Mountain Guest House and Desi Restaurant": {
      distance_km: 3.2,
      estimated_minutes: 4
    },
    "Decent Baltistan guest house": {
      distance_km: 3.2,
      estimated_minutes: 5
    },
    "Baltistan Village Guest House": {
      distance_km: 3.1,
      estimated_minutes: 5
    },
    "Bareen": {
      distance_km: 3.1,
      estimated_minutes: 4
    },
    "SUMMIT GUEST HOUSE": {
      distance_km: 3,
      estimated_minutes: 4
    },
    "Serene Baltistan Hotel": {
      distance_km: 3,
      estimated_minutes: 4
    },
    "Alpha Hotel & Restaurant": {
      distance_km: 2.6,
      estimated_minutes: 4
    },
    "Saani Rooms": {
      distance_km: 2.6,
      estimated_minutes: 4
    },
    "Ridakh Inn": {
      distance_km: 2.3,
      estimated_minutes: 4
    },
    "Clifton Spachan Hotel": {
      distance_km: 2.2,
      estimated_minutes: 4
    },
    "K2 Tourism Guest House": {
      distance_km: 2.2,
      estimated_minutes: 4
    },
    "Heaven's Adventure.pk": {
      distance_km: 3.3,
      estimated_minutes: 5
    },
    "Desert one hotel and restaurant skardu": {
      distance_km: 3.1,
      estimated_minutes: 4
    },
    "Yazgar Residency Skardu": {
      distance_km: 3.2,
      estimated_minutes: 4
    },
    "The Next Home Skardu": {
      distance_km: 3.2,
      estimated_minutes: 4
    },
    "Heaven Hotel Skardu": {
      distance_km: 3.2,
      estimated_minutes: 4
    },
    "Skardu Midway hotel": {
      distance_km: 3.7,
      estimated_minutes: 5
    },
    "Sarfaranga Reaidency": {
      distance_km: 4,
      estimated_minutes: 5
    },
    "Skengoo Inn Hotel": {
      distance_km: 4.2,
      estimated_minutes: 5
    },
    "Alnoor Starlet Hotel": {
      distance_km: 4.4,
      estimated_minutes: 5
    },
    "Top Hill Resort": {
      distance_km: 4.9,
      estimated_minutes: 6
    },
    "Royal Resort Skardu": {
      distance_km: 4.6,
      estimated_minutes: 5
    },
    "Signature Skardu Hotel": {
      distance_km: 4.6,
      estimated_minutes: 5
    },
    "Shama Resort Skardu": {
      distance_km: 4.7,
      estimated_minutes: 5
    },
    "Pearl of Skardu Resort": {
      distance_km: 4.7,
      estimated_minutes: 5
    },
    "Crystal Mountain Lodge": {
      distance_km: 4.9,
      estimated_minutes: 5
    },
    "H A K S RESSORT": {
      distance_km: 5.5,
      estimated_minutes: 6
    },
    "Shaheen Guest House Skardu": {
      distance_km: 5.8,
      estimated_minutes: 6
    },
    "Nirvana Resort Skardu": {
      distance_km: 6,
      estimated_minutes: 7
    },
  
  },
   "The Kitchen": {
    "Sundus Skilgrong": { distance_km: 3.9, estimated_minutes: 12 },
    "Sundus Gond": { distance_km: 4.7, estimated_minutes: 14 },
    "Katpana": { distance_km: 6.8, estimated_minutes: 19 },
    "Khargrong": { distance_km: 1.6, estimated_minutes: 7 },
    "Hasnain Nagar": { distance_km: 0.7, estimated_minutes: 3 },
    "Alamdar Chowk": { distance_km: 0.45, estimated_minutes: 2 },
    "Hassan Colony": { distance_km: 1.3, estimated_minutes: 4 },
    "Hassan Colony Pine": { distance_km: 0.8, estimated_minutes: 3 },
    "Shinkhani Gond": { distance_km: 0.4, estimated_minutes: 1 },
    "Oldiing Nansoq": { distance_km: 3.0, estimated_minutes: 10 },
    "RHQ Road Harriot Hotel": { distance_km: 2.6, estimated_minutes: 10 },
    "Newranga Near Agha Ali House": { distance_km: 1.2, estimated_minutes: 4 },
    "Newranga ": { distance_km: 2.9, estimated_minutes: 8 },
    "Kushmarah": { distance_km: 2.3, estimated_minutes: 6 },
    "Sherthang Girls High School": { distance_km: 1.9, estimated_minutes: 7 },
    "Marfie Colony": { distance_km: 2.1, estimated_minutes: 8 },
    "Chumik": { distance_km: 2.1, estimated_minutes: 9 },
    "Gamba Skardu": { distance_km: 10, estimated_minutes: 19 },
    "United Line, Hassan Colony": { distance_km: 0.75, estimated_minutes: 3 },
    "Muhib Road Khargrong": { distance_km: 1.8, estimated_minutes: 7 },
    "GB Chief Court Skardu Registry Skardu": { distance_km: 2.9, estimated_minutes: 9 },
    "Shaheen Public School Skardu": { distance_km: 1.6, estimated_minutes: 6 },
    "Mehdi Colony Skardu": { distance_km: 1.6, estimated_minutes: 7 },
    "Agha Hadi Chowk": { distance_km: 1.5, estimated_minutes: 7 },
    "Hussainabad": { distance_km: 7, estimated_minutes: 18 },
    "Himalaya Hotel Hussainabad, Skardu": { distance_km: 7, estimated_minutes: 18 },
    "Hameed Garh": { distance_km: 2.3, estimated_minutes: 9 },
    "Shaheed colony": { distance_km: 3.4, estimated_minutes: 9 },
    "Tufail colony": { distance_km: 2.6, estimated_minutes: 8 },
    "Jafferi Mohallah": { distance_km: 1.8, estimated_minutes: 6 },
    "Chogo Matamsara": { distance_km: 2.2, estimated_minutes: 9 },
    "Nagulispang Road": { distance_km: 0.55, estimated_minutes: 2 },
    "Eidgah,Sundus ": { distance_km: 3.3, estimated_minutes: 10 },
    "Sukemaidan ": { distance_km: 1.2, estimated_minutes: 4 },
    "Hargissa shakthang": { distance_km: 0.9, estimated_minutes: 3 },
    "Bhutto Bazar Skardu": { distance_km: 1.3, estimated_minutes: 4 },
    "Devision": { distance_km: 2.7, estimated_minutes: 10 },
    "Abbas Town": { distance_km: 2.0, estimated_minutes: 7 },
    "Musa Line": { distance_km: 1.0, estimated_minutes: 3 },
    "Clifton pull": { distance_km: 0.35, estimated_minutes: 1 },
    "Sheikh ijaz masjid": { distance_km: 1.0, estimated_minutes: 3 },
    "Khila Toq Road": { distance_km: 2.2, estimated_minutes: 9 },
    "Public school area": { distance_km: 2.9, estimated_minutes: 9 },
    "Xhathang": { distance_km: 3.0, estimated_minutes: 9 },
    "Brolmo colony sundus": { distance_km: 3.9, estimated_minutes: 12 },
    "Ghazi Colony sundus": { distance_km: 4.3, estimated_minutes: 14 },
    "Hyderabad Gangupi Area": { distance_km: 0.95, estimated_minutes: 4 },
    "LT Col ihsan Ali rd": { distance_km: 0.8, estimated_minutes: 3 },
    "Astana skardu": { distance_km: 2.9, estimated_minutes: 9 },
    "Bintul Huda Girls model school": { distance_km: 4.0, estimated_minutes: 12 },
    "Brolmo colony astana": { distance_km: 3.1, estimated_minutes: 9 },
    "Raees mohalla Haji Gam": { distance_km: 2.3, estimated_minutes: 8 },
    "Haji Gam": { distance_km: 1.4, estimated_minutes: 5 },
    "Gulshan e Ali skardu": { distance_km: 2.7, estimated_minutes: 10 },
    "Jamia masjid road": { distance_km: 1.4, estimated_minutes: 5 },
    "Gayool skardu": { distance_km: 4.9, estimated_minutes: 11 },
    "Toqrangah Skardu": { distance_km: 3.2, estimated_minutes: 10 },
    "Maqponsar skardu": { distance_km: 2.7, estimated_minutes: 8 },
    "Newranga road": { distance_km: 2.7, estimated_minutes: 8 },
    "Quaidabad": { distance_km: 1.3, estimated_minutes: 5 },
    "Kharpocho Road": { distance_km: 2.1, estimated_minutes: 9 },
    "Patwal": { distance_km: 2.0, estimated_minutes: 8 },
    "Olding": { distance_km: 3.2, estimated_minutes: 9 },
    "Karasmathang": { distance_km: 1.9, estimated_minutes: 7 },
    "Kachura": { distance_km: 27, estimated_minutes: 52 },
    "3 talwar chowk": { distance_km: 3.1, estimated_minutes: 10 },
    "Teen talwar chowk": { distance_km: 3.1, estimated_minutes: 10 },
    "Sahara Complex": { distance_km: 3.0, estimated_minutes: 9 },
    "Ali plaza": { distance_km: 1.6, estimated_minutes: 6 },
    "Radio Pakistan Chowk": { distance_km: 2.0, estimated_minutes: 7 },
    "Manthal": { distance_km: 4.8, estimated_minutes: 14 },
   "Rus Olive Lodge": {
    distance_km: 4.5,
    estimated_minutes: 6
  },
  "Hargisa Resort Skardu": {
    distance_km: 5.4,
    estimated_minutes: 7
  },
  "LOKAL Rooms x Skardu (Katpana Retreat)": {
    distance_km: 5.3,
    estimated_minutes: 7
  },
  "Green Orchard Skardu": {
    distance_km: 3.5,
    estimated_minutes: 5
  },
  "Oasis Resort Katpana Skardu": {
    distance_km: 5.7,
    estimated_minutes: 7
  },
  "Avari Xpress Skardu Hotel": {
    distance_km: 3.8,
    estimated_minutes: 4
  },
  "Hotel Mashabrum Skardu": {
    distance_km: 2.7,
    estimated_minutes: 4
  },
  "Skardu Luxus Hotel": {
    distance_km: 2.7,
    estimated_minutes: 4
  },
  "The Mountain Cottage Skardu": {
    distance_km: 2.1,
    estimated_minutes: 3
  },
  "Summit Hotel Skardu": {
    distance_km: 2,
    estimated_minutes: 3
  },
  "Skardu Saraye Hotel & Resort": {
    distance_km: 3.6,
    estimated_minutes: 6
  },
  "Baltistan Tourist Cottage - Skardu": {
    distance_km: 2.2,
    estimated_minutes: 3
  },
  "Glamp Pakistan": {
    distance_km: 6.7,
    estimated_minutes: 10
  },
  "Montagna Pods": {
    distance_km: 6.9,
    estimated_minutes: 10
  },
  "Hotel Luxy Skardu": {
    distance_km: 3,
    estimated_minutes: 4
  },
  "Baltistan Fort, Skardu Resort Hotel": {
    distance_km: 7.6,
    estimated_minutes: 12
  },
  "Hotel Skardu1": {
    distance_km: 1.3,
    estimated_minutes: 2
  },
  "Baltistan Resort": {
    distance_km: 1.3,
    estimated_minutes: 2
  },
  "Skardu Royal Hotel & Restaurant": {
    distance_km: 0.7,
    estimated_minutes: 2
  },
  "Sharif Cottages and Hotel Skardu": {
    distance_km: 4.2,
    estimated_minutes: 4
  },
  "Base Camp Katpana": {
    distance_km: 7.8,
    estimated_minutes: 12
  },
  "Hotel Dewan-e-Khas": {
    distance_km: 2.1,
    estimated_minutes: 3
  },
  "Legend Hotel Skardu": {
    distance_km: 1.9,
    estimated_minutes: 3
  },
  "Northlanders Guest House Skardu": {
    distance_km: 1.7,
    estimated_minutes: 3
  },
  "Hotel Travellodge Skardu": {
    distance_km: 0.3,
    estimated_minutes: 1
  },
  "Qayam Skardu": {
    distance_km: 5,
    estimated_minutes: 5
  },
  "Rafsal A Countryside Cottage": {
    distance_km: 5.2,
    estimated_minutes: 8
  },
  "Kentish Lodge Skardu": {
    distance_km: 0.5,
    estimated_minutes: 1
  },
  "Skardu Villas": {
    distance_km: 5.4,
    estimated_minutes: 5
  },
  "The Cherry Courtyard": {
    distance_km: 5.4,
    estimated_minutes: 6
  },
  "Ringchan Guest House & Restaurant": {
    distance_km: 2.3,
    estimated_minutes: 3
  },
  "Skardu Lodge": {
    distance_km: 2,
    estimated_minutes: 2
  },
  "Karakoram Nest": {
    distance_km: 2.6,
    estimated_minutes: 3
  },
  "Dynasty Skardu": {
    distance_km: 5.7,
    estimated_minutes: 6
  },
  "Sehrish Guest House Skardu": {
    distance_km: 1.4,
    estimated_minutes: 2
  },
  "PTDC Motel Skardu": {
    distance_km: 2.6,
    estimated_minutes: 3
  },
  "Hotel Reego Skardu": {
    distance_km: 1.3,
    estimated_minutes: 2
  },
  "Lavender Cottage & Guest House": {
    distance_km: 1.4,
    estimated_minutes: 3
  },
  "Rock View Skardu": {
    distance_km: 1.3,
    estimated_minutes: 2
  },
  "Dream Guest House Haji Gam Chowk": {
    distance_km: 1.3,
    estimated_minutes: 2
  },
  "Indus Lodges Skardu": {
    distance_km: 2.7,
    estimated_minutes: 3
  },
  "Pacific Guest House Skardu": {
    distance_km: 1.8,
    estimated_minutes: 3
  },
  "Skardu View Point Hotel and Huts": {
    distance_km: 1.8,
    estimated_minutes: 3
  },
  "Khar Hotel Skardu": {
    distance_km: 1.7,
    estimated_minutes: 3
  },
  "HIKK Inn Skardu": {
    distance_km: 1.8,
    estimated_minutes: 3
  },
  "Taaj Residence Skardu": {
    distance_km: 2.3,
    estimated_minutes: 3
  },
  "Homeland Guest House Skardu": {
    distance_km: 1.8,
    estimated_minutes: 2
  },
  "Sultan Guest House Skardu": {
    distance_km: 1.6,
    estimated_minutes: 3
  },
  "The Hill Town Resort": {
    distance_km: 2,
    estimated_minutes: 4
  },
  "AlJannah Guest House Skardu": {
    distance_km: 2.5,
    estimated_minutes: 3
  },
  "Deosai Gateway Inn Skardu": {
    distance_km: 2.6,
    estimated_minutes: 3
  },
  "Skardu Arcadian Resort": {
    distance_km: 9.4,
    estimated_minutes: 11
  },
  "Areena Hotel Skardu": {
    distance_km: 2.4,
    estimated_minutes: 3
  },
  "Skardu Farmhouse for stay": {
    distance_km: 3.1,
    estimated_minutes: 4
  },
  "Adventure Sarai Hotel Skardu": {
    distance_km: 2.6,
    estimated_minutes: 3
  },
  "Maple Resort": {
    distance_km: 12,
    estimated_minutes: 15
  },
  "Candela Resorts": {
    distance_km: 3.5,
    estimated_minutes: 4
  },
  "Hispar Hotel Skardu": {
    distance_km: 3.6,
    estimated_minutes: 5
  },
  "K2 Paradise Guest House": {
    distance_km: 3.3,
    estimated_minutes: 3
  },
  "Holiday Mountain Resort & Camping Site": {
    distance_km: 4.1,
    estimated_minutes: 6
  },
  "Mountain Lodge Skardu": {
    distance_km: 4.1,
    estimated_minutes: 6
  },
  "Mulberry Continental Hotel Skardu": {
    distance_km: 10.4,
    estimated_minutes: 9
  },
  "PC Legacy Skardu": {
    distance_km: 10.6,
    estimated_minutes: 9
  },
  "GB Lodges": {
    distance_km: 11.4,
    estimated_minutes: 10
  },
  "Bilafond Cottage": {
    distance_km: 8.3,
    estimated_minutes: 10
  },
  "North Hills Skardu": {
    distance_km: 2.3,
    estimated_minutes: 3
  },
  "Pinnacle Executive Lodges": {
    distance_km: 11.9,
    estimated_minutes: 10
  },
  "Safena Hotel Skardu": {
    distance_km: 14.7,
    estimated_minutes: 12
  },
  "Byarsa Hotel Skardu": {
    distance_km: 24.6,
    estimated_minutes: 20
  },
  "Dream Nest Resort Hotels Skardu": {
    distance_km: 33.2,
    estimated_minutes: 34
  },
  "Stream view guest house skardu": {
    distance_km: 0.7,
    estimated_minutes: 2
  },
  "Shangrila Resort Skardu": {
    distance_km: 25.5,
    estimated_minutes: 23
  },
  "Kachura Inn Skardu": {
    distance_km: 30.3,
    estimated_minutes: 28
  },
  "Tibet Hotel Kachura Skardu": {
    distance_km: 28.8,
    estimated_minutes: 24
  },
  "Hotel Mountain Lagoon Skardu": {
    distance_km: 25.9,
    estimated_minutes: 25
  },
  "Skardu River Resort": {
    distance_km: 26.1,
    estimated_minutes: 25
  },
  "Morning Resort": {
    distance_km: 29.3,
    estimated_minutes: 25
  },
  "Hotel Desert Bloom Skardu": {
    distance_km: 4.6,
    estimated_minutes: 6
  },
  "TheQue Skardu": {
    distance_km: 29.8,
    estimated_minutes: 25
  },
  "Singay Homestay Skardu": {
    distance_km: 2.4,
    estimated_minutes: 4
  },
  "Baltistan Crown Resort": {
    distance_km: 5.6,
    estimated_minutes: 7
  },
  "Fatah inn Guest House": {
    distance_km: 5.7,
    estimated_minutes: 7
  },
  "Kunhar": {
    distance_km: 5.4,
    estimated_minutes: 6
  },
  "Maltoro guest house": {
    distance_km: 5.5,
    estimated_minutes: 5
  },
  "Apex Hotels and Resorts Skardu": {
    distance_km: 5.5,
    estimated_minutes: 5
  },
  "Hotel virsa": {
    distance_km: 5.6,
    estimated_minutes: 5
  },
  "Elli's Luxus": {
    distance_km: 6.2,
    estimated_minutes: 6
  },
  "Skardu Gateway Hotel & Restaurant": {
    distance_km: 6.3,
    estimated_minutes: 6
  },
  "Polo Land Hotel by Skyline": {
    distance_km: 6.4,
    estimated_minutes: 6
  },
  "Baltistan White House Hotel": {
    distance_km: 6.7,
    estimated_minutes: 6
  },
  "The Pioneer Hotel": {
    distance_km: 6.8,
    estimated_minutes: 6
  },
  "Ramovi Guest House": {
    distance_km: 6.8,
    estimated_minutes: 6
  },
  "Friends & Family Guest House": {
    distance_km: 7.2,
    estimated_minutes: 7
  },
  "SKY LAKE GUEST HOUSE": {
    distance_km: 7.5,
    estimated_minutes: 7
  },
  "Skardu bliss hotel": {
    distance_km: 8.8,
    estimated_minutes: 8
  },
  "Comfort inn hotel": {
    distance_km: 8.8,
    estimated_minutes: 8
  },
  "Grand Hotel Skardu": {
    distance_km: 9.1,
    estimated_minutes: 8
  },
  "Baltistan inn hotel": {
    distance_km: 9.2,
    estimated_minutes: 8
  },
  "Grand view hotel": {
    distance_km: 9.2,
    estimated_minutes: 8
  },
  "Hotel walnut": {
    distance_km: 10.2,
    estimated_minutes: 9
  },
  "ABC hotel": {
    distance_km: 10.4,
    estimated_minutes: 9
  },
  "Lashari Resort Skardu": {
    distance_km: 10.5,
    estimated_minutes: 9
  },
  "Melody Hills Skardu": {
    distance_km: 10.9,
    estimated_minutes: 9
  },
  "NJM House Near Skardu Airport": {
    distance_km: 10.9,
    estimated_minutes: 9
  },
  "Le Yurt Skardu": {
    distance_km: 11.1,
    estimated_minutes: 9
  },
  "FearLess lodge": {
    distance_km: 12.3,
    estimated_minutes: 12
  },
  "Wamiq Skardu Resort": {
    distance_km: 15,
    estimated_minutes: 15
  },
  "Hosho Guest House": {
    distance_km: 13.7,
    estimated_minutes: 11
  },
  "Orgventure Resorts Skardu": {
    distance_km: 15,
    estimated_minutes: 12
  },
  "Green orchard skardu": {
    distance_km: 3.5,
    estimated_minutes: 4
  },
  "Mount View hotel skardu": {
    distance_km: 3.3,
    estimated_minutes: 4
  },
  "Laal Haveli": {
    distance_km: 3.1,
    estimated_minutes: 4
  },
  "Skardu view Guest house": {
    distance_km: 3,
    estimated_minutes: 4
  },
  "Baltistan Mountain Chalet Hotel": {
    distance_km: 3,
    estimated_minutes: 4
  },
  "Hotel Five star & restaurant skardu": {
    distance_km: 2.9,
    estimated_minutes: 4
  },
  "Tufail palace hotel & restaurant": {
    distance_km: 2.9,
    estimated_minutes: 4
  },
  "Indus motel": {
    distance_km: 2.6,
    estimated_minutes: 4
  },
  "Paradise hotel": {
    distance_km: 2.5,
    estimated_minutes: 4
  },
  "Hotel Red sun": {
    distance_km: 2.5,
    estimated_minutes: 4
  },
  "Haks hotel": {
    distance_km: 2.4,
    estimated_minutes: 3
  },
  "Hotel inn skardu": {
    distance_km: 2.3,
    estimated_minutes: 3
  },
  "Skardu embassy hotel": {
    distance_km: 2.3,
    estimated_minutes: 3
  },
  "Hotel Delight Skardu": {
    distance_km: 2.2,
    estimated_minutes: 3
  },
  "Ayan Hotel": {
    distance_km: 1.8,
    estimated_minutes: 3
  },
  "Hotel Highlander inn": {
    distance_km: 2.5,
    estimated_minutes: 3
  },
  "The North face inn hotel skardu": {
    distance_km: 2.7,
    estimated_minutes: 3
  },
  "The yak Hotel skardu": {
    distance_km: 2.7,
    estimated_minutes: 3
  },
  "Indus lodge skardu": {
    distance_km: 2.7,
    estimated_minutes: 3
  },
  "Stay inn hotel": {
    distance_km: 2.7,
    estimated_minutes: 3
  },
  "Eden Rock skardu": {
    distance_km: 2.8,
    estimated_minutes: 3
  },
  "Concordia Motel Baltistan": {
    distance_km: 3,
    estimated_minutes: 3
  },
  "Harriot Skardu": {
    distance_km: 3.4,
    estimated_minutes: 3
  },
  "Hotel PeakNest": {
    distance_km: 3.5,
    estimated_minutes: 3
  },
  "Royal Glaxy Hotel": {
    distance_km: 3.7,
    estimated_minutes: 4
  },
  "Sarfaranga view rock Guest house skardu": {
    distance_km: 3.5,
    estimated_minutes: 3
  },
  "Eat and Read Guesthouse skardu": {
    distance_km: 3.4,
    estimated_minutes: 3
  },
  "North Face explorers": {
    distance_km: 3.4,
    estimated_minutes: 3
  },
  "Holiday resort skardu": {
    distance_km: 3.3,
    estimated_minutes: 3
  },
  "Kallisto Resort": {
    distance_km: 3.3,
    estimated_minutes: 3
  },
  "Sagar hotel skardu": {
    distance_km: 3.6,
    estimated_minutes: 3
  },
  "Hotel Elite skardu": {
    distance_km: 3.3,
    estimated_minutes: 3
  },
  "SnowLand Resort": {
    distance_km: 2,
    estimated_minutes: 3
  },
  "Bismillah Guest House": {
    distance_km: 2.1,
    estimated_minutes: 3
  },
  "Hotel Yak sarai": {
    distance_km: 2,
    estimated_minutes: 3
  },
  "The North Palace": {
    distance_km: 2.1,
    estimated_minutes: 3
  },
  "Duqsa Family Guest House": {
    distance_km: 2.3,
    estimated_minutes: 3
  },
  "Wazir's villa": {
    distance_km: 2.8,
    estimated_minutes: 4
  },
  "Hotel Rewaaj": {
    distance_km: 2.9,
    estimated_minutes: 4
  },
  "Comfort Hotel & Huts skardu": {
    distance_km: 2.3,
    estimated_minutes: 4
  },
  "Zam Zam Guest House": {
    distance_km: 2,
    estimated_minutes: 3
  },
  "The Mountain Gypsy Resort": {
    distance_km: 2,
    estimated_minutes: 3
  },
  "Rigo Resort Skardu": {
    distance_km: 3.9,
    estimated_minutes: 6
  },
  "Arish Luxury Sites": {
    distance_km: 2.6,
    estimated_minutes: 4
  },
  "InterContinental Hotel": {
    distance_km: 2.3,
    estimated_minutes: 3
  },
  "Royal fort resort skardu": {
    distance_km: 2.3,
    estimated_minutes: 3
  },
  "Meer Stay and Dine skardu": {
    distance_km: 2.1,
    estimated_minutes: 2
  },
  "Dream Land Guest House": {
    distance_km: 2.8,
    estimated_minutes: 4
  },
  "Hotel GraceLand": {
    distance_km: 2.2,
    estimated_minutes: 3
  },
  "MOUNTAIN MAJESTY INN SKARDU": {
    distance_km: 2.1,
    estimated_minutes: 3
  },
  "Alnoor Lodges": {
    distance_km: 2.1,
    estimated_minutes: 3
  },
  "Jasper House": {
    distance_km: 2.2,
    estimated_minutes: 3
  },
  "The Himalayan Guest House": {
    distance_km: 2.3,
    estimated_minutes: 3
  },
  "Epoch Inn Guest House Skardu": {
    distance_km: 2.4,
    estimated_minutes: 3
  },
  "Mountaindale Guest House": {
    distance_km: 2.5,
    estimated_minutes: 3
  },
  "Al Jannah Guest House Skardu": {
    distance_km: 2.5,
    estimated_minutes: 3
  },
  "Biafo Resort Skardu": {
    distance_km: 2.6,
    estimated_minutes: 3
  },
  "Skardu Blossom Inn": {
    distance_km: 2.6,
    estimated_minutes: 3
  },
  "The Diamond Guest House Skardu": {
    distance_km: 2.7,
    estimated_minutes: 4
  },
  "Anarres | A Creative Residency": {
    distance_km: 3.1,
    estimated_minutes: 4
  },
  "Submit Embassy Hotel": {
    distance_km: 3.2,
    estimated_minutes: 4
  },
  "Alpine Abode Skardu": {
    distance_km: 3.6,
    estimated_minutes: 5
  },
  "Relax Inn Skardu": {
    distance_km: 3.5,
    estimated_minutes: 5
  },
  "Gumaan Resort Skardu": {
    distance_km: 3.7,
    estimated_minutes: 4
  },
  "Yuligo Resort Skardu": {
    distance_km: 3.9,
    estimated_minutes: 5
  },
  "Urban escape resort": {
    distance_km: 1.8,
    estimated_minutes: 3
  },
  "Mohsin Lodge Skardu": {
    distance_km: 1.7,
    estimated_minutes: 3
  },
  "Back To Home Lodging": {
    distance_km: 1.7,
    estimated_minutes: 3
  },
  "Royal Brangsa Guest House": {
    distance_km: 1.5,
    estimated_minutes: 2
  },
  "Wazir Guest House Skardu": {
    distance_km: 1.2,
    estimated_minutes: 2
  },
  "Golden Ibex Guest House": {
    distance_km: 1.1,
    estimated_minutes: 2
  },
  "Up Way Guest House": {
    distance_km: 1.3,
    estimated_minutes: 2
  },
  "Kunlun Peak Inn skardu": {
    distance_km: 1.3,
    estimated_minutes: 2
  },
  "Markhor Hotel": {
    distance_km: 1.4,
    estimated_minutes: 2
  },
  "Tibet hotel skardu": {
    distance_km: 1.8,
    estimated_minutes: 3
  },
  "Alpha Nomads House": {
    distance_km: 1.9,
    estimated_minutes: 3
  },
  "Dirleh Hotel": {
    distance_km: 2,
    estimated_minutes: 4
  },
  "North Home Skardu": {
    distance_km: 2,
    estimated_minutes: 4
  },
  "Valhalla Guest House": {
    distance_km: 2,
    estimated_minutes: 4
  },
  "Creek villa skardu": {
    distance_km: 2,
    estimated_minutes: 4
  },
  "Prince Tourist Hut": {
    distance_km: 1.9,
    estimated_minutes: 4
  },
  "Mountain House": {
    distance_km: 2,
    estimated_minutes: 4
  },
  "Reechan Resort House": {
    distance_km: 1.7,
    estimated_minutes: 3
  },
  "Himalayan Guest House Hassan colony": {
    distance_km: 1.7,
    estimated_minutes: 3
  },
  "Jasmine Skardu": {
    distance_km: 1.8,
    estimated_minutes: 3
  },
  "Mountain Face Skardu": {
    distance_km: 1.9,
    estimated_minutes: 3
  },
  "Four Seasons Bed and Breakfast": {
    distance_km: 1.8,
    estimated_minutes: 3
  },
  "Flora Inn skardu": {
    distance_km: 1.8,
    estimated_minutes: 3
  },
  "Broadpeak Resort skardu": {
    distance_km: 1.9,
    estimated_minutes: 3
  },
  "Chinar Residency": {
    distance_km: 3.1,
    estimated_minutes: 4
  },
  "Buddha Rock Guest House Skardu": {
    distance_km: 3.1,
    estimated_minutes: 4
  },
  "Buddha view Resort skardu": {
    distance_km: 3.2,
    estimated_minutes: 4
  },
  "Moonal Residency": {
    distance_km: 3.3,
    estimated_minutes: 5
  },
  "Skarchan Resort skardu": {
    distance_km: 3.4,
    estimated_minutes: 5
  },
  "ZAGO Guest House": {
    distance_km: 1.4,
    estimated_minutes: 3
  },
  "Skardu Blossom Guest House": {
    distance_km: 1.4,
    estimated_minutes: 3
  },
  "Harpo Resorts": {
    distance_km: 1.4,
    estimated_minutes: 3
  },
  "Baltistan Continental Hotel skardu": {
    distance_km: 0.1,
    estimated_minutes: 1
  },
  "Al Abbas Guest House": {
    distance_km: 0,
    estimated_minutes: 1
  },
  "Apricot Spring Resort Skardu": {
    distance_km: 0.1,
    estimated_minutes: 1
  },
  "Executive Guest House Skardu": {
    distance_km: 0.3,
    estimated_minutes: 1
  },
  "Hotel Bloom Hills,Skardu": {
    distance_km: 1.7,
    estimated_minutes: 3
  },
  "Siachen Stay&Tours": {
    distance_km: 1.5,
    estimated_minutes: 2
  },
  "Mountain Guest House and Desi Restaurant": {
    distance_km: 1.4,
    estimated_minutes: 2
  },
  "Decent Baltistan guest house": {
    distance_km: 1.2,
    estimated_minutes: 2
  },
  "Baltistan Village Guest House": {
    distance_km: 1.2,
    estimated_minutes: 2
  },
  "Bareen": {
    distance_km: 1.1,
    estimated_minutes: 2
  },
  "SUMMIT GUEST HOUSE": {
    distance_km: 1.1,
    estimated_minutes: 2
  },
  "Serene Baltistan Hotel": {
    distance_km: 1,
    estimated_minutes: 2
  },
  "Alpha Hotel & Restaurant": {
    distance_km: 0.7,
    estimated_minutes: 1
  },
  "Saani Rooms": {
    distance_km: 0.6,
    estimated_minutes: 1
  },
  "Ridakh Inn": {
    distance_km: 0.4,
    estimated_minutes: 1
  },
  "Clifton Spachan Hotel": {
    distance_km: 0.3,
    estimated_minutes: 1
  },
  "K2 Tourism Guest House": {
    distance_km: 0.2,
    estimated_minutes: 1
  },
  "Heaven's Adventure.pk": {
    distance_km: 2.6,
    estimated_minutes: 4
  },
  "Desert one hotel and restaurant skardu": {
    distance_km: 2.4,
    estimated_minutes: 3
  },
  "Yazgar Residency Skardu": {
    distance_km: 2.5,
    estimated_minutes: 3
  },
  "The Next Home Skardu": {
    distance_km: 2.5,
    estimated_minutes: 3
  },
  "Heaven Hotel Skardu": {
    distance_km: 2.5,
    estimated_minutes: 3
  },
  "Skardu Midway hotel": {
    distance_km: 3,
    estimated_minutes: 4
  },
  "Sarfaranga Reaidency": {
    distance_km: 3.3,
    estimated_minutes: 4
  },
  "Skengoo Inn Hotel": {
    distance_km: 3.5,
    estimated_minutes: 4
  },
  "Alnoor Starlet Hotel": {
    distance_km: 3.7,
    estimated_minutes: 4
  },
  "Top Hill Resort": {
    distance_km: 4.2,
    estimated_minutes: 5
  },
  "Royal Resort Skardu": {
    distance_km: 3.9,
    estimated_minutes: 4
  },
  "Signature Skardu Hotel": {
    distance_km: 3.9,
    estimated_minutes: 4
  },
  "Shama Resort Skardu": {
    distance_km: 4,
    estimated_minutes: 4
  },
  "Pearl of Skardu Resort": {
    distance_km: 4,
    estimated_minutes: 4
  },
  "Crystal Mountain Lodge": {
    distance_km: 4.2,
    estimated_minutes: 4
  },
  "H A K S RESSORT": {
    distance_km: 4.8,
    estimated_minutes: 5
  },
  "Shaheen Guest House Skardu": {
    distance_km: 5.1,
    estimated_minutes: 5
  },
  "Nirvana Resort Skardu": {
    distance_km: 5.3,
    estimated_minutes: 6
  }
},
"thefoodcorridor-skardu": {
  "Rus Olive Lodge": {
    distance_km: 4.4,
    estimated_minutes: 5
  },
  "Hargisa Resort Skardu": {
    distance_km: 5.4,
    estimated_minutes: 7
  },
  "LOKAL Rooms x Skardu (Katpana Retreat)": {
    distance_km: 5.3,
    estimated_minutes: 6
  },
  "Green Orchard Skardu": {
    distance_km: 3.4,
    estimated_minutes: 4
  },
  "Oasis Resort Katpana Skardu": {
    distance_km: 5.7,
    estimated_minutes: 7
  },
  "Avari Xpress Skardu Hotel": {
    distance_km: 3.8,
    estimated_minutes: 4
  },
  "Hotel Mashabrum Skardu": {
    distance_km: 2.7,
    estimated_minutes: 4
  },
  "Skardu Luxus Hotel": {
    distance_km: 2.7,
    estimated_minutes: 4
  },
  "The Mountain Cottage Skardu": {
    distance_km: 3.1,
    estimated_minutes: 4
  },
  "Summit Hotel Skardu": {
    distance_km: 3,
    estimated_minutes: 4
  },
  "Skardu Saraye Hotel & Resort": {
    distance_km: 3.9,
    estimated_minutes: 6
  },
  "Baltistan Tourist Cottage - Skardu": {
    distance_km: 3.2,
    estimated_minutes: 4
  },
  "Glamp Pakistan": {
    distance_km: 6.7,
    estimated_minutes: 9
  },
  "Montagna Pods": {
    distance_km: 6.8,
    estimated_minutes: 10
  },
  "Hotel Luxy Skardu": {
    distance_km: 4.1,
    estimated_minutes: 4
  },
  "Baltistan Fort, Skardu Resort Hotel": {
    distance_km: 8.7,
    estimated_minutes: 12
  },
  "Hotel Skardu1": {
    distance_km: 2.3,
    estimated_minutes: 3
  },
  "Baltistan Resort": {
    distance_km: 2.3,
    estimated_minutes: 3
  },
  "Skardu Royal Hotel & Restaurant": {
    distance_km: 1.8,
    estimated_minutes: 2
  },
  "Sharif Cottages and Hotel Skardu": {
    distance_km: 5.2,
    estimated_minutes: 5
  },
  "Base Camp Katpana": {
    distance_km: 7.8,
    estimated_minutes: 12
  },
  "Hotel Dewan-e-Khas": {
    distance_km: 1.4,
    estimated_minutes: 3
  },
  "Legend Hotel Skardu": {
    distance_km: 1.7,
    estimated_minutes: 2
  },
  "Northlanders Guest House Skardu": {
    distance_km: 1.2,
    estimated_minutes: 2
  },
  "Hotel Travellodge Skardu": {
    distance_km: 1.3,
    estimated_minutes: 2
  },
  "Qayam Skardu": {
    distance_km: 6,
    estimated_minutes: 6
  },
  "Rafsal A Countryside Cottage": {
    distance_km: 6.2,
    estimated_minutes: 8
  },
  "Kentish Lodge Skardu": {
    distance_km: 1.1,
    estimated_minutes: 2
  },
  "Skardu Villas": {
    distance_km: 6.4,
    estimated_minutes: 6
  },
  "The Cherry Courtyard": {
    distance_km: 6.5,
    estimated_minutes: 6
  },
  "Ringchan Guest House & Restaurant": {
    distance_km: 1.3,
    estimated_minutes: 2
  },
  "Skardu Lodge": {
    distance_km: 0.9,
    estimated_minutes: 1
  },
  "Karakoram Nest": {
    distance_km: 1.5,
    estimated_minutes: 2
  },
  "Dynasty Skardu": {
    distance_km: 6.8,
    estimated_minutes: 7
  },
  "Sehrish Guest House Skardu": {
    distance_km: 0.8,
    estimated_minutes: 2
  },
  "PTDC Motel Skardu": {
    distance_km: 1.5,
    estimated_minutes: 2
  },
  "Hotel Reego Skardu": {
    distance_km: 0.2,
    estimated_minutes: 1
  },
  "Lavender Cottage & Guest House": {
    distance_km: 0.8,
    estimated_minutes: 2
  },
  "Rock View Skardu": {
    distance_km: 0.8,
    estimated_minutes: 2
  },
  "Dream Guest House Haji Gam Chowk": {
    distance_km: 1.2,
    estimated_minutes: 2
  },
  "Indus Lodges Skardu": {
    distance_km: 1.6,
    estimated_minutes: 2
  },
  "Pacific Guest House Skardu": {
    distance_km: 2.2,
    estimated_minutes: 3
  },
  "Skardu View Point Hotel and Huts": {
    distance_km: 2.2,
    estimated_minutes: 3
  },
  "Khar Hotel Skardu": {
    distance_km: 1.4,
    estimated_minutes: 2
  },
  "HIKK Inn Skardu": {
    distance_km: 2.2,
    estimated_minutes: 3
  },
  "Taaj Residence Skardu": {
    distance_km: 1.3,
    estimated_minutes: 2
  },
  "Homeland Guest House Skardu": {
    distance_km: 0.7,
    estimated_minutes: 1
  },
  "Sultan Guest House Skardu": {
    distance_km: 1.6,
    estimated_minutes: 3
  },
  "The Hill Town Resort": {
    distance_km: 2.4,
    estimated_minutes: 3
  },
  "AlJannah Guest House Skardu": {
    distance_km: 2.3,
    estimated_minutes: 3
  },
  "Deosai Gateway Inn Skardu": {
    distance_km: 2.3,
    estimated_minutes: 3
  },
  "Skardu Arcadian Resort": {
    distance_km: 9.4,
    estimated_minutes: 11
  },
  "Areena Hotel Skardu": {
    distance_km: 1.4,
    estimated_minutes: 2
  },
  "Skardu Farmhouse for stay": {
    distance_km: 2.9,
    estimated_minutes: 3
  },
  "Adventure Sarai Hotel Skardu": {
    distance_km: 2.4,
    estimated_minutes: 3
  },
  "Maple Resort": {
    distance_km: 13,
    estimated_minutes: 15
  },
  "Candela Resorts": {
    distance_km: 3.3,
    estimated_minutes: 3
  },
  "Hispar Hotel Skardu": {
    distance_km: 3.3,
    estimated_minutes: 4
  },
  "K2 Paradise Guest House": {
    distance_km: 2.2,
    estimated_minutes: 2
  },
  "Holiday Mountain Resort & Camping Site": {
    distance_km: 3.8,
    estimated_minutes: 5
  },
  "Mountain Lodge Skardu": {
    distance_km: 3.8,
    estimated_minutes: 5
  },
  "Mulberry Continental Hotel Skardu": {
    distance_km: 11.5,
    estimated_minutes: 10
  },
  "PC Legacy Skardu": {
    distance_km: 11.6,
    estimated_minutes: 10
  },
  "GB Lodges": {
    distance_km: 12.4,
    estimated_minutes: 11
  },
  "Bilafond Cottage": {
    distance_km: 7.2,
    estimated_minutes: 9
  },
  "North Hills Skardu": {
    distance_km: 1.3,
    estimated_minutes: 2
  },
  "Pinnacle Executive Lodges": {
    distance_km: 13,
    estimated_minutes: 11
  },
  "Safena Hotel Skardu": {
    distance_km: 15.7,
    estimated_minutes: 13
  },
  "Byarsa Hotel Skardu": {
    distance_km: 25.6,
    estimated_minutes: 21
  },
  "Dream Nest Resort Hotels Skardu": {
    distance_km: 34.2,
    estimated_minutes: 35
  },
  "Stream view guest house skardu": {
    distance_km: 1.8,
    estimated_minutes: 3
  },
  "Shangrila Resort Skardu": {
    distance_km: 26.5,
    estimated_minutes: 24
  },
  "Kachura Inn Skardu": {
    distance_km: 31.4,
    estimated_minutes: 28
  },
  "Tibet Hotel Kachura Skardu": {
    distance_km: 29.8,
    estimated_minutes: 25
  },
  "Hotel Mountain Lagoon Skardu": {
    distance_km: 26.9,
    estimated_minutes: 26
  },
  "Skardu River Resort": {
    distance_km: 27.1,
    estimated_minutes: 26
  },
  "Morning Resort": {
    distance_km: 30.3,
    estimated_minutes: 25
  },
  "Hotel Desert Bloom Skardu": {
    distance_km: 4.6,
    estimated_minutes: 5
  },
  "TheQue Skardu": {
    distance_km: 30.8,
    estimated_minutes: 26
  },
  "Singay Homestay Skardu": {
    distance_km: 1.8,
    estimated_minutes: 3
  },
  "Baltistan Crown Resort": {
    distance_km: 6.6,
    estimated_minutes: 7
  },
  "Fatah inn Guest House": {
    distance_km: 6.8,
    estimated_minutes: 8
  },
  "Kunhar": {
    distance_km: 6.5,
    estimated_minutes: 6
  },
  "Maltoro guest house": {
    distance_km: 6.5,
    estimated_minutes: 6
  },
  "Apex Hotels and Resorts Skardu": {
    distance_km: 6.6,
    estimated_minutes: 6
  },
  "Hotel virsa": {
    distance_km: 6.6,
    estimated_minutes: 6
  },
  "Elli's Luxus": {
    distance_km: 7.3,
    estimated_minutes: 7
  },
  "Skardu Gateway Hotel & Restaurant": {
    distance_km: 7.3,
    estimated_minutes: 7
  },
  "Polo Land Hotel by Skyline": {
    distance_km: 7.4,
    estimated_minutes: 7
  },
  "Baltistan White House Hotel": {
    distance_km: 7.7,
    estimated_minutes: 7
  },
  "The Pioneer Hotel": {
    distance_km: 7.8,
    estimated_minutes: 7
  },
  "Ramovi Guest House": {
    distance_km: 7.9,
    estimated_minutes: 7
  },
  "Friends & Family Guest House": {
    distance_km: 8.3,
    estimated_minutes: 7
  },
  "SKY LAKE GUEST HOUSE": {
    distance_km: 8.5,
    estimated_minutes: 8
  },
  "Skardu bliss hotel": {
    distance_km: 9.8,
    estimated_minutes: 9
  },
  "Comfort inn hotel": {
    distance_km: 9.8,
    estimated_minutes: 9
  },
  "Grand Hotel Skardu": {
    distance_km: 10.1,
    estimated_minutes: 9
  },
  "Baltistan inn hotel": {
    distance_km: 10.3,
    estimated_minutes: 9
  },
  "Grand view hotel": {
    distance_km: 10.3,
    estimated_minutes: 9
  },
  "Hotel walnut": {
    distance_km: 11.3,
    estimated_minutes: 10
  },
  "ABC hotel": {
    distance_km: 11.5,
    estimated_minutes: 10
  },
  "Lashari Resort Skardu": {
    distance_km: 11.6,
    estimated_minutes: 10
  },
  "Melody Hills Skardu": {
    distance_km: 11.9,
    estimated_minutes: 10
  },
  "NJM House Near Skardu Airport": {
    distance_km: 11.9,
    estimated_minutes: 10
  },
  "Le Yurt Skardu": {
    distance_km: 12.1,
    estimated_minutes: 10
  },
  "FearLess lodge": {
    distance_km: 13.3,
    estimated_minutes: 13
  },
  "Wamiq Skardu Resort": {
    distance_km: 16,
    estimated_minutes: 15
  },
  "Hosho Guest House": {
    distance_km: 14.7,
    estimated_minutes: 12
  },
  "Orgventure Resorts Skardu": {
    distance_km: 16,
    estimated_minutes: 13
  },
  "Green orchard skardu": {
    distance_km: 3.4,
    estimated_minutes: 4
  },
  "Mount View hotel skardu": {
    distance_km: 3.2,
    estimated_minutes: 4
  },
  "Laal Haveli": {
    distance_km: 3.1,
    estimated_minutes: 4
  },
  "Skardu view Guest house": {
    distance_km: 3,
    estimated_minutes: 4
  },
  "Baltistan Mountain Chalet Hotel": {
    distance_km: 2.9,
    estimated_minutes: 4
  },
  "Hotel Five star & restaurant skardu": {
    distance_km: 2.9,
    estimated_minutes: 4
  },
  "Tufail palace hotel & restaurant": {
    distance_km: 2.8,
    estimated_minutes: 4
  },
  "Indus motel": {
    distance_km: 2.6,
    estimated_minutes: 3
  },
  "Paradise hotel": {
    distance_km: 2.4,
    estimated_minutes: 3
  },
  "Hotel Red sun": {
    distance_km: 2.4,
    estimated_minutes: 3
  },
  "Haks hotel": {
    distance_km: 2.3,
    estimated_minutes: 3
  },
  "Hotel inn skardu": {
    distance_km: 2.3,
    estimated_minutes: 3
  },
  "Skardu embassy hotel": {
    distance_km: 2.2,
    estimated_minutes: 3
  },
  "Hotel Delight Skardu": {
    distance_km: 2.2,
    estimated_minutes: 3
  },
  "Ayan Hotel": {
    distance_km: 1.7,
    estimated_minutes: 2
  },
  "Hotel Highlander inn": {
    distance_km: 1.4,
    estimated_minutes: 2
  },
  "The North face inn hotel skardu": {
    distance_km: 1.6,
    estimated_minutes: 2
  },
  "The yak Hotel skardu": {
    distance_km: 1.6,
    estimated_minutes: 2
  },
  "Indus lodge skardu": {
    distance_km: 1.6,
    estimated_minutes: 2
  },
  "Stay inn hotel": {
    distance_km: 1.6,
    estimated_minutes: 2
  },
  "Eden Rock skardu": {
    distance_km: 1.7,
    estimated_minutes: 2
  },
  "Concordia Motel Baltistan": {
    distance_km: 1.9,
    estimated_minutes: 2
  },
  "Harriot Skardu": {
    distance_km: 2.4,
    estimated_minutes: 2
  },
  "Hotel PeakNest": {
    distance_km: 2.4,
    estimated_minutes: 3
  },
  "Royal Glaxy Hotel": {
    distance_km: 2.6,
    estimated_minutes: 3
  },
  "Sarfaranga view rock Guest house skardu": {
    distance_km: 2.4,
    estimated_minutes: 2
  },
  "Eat and Read Guesthouse skardu": {
    distance_km: 2.3,
    estimated_minutes: 2
  },
  "North Face explorers": {
    distance_km: 2.3,
    estimated_minutes: 2
  },
  "Holiday resort skardu": {
    distance_km: 2.3,
    estimated_minutes: 2
  },
  "Kallisto Resort": {
    distance_km: 2.2,
    estimated_minutes: 2
  },
  "Sagar hotel skardu": {
    distance_km: 2.5,
    estimated_minutes: 2
  },
  "Hotel Elite skardu": {
    distance_km: 2.2,
    estimated_minutes: 2
  },
  "SnowLand Resort": {
    distance_km: 3,
    estimated_minutes: 4
  },
  "Bismillah Guest House": {
    distance_km: 3.1,
    estimated_minutes: 4
  },
  "Hotel Yak sarai": {
    distance_km: 3.1,
    estimated_minutes: 4
  },
  "The North Palace": {
    distance_km: 3.1,
    estimated_minutes: 4
  },
  "Duqsa Family Guest House": {
    distance_km: 3.4,
    estimated_minutes: 4
  },
  "Wazir's villa": {
    distance_km: 3.4,
    estimated_minutes: 5
  },
  "Hotel Rewaaj": {
    distance_km: 3.2,
    estimated_minutes: 4
  },
  "Comfort Hotel & Huts skardu": {
    distance_km: 2.7,
    estimated_minutes: 3
  },
  "Zam Zam Guest House": {
    distance_km: 2.4,
    estimated_minutes: 3
  },
  "The Mountain Gypsy Resort": {
    distance_km: 2.5,
    estimated_minutes: 3
  },
  "Rigo Resort Skardu": {
    distance_km: 3.6,
    estimated_minutes: 5
  },
  "Arish Luxury Sites": {
    distance_km: 1.6,
    estimated_minutes: 3
  },
  "InterContinental Hotel": {
    distance_km: 1.2,
    estimated_minutes: 2
  },
  "Royal fort resort skardu": {
    distance_km: 1.3,
    estimated_minutes: 2
  },
  "Meer Stay and Dine skardu": {
    distance_km: 1.1,
    estimated_minutes: 2
  },
  "Dream Land Guest House": {
    distance_km: 1.7,
    estimated_minutes: 3
  },
  "Hotel GraceLand": {
    distance_km: 1.2,
    estimated_minutes: 2
  },
  "MOUNTAIN MAJESTY INN SKARDU": {
    distance_km: 1.6,
    estimated_minutes: 2
  },
  "Alnoor Lodges": {
    distance_km: 1.8,
    estimated_minutes: 2
  },
  "Jasper House": {
    distance_km: 2,
    estimated_minutes: 3
  },
  "The Himalayan Guest House": {
    distance_km: 2.1,
    estimated_minutes: 2
  },
  "Epoch Inn Guest House Skardu": {
    distance_km: 2.2,
    estimated_minutes: 3
  },
  "Mountaindale Guest House": {
    distance_km: 2.2,
    estimated_minutes: 3
  },
  "Al Jannah Guest House Skardu": {
    distance_km: 2.3,
    estimated_minutes: 3
  },
  "Biafo Resort Skardu": {
    distance_km: 2.3,
    estimated_minutes: 3
  },
  "Skardu Blossom Inn": {
    distance_km: 2.3,
    estimated_minutes: 3
  },
  "The Diamond Guest House Skardu": {
    distance_km: 2.5,
    estimated_minutes: 3
  },
  "Anarres | A Creative Residency": {
    distance_km: 2.9,
    estimated_minutes: 3
  },
  "Submit Embassy Hotel": {
    distance_km: 2.9,
    estimated_minutes: 3
  },
  "Alpine Abode Skardu": {
    distance_km: 3.3,
    estimated_minutes: 4
  },
  "Relax Inn Skardu": {
    distance_km: 3.3,
    estimated_minutes: 4
  },
  "Gumaan Resort Skardu": {
    distance_km: 3.4,
    estimated_minutes: 4
  },
  "Yuligo Resort Skardu": {
    distance_km: 3.7,
    estimated_minutes: 4
  },
  "Urban escape resort": {
    distance_km: 1.3,
    estimated_minutes: 2
  },
  "Mohsin Lodge Skardu": {
    distance_km: 1.4,
    estimated_minutes: 2
  },
  "Back To Home Lodging": {
    distance_km: 1.4,
    estimated_minutes: 2
  },
  "Royal Brangsa Guest House": {
    distance_km: 0.9,
    estimated_minutes: 2
  },
  "Wazir Guest House Skardu": {
    distance_km: 0.6,
    estimated_minutes: 1
  },
  "Golden Ibex Guest House": {
    distance_km: 0.5,
    estimated_minutes: 1
  },
  "Up Way Guest House": {
    distance_km: 0.7,
    estimated_minutes: 1
  },
  "Kunlun Peak Inn skardu": {
    distance_km: 1.2,
    estimated_minutes: 2
  },
  "Markhor Hotel": {
    distance_km: 1.4,
    estimated_minutes: 2
  },
  "Tibet hotel skardu": {
    distance_km: 1.7,
    estimated_minutes: 3
  },
  "Alpha Nomads House": {
    distance_km: 1.8,
    estimated_minutes: 3
  },
  "Dirleh Hotel": {
    distance_km: 2.6,
    estimated_minutes: 4
  },
  "North Home Skardu": {
    distance_km: 2.6,
    estimated_minutes: 4
  },
  "Valhalla Guest House": {
    distance_km: 1.9,
    estimated_minutes: 4
  },
  "Creek villa skardu": {
    distance_km: 2,
    estimated_minutes: 4
  },
  "Prince Tourist Hut": {
    distance_km: 2.3,
    estimated_minutes: 4
  },
  "Mountain House": {
    distance_km: 2.4,
    estimated_minutes: 4
  },
  "Reechan Resort House": {
    distance_km: 2.1,
    estimated_minutes: 3
  },
  "Himalayan Guest House Hassan colony": {
    distance_km: 2.1,
    estimated_minutes: 3
  },
  "Jasmine Skardu": {
    distance_km: 2.2,
    estimated_minutes: 3
  },
  "Mountain Face Skardu": {
    distance_km: 2.3,
    estimated_minutes: 4
  },
  "Four Seasons Bed and Breakfast": {
    distance_km: 2.2,
    estimated_minutes: 3
  },
  "Flora Inn skardu": {
    distance_km: 2.2,
    estimated_minutes: 3
  },
  "Broadpeak Resort skardu": {
    distance_km: 2.3,
    estimated_minutes: 3
  },
  "Chinar Residency": {
    distance_km: 2.8,
    estimated_minutes: 3
  },
  "Buddha Rock Guest House Skardu": {
    distance_km: 2.9,
    estimated_minutes: 3
  },
  "Buddha view Resort skardu": {
    distance_km: 2.9,
    estimated_minutes: 4
  },
  "Moonal Residency": {
    distance_km: 3.1,
    estimated_minutes: 4
  },
  "Skarchan Resort skardu": {
    distance_km: 3.2,
    estimated_minutes: 4
  },
  "ZAGO Guest House": {
    distance_km: 1.8,
    estimated_minutes: 3
  },
  "Skardu Blossom Guest House": {
    distance_km: 1.8,
    estimated_minutes: 3
  },
  "Harpo Resorts": {
    distance_km: 1.8,
    estimated_minutes: 3
  },
  "Baltistan Continental Hotel skardu": {
    distance_km: 1.1,
    estimated_minutes: 2
  },
  "Al Abbas Guest House": {
    distance_km: 1.1,
    estimated_minutes: 1
  },
  "Apricot Spring Resort Skardu": {
    distance_km: 1,
    estimated_minutes: 1
  },
  "Executive Guest House Skardu": {
    distance_km: 1,
    estimated_minutes: 1
  },
  "Hotel Bloom Hills,Skardu": {
    distance_km: 2.7,
    estimated_minutes: 3
  },
  "Siachen Stay&Tours": {
    distance_km: 2.6,
    estimated_minutes: 3
  },
  "Mountain Guest House and Desi Restaurant": {
    distance_km: 2.4,
    estimated_minutes: 3
  },
  "Decent Baltistan guest house": {
    distance_km: 2.3,
    estimated_minutes: 3
  },
  "Baltistan Village Guest House": {
    distance_km: 2.2,
    estimated_minutes: 3
  },
  "Bareen": {
    distance_km: 2.2,
    estimated_minutes: 3
  },
  "SUMMIT GUEST HOUSE": {
    distance_km: 2.1,
    estimated_minutes: 3
  },
  "Serene Baltistan Hotel": {
    distance_km: 2.1,
    estimated_minutes: 3
  },
  "Alpha Hotel & Restaurant": {
    distance_km: 1.7,
    estimated_minutes: 2
  },
  "Saani Rooms": {
    distance_km: 1.7,
    estimated_minutes: 2
  },
  "Ridakh Inn": {
    distance_km: 1.4,
    estimated_minutes: 2
  },
  "Clifton Spachan Hotel": {
    distance_km: 1.3,
    estimated_minutes: 2
  },
  "K2 Tourism Guest House": {
    distance_km: 1.3,
    estimated_minutes: 2
  },
  "Heaven's Adventure.pk": {
    distance_km: 3.6,
    estimated_minutes: 5
  },
  "Desert one hotel and restaurant skardu": {
    distance_km: 3.4,
    estimated_minutes: 4
  },
  "Yazgar Residency Skardu": {
    distance_km: 3.5,
    estimated_minutes: 4
  },
  "The Next Home Skardu": {
    distance_km: 3.5,
    estimated_minutes: 4
  },
  "Heaven Hotel Skardu": {
    distance_km: 3.5,
    estimated_minutes: 4
  },
  "Skardu Midway hotel": {
    distance_km: 4,
    estimated_minutes: 4
  },
  "Sarfaranga Reaidency": {
    distance_km: 4.4,
    estimated_minutes: 5
  },
  "Skengoo Inn Hotel": {
    distance_km: 4.5,
    estimated_minutes: 5
  },
  "Alnoor Starlet Hotel": {
    distance_km: 4.7,
    estimated_minutes: 5
  },
  "Top Hill Resort": {
    distance_km: 5.3,
    estimated_minutes: 6
  },
  "Royal Resort Skardu": {
    distance_km: 4.9,
    estimated_minutes: 5
  },
  "Signature Skardu Hotel": {
    distance_km: 5,
    estimated_minutes: 5
  },
  "Shama Resort Skardu": {
    distance_km: 5,
    estimated_minutes: 5
  },
  "Pearl of Skardu Resort": {
    distance_km: 5,
    estimated_minutes: 5
  },
  "Crystal Mountain Lodge": {
    distance_km: 5.2,
    estimated_minutes: 5
  },
  "H A K S RESSORT": {
    distance_km: 5.8,
    estimated_minutes: 6
  },
  "Shaheen Guest House Skardu": {
    distance_km: 6.1,
    estimated_minutes: 6
  },
  "Nirvana Resort Skardu": {
    distance_km: 6.4,
    estimated_minutes: 6
  }

  },
    "Domino's Pizza Skardu": {
    "Sundus Skilgrong": { distance_km: 1.9, estimated_minutes: 5 },
    "Sundus Gond": { distance_km: 2.7, estimated_minutes: 8 },
    "Katpana": { distance_km: 5.2, estimated_minutes: 14 },
    "Khargrong": { distance_km: 2.8, estimated_minutes: 11 },
    "Hasnain Nagar": { distance_km: 2.2, estimated_minutes: 8 },
    "Alamdar Chowk": { distance_km: 1.9, estimated_minutes: 7 },
    "Hassan Colony": { distance_km: 2.9, estimated_minutes: 10 },
    "Hassan Colony Pine": { distance_km: 2.7, estimated_minutes: 10 },
    "Shinkhani Gond": { distance_km: 2.3, estimated_minutes: 9 },
    "Oldiing Nansoq": { distance_km: 4.5, estimated_minutes: 14 },
    "RHQ Road Harriot Hotel": { distance_km: 3.1, estimated_minutes: 11 },
    "Newranga Near Agha Ali House": { distance_km: 3.7, estimated_minutes: 8 },
    "Newranga ": { distance_km: 2.8, estimated_minutes: 8 },
    "Kushmarah": { distance_km: 4.8, estimated_minutes: 11 },
    "Sherthang Girls High School": { distance_km: 3.6, estimated_minutes: 13 },
    "Marfie Colony": { distance_km: 3.6, estimated_minutes: 13 },
    "Chumik": { distance_km: 1.8, estimated_minutes: 9 },
    "Gamba Skardu": { distance_km: 11, estimated_minutes: 18 },
    "United Line, Hassan Colony": { distance_km: 2.5, estimated_minutes: 9 },
    "Muhib Road Khargrong": { distance_km: 2.3, estimated_minutes: 10 },
    "GB Chief Court Skardu Registry Skardu": { distance_km: 3.9, estimated_minutes: 10 },
    "Shaheen Public School Skardu": { distance_km: 4.6, estimated_minutes: 12 },
    "Mehdi Colony Skardu": { distance_km: 3.6, estimated_minutes: 15 },
    "Agha Hadi Chowk": { distance_km: 2.7, estimated_minutes: 11 },
    "Hussainabad": { distance_km: 8, estimated_minutes: 23 },
    "Himalaya Hotel Hussainabad, Skardu": { distance_km: 8, estimated_minutes: 23 },
    "Hameed Garh": { distance_km: 2.6, estimated_minutes: 11 },
    "Shaheed colony": { distance_km: 1.4, estimated_minutes: 4 },
    "Tufail colony": { distance_km: 0.65, estimated_minutes: 2 },
    "Jafferi Mohallah": { distance_km: 0.5, estimated_minutes: 2 },
    "Chogo Matamsara": { distance_km: 1.4, estimated_minutes: 8 },
    "Nagulispang Road": { distance_km: 1.5, estimated_minutes: 5 },
    "Eidgah,Sundus ": { distance_km: 1.5, estimated_minutes: 5 },
    "Sukemaidan ": { distance_km: 1.2, estimated_minutes: 5 },
    "Hargissa shakthang": { distance_km: 2.9, estimated_minutes: 11 },
    "Bhutto Bazar Skardu": { distance_km: 0.8, estimated_minutes: 3 },
    "Devision": { distance_km: 4.2, estimated_minutes: 14 },
    "Abbas Town": { distance_km: 3.6, estimated_minutes: 12 },
    "Musa Line": { distance_km: 3.1, estimated_minutes: 10 },
    "Clifton pull": { distance_km: 2.3, estimated_minutes: 8 },
    "Sheikh ijaz masjid": { distance_km: 1.5, estimated_minutes: 6 },
    "Khila Toq Road": { distance_km: 3.4, estimated_minutes: 14 },
    "Public school area": { distance_km: 4.4, estimated_minutes: 14 },
    "Xhathang": { distance_km: 4.5, estimated_minutes: 15 },
    "Brolmo colony sundus": { distance_km: 2.1, estimated_minutes: 8 },
    "Ghazi Colony sundus": { distance_km: 2.3, estimated_minutes: 7 },
    "Hyderabad Gangupi Area": { distance_km: 1.9, estimated_minutes: 8 },
    "LT Col ihsan Ali rd": { distance_km: 2.2, estimated_minutes: 8 },
    "Astana skardu": { distance_km: 3.8, estimated_minutes: 10 },
    "Bintul Huda Girls model school": { distance_km: 4.6, estimated_minutes: 11 },
    "Brolmo colony astana": { distance_km: 3.5, estimated_minutes: 9 },
    "Raees mohalla Haji Gam": { distance_km: 3.9, estimated_minutes: 14 },
    "Haji Gam": { distance_km: 3, estimated_minutes: 10 },
    "Gulshan e Ali skardu": { distance_km: 3.1, estimated_minutes: 13 },
    "Jamia masjid road": { distance_km: 1.4, estimated_minutes: 7 },
    "Gayool skardu": { distance_km: 7.4, estimated_minutes: 16 },
    "Toqrangah Skardu": { distance_km: 2.4, estimated_minutes: 7 },
    "Maqponsar skardu": { distance_km: 1.8, estimated_minutes: 5 },
    "Newranga road": { distance_km: 3.1, estimated_minutes: 8 },
    "Quaidabad": { distance_km: 3.2, estimated_minutes: 7 },
    "Kharpocho Road": { distance_km: 1.3, estimated_minutes: 7 },
    "Patwal": { distance_km: 3.1, estimated_minutes: 13 },
    "Olding": { distance_km: 4.8, estimated_minutes: 15 },
    "Karasmathang": { distance_km: 3, estimated_minutes: 12 },
    "Kachura": { distance_km: 27.2, estimated_minutes: 48 },
    "3 talwar chowk": { distance_km: 4.6, estimated_minutes: 16 },
    "Teen talwar chowk": { distance_km: 4.6, estimated_minutes: 16 },
    "Sahara Complex": { distance_km: 4.1, estimated_minutes: 15 },
    "Ali plaza": { distance_km: 0.9, estimated_minutes: 4 },
    "Radio Pakistan Chowk": { distance_km: 2.5, estimated_minutes: 6 },
    "Manthal": { distance_km: 6.3, estimated_minutes: 19 },
    "Rus Olive Lodge": {
      distance_km: 3.1,
      estimated_minutes: 12
    },
    "Hargisa Resort Skardu": {
      distance_km: 7.7,
      estimated_minutes: 28
    },
    "LOKAL Rooms x Skardu (Katpana Retreat)": {
      distance_km: 4.6,
      estimated_minutes: 19
    },
    "Green Orchard Skardu": {
      distance_km: 3.1,
      estimated_minutes: 10
    },
    "Oasis Resort Katpana Skardu": {
      distance_km: 4.7,
      estimated_minutes: 18
    },
    "Avari Xpress Skardu Hotel": {
      distance_km: 1.9,
      estimated_minutes: 25
    },
    "Hotel Mashabrum Skardu": {
      distance_km: 3.3,
      estimated_minutes: 13
    },
    "Skardu Luxus Hotel": {
      distance_km: 0.9,
      estimated_minutes: 4
    },
    "The Mountain Cottage Skardu": {
      distance_km: 4.8,
      estimated_minutes: 16
    },
    "Summit Hotel Skardu": {
      distance_km: 0.5,
      estimated_minutes: 2
    },
    "Skardu Saraye Hotel & Resort": {
      distance_km: 8.0,
      estimated_minutes: 31
    },
    "Baltistan Tourist Cottage - Skardu": {
      distance_km: 4.7,
      estimated_minutes: 18
    },
    "Glamp Pakistan": {
      distance_km: 8.5,
      estimated_minutes: 31
    },
    "Montagna Pods": {
      distance_km: 2.4,
      estimated_minutes: 9
    },
    "Hotel Luxy Skardu": {
      distance_km: 6.3,
      estimated_minutes: 24
    },
    "Baltistan Fort, Skardu Resort Hotel": {
      distance_km: 6.1,
      estimated_minutes: 22
    },
    "Hotel Skardu1": {
      distance_km: 0.8,
      estimated_minutes: 2
    },
    "Baltistan Resort": {
      distance_km: 4.7,
      estimated_minutes: 19
    },
    "Skardu Royal Hotel & Restaurant": {
      distance_km: 5.8,
      estimated_minutes: 23
    },
    "Sharif Cottages and Hotel Skardu": {
      distance_km: 4.8,
      estimated_minutes: 16
    },
    "Base Camp Katpana": {
      distance_km: 2.3,
      estimated_minutes: 10
    },
    "Hotel Dewan-e-Khas": {
      distance_km: 4.7,
      estimated_minutes: 19
    },
    "Legend Hotel Skardu": {
      distance_km: 7.5,
      estimated_minutes: 27
    },
    "Northlanders Guest House Skardu": {
      distance_km: 2.4,
      estimated_minutes: 9
    },
    "Hotel Travellodge Skardu": {
      distance_km: 7.6,
      estimated_minutes: 26
    },
    "Qayam Skardu": {
      distance_km: 6.2,
      estimated_minutes: 23
    },
    "Rafsal A Countryside Cottage": {
      distance_km: 5.0,
      estimated_minutes: 17
    },
    "Kentish Lodge Skardu": {
      distance_km: 1.3,
      estimated_minutes: 6
    },
    "Skardu Villas": {
      distance_km: 8.3,
      estimated_minutes: 30
    },
    "The Cherry Courtyard": {
      distance_km: 2.8,
      estimated_minutes: 9
    },
    "Ringchan Guest House & Restaurant": {
      distance_km: 3.0,
      estimated_minutes: 12
    },
    "Skardu Lodge": {
      distance_km: 1.9,
      estimated_minutes: 6
    },
    "Karakoram Nest": {
      distance_km: 4.4,
      estimated_minutes: 17
    },
    "Dynasty Skardu": {
      distance_km: 9.2,
      estimated_minutes: 33
    },
    "Sehrish Guest House Skardu": {
      distance_km: 7.8,
      estimated_minutes: 30
    },
    "PTDC Motel Skardu": {
      distance_km: 7.6,
      estimated_minutes: 27
    },
    "Hotel Reego Skardu": {
      distance_km: 4.5,
      estimated_minutes: 15
    },
    "Lavender Cottage & Guest House": {
      distance_km: 6.1,
      estimated_minutes: 23
    },
    "Rock View Skardu": {
      distance_km: 7.2,
      estimated_minutes: 26
    },
    "Dream Guest House Haji Gam Chowk": {
      distance_km: 3.4,
      estimated_minutes: 14
    },
    "Indus Lodges Skardu": {
      distance_km: 2.9,
      estimated_minutes: 12
    },
    "Pacific Guest House Skardu": {
      distance_km: 3.2,
      estimated_minutes: 11
    },
    "Skardu View Point Hotel and Huts": {
      distance_km: 0.5,
      estimated_minutes: 3
    },
    "Khar Hotel Skardu": {
      distance_km: 6.1,
      estimated_minutes: 21
    },
    "HIKK Inn Skardu": {
      distance_km: 7.0, estimated_minutes: 26
    },
    "Taaj Residence Skardu": {
      distance_km: 8.9,
      estimated_minutes: 32
    },
    "Homeland Guest House Skardu": {
      distance_km: 0.4,
      estimated_minutes: 3
    },
    "Sultan Guest House Skardu": {
      distance_km: 5.4,
      estimated_minutes: 18
    },
    "The Hill Town Resort": {
      distance_km: 9.4,
      estimated_minutes: 35
    },
    "AlJannah Guest House Skardu": {
      distance_km: 1.8,
      estimated_minutes: 7
    },
    "Deosai Gateway Inn Skardu": {
      distance_km: 2.0,
      estimated_minutes: 7
    },
    "Skardu Arcadian Resort": {
      distance_km: 9.4,
      estimated_minutes: 35
    },
    "Areena Hotel Skardu": {
      distance_km: 5.3,
      estimated_minutes: 18
    },
    "Skardu Farmhouse for stay": {
      distance_km: 8.3,
      estimated_minutes: 29
    },
    "Adventure Sarai Hotel Skardu": {
      distance_km: 3.7,
      estimated_minutes: 15
    },
    "Maple Resort": {
      distance_km: 3.3,
      estimated_minutes: 14
    },
    "Candela Resorts": {
      distance_km: 5.4,
      estimated_minutes: 19
    },
    "Hispar Hotel Skardu": {
      distance_km: 5.2,
      estimated_minutes: 19
    },
    "K2 Paradise Guest House": {
      distance_km: 5.9,
      estimated_minutes: 23
    },
    "Holiday Mountain Resort & Camping Site": {
      distance_km: 4.1,
      estimated_minutes: 14
    },
    "Mountain Lodge Skardu": {
      distance_km: 5.6,
      estimated_minutes: 21
    },
    "Mulberry Continental Hotel Skardu": {
      distance_km: 8.9,
      estimated_minutes: 31
    },
    "PC Legacy Skardu": {
      distance_km: 6.9,
      estimated_minutes: 25
    },
    "GB Lodges": {
      distance_km: 7.5,
      estimated_minutes: 26
    },
    "Bilafond Cottage": {
      distance_km: 4.0,
      estimated_minutes: 15
    },
    "North Hills Skardu": {
      distance_km: 7.5,
      estimated_minutes: 27
    },
    "Pinnacle Executive Lodges": {
      distance_km: 5.1,
      estimated_minutes: 19
    },
    "Safena Hotel Skardu": {
      distance_km: 2.4,
      estimated_minutes: 9
    },
    "Byarsa Hotel Skardu": {
      distance_km: 5.9,
      estimated_minutes: 22
    },
    "Dream Nest Resort Hotels Skardu": {
      distance_km: 2.3,
      estimated_minutes: 8
    },
    "Stream view guest house skardu": {
      distance_km: 2.4,
      estimated_minutes: 10
    },
    "Shangrila Resort Skardu": {
      distance_km: 5.2,
      estimated_minutes: 21
    },
    "Kachura Inn Skardu": {
      distance_km: 5.5,
      estimated_minutes: 20
    },
    "Tibet Hotel Kachura Skardu": {
      distance_km: 6.7,
      estimated_minutes: 23
    },
    "Hotel Mountain Lagoon Skardu": {
      distance_km: 1.8,
      estimated_minutes: 7
    },
    "Skardu River Resort": {
      distance_km: 3.8,
      estimated_minutes: 15
    },
    "Morning Resort": {
      distance_km: 7.4,
      estimated_minutes: 27
    },
    "Hotel Desert Bloom Skardu": {
      distance_km: 2.7,
      estimated_minutes: 11
    },
    "TheQue Skardu": {
      distance_km: 7.2,
      estimated_minutes: 26
    },
    "Singay Homestay Skardu": {
      distance_km: 6.2,
      estimated_minutes: 24
    },
    "Baltistan Crown Resort": {
      distance_km: 5.6,
      estimated_minutes: 22
    },
    "Fatah inn Guest House": {
      distance_km: 3.8,
      estimated_minutes: 13
    },
    "Kunhar": {
      distance_km: 7.2,
      estimated_minutes: 25
    },
    "Maltoro guest house": {
      distance_km: 8.6,
      estimated_minutes: 32
    },
    "Apex Hotels and Resorts Skardu": {
      distance_km: 2.3,
      estimated_minutes: 8
    },
    "Hotel virsa": {
      distance_km: 4.1,
      estimated_minutes: 17
    },
    "Elli's Luxus": {
      distance_km: 8.3,
      estimated_minutes: 32
    },
    "Skardu Gateway Hotel & Restaurant": {
      distance_km: 7.3,
      estimated_minutes: 28
    },
    "Polo Land Hotel by Skyline": {
      distance_km: 9.2,
      estimated_minutes: 33
    },
    "Baltistan White House Hotel": {
      distance_km: 8.8,
      estimated_minutes: 34
    },
    "The Pioneer Hotel": {
      distance_km: 8.1,
      estimated_minutes: 30
    },
    "Ramovi Guest House": {
      distance_km: 8.0,
      estimated_minutes: 29
    },
    "Friends & Family Guest House": {
      distance_km: 4.3,
      estimated_minutes: 15
    },
    "SKY LAKE GUEST HOUSE": {
      distance_km: 7.1,
      estimated_minutes: 26
    },
    "Skardu bliss hotel": {
      distance_km: 7.5,
      estimated_minutes: 29
    },
    "Comfort inn hotel": {
      distance_km: 9.1,
      estimated_minutes: 33
    },
    "Grand Hotel Skardu": {
      distance_km: 2.3,
      estimated_minutes: 7
    },
    "Baltistan inn hotel": {
      distance_km: 8.3,
      estimated_minutes: 29
    },
    "Grand view hotel": {
      distance_km: 1.0,
      estimated_minutes: 3
    },
    "Hotel walnut": {
      distance_km: 8.6,
      estimated_minutes: 32
    },
    "ABC hotel": {
      distance_km: 4.7,
      estimated_minutes: 18
    },
    "Lashari Resort Skardu": {
      distance_km: 8.5,
      estimated_minutes: 32
    },
    "Melody Hills Skardu": {
      distance_km: 5.7,
      estimated_minutes: 22
    },
    "NJM House Near Skardu Airport": {
      distance_km: 4.4,
      estimated_minutes: 15
    },
    "Le Yurt Skardu": {
      distance_km: 5.6,
      estimated_minutes: 19
    },
    "FearLess lodge": {
      distance_km: 6.6,
      estimated_minutes: 24
    },
    "Wamiq Skardu Resort": {
      distance_km: 8.4,
      estimated_minutes: 31
    },
    "Hosho Guest House": {
      distance_km: 8.6,
      estimated_minutes: 33
    },
    "Orgventure Resorts Skardu": {
      distance_km: 6.9,
      estimated_minutes: 26
    },
    "Green orchard skardu": {
      distance_km: 8.1,
      estimated_minutes: 29
    },
    "Mount View hotel skardu": {
      distance_km: 7.0,
      estimated_minutes: 26
    },
    "Laal Haveli": {
      distance_km: 8.7,
      estimated_minutes: 33
    },
    "Skardu view Guest house": {
      distance_km: 0.8,
      estimated_minutes: 2
    },
    "Baltistan Mountain Chalet Hotel": {
      distance_km: 0.6,
      estimated_minutes: 4
    },
    "Hotel Five star & restaurant skardu": {
      distance_km: 2.5,
      estimated_minutes: 10
    },
    "Tufail palace hotel & restaurant": {
      distance_km: 1.0,
      estimated_minutes: 6
    },
    "Indus motel": {
      distance_km: 2.7,
      estimated_minutes: 11
    },
    "Paradise hotel": {
      distance_km: 1.3,
      estimated_minutes: 5
    },
    "Hotel Red sun": {
      distance_km: 4.3,
      estimated_minutes: 14
    },
    "Haks hotel": {
      distance_km: 6.2,
      estimated_minutes: 23
    },
    "Hotel inn skardu": {
      distance_km: 7.8,
      estimated_minutes: 29
    },
    "Skardu embassy hotel": {
      distance_km: 6.4,
      estimated_minutes: 22
    },
    "Hotel Delight Skardu": {
      distance_km: 3.0,
      estimated_minutes: 10
    },
    "Ayan Hotel": {
      distance_km: 4.3,
      estimated_minutes: 17
    },
    "Hotel Highlander inn": {
      distance_km: 2.5,
      estimated_minutes: 11
    },
    "The North face inn hotel skardu": {
      distance_km: 6.2,
      estimated_minutes: 24
    },
    "The yak Hotel skardu": {
      distance_km: 3.8,
      estimated_minutes: 14
    },
    "Indus lodge skardu": {
      distance_km: 1.4,
      estimated_minutes: 6
    },
    "Stay inn hotel": {
      distance_km: 8.2,
      estimated_minutes: 30
    },
    "Eden Rock skardu": {
      distance_km: 3.9,
      estimated_minutes: 14
    },
    "Concordia Motel Baltistan": {
      distance_km: 5.2,
      estimated_minutes: 18
    },
    "Harriot Skardu": {
      distance_km: 1.9,
      estimated_minutes: 9
    },
    "Hotel PeakNest": {
      distance_km: 5.8,
      estimated_minutes: 22
    },
    "Royal Glaxy Hotel": {
      distance_km: 4.4,
      estimated_minutes: 18
    },
    "Sarfaranga view rock Guest house skardu": {
      distance_km: 4.7,
      estimated_minutes: 19
    },
    "Eat and Read Guesthouse skardu": {
      distance_km: 3.8,
      estimated_minutes: 13
    },
    "North Face explorers": {
      distance_km: 4.8,
      estimated_minutes: 16
    },
    "Holiday resort skardu": {
      distance_km: 6.8,
      estimated_minutes: 23
    },
    "Kallisto Resort": {
      distance_km: 7.8,
      estimated_minutes: 28
    },
    "Sagar hotel skardu": {
      distance_km: 9.5,
      estimated_minutes: 36
    },
    "Hotel Elite skardu": {
      distance_km: 9.5,
      estimated_minutes: 35
    },
    "SnowLand Resort": {
      distance_km: 4.6,
      estimated_minutes: 17
    },
    "Bismillah Guest House": {
      distance_km: 9.4,
      estimated_minutes: 35
    },
    "Hotel Yak sarai": {
      distance_km: 3.2,
      estimated_minutes: 13
    },
    "The North Palace": {
      distance_km: 2.7,
      estimated_minutes: 12
    },
    "Duqsa Family Guest House": {
      distance_km: 5.5,
      estimated_minutes: 20
    },
    "Wazir's villa": {
      distance_km: 1.3,
      estimated_minutes: 5
    },
    "Hotel Rewaaj": {
      distance_km: 0.6,
      estimated_minutes: 2
    },
    "Comfort Hotel & Huts skardu": {
      distance_km: 5.5,
      estimated_minutes: 19
    },
    "Zam Zam Guest House": {
      distance_km: 9.5,
      estimated_minutes: 36
    },
    "The Mountain Gypsy Resort": {
      distance_km: 1.3,
      estimated_minutes: 4
    },
    "Rigo Resort Skardu": {
      distance_km: 7.8,
      estimated_minutes: 29
    },
    "Arish Luxury Sites": {
      distance_km: 3.3,
      estimated_minutes: 13
    },
    "InterContinental Hotel": {
      distance_km: 6.8,
      estimated_minutes: 23
    },
    "Royal fort resort skardu": {
      distance_km: 4.3,
      estimated_minutes: 14
    },
    "Meer Stay and Dine skardu": {
      distance_km: 1.7,
      estimated_minutes: 7
    },
    "Dream Land Guest House": {
      distance_km: 1.6,
      estimated_minutes: 5
    },
    "Hotel GraceLand": {
      distance_km: 5.6,
      estimated_minutes: 21
    },
    "MOUNTAIN MAJESTY INN SKARDU": {
      distance_km: 3.6,
      estimated_minutes: 14
    },
    "Alnoor Lodges": {
      distance_km: 9.1,
      estimated_minutes: 34
    },
    "Jasper House": {
      distance_km: 8.4,
      estimated_minutes: 29
    },
    "The Himalayan Guest House": {
      distance_km: 6.6,
      estimated_minutes: 24
    },
    "Epoch Inn Guest House Skardu": {
      distance_km: 9.2,
      estimated_minutes: 33
    },
    "Mountaindale Guest House": {
      distance_km: 4.3,
      estimated_minutes: 17
    },
    "Al Jannah Guest House Skardu": {
      distance_km: 7.8,
      estimated_minutes: 28
    },
    "Biafo Resort Skardu": {
      distance_km: 8.5,
      estimated_minutes: 31
    },
    "Skardu Blossom Inn": {
      distance_km: 8.6,
      estimated_minutes: 32
    },
    "The Diamond Guest House Skardu": {
      distance_km: 6.0,
      estimated_minutes: 22
    },
    "Anarres | A Creative Residency": {
      distance_km: 6.5,
      estimated_minutes: 23
    },
    "Submit Embassy Hotel": {
      distance_km: 8.2,
      estimated_minutes: 29
    },
    "Alpine Abode Skardu": {
      distance_km: 9.4,
      estimated_minutes: 36
    },
    "Relax Inn Skardu": {
      distance_km: 8.3,
      estimated_minutes: 32
    },
    "Gumaan Resort Skardu": {
      distance_km: 2.0,
      estimated_minutes: 7
    },
    "Yuligo Resort Skardu": {
      distance_km: 5.3,
      estimated_minutes: 18
    },
    "Urban escape resort": {
      distance_km: 2.4,
      estimated_minutes: 8
    },
    "Mohsin Lodge Skardu": {
      distance_km: 4.3,
      estimated_minutes: 14
    },
    "Back To Home Lodging": {
      distance_km: 3.0,
      estimated_minutes: 12
    },
    "Royal Brangsa Guest House": {
      distance_km: 0.9,
      estimated_minutes: 3
    },
    "Wazir Guest House Skardu": {
      distance_km: 9.3,
      estimated_minutes: 35
    },
    "Golden Ibex Guest House": {
      distance_km: 7.7,
      estimated_minutes: 29
    },
    "Up Way Guest House": {
      distance_km: 8.7,
      estimated_minutes: 31
    },
    "Kunlun Peak Inn skardu": {
      distance_km: 5.5,
      estimated_minutes: 19
    },
    "Markhor Hotel": {
      distance_km: 7.3,
      estimated_minutes: 25
    },
    "Tibet hotel skardu": {
      distance_km: 4.9,
      estimated_minutes: 20
    },
    "Alpha Nomads House": {
      distance_km: 8.1,
      estimated_minutes: 28
    },
    "Dirleh Hotel": {
      distance_km: 9.2,
      estimated_minutes: 34
    },
    "North Home Skardu": {
      distance_km: 3.6,
      estimated_minutes: 12
    },
    "Valhalla Guest House": {
      distance_km: 5.3,
      estimated_minutes: 21
    },
    "Creek villa skardu": {
      distance_km: 3.0,
      estimated_minutes: 12
    },
    "Prince Tourist Hut": {
      distance_km: 5.3,
      estimated_minutes: 20
    },
    "Mountain House": {
      distance_km: 1.9,
      estimated_minutes: 8
    },
    "Reechan Resort House": {
      distance_km: 6.7,
      estimated_minutes: 23
    },
    "Himalayan Guest House Hassan colony": {
      distance_km: 3.2,
      estimated_minutes: 12
    },
    "Jasmine Skardu": {
      distance_km: 4.8,
      estimated_minutes: 19
    },
    "Mountain Face Skardu": {
      distance_km: 5.9,
      estimated_minutes: 20
    },
    "Four Seasons Bed and Breakfast": {
      distance_km: 5.8,
      estimated_minutes: 23
    },
    "Flora Inn skardu": {
      distance_km: 4.9,
      estimated_minutes: 18
    },
    "Broadpeak Resort skardu": {
      distance_km: 1.0,
      estimated_minutes: 6
    },
    "Chinar Residency": {
      distance_km: 1.2,
      estimated_minutes: 4
    },
    "Buddha Rock Guest House Skardu": {
      distance_km: 9.1,
      estimated_minutes: 32
    },
    "Buddha view Resort skardu": {
      distance_km: 4.8,
      estimated_minutes: 17
    },
    "Moonal Residency": {
      distance_km: 6.8,
      estimated_minutes: 23
    },
    "Skarchan Resort skardu": {
      distance_km: 7.8,
      estimated_minutes: 30
    },
    "ZAGO Guest House": {
      distance_km: 8.5,
      estimated_minutes: 32
    },
    "Skardu Blossom Guest House": {
      distance_km: 4.8,
      estimated_minutes: 18
    },
    "Harpo Resorts": {
      distance_km: 5.8,
      estimated_minutes: 23
    },
    "Baltistan Continental Hotel skardu": {
      distance_km: 9.1,
      estimated_minutes: 32
    },
    "Al Abbas Guest House": {
      distance_km: 6.9, estimated_minutes: 25
    },
    "Apricot Spring Resort Skardu": {
      distance_km: 5.2,
      estimated_minutes: 21
    },
    "Executive Guest House Skardu": {
      distance_km: 7.8,
      estimated_minutes: 29
    },
    "Hotel Bloom Hills,Skardu": {
      distance_km: 0.5,
      estimated_minutes: 4
    },
    "Siachen Stay&Tours": {
      distance_km: 7.6,
      estimated_minutes: 27
    },
    "Mountain Guest House and Desi Restaurant": {
      distance_km: 3.2,
      estimated_minutes: 11
    },
    "Decent Baltistan guest house": {
      distance_km: 0.9,
      estimated_minutes: 2
    },
    "Baltistan Village Guest House": {
      distance_km: 8.3,
      estimated_minutes: 31
    },
    "Bareen": {
      distance_km: 5.2,
      estimated_minutes: 20
    },
    "SUMMIT GUEST HOUSE": {
      distance_km: 3.8,
      estimated_minutes: 14
    },
    "Serene Baltistan Hotel": {
      distance_km: 1.2,
      estimated_minutes: 4
    },
    "Alpha Hotel & Restaurant": {
      distance_km: 3.0,
      estimated_minutes: 10
    },
    "Saani Rooms": {
      distance_km: 3.7,
      estimated_minutes: 14
    },
    "Ridakh Inn": {
      distance_km: 5.0,
      estimated_minutes: 19
    },
    "Clifton Spachan Hotel": {
      distance_km: 1.5,
      estimated_minutes: 6
    },
    "K2 Tourism Guest House": {
      distance_km: 4.6,
      estimated_minutes: 16
    },
    "Heaven's Adventure.pk": {
      distance_km: 7.9,
      estimated_minutes: 29
    },
    "Desert one hotel and restaurant skardu": {
      distance_km: 3.0,
      estimated_minutes: 10
    },
    "Yazgar Residency Skardu": {
      distance_km: 3.9,
      estimated_minutes: 13
    },
    "The Next Home Skardu": {
      distance_km: 3.1,
      estimated_minutes: 11
    },
    "Heaven Hotel Skardu": {
      distance_km: 2.6,
      estimated_minutes: 9
    },
    "Skardu Midway hotel": {
      distance_km: 8.2,
      estimated_minutes: 32
    },
    "Sarfaranga Reaidency": {
      distance_km: 7.6,
      estimated_minutes: 26
    },
    "Skengoo Inn Hotel": {
      distance_km: 7.0,
      estimated_minutes: 24
    },
    "Alnoor Starlet Hotel": {
      distance_km: 5.2,
      estimated_minutes: 21
    },
    "Top Hill Resort": {
      distance_km: 4.9,
      estimated_minutes: 18
    },
    "Royal Resort Skardu": {
      distance_km: 8.3,
      estimated_minutes: 32
    },
    "Signature Skardu Hotel": {
      distance_km: 8.6,
      estimated_minutes: 32
    },
    "Shama Resort Skardu": {
      distance_km: 5.7,
      estimated_minutes: 20
    },
    "Pearl of Skardu Resort": {
      distance_km: 3.8,
      estimated_minutes: 14
    },
    "Crystal Mountain Lodge": {
      distance_km: 3.9,
      estimated_minutes: 13
    },
    "H A K S RESSORT": {
      distance_km: 8.4,
      estimated_minutes: 31
    },
    "Shaheen Guest House Skardu": {
      distance_km: 1.3,
      estimated_minutes: 4
    },
    "Nirvana Resort Skardu": {
      distance_km: 1.2,
      estimated_minutes: 6
    }
  },
    "The Balti Table": {
    "Sundus Skilgrong": { distance_km: 4.4, estimated_minutes: 14 },
    "Sundus Gond": { distance_km: 5.2, estimated_minutes: 17 },
    "Katpana": { distance_km: 7.3, estimated_minutes: 22 },
    "Khargrong": { distance_km: 0.7, estimated_minutes: 2 },
    "Hasnain Nagar": { distance_km: 0.75, estimated_minutes: 4 },
    "Alamdar Chowk": { distance_km: 0.5, estimated_minutes: 2 },
    "Hassan Colony": { distance_km: 1.8, estimated_minutes: 7 },
    "Hassan Colony Pine": { distance_km: 1.8, estimated_minutes: 7 },
    "Shinkhani Gond": { distance_km: 1.3, estimated_minutes: 6 },
    "Oldiing Nansoq": { distance_km: 2.5, estimated_minutes: 8 },
    "RHQ Road Harriot Hotel": { distance_km: 1.6, estimated_minutes: 5 },
    "Newranga Near Agha Ali House": { distance_km: 2.1, estimated_minutes: 8 },
    "Newranga ": { distance_km: 4.1, estimated_minutes: 16 },
    "Kushmarah": { distance_km: 3.3, estimated_minutes: 10 },
    "Sherthang Girls High School": { distance_km: 2.2, estimated_minutes: 8 },
    "Marfie Colony": { distance_km: 1.6, estimated_minutes: 6 },
    "Chumik": { distance_km: 1.7, estimated_minutes: 7 },
    "Gamba Skardu": { distance_km: 11, estimated_minutes: 23 },
    "United Line, Hassan Colony": { distance_km: 1.6, estimated_minutes: 6 },
    "Muhib Road Khargrong": { distance_km: 0.85, estimated_minutes: 3 },
    "GB Chief Court Skardu Registry Skardu": { distance_km: 4.3, estimated_minutes: 13 },
    "Shaheen Public School Skardu": { distance_km: 2.6, estimated_minutes: 11 },
    "Mehdi Colony Skardu": { distance_km: 2.7, estimated_minutes: 11 },
    "Agha Hadi Chowk": { distance_km: 0.5, estimated_minutes: 2 },
    "Hussainabad": { distance_km: 6, estimated_minutes: 14 },
    "Himalaya Hotel Hussainabad, Skardu": { distance_km: 6, estimated_minutes: 14 },
    "Hameed Garh": { distance_km: 1.2, estimated_minutes: 4 },
    "Shaheed colony": { distance_km: 3.9, estimated_minutes: 14 },
    "Tufail colony": { distance_km: 3.2, estimated_minutes: 12 },
    "Jafferi Mohallah": { distance_km: 2.3, estimated_minutes: 9 },
    "Chogo Matamsara": { distance_km: 1.8, estimated_minutes: 8 },
    "Nagulispang Road": { distance_km: 1.1, estimated_minutes: 4 },
    "Eidgah,Sundus ": { distance_km: 2.8, estimated_minutes: 10 },
    "Sukemaidan ": { distance_km: 1.2, estimated_minutes: 4 },
    "Hargissa shakthang": { distance_km: 1.9, estimated_minutes: 7 },
    "Bhutto Bazar Skardu": { distance_km: 1.8, estimated_minutes: 6 },
    "Devision": { distance_km: 2.2, estimated_minutes: 9 },
    "Abbas Town": { distance_km: 1.5, estimated_minutes: 6 },
    "Musa Line": { distance_km: 1.5, estimated_minutes: 6 },
    "Clifton pull": { distance_km: 1.3, estimated_minutes: 5 },
    "Sheikh ijaz masjid": { distance_km: 1.9, estimated_minutes: 7 },
    "Khila Toq Road": { distance_km: 1.2, estimated_minutes: 4 },
    "Public school area": { distance_km: 2.7, estimated_minutes: 9 },
    "Xhathang": { distance_km: 2.8, estimated_minutes: 9 },
    "Brolmo colony sundus": { distance_km: 4.5, estimated_minutes: 16 },
    "Ghazi Colony sundus": { distance_km: 4.8, estimated_minutes: 17 },
    "Hyderabad Gangupi Area": { distance_km: 0.75, estimated_minutes: 3 },
    "LT Col ihsan Ali rd": { distance_km: 0.7, estimated_minutes: 3 },
    "Astana skardu": { distance_km: 4.3, estimated_minutes: 12 },
    "Bintul Huda Girls model school": { distance_km: 5, estimated_minutes: 15 },
    "Brolmo colony astana": { distance_km: 4, estimated_minutes: 13 },
    "Raees mohalla Haji Gam": { distance_km: 2.5, estimated_minutes: 9 },
    "Haji Gam": { distance_km: 1.4, estimated_minutes: 5 },
    "Gulshan e Ali skardu": { distance_km: 1.7, estimated_minutes: 5 },
    "Jamia masjid road": { distance_km: 0.95, estimated_minutes: 3 },
    "Gayool skardu": { distance_km: 5.8, estimated_minutes: 15 },
    "Toqrangah Skardu": { distance_km: 4.2, estimated_minutes: 13 },
    "Maqponsar skardu": { distance_km: 3.7, estimated_minutes: 12 },
    "Newranga road": { distance_km: 3.8, estimated_minutes: 11 },
    "Quaidabad": { distance_km: 2.3, estimated_minutes: 8 },
    "Kharpocho Road": { distance_km: 1.7, estimated_minutes: 7 },
    "Patwal": { distance_km: 0.95, estimated_minutes: 3 },
    "Olding": { distance_km: 2, estimated_minutes: 7 },
    "Karasmathang": { distance_km: 0.95, estimated_minutes: 3 },
    "Kachura": { distance_km: 28, estimated_minutes: 53 },
    "3 talwar chowk": { distance_km: 2.4, estimated_minutes: 6 },
    "Teen talwar chowk": { distance_km: 2.4, estimated_minutes: 6 },
    "Sahara Complex": { distance_km: null, estimated_minutes: null },
    "Ali plaza": { distance_km: 1.4, estimated_minutes: 6 },
    "Radio Pakistan Chowk": { distance_km: 3, estimated_minutes: 10 },
    "Manthal": { distance_km: 4.6, estimated_minutes: 13 },
    "Rus Olive Lodge": { distance_km: 1.6, estimated_minutes: 7 },
    "Hargisa Resort Skardu": { distance_km: 7.9, estimated_minutes: 27 },
    "LOKAL Rooms x Skardu (Katpana Retreat)": { distance_km: 7.1, estimated_minutes: 26 },
    "Green Orchard Skardu": { distance_km: 7.7, estimated_minutes: 29 },
    "Oasis Resort Katpana Skardu": { distance_km: 6.4, estimated_minutes: 24 },
    "Avari Xpress Skardu Hotel": { distance_km: 4.0, estimated_minutes: 30 },
    "Hotel Mashabrum Skardu": { distance_km: 6.1, estimated_minutes: 21 },
    "Skardu Luxus Hotel": { distance_km: 3.1, estimated_minutes: 11 },
    "The Mountain Cottage Skardu": { distance_km: 1.4, estimated_minutes: 5 },
    "Summit Hotel Skardu": { distance_km: 8.5, estimated_minutes: 33 },
    "Skardu Saraye Hotel & Resort": { distance_km: 2.8, estimated_minutes: 10 },
    "Baltistan Tourist Cottage - Skardu": { distance_km: 2.2, estimated_minutes: 9 },
    "Glamp Pakistan": { distance_km: 0.4, estimated_minutes: 2 },
    "Montagna Pods": { distance_km: 4.5, estimated_minutes: 15 },
    "Hotel Luxy Skardu": { distance_km: 2.9, estimated_minutes: 10 },
    "Baltistan Fort, Skardu Resort Hotel": { distance_km: 8.6, estimated_minutes: 31 },
    "Hotel Skardu1": { distance_km: 5.6, estimated_minutes: 20 },
    "Baltistan Resort": { distance_km: 5.1, estimated_minutes: 17 },
    "Skardu Royal Hotel & Restaurant": { distance_km: 0.7, estimated_minutes: 5 },
    "Sharif Cottages and Hotel Skardu": { distance_km: 1.4, estimated_minutes: 5 },
    "Base Camp Katpana": { distance_km: 3.7, estimated_minutes: 14 },
    "Hotel Dewan-e-Khas": { distance_km: 4.5, estimated_minutes: 17 },
    "Legend Hotel Skardu": { distance_km: 6.3, estimated_minutes: 25 },
    "Northlanders Guest House Skardu": { distance_km: 8.2, estimated_minutes: 31 },
    "Hotel Travellodge Skardu": { distance_km: 8.0, estimated_minutes: 31 },
    "Qayam Skardu": { distance_km: 1.8, estimated_minutes: 6 },
    "Rafsal A Countryside Cottage": { distance_km: 7.1, estimated_minutes: 25 },
    "Kentish Lodge Skardu": { distance_km: 4.8, estimated_minutes: 16 },
    "Skardu Villas": { distance_km: 7.5, estimated_minutes: 27 },
    "The Cherry Courtyard": { distance_km: 5.8, estimated_minutes: 22 },
    "Ringchan Guest House & Restaurant": { distance_km: 9.4, estimated_minutes: 34 },
    "Skardu Lodge": { distance_km: 8.0, estimated_minutes: 29 },
    "Karakoram Nest": { distance_km: 6.8, estimated_minutes: 23 },
    "Dynasty Skardu": { distance_km: 0.9, estimated_minutes: 3 },
    "Sehrish Guest House Skardu": { distance_km: 5.0, estimated_minutes: 19 },
    "PTDC Motel Skardu": { distance_km: 3.2, estimated_minutes: 13 },
    "Hotel Reego Skardu": { distance_km: 1.6, estimated_minutes: 5 },
    "Lavender Cottage & Guest House": { distance_km: 3.3, estimated_minutes: 11 },
    "Rock View Skardu": { distance_km: 3.0, estimated_minutes: 12 },
    "Dream Guest House Haji Gam Chowk": { distance_km: 8.7, estimated_minutes: 31 },
    "Indus Lodges Skardu": { distance_km: 6.4, estimated_minutes: 23 },
    "Pacific Guest House Skardu": { distance_km: 7.7, estimated_minutes: 27 },
    "Skardu View Point Hotel and Huts": { distance_km: 9.3, estimated_minutes: 32 },
    "Khar Hotel Skardu": { distance_km: 6.6, estimated_minutes: 26 },
    "HIKK Inn Skardu": { distance_km: 2.7, estimated_minutes: 10 },
    "Taaj Residence Skardu": { distance_km: 5.9, estimated_minutes: 22 },
    "Homeland Guest House Skardu": { distance_km: 0.8, estimated_minutes: 2 },
    "Sultan Guest House Skardu": { distance_km: 2.3, estimated_minutes: 7 },
    "The Hill Town Resort": { distance_km: 9.1, estimated_minutes: 35 },
    "AlJannah Guest House Skardu": { distance_km: 6.7, estimated_minutes: 23 },
    "Deosai Gateway Inn Skardu": { distance_km: 4.7, estimated_minutes: 18 },
    "Skardu Arcadian Resort": { distance_km: 4.5, estimated_minutes: 15 },
    "Areena Hotel Skardu": { distance_km: 8.2, estimated_minutes: 32 },
    "Skardu Farmhouse for stay": { distance_km: 5.5, estimated_minutes: 21 },
    "Adventure Sarai Hotel Skardu": { distance_km: 3.1, estimated_minutes: 13 },
    "Maple Resort": { distance_km: 2.0, estimated_minutes: 9 },
    "Candela Resorts": { distance_km: 6.0, estimated_minutes: 24 },
    "Hispar Hotel Skardu": { distance_km: 4.2, estimated_minutes: 14 },
    "K2 Paradise Guest House": { distance_km: 3.6, estimated_minutes: 12 },
    "Holiday Mountain Resort & Camping Site": { distance_km: 3.5, estimated_minutes: 14 },
    "Mountain Lodge Skardu": { distance_km: 6.6, estimated_minutes: 26 },
    "Mulberry Continental Hotel Skardu": { distance_km: 3.5, estimated_minutes: 14 },
    "PC Legacy Skardu": { distance_km: 1.4, estimated_minutes: 4 },
    "GB Lodges": { distance_km: 9.4, estimated_minutes: 33 },
    "Bilafond Cottage": { distance_km: 3.1, estimated_minutes: 10 },
    "North Hills Skardu": { distance_km: 1.2, estimated_minutes: 6 },
    "Pinnacle Executive Lodges": { distance_km: 7.0, estimated_minutes: 26 },
    "Safena Hotel Skardu": { distance_km: 2.3, estimated_minutes: 8 },
    "Byarsa Hotel Skardu": { distance_km: 9.1, estimated_minutes: 33 },
    "Dream Nest Resort Hotels Skardu": { distance_km: 1.0, estimated_minutes: 3 },
    "Stream view guest house skardu": { distance_km: 7.9, estimated_minutes: 29 },
    "Shangrila Resort Skardu": { distance_km: 1.7, estimated_minutes: 6 },
    "Kachura Inn Skardu": { distance_km: 8.2, estimated_minutes: 31 },
    "Tibet Hotel Kachura Skardu": { distance_km: 2.5, estimated_minutes: 8 },
    "Hotel Mountain Lagoon Skardu": { distance_km: 1.4, estimated_minutes: 6 },
    "Skardu River Resort": { distance_km: 6.8, estimated_minutes: 24 },
    "Morning Resort": { distance_km: 7.2, estimated_minutes: 28 },
    "Hotel Desert Bloom Skardu": { distance_km: 3.1, estimated_minutes: 10 },
    "TheQue Skardu": { distance_km: 3.7, estimated_minutes: 15 },
    "Singay Homestay Skardu": { distance_km: 8.0, estimated_minutes: 30 },
    "Baltistan Crown Resort": { distance_km: 9.4, estimated_minutes: 34 },
    "Fatah inn Guest House": { distance_km: 2.8, estimated_minutes: 12 },
    "Kunhar": { distance_km: 5.4, estimated_minutes: 21 },
    "Maltoro guest house": { distance_km: 6.2, estimated_minutes: 22 },
    "Apex Hotels and Resorts Skardu": { distance_km: 9.1, estimated_minutes: 34 },
    "Hotel virsa": { distance_km: 5.0, estimated_minutes: 17 },
    "Elli's Luxus": { distance_km: 6.2, estimated_minutes: 23 },
    "Skardu Gateway Hotel & Restaurant": { distance_km: 4.2, estimated_minutes: 14 },
    "Polo Land Hotel by Skyline": { distance_km: 2.5, estimated_minutes: 8 },
    "Baltistan White House Hotel": { distance_km: 6.1, estimated_minutes: 22 },
    "The Pioneer Hotel": { distance_km: 9.0, estimated_minutes: 31 },
    "Ramovi Guest House": { distance_km: 4.1, estimated_minutes: 14 },
    "Friends & Family Guest House": { distance_km: 1.7, estimated_minutes: 7 },
    "SKY LAKE GUEST HOUSE": { distance_km: 6.4, estimated_minutes: 24 },
    "Skardu bliss hotel": { distance_km: 6.7, estimated_minutes: 23 },
    "Comfort inn hotel": { distance_km: 5.3, estimated_minutes: 18 },
    "Grand Hotel Skardu": { distance_km: 9.1, estimated_minutes: 33 },
    "Baltistan inn hotel": { distance_km: 9.2, estimated_minutes: 32 },
    "Grand view hotel": { distance_km: 7.2, estimated_minutes: 28 },
    "Hotel walnut": { distance_km: 3.8, estimated_minutes: 13 },
    "ABC hotel": { distance_km: 8.6, estimated_minutes: 32 },
    "Lashari Resort Skardu": { distance_km: 4.8, estimated_minutes: 17 },
    "Melody Hills Skardu": { distance_km: 6.1, estimated_minutes: 23 },
    "NJM House Near Skardu Airport": { distance_km: 1.7, estimated_minutes: 6 },
    "Le Yurt Skardu": { distance_km: 2.5, estimated_minutes: 10 },
    "FearLess lodge": { distance_km: 4.8, estimated_minutes: 16 },
    "Wamiq Skardu Resort": { distance_km: 2.8, estimated_minutes: 10 },
    "Hosho Guest House": { distance_km: 6.9, estimated_minutes: 25 },
    "Orgventure Resorts Skardu": { distance_km: 2.9, estimated_minutes: 10 },
    "Green orchard skardu": { distance_km: 2.4, estimated_minutes: 10 },
    "Mount View hotel skardu": { distance_km: 4.8, estimated_minutes: 17 },
    "Laal Haveli": { distance_km: 6.2, estimated_minutes: 22 },
    "Skardu view Guest house": { distance_km: 6.9, estimated_minutes: 24 },
    "Baltistan Mountain Chalet Hotel": { distance_km: 6.9, estimated_minutes: 25 },
    "Hotel Five star & restaurant skardu": { distance_km: 6.7, estimated_minutes: 23 },
    "Tufail palace hotel & restaurant": { distance_km: 1.9, estimated_minutes: 7 },
    "Indus motel": { distance_km: 1.6, estimated_minutes: 5 },
    "Paradise hotel": { distance_km: 4.6, estimated_minutes: 17 },
    "Hotel Red sun": { distance_km: 0.7, estimated_minutes: 3 },
    "Haks hotel": { distance_km: 9.2, estimated_minutes: 33 },
    "Hotel inn skardu": { distance_km: 4.4, estimated_minutes: 18 },
    "Skardu embassy hotel": { distance_km: 6.6, estimated_minutes: 25 },
    "Hotel Delight Skardu": { distance_km: 7.2, estimated_minutes: 28 },
    "Ayan Hotel": { distance_km: 6.5, estimated_minutes: 23 },
    "Hotel Highlander inn": { distance_km: 5.8, estimated_minutes: 22 },
    "The North face inn hotel skardu": { distance_km: 1.2, estimated_minutes: 3 },
    "The yak Hotel skardu": { distance_km: 9.1, estimated_minutes: 35 },
    "Indus lodge skardu": { distance_km: 3.4, estimated_minutes: 12 },
    "Stay inn hotel": { distance_km: 0.5, estimated_minutes: 2 },
    "Eden Rock skardu": { distance_km: 9.2, estimated_minutes: 33 },
    "Concordia Motel Baltistan": { distance_km: 2.1, estimated_minutes: 7 },
    "Harriot Skardu": { distance_km: 4.3, estimated_minutes: 16 },
    "Hotel PeakNest": { distance_km: 7.4, estimated_minutes: 28 },
    "Royal Glaxy Hotel": { distance_km: 3.9, estimated_minutes: 13 },
    "Sarfaranga view rock Guest house skardu": { distance_km: 5.7, estimated_minutes: 21 },
    "Eat and Read Guesthouse skardu": { distance_km: 2.0, estimated_minutes: 8 },
    "North Face explorers": { distance_km: 5.6, estimated_minutes: 21 },
    "Holiday resort skardu": { distance_km: 2.2, estimated_minutes: 10 },
    "Kallisto Resort": { distance_km: 8.4, estimated_minutes: 29 },
    "Sagar hotel skardu": { distance_km: 9.2, estimated_minutes: 32 },
    "Hotel Elite skardu": { distance_km: 8.5, estimated_minutes: 30 },
    "SnowLand Resort": { distance_km: 3.8, estimated_minutes: 15 },
    "Bismillah Guest House": { distance_km: 2.8, estimated_minutes: 11 },
    "Hotel Yak sarai": { distance_km: 1.4, estimated_minutes: 5 },
    "The North Palace": { distance_km: 9.3, estimated_minutes: 33 },
    "Duqsa Family Guest House": { distance_km: 4.3, estimated_minutes: 17 },
    "Wazir's villa": { distance_km: 1.0, estimated_minutes: 5 },
    "Hotel Rewaaj": { distance_km: 8.3, estimated_minutes: 30 },
    "Comfort Hotel & Huts skardu": { distance_km: 1.9, estimated_minutes: 7 },
    "Zam Zam Guest House": { distance_km: 0.8, estimated_minutes: 4 },
    "The Mountain Gypsy Resort": { distance_km: 0.9, estimated_minutes: 3 },
    "Rigo Resort Skardu": { distance_km: 4.2, estimated_minutes: 14 },
    "Arish Luxury Sites": { distance_km: 7.5, estimated_minutes: 29 },
    "InterContinental Hotel": { distance_km: 0.7, estimated_minutes: 4 },
    "Royal fort resort skardu": { distance_km: 5.6, estimated_minutes: 19 },
    "Meer Stay and Dine skardu": { distance_km: 1.3, estimated_minutes: 4 },
    "Dream Land Guest House": { distance_km: 1.4, estimated_minutes: 6 },
    "Hotel GraceLand": { distance_km: 6.2, estimated_minutes: 23 },
    "MOUNTAIN MAJESTY INN SKARDU": { distance_km: 5.0, estimated_minutes: 20 },
    "Alnoor Lodges": { distance_km: 3.2, estimated_minutes: 11 },
    "Jasper House": { distance_km: 2.6, estimated_minutes: 11 },
    "The Himalayan Guest House": { distance_km: 4.2, estimated_minutes: 17 },
    "Epoch Inn Guest House Skardu": { distance_km: 6.2, estimated_minutes: 21 },
    "Mountaindale Guest House": { distance_km: 6.6, estimated_minutes: 24 },
    "Al Jannah Guest House Skardu": { distance_km: 4.4, estimated_minutes: 18 },
    "Biafo Resort Skardu": { distance_km: 5.3, estimated_minutes: 20 },
    "Skardu Blossom Inn": { distance_km: 1.0, estimated_minutes: 5 },
    "The Diamond Guest House Skardu": { distance_km: 4.9, estimated_minutes: 18 },
    "Anarres | A Creative Residency": { distance_km: 1.3, estimated_minutes: 7 },
    "Submit Embassy Hotel": { distance_km: 4.5, estimated_minutes: 18 },
    "Alpine Abode Skardu": { distance_km: 8.9, estimated_minutes: 34 },
    "Relax Inn Skardu": { distance_km: 5.0, estimated_minutes: 20 },
    "Gumaan Resort Skardu": { distance_km: 8.6, estimated_minutes: 30 },
    "Yuligo Resort Skardu": { distance_km: 6.0, estimated_minutes: 21 },
    "Urban escape resort": { distance_km: 2.3, estimated_minutes: 8 },
    "Mohsin Lodge Skardu": { distance_km: 8.5, estimated_minutes: 32 },
    "Back To Home Lodging": { distance_km: 9.4, estimated_minutes: 34 },
    "Royal Brangsa Guest House": { distance_km: 2.1, estimated_minutes: 8 },
    "Wazir Guest House Skardu": { distance_km: 1.4, estimated_minutes: 7 },
    "Golden Ibex Guest House": { distance_km: 2.4, estimated_minutes: 11 },
    "Up Way Guest House": { distance_km: 0.9, estimated_minutes: 4 },
    "Kunlun Peak Inn skardu": { distance_km: 4.9, estimated_minutes: 17 },
    "Markhor Hotel": { distance_km: 4.8, estimated_minutes: 18 },
    "Tibet hotel skardu": { distance_km: 8.1, estimated_minutes: 29 },
    "Alpha Nomads House": { distance_km: 0.5, estimated_minutes: 2 },
    "Dirleh Hotel": { distance_km: 7.4, estimated_minutes: 26 },
    "North Home Skardu": { distance_km: 7.2, estimated_minutes: 26 },
    "Valhalla Guest House": { distance_km: 2.6, estimated_minutes: 11 },
    "Creek villa skardu": { distance_km: 3.5, estimated_minutes: 15 },
    "Prince Tourist Hut": { distance_km: 2.5, estimated_minutes: 8 },
    "Mountain House": { distance_km: 1.8, estimated_minutes: 8 },
    "Reechan Resort House": { distance_km: 9.1, estimated_minutes: 34 },
    "Himalayan Guest House Hassan colony": { distance_km: 5.6, estimated_minutes: 19 },
    "Jasmine Skardu": { distance_km: 8.2, estimated_minutes: 31 },
    "Mountain Face Skardu": { distance_km: 1.3, estimated_minutes: 7 },
    "Four Seasons Bed and Breakfast": { distance_km: 2.1, estimated_minutes: 7 },
    "Flora Inn skardu": { distance_km: 8.1, estimated_minutes: 28 },
    "Broadpeak Resort skardu": { distance_km: 5.3, estimated_minutes: 18 },
    "Chinar Residency": { distance_km: 6.8, estimated_minutes: 25 },
    "Buddha Rock Guest House Skardu": { distance_km: 7.3, estimated_minutes: 25 },
    "Buddha view Resort skardu": { distance_km: 9.2, estimated_minutes: 32 },
    "Moonal Residency": { distance_km: 5.7, estimated_minutes: 21 },
    "Skarchan Resort skardu": { distance_km: 9.4, estimated_minutes: 33 },
    "ZAGO Guest House": { distance_km: 0.9, estimated_minutes: 5 },
    "Skardu Blossom Guest House": { distance_km: 4.3, estimated_minutes: 17 },
    "Harpo Resorts": { distance_km: 4.0, estimated_minutes: 15 },
    "Baltistan Continental Hotel skardu": { distance_km: 1.3, estimated_minutes: 7 },
    "Al Abbas Guest House": { distance_km: 1.4, estimated_minutes: 5 },
    "Apricot Spring Resort Skardu": { distance_km: 6.1, estimated_minutes: 24 },
    "Executive Guest House Skardu": { distance_km: 5.3, estimated_minutes: 21 },
    "Hotel Bloom Hills,Skardu": { distance_km: 7.8, estimated_minutes: 30 },
    "Siachen Stay&Tours": { distance_km: 4.8, estimated_minutes: 16 },
    "Mountain Guest House and Desi Restaurant": { distance_km: 9.0, estimated_minutes: 33 },
    "Decent Baltistan guest house": { distance_km: 9.1, estimated_minutes: 35 },
    "Baltistan Village Guest House": { distance_km: 6.1, estimated_minutes: 22 },
    "Bareen": { distance_km: 7.8, estimated_minutes: 30 },
    "SUMMIT GUEST HOUSE": { distance_km: 1.7, estimated_minutes: 8 },
    "Serene Baltistan Hotel": { distance_km: 4.3, estimated_minutes: 15 },
    "Alpha Hotel & Restaurant": { distance_km: 4.1, estimated_minutes: 16 },
    "Saani Rooms": { distance_km: 5.3, estimated_minutes: 21 },
    "Ridakh Inn": { distance_km: 7.5, estimated_minutes: 28 },
    "Clifton Spachan Hotel": { distance_km: 8.8, estimated_minutes: 31 },
    "K2 Tourism Guest House": { distance_km: 2.1, estimated_minutes: 7 },
    "Heaven's Adventure.pk": { distance_km: 7.1, estimated_minutes: 28 },
    "Desert one hotel and restaurant skardu": { distance_km: 1.9, estimated_minutes: 8 },
    "Yazgar Residency Skardu": { distance_km: 4.5, estimated_minutes: 16 },
    "The Next Home Skardu": { distance_km: 4.1, estimated_minutes: 16 },
    "Heaven Hotel Skardu": { distance_km: 2.5, estimated_minutes: 10 },
    "Skardu Midway hotel": { distance_km: 6.3, estimated_minutes: 23 },
    "Sarfaranga Reaidency": { distance_km: 5.1, estimated_minutes: 17 },
    "Skengoo Inn Hotel": { distance_km: 3.6, estimated_minutes: 13 },
    "Alnoor Starlet Hotel": { distance_km: 3.5, estimated_minutes: 15 },
    "Top Hill Resort": { distance_km: 8.2, estimated_minutes: 29 },
    "Royal Resort Skardu": { distance_km: 6.7, estimated_minutes: 24 },
    "Signature Skardu Hotel": { distance_km: 3.2, estimated_minutes: 12 },
    "Shama Resort Skardu": { distance_km: 4.6, estimated_minutes: 17 },
    "Pearl of Skardu Resort": { distance_km: 6.7, estimated_minutes: 25 },
    "Crystal Mountain Lodge": { distance_km: 6.5, estimated_minutes: 25 },
    "H A K S RESSORT": { distance_km: 8.3, estimated_minutes: 29 },
    "Shaheen Guest House Skardu": { distance_km: 4.9, estimated_minutes: 17 },
    "Nirvana Resort Skardu": { distance_km: 3.9, estimated_minutes: 15 },
  },
  "Skyway Pizza Skardu": {
   "Sundus Skilgrong": { distance_km: 4, estimated_minutes: 12 },
    "Sundus Gond": { distance_km: 4.7, estimated_minutes: 14 },
    "Katpana": { distance_km: 6.8, estimated_minutes: 19 },
    "Khargrong": { distance_km: 1.6, estimated_minutes: 7 },
    "Hasnain Nagar": { distance_km: 0.7, estimated_minutes: 3 },
    "Alamdar Chowk": { distance_km: 0.45, estimated_minutes: 2 },
    "Hassan Colony": { distance_km: 1.3, estimated_minutes: 4 },
    "Hassan Colony Pine": { distance_km: 0.8, estimated_minutes: 3 },
    "Shinkhani Gond": { distance_km: 0.4, estimated_minutes: 1 },
    "Oldiing Nansoq": { distance_km: 3.0, estimated_minutes: 10 },
    "RHQ Road Harriot Hotel": { distance_km: 2.6, estimated_minutes: 10 },
    "Newranga Near Agha Ali House": { distance_km: 1.2, estimated_minutes: 4 },
    "Newranga ": { distance_km: 2.9, estimated_minutes: 8 },
    "Kushmarah": { distance_km: 2.3, estimated_minutes: 6 },
    "Sherthang Girls High School": { distance_km: 1.9, estimated_minutes: 7 },
    "Marfie Colony": { distance_km: 2.1, estimated_minutes: 8 },
    "Chumik": { distance_km: 2.1, estimated_minutes: 9 },
    "Gamba Skardu": { distance_km: 10, estimated_minutes: 19 },
    "United Line, Hassan Colony": { distance_km: 0.75, estimated_minutes: 3 },
    "Muhib Road Khargrong": { distance_km: 1.8, estimated_minutes: 7 },
    "GB Chief Court Skardu Registry Skardu": { distance_km: 2.9, estimated_minutes: 9 },
    "Shaheen Public School Skardu": { distance_km: 1.6, estimated_minutes: 6 },
    "Mehdi Colony Skardu": { distance_km: 1.6, estimated_minutes: 7 },
    "Agha Hadi Chowk": { distance_km: 1.5, estimated_minutes: 7 },
    "Hussainabad": { distance_km: 7.1, estimated_minutes: 19 },
    "Himalaya Hotel Hussainabad, Skardu": { distance_km: 7.1, estimated_minutes: 19 },
    "Hameed Garh": { distance_km: 2.3, estimated_minutes: 9 },
    "Shaheed colony": { distance_km: 3.4, estimated_minutes: 9 },
    "Tufail colony": { distance_km: 2.6, estimated_minutes: 8 },
    "Jafferi Mohallah": { distance_km: 1.8, estimated_minutes: 6 },
    "Chogo Matamsara": { distance_km: 2.2, estimated_minutes: 9 },
    "Nagulispang Road": { distance_km: 0.55, estimated_minutes: 2 },
    "Eidgah,Sundus ": { distance_km: 3.3, estimated_minutes: 10 },
    "Sukemaidan ": { distance_km: 1.2, estimated_minutes: 4 },
    "Hargissa shakthang": { distance_km: 0.9, estimated_minutes: 3 },
    "Bhutto Bazar Skardu": { distance_km: 1.3, estimated_minutes: 4 },
    "Devision": { distance_km: 2.7, estimated_minutes: 10 },
    "Abbas Town": { distance_km: 2.0, estimated_minutes: 7 },
    "Musa Line": { distance_km: 1.0, estimated_minutes: 3 },
    "Clifton pull": { distance_km: 0.35, estimated_minutes: 1 },
    "Sheikh ijaz masjid": { distance_km: 1.0, estimated_minutes: 3 },
    "Khila Toq Road": { distance_km: 2.2, estimated_minutes: 9 },
    "Public school area": { distance_km: 2.9, estimated_minutes: 9 },
    "Xhathang": { distance_km: 3.0, estimated_minutes: 9 },
    "Brolmo colony sundus": { distance_km: 3.9, estimated_minutes: 12 },
    "Ghazi Colony sundus": { distance_km: 4.3, estimated_minutes: 14 },
    "Hyderabad Gangupi Area": { distance_km: 0.95, estimated_minutes: 4 },
    "LT Col ihsan Ali rd": { distance_km: 0.8, estimated_minutes: 3 },
    "Astana skardu": { distance_km: 2.9, estimated_minutes: 9 },
    "Bintul Huda Girls model school": { distance_km: 4.0, estimated_minutes: 12 },
    "Brolmo colony astana": { distance_km: 3.1, estimated_minutes: 9 },
    "Raees mohalla Haji Gam": { distance_km: 2.3, estimated_minutes: 8 },
    "Haji Gam": { distance_km: 1.4, estimated_minutes: 5 },
    "Gulshan e Ali skardu": { distance_km: 2.7, estimated_minutes: 10 },
    "Jamia masjid road": { distance_km: 1.4, estimated_minutes: 5 },
    "Gayool skardu": { distance_km: 4.9, estimated_minutes: 11 },
    "Toqrangah Skardu": { distance_km: 3.2, estimated_minutes: 10 },
    "Maqponsar skardu": { distance_km: 2.7, estimated_minutes: 8 },
    "Newranga road": { distance_km: 2.7, estimated_minutes: 8 },
    "Quaidabad": { distance_km: 1.3, estimated_minutes: 5 },
    "Kharpocho Road": { distance_km: 2.1, estimated_minutes: 9 },
    "Patwal": { distance_km: 2.0, estimated_minutes: 8 },
    "Olding": { distance_km: 3.2, estimated_minutes: 9 },
    "Karasmathang": { distance_km: 1.9, estimated_minutes: 7 },
    "Kachura": { distance_km: 27, estimated_minutes: 52 },
    "3 talwar chowk": { distance_km: 3.1, estimated_minutes: 10 },
    "Teen talwar chowk": { distance_km: 3.1, estimated_minutes: 10 },
    "Sahara Complex": { distance_km: 3.0, estimated_minutes: 9 },
    "Ali plaza": { distance_km: 1.6, estimated_minutes: 6 },
    "Radio Pakistan Chowk": { distance_km: 2.0, estimated_minutes: 7 },
    "Manthal": { distance_km: 4.8, estimated_minutes: 14 },
    "Rus Olive Lodge": {
    distance_km: 4.5,
    estimated_minutes: 6
  },
  "Hargisa Resort Skardu": {
    distance_km: 5.4,
    estimated_minutes: 7
  },
  "LOKAL Rooms x Skardu (Katpana Retreat)": {
    distance_km: 5.3,
    estimated_minutes: 7
  },
  "Green Orchard Skardu": {
    distance_km: 3.5,
    estimated_minutes: 5
  },
  "Oasis Resort Katpana Skardu": {
    distance_km: 5.7,
    estimated_minutes: 7
  },
  "Avari Xpress Skardu Hotel": {
    distance_km: 3.8,
    estimated_minutes: 4
  },
  "Hotel Mashabrum Skardu": {
    distance_km: 2.7,
    estimated_minutes: 4
  },
  "Skardu Luxus Hotel": {
    distance_km: 2.7,
    estimated_minutes: 4
  },
  "The Mountain Cottage Skardu": {
    distance_km: 2.1,
    estimated_minutes: 3
  },
  "Summit Hotel Skardu": {
    distance_km: 2,
    estimated_minutes: 3
  },
  "Skardu Saraye Hotel & Resort": {
    distance_km: 3.6,
    estimated_minutes: 6
  },
  "Baltistan Tourist Cottage - Skardu": {
    distance_km: 2.2,
    estimated_minutes: 3
  },
  "Glamp Pakistan": {
    distance_km: 6.7,
    estimated_minutes: 10
  },
  "Montagna Pods": {
    distance_km: 6.9,
    estimated_minutes: 10
  },
  "Hotel Luxy Skardu": {
    distance_km: 3,
    estimated_minutes: 4
  },
  "Baltistan Fort, Skardu Resort Hotel": {
    distance_km: 7.6,
    estimated_minutes: 12
  },
  "Hotel Skardu1": {
    distance_km: 1.3,
    estimated_minutes: 2
  },
  "Baltistan Resort": {
    distance_km: 1.3,
    estimated_minutes: 2
  },
  "Skardu Royal Hotel & Restaurant": {
    distance_km: 0.7,
    estimated_minutes: 2
  },
  "Sharif Cottages and Hotel Skardu": {
    distance_km: 4.2,
    estimated_minutes: 4
  },
  "Base Camp Katpana": {
    distance_km: 7.8,
    estimated_minutes: 12
  },
  "Hotel Dewan-e-Khas": {
    distance_km: 2.1,
    estimated_minutes: 3
  },
  "Legend Hotel Skardu": {
    distance_km: 1.9,
    estimated_minutes: 3
  },
  "Northlanders Guest House Skardu": {
    distance_km: 1.7,
    estimated_minutes: 3
  },
  "Hotel Travellodge Skardu": {
    distance_km: 0.3,
    estimated_minutes: 1
  },
  "Qayam Skardu": {
    distance_km: 5,
    estimated_minutes: 5
  },
  "Rafsal A Countryside Cottage": {
    distance_km: 5.2,
    estimated_minutes: 8
  },
  "Kentish Lodge Skardu": {
    distance_km: 0.5,
    estimated_minutes: 1
  },
  "Skardu Villas": {
    distance_km: 5.4,
    estimated_minutes: 5
  },
  "The Cherry Courtyard": {
    distance_km: 5.4,
    estimated_minutes: 6
  },
  "Ringchan Guest House & Restaurant": {
    distance_km: 2.3,
    estimated_minutes: 3
  },
  "Skardu Lodge": {
    distance_km: 2,
    estimated_minutes: 2
  },
  "Karakoram Nest": {
    distance_km: 2.6,
    estimated_minutes: 3
  },
  "Dynasty Skardu": {
    distance_km: 5.7,
    estimated_minutes: 6
  },
  "Sehrish Guest House Skardu": {
    distance_km: 1.4,
    estimated_minutes: 2
  },
  "PTDC Motel Skardu": {
    distance_km: 2.6,
    estimated_minutes: 3
  },
  "Hotel Reego Skardu": {
    distance_km: 1.3,
    estimated_minutes: 2
  },
  "Lavender Cottage & Guest House": {
    distance_km: 1.4,
    estimated_minutes: 3
  },
  "Rock View Skardu": {
    distance_km: 1.3,
    estimated_minutes: 2
  },
  "Dream Guest House Haji Gam Chowk": {
    distance_km: 1.3,
    estimated_minutes: 2
  },
  "Indus Lodges Skardu": {
    distance_km: 2.7,
    estimated_minutes: 3
  },
  "Pacific Guest House Skardu": {
    distance_km: 1.8,
    estimated_minutes: 3
  },
  "Skardu View Point Hotel and Huts": {
    distance_km: 1.8,
    estimated_minutes: 3
  },
  "Khar Hotel Skardu": {
    distance_km: 1.7,
    estimated_minutes: 3
  },
  "HIKK Inn Skardu": {
    distance_km: 1.8,
    estimated_minutes: 3
  },
  "Taaj Residence Skardu": {
    distance_km: 2.3,
    estimated_minutes: 3
  },
  "Homeland Guest House Skardu": {
    distance_km: 1.8,
    estimated_minutes: 2
  },
  "Sultan Guest House Skardu": {
    distance_km: 1.6,
    estimated_minutes: 3
  },
  "The Hill Town Resort": {
    distance_km: 2,
    estimated_minutes: 4
  },
  "AlJannah Guest House Skardu": {
    distance_km: 2.5,
    estimated_minutes: 3
  },
  "Deosai Gateway Inn Skardu": {
    distance_km: 2.6,
    estimated_minutes: 3
  },
  "Skardu Arcadian Resort": {
    distance_km: 9.4,
    estimated_minutes: 11
  },
  "Areena Hotel Skardu": {
    distance_km: 2.4,
    estimated_minutes: 3
  },
  "Skardu Farmhouse for stay": {
    distance_km: 3.1,
    estimated_minutes: 4
  },
  "Adventure Sarai Hotel Skardu": {
    distance_km: 2.6,
    estimated_minutes: 3
  },
  "Maple Resort": {
    distance_km: 12,
    estimated_minutes: 15
  },
  "Candela Resorts": {
    distance_km: 3.5,
    estimated_minutes: 4
  },
  "Hispar Hotel Skardu": {
    distance_km: 3.6,
    estimated_minutes: 5
  },
  "K2 Paradise Guest House": {
    distance_km: 3.3,
    estimated_minutes: 3
  },
  "Holiday Mountain Resort & Camping Site": {
    distance_km: 4.1,
    estimated_minutes: 6
  },
  "Mountain Lodge Skardu": {
    distance_km: 4.1,
    estimated_minutes: 6
  },
  "Mulberry Continental Hotel Skardu": {
    distance_km: 10.4,
    estimated_minutes: 9
  },
  "PC Legacy Skardu": {
    distance_km: 10.6,
    estimated_minutes: 9
  },
  "GB Lodges": {
    distance_km: 11.4,
    estimated_minutes: 10
  },
  "Bilafond Cottage": {
    distance_km: 8.3,
    estimated_minutes: 10
  },
  "North Hills Skardu": {
    distance_km: 2.3,
    estimated_minutes: 3
  },
  "Pinnacle Executive Lodges": {
    distance_km: 11.9,
    estimated_minutes: 10
  },
  "Safena Hotel Skardu": {
    distance_km: 14.7,
    estimated_minutes: 12
  },
  "Byarsa Hotel Skardu": {
    distance_km: 24.6,
    estimated_minutes: 20
  },
  "Dream Nest Resort Hotels Skardu": {
    distance_km: 33.2,
    estimated_minutes: 34
  },
  "Stream view guest house skardu": {
    distance_km: 0.7,
    estimated_minutes: 2
  },
  "Shangrila Resort Skardu": {
    distance_km: 25.5,
    estimated_minutes: 23
  },
  "Kachura Inn Skardu": {
    distance_km: 30.3,
    estimated_minutes: 28
  },
  "Tibet Hotel Kachura Skardu": {
    distance_km: 28.8,
    estimated_minutes: 24
  },
  "Hotel Mountain Lagoon Skardu": {
    distance_km: 25.9,
    estimated_minutes: 25
  },
  "Skardu River Resort": {
    distance_km: 26.1,
    estimated_minutes: 25
  },
  "Morning Resort": {
    distance_km: 29.3,
    estimated_minutes: 25
  },
  "Hotel Desert Bloom Skardu": {
    distance_km: 4.6,
    estimated_minutes: 6
  },
  "TheQue Skardu": {
    distance_km: 29.8,
    estimated_minutes: 25
  },
  "Singay Homestay Skardu": {
    distance_km: 2.4,
    estimated_minutes: 4
  },
  "Baltistan Crown Resort": {
    distance_km: 5.6,
    estimated_minutes: 7
  },
  "Fatah inn Guest House": {
    distance_km: 5.7,
    estimated_minutes: 7
  },
  "Kunhar": {
    distance_km: 5.4,
    estimated_minutes: 6
  },
  "Maltoro guest house": {
    distance_km: 5.5,
    estimated_minutes: 5
  },
  "Apex Hotels and Resorts Skardu": {
    distance_km: 5.5,
    estimated_minutes: 5
  },
  "Hotel virsa": {
    distance_km: 5.6,
    estimated_minutes: 5
  },
  "Elli's Luxus": {
    distance_km: 6.2,
    estimated_minutes: 6
  },
  "Skardu Gateway Hotel & Restaurant": {
    distance_km: 6.3,
    estimated_minutes: 6
  },
  "Polo Land Hotel by Skyline": {
    distance_km: 6.4,
    estimated_minutes: 6
  },
  "Baltistan White House Hotel": {
    distance_km: 6.7,
    estimated_minutes: 6
  },
  "The Pioneer Hotel": {
    distance_km: 6.8,
    estimated_minutes: 6
  },
  "Ramovi Guest House": {
    distance_km: 6.8,
    estimated_minutes: 6
  },
  "Friends & Family Guest House": {
    distance_km: 7.2,
    estimated_minutes: 7
  },
  "SKY LAKE GUEST HOUSE": {
    distance_km: 7.5,
    estimated_minutes: 7
  },
  "Skardu bliss hotel": {
    distance_km: 8.8,
    estimated_minutes: 8
  },
  "Comfort inn hotel": {
    distance_km: 8.8,
    estimated_minutes: 8
  },
  "Grand Hotel Skardu": {
    distance_km: 9.1,
    estimated_minutes: 8
  },
  "Baltistan inn hotel": {
    distance_km: 9.2,
    estimated_minutes: 8
  },
  "Grand view hotel": {
    distance_km: 9.2,
    estimated_minutes: 8
  },
  "Hotel walnut": {
    distance_km: 10.2,
    estimated_minutes: 9
  },
  "ABC hotel": {
    distance_km: 10.4,
    estimated_minutes: 9
  },
  "Lashari Resort Skardu": {
    distance_km: 10.5,
    estimated_minutes: 9
  },
  "Melody Hills Skardu": {
    distance_km: 10.9,
    estimated_minutes: 9
  },
  "NJM House Near Skardu Airport": {
    distance_km: 10.9,
    estimated_minutes: 9
  },
  "Le Yurt Skardu": {
    distance_km: 11.1,
    estimated_minutes: 9
  },
  "FearLess lodge": {
    distance_km: 12.3,
    estimated_minutes: 12
  },
  "Wamiq Skardu Resort": {
    distance_km: 15,
    estimated_minutes: 15
  },
  "Hosho Guest House": {
    distance_km: 13.7,
    estimated_minutes: 11
  },
  "Orgventure Resorts Skardu": {
    distance_km: 15,
    estimated_minutes: 12
  },
  "Green orchard skardu": {
    distance_km: 3.5,
    estimated_minutes: 4
  },
  "Mount View hotel skardu": {
    distance_km: 3.3,
    estimated_minutes: 4
  },
  "Laal Haveli": {
    distance_km: 3.1,
    estimated_minutes: 4
  },
  "Skardu view Guest house": {
    distance_km: 3,
    estimated_minutes: 4
  },
  "Baltistan Mountain Chalet Hotel": {
    distance_km: 3,
    estimated_minutes: 4
  },
  "Hotel Five star & restaurant skardu": {
    distance_km: 2.9,
    estimated_minutes: 4
  },
  "Tufail palace hotel & restaurant": {
    distance_km: 2.9,
    estimated_minutes: 4
  },
  "Indus motel": {
    distance_km: 2.6,
    estimated_minutes: 4
  },
  "Paradise hotel": {
    distance_km: 2.5,
    estimated_minutes: 4
  },
  "Hotel Red sun": {
    distance_km: 2.5,
    estimated_minutes: 4
  },
  "Haks hotel": {
    distance_km: 2.4,
    estimated_minutes: 3
  },
  "Hotel inn skardu": {
    distance_km: 2.3,
    estimated_minutes: 3
  },
  "Skardu embassy hotel": {
    distance_km: 2.3,
    estimated_minutes: 3
  },
  "Hotel Delight Skardu": {
    distance_km: 2.2,
    estimated_minutes: 3
  },
  "Ayan Hotel": {
    distance_km: 1.8,
    estimated_minutes: 3
  },
  "Hotel Highlander inn": {
    distance_km: 2.5,
    estimated_minutes: 3
  },
  "The North face inn hotel skardu": {
    distance_km: 2.7,
    estimated_minutes: 3
  },
  "The yak Hotel skardu": {
    distance_km: 2.7,
    estimated_minutes: 3
  },
  "Indus lodge skardu": {
    distance_km: 2.7,
    estimated_minutes: 3
  },
  "Stay inn hotel": {
    distance_km: 2.7,
    estimated_minutes: 3
  },
  "Eden Rock skardu": {
    distance_km: 2.8,
    estimated_minutes: 3
  },
  "Concordia Motel Baltistan": {
    distance_km: 3,
    estimated_minutes: 3
  },
  "Harriot Skardu": {
    distance_km: 3.4,
    estimated_minutes: 3
  },
  "Hotel PeakNest": {
    distance_km: 3.5,
    estimated_minutes: 3
  },
  "Royal Glaxy Hotel": {
    distance_km: 3.7,
    estimated_minutes: 4
  },
  "Sarfaranga view rock Guest house skardu": {
    distance_km: 3.5,
    estimated_minutes: 3
  },
  "Eat and Read Guesthouse skardu": {
    distance_km: 3.4,
    estimated_minutes: 3
  },
  "North Face explorers": {
    distance_km: 3.4,
    estimated_minutes: 3
  },
  "Holiday resort skardu": {
    distance_km: 3.3,
    estimated_minutes: 3
  },
  "Kallisto Resort": {
    distance_km: 3.3,
    estimated_minutes: 3
  },
  "Sagar hotel skardu": {
    distance_km: 3.6,
    estimated_minutes: 3
  },
  "Hotel Elite skardu": {
    distance_km: 3.3,
    estimated_minutes: 3
  },
  "SnowLand Resort": {
    distance_km: 2,
    estimated_minutes: 3
  },
  "Bismillah Guest House": {
    distance_km: 2.1,
    estimated_minutes: 3
  },
  "Hotel Yak sarai": {
    distance_km: 2,
    estimated_minutes: 3
  },
  "The North Palace": {
    distance_km: 2.1,
    estimated_minutes: 3
  },
  "Duqsa Family Guest House": {
    distance_km: 2.3,
    estimated_minutes: 3
  },
  "Wazir's villa": {
    distance_km: 2.8,
    estimated_minutes: 4
  },
  "Hotel Rewaaj": {
    distance_km: 2.9,
    estimated_minutes: 4
  },
  "Comfort Hotel & Huts skardu": {
    distance_km: 2.3,
    estimated_minutes: 4
  },
  "Zam Zam Guest House": {
    distance_km: 2,
    estimated_minutes: 3
  },
  "The Mountain Gypsy Resort": {
    distance_km: 2,
    estimated_minutes: 3
  },
  "Rigo Resort Skardu": {
    distance_km: 3.9,
    estimated_minutes: 6
  },
  "Arish Luxury Sites": {
    distance_km: 2.6,
    estimated_minutes: 4
  },
  "InterContinental Hotel": {
    distance_km: 2.3,
    estimated_minutes: 3
  },
  "Royal fort resort skardu": {
    distance_km: 2.3,
    estimated_minutes: 3
  },
  "Meer Stay and Dine skardu": {
    distance_km: 2.1,
    estimated_minutes: 2
  },
  "Dream Land Guest House": {
    distance_km: 2.8,
    estimated_minutes: 4
  },
  "Hotel GraceLand": {
    distance_km: 2.2,
    estimated_minutes: 3
  },
  "MOUNTAIN MAJESTY INN SKARDU": {
    distance_km: 2.1,
    estimated_minutes: 3
  },
  "Alnoor Lodges": {
    distance_km: 2.1,
    estimated_minutes: 3
  },
  "Jasper House": {
    distance_km: 2.2,
    estimated_minutes: 3
  },
  "The Himalayan Guest House": {
    distance_km: 2.3,
    estimated_minutes: 3
  },
  "Epoch Inn Guest House Skardu": {
    distance_km: 2.4,
    estimated_minutes: 3
  },
  "Mountaindale Guest House": {
    distance_km: 2.5,
    estimated_minutes: 3
  },
  "Al Jannah Guest House Skardu": {
    distance_km: 2.5,
    estimated_minutes: 3
  },
  "Biafo Resort Skardu": {
    distance_km: 2.6,
    estimated_minutes: 3
  },
  "Skardu Blossom Inn": {
    distance_km: 2.6,
    estimated_minutes: 3
  },
  "The Diamond Guest House Skardu": {
    distance_km: 2.7,
    estimated_minutes: 4
  },
  "Anarres | A Creative Residency": {
    distance_km: 3.1,
    estimated_minutes: 4
  },
  "Submit Embassy Hotel": {
    distance_km: 3.2,
    estimated_minutes: 4
  },
  "Alpine Abode Skardu": {
    distance_km: 3.6,
    estimated_minutes: 5
  },
  "Relax Inn Skardu": {
    distance_km: 3.5,
    estimated_minutes: 5
  },
  "Gumaan Resort Skardu": {
    distance_km: 3.7,
    estimated_minutes: 4
  },
  "Yuligo Resort Skardu": {
    distance_km: 3.9,
    estimated_minutes: 5
  },
  "Urban escape resort": {
    distance_km: 1.8,
    estimated_minutes: 3
  },
  "Mohsin Lodge Skardu": {
    distance_km: 1.7,
    estimated_minutes: 3
  },
  "Back To Home Lodging": {
    distance_km: 1.7,
    estimated_minutes: 3
  },
  "Royal Brangsa Guest House": {
    distance_km: 1.5,
    estimated_minutes: 2
  },
  "Wazir Guest House Skardu": {
    distance_km: 1.2,
    estimated_minutes: 2
  },
  "Golden Ibex Guest House": {
    distance_km: 1.1,
    estimated_minutes: 2
  },
  "Up Way Guest House": {
    distance_km: 1.3,
    estimated_minutes: 2
  },
  "Kunlun Peak Inn skardu": {
    distance_km: 1.3,
    estimated_minutes: 2
  },
  "Markhor Hotel": {
    distance_km: 1.4,
    estimated_minutes: 2
  },
  "Tibet hotel skardu": {
    distance_km: 1.8,
    estimated_minutes: 3
  },
  "Alpha Nomads House": {
    distance_km: 1.9,
    estimated_minutes: 3
  },
  "Dirleh Hotel": {
    distance_km: 2,
    estimated_minutes: 4
  },
  "North Home Skardu": {
    distance_km: 2,
    estimated_minutes: 4
  },
  "Valhalla Guest House": {
    distance_km: 2,
    estimated_minutes: 4
  },
  "Creek villa skardu": {
    distance_km: 2,
    estimated_minutes: 4
  },
  "Prince Tourist Hut": {
    distance_km: 1.9,
    estimated_minutes: 4
  },
  "Mountain House": {
    distance_km: 2,
    estimated_minutes: 4
  },
  "Reechan Resort House": {
    distance_km: 1.7,
    estimated_minutes: 3
  },
  "Himalayan Guest House Hassan colony": {
    distance_km: 1.7,
    estimated_minutes: 3
  },
  "Jasmine Skardu": {
    distance_km: 1.8,
    estimated_minutes: 3
  },
  "Mountain Face Skardu": {
    distance_km: 1.9,
    estimated_minutes: 3
  },
  "Four Seasons Bed and Breakfast": {
    distance_km: 1.8,
    estimated_minutes: 3
  },
  "Flora Inn skardu": {
    distance_km: 1.8,
    estimated_minutes: 3
  },
  "Broadpeak Resort skardu": {
    distance_km: 1.9,
    estimated_minutes: 3
  },
  "Chinar Residency": {
    distance_km: 3.1,
    estimated_minutes: 4
  },
  "Buddha Rock Guest House Skardu": {
    distance_km: 3.1,
    estimated_minutes: 4
  },
  "Buddha view Resort skardu": {
    distance_km: 3.2,
    estimated_minutes: 4
  },
  "Moonal Residency": {
    distance_km: 3.3,
    estimated_minutes: 5
  },
  "Skarchan Resort skardu": {
    distance_km: 3.4,
    estimated_minutes: 5
  },
  "ZAGO Guest House": {
    distance_km: 1.4,
    estimated_minutes: 3
  },
  "Skardu Blossom Guest House": {
    distance_km: 1.4,
    estimated_minutes: 3
  },
  "Harpo Resorts": {
    distance_km: 1.4,
    estimated_minutes: 3
  },
  "Baltistan Continental Hotel skardu": {
    distance_km: 0.1,
    estimated_minutes: 1
  },
  "Al Abbas Guest House": {
    distance_km: 0,
    estimated_minutes: 1
  },
  "Apricot Spring Resort Skardu": {
    distance_km: 0.1,
    estimated_minutes: 1
  },
  "Executive Guest House Skardu": {
    distance_km: 0.3,
    estimated_minutes: 1
  },
  "Hotel Bloom Hills,Skardu": {
    distance_km: 1.7,
    estimated_minutes: 3
  },
  "Siachen Stay&Tours": {
    distance_km: 1.5,
    estimated_minutes: 2
  },
  "Mountain Guest House and Desi Restaurant": {
    distance_km: 1.4,
    estimated_minutes: 2
  },
  "Decent Baltistan guest house": {
    distance_km: 1.2,
    estimated_minutes: 2
  },
  "Baltistan Village Guest House": {
    distance_km: 1.2,
    estimated_minutes: 2
  },
  "Bareen": {
    distance_km: 1.1,
    estimated_minutes: 2
  },
  "SUMMIT GUEST HOUSE": {
    distance_km: 1.1,
    estimated_minutes: 2
  },
  "Serene Baltistan Hotel": {
    distance_km: 1,
    estimated_minutes: 2
  },
  "Alpha Hotel & Restaurant": {
    distance_km: 0.7,
    estimated_minutes: 1
  },
  "Saani Rooms": {
    distance_km: 0.6,
    estimated_minutes: 1
  },
  "Ridakh Inn": {
    distance_km: 0.4,
    estimated_minutes: 1
  },
  "Clifton Spachan Hotel": {
    distance_km: 0.3,
    estimated_minutes: 1
  },
  "K2 Tourism Guest House": {
    distance_km: 0.2,
    estimated_minutes: 1
  },
  "Heaven's Adventure.pk": {
    distance_km: 2.6,
    estimated_minutes: 4
  },
  "Desert one hotel and restaurant skardu": {
    distance_km: 2.4,
    estimated_minutes: 3
  },
  "Yazgar Residency Skardu": {
    distance_km: 2.5,
    estimated_minutes: 3
  },
  "The Next Home Skardu": {
    distance_km: 2.5,
    estimated_minutes: 3
  },
  "Heaven Hotel Skardu": {
    distance_km: 2.5,
    estimated_minutes: 3
  },
  "Skardu Midway hotel": {
    distance_km: 3,
    estimated_minutes: 4
  },
  "Sarfaranga Reaidency": {
    distance_km: 3.3,
    estimated_minutes: 4
  },
  "Skengoo Inn Hotel": {
    distance_km: 3.5,
    estimated_minutes: 4
  },
  "Alnoor Starlet Hotel": {
    distance_km: 3.7,
    estimated_minutes: 4
  },
  "Top Hill Resort": {
    distance_km: 4.2,
    estimated_minutes: 5
  },
  "Royal Resort Skardu": {
    distance_km: 3.9,
    estimated_minutes: 4
  },
  "Signature Skardu Hotel": {
    distance_km: 3.9,
    estimated_minutes: 4
  },
  "Shama Resort Skardu": {
    distance_km: 4,
    estimated_minutes: 4
  },
  "Pearl of Skardu Resort": {
    distance_km: 4,
    estimated_minutes: 4
  },
  "Crystal Mountain Lodge": {
    distance_km: 4.2,
    estimated_minutes: 4
  },
  "H A K S RESSORT": {
    distance_km: 4.8,
    estimated_minutes: 5
  },
  "Shaheen Guest House Skardu": {
    distance_km: 5.1,
    estimated_minutes: 5
  },
  "Nirvana Resort Skardu": {
    distance_km: 5.3,
    estimated_minutes: 6
  }
},

  
  "The Food Corridor Skardu": {
     "Sundus Skilgrong": { distance_km: 4.4, estimated_minutes: 14 },
    "Sundus Gond": { distance_km: 5.2, estimated_minutes: 17 },
    "Newranga": { distance_km: 3.9, estimated_minutes: 12 },
    "Katpana": { distance_km: 7.3, estimated_minutes: 22 },
    "Khargrong": { distance_km: 0.7, estimated_minutes: 2 },
    "Hasnain Nagar": { distance_km: 0.75, estimated_minutes: 4 },
    "Alamdar Chowk": { distance_km: 0.5, estimated_minutes: 2 },
    "Hassan Colony": { distance_km: 1.8, estimated_minutes: 7 },
    "Hassan Colony Pine": { distance_km: 1.8, estimated_minutes: 7 },
    "Shinkhani Gond": { distance_km: 1.3, estimated_minutes: 6 },
    "Oldiing Nansoq": { distance_km: 2.5, estimated_minutes: 8 },
    "RHQ Road Harriot Hotel": { distance_km: 1.6, estimated_minutes: 5 },
    "Newranga Near Agha Ali House": { distance_km: 2.1, estimated_minutes: 8 },
    "Newranga ": { distance_km: 4.1, estimated_minutes: 16 },
    "Kushmarah": { distance_km: 3.3, estimated_minutes: 10 },
    "Sherthang Girls High School": { distance_km: 2.2, estimated_minutes: 8 },
    "Marfie Colony": { distance_km: 1.6, estimated_minutes: 6 },
    "Chumik": { distance_km: 1.7, estimated_minutes: 7 },
    "Gamba Skardu": { distance_km: 11, estimated_minutes: 23 },
    "United Line, Hassan Colony": { distance_km: 1.6, estimated_minutes: 6 },
    "Muhib Road Khargrong": { distance_km: 0.85, estimated_minutes: 3 },
    "GB Chief Court Skardu Registry Skardu": { distance_km: 4.3, estimated_minutes: 13 },
    "Shaheen Public School Skardu": { distance_km: 2.6, estimated_minutes: 11 },
    "Mehdi Colony Skardu": { distance_km: 2.7, estimated_minutes: 11 },
    "Agha Hadi Chowk": { distance_km: 0.5, estimated_minutes: 2 },
    "Hussainabad": { distance_km: 6.1, estimated_minutes: 14 },
    "Himalaya Hotel Hussainabad, Skardu": { distance_km: 6.1, estimated_minutes: 14 },
    "Hameed Garh": { distance_km: 1.2, estimated_minutes: 4 },
    "Shaheed colony": { distance_km: 3.9, estimated_minutes: 14 },
    "Tufail colony": { distance_km: 3.2, estimated_minutes: 12 },
    "Jafferi Mohallah": { distance_km: 2.3, estimated_minutes: 9 },
    "Chogo Matamsara": { distance_km: 1.8, estimated_minutes: 8 },
    "Nagulispang Road": { distance_km: 1.1, estimated_minutes: 4 },
    "Eidgah,Sundus ": { distance_km: 2.8, estimated_minutes: 10 },
    "Sukemaidan ": { distance_km: 1.2, estimated_minutes: 4 },
    "Hargissa shakthang": { distance_km: 1.9, estimated_minutes: 7 },
    "Bhutto Bazar Skardu": { distance_km: 1.8, estimated_minutes: 6 },
    "Devision": { distance_km: 2.2, estimated_minutes: 9 },
    "Abbas Town": { distance_km: 1.5, estimated_minutes: 6 },
    "Musa Line": { distance_km: 1.5, estimated_minutes: 6 },
    "Clifton pull": { distance_km: 1.3, estimated_minutes: 5 },
    "Sheikh ijaz masjid": { distance_km: 1.9, estimated_minutes: 7 },
    "Khila Toq Road": { distance_km: 1.2, estimated_minutes: 4 },
    "Public school area": { distance_km: 2.7, estimated_minutes: 9 },
    "Xhathang": { distance_km: 2.8, estimated_minutes: 9 },
    "Brolmo colony sundus": { distance_km: 4.5, estimated_minutes: 16 },
    "Ghazi Colony sundus": { distance_km: 4.8, estimated_minutes: 17 },
    "Hyderabad Gangupi Area": { distance_km: 0.75, estimated_minutes: 3 },
    "LT Col ihsan Ali rd": { distance_km: 0.7, estimated_minutes: 3 },
    "Astana skardu": { distance_km: 4.3, estimated_minutes: 12 },
    "Bintul Huda Girls model school": { distance_km: 5, estimated_minutes: 15 },
    "Brolmo colony astana": { distance_km: 4, estimated_minutes: 13 },
    "Raees mohalla Haji Gam": { distance_km: 2.5, estimated_minutes: 9 },
    "Haji Gam": { distance_km: 1.4, estimated_minutes: 5 },
    "Gulshan e Ali skardu": { distance_km: 1.7, estimated_minutes: 5 },
    "Jamia masjid road": { distance_km: 0.95, estimated_minutes: 3 },
    "Gayool skardu": { distance_km: 5.8, estimated_minutes: 15 },
    "Toqrangah Skardu": { distance_km: 4.2, estimated_minutes: 13 },
    "Maqponsar skardu": { distance_km: 3.7, estimated_minutes: 12 },
    "Newranga road": { distance_km: 3.8, estimated_minutes: 11 },
    "Quaidabad": { distance_km: 2.3, estimated_minutes: 8 },
    "Kharpocho Road": { distance_km: 1.7, estimated_minutes: 7 },
    "Patwal": { distance_km: 0.95, estimated_minutes: 3 },
    "Olding": { distance_km: 2, estimated_minutes: 7 },
    "Karasmathang": { distance_km: 0.95, estimated_minutes: 3 },
    "Kachura": { distance_km: 28, estimated_minutes: 53 },
    "3 talwar chowk": { distance_km: 2.4, estimated_minutes: 6 },
    "Teen talwar chowk": { distance_km: 2.4, estimated_minutes: 6 },
    "Sahara Complex": { distance_km: null, estimated_minutes: null },
    "Ali plaza": { distance_km: 1.4, estimated_minutes: 6 },
    "Radio Pakistan Chowk": { distance_km: 3, estimated_minutes: 10 },
    "Manthal": { distance_km: 4.6, estimated_minutes: 13 },
    
  "Rus Olive Lodge": {
    distance_km: 4.4,
    estimated_minutes: 5
  },
  "Hargisa Resort Skardu": {
    distance_km: 5.4,
    estimated_minutes: 7
  },
  "LOKAL Rooms x Skardu (Katpana Retreat)": {
    distance_km: 5.3,
    estimated_minutes: 6
  },
  "Green Orchard Skardu": {
    distance_km: 3.4,
    estimated_minutes: 4
  },
  "Oasis Resort Katpana Skardu": {
    distance_km: 5.7,
    estimated_minutes: 7
  },
  "Avari Xpress Skardu Hotel": {
    distance_km: 3.8,
    estimated_minutes: 4
  },
  "Hotel Mashabrum Skardu": {
    distance_km: 2.7,
    estimated_minutes: 4
  },
  "Skardu Luxus Hotel": {
    distance_km: 2.7,
    estimated_minutes: 4
  },
  "The Mountain Cottage Skardu": {
    distance_km: 3.1,
    estimated_minutes: 4
  },
  "Summit Hotel Skardu": {
    distance_km: 3,
    estimated_minutes: 4
  },
  "Skardu Saraye Hotel & Resort": {
    distance_km: 3.9,
    estimated_minutes: 6
  },
  "Baltistan Tourist Cottage - Skardu": {
    distance_km: 3.2,
    estimated_minutes: 4
  },
  "Glamp Pakistan": {
    distance_km: 6.7,
    estimated_minutes: 9
  },
  "Montagna Pods": {
    distance_km: 6.8,
    estimated_minutes: 10
  },
  "Hotel Luxy Skardu": {
    distance_km: 4.1,
    estimated_minutes: 4
  },
  "Baltistan Fort, Skardu Resort Hotel": {
    distance_km: 8.7,
    estimated_minutes: 12
  },
  "Hotel Skardu1": {
    distance_km: 2.3,
    estimated_minutes: 3
  },
  "Baltistan Resort": {
    distance_km: 2.3,
    estimated_minutes: 3
  },
  "Skardu Royal Hotel & Restaurant": {
    distance_km: 1.8,
    estimated_minutes: 2
  },
  "Sharif Cottages and Hotel Skardu": {
    distance_km: 5.2,
    estimated_minutes: 5
  },
  "Base Camp Katpana": {
    distance_km: 7.8,
    estimated_minutes: 12
  },
  "Hotel Dewan-e-Khas": {
    distance_km: 1.4,
    estimated_minutes: 3
  },
  "Legend Hotel Skardu": {
    distance_km: 1.7,
    estimated_minutes: 2
  },
  "Northlanders Guest House Skardu": {
    distance_km: 1.2,
    estimated_minutes: 2
  },
  "Hotel Travellodge Skardu": {
    distance_km: 1.3,
    estimated_minutes: 2
  },
  "Qayam Skardu": {
    distance_km: 6,
    estimated_minutes: 6
  },
  "Rafsal A Countryside Cottage": {
    distance_km: 6.2,
    estimated_minutes: 8
  },
  "Kentish Lodge Skardu": {
    distance_km: 1.1,
    estimated_minutes: 2
  },
  "Skardu Villas": {
    distance_km: 6.4,
    estimated_minutes: 6
  },
  "The Cherry Courtyard": {
    distance_km: 6.5,
    estimated_minutes: 6
  },
  "Ringchan Guest House & Restaurant": {
    distance_km: 1.3,
    estimated_minutes: 2
  },
  "Skardu Lodge": {
    distance_km: 0.9,
    estimated_minutes: 1
  },
  "Karakoram Nest": {
    distance_km: 1.5,
    estimated_minutes: 2
  },
  "Dynasty Skardu": {
    distance_km: 6.8,
    estimated_minutes: 7
  },
  "Sehrish Guest House Skardu": {
    distance_km: 0.8,
    estimated_minutes: 2
  },
  "PTDC Motel Skardu": {
    distance_km: 1.5,
    estimated_minutes: 2
  },
  "Hotel Reego Skardu": {
    distance_km: 0.2,
    estimated_minutes: 1
  },
  "Lavender Cottage & Guest House": {
    distance_km: 0.8,
    estimated_minutes: 2
  },
  "Rock View Skardu": {
    distance_km: 0.8,
    estimated_minutes: 2
  },
  "Dream Guest House Haji Gam Chowk": {
    distance_km: 1.2,
    estimated_minutes: 2
  },
  "Indus Lodges Skardu": {
    distance_km: 1.6,
    estimated_minutes: 2
  },
  "Pacific Guest House Skardu": {
    distance_km: 2.2,
    estimated_minutes: 3
  },
  "Skardu View Point Hotel and Huts": {
    distance_km: 2.2,
    estimated_minutes: 3
  },
  "Khar Hotel Skardu": {
    distance_km: 1.4,
    estimated_minutes: 2
  },
  "HIKK Inn Skardu": {
    distance_km: 2.2,
    estimated_minutes: 3
  },
  "Taaj Residence Skardu": {
    distance_km: 1.3,
    estimated_minutes: 2
  },
  "Homeland Guest House Skardu": {
    distance_km: 0.7,
    estimated_minutes: 1
  },
  "Sultan Guest House Skardu": {
    distance_km: 1.6,
    estimated_minutes: 3
  },
  "The Hill Town Resort": {
    distance_km: 2.4,
    estimated_minutes: 3
  },
  "AlJannah Guest House Skardu": {
    distance_km: 2.3,
    estimated_minutes: 3
  },
  "Deosai Gateway Inn Skardu": {
    distance_km: 2.3,
    estimated_minutes: 3
  },
  "Skardu Arcadian Resort": {
    distance_km: 9.4,
    estimated_minutes: 11
  },
  "Areena Hotel Skardu": {
    distance_km: 1.4,
    estimated_minutes: 2
  },
  "Skardu Farmhouse for stay": {
    distance_km: 2.9,
    estimated_minutes: 3
  },
  "Adventure Sarai Hotel Skardu": {
    distance_km: 2.4,
    estimated_minutes: 3
  },
  "Maple Resort": {
    distance_km: 13,
    estimated_minutes: 15
  },
  "Candela Resorts": {
    distance_km: 3.3,
    estimated_minutes: 3
  },
  "Hispar Hotel Skardu": {
    distance_km: 3.3,
    estimated_minutes: 4
  },
  "K2 Paradise Guest House": {
    distance_km: 2.2,
    estimated_minutes: 2
  },
  "Holiday Mountain Resort & Camping Site": {
    distance_km: 3.8,
    estimated_minutes: 5
  },
  "Mountain Lodge Skardu": {
    distance_km: 3.8,
    estimated_minutes: 5
  },
  "Mulberry Continental Hotel Skardu": {
    distance_km: 11.5,
    estimated_minutes: 10
  },
  "PC Legacy Skardu": {
    distance_km: 11.6,
    estimated_minutes: 10
  },
  "GB Lodges": {
    distance_km: 12.4,
    estimated_minutes: 11
  },
  "Bilafond Cottage": {
    distance_km: 7.2,
    estimated_minutes: 9
  },
  "North Hills Skardu": {
    distance_km: 1.3,
    estimated_minutes: 2
  },
  "Pinnacle Executive Lodges": {
    distance_km: 13,
    estimated_minutes: 11
  },
  "Safena Hotel Skardu": {
    distance_km: 15.7,
    estimated_minutes: 13
  },
  "Byarsa Hotel Skardu": {
    distance_km: 25.6,
    estimated_minutes: 21
  },
  "Dream Nest Resort Hotels Skardu": {
    distance_km: 34.2,
    estimated_minutes: 35
  },
  "Stream view guest house skardu": {
    distance_km: 1.8,
    estimated_minutes: 3
  },
  "Shangrila Resort Skardu": {
    distance_km: 26.5,
    estimated_minutes: 24
  },
  "Kachura Inn Skardu": {
    distance_km: 31.4,
    estimated_minutes: 28
  },
  "Tibet Hotel Kachura Skardu": {
    distance_km: 29.8,
    estimated_minutes: 25
  },
  "Hotel Mountain Lagoon Skardu": {
    distance_km: 26.9,
    estimated_minutes: 26
  },
  "Skardu River Resort": {
    distance_km: 27.1,
    estimated_minutes: 26
  },
  "Morning Resort": {
    distance_km: 30.3,
    estimated_minutes: 25
  },
  "Hotel Desert Bloom Skardu": {
    distance_km: 4.6,
    estimated_minutes: 5
  },
  "TheQue Skardu": {
    distance_km: 30.8,
    estimated_minutes: 26
  },
  "Singay Homestay Skardu": {
    distance_km: 1.8,
    estimated_minutes: 3
  },
  "Baltistan Crown Resort": {
    distance_km: 6.6,
    estimated_minutes: 7
  },
  "Fatah inn Guest House": {
    distance_km: 6.8,
    estimated_minutes: 8
  },
  "Kunhar": {
    distance_km: 6.5,
    estimated_minutes: 6
  },
  "Maltoro guest house": {
    distance_km: 6.5,
    estimated_minutes: 6
  },
  "Apex Hotels and Resorts Skardu": {
    distance_km: 6.6,
    estimated_minutes: 6
  },
  "Hotel virsa": {
    distance_km: 6.6,
    estimated_minutes: 6
  },
  "Elli's Luxus": {
    distance_km: 7.3,
    estimated_minutes: 7
  },
  "Skardu Gateway Hotel & Restaurant": {
    distance_km: 7.3,
    estimated_minutes: 7
  },
  "Polo Land Hotel by Skyline": {
    distance_km: 7.4,
    estimated_minutes: 7
  },
  "Baltistan White House Hotel": {
    distance_km: 7.7,
    estimated_minutes: 7
  },
  "The Pioneer Hotel": {
    distance_km: 7.8,
    estimated_minutes: 7
  },
  "Ramovi Guest House": {
    distance_km: 7.9,
    estimated_minutes: 7
  },
  "Friends & Family Guest House": {
    distance_km: 8.3,
    estimated_minutes: 7
  },
  "SKY LAKE GUEST HOUSE": {
    distance_km: 8.5,
    estimated_minutes: 8
  },
  "Skardu bliss hotel": {
    distance_km: 9.8,
    estimated_minutes: 9
  },
  "Comfort inn hotel": {
    distance_km: 9.8,
    estimated_minutes: 9
  },
  "Grand Hotel Skardu": {
    distance_km: 10.1,
    estimated_minutes: 9
  },
  "Baltistan inn hotel": {
    distance_km: 10.3,
    estimated_minutes: 9
  },
  "Grand view hotel": {
    distance_km: 10.3,
    estimated_minutes: 9
  },
  "Hotel walnut": {
    distance_km: 11.3,
    estimated_minutes: 10
  },
  "ABC hotel": {
    distance_km: 11.5,
    estimated_minutes: 10
  },
  "Lashari Resort Skardu": {
    distance_km: 11.6,
    estimated_minutes: 10
  },
  "Melody Hills Skardu": {
    distance_km: 11.9,
    estimated_minutes: 10
  },
  "NJM House Near Skardu Airport": {
    distance_km: 11.9,
    estimated_minutes: 10
  },
  "Le Yurt Skardu": {
    distance_km: 12.1,
    estimated_minutes: 10
  },
  "FearLess lodge": {
    distance_km: 13.3,
    estimated_minutes: 13
  },
  "Wamiq Skardu Resort": {
    distance_km: 16,
    estimated_minutes: 15
  },
  "Hosho Guest House": {
    distance_km: 14.7,
    estimated_minutes: 12
  },
  "Orgventure Resorts Skardu": {
    distance_km: 16,
    estimated_minutes: 13
  },
  "Green orchard skardu": {
    distance_km: 3.4,
    estimated_minutes: 4
  },
  "Mount View hotel skardu": {
    distance_km: 3.2,
    estimated_minutes: 4
  },
  "Laal Haveli": {
    distance_km: 3.1,
    estimated_minutes: 4
  },
  "Skardu view Guest house": {
    distance_km: 3,
    estimated_minutes: 4
  },
  "Baltistan Mountain Chalet Hotel": {
    distance_km: 2.9,
    estimated_minutes: 4
  },
  "Hotel Five star & restaurant skardu": {
    distance_km: 2.9,
    estimated_minutes: 4
  },
  "Tufail palace hotel & restaurant": {
    distance_km: 2.8,
    estimated_minutes: 4
  },
  "Indus motel": {
    distance_km: 2.6,
    estimated_minutes: 3
  },
  "Paradise hotel": {
    distance_km: 2.4,
    estimated_minutes: 3
  },
  "Hotel Red sun": {
    distance_km: 2.4,
    estimated_minutes: 3
  },
  "Haks hotel": {
    distance_km: 2.3,
    estimated_minutes: 3
  },
  "Hotel inn skardu": {
    distance_km: 2.3,
    estimated_minutes: 3
  },
  "Skardu embassy hotel": {
    distance_km: 2.2,
    estimated_minutes: 3
  },
  "Hotel Delight Skardu": {
    distance_km: 2.2,
    estimated_minutes: 3
  },
  "Ayan Hotel": {
    distance_km: 1.7,
    estimated_minutes: 2
  },
  "Hotel Highlander inn": {
    distance_km: 1.4,
    estimated_minutes: 2
  },
  "The North face inn hotel skardu": {
    distance_km: 1.6,
    estimated_minutes: 2
  },
  "The yak Hotel skardu": {
    distance_km: 1.6,
    estimated_minutes: 2
  },
  "Indus lodge skardu": {
    distance_km: 1.6,
    estimated_minutes: 2
  },
  "Stay inn hotel": {
    distance_km: 1.6,
    estimated_minutes: 2
  },
  "Eden Rock skardu": {
    distance_km: 1.7,
    estimated_minutes: 2
  },
  "Concordia Motel Baltistan": {
    distance_km: 1.9,
    estimated_minutes: 2
  },
  "Harriot Skardu": {
    distance_km: 2.4,
    estimated_minutes: 2
  },
  "Hotel PeakNest": {
    distance_km: 2.4,
    estimated_minutes: 3
  },
  "Royal Glaxy Hotel": {
    distance_km: 2.6,
    estimated_minutes: 3
  },
  "Sarfaranga view rock Guest house skardu": {
    distance_km: 2.4,
    estimated_minutes: 2
  },
  "Eat and Read Guesthouse skardu": {
    distance_km: 2.3,
    estimated_minutes: 2
  },
  "North Face explorers": {
    distance_km: 2.3,
    estimated_minutes: 2
  },
  "Holiday resort skardu": {
    distance_km: 2.3,
    estimated_minutes: 2
  },
  "Kallisto Resort": {
    distance_km: 2.2,
    estimated_minutes: 2
  },
  "Sagar hotel skardu": {
    distance_km: 2.5,
    estimated_minutes: 2
  },
  "Hotel Elite skardu": {
    distance_km: 2.2,
    estimated_minutes: 2
  },
  "SnowLand Resort": {
    distance_km: 3,
    estimated_minutes: 4
  },
  "Bismillah Guest House": {
    distance_km: 3.1,
    estimated_minutes: 4
  },
  "Hotel Yak sarai": {
    distance_km: 3.1,
    estimated_minutes: 4
  },
  "The North Palace": {
    distance_km: 3.1,
    estimated_minutes: 4
  },
  "Duqsa Family Guest House": {
    distance_km: 3.4,
    estimated_minutes: 4
  },
  "Wazir's villa": {
    distance_km: 3.4,
    estimated_minutes: 5
  },
  "Hotel Rewaaj": {
    distance_km: 3.2,
    estimated_minutes: 4
  },
  "Comfort Hotel & Huts skardu": {
    distance_km: 2.7,
    estimated_minutes: 3
  },
  "Zam Zam Guest House": {
    distance_km: 2.4,
    estimated_minutes: 3
  },
  "The Mountain Gypsy Resort": {
    distance_km: 2.5,
    estimated_minutes: 3
  },
  "Rigo Resort Skardu": {
    distance_km: 3.6,
    estimated_minutes: 5
  },
  "Arish Luxury Sites": {
    distance_km: 1.6,
    estimated_minutes: 3
  },
  "InterContinental Hotel": {
    distance_km: 1.2,
    estimated_minutes: 2
  },
  "Royal fort resort skardu": {
    distance_km: 1.3,
    estimated_minutes: 2
  },
  "Meer Stay and Dine skardu": {
    distance_km: 1.1,
    estimated_minutes: 2
  },
  "Dream Land Guest House": {
    distance_km: 1.7,
    estimated_minutes: 3
  },
  "Hotel GraceLand": {
    distance_km: 1.2,
    estimated_minutes: 2
  },
  "MOUNTAIN MAJESTY INN SKARDU": {
    distance_km: 1.6,
    estimated_minutes: 2
  },
  "Alnoor Lodges": {
    distance_km: 1.8,
    estimated_minutes: 2
  },
  "Jasper House": {
    distance_km: 2,
    estimated_minutes: 3
  },
  "The Himalayan Guest House": {
    distance_km: 2.1,
    estimated_minutes: 2
  },
  "Epoch Inn Guest House Skardu": {
    distance_km: 2.2,
    estimated_minutes: 3
  },
  "Mountaindale Guest House": {
    distance_km: 2.2,
    estimated_minutes: 3
  },
  "Al Jannah Guest House Skardu": {
    distance_km: 2.3,
    estimated_minutes: 3
  },
  "Biafo Resort Skardu": {
    distance_km: 2.3,
    estimated_minutes: 3
  },
  "Skardu Blossom Inn": {
    distance_km: 2.3,
    estimated_minutes: 3
  },
  "The Diamond Guest House Skardu": {
    distance_km: 2.5,
    estimated_minutes: 3
  },
  "Anarres | A Creative Residency": {
    distance_km: 2.9,
    estimated_minutes: 3
  },
  "Submit Embassy Hotel": {
    distance_km: 2.9,
    estimated_minutes: 3
  },
  "Alpine Abode Skardu": {
    distance_km: 3.3,
    estimated_minutes: 4
  },
  "Relax Inn Skardu": {
    distance_km: 3.3,
    estimated_minutes: 4
  },
  "Gumaan Resort Skardu": {
    distance_km: 3.4,
    estimated_minutes: 4
  },
  "Yuligo Resort Skardu": {
    distance_km: 3.7,
    estimated_minutes: 4
  },
  "Urban escape resort": {
    distance_km: 1.3,
    estimated_minutes: 2
  },
  "Mohsin Lodge Skardu": {
    distance_km: 1.4,
    estimated_minutes: 2
  },
  "Back To Home Lodging": {
    distance_km: 1.4,
    estimated_minutes: 2
  },
  "Royal Brangsa Guest House": {
    distance_km: 0.9,
    estimated_minutes: 2
  },
  "Wazir Guest House Skardu": {
    distance_km: 0.6,
    estimated_minutes: 1
  },
  "Golden Ibex Guest House": {
    distance_km: 0.5,
    estimated_minutes: 1
  },
  "Up Way Guest House": {
    distance_km: 0.7,
    estimated_minutes: 1
  },
  "Kunlun Peak Inn skardu": {
    distance_km: 1.2,
    estimated_minutes: 2
  },
  "Markhor Hotel": {
    distance_km: 1.4,
    estimated_minutes: 2
  },
  "Tibet hotel skardu": {
    distance_km: 1.7,
    estimated_minutes: 3
  },
  "Alpha Nomads House": {
    distance_km: 1.8,
    estimated_minutes: 3
  },
  "Dirleh Hotel": {
    distance_km: 2.6,
    estimated_minutes: 4
  },
  "North Home Skardu": {
    distance_km: 2.6,
    estimated_minutes: 4
  },
  "Valhalla Guest House": {
    distance_km: 1.9,
    estimated_minutes: 4
  },
  "Creek villa skardu": {
    distance_km: 2,
    estimated_minutes: 4
  },
  "Prince Tourist Hut": {
    distance_km: 2.3,
    estimated_minutes: 4
  },
  "Mountain House": {
    distance_km: 2.4,
    estimated_minutes: 4
  },
  "Reechan Resort House": {
    distance_km: 2.1,
    estimated_minutes: 3
  },
  "Himalayan Guest House Hassan colony": {
    distance_km: 2.1,
    estimated_minutes: 3
  },
  "Jasmine Skardu": {
    distance_km: 2.2,
    estimated_minutes: 3
  },
  "Mountain Face Skardu": {
    distance_km: 2.3,
    estimated_minutes: 4
  },
  "Four Seasons Bed and Breakfast": {
    distance_km: 2.2,
    estimated_minutes: 3
  },
  "Flora Inn skardu": {
    distance_km: 2.2,
    estimated_minutes: 3
  },
  "Broadpeak Resort skardu": {
    distance_km: 2.3,
    estimated_minutes: 3
  },
  "Chinar Residency": {
    distance_km: 2.8,
    estimated_minutes: 3
  },
  "Buddha Rock Guest House Skardu": {
    distance_km: 2.9,
    estimated_minutes: 3
  },
  "Buddha view Resort skardu": {
    distance_km: 2.9,
    estimated_minutes: 4
  },
  "Moonal Residency": {
    distance_km: 3.1,
    estimated_minutes: 4
  },
  "Skarchan Resort skardu": {
    distance_km: 3.2,
    estimated_minutes: 4
  },
  "ZAGO Guest House": {
    distance_km: 1.8,
    estimated_minutes: 3
  },
  "Skardu Blossom Guest House": {
    distance_km: 1.8,
    estimated_minutes: 3
  },
  "Harpo Resorts": {
    distance_km: 1.8,
    estimated_minutes: 3
  },
  "Baltistan Continental Hotel skardu": {
    distance_km: 1.1,
    estimated_minutes: 2
  },
  "Al Abbas Guest House": {
    distance_km: 1.1,
    estimated_minutes: 1
  },
  "Apricot Spring Resort Skardu": {
    distance_km: 1,
    estimated_minutes: 1
  },
  "Executive Guest House Skardu": {
    distance_km: 1,
    estimated_minutes: 1
  },
  "Hotel Bloom Hills,Skardu": {
    distance_km: 2.7,
    estimated_minutes: 3
  },
  "Siachen Stay&Tours": {
    distance_km: 2.6,
    estimated_minutes: 3
  },
  "Mountain Guest House and Desi Restaurant": {
    distance_km: 2.4,
    estimated_minutes: 3
  },
  "Decent Baltistan guest house": {
    distance_km: 2.3,
    estimated_minutes: 3
  },
  "Baltistan Village Guest House": {
    distance_km: 2.2,
    estimated_minutes: 3
  },
  "Bareen": {
    distance_km: 2.2,
    estimated_minutes: 3
  },
  "SUMMIT GUEST HOUSE": {
    distance_km: 2.1,
    estimated_minutes: 3
  },
  "Serene Baltistan Hotel": {
    distance_km: 2.1,
    estimated_minutes: 3
  },
  "Alpha Hotel & Restaurant": {
    distance_km: 1.7,
    estimated_minutes: 2
  },
  "Saani Rooms": {
    distance_km: 1.7,
    estimated_minutes: 2
  },
  "Ridakh Inn": {
    distance_km: 1.4,
    estimated_minutes: 2
  },
  "Clifton Spachan Hotel": {
    distance_km: 1.3,
    estimated_minutes: 2
  },
  "K2 Tourism Guest House": {
    distance_km: 1.3,
    estimated_minutes: 2
  },
  "Heaven's Adventure.pk": {
    distance_km: 3.6,
    estimated_minutes: 5
  },
  "Desert one hotel and restaurant skardu": {
    distance_km: 3.4,
    estimated_minutes: 4
  },
  "Yazgar Residency Skardu": {
    distance_km: 3.5,
    estimated_minutes: 4
  },
  "The Next Home Skardu": {
    distance_km: 3.5,
    estimated_minutes: 4
  },
  "Heaven Hotel Skardu": {
    distance_km: 3.5,
    estimated_minutes: 4
  },
  "Skardu Midway hotel": {
    distance_km: 4,
    estimated_minutes: 4
  },
  "Sarfaranga Reaidency": {
    distance_km: 4.4,
    estimated_minutes: 5
  },
  "Skengoo Inn Hotel": {
    distance_km: 4.5,
    estimated_minutes: 5
  },
  "Alnoor Starlet Hotel": {
    distance_km: 4.7,
    estimated_minutes: 5
  },
  "Top Hill Resort": {
    distance_km: 5.3,
    estimated_minutes: 6
  },
  "Royal Resort Skardu": {
    distance_km: 4.9,
    estimated_minutes: 5
  },
  "Signature Skardu Hotel": {
    distance_km: 5,
    estimated_minutes: 5
  },
  "Shama Resort Skardu": {
    distance_km: 5,
    estimated_minutes: 5
  },
  "Pearl of Skardu Resort": {
    distance_km: 5,
    estimated_minutes: 5
  },
  "Crystal Mountain Lodge": {
    distance_km: 5.2,
    estimated_minutes: 5
  },
  "H A K S RESSORT": {
    distance_km: 5.8,
    estimated_minutes: 6
  },
  "Shaheen Guest House Skardu": {
    distance_km: 6.1,
    estimated_minutes: 6
  },
  "Nirvana Resort Skardu": {
    distance_km: 6.4,
    estimated_minutes: 6
  }

  },
    "Sungum Hotel Restaurant Skardu ": {
    "Sundus Skilgrong": { distance_km: 4.1, estimated_minutes: 13 },
    "Sundus Gond": { distance_km: 4.9, estimated_minutes: 16 },
    "Newranga": { distance_km: 3.7, estimated_minutes: 11 },
    "Katpana": { distance_km: 7.5, estimated_minutes: 22 },
    "Khargrong": { distance_km: 0.95, estimated_minutes: 3 },
    "Hasnain Nagar": { distance_km: 0.55, estimated_minutes: 2 },
    "Alamdar Chowk": { distance_km: 0.22, estimated_minutes: 1 },
    "Hassan Colony": { distance_km: 6.6, estimated_minutes: 24 },
    "Hassan Colony Pine": { distance_km: 1.5, estimated_minutes: 7 },
    "Shinkhani Gond": { distance_km: 1.9, estimated_minutes: 5 },
    "Oldiing Nansoq": { distance_km: 2.8, estimated_minutes: 8 },
    "RHQ Road Harriot Hotel": { distance_km: 1.9, estimated_minutes: 6 },
    "Newranga Near Agha Ali House": { distance_km: 1.8, estimated_minutes: 7 },
    "Newranga ": { distance_km: 3.7, estimated_minutes: 11 },
    "Kushmarah": { distance_km: 3.0, estimated_minutes: 9 },
    "Sherthang Girls High School": { distance_km: 2, estimated_minutes: 7 },
    "Marfie Colony": { distance_km: 1.7, estimated_minutes: 7 },
    "Chumik": { distance_km: 1.5, estimated_minutes: 6 },
    "Gamba Skardu": { distance_km: 11, estimated_minutes: 22 },
    "United Line, Hassan Colony": { distance_km: 1.3, estimated_minutes: 5 },
    "Muhib Road Khargrong": { distance_km: 1.1, estimated_minutes: 4 },
    "GB Chief Court Skardu Registry Skardu": { distance_km: 4.1, estimated_minutes: 12 },
    "Shaheen Public School Skardu": { distance_km: 2.3, estimated_minutes: 10 },
    "Mehdi Colony Skardu": { distance_km: 2.5, estimated_minutes: 10 },
    "Agha Hadi Chowk": { distance_km: 0.75, estimated_minutes: 3 },
    "Hussainabad": { distance_km: 6.4, estimated_minutes: 15 },
    "Himalaya Hotel Hussainabad, Skardu": { distance_km: 6.4, estimated_minutes: 15 },
    "Hameed Garh": { distance_km: 1.5, estimated_minutes: 5 },
    "Shaheed colony": { distance_km: 3.6, estimated_minutes: 13 },
    "Tufail colony": { distance_km: 2.9, estimated_minutes: 11 },
    "Jafferi Mohallah": { distance_km: 2, estimated_minutes: 8 },
    "Chogo Matamsara": { distance_km: 1.7, estimated_minutes: 7 },
    "Nagulispang Road": { distance_km: 0.8, estimated_minutes: 3 },
    "Eidgah,Sundus ": { distance_km: 3.7, estimated_minutes: 13 },
    "Sukemaidan ": { distance_km: 0.95, estimated_minutes: 3 },
    "Hargissa shakthang": { distance_km: 1.6, estimated_minutes: 7 },
    "Bhutto Bazar Skardu": { distance_km: 1.5, estimated_minutes: 5 },
    "Devision": { distance_km: 2.3, estimated_minutes: 9 },
    "Abbas Town": { distance_km: 1.8, estimated_minutes: 6 },
    "Musa Line": { distance_km: 1.3, estimated_minutes: 5 },
    "Clifton pull": { distance_km: 1, estimated_minutes: 4 },
    "Sheikh ijaz masjid": { distance_km: 1.6, estimated_minutes: 6 },
    "Khila Toq Road": { distance_km: 1.5, estimated_minutes: 5 },
    "Public school area": { distance_km: 2.6, estimated_minutes: 8 },
    "Xhathang": { distance_km: 2.8, estimated_minutes: 9 },
    "Brolmo colony sundus": { distance_km: 4.2, estimated_minutes: 15 },
    "Ghazi Colony sundus": { distance_km: 4.6, estimated_minutes: 16 },
    "Hyderabad Gangupi Area": { distance_km: 0.6, estimated_minutes: 2 },
    "LT Col ihsan Ali rd": { distance_km: 0.45, estimated_minutes: 2 },
    "Astana skardu": { distance_km: 4, estimated_minutes: 12 },
    "Bintul Huda Girls model school": { distance_km: 4.7, estimated_minutes: 14 },
    "Brolmo colony astana": { distance_km: 3.7, estimated_minutes: 12 },
    "Raees mohalla Haji Gam": { distance_km: 2.2, estimated_minutes: 8 },
    "Haji Gam": { distance_km: 1.4, estimated_minutes: 5 },
    "Gulshan e Ali skardu": { distance_km: 2, estimated_minutes: 6 },
    "Jamia masjid road": { distance_km: 0.75, estimated_minutes: 3 },
    "Gayool skardu": { distance_km: 5.6, estimated_minutes: 14 },
    "Toqrangah Skardu": { distance_km: 3.9, estimated_minutes: 13 },
    "Maqponsar skardu": { distance_km: 3.4, estimated_minutes: 12 },
    "Newranga road": { distance_km: 3.5, estimated_minutes: 10 },
    "Quaidabad": { distance_km: 2, estimated_minutes: 7 },
    "Kharpocho Road": { distance_km: 1.5, estimated_minutes: 7 },
    "Patwal": { distance_km: 1.2, estimated_minutes: 4 },
    "Olding": { distance_km: 2.2, estimated_minutes: 8 },
    "Karasmathang": { distance_km: 1.2, estimated_minutes: 4 },
    "Kachura": { distance_km: 2.6, estimated_minutes: 9 },
    "3 talwar chowk": { distance_km: 2.7, estimated_minutes: 7 },
    "Teen talwar chowk": { distance_km: 2.7, estimated_minutes: 7 },
    "Sahara Complex": { distance_km: 2.3, estimated_minutes: 7 },
    "Ali plaza": { distance_km: 1.4, estimated_minutes: 5 },
    "Radio Pakistan Chowk": { distance_km: 2.7, estimated_minutes: 9 },
    "Manthal": { distance_km: 4.6, estimated_minutes: 13 },
    "Rus Olive Lodge": {
      distance_km: 4.1,
      estimated_minutes: 5
    },
    "Hargisa Resort Skardu": {
      distance_km: 5.1,
      estimated_minutes: 7
    },
    "LOKAL Rooms x Skardu (Katpana Retreat)": {
      distance_km: 5,
      estimated_minutes: 6
    },
    "Green Orchard Skardu": {
      distance_km: 3.2,
      estimated_minutes: 4
    },
    "Oasis Resort Katpana Skardu": {
      distance_km: 5.4,
      estimated_minutes: 7
    },
    "Avari Xpress Skardu Hotel": {
      distance_km: 3.5,
      estimated_minutes: 4
    },
    "Hotel Mashabrum Skardu": {
      distance_km: 2.4,
      estimated_minutes: 3
    },
    "Skardu Luxus Hotel": {
      distance_km: 2.4,
      estimated_minutes: 3
    },
    "The Mountain Cottage Skardu": {
      distance_km: 2.8,
      estimated_minutes: 4
    },
    "Summit Hotel Skardu": {
      distance_km: 2.7,
      estimated_minutes: 3
    },
    "Skardu Saraye Hotel & Resort": {
      distance_km: 3.6,
      estimated_minutes: 6
    },
    "Baltistan Tourist Cottage - Skardu": {
      distance_km: 3,
      estimated_minutes: 4
    },
    "Glamp Pakistan": {
      distance_km: 6.4,
      estimated_minutes: 9
    },
    "Montagna Pods": {
      distance_km: 6.6,
      estimated_minutes: 9
    },
    "Hotel Luxy Skardu": {
      distance_km: 3.8,
      estimated_minutes: 4
    },
    "Baltistan Fort, Skardu Resort Hotel": {
      distance_km: 8.4,
      estimated_minutes: 12
    },
    "Hotel Skardu1": {
      distance_km: 2,
      estimated_minutes: 3
    },
    "Baltistan Resort": {
      distance_km: 2,
      estimated_minutes: 3
    },
    "Skardu Royal Hotel & Restaurant": {
      distance_km: 1.5,
      estimated_minutes: 2
    },
    "Sharif Cottages and Hotel Skardu": {
      distance_km: 4.9,
      estimated_minutes: 5
    },
    "Base Camp Katpana": {
      distance_km: 7.5,
      estimated_minutes: 12
    },
    "Hotel Dewan-e-Khas": {
      distance_km: 1.2,
      estimated_minutes: 3
    },
    "Legend Hotel Skardu": {
      distance_km: 1.1,
      estimated_minutes: 2
    },
    "Northlanders Guest House Skardu": {
      distance_km: 1,
      estimated_minutes: 2
    },
    "Hotel Travellodge Skardu": {
      distance_km: 1,
      estimated_minutes: 2
    },
    "Qayam Skardu": {
      distance_km: 5.8,
      estimated_minutes: 6
    },
    "Rafsal A Countryside Cottage": {
      distance_km: 5.9,
      estimated_minutes: 8
    },
    "Kentish Lodge Skardu": {
      distance_km: 0.8,
      estimated_minutes: 1
    },
    "Skardu Villas": {
      distance_km: 6.1,
      estimated_minutes: 6
    },
    "The Cherry Courtyard": {
      distance_km: 6.2,
      estimated_minutes: 6
    },
    "Ringchan Guest House & Restaurant": {
      distance_km: 1.5,
      estimated_minutes: 2
    },
    "Skardu Lodge": {
      distance_km: 1.2,
      estimated_minutes: 2
    },
    "Karakoram Nest": {
      distance_km: 1.8,
      estimated_minutes: 2
    },
    "Dynasty Skardu": {
      distance_km: 6.5,
      estimated_minutes: 7
    },
    "Sehrish Guest House Skardu": {
      distance_km: 0.6,
      estimated_minutes: 2
    },
    "PTDC Motel Skardu": {
      distance_km: 1.8,
      estimated_minutes: 2
    },
    "Hotel Reego Skardu": {
      distance_km: 0.5,
      estimated_minutes: 1
    },
    "Lavender Cottage & Guest House": {
      distance_km: 0.6,
      estimated_minutes: 2
    },
    "Rock View Skardu": {
      distance_km: 0.6,
      estimated_minutes: 1
    },
    "Dream Guest House Haji Gam Chowk": {
      distance_km: 1,
      estimated_minutes: 2
    },
    "Indus Lodges Skardu": {
      distance_km: 1.9,
      estimated_minutes: 2
    },
    "Pacific Guest House Skardu": {
      distance_km: 1.9,
      estimated_minutes: 3
    },
    "Skardu View Point Hotel and Huts": {
      distance_km: 1.9,
      estimated_minutes: 3
    },
    "Khar Hotel Skardu": {
      distance_km: 1,
      estimated_minutes: 2
    },
    "HIKK Inn Skardu": {
      distance_km: 1.9,
      estimated_minutes: 3
    },
    "Taaj Residence Skardu": {
      distance_km: 1.6,
      estimated_minutes: 2
    },
    "Homeland Guest House Skardu": {
      distance_km: 1,
      estimated_minutes: 1
    },
    "Sultan Guest House Skardu": {
      distance_km: 1.3,
      estimated_minutes: 2
    },
    "The Hill Town Resort": {
      distance_km: 1.7,
      estimated_minutes: 3
    },
    "AlJannah Guest House Skardu": {
      distance_km: 2.5,
      estimated_minutes: 3
    },
    "Deosai Gateway Inn Skardu": {
      distance_km: 2.6,
      estimated_minutes: 3
    },
    "Skardu Arcadian Resort": {
      distance_km: 9.1,
      estimated_minutes: 10
    },
    "Areena Hotel Skardu": {
      distance_km: 1.7,
      estimated_minutes: 2
    },
    "Skardu Farmhouse for stay": {
      distance_km: 3.2,
      estimated_minutes: 3
    },
    "Adventure Sarai Hotel Skardu": {
      distance_km: 2.3,
      estimated_minutes: 3
    },
    "Maple Resort": {
      distance_km: 12.7,
      estimated_minutes: 15
    },
    "Candela Resorts": {
      distance_km: 3.6,
      estimated_minutes: 4
    },
    "Hispar Hotel Skardu": {
      distance_km: 3.6,
      estimated_minutes: 4
    },
    "K2 Paradise Guest House": {
      distance_km: 2.5,
      estimated_minutes: 2
    },
    "Holiday Mountain Resort & Camping Site": {
      distance_km: 4.1,
      estimated_minutes: 5
    },
    "Mountain Lodge Skardu": {
      distance_km: 4.1,
      estimated_minutes: 5
    },
    "Mulberry Continental Hotel Skardu": {
      distance_km: 11.2,
      estimated_minutes: 9
    },
    "PC Legacy Skardu": {
      distance_km: 11.3,
      estimated_minutes: 10
    },
    "GB Lodges": {
      distance_km: 12.1,
      estimated_minutes: 11
    },
    "Bilafond Cottage": {
      distance_km: 7.5,
      estimated_minutes: 9
    },
    "North Hills Skardu": {
      distance_km: 1.6,
      estimated_minutes: 2
    },
    "Pinnacle Executive Lodges": {
      distance_km: 12.7,
      estimated_minutes: 11
    },
    "Safena Hotel Skardu": {
      distance_km: 15.4,
      estimated_minutes: 12
    },
    "Byarsa Hotel Skardu": {
      distance_km: 25.4,
      estimated_minutes: 21
    },
    "Dream Nest Resort Hotels Skardu": {
      distance_km: 33.9,
      estimated_minutes: 35
    },
    "Stream view guest house skardu": {
      distance_km: 1.5,
      estimated_minutes: 3
    },
    "Shangrila Resort Skardu": {
      distance_km: 26.3,
      estimated_minutes: 24
    },
    "Kachura Inn Skardu": {
      distance_km: 31.1,
      estimated_minutes: 28
    },
    "Tibet Hotel Kachura Skardu": {
      distance_km: 29.5,
      estimated_minutes: 24
    },
    "Hotel Mountain Lagoon Skardu": {
      distance_km: 26.6,
      estimated_minutes: 26
    },
    "Skardu River Resort": {
      distance_km: 26.8,
      estimated_minutes: 26
    },
    "Morning Resort": {
      distance_km: 30,
      estimated_minutes: 25
    },
    "Hotel Desert Bloom Skardu": {
      distance_km: 4.3,
      estimated_minutes: 5
    },
    "TheQue Skardu": {
      distance_km: 30.6,
      estimated_minutes: 26
    },
    "Singay Homestay Skardu": {
      distance_km: 2.1,
      estimated_minutes: 3
    },
    "Baltistan Crown Resort": {
      distance_km: 6.3,
      estimated_minutes: 7
    },
    "Fatah inn Guest House": {
      distance_km: 6.5,
      estimated_minutes: 7
    },
    "Kunhar": {
      distance_km: 6.2,
      estimated_minutes: 6
    },
    "Maltoro guest house": {
      distance_km: 6.3,
      estimated_minutes: 6
    },
    "Apex Hotels and Resorts Skardu": {
      distance_km: 6.3,
      estimated_minutes: 6
    },
    "Hotel virsa": {
      distance_km: 6.3,
      estimated_minutes: 6
    },
    "Elli's Luxus": {
      distance_km: 7,
      estimated_minutes: 6
    },
    "Skardu Gateway Hotel & Restaurant": {
      distance_km: 7.1,
      estimated_minutes: 7
    },
    "Polo Land Hotel by Skyline": {
      distance_km: 7.1,
      estimated_minutes: 7
    },
    "Baltistan White House Hotel": {
      distance_km: 7.4,
      estimated_minutes: 7
    },
    "The Pioneer Hotel": {
      distance_km: 7.5,
      estimated_minutes: 7
    },
    "Ramovi Guest House": {
      distance_km: 7.6,
      estimated_minutes: 7
    },
    "Friends & Family Guest House": {
      distance_km: 8,
      estimated_minutes: 7
    },
    "SKY LAKE GUEST HOUSE": {
      distance_km: 8.2,
      estimated_minutes: 7
    },
    "Skardu bliss hotel": {
      distance_km: 9.5,
      estimated_minutes: 8
    },
    "Comfort inn hotel": {
      distance_km: 9.6,
      estimated_minutes: 8
    },
    "Grand Hotel Skardu": {
      distance_km: 9.8,
      estimated_minutes: 9
    },
    "Baltistan inn hotel": {
      distance_km: 10,
      estimated_minutes: 9
    },
    "Grand view hotel": {
      distance_km: 10,
      estimated_minutes: 9
    },
    "Hotel walnut": {
      distance_km: 11,
      estimated_minutes: 9
    },
    "ABC hotel": {
      distance_km: 11.2,
      estimated_minutes: 9
    },
    "Lashari Resort Skardu": {
      distance_km: 11.3,
      estimated_minutes: 10
    },
    "Melody Hills Skardu": {
      distance_km: 11.6,
      estimated_minutes: 10
    },
    "NJM House Near Skardu Airport": {
      distance_km: 11.6,
      estimated_minutes: 10
    },
    "Le Yurt Skardu": {
      distance_km: 11.8,
      estimated_minutes: 10
    },
    "FearLess lodge": {
      distance_km: 13,
      estimated_minutes: 13
    },
    "Wamiq Skardu Resort": {
      distance_km: 15.8,
      estimated_minutes: 15
    },
    "Hosho Guest House": {
      distance_km: 14.5,
      estimated_minutes: 12
    },
    "Orgventure Resorts Skardu": {
      distance_km: 15.7,
      estimated_minutes: 13
    },
    "Green orchard skardu": {
      distance_km: 3.1,
      estimated_minutes: 4
    },
    "Mount View hotel skardu": {
      distance_km: 2.9,
      estimated_minutes: 4
    },
    "Laal Haveli": {
      distance_km: 2.8,
      estimated_minutes: 4
    },
    "Skardu view Guest house": {
      distance_km: 2.7,
      estimated_minutes: 4
    },
    "Baltistan Mountain Chalet Hotel": {
      distance_km: 2.6,
      estimated_minutes: 4
    },
    "Hotel Five star & restaurant skardu": {
      distance_km: 2.6,
      estimated_minutes: 4
    },
    "Tufail palace hotel & restaurant": {
      distance_km: 2.5,
      estimated_minutes: 3
    },
    "Indus motel": {
      distance_km: 2.3,
      estimated_minutes: 3
    },
    "Paradise hotel": {
      distance_km: 2.1,
      estimated_minutes: 3
    },
    "Hotel Red sun": {
      distance_km: 2.2,
      estimated_minutes: 3
    },
    "Haks hotel": {
      distance_km: 2,
      estimated_minutes: 3
    },
    "Hotel inn skardu": {
      distance_km: 2,
      estimated_minutes: 3
    },
    "Skardu embassy hotel": {
      distance_km: 1.9,
      estimated_minutes: 3
    },
    "Hotel Delight Skardu": {
      distance_km: 1.9,
      estimated_minutes: 3
    },
    "Ayan Hotel": {
      distance_km: 1,
      estimated_minutes: 2
    },
    "Hotel Highlander inn": {
      distance_km: 1.7,
      estimated_minutes: 2
    },
    "The North face inn hotel skardu": {
      distance_km: 1.9,
      estimated_minutes: 2
    },
    "The yak Hotel skardu": {
      distance_km: 1.9,
      estimated_minutes: 2
    },
    "Indus lodge skardu": {
      distance_km: 1.9,
      estimated_minutes: 2
    },
    "Stay inn hotel": {
      distance_km: 1.9,
      estimated_minutes: 2
    },
    "Eden Rock skardu": {
      distance_km: 2,
      estimated_minutes: 2
    },
    "Concordia Motel Baltistan": {
      distance_km: 2.2,
      estimated_minutes: 3
    },
    "Harriot Skardu": {
      distance_km: 2.7,
      estimated_minutes: 3
    },
    "Hotel PeakNest": {
      distance_km: 2.7,
      estimated_minutes: 3
    },
    "Royal Glaxy Hotel": {
      distance_km: 2.9,
      estimated_minutes: 3
    },
    "Sarfaranga view rock Guest house skardu": {
      distance_km: 2.7,
      estimated_minutes: 3
    },
    "Eat and Read Guesthouse skardu": {
      distance_km: 2.6,
      estimated_minutes: 2
    },
    "North Face explorers": {
      distance_km: 2.6,
      estimated_minutes: 2
    },
    "Holiday resort skardu": {
      distance_km: 2.5,
      estimated_minutes: 2
    },
    "Kallisto Resort": {
      distance_km: 2.5,
      estimated_minutes: 2
    },
    "Sagar hotel skardu": {
      distance_km: 2.8,
      estimated_minutes: 3
    },
    "Hotel Elite skardu": {
      distance_km: 2.5,
      estimated_minutes: 2
    },
    "SnowLand Resort": {
      distance_km: 2.7,
      estimated_minutes: 4
    },
    "Bismillah Guest House": {
      distance_km: 2.8,
      estimated_minutes: 4
    },
    "Hotel Yak sarai": {
      distance_km: 2.8,
      estimated_minutes: 4
    },
    "The North Palace": {
      distance_km: 2.8,
      estimated_minutes: 4
    },
    "Duqsa Family Guest House": {
      distance_km: 3.1,
      estimated_minutes: 4
    },
    "Wazir's villa": {
      distance_km: 3.1,
      estimated_minutes: 4
    },
    "Hotel Rewaaj": {
      distance_km: 2.9,
      estimated_minutes: 4
    },
    "Comfort Hotel & Huts skardu": {
      distance_km: 2.4,
      estimated_minutes: 3
    },
    "Zam Zam Guest House": {
      distance_km: 2.1,
      estimated_minutes: 3
    },
    "The Mountain Gypsy Resort": {
      distance_km: 2.2,
      estimated_minutes: 3
    },
    "Rigo Resort Skardu": {
      distance_km: 3.9,
      estimated_minutes: 5
    },
    "Arish Luxury Sites": {
      distance_km: 1.9,
      estimated_minutes: 3
    },
    "InterContinental Hotel": {
      distance_km: 1.5,
      estimated_minutes: 2
    },
    "Royal fort resort skardu": {
      distance_km: 1.6,
      estimated_minutes: 2
    },
    "Meer Stay and Dine skardu": {
      distance_km: 1.4,
      estimated_minutes: 2
    },
    "Dream Land Guest House": {
      distance_km: 2,
      estimated_minutes: 3
    },
    "Hotel GraceLand": {
      distance_km: 1.5,
      estimated_minutes: 2
    },
    "MOUNTAIN MAJESTY INN SKARDU": {
      distance_km: 1.9,
      estimated_minutes: 2
    },
    "Alnoor Lodges": {
      distance_km: 2.1,
      estimated_minutes: 2
    },
    "Jasper House": {
      distance_km: 2.3,
      estimated_minutes: 3
    },
    "The Himalayan Guest House": {
      distance_km: 2.4,
      estimated_minutes: 3
    },
    "Epoch Inn Guest House Skardu": {
      distance_km: 2.5,
      estimated_minutes: 3
    },
    "Mountaindale Guest House": {
      distance_km: 2.5,
      estimated_minutes: 3
    },
    "Al Jannah Guest House Skardu": {
      distance_km: 2.5,
      estimated_minutes: 3
    },
    "Biafo Resort Skardu": {
      distance_km: 2.6,
      estimated_minutes: 3
    },
    "Skardu Blossom Inn": {
      distance_km: 2.6,
      estimated_minutes: 3
    },
    "The Diamond Guest House Skardu": {
      distance_km: 2.7,
      estimated_minutes: 3
    },
    "Anarres | A Creative Residency": {
      distance_km: 3.2,
      estimated_minutes: 3
    },
    "Submit Embassy Hotel": {
      distance_km: 3.2,
      estimated_minutes: 3
    },
    "Alpine Abode Skardu": {
      distance_km: 3.6,
      estimated_minutes: 4
    },
    "Relax Inn Skardu": {
      distance_km: 3.6,
      estimated_minutes: 4
    },
    "Gumaan Resort Skardu": {
      distance_km: 3.7,
      estimated_minutes: 4
    },
    "Yuligo Resort Skardu": {
      distance_km: 3.9,
      estimated_minutes: 4
    },
    "Urban escape resort": {
      distance_km: 1,
      estimated_minutes: 2
    },
    "Mohsin Lodge Skardu": {
      distance_km: 0.9,
      estimated_minutes: 2
    },
    "Back To Home Lodging": {
      distance_km: 0.9,
      estimated_minutes: 2
    },
    "Royal Brangsa Guest House": {
      distance_km: 0.7,
      estimated_minutes: 2
    },
    "Wazir Guest House Skardu": {
      distance_km: 0.4,
      estimated_minutes: 1
    },
    "Golden Ibex Guest House": {
      distance_km: 0.3,
      estimated_minutes: 1
    },
    "Up Way Guest House": {
      distance_km: 0.5,
      estimated_minutes: 1
    },
    "Kunlun Peak Inn skardu": {
      distance_km: 0.9,
      estimated_minutes: 2
    },
    "Markhor Hotel": {
      distance_km: 1.1,
      estimated_minutes: 2
    },
    "Tibet hotel skardu": {
      distance_km: 1.5,
      estimated_minutes: 3
    },
    "Alpha Nomads House": {
      distance_km: 1.5,
      estimated_minutes: 3
    },
    "Dirleh Hotel": {
      distance_km: 1.7,
      estimated_minutes: 4
    },
    "North Home Skardu": {
      distance_km: 1.7,
      estimated_minutes: 4
    },
    "Valhalla Guest House": {
      distance_km: 1.6,
      estimated_minutes: 3
    },
    "Creek villa skardu": {
      distance_km: 1.7,
      estimated_minutes: 4
    },
    "Prince Tourist Hut": {
      distance_km: 2,
      estimated_minutes: 4
    },
    "Mountain House": {
      distance_km: 2.1,
      estimated_minutes: 4
    },
    "Reechan Resort House": {
      distance_km: 1.8,
      estimated_minutes: 3
    },
    "Himalayan Guest House Hassan colony": {
      distance_km: 1.8,
      estimated_minutes: 3
    },
    "Jasmine Skardu": {
      distance_km: 1.9,
      estimated_minutes: 3
    },
    "Mountain Face Skardu": {
      distance_km: 2,
      estimated_minutes: 3
    },
    "Four Seasons Bed and Breakfast": {
      distance_km: 1.9,
      estimated_minutes: 3
    },
    "Flora Inn skardu": {
      distance_km: 1.9,
      estimated_minutes: 3
    },
    "Broadpeak Resort skardu": {
      distance_km: 2,
      estimated_minutes: 3
    },
    "Chinar Residency": {
      distance_km: 3.1,
      estimated_minutes: 3
    },
    "Buddha Rock Guest House Skardu": {
      distance_km: 3.2,
      estimated_minutes: 4
    },
    "Buddha view Resort skardu": {
      distance_km: 3.2,
      estimated_minutes: 4
    },
    "Moonal Residency": {
      distance_km: 3.4,
      estimated_minutes: 4
    },
    "Skarchan Resort skardu": {
      distance_km: 3.5,
      estimated_minutes: 4
    },
    "ZAGO Guest House": {
      distance_km: 1.5,
      estimated_minutes: 3
    },
    "Skardu Blossom Guest House": {
      distance_km: 1.5,
      estimated_minutes: 2
    },
    "Harpo Resorts": {
      distance_km: 1.6,
      estimated_minutes: 3
    },
    "Baltistan Continental Hotel skardu": {
      distance_km: 0.8,
      estimated_minutes: 1
    },
    "Al Abbas Guest House": {
      distance_km: 0.8,
      estimated_minutes: 1
    },
    "Apricot Spring Resort Skardu": {
      distance_km: 0.8,
      estimated_minutes: 1
    },
    "Executive Guest House Skardu": {
      distance_km: 0.7,
      estimated_minutes: 1
    },
    "Hotel Bloom Hills,Skardu": {
      distance_km: 2.4,
      estimated_minutes: 3
    },
    "Siachen Stay&Tours": {
      distance_km: 2.3,
      estimated_minutes: 3
    },
    "Mountain Guest House and Desi Restaurant": {
      distance_km: 2.1,
      estimated_minutes: 3
    },
    "Decent Baltistan guest house": {
      distance_km: 2,
      estimated_minutes: 3
    },
    "Baltistan Village Guest House": {
      distance_km: 2,
      estimated_minutes: 3
    },
    "Bareen": {
      distance_km: 1.9,
      estimated_minutes: 3
    },
    "SUMMIT GUEST HOUSE": {
      distance_km: 1.9,
      estimated_minutes: 3
    },
    "Serene Baltistan Hotel": {
      distance_km: 1.8,
      estimated_minutes: 2
    },
    "Alpha Hotel & Restaurant": {
      distance_km: 1.4,
      estimated_minutes: 2
    },
    "Saani Rooms": {
      distance_km: 1.4,
      estimated_minutes: 2
    },
    "Ridakh Inn": {
      distance_km: 1.1,
      estimated_minutes: 2
    },
    "Clifton Spachan Hotel": {
      distance_km: 1,
      estimated_minutes: 2
    },
    "K2 Tourism Guest House": {
      distance_km: 1,
      estimated_minutes: 2
    },
    "Heaven's Adventure.pk": {
      distance_km: 3.3,
      estimated_minutes: 4
    },
    "Desert one hotel and restaurant skardu": {
      distance_km: 3.1,
      estimated_minutes: 4
    },
    "Yazgar Residency Skardu": {
      distance_km: 3.2,
      estimated_minutes: 4
    },
    "The Next Home Skardu": {
      distance_km: 3.2,
      estimated_minutes: 4
    },
    "Heaven Hotel Skardu": {
      distance_km: 3.2,
      estimated_minutes: 4
    },
    "Skardu Midway hotel": {
      distance_km: 3.7,
      estimated_minutes: 4
    },
    "Sarfaranga Reaidency": {
      distance_km: 4.1,
      estimated_minutes: 4
    },
    "Skengoo Inn Hotel": {
      distance_km: 4.2,
      estimated_minutes: 5
    },
    "Alnoor Starlet Hotel": {
      distance_km: 4.4,
      estimated_minutes: 5
    },
    "Top Hill Resort": {
      distance_km: 5,
      estimated_minutes: 6
    },
    "Royal Resort Skardu": {
      distance_km: 4.6,
      estimated_minutes: 5
    },
    "Signature Skardu Hotel": {
      distance_km: 4.7,
      estimated_minutes: 5
    },
    "Shama Resort Skardu": {
      distance_km: 4.7,
      estimated_minutes: 5
    },
    "Pearl of Skardu Resort": {
      distance_km: 4.8,
      estimated_minutes: 5
    },
    "Crystal Mountain Lodge": {
      distance_km: 4.9,
      estimated_minutes: 5
    },
    "H A K S RESSORT": {
      distance_km: 5.6,
      estimated_minutes: 6
    },
    "Shaheen Guest House Skardu": {
      distance_km: 5.8,
      estimated_minutes: 6
    },
    "Nirvana Resort Skardu": {
      distance_km: 6.1,
      estimated_minutes: 6
    }
  },
  "MFC Skardu": {
    "Sundus Skilgrong": { distance_km: 4.1, estimated_minutes: 13 },
    "Sundus Gond": { distance_km: 4.9, estimated_minutes: 16 },
    "Newranga": { distance_km: 3.7, estimated_minutes: 11 },
    "Katpana": { distance_km: 7.5, estimated_minutes: 22 },
    "Khargrong": { distance_km: 0.95, estimated_minutes: 3 },
    "Hasnain Nagar": { distance_km: 0.55, estimated_minutes: 2 },
    "Alamdar Chowk": { distance_km: 0.22, estimated_minutes: 1 },
    "Hassan Colony": { distance_km: 6.6, estimated_minutes: 24 },
    "Hassan Colony Pine": { distance_km: 1.5, estimated_minutes: 7 },
    "Shinkhani Gond": { distance_km: 1.9, estimated_minutes: 5 },
    "Oldiing Nansoq": { distance_km: 2.8, estimated_minutes: 8 },
    "RHQ Road Harriot Hotel": { distance_km: 1.9, estimated_minutes: 6 },
    "Newranga Near Agha Ali House": { distance_km: 1.8, estimated_minutes: 7 },
    "Newranga ": { distance_km: 3.7, estimated_minutes: 11 },
    "Kushmarah": { distance_km: 3.0, estimated_minutes: 9 },
    "Sherthang Girls High School": { distance_km: 2, estimated_minutes: 7 },
    "Marfie Colony": { distance_km: 1.7, estimated_minutes: 7 },
    "Chumik": { distance_km: 1.5, estimated_minutes: 6 },
    "Gamba Skardu": { distance_km: 11, estimated_minutes: 22 },
    "United Line, Hassan Colony": { distance_km: 1.3, estimated_minutes: 5 },
    "Muhib Road Khargrong": { distance_km: 1.1, estimated_minutes: 4 },
    "GB Chief Court Skardu Registry Skardu": { distance_km: 4.1, estimated_minutes: 12 },
    "Shaheen Public School Skardu": { distance_km: 2.3, estimated_minutes: 10 },
    "Mehdi Colony Skardu": { distance_km: 2.5, estimated_minutes: 10 },
    "Agha Hadi Chowk": { distance_km: 0.75, estimated_minutes: 3 },
    "Hussainabad": { distance_km: 6.4, estimated_minutes: 15 },
    "Himalaya Hotel Hussainabad, Skardu": { distance_km: 6.4, estimated_minutes: 15 },
    "Hameed Garh": { distance_km: 1.5, estimated_minutes: 5 },
    "Shaheed colony": { distance_km: 3.6, estimated_minutes: 13 },
    "Tufail colony": { distance_km: 2.9, estimated_minutes: 11 },
    "Jafferi Mohallah": { distance_km: 2, estimated_minutes: 8 },
    "Chogo Matamsara": { distance_km: 1.7, estimated_minutes: 7 },
    "Nagulispang Road": { distance_km: 0.8, estimated_minutes: 3 },
    "Eidgah,Sundus ": { distance_km: 3.7, estimated_minutes: 13 },
    "Sukemaidan ": { distance_km: 0.95, estimated_minutes: 3 },
    "Hargissa shakthang": { distance_km: 1.6, estimated_minutes: 7 },
    "Bhutto Bazar Skardu": { distance_km: 1.5, estimated_minutes: 5 },
    "Devision": { distance_km: 2.3, estimated_minutes: 9 },
    "Abbas Town": { distance_km: 1.8, estimated_minutes: 6 },
    "Musa Line": { distance_km: 1.3, estimated_minutes: 5 },
    "Clifton pull": { distance_km: 1, estimated_minutes: 4 },
    "Sheikh ijaz masjid": { distance_km: 1.6, estimated_minutes: 6 },
    "Khila Toq Road": { distance_km: 1.5, estimated_minutes: 5 },
    "Public school area": { distance_km: 2.6, estimated_minutes: 8 },
    "Xhathang": { distance_km: 2.8, estimated_minutes: 9 },
    "Brolmo colony sundus": { distance_km: 4.2, estimated_minutes: 15 },
    "Ghazi Colony sundus": { distance_km: 4.6, estimated_minutes: 16 },
    "Hyderabad Gangupi Area": { distance_km: 0.6, estimated_minutes: 2 },
    "LT Col ihsan Ali rd": { distance_km: 0.45, estimated_minutes: 2 },
    "Astana skardu": { distance_km: 4, estimated_minutes: 12 },
    "Bintul Huda Girls model school": { distance_km: 4.7, estimated_minutes: 14 },
    "Brolmo colony astana": { distance_km: 3.7, estimated_minutes: 12 },
    "Raees mohalla Haji Gam": { distance_km: 2.2, estimated_minutes: 8 },
    "Haji Gam": { distance_km: 1.4, estimated_minutes: 5 },
    "Gulshan e Ali skardu": { distance_km: 2, estimated_minutes: 6 },
    "Jamia masjid road": { distance_km: 0.75, estimated_minutes: 3 },
    "Gayool skardu": { distance_km: 5.6, estimated_minutes: 14 },
    "Toqrangah Skardu": { distance_km: 3.9, estimated_minutes: 13 },
    "Maqponsar skardu": { distance_km: 3.4, estimated_minutes: 12 },
    "Newranga road": { distance_km: 3.5, estimated_minutes: 10 },
    "Quaidabad": { distance_km: 2, estimated_minutes: 7 },
    "Kharpocho Road": { distance_km: 1.5, estimated_minutes: 7 },
    "Patwal": { distance_km: 1.2, estimated_minutes: 4 },
    "Olding": { distance_km: 2.2, estimated_minutes: 8 },
    "Karasmathang": { distance_km: 1.2, estimated_minutes: 4 },
    "Kachura": { distance_km: 2.6, estimated_minutes: 9 },
    "3 talwar chowk": { distance_km: 2.7, estimated_minutes: 7 },
    "Teen talwar chowk": { distance_km: 2.7, estimated_minutes: 7 },
    "Sahara Complex": { distance_km: 2.3, estimated_minutes: 7 },
    "Ali plaza": { distance_km: 1.4, estimated_minutes: 5 },
    "Radio Pakistan Chowk": { distance_km: 2.7, estimated_minutes: 9 },
    "Manthal": { distance_km: 4.6, estimated_minutes: 13 },
   "Rus Olive Lodge": {
      distance_km: 4.1,
      estimated_minutes: 5
    },
    "Hargisa Resort Skardu": {
      distance_km: 5.1,
      estimated_minutes: 7
    },
    "LOKAL Rooms x Skardu (Katpana Retreat)": {
      distance_km: 5,
      estimated_minutes: 6
    },
    "Green Orchard Skardu": {
      distance_km: 3.2,
      estimated_minutes: 4
    },
    "Oasis Resort Katpana Skardu": {
      distance_km: 5.4,
      estimated_minutes: 7
    },
    "Avari Xpress Skardu Hotel": {
      distance_km: 3.5,
      estimated_minutes: 4
    },
    "Hotel Mashabrum Skardu": {
      distance_km: 2.4,
      estimated_minutes: 3
    },
    "Skardu Luxus Hotel": {
      distance_km: 2.4,
      estimated_minutes: 3
    },
    "The Mountain Cottage Skardu": {
      distance_km: 2.8,
      estimated_minutes: 4
    },
    "Summit Hotel Skardu": {
      distance_km: 2.7,
      estimated_minutes: 3
    },
    "Skardu Saraye Hotel & Resort": {
      distance_km: 3.6,
      estimated_minutes: 6
    },
    "Baltistan Tourist Cottage - Skardu": {
      distance_km: 3,
      estimated_minutes: 4
    },
    "Glamp Pakistan": {
      distance_km: 6.4,
      estimated_minutes: 9
    },
    "Montagna Pods": {
      distance_km: 6.6,
      estimated_minutes: 9
    },
    "Hotel Luxy Skardu": {
      distance_km: 3.8,
      estimated_minutes: 4
    },
    "Baltistan Fort, Skardu Resort Hotel": {
      distance_km: 8.4,
      estimated_minutes: 12
    },
    "Hotel Skardu1": {
      distance_km: 2,
      estimated_minutes: 3
    },
    "Baltistan Resort": {
      distance_km: 2,
      estimated_minutes: 3
    },
    "Skardu Royal Hotel & Restaurant": {
      distance_km: 1.5,
      estimated_minutes: 2
    },
    "Sharif Cottages and Hotel Skardu": {
      distance_km: 4.9,
      estimated_minutes: 5
    },
    "Base Camp Katpana": {
      distance_km: 7.5,
      estimated_minutes: 12
    },
    "Hotel Dewan-e-Khas": {
      distance_km: 1.2,
      estimated_minutes: 3
    },
    "Legend Hotel Skardu": {
      distance_km: 1.1,
      estimated_minutes: 2
    },
    "Northlanders Guest House Skardu": {
      distance_km: 1,
      estimated_minutes: 2
    },
    "Hotel Travellodge Skardu": {
      distance_km: 1,
      estimated_minutes: 2
    },
    "Qayam Skardu": {
      distance_km: 5.8,
      estimated_minutes: 6
    },
    "Rafsal A Countryside Cottage": {
      distance_km: 5.9,
      estimated_minutes: 8
    },
    "Kentish Lodge Skardu": {
      distance_km: 0.8,
      estimated_minutes: 1
    },
    "Skardu Villas": {
      distance_km: 6.1,
      estimated_minutes: 6
    },
    "The Cherry Courtyard": {
      distance_km: 6.2,
      estimated_minutes: 6
    },
    "Ringchan Guest House & Restaurant": {
      distance_km: 1.5,
      estimated_minutes: 2
    },
    "Skardu Lodge": {
      distance_km: 1.2,
      estimated_minutes: 2
    },
    "Karakoram Nest": {
      distance_km: 1.8,
      estimated_minutes: 2
    },
    "Dynasty Skardu": {
      distance_km: 6.5,
      estimated_minutes: 7
    },
    "Sehrish Guest House Skardu": {
      distance_km: 0.6,
      estimated_minutes: 2
    },
    "PTDC Motel Skardu": {
      distance_km: 1.8,
      estimated_minutes: 2
    },
    "Hotel Reego Skardu": {
      distance_km: 0.5,
      estimated_minutes: 1
    },
    "Lavender Cottage & Guest House": {
      distance_km: 0.6,
      estimated_minutes: 2
    },
    "Rock View Skardu": {
      distance_km: 0.6,
      estimated_minutes: 1
    },
    "Dream Guest House Haji Gam Chowk": {
      distance_km: 1,
      estimated_minutes: 2
    },
    "Indus Lodges Skardu": {
      distance_km: 1.9,
      estimated_minutes: 2
    },
    "Pacific Guest House Skardu": {
      distance_km: 1.9,
      estimated_minutes: 3
    },
    "Skardu View Point Hotel and Huts": {
      distance_km: 1.9,
      estimated_minutes: 3
    },
    "Khar Hotel Skardu": {
      distance_km: 1,
      estimated_minutes: 2
    },
    "HIKK Inn Skardu": {
      distance_km: 1.9,
      estimated_minutes: 3
    },
    "Taaj Residence Skardu": {
      distance_km: 1.6,
      estimated_minutes: 2
    },
    "Homeland Guest House Skardu": {
      distance_km: 1,
      estimated_minutes: 1
    },
    "Sultan Guest House Skardu": {
      distance_km: 1.3,
      estimated_minutes: 2
    },
    "The Hill Town Resort": {
      distance_km: 1.7,
      estimated_minutes: 3
    },
    "AlJannah Guest House Skardu": {
      distance_km: 2.5,
      estimated_minutes: 3
    },
    "Deosai Gateway Inn Skardu": {
      distance_km: 2.6,
      estimated_minutes: 3
    },
    "Skardu Arcadian Resort": {
      distance_km: 9.1,
      estimated_minutes: 10
    },
    "Areena Hotel Skardu": {
      distance_km: 1.7,
      estimated_minutes: 2
    },
    "Skardu Farmhouse for stay": {
      distance_km: 3.2,
      estimated_minutes: 3
    },
    "Adventure Sarai Hotel Skardu": {
      distance_km: 2.3,
      estimated_minutes: 3
    },
    "Maple Resort": {
      distance_km: 12.7,
      estimated_minutes: 15
    },
    "Candela Resorts": {
      distance_km: 3.6,
      estimated_minutes: 4
    },
    "Hispar Hotel Skardu": {
      distance_km: 3.6,
      estimated_minutes: 4
    },
    "K2 Paradise Guest House": {
      distance_km: 2.5,
      estimated_minutes: 2
    },
    "Holiday Mountain Resort & Camping Site": {
      distance_km: 4.1,
      estimated_minutes: 5
    },
    "Mountain Lodge Skardu": {
      distance_km: 4.1,
      estimated_minutes: 5
    },
    "Mulberry Continental Hotel Skardu": {
      distance_km: 11.2,
      estimated_minutes: 9
    },
    "PC Legacy Skardu": {
      distance_km: 11.3,
      estimated_minutes: 10
    },
    "GB Lodges": {
      distance_km: 12.1,
      estimated_minutes: 11
    },
    "Bilafond Cottage": {
      distance_km: 7.5,
      estimated_minutes: 9
    },
    "North Hills Skardu": {
      distance_km: 1.6,
      estimated_minutes: 2
    },
    "Pinnacle Executive Lodges": {
      distance_km: 12.7,
      estimated_minutes: 11
    },
    "Safena Hotel Skardu": {
      distance_km: 15.4,
      estimated_minutes: 12
    },
    "Byarsa Hotel Skardu": {
      distance_km: 25.4,
      estimated_minutes: 21
    },
    "Dream Nest Resort Hotels Skardu": {
      distance_km: 33.9,
      estimated_minutes: 35
    },
    "Stream view guest house skardu": {
      distance_km: 1.5,
      estimated_minutes: 3
    },
    "Shangrila Resort Skardu": {
      distance_km: 26.3,
      estimated_minutes: 24
    },
    "Kachura Inn Skardu": {
      distance_km: 31.1,
      estimated_minutes: 28
    },
    "Tibet Hotel Kachura Skardu": {
      distance_km: 29.5,
      estimated_minutes: 24
    },
    "Hotel Mountain Lagoon Skardu": {
      distance_km: 26.6,
      estimated_minutes: 26
    },
    "Skardu River Resort": {
      distance_km: 26.8,
      estimated_minutes: 26
    },
    "Morning Resort": {
      distance_km: 30,
      estimated_minutes: 25
    },
    "Hotel Desert Bloom Skardu": {
      distance_km: 4.3,
      estimated_minutes: 5
    },
    "TheQue Skardu": {
      distance_km: 30.6,
      estimated_minutes: 26
    },
    "Singay Homestay Skardu": {
      distance_km: 2.1,
      estimated_minutes: 3
    },
    "Baltistan Crown Resort": {
      distance_km: 6.3,
      estimated_minutes: 7
    },
    "Fatah inn Guest House": {
      distance_km: 6.5,
      estimated_minutes: 7
    },
    "Kunhar": {
      distance_km: 6.2,
      estimated_minutes: 6
    },
    "Maltoro guest house": {
      distance_km: 6.3,
      estimated_minutes: 6
    },
    "Apex Hotels and Resorts Skardu": {
      distance_km: 6.3,
      estimated_minutes: 6
    },
    "Hotel virsa": {
      distance_km: 6.3,
      estimated_minutes: 6
    },
    "Elli's Luxus": {
      distance_km: 7,
      estimated_minutes: 6
    },
    "Skardu Gateway Hotel & Restaurant": {
      distance_km: 7.1,
      estimated_minutes: 7
    },
    "Polo Land Hotel by Skyline": {
      distance_km: 7.1,
      estimated_minutes: 7
    },
    "Baltistan White House Hotel": {
      distance_km: 7.4,
      estimated_minutes: 7
    },
    "The Pioneer Hotel": {
      distance_km: 7.5,
      estimated_minutes: 7
    },
    "Ramovi Guest House": {
      distance_km: 7.6,
      estimated_minutes: 7
    },
    "Friends & Family Guest House": {
      distance_km: 8,
      estimated_minutes: 7
    },
    "SKY LAKE GUEST HOUSE": {
      distance_km: 8.2,
      estimated_minutes: 7
    },
    "Skardu bliss hotel": {
      distance_km: 9.5,
      estimated_minutes: 8
    },
    "Comfort inn hotel": {
      distance_km: 9.6,
      estimated_minutes: 8
    },
    "Grand Hotel Skardu": {
      distance_km: 9.8,
      estimated_minutes: 9
    },
    "Baltistan inn hotel": {
      distance_km: 10,
      estimated_minutes: 9
    },
    "Grand view hotel": {
      distance_km: 10,
      estimated_minutes: 9
    },
    "Hotel walnut": {
      distance_km: 11,
      estimated_minutes: 9
    },
    "ABC hotel": {
      distance_km: 11.2,
      estimated_minutes: 9
    },
    "Lashari Resort Skardu": {
      distance_km: 11.3,
      estimated_minutes: 10
    },
    "Melody Hills Skardu": {
      distance_km: 11.6,
      estimated_minutes: 10
    },
    "NJM House Near Skardu Airport": {
      distance_km: 11.6,
      estimated_minutes: 10
    },
    "Le Yurt Skardu": {
      distance_km: 11.8,
      estimated_minutes: 10
    },
    "FearLess lodge": {
      distance_km: 13,
      estimated_minutes: 13
    },
    "Wamiq Skardu Resort": {
      distance_km: 15.8,
      estimated_minutes: 15
    },
    "Hosho Guest House": {
      distance_km: 14.5,
      estimated_minutes: 12
    },
    "Orgventure Resorts Skardu": {
      distance_km: 15.7,
      estimated_minutes: 13
    },
    "Green orchard skardu": {
      distance_km: 3.1,
      estimated_minutes: 4
    },
    "Mount View hotel skardu": {
      distance_km: 2.9,
      estimated_minutes: 4
    },
    "Laal Haveli": {
      distance_km: 2.8,
      estimated_minutes: 4
    },
    "Skardu view Guest house": {
      distance_km: 2.7,
      estimated_minutes: 4
    },
    "Baltistan Mountain Chalet Hotel": {
      distance_km: 2.6,
      estimated_minutes: 4
    },
    "Hotel Five star & restaurant skardu": {
      distance_km: 2.6,
      estimated_minutes: 4
    },
    "Tufail palace hotel & restaurant": {
      distance_km: 2.5,
      estimated_minutes: 3
    },
    "Indus motel": {
      distance_km: 2.3,
      estimated_minutes: 3
    },
    "Paradise hotel": {
      distance_km: 2.1,
      estimated_minutes: 3
    },
    "Hotel Red sun": {
      distance_km: 2.2,
      estimated_minutes: 3
    },
    "Haks hotel": {
      distance_km: 2,
      estimated_minutes: 3
    },
    "Hotel inn skardu": {
      distance_km: 2,
      estimated_minutes: 3
    },
    "Skardu embassy hotel": {
      distance_km: 1.9,
      estimated_minutes: 3
    },
    "Hotel Delight Skardu": {
      distance_km: 1.9,
      estimated_minutes: 3
    },
    "Ayan Hotel": {
      distance_km: 1,
      estimated_minutes: 2
    },
    "Hotel Highlander inn": {
      distance_km: 1.7,
      estimated_minutes: 2
    },
    "The North face inn hotel skardu": {
      distance_km: 1.9,
      estimated_minutes: 2
    },
    "The yak Hotel skardu": {
      distance_km: 1.9,
      estimated_minutes: 2
    },
    "Indus lodge skardu": {
      distance_km: 1.9,
      estimated_minutes: 2
    },
    "Stay inn hotel": {
      distance_km: 1.9,
      estimated_minutes: 2
    },
    "Eden Rock skardu": {
      distance_km: 2,
      estimated_minutes: 2
    },
    "Concordia Motel Baltistan": {
      distance_km: 2.2,
      estimated_minutes: 3
    },
    "Harriot Skardu": {
      distance_km: 2.7,
      estimated_minutes: 3
    },
    "Hotel PeakNest": {
      distance_km: 2.7,
      estimated_minutes: 3
    },
    "Royal Glaxy Hotel": {
      distance_km: 2.9,
      estimated_minutes: 3
    },
    "Sarfaranga view rock Guest house skardu": {
      distance_km: 2.7,
      estimated_minutes: 3
    },
    "Eat and Read Guesthouse skardu": {
      distance_km: 2.6,
      estimated_minutes: 2
    },
    "North Face explorers": {
      distance_km: 2.6,
      estimated_minutes: 2
    },
    "Holiday resort skardu": {
      distance_km: 2.5,
      estimated_minutes: 2
    },
    "Kallisto Resort": {
      distance_km: 2.5,
      estimated_minutes: 2
    },
    "Sagar hotel skardu": {
      distance_km: 2.8,
      estimated_minutes: 3
    },
    "Hotel Elite skardu": {
      distance_km: 2.5,
      estimated_minutes: 2
    },
    "SnowLand Resort": {
      distance_km: 2.7,
      estimated_minutes: 4
    },
    "Bismillah Guest House": {
      distance_km: 2.8,
      estimated_minutes: 4
    },
    "Hotel Yak sarai": {
      distance_km: 2.8,
      estimated_minutes: 4
    },
    "The North Palace": {
      distance_km: 2.8,
      estimated_minutes: 4
    },
    "Duqsa Family Guest House": {
      distance_km: 3.1,
      estimated_minutes: 4
    },
    "Wazir's villa": {
      distance_km: 3.1,
      estimated_minutes: 4
    },
    "Hotel Rewaaj": {
      distance_km: 2.9,
      estimated_minutes: 4
    },
    "Comfort Hotel & Huts skardu": {
      distance_km: 2.4,
      estimated_minutes: 3
    },
    "Zam Zam Guest House": {
      distance_km: 2.1,
      estimated_minutes: 3
    },
    "The Mountain Gypsy Resort": {
      distance_km: 2.2,
      estimated_minutes: 3
    },
    "Rigo Resort Skardu": {
      distance_km: 3.9,
      estimated_minutes: 5
    },
    "Arish Luxury Sites": {
      distance_km: 1.9,
      estimated_minutes: 3
    },
    "InterContinental Hotel": {
      distance_km: 1.5,
      estimated_minutes: 2
    },
    "Royal fort resort skardu": {
      distance_km: 1.6,
      estimated_minutes: 2
    },
    "Meer Stay and Dine skardu": {
      distance_km: 1.4,
      estimated_minutes: 2
    },
    "Dream Land Guest House": {
      distance_km: 2,
      estimated_minutes: 3
    },
    "Hotel GraceLand": {
      distance_km: 1.5,
      estimated_minutes: 2
    },
    "MOUNTAIN MAJESTY INN SKARDU": {
      distance_km: 1.9,
      estimated_minutes: 2
    },
    "Alnoor Lodges": {
      distance_km: 2.1,
      estimated_minutes: 2
    },
    "Jasper House": {
      distance_km: 2.3,
      estimated_minutes: 3
    },
    "The Himalayan Guest House": {
      distance_km: 2.4,
      estimated_minutes: 3
    },
    "Epoch Inn Guest House Skardu": {
      distance_km: 2.5,
      estimated_minutes: 3
    },
    "Mountaindale Guest House": {
      distance_km: 2.5,
      estimated_minutes: 3
    },
    "Al Jannah Guest House Skardu": {
      distance_km: 2.5,
      estimated_minutes: 3
    },
    "Biafo Resort Skardu": {
      distance_km: 2.6,
      estimated_minutes: 3
    },
    "Skardu Blossom Inn": {
      distance_km: 2.6,
      estimated_minutes: 3
    },
    "The Diamond Guest House Skardu": {
      distance_km: 2.7,
      estimated_minutes: 3
    },
    "Anarres | A Creative Residency": {
      distance_km: 3.2,
      estimated_minutes: 3
    },
    "Submit Embassy Hotel": {
      distance_km: 3.2,
      estimated_minutes: 3
    },
    "Alpine Abode Skardu": {
      distance_km: 3.6,
      estimated_minutes: 4
    },
    "Relax Inn Skardu": {
      distance_km: 3.6,
      estimated_minutes: 4
    },
    "Gumaan Resort Skardu": {
      distance_km: 3.7,
      estimated_minutes: 4
    },
    "Yuligo Resort Skardu": {
      distance_km: 3.9,
      estimated_minutes: 4
    },
    "Urban escape resort": {
      distance_km: 1,
      estimated_minutes: 2
    },
    "Mohsin Lodge Skardu": {
      distance_km: 0.9,
      estimated_minutes: 2
    },
    "Back To Home Lodging": {
      distance_km: 0.9,
      estimated_minutes: 2
    },
    "Royal Brangsa Guest House": {
      distance_km: 0.7,
      estimated_minutes: 2
    },
    "Wazir Guest House Skardu": {
      distance_km: 0.4,
      estimated_minutes: 1
    },
    "Golden Ibex Guest House": {
      distance_km: 0.3,
      estimated_minutes: 1
    },
    "Up Way Guest House": {
      distance_km: 0.5,
      estimated_minutes: 1
    },
    "Kunlun Peak Inn skardu": {
      distance_km: 0.9,
      estimated_minutes: 2
    },
    "Markhor Hotel": {
      distance_km: 1.1,
      estimated_minutes: 2
    },
    "Tibet hotel skardu": {
      distance_km: 1.5,
      estimated_minutes: 3
    },
    "Alpha Nomads House": {
      distance_km: 1.5,
      estimated_minutes: 3
    },
    "Dirleh Hotel": {
      distance_km: 1.7,
      estimated_minutes: 4
    },
    "North Home Skardu": {
      distance_km: 1.7,
      estimated_minutes: 4
    },
    "Valhalla Guest House": {
      distance_km: 1.6,
      estimated_minutes: 3
    },
    "Creek villa skardu": {
      distance_km: 1.7,
      estimated_minutes: 4
    },
    "Prince Tourist Hut": {
      distance_km: 2,
      estimated_minutes: 4
    },
    "Mountain House": {
      distance_km: 2.1,
      estimated_minutes: 4
    },
    "Reechan Resort House": {
      distance_km: 1.8,
      estimated_minutes: 3
    },
    "Himalayan Guest House Hassan colony": {
      distance_km: 1.8,
      estimated_minutes: 3
    },
    "Jasmine Skardu": {
      distance_km: 1.9,
      estimated_minutes: 3
    },
    "Mountain Face Skardu": {
      distance_km: 2,
      estimated_minutes: 3
    },
    "Four Seasons Bed and Breakfast": {
      distance_km: 1.9,
      estimated_minutes: 3
    },
    "Flora Inn skardu": {
      distance_km: 1.9,
      estimated_minutes: 3
    },
    "Broadpeak Resort skardu": {
      distance_km: 2,
      estimated_minutes: 3
    },
    "Chinar Residency": {
      distance_km: 3.1,
      estimated_minutes: 3
    },
    "Buddha Rock Guest House Skardu": {
      distance_km: 3.2,
      estimated_minutes: 4
    },
    "Buddha view Resort skardu": {
      distance_km: 3.2,
      estimated_minutes: 4
    },
    "Moonal Residency": {
      distance_km: 3.4,
      estimated_minutes: 4
    },
    "Skarchan Resort skardu": {
      distance_km: 3.5,
      estimated_minutes: 4
    },
    "ZAGO Guest House": {
      distance_km: 1.5,
      estimated_minutes: 3
    },
    "Skardu Blossom Guest House": {
      distance_km: 1.5,
      estimated_minutes: 2
    },
    "Harpo Resorts": {
      distance_km: 1.6,
      estimated_minutes: 3
    },
    "Baltistan Continental Hotel skardu": {
      distance_km: 0.8,
      estimated_minutes: 1
    },
    "Al Abbas Guest House": {
      distance_km: 0.8,
      estimated_minutes: 1
    },
    "Apricot Spring Resort Skardu": {
      distance_km: 0.8,
      estimated_minutes: 1
    },
    "Executive Guest House Skardu": {
      distance_km: 0.7,
      estimated_minutes: 1
    },
    "Hotel Bloom Hills,Skardu": {
      distance_km: 2.4,
      estimated_minutes: 3
    },
    "Siachen Stay&Tours": {
      distance_km: 2.3,
      estimated_minutes: 3
    },
    "Mountain Guest House and Desi Restaurant": {
      distance_km: 2.1,
      estimated_minutes: 3
    },
    "Decent Baltistan guest house": {
      distance_km: 2,
      estimated_minutes: 3
    },
    "Baltistan Village Guest House": {
      distance_km: 2,
      estimated_minutes: 3
    },
    "Bareen": {
      distance_km: 1.9,
      estimated_minutes: 3
    },
    "SUMMIT GUEST HOUSE": {
      distance_km: 1.9,
      estimated_minutes: 3
    },
    "Serene Baltistan Hotel": {
      distance_km: 1.8,
      estimated_minutes: 2
    },
    "Alpha Hotel & Restaurant": {
      distance_km: 1.4,
      estimated_minutes: 2
    },
    "Saani Rooms": {
      distance_km: 1.4,
      estimated_minutes: 2
    },
    "Ridakh Inn": {
      distance_km: 1.1,
      estimated_minutes: 2
    },
    "Clifton Spachan Hotel": {
      distance_km: 1,
      estimated_minutes: 2
    },
    "K2 Tourism Guest House": {
      distance_km: 1,
      estimated_minutes: 2
    },
    "Heaven's Adventure.pk": {
      distance_km: 3.3,
      estimated_minutes: 4
    },
    "Desert one hotel and restaurant skardu": {
      distance_km: 3.1,
      estimated_minutes: 4
    },
    "Yazgar Residency Skardu": {
      distance_km: 3.2,
      estimated_minutes: 4
    },
    "The Next Home Skardu": {
      distance_km: 3.2,
      estimated_minutes: 4
    },
    "Heaven Hotel Skardu": {
      distance_km: 3.2,
      estimated_minutes: 4
    },
    "Skardu Midway hotel": {
      distance_km: 3.7,
      estimated_minutes: 4
    },
    "Sarfaranga Reaidency": {
      distance_km: 4.1,
      estimated_minutes: 4
    },
    "Skengoo Inn Hotel": {
      distance_km: 4.2,
      estimated_minutes: 5
    },
    "Alnoor Starlet Hotel": {
      distance_km: 4.4,
      estimated_minutes: 5
    },
    "Top Hill Resort": {
      distance_km: 5,
      estimated_minutes: 6
    },
    "Royal Resort Skardu": {
      distance_km: 4.6,
      estimated_minutes: 5
    },
    "Signature Skardu Hotel": {
      distance_km: 4.7,
      estimated_minutes: 5
    },
    "Shama Resort Skardu": {
      distance_km: 4.7,
      estimated_minutes: 5
    },
    "Pearl of Skardu Resort": {
      distance_km: 4.8,
      estimated_minutes: 5
    },
    "Crystal Mountain Lodge": {
      distance_km: 4.9,
      estimated_minutes: 5
    },
    "H A K S RESSORT": {
      distance_km: 5.6,
      estimated_minutes: 6
    },
    "Shaheen Guest House Skardu": {
      distance_km: 5.8,
      estimated_minutes: 6
    },
    "Nirvana Resort Skardu": {
      distance_km: 6.1,
      estimated_minutes: 6
    }
  },
  "Hassan Hussain Host": {
     "Sundus Skilgrong": { distance_km: 4.4, estimated_minutes: 14 },
    "Sundus Gond": { distance_km: 5.2, estimated_minutes: 17 },
    "Newranga": { distance_km: 3.9, estimated_minutes: 12 },
    "Katpana": { distance_km: 7.3, estimated_minutes: 22 },
    "Khargrong": { distance_km: 0.7, estimated_minutes: 2 },
    "Hasnain Nagar": { distance_km: 0.75, estimated_minutes: 4 },
    "Alamdar Chowk": { distance_km: 0.5, estimated_minutes: 2 },
    "Hassan Colony": { distance_km: 1.8, estimated_minutes: 7 },
    "Hassan Colony Pine": { distance_km: 1.8, estimated_minutes: 7 },
    "Shinkhani Gond": { distance_km: 1.3, estimated_minutes: 6 },
    "Oldiing Nansoq": { distance_km: 2.5, estimated_minutes: 8 },
    "RHQ Road Harriot Hotel": { distance_km: 1.6, estimated_minutes: 5 },
    "Newranga Near Agha Ali House": { distance_km: 2.1, estimated_minutes: 8 },
    "Newranga ": { distance_km: 4.1, estimated_minutes: 16 },
    "Kushmarah": { distance_km: 3.3, estimated_minutes: 10 },
    "Sherthang Girls High School": { distance_km: 2.2, estimated_minutes: 8 },
    "Marfie Colony": { distance_km: 1.6, estimated_minutes: 6 },
    "Chumik": { distance_km: 1.7, estimated_minutes: 7 },
    "Gamba Skardu": { distance_km: 11, estimated_minutes: 23 },
    "United Line, Hassan Colony": { distance_km: 1.6, estimated_minutes: 6 },
    "Muhib Road Khargrong": { distance_km: 0.85, estimated_minutes: 3 },
    "GB Chief Court Skardu Registry Skardu": { distance_km: 4.3, estimated_minutes: 13 },
    "Shaheen Public School Skardu": { distance_km: 2.6, estimated_minutes: 11 },
    "Mehdi Colony Skardu": { distance_km: 2.7, estimated_minutes: 11 },
    "Agha Hadi Chowk": { distance_km: 0.5, estimated_minutes: 2 },
    "Hussainabad": { distance_km: 6, estimated_minutes: 14 },
    "Himalaya Hotel Hussainabad, Skardu": { distance_km: 6, estimated_minutes: 14 },
    "Hameed Garh": { distance_km: 1.2, estimated_minutes: 4 },
    "Shaheed colony": { distance_km: 3.9, estimated_minutes: 14 },
    "Tufail colony": { distance_km: 3.2, estimated_minutes: 12 },
    "Jafferi Mohallah": { distance_km: 2.3, estimated_minutes: 9 },
    "Chogo Matamsara": { distance_km: 1.8, estimated_minutes: 8 },
    "Nagulispang Road": { distance_km: 1.1, estimated_minutes: 4 },
    "Eidgah,Sundus ": { distance_km: 2.8, estimated_minutes: 10 },
    "Sukemaidan ": { distance_km: 1.2, estimated_minutes: 4 },
    "Hargissa shakthang": { distance_km: 1.9, estimated_minutes: 7 },
    "Bhutto Bazar Skardu": { distance_km: 1.8, estimated_minutes: 6 },
    "Devision": { distance_km: 2.2, estimated_minutes: 9 },
    "Abbas Town": { distance_km: 1.5, estimated_minutes: 6 },
    "Musa Line": { distance_km: 1.5, estimated_minutes: 6 },
    "Clifton pull": { distance_km: 1.3, estimated_minutes: 5 },
    "Sheikh ijaz masjid": { distance_km: 1.9, estimated_minutes: 7 },
    "Khila Toq Road": { distance_km: 1.2, estimated_minutes: 4 },
    "Public school area": { distance_km: 2.7, estimated_minutes: 9 },
    "Xhathang": { distance_km: 2.8, estimated_minutes: 9 },
    "Brolmo colony sundus": { distance_km: 4.5, estimated_minutes: 16 },
    "Ghazi Colony sundus": { distance_km: 4.8, estimated_minutes: 17 },
    "Hyderabad Gangupi Area": { distance_km: 0.75, estimated_minutes: 3 },
    "LT Col ihsan Ali rd": { distance_km: 0.7, estimated_minutes: 3 },
    "Astana skardu": { distance_km: 4.3, estimated_minutes: 12 },
    "Bintul Huda Girls model school": { distance_km: 5, estimated_minutes: 15 },
    "Brolmo colony astana": { distance_km: 4, estimated_minutes: 13 },
    "Raees mohalla Haji Gam": { distance_km: 2.5, estimated_minutes: 9 },
    "Haji Gam": { distance_km: 1.4, estimated_minutes: 5 },
    "Gulshan e Ali skardu": { distance_km: 1.7, estimated_minutes: 5 },
    "Jamia masjid road": { distance_km: 0.95, estimated_minutes: 3 },
    "Gayool skardu": { distance_km: 5.8, estimated_minutes: 15 },
    "Toqrangah Skardu": { distance_km: 4.2, estimated_minutes: 13 },
    "Maqponsar skardu": { distance_km: 3.7, estimated_minutes: 12 },
    "Newranga road": { distance_km: 3.8, estimated_minutes: 11 },
    "Quaidabad": { distance_km: 2.3, estimated_minutes: 8 },
    "Kharpocho Road": { distance_km: 1.7, estimated_minutes: 7 },
    "Patwal": { distance_km: 0.95, estimated_minutes: 3 },
    "Olding": { distance_km: 2, estimated_minutes: 7 },
    "Karasmathang": { distance_km: 0.95, estimated_minutes: 3 },
    "Kachura": { distance_km: 28, estimated_minutes: 53 },
    "3 talwar chowk": { distance_km: 2.4, estimated_minutes: 6 },
    "Teen talwar chowk": { distance_km: 2.4, estimated_minutes: 6 },
    "Sahara Complex": { distance_km: null, estimated_minutes: null },
    "Ali plaza": { distance_km: 1.4, estimated_minutes: 6 },
    "Radio Pakistan Chowk": { distance_km: 3, estimated_minutes: 10 },
    "Manthal": { distance_km: 4.6, estimated_minutes: 13 },
   "Rus Olive Lodge": {
      distance_km: 4.5,
      estimated_minutes: 5
    },
    "Hargisa Resort Skardu": {
      distance_km: 5.5,
      estimated_minutes: 7
    },
    "LOKAL Rooms x Skardu (Katpana Retreat)": {
      distance_km: 5.4,
      estimated_minutes: 6
    },
    "Green Orchard Skardu": {
      distance_km: 3.5,
      estimated_minutes: 4
    },
    "Oasis Resort Katpana Skardu": {
      distance_km: 5.8,
      estimated_minutes: 7
    },
    "Avari Xpress Skardu Hotel": {
      distance_km: 3.9,
      estimated_minutes: 4
    },
    "Hotel Mashabrum Skardu": {
      distance_km: 2.8,
      estimated_minutes: 4
    },
    "Skardu Luxus Hotel": {
      distance_km: 2.8,
      estimated_minutes: 4
    },
    "The Mountain Cottage Skardu": {
      distance_km: 3.2,
      estimated_minutes: 4
    },
    "Summit Hotel Skardu": {
      distance_km: 3.1,
      estimated_minutes: 4
    },
    "Skardu Saraye Hotel & Resort": {
      distance_km: 3.9,
      estimated_minutes: 6
    },
    "Baltistan Tourist Cottage - Skardu": {
      distance_km: 3.3,
      estimated_minutes: 4
    },
    "Glamp Pakistan": {
      distance_km: 6.8,
      estimated_minutes: 9
    },
    "Montagna Pods": {
      distance_km: 6.9,
      estimated_minutes: 10
    },
    "Hotel Luxy Skardu": {
      distance_km: 4.2,
      estimated_minutes: 5
    },
    "Baltistan Fort, Skardu Resort Hotel": {
      distance_km: 8.8,
      estimated_minutes: 12
    },
    "Hotel Skardu1": {
      distance_km: 2.4,
      estimated_minutes: 3
    },
    "Baltistan Resort": {
      distance_km: 2.4,
      estimated_minutes: 3
    },
    "Skardu Royal Hotel & Restaurant": {
      distance_km: 1.8,
      estimated_minutes: 2
    },
    "Sharif Cottages and Hotel Skardu": {
      distance_km: 5.3,
      estimated_minutes: 5
    },
    "Base Camp Katpana": {
      distance_km: 7.9,
      estimated_minutes: 12
    },
    "Hotel Dewan-e-Khas": {
      distance_km: 2,
      estimated_minutes: 3
    },
    "Legend Hotel Skardu": {
      distance_km: 1.6,
      estimated_minutes: 2
    },
    "Northlanders Guest House Skardu": {
      distance_km: 1.7,
      estimated_minutes: 2
    },
    "Hotel Travellodge Skardu": {
      distance_km: 1.4,
      estimated_minutes: 2
    },
    "Qayam Skardu": {
      distance_km: 6.1,
      estimated_minutes: 6
    },
    "Rafsal A Countryside Cottage": {
      distance_km: 6.3,
      estimated_minutes: 8
    },
    "Kentish Lodge Skardu": {
      distance_km: 1.2,
      estimated_minutes: 2
    },
    "Skardu Villas": {
      distance_km: 6.5,
      estimated_minutes: 6
    },
    "The Cherry Courtyard": {
      distance_km: 6.6,
      estimated_minutes: 6
    },
    "Ringchan Guest House & Restaurant": {
      distance_km: 1.2,
      estimated_minutes: 2
    },
    "Skardu Lodge": {
      distance_km: 0.8,
      estimated_minutes: 1
    },
    "Karakoram Nest": {
      distance_km: 1.5,
      estimated_minutes: 2
    },
    "Dynasty Skardu": {
      distance_km: 6.9,
      estimated_minutes: 7
    },
    "Sehrish Guest House Skardu": {
      distance_km: 0.9,
      estimated_minutes: 2
    },
    "PTDC Motel Skardu": {
      distance_km: 1.4,
      estimated_minutes: 2
    },
    "Hotel Reego Skardu": {
      distance_km: 0.2,
      estimated_minutes: 1
    },
    "Lavender Cottage & Guest House": {
      distance_km: 0.9,
      estimated_minutes: 2
    },
    "Rock View Skardu": {
      distance_km: 0.8,
      estimated_minutes: 2
    },
    "Dream Guest House Haji Gam Chowk": {
      distance_km: 1.3,
      estimated_minutes: 2
    },
    "Indus Lodges Skardu": {
      distance_km: 1.6,
      estimated_minutes: 2
    },
    "Pacific Guest House Skardu": {
      distance_km: 2.3,
      estimated_minutes: 3
    },
    "Skardu View Point Hotel and Huts": {
      distance_km: 2.3,
      estimated_minutes: 3
    },
    "Khar Hotel Skardu": {
      distance_km: 1.3,
      estimated_minutes: 2
    },
    "HIKK Inn Skardu": {
      distance_km: 2.3,
      estimated_minutes: 3
    },
    "Taaj Residence Skardu": {
      distance_km: 1.2,
      estimated_minutes: 2
    },
    "Homeland Guest House Skardu": {
      distance_km: 0.6,
      estimated_minutes: 1
    },
    "Sultan Guest House Skardu": {
      distance_km: 1.7,
      estimated_minutes: 3
    },
    "The Hill Town Resort": {
      distance_km: 2.4,
      estimated_minutes: 3
    },
    "AlJannah Guest House Skardu": {
      distance_km: 2.2,
      estimated_minutes: 2
    },
    "Deosai Gateway Inn Skardu": {
      distance_km: 2.2,
      estimated_minutes: 3
    },
    "Skardu Arcadian Resort": {
      distance_km: 9.4,
      estimated_minutes: 11
    },
    "Areena Hotel Skardu": {
      distance_km: 1.3,
      estimated_minutes: 2
    },
    "Skardu Farmhouse for stay": {
      distance_km: 2.8,
      estimated_minutes: 3
    },
    "Adventure Sarai Hotel Skardu": {
      distance_km: 2.3,
      estimated_minutes: 3
    },
    "Maple Resort": {
      distance_km: 13.1,
      estimated_minutes: 15
    },
    "Candela Resorts": {
      distance_km: 3.2,
      estimated_minutes: 3
    },
    "Hispar Hotel Skardu": {
      distance_km: 3.2,
      estimated_minutes: 4
    },
    "K2 Paradise Guest House": {
      distance_km: 2.1,
      estimated_minutes: 2
    },
    "Holiday Mountain Resort & Camping Site": {
      distance_km: 3.7,
      estimated_minutes: 5
    },
    "Mountain Lodge Skardu": {
      distance_km: 3.8,
      estimated_minutes: 5
    },
    "Mulberry Continental Hotel Skardu": {
      distance_km: 11.6,
      estimated_minutes: 10
    },
    "PC Legacy Skardu": {
      distance_km: 11.7,
      estimated_minutes: 10
    },
    "GB Lodges": {
      distance_km: 12.5,
      estimated_minutes: 11
    },
    "Bilafond Cottage": {
      distance_km: 7.2,
      estimated_minutes: 9
    },
    "North Hills Skardu": {
      distance_km: 1.2,
      estimated_minutes: 2
    },
    "Pinnacle Executive Lodges": {
      distance_km: 13.1,
      estimated_minutes: 11
    },
    "Safena Hotel Skardu": {
      distance_km: 15.8,
      estimated_minutes: 13
    },
    "Byarsa Hotel Skardu": {
      distance_km: 25.7,
      estimated_minutes: 21
    },
    "Dream Nest Resort Hotels Skardu": {
      distance_km: 34.3,
      estimated_minutes: 35
    },
    "Stream view guest house skardu": {
      distance_km: 1.8,
      estimated_minutes: 3
    },
    "Shangrila Resort Skardu": {
      distance_km: 26.6,
      estimated_minutes: 24
    },
    "Kachura Inn Skardu": {
      distance_km: 31.5,
      estimated_minutes: 29
    },
    "Tibet Hotel Kachura Skardu": {
      distance_km: 29.9,
      estimated_minutes: 25
    },
    "Hotel Mountain Lagoon Skardu": {
      distance_km: 27,
      estimated_minutes: 26
    },
    "Skardu River Resort": {
      distance_km: 27.2,
      estimated_minutes: 26
    },
    "Morning Resort": {
      distance_km: 30.4,
      estimated_minutes: 25
    },
    "Hotel Desert Bloom Skardu": {
      distance_km: 4.6,
      estimated_minutes: 5
    },
    "TheQue Skardu": {
      distance_km: 30.9,
      estimated_minutes: 26
    },
    "Singay Homestay Skardu": {
      distance_km: 1.7,
      estimated_minutes: 3
    },
    "Baltistan Crown Resort": {
      distance_km: 6.7,
      estimated_minutes: 7
    },
    "Fatah inn Guest House": {
      distance_km: 6.9,
      estimated_minutes: 8
    },
    "Kunhar": {
      distance_km: 6.5,
      estimated_minutes: 6
    },
    "Maltoro guest house": {
      distance_km: 6.6,
      estimated_minutes: 6
    },
    "Apex Hotels and Resorts Skardu": {
      distance_km: 6.7,
      estimated_minutes: 6
    },
    "Hotel virsa": {
      distance_km: 6.7,
      estimated_minutes: 6
    },
    "Elli's Luxus": {
      distance_km: 7.4,
      estimated_minutes: 7
    },
    "Skardu Gateway Hotel & Restaurant": {
      distance_km: 7.4,
      estimated_minutes: 7
    },
    "Polo Land Hotel by Skyline": {
      distance_km: 7.5,
      estimated_minutes: 7
    },
    "Baltistan White House Hotel": {
      distance_km: 7.8,
      estimated_minutes: 7
    },
    "The Pioneer Hotel": {
      distance_km: 7.9,
      estimated_minutes: 7
    },
    "Ramovi Guest House": {
      distance_km: 8,
      estimated_minutes: 7
    },
    "Friends & Family Guest House": {
      distance_km: 8.4,
      estimated_minutes: 7
    },
    "SKY LAKE GUEST HOUSE": {
      distance_km: 8.6,
      estimated_minutes: 8
    },
    "Skardu bliss hotel": {
      distance_km: 9.9,
      estimated_minutes: 9
    },
    "Comfort inn hotel": {
      distance_km: 9.9,
      estimated_minutes: 9
    },
    "Grand Hotel Skardu": {
      distance_km: 10.2,
      estimated_minutes: 9
    },
    "Baltistan inn hotel": {
      distance_km: 10.4,
      estimated_minutes: 9
    },
    "Grand view hotel": {
      distance_km: 10.4,
      estimated_minutes: 9
    },
    "Hotel walnut": {
      distance_km: 11.4,
      estimated_minutes: 10
    },
    "ABC hotel": {
      distance_km: 11.5,
      estimated_minutes: 10
    },
    "Lashari Resort Skardu": {
      distance_km: 11.7,
      estimated_minutes: 10
    },
    "Melody Hills Skardu": {
      distance_km: 12,
      estimated_minutes: 10
    },
    "NJM House Near Skardu Airport": {
      distance_km: 12,
      estimated_minutes: 10
    },
    "Le Yurt Skardu": {
      distance_km: 12.2,
      estimated_minutes: 10
    },
    "FearLess lodge": {
      distance_km: 13.4,
      estimated_minutes: 13
    },
    "Wamiq Skardu Resort": {
      distance_km: 16.1,
      estimated_minutes: 15
    },
    "Hosho Guest House": {
      distance_km: 14.8,
      estimated_minutes: 12
    },
    "Orgventure Resorts Skardu": {
      distance_km: 16.1,
      estimated_minutes: 13
    },
    "Green orchard skardu": {
      distance_km: 3.5,
      estimated_minutes: 4
    },
    "Mount View hotel skardu": {
      distance_km: 3.3,
      estimated_minutes: 4
    },
    "Laal Haveli": {
      distance_km: 3.2,
      estimated_minutes: 4
    },
    "Skardu view Guest house": {
      distance_km: 3,
      estimated_minutes: 4
    },
    "Baltistan Mountain Chalet Hotel": {
      distance_km: 3,
      estimated_minutes: 4
    },
    "Hotel Five star & restaurant skardu": {
      distance_km: 2.9,
      estimated_minutes: 4
    },
    "Tufail palace hotel & restaurant": {
      distance_km: 2.9,
      estimated_minutes: 4
    },
    "Indus motel": {
      distance_km: 2.7,
      estimated_minutes: 3
    },
    "Paradise hotel": {
      distance_km: 2.5,
      estimated_minutes: 3
    },
    "Hotel Red sun": {
      distance_km: 2.5,
      estimated_minutes: 3
    },
    "Haks hotel": {
      distance_km: 2.4,
      estimated_minutes: 3
    },
    "Hotel inn skardu": {
      distance_km: 2.4,
      estimated_minutes: 3
    },
    "Skardu embassy hotel": {
      distance_km: 2.3,
      estimated_minutes: 3
    },
    "Hotel Delight Skardu": {
      distance_km: 2.3,
      estimated_minutes: 3
    },
    "Ayan Hotel": {
      distance_km: 1.6,
      estimated_minutes: 2
    },
    "Hotel Highlander inn": {
      distance_km: 1.3,
      estimated_minutes: 2
    },
    "The North face inn hotel skardu": {
      distance_km: 1.5,
      estimated_minutes: 2
    },
    "The yak Hotel skardu": {
      distance_km: 1.5,
      estimated_minutes: 2
    },
    "Indus lodge skardu": {
      distance_km: 1.6,
      estimated_minutes: 2
    },
    "Stay inn hotel": {
      distance_km: 1.6,
      estimated_minutes: 2
    },
    "Eden Rock skardu": {
      distance_km: 1.6,
      estimated_minutes: 2
    },
    "Concordia Motel Baltistan": {
      distance_km: 1.9,
      estimated_minutes: 2
    },
    "Harriot Skardu": {
      distance_km: 2.3,
      estimated_minutes: 2
    },
    "Hotel PeakNest": {
      distance_km: 2.3,
      estimated_minutes: 2
    },
    "Royal Glaxy Hotel": {
      distance_km: 2.5,
      estimated_minutes: 3
    },
    "Sarfaranga view rock Guest house skardu": {
      distance_km: 2.3,
      estimated_minutes: 2
    },
    "Eat and Read Guesthouse skardu": {
      distance_km: 2.2,
      estimated_minutes: 2
    },
    "North Face explorers": {
      distance_km: 2.2,
      estimated_minutes: 2
    },
    "Holiday resort skardu": {
      distance_km: 2.2,
      estimated_minutes: 2
    },
    "Kallisto Resort": {
      distance_km: 2.2,
      estimated_minutes: 2
    },
    "Sagar hotel skardu": {
      distance_km: 2.4,
      estimated_minutes: 2
    },
    "Hotel Elite skardu": {
      distance_km: 2.1,
      estimated_minutes: 2
    },
    "SnowLand Resort": {
      distance_km: 3.1,
      estimated_minutes: 4
    },
    "Bismillah Guest House": {
      distance_km: 3.2,
      estimated_minutes: 4
    },
    "Hotel Yak sarai": {
      distance_km: 3.2,
      estimated_minutes: 4
    },
    "The North Palace": {
      distance_km: 3.2,
      estimated_minutes: 4
    },
    "Duqsa Family Guest House": {
      distance_km: 3.5,
      estimated_minutes: 4
    },
    "Wazir's villa": {
      distance_km: 3.5,
      estimated_minutes: 5
    },
    "Hotel Rewaaj": {
      distance_km: 3.3,
      estimated_minutes: 4
    },
    "Comfort Hotel & Huts skardu": {
      distance_km: 2.8,
      estimated_minutes: 3
    },
    "Zam Zam Guest House": {
      distance_km: 2.5,
      estimated_minutes: 3
    },
    "The Mountain Gypsy Resort": {
      distance_km: 2.6,
      estimated_minutes: 3
    },
    "Rigo Resort Skardu": {
      distance_km: 3.5,
      estimated_minutes: 5
    },
    "Arish Luxury Sites": {
      distance_km: 1.5,
      estimated_minutes: 3
    },
    "InterContinental Hotel": {
      distance_km: 1.1,
      estimated_minutes: 2
    },
    "Royal fort resort skardu": {
      distance_km: 1.2,
      estimated_minutes: 2
    },
    "Meer Stay and Dine skardu": {
      distance_km: 1,
      estimated_minutes: 1
    },
    "Dream Land Guest House": {
      distance_km: 1.6,
      estimated_minutes: 3
    },
    "Hotel GraceLand": {
      distance_km: 1.1,
      estimated_minutes: 2
    },
    "MOUNTAIN MAJESTY INN SKARDU": {
      distance_km: 1.5,
      estimated_minutes: 2
    },
    "Alnoor Lodges": {
      distance_km: 1.7,
      estimated_minutes: 2
    },
    "Jasper House": {
      distance_km: 1.9,
      estimated_minutes: 3
    },
    "The Himalayan Guest House": {
      distance_km: 2,
      estimated_minutes: 2
    },
    "Epoch Inn Guest House Skardu": {
      distance_km: 2.1,
      estimated_minutes: 3
    },
    "Mountaindale Guest House": {
      distance_km: 2.2,
      estimated_minutes: 2
    },
    "Al Jannah Guest House Skardu": {
      distance_km: 2.2,
      estimated_minutes: 2
    },
    "Biafo Resort Skardu": {
      distance_km: 2.2,
      estimated_minutes: 3
    },
    "Skardu Blossom Inn": {
      distance_km: 2.3,
      estimated_minutes: 3
    },
    "The Diamond Guest House Skardu": {
      distance_km: 2.4,
      estimated_minutes: 3
    },
    "Anarres | A Creative Residency": {
      distance_km: 2.8,
      estimated_minutes: 3
    },
    "Submit Embassy Hotel": {
      distance_km: 2.8,
      estimated_minutes: 3
    },
    "Alpine Abode Skardu": {
      distance_km: 3.2,
      estimated_minutes: 4
    },
    "Relax Inn Skardu": {
      distance_km: 3.2,
      estimated_minutes: 4
    },
    "Gumaan Resort Skardu": {
      distance_km: 3.4,
      estimated_minutes: 4
    },
    "Yuligo Resort Skardu": {
      distance_km: 3.6,
      estimated_minutes: 4
    },
    "Urban escape resort": {
      distance_km: 1.3,
      estimated_minutes: 2
    },
    "Mohsin Lodge Skardu": {
      distance_km: 1.3,
      estimated_minutes: 2
    },
    "Back To Home Lodging": {
      distance_km: 1.4,
      estimated_minutes: 2
    },
    "Royal Brangsa Guest House": {
      distance_km: 1,
      estimated_minutes: 2
    },
    "Wazir Guest House Skardu": {
      distance_km: 0.7,
      estimated_minutes: 1
    },
    "Golden Ibex Guest House": {
      distance_km: 0.6,
      estimated_minutes: 1
    },
    "Up Way Guest House": {
      distance_km: 0.8,
      estimated_minutes: 2
    },
    "Kunlun Peak Inn skardu": {
      distance_km: 1.3,
      estimated_minutes: 2
    },
    "Markhor Hotel": {
      distance_km: 1.5,
      estimated_minutes: 2
    },
    "Tibet hotel skardu": {
      distance_km: 1.8,
      estimated_minutes: 3
    },
    "Alpha Nomads House": {
      distance_km: 1.9,
      estimated_minutes: 3
    },
    "Dirleh Hotel": {
      distance_km: 2.5,
      estimated_minutes: 4
    },
    "North Home Skardu": {
      distance_km: 2.5,
      estimated_minutes: 3
    },
    "Valhalla Guest House": {
      distance_km: 2,
      estimated_minutes: 4
    },
    "Creek villa skardu": {
      distance_km: 2.1,
      estimated_minutes: 4
    },
    "Prince Tourist Hut": {
      distance_km: 2.4,
      estimated_minutes: 4
    },
    "Mountain House": {
      distance_km: 2.5,
      estimated_minutes: 4
    },
    "Reechan Resort House": {
      distance_km: 2.2,
      estimated_minutes: 3
    },
    "Himalayan Guest House Hassan colony": {
      distance_km: 2.2,
      estimated_minutes: 3
    },
    "Jasmine Skardu": {
      distance_km: 2.3,
      estimated_minutes: 3
    },
    "Mountain Face Skardu": {
      distance_km: 2.4,
      estimated_minutes: 4
    },
    "Four Seasons Bed and Breakfast": {
      distance_km: 2.3,
      estimated_minutes: 3
    },
    "Flora Inn skardu": {
      distance_km: 2.3,
      estimated_minutes: 3
    },
    "Broadpeak Resort skardu": {
      distance_km: 2.4,
      estimated_minutes: 4
    },
    "Chinar Residency": {
      distance_km: 2.7,
      estimated_minutes: 3
    },
    "Buddha Rock Guest House Skardu": {
      distance_km: 2.8,
      estimated_minutes: 3
    },
    "Buddha view Resort skardu": {
      distance_km: 2.8,
      estimated_minutes: 3
    },
    "Moonal Residency": {
      distance_km: 3,
      estimated_minutes: 4
    },
    "Skarchan Resort skardu": {
      distance_km: 3.1,
      estimated_minutes: 4
    },
    "ZAGO Guest House": {
      distance_km: 1.9,
      estimated_minutes: 3
    },
    "Skardu Blossom Guest House": {
      distance_km: 1.9,
      estimated_minutes: 3
    },
    "Harpo Resorts": {
      distance_km: 1.9,
      estimated_minutes: 3
    },
    "Baltistan Continental Hotel skardu": {
      distance_km: 1.2,
      estimated_minutes: 2
    },
    "Al Abbas Guest House": {
      distance_km: 1.2,
      estimated_minutes: 1
    },
    "Apricot Spring Resort Skardu": {
      distance_km: 1.1,
      estimated_minutes: 1
    },
    "Executive Guest House Skardu": {
      distance_km: 1,
      estimated_minutes: 2
    },
    "Hotel Bloom Hills,Skardu": {
      distance_km: 2.8,
      estimated_minutes: 3
    },
    "Siachen Stay&Tours": {
      distance_km: 2.7,
      estimated_minutes: 3
    },
    "Mountain Guest House and Desi Restaurant": {
      distance_km: 2.5,
      estimated_minutes: 3
    },
    "Decent Baltistan guest house": {
      distance_km: 2.4,
      estimated_minutes: 3
    },
    "Baltistan Village Guest House": {
      distance_km: 2.3,
      estimated_minutes: 3
    },
    "Bareen": {
      distance_km: 2.2,
      estimated_minutes: 3
    },
    "SUMMIT GUEST HOUSE": {
      distance_km: 2.2,
      estimated_minutes: 3
    },
    "Serene Baltistan Hotel": {
      distance_km: 2.2,
      estimated_minutes: 3
    },
    "Alpha Hotel & Restaurant": {
      distance_km: 1.8,
      estimated_minutes: 2
    },
    "Saani Rooms": {
      distance_km: 1.7,
      estimated_minutes: 2
    },
    "Ridakh Inn": {
      distance_km: 1.5,
      estimated_minutes: 2
    },
    "Clifton Spachan Hotel": {
      distance_km: 1.4,
      estimated_minutes: 2
    },
    "K2 Tourism Guest House": {
      distance_km: 1.4,
      estimated_minutes: 2
    },
    "Heaven's Adventure.pk": {
      distance_km: 3.7,
      estimated_minutes: 5
    },
    "Desert one hotel and restaurant skardu": {
      distance_km: 3.5,
      estimated_minutes: 4
    },
    "Yazgar Residency Skardu": {
      distance_km: 3.6,
      estimated_minutes: 4
    },
    "The Next Home Skardu": {
      distance_km: 3.6,
      estimated_minutes: 4
    },
    "Heaven Hotel Skardu": {
      distance_km: 3.6,
      estimated_minutes: 4
    },
    "Skardu Midway hotel": {
      distance_km: 4.1,
      estimated_minutes: 4
    },
    "Sarfaranga Reaidency": {
      distance_km: 4.5,
      estimated_minutes: 5
    },
    "Skengoo Inn Hotel": {
      distance_km: 4.6,
      estimated_minutes: 5
    },
    "Alnoor Starlet Hotel": {
      distance_km: 4.8,
      estimated_minutes: 5
    },
    "Top Hill Resort": {
      distance_km: 5.4,
      estimated_minutes: 6
    },
    "Royal Resort Skardu": {
      distance_km: 5,
      estimated_minutes: 5
    },
    "Signature Skardu Hotel": {
      distance_km: 5.1,
      estimated_minutes: 5
    },
    "Shama Resort Skardu": {
      distance_km: 5.1,
      estimated_minutes: 5
    },
    "Pearl of Skardu Resort": {
      distance_km: 5.1,
      estimated_minutes: 5
    },
    "Crystal Mountain Lodge": {
      distance_km: 5.3,
      estimated_minutes: 5
    },
    "H A K S RESSORT": {
      distance_km: 5.9,
      estimated_minutes: 6
    },
    "Shaheen Guest House Skardu": {
      distance_km: 6.2,
      estimated_minutes: 6
    },
    "Nirvana Resort Skardu": {
      distance_km: 6.5,
      estimated_minutes: 7
    }
  
  },
   "Pizza King Skardu": {
    "Sundus Skilgrong": { distance_km: 4.0, estimated_minutes: 13 },
    "Sundus Gond": { distance_km: 4.8, estimated_minutes: 14 },
    "Newranga": { distance_km: 3.6, estimated_minutes: 10 },
    "Katpana": { distance_km: 7.3, estimated_minutes: 22 },
    "Khargrong": { distance_km: 1.0, estimated_minutes: 4 },
    "Hasnain Nagar": { distance_km: 0.55, estimated_minutes: 2 },
    "Alamdar Chowk": { distance_km: 0.14, estimated_minutes: 1 },
    "Hassan Colony": { distance_km: 1.3, estimated_minutes: 5 },
    "Hassan Colony Pine": { distance_km: 1.4, estimated_minutes: 5 },
    "Shinkhani Gond": { distance_km: 0.95, estimated_minutes: 4 },
    "Oldiing Nansoq": { distance_km: 2.6, estimated_minutes: 8 },
    "RHQ Road Harriot Hotel": { distance_km: 2.0, estimated_minutes: 7 },
    "Newranga Near Agha Ali House": { distance_km: 1.7, estimated_minutes: 6 },
    "Newranga ": { distance_km: 3.6, estimated_minutes: 10 },
    "Kushmarah": { distance_km: 2.9, estimated_minutes: 8 },
    "Sherthang Girls High School": { distance_km: 1.9, estimated_minutes: 7 },
    "Marfie Colony": { distance_km: 1.7, estimated_minutes: 6 },
    "Chumik": { distance_km: 1.6, estimated_minutes: 6 },
    "Gamba Skardu": { distance_km: 11, estimated_minutes: 24 },
    "United Line, Hassan Colony": { distance_km: 1.2, estimated_minutes: 4 },
    "Muhib Road Khargrong": { distance_km: 1.4, estimated_minutes: 6 },
    "GB Chief Court Skardu Registry Skardu": { distance_km: 3.5, estimated_minutes: 11 },
    "Shaheen Public School Skardu": { distance_km: 2.3, estimated_minutes: 9 },
    "Mehdi Colony Skardu": { distance_km: 2.3, estimated_minutes: 9 },
    "Agha Hadi Chowk": { distance_km: 0.85, estimated_minutes: 3 },
    "Hussainabad": { distance_km: 6.7, estimated_minutes: 17 },
    "Himalaya Hotel Hussainabad, Skardu": { distance_km: 6.7, estimated_minutes: 17 },
    "Hameed Garh": { distance_km: 1.7, estimated_minutes: 5 },
    "Shaheed colony": { distance_km: 3.4, estimated_minutes: 10 },
    "Tufail colony": { distance_km: 2.8, estimated_minutes: 8 },
    "Jafferi Mohallah": { distance_km: 1.9, estimated_minutes: 7 },
    "Chogo Matamsara": { distance_km: 1.9, estimated_minutes: 8 },
    "Nagulispang Road": { distance_km: 0.95, estimated_minutes: 3 },
    "Eidgah,Sundus ": { distance_km: 3.4, estimated_minutes: 11 },
    "Sukemaidan ": { distance_km: 1.2, estimated_minutes: 4 },
    "Hargissa shakthang": { distance_km: 1.8, estimated_minutes: 7 },
    "Bhutto Bazar Skardu": { distance_km: 1.4, estimated_minutes: 5 },
    "Devision": { distance_km: 2.4, estimated_minutes: 8 },
    "Abbas Town": { distance_km: 1.8, estimated_minutes: 6 },
    "Musa Line": { distance_km: 1.0, estimated_minutes: 3 },
    "Clifton pull": { distance_km: 0.9, estimated_minutes: 2 },
    "Sheikh ijaz masjid": { distance_km: 1.5, estimated_minutes: 4 },
    "Khila Toq Road": { distance_km: 1.6, estimated_minutes: 5 },
    "Public school area": { distance_km: 2.2, estimated_minutes: 7 },
    "Xhathang": { distance_km: 2.8, estimated_minutes: 8 },
    "Brolmo colony sundus": { distance_km: 4.2, estimated_minutes: 11 },
    "Ghazi Colony sundus": { distance_km: 4.5, estimated_minutes: 13 },
    "Hyderabad Gangupi Area": { distance_km: 0.7, estimated_minutes: 2 },
    "LT Col ihsan Ali rd": { distance_km: 0.6, estimated_minutes: 2 },
    "Astana skardu": { distance_km: 3.5, estimated_minutes: 9 },
    "Bintul Huda Girls model school": { distance_km: 4.6, estimated_minutes: 10 },
    "Brolmo colony astana": { distance_km: 3.7, estimated_minutes: 8 },
    "Raees mohalla Haji Gam": { distance_km: 2.1, estimated_minutes: 7 },
    "Haji Gam": { distance_km: 1.6, estimated_minutes: 7 },
    "Gulshan e Ali skardu": { distance_km: 2.1, estimated_minutes: 6 },
    "Jamia masjid road": { distance_km: 0.8, estimated_minutes: 3 },
    "Gayool skardu": { distance_km: 5.5, estimated_minutes: 11 },
    "Toqrangah Skardu": { distance_km: 3.8, estimated_minutes: 9 },
    "Maqponsar skardu": { distance_km: 3.6, estimated_minutes: 8 },
    "Newranga road": { distance_km: 3.3, estimated_minutes: 7 },
    "Quaidabad": { distance_km: 1.9, estimated_minutes: 4 },
    "Kharpocho Road": { distance_km: 1.5, estimated_minutes: 6 },
    "Patwal": { distance_km: 1.4, estimated_minutes: 4 },
    "Olding": { distance_km: 2.4, estimated_minutes: 7 },
    "Karasmathang": { distance_km: 1.3, estimated_minutes: 3 },
    "Kachura": { distance_km: 28, estimated_minutes: 48 },
    "3 talwar chowk": { distance_km: 2.5, estimated_minutes: 6 },
    "Teen talwar chowk": { distance_km: 2.5, estimated_minutes: 6 },
    "Sahara Complex": { distance_km: 2.4, estimated_minutes: 6 },
    "Ali plaza": { distance_km: 1.3, estimated_minutes: 4 },
    "Radio Pakistan Chowk": { distance_km: 2.6, estimated_minutes: 6 },
    "Manthal": { distance_km: 4.4, estimated_minutes: 13 },


    "Rus Olive Lodge": {
      distance_km: 4.2,
      estimated_minutes: 5
    },
    "Hargisa Resort Skardu": {
      distance_km: 5.1,
      estimated_minutes: 7
    },
    "LOKAL Rooms x Skardu (Katpana Retreat)": {
      distance_km: 5.1,
      estimated_minutes: 6
    },
    "Green Orchard Skardu": {
      distance_km: 3.2,
      estimated_minutes: 4
    },
    "Oasis Resort Katpana Skardu": {
      distance_km: 5.4,
      estimated_minutes: 7
    },
    "Avari Xpress Skardu Hotel": {
      distance_km: 3.6,
      estimated_minutes: 4
    },
    "Hotel Mashabrum Skardu": {
      distance_km: 2.5,
      estimated_minutes: 4
    },
    "Skardu Luxus Hotel": {
      distance_km: 2.5,
      estimated_minutes: 4
    },
    "The Mountain Cottage Skardu": {
      distance_km: 2.9,
      estimated_minutes: 4
    },
    "Summit Hotel Skardu": {
      distance_km: 2.7,
      estimated_minutes: 4
    },
    "Skardu Saraye Hotel & Resort": {
      distance_km: 3.6,
      estimated_minutes: 6
    },
    "Baltistan Tourist Cottage - Skardu": {
      distance_km: 3,
      estimated_minutes: 4
    },
    "Glamp Pakistan": {
      distance_km: 6.5,
      estimated_minutes: 9
    },
    "Montagna Pods": {
      distance_km: 6.6,
      estimated_minutes: 10
    },
    "Hotel Luxy Skardu": {
      distance_km: 3.8,
      estimated_minutes: 5
    },
    "Baltistan Fort, Skardu Resort Hotel": {
      distance_km: 8.4,
      estimated_minutes: 13
    },
    "Hotel Skardu1": {
      distance_km: 2.1,
      estimated_minutes: 3
    },
    "Baltistan Resort": {
      distance_km: 2.1,
      estimated_minutes: 3
    },
    "Skardu Royal Hotel & Restaurant": {
      distance_km: 1.5,
      estimated_minutes: 3
    },
    "Sharif Cottages and Hotel Skardu": {
      distance_km: 5,
      estimated_minutes: 5
    },
    "Base Camp Katpana": {
      distance_km: 7.5,
      estimated_minutes: 12
    },
    "Hotel Dewan-e-Khas": {
      distance_km: 1.8,
      estimated_minutes: 3
    },
    "Legend Hotel Skardu": {
      distance_km: 1.6,
      estimated_minutes: 3
    },
    "Northlanders Guest House Skardu": {
      distance_km: 1.5,
      estimated_minutes: 3
    },
    "Hotel Travellodge Skardu": {
      distance_km: 1.1,
      estimated_minutes: 2
    },
    "Qayam Skardu": {
      distance_km: 5.8,
      estimated_minutes: 6
    },
    "Rafsal A Countryside Cottage": {
      distance_km: 6,
      estimated_minutes: 9
    },
    "Kentish Lodge Skardu": {
      distance_km: 0.8,
      estimated_minutes: 2
    },
    "Skardu Villas": {
      distance_km: 6.2,
      estimated_minutes: 6
    },
    "The Cherry Courtyard": {
      distance_km: 6.2,
      estimated_minutes: 6
    },
    "Ringchan Guest House & Restaurant": {
      distance_km: 2,
      estimated_minutes: 3
    },
    "Skardu Lodge": {
      distance_km: 1.7,
      estimated_minutes: 2
    },
    "Karakoram Nest": {
      distance_km: 2.3,
      estimated_minutes: 3
    },
    "Dynasty Skardu": {
      distance_km: 6.5,
      estimated_minutes: 7
    },
    "Sehrish Guest House Skardu": {
      distance_km: 0.6,
      estimated_minutes: 2
    },
    "PTDC Motel Skardu": {
      distance_km: 2.3,
      estimated_minutes: 3
    },
    "Hotel Reego Skardu": {
      distance_km: 1,
      estimated_minutes: 2
    },
    "Lavender Cottage & Guest House": {
      distance_km: 0.6,
      estimated_minutes: 2
    },
    "Rock View Skardu": {
      distance_km: 0.5,
      estimated_minutes: 2
    },
    "Dream Guest House Haji Gam Chowk": {
      distance_km: 0.7,
      estimated_minutes: 2
    },
    "Indus Lodges Skardu": {
      distance_km: 2.4,
      estimated_minutes: 3
    },
    "Pacific Guest House Skardu": {
      distance_km: 1.7,
      estimated_minutes: 3
    },
    "Skardu View Point Hotel and Huts": {
      distance_km: 1.7,
      estimated_minutes: 3
    },
    "Khar Hotel Skardu": {
      distance_km: 1,
      estimated_minutes: 2
    },
    "HIKK Inn Skardu": {
      distance_km: 1.7,
      estimated_minutes: 3
    },
    "Taaj Residence Skardu": {
      distance_km: 1.1,
      estimated_minutes: 2
    },
    "Homeland Guest House Skardu": {
      distance_km: 1.5,
      estimated_minutes: 2
    },
    "Sultan Guest House Skardu": {
      distance_km: 1.1,
      estimated_minutes: 3
    },
    "The Hill Town Resort": {
      distance_km: 1.5,
      estimated_minutes: 3
    },
    "AlJannah Guest House Skardu": {
      distance_km: 2,
      estimated_minutes: 3
    },
    "Deosai Gateway Inn Skardu": {
      distance_km: 2,
      estimated_minutes: 3
    },
    "Skardu Arcadian Resort": {
      distance_km: 9.1,
      estimated_minutes: 11
    },
    "Areena Hotel Skardu": {
      distance_km: 2.2,
      estimated_minutes: 3
    },
    "Skardu Farmhouse for stay": {
      distance_km: 2.6,
      estimated_minutes: 3
    },
    "Adventure Sarai Hotel Skardu": {
      distance_km: 2.1,
      estimated_minutes: 3
    },
    "Maple Resort": {
      distance_km: 12.8,
      estimated_minutes: 16
    },
    "Candela Resorts": {
      distance_km: 3,
      estimated_minutes: 4
    },
    "Hispar Hotel Skardu": {
      distance_km: 3,
      estimated_minutes: 4
    },
    "K2 Paradise Guest House": {
      distance_km: 3,
      estimated_minutes: 3
    },
    "Holiday Mountain Resort & Camping Site": {
      distance_km: 3.5,
      estimated_minutes: 6
    },
    "Mountain Lodge Skardu": {
      distance_km: 3.6,
      estimated_minutes: 6
    },
    "Mulberry Continental Hotel Skardu": {
      distance_km: 11.2,
      estimated_minutes: 10
    },
    "PC Legacy Skardu": {
      distance_km: 11.4,
      estimated_minutes: 10
    },
    "GB Lodges": {
      distance_km: 12.2,
      estimated_minutes: 11
    },
    "Bilafond Cottage": {
      distance_km: 8,
      estimated_minutes: 10
    },
    "North Hills Skardu": {
      distance_km: 2.1,
      estimated_minutes: 3
    },
    "Pinnacle Executive Lodges": {
      distance_km: 12.7,
      estimated_minutes: 11
    },
    "Safena Hotel Skardu": {
      distance_km: 15.5,
      estimated_minutes: 13
    },
    "Byarsa Hotel Skardu": {
      distance_km: 25.4,
      estimated_minutes: 21
    },
    "Dream Nest Resort Hotels Skardu": {
      distance_km: 34,
      estimated_minutes: 35
    },
    "Stream view guest house skardu": {
      distance_km: 1.5,
      estimated_minutes: 3
    },
    "Shangrila Resort Skardu": {
      distance_km: 26.3,
      estimated_minutes: 24
    },
    "Kachura Inn Skardu": {
      distance_km: 31.1,
      estimated_minutes: 29
    },
    "Tibet Hotel Kachura Skardu": {
      distance_km: 29.6,
      estimated_minutes: 25
    },
    "Hotel Mountain Lagoon Skardu": {
      distance_km: 26.7,
      estimated_minutes: 26
    },
    "Skardu River Resort": {
      distance_km: 26.9,
      estimated_minutes: 26
    },
    "Morning Resort": {
      distance_km: 30.1,
      estimated_minutes: 26
    },
    "Hotel Desert Bloom Skardu": {
      distance_km: 4.3,
      estimated_minutes: 6
    },
    "TheQue Skardu": {
      distance_km: 30.6,
      estimated_minutes: 26
    },
    "Singay Homestay Skardu": {
      distance_km: 1.9,
      estimated_minutes: 3
    },
    "Baltistan Crown Resort": {
      distance_km: 6.4,
      estimated_minutes: 8
    },
    "Fatah inn Guest House": {
      distance_km: 6.5,
      estimated_minutes: 8
    },
    "Kunhar": {
      distance_km: 6.2,
      estimated_minutes: 7
    },
    "Maltoro guest house": {
      distance_km: 6.3,
      estimated_minutes: 6
    },
    "Apex Hotels and Resorts Skardu": {
      distance_km: 6.3,
      estimated_minutes: 6
    },
    "Hotel virsa": {
      distance_km: 6.4,
      estimated_minutes: 6
    },
    "Elli's Luxus": {
      distance_km: 7,
      estimated_minutes: 7
    },
    "Skardu Gateway Hotel & Restaurant": {
      distance_km: 7.1,
      estimated_minutes: 7
    },
    "Polo Land Hotel by Skyline": {
      distance_km: 7.2,
      estimated_minutes: 7
    },
    "Baltistan White House Hotel": {
      distance_km: 7.5,
      estimated_minutes: 7
    },
    "The Pioneer Hotel": {
      distance_km: 7.6,
      estimated_minutes: 7
    },
    "Ramovi Guest House": {
      distance_km: 7.6,
      estimated_minutes: 7
    },
    "Friends & Family Guest House": {
      distance_km: 8,
      estimated_minutes: 8
    },
    "SKY LAKE GUEST HOUSE": {
      distance_km: 8.3,
      estimated_minutes: 8
    },
    "Skardu bliss hotel": {
      distance_km: 9.6,
      estimated_minutes: 9
    },
    "Comfort inn hotel": {
      distance_km: 9.6,
      estimated_minutes: 9
    },
    "Grand Hotel Skardu": {
      distance_km: 9.9,
      estimated_minutes: 9
    },
    "Baltistan inn hotel": {
      distance_km: 10,
      estimated_minutes: 9
    },
    "Grand view hotel": {
      distance_km: 10,
      estimated_minutes: 9
    },
    "Hotel walnut": {
      distance_km: 11,
      estimated_minutes: 10
    },
    "ABC hotel": {
      distance_km: 11.2,
      estimated_minutes: 10
    },
    "Lashari Resort Skardu": {
      distance_km: 11.3,
      estimated_minutes: 10
    },
    "Melody Hills Skardu": {
      distance_km: 11.7,
      estimated_minutes: 10
    },
    "NJM House Near Skardu Airport": {
      distance_km: 11.7,
      estimated_minutes: 10
    },
    "Le Yurt Skardu": {
      distance_km: 11.9,
      estimated_minutes: 10
    },
    "FearLess lodge": {
      distance_km: 13.1,
      estimated_minutes: 13
    },
    "Wamiq Skardu Resort": {
      distance_km: 15.8,
      estimated_minutes: 16
    },
    "Hosho Guest House": {
      distance_km: 14.5,
      estimated_minutes: 12
    },
    "Orgventure Resorts Skardu": {
      distance_km: 15.7,
      estimated_minutes: 13
    },
    "Green orchard skardu": {
      distance_km: 3.2,
      estimated_minutes: 4
    },
    "Mount View hotel skardu": {
      distance_km: 3,
      estimated_minutes: 4
    },
    "Laal Haveli": {
      distance_km: 2.8,
      estimated_minutes: 4
    },
    "Skardu view Guest house": {
      distance_km: 2.7,
      estimated_minutes: 4
    },
    "Baltistan Mountain Chalet Hotel": {
      distance_km: 2.7,
      estimated_minutes: 4
    },
    "Hotel Five star & restaurant skardu": {
      distance_km: 2.6,
      estimated_minutes: 4
    },
    "Tufail palace hotel & restaurant": {
      distance_km: 2.6,
      estimated_minutes: 4
    },
    "Indus motel": {
      distance_km: 2.3,
      estimated_minutes: 4
    },
    "Paradise hotel": {
      distance_km: 2.2,
      estimated_minutes: 3
    },
    "Hotel Red sun": {
      distance_km: 2.2,
      estimated_minutes: 3
    },
    "Haks hotel": {
      distance_km: 2.1,
      estimated_minutes: 3
    },
    "Hotel inn skardu": {
      distance_km: 2.1,
      estimated_minutes: 3
    },
    "Skardu embassy hotel": {
      distance_km: 2,
      estimated_minutes: 3
    },
    "Hotel Delight Skardu": {
      distance_km: 2,
      estimated_minutes: 3
    },
    "Ayan Hotel": {
      distance_km: 1.5,
      estimated_minutes: 3
    },
    "Hotel Highlander inn": {
      distance_km: 2.2,
      estimated_minutes: 3
    },
    "The North face inn hotel skardu": {
      distance_km: 2.4,
      estimated_minutes: 3
    },
    "The yak Hotel skardu": {
      distance_km: 2.4,
      estimated_minutes: 3
    },
    "Indus lodge skardu": {
      distance_km: 2.4,
      estimated_minutes: 3
    },
    "Stay inn hotel": {
      distance_km: 2.4,
      estimated_minutes: 3
    },
    "Eden Rock skardu": {
      distance_km: 2.5,
      estimated_minutes: 3
    },
    "Concordia Motel Baltistan": {
      distance_km: 2.7,
      estimated_minutes: 3
    },
    "Harriot Skardu": {
      distance_km: 3.2,
      estimated_minutes: 3
    },
    "Hotel PeakNest": {
      distance_km: 3.2,
      estimated_minutes: 3
    },
    "Royal Glaxy Hotel": {
      distance_km: 3.4,
      estimated_minutes: 4
    },
    "Sarfaranga view rock Guest house skardu": {
      distance_km: 3.2,
      estimated_minutes: 3
    },
    "Eat and Read Guesthouse skardu": {
      distance_km: 3.1,
      estimated_minutes: 3
    },
    "North Face explorers": {
      distance_km: 3.1,
      estimated_minutes: 3
    },
    "Holiday resort skardu": {
      distance_km: 3,
      estimated_minutes: 3
    },
    "Kallisto Resort": {
      distance_km: 3,
      estimated_minutes: 3
    },
    "Sagar hotel skardu": {
      distance_km: 3.3,
      estimated_minutes: 3
    },
    "Hotel Elite skardu": {
      distance_km: 3,
      estimated_minutes: 3
    },
    "SnowLand Resort": {
      distance_km: 2.8,
      estimated_minutes: 4
    },
    "Bismillah Guest House": {
      distance_km: 2.9,
      estimated_minutes: 4
    },
    "Hotel Yak sarai": {
      distance_km: 2.8,
      estimated_minutes: 4
    },
    "The North Palace": {
      distance_km: 2.8,
      estimated_minutes: 4
    },
    "Duqsa Family Guest House": {
      distance_km: 3.1,
      estimated_minutes: 4
    },
    "Wazir's villa": {
      distance_km: 3.2,
      estimated_minutes: 5
    },
    "Hotel Rewaaj": {
      distance_km: 3,
      estimated_minutes: 4
    },
    "Comfort Hotel & Huts skardu": {
      distance_km: 2.4,
      estimated_minutes: 4
    },
    "Zam Zam Guest House": {
      distance_km: 2.2,
      estimated_minutes: 3
    },
    "The Mountain Gypsy Resort": {
      distance_km: 2.2,
      estimated_minutes: 3
    },
    "Rigo Resort Skardu": {
      distance_km: 3.3,
      estimated_minutes: 6
    },
    "Arish Luxury Sites": {
      distance_km: 1.9,
      estimated_minutes: 3
    },
    "InterContinental Hotel": {
      distance_km: 2,
      estimated_minutes: 3
    },
    "Royal fort resort skardu": {
      distance_km: 2.1,
      estimated_minutes: 3
    },
    "Meer Stay and Dine skardu": {
      distance_km: 1.9,
      estimated_minutes: 2
    },
    "Dream Land Guest House": {
      distance_km: 2.1,
      estimated_minutes: 4
    },
    "Hotel GraceLand": {
      distance_km: 2,
      estimated_minutes: 3
    },
    "MOUNTAIN MAJESTY INN SKARDU": {
      distance_km: 1.6,
      estimated_minutes: 3
    },
    "Alnoor Lodges": {
      distance_km: 1.5,
      estimated_minutes: 2
    },
    "Jasper House": {
      distance_km: 1.7,
      estimated_minutes: 3
    },
    "The Himalayan Guest House": {
      distance_km: 1.8,
      estimated_minutes: 3
    },
    "Epoch Inn Guest House Skardu": {
      distance_km: 1.9,
      estimated_minutes: 3
    },
    "Mountaindale Guest House": {
      distance_km: 2,
      estimated_minutes: 3
    },
    "Al Jannah Guest House Skardu": {
      distance_km: 2,
      estimated_minutes: 3
    },
    "Biafo Resort Skardu": {
      distance_km: 2,
      estimated_minutes: 3
    },
    "Skardu Blossom Inn": {
      distance_km: 2.1,
      estimated_minutes: 3
    },
    "The Diamond Guest House Skardu": {
      distance_km: 2.2,
      estimated_minutes: 3
    },
    "Anarres | A Creative Residency": {
      distance_km: 2.6,
      estimated_minutes: 3
    },
    "Submit Embassy Hotel": {
      distance_km: 2.6,
      estimated_minutes: 4
    },
    "Alpine Abode Skardu": {
      distance_km: 3,
      estimated_minutes: 4
    },
    "Relax Inn Skardu": {
      distance_km: 3,
      estimated_minutes: 4
    },
    "Gumaan Resort Skardu": {
      distance_km: 3.2,
      estimated_minutes: 4
    },
    "Yuligo Resort Skardu": {
      distance_km: 3.4,
      estimated_minutes: 4
    },
    "Urban escape resort": {
      distance_km: 1,
      estimated_minutes: 2
    },
    "Mohsin Lodge Skardu": {
      distance_km: 0.9,
      estimated_minutes: 2
    },
    "Back To Home Lodging": {
      distance_km: 0.9,
      estimated_minutes: 2
    },
    "Royal Brangsa Guest House": {
      distance_km: 0.7,
      estimated_minutes: 2
    },
    "Wazir Guest House Skardu": {
      distance_km: 0.4,
      estimated_minutes: 1
    },
    "Golden Ibex Guest House": {
      distance_km: 0.3,
      estimated_minutes: 1
    },
    "Up Way Guest House": {
      distance_km: 0.5,
      estimated_minutes: 2
    },
    "Kunlun Peak Inn skardu": {
      distance_km: 0.7,
      estimated_minutes: 2
    },
    "Markhor Hotel": {
      distance_km: 0.9,
      estimated_minutes: 2
    },
    "Tibet hotel skardu": {
      distance_km: 1.2,
      estimated_minutes: 3
    },
    "Alpha Nomads House": {
      distance_km: 1.3,
      estimated_minutes: 3
    },
    "Dirleh Hotel": {
      distance_km: 1.5,
      estimated_minutes: 4
    },
    "North Home Skardu": {
      distance_km: 1.5,
      estimated_minutes: 4
    },
    "Valhalla Guest House": {
      distance_km: 1.4,
      estimated_minutes: 3
    },
    "Creek villa skardu": {
      distance_km: 1.5,
      estimated_minutes: 4
    },
    "Prince Tourist Hut": {
      distance_km: 1.8,
      estimated_minutes: 4
    },
    "Mountain House": {
      distance_km: 1.9,
      estimated_minutes: 4
    },
    "Reechan Resort House": {
      distance_km: 1.6,
      estimated_minutes: 3
    },
    "Himalayan Guest House Hassan colony": {
      distance_km: 1.6,
      estimated_minutes: 3
    },
    "Jasmine Skardu": {
      distance_km: 1.7,
      estimated_minutes: 3
    },
    "Mountain Face Skardu": {
      distance_km: 1.8,
      estimated_minutes: 3
    },
    "Four Seasons Bed and Breakfast": {
      distance_km: 1.7,
      estimated_minutes: 3
    },
    "Flora Inn skardu": {
      distance_km: 1.7,
      estimated_minutes: 3
    },
    "Broadpeak Resort skardu": {
      distance_km: 1.8,
      estimated_minutes: 3
    },
    "Chinar Residency": {
      distance_km: 2.5,
      estimated_minutes: 4
    },
    "Buddha Rock Guest House Skardu": {
      distance_km: 2.6,
      estimated_minutes: 4
    },
    "Buddha view Resort skardu": {
      distance_km: 2.6,
      estimated_minutes: 4
    },
    "Moonal Residency": {
      distance_km: 2.8,
      estimated_minutes: 4
    },
    "Skarchan Resort skardu": {
      distance_km: 2.9,
      estimated_minutes: 5
    },
    "ZAGO Guest House": {
      distance_km: 1.3,
      estimated_minutes: 3
    },
    "Skardu Blossom Guest House": {
      distance_km: 1.3,
      estimated_minutes: 3
    },
    "Harpo Resorts": {
      distance_km: 1.3,
      estimated_minutes: 3
    },
    "Baltistan Continental Hotel skardu": {
      distance_km: 0.9,
      estimated_minutes: 2
    },
    "Al Abbas Guest House": {
      distance_km: 0.8,
      estimated_minutes: 2
    },
    "Apricot Spring Resort Skardu": {
      distance_km: 0.8,
      estimated_minutes: 2
    },
    "Executive Guest House Skardu": {
      distance_km: 0.7,
      estimated_minutes: 2
    },
    "Hotel Bloom Hills,Skardu": {
      distance_km: 2.5,
      estimated_minutes: 4
    },
    "Siachen Stay&Tours": {
      distance_km: 2.3,
      estimated_minutes: 3
    },
    "Mountain Guest House and Desi Restaurant": {
      distance_km: 2.2,
      estimated_minutes: 3
    },
    "Decent Baltistan guest house": {
      distance_km: 2,
      estimated_minutes: 3
    },
    "Baltistan Village Guest House": {
      distance_km: 2,
      estimated_minutes: 3
    },
    "Bareen": {
      distance_km: 1.9,
      estimated_minutes: 3
    },
    "SUMMIT GUEST HOUSE": {
      distance_km: 1.9,
      estimated_minutes: 3
    },
    "Serene Baltistan Hotel": {
      distance_km: 1.8,
      estimated_minutes: 3
    },
    "Alpha Hotel & Restaurant": {
      distance_km: 1.5,
      estimated_minutes: 2
    },
    "Saani Rooms": {
      distance_km: 1.4,
      estimated_minutes: 2
    },
    "Ridakh Inn": {
      distance_km: 1.2,
      estimated_minutes: 2
    },
    "Clifton Spachan Hotel": {
      distance_km: 1.1,
      estimated_minutes: 2
    },
    "K2 Tourism Guest House": {
      distance_km: 1,
      estimated_minutes: 2
    },
    "Heaven's Adventure.pk": {
      distance_km: 3.4,
      estimated_minutes: 5
    },
    "Desert one hotel and restaurant skardu": {
      distance_km: 3.2,
      estimated_minutes: 4
    },
    "Yazgar Residency Skardu": {
      distance_km: 3.3,
      estimated_minutes: 4
    },
    "The Next Home Skardu": {
      distance_km: 3.3,
      estimated_minutes: 4
    },
    "Heaven Hotel Skardu": {
      distance_km: 3.3,
      estimated_minutes: 4
    },
    "Skardu Midway hotel": {
      distance_km: 3.8,
      estimated_minutes: 5
    },
    "Sarfaranga Reaidency": {
      distance_km: 4.1,
      estimated_minutes: 5
    },
    "Skengoo Inn Hotel": {
      distance_km: 4.3,
      estimated_minutes: 5
    },
    "Alnoor Starlet Hotel": {
      distance_km: 4.5,
      estimated_minutes: 5
    },
    "Top Hill Resort": {
      distance_km: 5,
      estimated_minutes: 6
    },
    "Royal Resort Skardu": {
      distance_km: 4.7,
      estimated_minutes: 5
    },
    "Signature Skardu Hotel": {
      distance_km: 4.7,
      estimated_minutes: 5
    },
    "Shama Resort Skardu": {
      distance_km: 4.8,
      estimated_minutes: 5
    },
    "Pearl of Skardu Resort": {
      distance_km: 4.8,
      estimated_minutes: 5
    },
    "Crystal Mountain Lodge": {
      distance_km: 5,
      estimated_minutes: 5
    },
    "H A K S RESSORT": {
      distance_km: 5.6,
      estimated_minutes: 6
    },
    "Shaheen Guest House Skardu": {
      distance_km: 5.9,
      estimated_minutes: 6
    },
    "Nirvana Resort Skardu": {
      distance_km: 6.1,
      estimated_minutes: 7
    }
   },
  "Yak Grill Skardu": {
    "Sundus Skilgrong": { distance_km: 6.7, estimated_minutes: 23 },
    "Sundus Gond": { distance_km: 2.4, estimated_minutes: 10 },
    "Newranga": { distance_km: 6.5, estimated_minutes: 22 },
    "Katpana": { distance_km: 7.9, estimated_minutes: 29 },
    "Khargrong": { distance_km: 5.4, estimated_minutes: 20 },
    "Hasnain Nagar": { distance_km: 3.9, estimated_minutes: 16 },
    "Alamdar Chowk": { distance_km: 2.3, estimated_minutes: 8 },
    "Hassan Colony": { distance_km: 3.4, estimated_minutes: 11 },
    "Hassan Colony Pine": { distance_km: 1.3, estimated_minutes: 5 },
    "Shinkhani Gond": { distance_km: 6.1, estimated_minutes: 23 },
    "Oldiing Nansoq": { distance_km: 7.2, estimated_minutes: 27 },
    "RHQ Road Harriot Hotel": { distance_km: 1.3, estimated_minutes: 7 },
    "Newranga Near Agha Ali House": { distance_km: 8.9, estimated_minutes: 33 },
    "Newranga ": { distance_km: 7.7, estimated_minutes: 28 },
    "Kushmarah": { distance_km: 7.6, estimated_minutes: 29 },
    "Sherthang Girls High School": { distance_km: 3.6, estimated_minutes: 12 },
    "Marfie Colony": { distance_km: 5.4, estimated_minutes: 19 },
    "Chumik": { distance_km: 4.5, estimated_minutes: 16 },
    "Gamba Skardu": { distance_km: 3.7, estimated_minutes: 15 },
    "United Line, Hassan Colony": { distance_km: 3.5, estimated_minutes: 14 },
    "Muhib Road Khargrong": { distance_km: 7.0, estimated_minutes: 24 },
    "GB Chief Court Skardu Registry Skardu": { distance_km: 3.0, estimated_minutes: 11 },
    "Shaheen Public School Skardu": { distance_km: 9.3, estimated_minutes: 34 },
    "Mehdi Colony Skardu": { distance_km: 5.8, estimated_minutes: 20 },
    "Agha Hadi Chowk": { distance_km: 9.5, estimated_minutes: 36 },
    "Hussainabad": { distance_km: 7.5, estimated_minutes: 27 },
    "Himalaya Hotel Hussainabad, Skardu": { distance_km: 7.5, estimated_minutes: 27 },
    "Hameed Garh": { distance_km: 4.9, estimated_minutes: 19 },
    "Shaheed colony": { distance_km: 3.8, estimated_minutes: 14 },
    "Tufail colony": { distance_km: 7.2, estimated_minutes: 25 },
    "Jafferi Mohallah": { distance_km: 4.5, estimated_minutes: 15 },
    "Chogo Matamsara": { distance_km: 6.5, estimated_minutes: 23 },
    "Nagulispang Road": { distance_km: 7.7, estimated_minutes: 28 },
    "Eidgah,Sundus ": { distance_km: 0.7, estimated_minutes: 5 },
    "Sukemaidan ": { distance_km: 8.1, estimated_minutes: 28 },
    "Hargissa shakthang": { distance_km: 9.0, estimated_minutes: 34 },
    "Bhutto Bazar Skardu": { distance_km: 7.4, estimated_minutes: 26 },
    "Devision": { distance_km: 7.4, estimated_minutes: 28 },
    "Abbas Town": { distance_km: 2.0, estimated_minutes: 8 },
    "Musa Line": { distance_km: 7.5, estimated_minutes: 29 },
    "Clifton pull": { distance_km: 2.2, estimated_minutes: 7 },
    "Sheikh ijaz masjid": { distance_km: 5.0, estimated_minutes: 18 },
    "Khila Toq Road": { distance_km: 9.3, estimated_minutes: 32 },
    "Public school area": { distance_km: 7.0, estimated_minutes: 26 },
    "Xhathang": { distance_km: 1.6, estimated_minutes: 8 },
    "Brolmo colony sundus": { distance_km: 1.3, estimated_minutes: 5 },
    "Ghazi Colony sundus": { distance_km: 1.6, estimated_minutes: 7 },
    "Hyderabad Gangupi Area": { distance_km: 2.1, estimated_minutes: 9 },
    "LT Col ihsan Ali rd": { distance_km: 5.0, estimated_minutes: 19 },
    "Astana skardu": { distance_km: 0.7, estimated_minutes: 5 },
    "Bintul Huda Girls model school": { distance_km: 7.2, estimated_minutes: 26 },
    "Brolmo colony astana": { distance_km: 8.0, estimated_minutes: 29 },
    "Raees mohalla Haji Gam": { distance_km: 2.1, estimated_minutes: 7 },
    "Haji Gam": { distance_km: 1.1, estimated_minutes: 6 },
    "Gulshan e Ali skardu": { distance_km: 9.4, estimated_minutes: 36 },
    "Jamia masjid road": { distance_km: 6.1, estimated_minutes: 21 },
    "Gayool skardu": { distance_km: 6.9, estimated_minutes: 26 },
    "Toqrangah Skardu": { distance_km: 9.0, estimated_minutes: 34 },
    "Maqponsar skardu": { distance_km: 1.3, estimated_minutes: 6 },
    "Newranga road": { distance_km: 2.6, estimated_minutes: 9 },
    "Quaidabad": { distance_km: 8.0, estimated_minutes: 29 },
    "Kharpocho Road": { distance_km: 4.2, estimated_minutes: 16 },
    "Patwal": { distance_km: 3.0, estimated_minutes: 13 },
    "Olding": { distance_km: 6.0, estimated_minutes: 22 },
    "Karasmathang": { distance_km: 2.2, estimated_minutes: 8 },
    "Kachura": { distance_km: 9.3, estimated_minutes: 32 },
   "Rus Olive Lodge": {
      distance_km: 3.8,
      estimated_minutes: 5
    },
    "Hargisa Resort Skardu": {
      distance_km: 4.7,
      estimated_minutes: 6
    },
    "LOKAL Rooms x Skardu (Katpana Retreat)": {
      distance_km: 4.7,
      estimated_minutes: 5
    },
    "Green Orchard Skardu": {
      distance_km: 2.8,
      estimated_minutes: 3
    },
    "Oasis Resort Katpana Skardu": {
      distance_km: 5.1,
      estimated_minutes: 6
    },
    "Avari Xpress Skardu Hotel": {
      distance_km: 4.2,
      estimated_minutes: 3
    },
    "Hotel Mashabrum Skardu": {
      distance_km: 2.1,
      estimated_minutes: 3
    },
    "Skardu Luxus Hotel": {
      distance_km: 2.1,
      estimated_minutes: 3
    },
    "The Mountain Cottage Skardu": {
      distance_km: 3.2,
      estimated_minutes: 4
    },
    "Summit Hotel Skardu": {
      distance_km: 3.3,
      estimated_minutes: 4
    },
    "Skardu Saraye Hotel & Resort": {
      distance_km: 3.4,
      estimated_minutes: 6
    },
    "Baltistan Tourist Cottage - Skardu": {
      distance_km: 3.5,
      estimated_minutes: 4
    },
    "Glamp Pakistan": {
      distance_km: 6.1,
      estimated_minutes: 9
    },
    "Montagna Pods": {
      distance_km: 6.2,
      estimated_minutes: 9
    },
    "Hotel Luxy Skardu": {
      distance_km: 4.4,
      estimated_minutes: 5
    },
    "Baltistan Fort, Skardu Resort Hotel": {
      distance_km: 9,
      estimated_minutes: 13
    },
    "Hotel Skardu1": {
      distance_km: 3.5,
      estimated_minutes: 4
    },
    "Baltistan Resort": {
      distance_km: 3.5,
      estimated_minutes: 4
    },
    "Skardu Royal Hotel & Restaurant": {
      distance_km: 2.9,
      estimated_minutes: 3
    },
    "Sharif Cottages and Hotel Skardu": {
      distance_km: 5.5,
      estimated_minutes: 6
    },
    "Base Camp Katpana": {
      distance_km: 7.1,
      estimated_minutes: 11
    },
    "Hotel Dewan-e-Khas": {
      distance_km: 0.9,
      estimated_minutes: 2
    },
    "Legend Hotel Skardu": {
      distance_km: 0.5,
      estimated_minutes: 1
    },
    "Northlanders Guest House Skardu": {
      distance_km: 0.6,
      estimated_minutes: 1
    },
    "Hotel Travellodge Skardu": {
      distance_km: 2.5,
      estimated_minutes: 3
    },
    "Qayam Skardu": {
      distance_km: 6.3,
      estimated_minutes: 6
    },
    "Rafsal A Countryside Cottage": {
      distance_km: 6.5,
      estimated_minutes: 9
    },
    "Kentish Lodge Skardu": {
      distance_km: 2.2,
      estimated_minutes: 3
    },
    "Skardu Villas": {
      distance_km: 6.7,
      estimated_minutes: 7
    },
    "The Cherry Courtyard": {
      distance_km: 6.8,
      estimated_minutes: 7
    },
    "Ringchan Guest House & Restaurant": {
      distance_km: 0.1,
      estimated_minutes: 1
    },
    "Skardu Lodge": {
      distance_km: 0.3,
      estimated_minutes: 1
    },
    "Karakoram Nest": {
      distance_km: 0.4,
      estimated_minutes: 1
    },
    "Dynasty Skardu": {
      distance_km: 7.1,
      estimated_minutes: 8
    },
    "Sehrish Guest House Skardu": {
      distance_km: 1.9,
      estimated_minutes: 3
    },
    "PTDC Motel Skardu": {
      distance_km: 0.4,
      estimated_minutes: 1
    },
    "Hotel Reego Skardu": {
      distance_km: 0.9,
      estimated_minutes: 1
    },
    "Lavender Cottage & Guest House": {
      distance_km: 2,
      estimated_minutes: 3
    },
    "Rock View Skardu": {
      distance_km: 1.9,
      estimated_minutes: 3
    },
    "Dream Guest House Haji Gam Chowk": {
      distance_km: 2.4,
      estimated_minutes: 3
    },
    "Indus Lodges Skardu": {
      distance_km: 0.5,
      estimated_minutes: 1
    },
    "Pacific Guest House Skardu": {
      distance_km: 3.4,
      estimated_minutes: 4
    },
    "Skardu View Point Hotel and Huts": {
      distance_km: 3.4,
      estimated_minutes: 4
    },
    "Khar Hotel Skardu": {
      distance_km: 1.7,
      estimated_minutes: 2
    },
    "HIKK Inn Skardu": {
      distance_km: 3.4,
      estimated_minutes: 4
    },
    "Taaj Residence Skardu": {
      distance_km: 1.6,
      estimated_minutes: 2
    },
    "Homeland Guest House Skardu": {
      distance_km: 1,
      estimated_minutes: 1
    },
    "Sultan Guest House Skardu": {
      distance_km: 2.4,
      estimated_minutes: 3
    },
    "The Hill Town Resort": {
      distance_km: 2.7,
      estimated_minutes: 4
    },
    "AlJannah Guest House Skardu": {
      distance_km: 2.6,
      estimated_minutes: 3
    },
    "Deosai Gateway Inn Skardu": {
      distance_km: 2.6,
      estimated_minutes: 3
    },
    "Skardu Arcadian Resort": {
      distance_km: 8.7,
      estimated_minutes: 10
    },
    "Areena Hotel Skardu": {
      distance_km: 1.7,
      estimated_minutes: 2
    },
    "Skardu Farmhouse for stay": {
      distance_km: 3.2,
      estimated_minutes: 3
    },
    "Adventure Sarai Hotel Skardu": {
      distance_km: 2.7,
      estimated_minutes: 3
    },
    "Maple Resort": {
      distance_km: 13.3,
      estimated_minutes: 16
    },
    "Candela Resorts": {
      distance_km: 3.6,
      estimated_minutes: 4
    },
    "Hispar Hotel Skardu": {
      distance_km: 3.6,
      estimated_minutes: 4
    },
    "K2 Paradise Guest House": {
      distance_km: 2.3,
      estimated_minutes: 2
    },
    "Holiday Mountain Resort & Camping Site": {
      distance_km: 4.1,
      estimated_minutes: 6
    },
    "Mountain Lodge Skardu": {
      distance_km: 4.1,
      estimated_minutes: 6
    },
    "Mulberry Continental Hotel Skardu": {
      distance_km: 11.8,
      estimated_minutes: 10
    },
    "PC Legacy Skardu": {
      distance_km: 11.9,
      estimated_minutes: 10
    },
    "GB Lodges": {
      distance_km: 12.7,
      estimated_minutes: 11
    },
    "Bilafond Cottage": {
      distance_km: 7.3,
      estimated_minutes: 9
    },
    "North Hills Skardu": {
      distance_km: 1.6,
      estimated_minutes: 2
    },
    "Pinnacle Executive Lodges": {
      distance_km: 13.3,
      estimated_minutes: 11
    },
    "Safena Hotel Skardu": {
      distance_km: 16,
      estimated_minutes: 13
    },
    "Byarsa Hotel Skardu": {
      distance_km: 25.9,
      estimated_minutes: 21
    },
    "Dream Nest Resort Hotels Skardu": {
      distance_km: 34.5,
      estimated_minutes: 36
    },
    "Stream view guest house skardu": {
      distance_km: 2.9,
      estimated_minutes: 4
    },
    "Shangrila Resort Skardu": {
      distance_km: 26.9,
      estimated_minutes: 25
    },
    "Kachura Inn Skardu": {
      distance_km: 31.7,
      estimated_minutes: 29
    },
    "Tibet Hotel Kachura Skardu": {
      distance_km: 30.1,
      estimated_minutes: 25
    },
    "Hotel Mountain Lagoon Skardu": {
      distance_km: 27.2,
      estimated_minutes: 27
    },
    "Skardu River Resort": {
      distance_km: 27.4,
      estimated_minutes: 26
    },
    "Morning Resort": {
      distance_km: 30.6,
      estimated_minutes: 26
    },
    "Hotel Desert Bloom Skardu": {
      distance_km: 3.9,
      estimated_minutes: 5
    },
    "TheQue Skardu": {
      distance_km: 31.1,
      estimated_minutes: 27
    },
    "Singay Homestay Skardu": {
      distance_km: 2.1,
      estimated_minutes: 3
    },
    "Baltistan Crown Resort": {
      distance_km: 6.9,
      estimated_minutes: 8
    },
    "Fatah inn Guest House": {
      distance_km: 7.1,
      estimated_minutes: 8
    },
    "Kunhar": {
      distance_km: 6.8,
      estimated_minutes: 7
    },
    "Maltoro guest house": {
      distance_km: 6.8,
      estimated_minutes: 7
    },
    "Apex Hotels and Resorts Skardu": {
      distance_km: 6.9,
      estimated_minutes: 7
    },
    "Hotel virsa": {
      distance_km: 6.9,
      estimated_minutes: 7
    },
    "Elli's Luxus": {
      distance_km: 7.6,
      estimated_minutes: 7
    },
    "Skardu Gateway Hotel & Restaurant": {
      distance_km: 7.6,
      estimated_minutes: 7
    },
    "Polo Land Hotel by Skyline": {
      distance_km: 7.7,
      estimated_minutes: 7
    },
    "Baltistan White House Hotel": {
      distance_km: 8,
      estimated_minutes: 7
    },
    "The Pioneer Hotel": {
      distance_km: 8.1,
      estimated_minutes: 8
    },
    "Ramovi Guest House": {
      distance_km: 8.2,
      estimated_minutes: 8
    },
    "Friends & Family Guest House": {
      distance_km: 8.6,
      estimated_minutes: 8
    },
    "SKY LAKE GUEST HOUSE": {
      distance_km: 8.8,
      estimated_minutes: 8
    },
    "Skardu bliss hotel": {
      distance_km: 10.1,
      estimated_minutes: 9
    },
    "Comfort inn hotel": {
      distance_km: 10.1,
      estimated_minutes: 9
    },
    "Grand Hotel Skardu": {
      distance_km: 10.4,
      estimated_minutes: 9
    },
    "Baltistan inn hotel": {
      distance_km: 10.6,
      estimated_minutes: 9
    },
    "Grand view hotel": {
      distance_km: 10.6,
      estimated_minutes: 9
    },
    "Hotel walnut": {
      distance_km: 11.6,
      estimated_minutes: 10
    },
    "ABC hotel": {
      distance_km: 11.8,
      estimated_minutes: 10
    },
    "Lashari Resort Skardu": {
      distance_km: 11.9,
      estimated_minutes: 10
    },
    "Melody Hills Skardu": {
      distance_km: 12.2,
      estimated_minutes: 11
    },
    "NJM House Near Skardu Airport": {
      distance_km: 12.2,
      estimated_minutes: 11
    },
    "Le Yurt Skardu": {
      distance_km: 12.4,
      estimated_minutes: 11
    },
    "FearLess lodge": {
      distance_km: 13.6,
      estimated_minutes: 13
    },
    "Wamiq Skardu Resort": {
      distance_km: 16.3,
      estimated_minutes: 16
    },
    "Hosho Guest House": {
      distance_km: 15,
      estimated_minutes: 12
    },
    "Orgventure Resorts Skardu": {
      distance_km: 16.3,
      estimated_minutes: 13
    },
    "Green orchard skardu": {
      distance_km: 2.8,
      estimated_minutes: 3
    },
    "Mount View hotel skardu": {
      distance_km: 2.6,
      estimated_minutes: 3
    },
    "Laal Haveli": {
      distance_km: 2.4,
      estimated_minutes: 3
    },
    "Skardu view Guest house": {
      distance_km: 2.3,
      estimated_minutes: 3
    },
    "Baltistan Mountain Chalet Hotel": {
      distance_km: 2.3,
      estimated_minutes: 3
    },
    "Hotel Five star & restaurant skardu": {
      distance_km: 2.2,
      estimated_minutes: 3
    },
    "Tufail palace hotel & restaurant": {
      distance_km: 2.2,
      estimated_minutes: 3
    },
    "Indus motel": {
      distance_km: 2,
      estimated_minutes: 3
    },
    "Paradise hotel": {
      distance_km: 1.8,
      estimated_minutes: 2
    },
    "Hotel Red sun": {
      distance_km: 1.8,
      estimated_minutes: 3
    },
    "Haks hotel": {
      distance_km: 1.7,
      estimated_minutes: 2
    },
    "Hotel inn skardu": {
      distance_km: 1.7,
      estimated_minutes: 2
    },
    "Skardu embassy hotel": {
      distance_km: 1.6,
      estimated_minutes: 2
    },
    "Hotel Delight Skardu": {
      distance_km: 1.6,
      estimated_minutes: 2
    },
    "Ayan Hotel": {
      distance_km: 0.5,
      estimated_minutes: 1
    },
    "Hotel Highlander inn": {
      distance_km: 0.2,
      estimated_minutes: 1
    },
    "The North face inn hotel skardu": {
      distance_km: 0.4,
      estimated_minutes: 1
    },
    "The yak Hotel skardu": {
      distance_km: 0.5,
      estimated_minutes: 1
    },
    "Indus lodge skardu": {
      distance_km: 0.5,
      estimated_minutes: 1
    },
    "Stay inn hotel": {
      distance_km: 0.5,
      estimated_minutes: 1
    },
    "Eden Rock skardu": {
      distance_km: 0.5,
      estimated_minutes: 1
    },
    "Concordia Motel Baltistan": {
      distance_km: 0.8,
      estimated_minutes: 1
    },
    "Harriot Skardu": {
      distance_km: 1.2,
      estimated_minutes: 1
    },
    "Hotel PeakNest": {
      distance_km: 1.3,
      estimated_minutes: 1
    },
    "Royal Glaxy Hotel": {
      distance_km: 1.5,
      estimated_minutes: 2
    },
    "Sarfaranga view rock Guest house skardu": {
      distance_km: 2.1,
      estimated_minutes: 2
    },
    "Eat and Read Guesthouse skardu": {
      distance_km: 2.2,
      estimated_minutes: 2
    },
    "North Face explorers": {
      distance_km: 2.2,
      estimated_minutes: 2
    },
    "Holiday resort skardu": {
      distance_km: 2.3,
      estimated_minutes: 2
    },
    "Kallisto Resort": {
      distance_km: 2.3,
      estimated_minutes: 2
    },
    "Sagar hotel skardu": {
      distance_km: 2.6,
      estimated_minutes: 2
    },
    "Hotel Elite skardu": {
      distance_km: 2.6,
      estimated_minutes: 2
    },
    "SnowLand Resort": {
      distance_km: 3.3,
      estimated_minutes: 4
    },
    "Bismillah Guest House": {
      distance_km: 3.4,
      estimated_minutes: 4
    },
    "Hotel Yak sarai": {
      distance_km: 3.4,
      estimated_minutes: 4
    },
    "The North Palace": {
      distance_km: 3.4,
      estimated_minutes: 4
    },
    "Duqsa Family Guest House": {
      distance_km: 2.9,
      estimated_minutes: 4
    },
    "Wazir's villa": {
      distance_km: 3,
      estimated_minutes: 4
    },
    "Hotel Rewaaj": {
      distance_km: 2.8,
      estimated_minutes: 4
    },
    "Comfort Hotel & Huts skardu": {
      distance_km: 2.2,
      estimated_minutes: 3
    },
    "Zam Zam Guest House": {
      distance_km: 2,
      estimated_minutes: 3
    },
    "The Mountain Gypsy Resort": {
      distance_km: 2,
      estimated_minutes: 3
    },
    "Rigo Resort Skardu": {
      distance_km: 3.9,
      estimated_minutes: 6
    },
    "Arish Luxury Sites": {
      distance_km: 1.9,
      estimated_minutes: 3
    },
    "InterContinental Hotel": {
      distance_km: 1.5,
      estimated_minutes: 2
    },
    "Royal fort resort skardu": {
      distance_km: 1.5,
      estimated_minutes: 2
    },
    "Meer Stay and Dine skardu": {
      distance_km: 1.4,
      estimated_minutes: 2
    },
    "Dream Land Guest House": {
      distance_km: 2,
      estimated_minutes: 3
    },
    "Hotel GraceLand": {
      distance_km: 1.5,
      estimated_minutes: 2
    },
    "MOUNTAIN MAJESTY INN SKARDU": {
      distance_km: 1.9,
      estimated_minutes: 3
    },
    "Alnoor Lodges": {
      distance_km: 2.1,
      estimated_minutes: 2
    },
    "Jasper House": {
      distance_km: 2.3,
      estimated_minutes: 3
    },
    "The Himalayan Guest House": {
      distance_km: 2.4,
      estimated_minutes: 3
    },
    "Epoch Inn Guest House Skardu": {
      distance_km: 2.5,
      estimated_minutes: 3
    },
    "Mountaindale Guest House": {
      distance_km: 2.5,
      estimated_minutes: 3
    },
    "Al Jannah Guest House Skardu": {
      distance_km: 2.6,
      estimated_minutes: 3
    },
    "Biafo Resort Skardu": {
      distance_km: 2.6,
      estimated_minutes: 3
    },
    "Skardu Blossom Inn": {
      distance_km: 2.6,
      estimated_minutes: 3
    },
    "The Diamond Guest House Skardu": {
      distance_km: 2.7,
      estimated_minutes: 3
    },
    "Anarres | A Creative Residency": {
      distance_km: 3.2,
      estimated_minutes: 3
    },
    "Submit Embassy Hotel": {
      distance_km: 3.2,
      estimated_minutes: 4
    },
    "Alpine Abode Skardu": {
      distance_km: 3.6,
      estimated_minutes: 4
    },
    "Relax Inn Skardu": {
      distance_km: 3.6,
      estimated_minutes: 4
    },
    "Gumaan Resort Skardu": {
      distance_km: 3.7,
      estimated_minutes: 4
    },
    "Yuligo Resort Skardu": {
      distance_km: 3.9,
      estimated_minutes: 4
    },
    "Urban escape resort": {
      distance_km: 1.6,
      estimated_minutes: 2
    },
    "Mohsin Lodge Skardu": {
      distance_km: 1.7,
      estimated_minutes: 2
    },
    "Back To Home Lodging": {
      distance_km: 1.7,
      estimated_minutes: 2
    },
    "Royal Brangsa Guest House": {
      distance_km: 1.9,
      estimated_minutes: 3
    },
    "Wazir Guest House Skardu": {
      distance_km: 1.7,
      estimated_minutes: 2
    },
    "Golden Ibex Guest House": {
      distance_km: 1.7,
      estimated_minutes: 2
    },
    "Up Way Guest House": {
      distance_km: 1.9,
      estimated_minutes: 2
    },
    "Kunlun Peak Inn skardu": {
      distance_km: 2.4,
      estimated_minutes: 3
    },
    "Markhor Hotel": {
      distance_km: 2.6,
      estimated_minutes: 3
    },
    "Tibet hotel skardu": {
      distance_km: 2.9,
      estimated_minutes: 4
    },
    "Alpha Nomads House": {
      distance_km: 2.8,
      estimated_minutes: 4
    },
    "Dirleh Hotel": {
      distance_km: 2.9,
      estimated_minutes: 4
    },
    "North Home Skardu": {
      distance_km: 2.9,
      estimated_minutes: 4
    },
    "Valhalla Guest House": {
      distance_km: 3,
      estimated_minutes: 4
    },
    "Creek villa skardu": {
      distance_km: 3.1,
      estimated_minutes: 4
    },
    "Prince Tourist Hut": {
      distance_km: 3.5,
      estimated_minutes: 5
    },
    "Mountain House": {
      distance_km: 3.6,
      estimated_minutes: 5
    },
    "Reechan Resort House": {
      distance_km: 3.3,
      estimated_minutes: 4
    },
    "Himalayan Guest House Hassan colony": {
      distance_km: 3.3,
      estimated_minutes: 4
    },
    "Jasmine Skardu": {
      distance_km: 3.4,
      estimated_minutes: 4
    },
    "Mountain Face Skardu": {
      distance_km: 3.4,
      estimated_minutes: 5
    },
    "Four Seasons Bed and Breakfast": {
      distance_km: 3.4,
      estimated_minutes: 4
    },
    "Flora Inn skardu": {
      distance_km: 3.4,
      estimated_minutes: 4
    },
    "Broadpeak Resort skardu": {
      distance_km: 3.5,
      estimated_minutes: 4
    },
    "Chinar Residency": {
      distance_km: 3.1,
      estimated_minutes: 4
    },
    "Buddha Rock Guest House Skardu": {
      distance_km: 3.2,
      estimated_minutes: 4
    },
    "Buddha view Resort skardu": {
      distance_km: 3.2,
      estimated_minutes: 4
    },
    "Moonal Residency": {
      distance_km: 3.4,
      estimated_minutes: 4
    },
    "Skarchan Resort skardu": {
      distance_km: 3.5,
      estimated_minutes: 4
    },
    "ZAGO Guest House": {
      distance_km: 3,
      estimated_minutes: 4
    },
    "Skardu Blossom Guest House": {
      distance_km: 3,
      estimated_minutes: 4
    },
    "Harpo Resorts": {
      distance_km: 3,
      estimated_minutes: 4
    },
    "Baltistan Continental Hotel skardu": {
      distance_km: 2.3,
      estimated_minutes: 3
    },
    "Al Abbas Guest House": {
      distance_km: 2.2,
      estimated_minutes: 2
    },
    "Apricot Spring Resort Skardu": {
      distance_km: 2.2,
      estimated_minutes: 2
    },
    "Executive Guest House Skardu": {
      distance_km: 2.1,
      estimated_minutes: 2
    },
    "Hotel Bloom Hills,Skardu": {
      distance_km: 3.9,
      estimated_minutes: 4
    },
    "Siachen Stay&Tours": {
      distance_km: 3.8,
      estimated_minutes: 4
    },
    "Mountain Guest House and Desi Restaurant": {
      distance_km: 3.6,
      estimated_minutes: 4
    },
    "Decent Baltistan guest house": {
      distance_km: 3.4,
      estimated_minutes: 4
    },
    "Baltistan Village Guest House": {
      distance_km: 3.4,
      estimated_minutes: 4
    },
    "Bareen": {
      distance_km: 3.3,
      estimated_minutes: 4
    },
    "SUMMIT GUEST HOUSE": {
      distance_km: 3.3,
      estimated_minutes: 4
    },
    "Serene Baltistan Hotel": {
      distance_km: 3.2,
      estimated_minutes: 4
    },
    "Alpha Hotel & Restaurant": {
      distance_km: 2.9,
      estimated_minutes: 3
    },
    "Saani Rooms": {
      distance_km: 2.8,
      estimated_minutes: 3
    },
    "Ridakh Inn": {
      distance_km: 2.6,
      estimated_minutes: 3
    },
    "Clifton Spachan Hotel": {
      distance_km: 2.5,
      estimated_minutes: 3
    },
    "K2 Tourism Guest House": {
      distance_km: 2.4,
      estimated_minutes: 3
    },
    "Heaven's Adventure.pk": {
      distance_km: 3.9,
      estimated_minutes: 5
    },
    "Desert one hotel and restaurant skardu": {
      distance_km: 3.7,
      estimated_minutes: 4
    },
    "Yazgar Residency Skardu": {
      distance_km: 3.8,
      estimated_minutes: 5
    },
    "The Next Home Skardu": {
      distance_km: 3.8,
      estimated_minutes: 5
    },
    "Heaven Hotel Skardu": {
      distance_km: 3.8,
      estimated_minutes: 5
    },
    "Skardu Midway hotel": {
      distance_km: 4.3,
      estimated_minutes: 5
    },
    "Sarfaranga Reaidency": {
      distance_km: 4.7,
      estimated_minutes: 5
    },
    "Skengoo Inn Hotel": {
      distance_km: 4.8,
      estimated_minutes: 5
    },
    "Alnoor Starlet Hotel": {
      distance_km: 5,
      estimated_minutes: 5
    },
    "Top Hill Resort": {
      distance_km: 5.6,
      estimated_minutes: 6
    },
    "Royal Resort Skardu": {
      distance_km: 5.2,
      estimated_minutes: 6
    },
    "Signature Skardu Hotel": {
      distance_km: 5.3,
      estimated_minutes: 6
    },
    "Shama Resort Skardu": {
      distance_km: 5.3,
      estimated_minutes: 6
    },
    "Pearl of Skardu Resort": {
      distance_km: 5.4,
      estimated_minutes: 6
    },
    "Crystal Mountain Lodge": {
      distance_km: 5.5,
      estimated_minutes: 6
    },
    "H A K S RESSORT": {
      distance_km: 6.1,
      estimated_minutes: 6
    },
    "Shaheen Guest House Skardu": {
      distance_km: 6.4,
      estimated_minutes: 7
    },
    "Nirvana Resort Skardu": {
      distance_km: 6.7,
      estimated_minutes: 7
    }
  },
  "mart-1": {
    "Rus Olive Lodge": {
      distance_km: 0.2,
      estimated_minutes: 1
    },
    "Hargisa Resort Skardu": {
      distance_km: 1.1,
      estimated_minutes: 3
    },
    "LOKAL Rooms x Skardu (Katpana Retreat)": {
      distance_km: 1.1,
      estimated_minutes: 2
    },
    "Green Orchard Skardu": {
      distance_km: 0.8,
      estimated_minutes: 1
    },
    "Oasis Resort Katpana Skardu": {
      distance_km: 1.5,
      estimated_minutes: 2
    },
    "Avari Xpress Skardu Hotel": {
      distance_km: 4.5,
      estimated_minutes: 2
    },
    "Hotel Mashabrum Skardu": {
      distance_km: 1.5,
      estimated_minutes: 2
    },
    "Skardu Luxus Hotel": {
      distance_km: 1.5,
      estimated_minutes: 2
    },
    "The Mountain Cottage Skardu": {
      distance_km: 2.6,
      estimated_minutes: 3
    },
    "Summit Hotel Skardu": {
      distance_km: 2.5,
      estimated_minutes: 3
    },
    "Skardu Saraye Hotel & Resort": {
      distance_km: 4.1,
      estimated_minutes: 6
    },
    "Baltistan Tourist Cottage - Skardu": {
      distance_km: 2.7,
      estimated_minutes: 3
    },
    "Glamp Pakistan": {
      distance_km: 2.5,
      estimated_minutes: 5
    },
    "Montagna Pods": {
      distance_km: 2.6,
      estimated_minutes: 5
    },
    "Hotel Luxy Skardu": {
      distance_km: 3.6,
      estimated_minutes: 4
    },
    "Baltistan Fort, Skardu Resort Hotel": {
      distance_km: 8.2,
      estimated_minutes: 12
    },
    "Hotel Skardu1": {
      distance_km: 3.2,
      estimated_minutes: 4
    },
    "Baltistan Resort": {
      distance_km: 3.2,
      estimated_minutes: 4
    },
    "Skardu Royal Hotel & Restaurant": {
      distance_km: 3.7,
      estimated_minutes: 4
    },
    "Sharif Cottages and Hotel Skardu": {
      distance_km: 4.7,
      estimated_minutes: 5
    },
    "Base Camp Katpana": {
      distance_km: 3.5,
      estimated_minutes: 7
    },
    "Hotel Dewan-e-Khas": {
      distance_km: 3,
      estimated_minutes: 4
    },
    "Legend Hotel Skardu": {
      distance_km: 3.2,
      estimated_minutes: 4
    },
    "Northlanders Guest House Skardu": {
      distance_km: 3.3,
      estimated_minutes: 4
    },
    "Hotel Travellodge Skardu": {
      distance_km: 4.6,
      estimated_minutes: 6
    },
    "Qayam Skardu": {
      distance_km: 5.5,
      estimated_minutes: 5
    },
    "Rafsal A Countryside Cottage": {
      distance_km: 5.7,
      estimated_minutes: 8
    },
    "Kentish Lodge Skardu": {
      distance_km: 3.8,
      estimated_minutes: 5
    },
    "Skardu Villas": {
      distance_km: 5.9,
      estimated_minutes: 6
    },
    "The Cherry Courtyard": {
      distance_km: 6,
      estimated_minutes: 6
    },
    "Ringchan Guest House & Restaurant": {
      distance_km: 3.6,
      estimated_minutes: 4
    },
    "Skardu Lodge": {
      distance_km: 3.9,
      estimated_minutes: 5
    },
    "Karakoram Nest": {
      distance_km: 3.9,
      estimated_minutes: 5
    },
    "Dynasty Skardu": {
      distance_km: 6.3,
      estimated_minutes: 6
    },
    "Sehrish Guest House Skardu": {
      distance_km: 4.5,
      estimated_minutes: 6
    },
    "PTDC Motel Skardu": {
      distance_km: 3.9,
      estimated_minutes: 5
    },
    "Hotel Reego Skardu": {
      distance_km: 4.5,
      estimated_minutes: 5
    },
    "Lavender Cottage & Guest House": {
      distance_km: 4.5,
      estimated_minutes: 6
    },
    "Rock View Skardu": {
      distance_km: 4.5,
      estimated_minutes: 6
    },
    "Dream Guest House Haji Gam Chowk": {
      distance_km: 4.4,
      estimated_minutes: 5
    },
    "Indus Lodges Skardu": {
      distance_km: 4,
      estimated_minutes: 5
    },
    "Pacific Guest House Skardu": {
      distance_km: 5.4,
      estimated_minutes: 7
    },
    "Skardu View Point Hotel and Huts": {
      distance_km: 5.4,
      estimated_minutes: 7
    },
    "Khar Hotel Skardu": {
      distance_km: 4.9,
      estimated_minutes: 6
    },
    "HIKK Inn Skardu": {
      distance_km: 5.4,
      estimated_minutes: 7
    },
    "Taaj Residence Skardu": {
      distance_km: 5.2,
      estimated_minutes: 6
    },
    "Homeland Guest House Skardu": {
      distance_km: 4.6,
      estimated_minutes: 5
    },
    "Sultan Guest House Skardu": {
      distance_km: 4.8,
      estimated_minutes: 6
    },
    "The Hill Town Resort": {
      distance_km: 5.2,
      estimated_minutes: 7
    },
    "AlJannah Guest House Skardu": {
      distance_km: 5.7,
      estimated_minutes: 7
    },
    "Deosai Gateway Inn Skardu": {
      distance_km: 5.7,
      estimated_minutes: 7
    },
    "Skardu Arcadian Resort": {
      distance_km: 5.1,
      estimated_minutes: 6
    },
    "Areena Hotel Skardu": {
      distance_km: 5.3,
      estimated_minutes: 6
    },
    "Skardu Farmhouse for stay": {
      distance_km: 6.3,
      estimated_minutes: 7
    },
    "Adventure Sarai Hotel Skardu": {
      distance_km: 5.8,
      estimated_minutes: 7
    },
    "Maple Resort": {
      distance_km: 12.5,
      estimated_minutes: 15
    },
    "Candela Resorts": {
      distance_km: 6.7,
      estimated_minutes: 8
    },
    "Hispar Hotel Skardu": {
      distance_km: 6.7,
      estimated_minutes: 8
    },
    "K2 Paradise Guest House": {
      distance_km: 5.9,
      estimated_minutes: 6
    },
    "Holiday Mountain Resort & Camping Site": {
      distance_km: 7.2,
      estimated_minutes: 9
    },
    "Mountain Lodge Skardu": {
      distance_km: 7.3,
      estimated_minutes: 9
    },
    "Mulberry Continental Hotel Skardu": {
      distance_km: 11,
      estimated_minutes: 9
    },
    "PC Legacy Skardu": {
      distance_km: 11.1,
      estimated_minutes: 9
    },
    "GB Lodges": {
      distance_km: 11.9,
      estimated_minutes: 10
    },
    "Bilafond Cottage": {
      distance_km: 10.9,
      estimated_minutes: 13
    },
    "North Hills Skardu": {
      distance_km: 5.2,
      estimated_minutes: 6
    },
    "Pinnacle Executive Lodges": {
      distance_km: 12.5,
      estimated_minutes: 10
    },
    "Safena Hotel Skardu": {
      distance_km: 15.2,
      estimated_minutes: 12
    },
    "Byarsa Hotel Skardu": {
      distance_km: 25.1,
      estimated_minutes: 20
    },
    "Dream Nest Resort Hotels Skardu": {
      distance_km: 33.7,
      estimated_minutes: 35
    },
    "Stream view guest house skardu": {
      distance_km: 4.3,
      estimated_minutes: 6
    },
    "Shangrila Resort Skardu": {
      distance_km: 26.1,
      estimated_minutes: 24
    },
    "Kachura Inn Skardu": {
      distance_km: 30.9,
      estimated_minutes: 28
    },
    "Tibet Hotel Kachura Skardu": {
      distance_km: 29.3,
      estimated_minutes: 24
    },
    "Hotel Mountain Lagoon Skardu": {
      distance_km: 26.4,
      estimated_minutes: 25
    },
    "Skardu River Resort": {
      distance_km: 26.6,
      estimated_minutes: 25
    },
    "Morning Resort": {
      distance_km: 29.8,
      estimated_minutes: 25
    },
    "Hotel Desert Bloom Skardu": {
      distance_km: 0.3,
      estimated_minutes: 1
    },
    "TheQue Skardu": {
      distance_km: 30.3,
      estimated_minutes: 26
    },
    "Singay Homestay Skardu": {
      distance_km: 5.6,
      estimated_minutes: 7
    },
    "Baltistan Crown Resort": {
      distance_km: 6.1,
      estimated_minutes: 7
    },
    "Fatah inn Guest House": {
      distance_km: 6.3,
      estimated_minutes: 7
    },
    "Kunhar": {
      distance_km: 6,
      estimated_minutes: 6
    },
    "Maltoro guest house": {
      distance_km: 6,
      estimated_minutes: 6
    },
    "Apex Hotels and Resorts Skardu": {
      distance_km: 6.1,
      estimated_minutes: 6
    },
    "Hotel virsa": {
      distance_km: 6.1,
      estimated_minutes: 6
    },
    "Elli's Luxus": {
      distance_km: 6.8,
      estimated_minutes: 6
    },
    "Skardu Gateway Hotel & Restaurant": {
      distance_km: 6.8,
      estimated_minutes: 6
    },
    "Polo Land Hotel by Skyline": {
      distance_km: 6.9,
      estimated_minutes: 6
    },
    "Baltistan White House Hotel": {
      distance_km: 7.2,
      estimated_minutes: 6
    },
    "The Pioneer Hotel": {
      distance_km: 7.3,
      estimated_minutes: 6
    },
    "Ramovi Guest House": {
      distance_km: 7.4,
      estimated_minutes: 6
    },
    "Friends & Family Guest House": {
      distance_km: 7.8,
      estimated_minutes: 7
    },
    "SKY LAKE GUEST HOUSE": {
      distance_km: 8,
      estimated_minutes: 7
    },
    "Skardu bliss hotel": {
      distance_km: 9.3,
      estimated_minutes: 8
    },
    "Comfort inn hotel": {
      distance_km: 9.3,
      estimated_minutes: 8
    },
    "Grand Hotel Skardu": {
      distance_km: 9.6,
      estimated_minutes: 8
    },
    "Baltistan inn hotel": {
      distance_km: 9.8,
      estimated_minutes: 8
    },
    "Grand view hotel": {
      distance_km: 9.8,
      estimated_minutes: 8
    },
    "Hotel walnut": {
      distance_km: 10.8,
      estimated_minutes: 9
    },
    "ABC hotel": {
      distance_km: 11,
      estimated_minutes: 9
    },
    "Lashari Resort Skardu": {
      distance_km: 11.1,
      estimated_minutes: 9
    },
    "Melody Hills Skardu": {
      distance_km: 11.4,
      estimated_minutes: 9
    },
    "NJM House Near Skardu Airport": {
      distance_km: 11.4,
      estimated_minutes: 9
    },
    "Le Yurt Skardu": {
      distance_km: 11.6,
      estimated_minutes: 9
    },
    "FearLess lodge": {
      distance_km: 12.8,
      estimated_minutes: 12
    },
    "Wamiq Skardu Resort": {
      distance_km: 15.5,
      estimated_minutes: 15
    },
    "Hosho Guest House": {
      distance_km: 14.2,
      estimated_minutes: 11
    },
    "Orgventure Resorts Skardu": {
      distance_km: 15.5,
      estimated_minutes: 12
    },
    "Green orchard skardu": {
      distance_km: 0.8,
      estimated_minutes: 1
    },
    "Mount View hotel skardu": {
      distance_km: 1,
      estimated_minutes: 2
    },
    "Laal Haveli": {
      distance_km: 1.2,
      estimated_minutes: 2
    },
    "Skardu view Guest house": {
      distance_km: 1.3,
      estimated_minutes: 2
    },
    "Baltistan Mountain Chalet Hotel": {
      distance_km: 1.3,
      estimated_minutes: 2
    },
    "Hotel Five star & restaurant skardu": {
      distance_km: 1.4,
      estimated_minutes: 2
    },
    "Tufail palace hotel & restaurant": {
      distance_km: 1.4,
      estimated_minutes: 2
    },
    "Indus motel": {
      distance_km: 1.6,
      estimated_minutes: 2
    },
    "Paradise hotel": {
      distance_km: 1.8,
      estimated_minutes: 2
    },
    "Hotel Red sun": {
      distance_km: 1.8,
      estimated_minutes: 2
    },
    "Haks hotel": {
      distance_km: 1.9,
      estimated_minutes: 2
    },
    "Hotel inn skardu": {
      distance_km: 1.9,
      estimated_minutes: 2
    },
    "Skardu embassy hotel": {
      distance_km: 2,
      estimated_minutes: 3
    },
    "Hotel Delight Skardu": {
      distance_km: 2,
      estimated_minutes: 3
    },
    "Ayan Hotel": {
      distance_km: 3.1,
      estimated_minutes: 4
    },
    "Hotel Highlander inn": {
      distance_km: 3.4,
      estimated_minutes: 4
    },
    "The North face inn hotel skardu": {
      distance_km: 4,
      estimated_minutes: 5
    },
    "The yak Hotel skardu": {
      distance_km: 4,
      estimated_minutes: 5
    },
    "Indus lodge skardu": {
      distance_km: 4,
      estimated_minutes: 5
    },
    "Stay inn hotel": {
      distance_km: 4,
      estimated_minutes: 5
    },
    "Eden Rock skardu": {
      distance_km: 4.1,
      estimated_minutes: 5
    },
    "Concordia Motel Baltistan": {
      distance_km: 4.3,
      estimated_minutes: 5
    },
    "Harriot Skardu": {
      distance_km: 4.8,
      estimated_minutes: 5
    },
    "Hotel PeakNest": {
      distance_km: 4.8,
      estimated_minutes: 5
    },
    "Royal Glaxy Hotel": {
      distance_km: 5,
      estimated_minutes: 5
    },
    "Sarfaranga view rock Guest house skardu": {
      distance_km: 5.6,
      estimated_minutes: 6
    },
    "Eat and Read Guesthouse skardu": {
      distance_km: 5.7,
      estimated_minutes: 6
    },
    "North Face explorers": {
      distance_km: 5.8,
      estimated_minutes: 6
    },
    "Holiday resort skardu": {
      distance_km: 5.8,
      estimated_minutes: 6
    },
    "Kallisto Resort": {
      distance_km: 5.8,
      estimated_minutes: 6
    },
    "Sagar hotel skardu": {
      distance_km: 6.1,
      estimated_minutes: 6
    },
    "Hotel Elite skardu": {
      distance_km: 6.2,
      estimated_minutes: 6
    },
    "SnowLand Resort": {
      distance_km: 2.4,
      estimated_minutes: 3
    },
    "Bismillah Guest House": {
      distance_km: 2.4,
      estimated_minutes: 3
    },
    "Hotel Yak sarai": {
      distance_km: 2.4,
      estimated_minutes: 3
    },
    "The North Palace": {
      distance_km: 2.4,
      estimated_minutes: 3
    },
    "Duqsa Family Guest House": {
      distance_km: 2.9,
      estimated_minutes: 3
    },
    "Wazir's villa": {
      distance_km: 3.4,
      estimated_minutes: 4
    },
    "Hotel Rewaaj": {
      distance_km: 2.7,
      estimated_minutes: 4
    },
    "Comfort Hotel & Huts skardu": {
      distance_km: 3.6,
      estimated_minutes: 4
    },
    "Zam Zam Guest House": {
      distance_km: 3.1,
      estimated_minutes: 4
    },
    "The Mountain Gypsy Resort": {
      distance_km: 3.1,
      estimated_minutes: 4
    },
    "Rigo Resort Skardu": {
      distance_km: 7,
      estimated_minutes: 9
    },
    "Arish Luxury Sites": {
      distance_km: 5.5,
      estimated_minutes: 7
    },
    "InterContinental Hotel": {
      distance_km: 5.1,
      estimated_minutes: 6
    },
    "Royal fort resort skardu": {
      distance_km: 5.1,
      estimated_minutes: 6
    },
    "Meer Stay and Dine skardu": {
      distance_km: 5,
      estimated_minutes: 6
    },
    "Dream Land Guest House": {
      distance_km: 5.6,
      estimated_minutes: 7
    },
    "Hotel GraceLand": {
      distance_km: 5.1,
      estimated_minutes: 6
    },
    "MOUNTAIN MAJESTY INN SKARDU": {
      distance_km: 5.3,
      estimated_minutes: 7
    },
    "Alnoor Lodges": {
      distance_km: 5.2,
      estimated_minutes: 6
    },
    "Jasper House": {
      distance_km: 5.4,
      estimated_minutes: 7
    },
    "The Himalayan Guest House": {
      distance_km: 5.5,
      estimated_minutes: 7
    },
    "Epoch Inn Guest House Skardu": {
      distance_km: 5.6,
      estimated_minutes: 7
    },
    "Mountaindale Guest House": {
      distance_km: 5.7,
      estimated_minutes: 7
    },
    "Al Jannah Guest House Skardu": {
      distance_km: 5.7,
      estimated_minutes: 7
    },
    "Biafo Resort Skardu": {
      distance_km: 5.7,
      estimated_minutes: 7
    },
    "Skardu Blossom Inn": {
      distance_km: 5.8,
      estimated_minutes: 7
    },
    "The Diamond Guest House Skardu": {
      distance_km: 5.9,
      estimated_minutes: 7
    },
    "Anarres | A Creative Residency": {
      distance_km: 6.3,
      estimated_minutes: 7
    },
    "Submit Embassy Hotel": {
      distance_km: 6.3,
      estimated_minutes: 7
    },
    "Alpine Abode Skardu": {
      distance_km: 6.7,
      estimated_minutes: 8
    },
    "Relax Inn Skardu": {
      distance_km: 6.7,
      estimated_minutes: 8
    },
    "Gumaan Resort Skardu": {
      distance_km: 6.8,
      estimated_minutes: 8
    },
    "Yuligo Resort Skardu": {
      distance_km: 7.1,
      estimated_minutes: 8
    },
    "Urban escape resort": {
      distance_km: 5.2,
      estimated_minutes: 6
    },
    "Mohsin Lodge Skardu": {
      distance_km: 4.9,
      estimated_minutes: 6
    },
    "Back To Home Lodging": {
      distance_km: 4.9,
      estimated_minutes: 6
    },
    "Royal Brangsa Guest House": {
      distance_km: 4.7,
      estimated_minutes: 6
    },
    "Wazir Guest House Skardu": {
      distance_km: 4.3,
      estimated_minutes: 5
    },
    "Golden Ibex Guest House": {
      distance_km: 4.3,
      estimated_minutes: 5
    },
    "Up Way Guest House": {
      distance_km: 4.5,
      estimated_minutes: 6
    },
    "Kunlun Peak Inn skardu": {
      distance_km: 4.4,
      estimated_minutes: 5
    },
    "Markhor Hotel": {
      distance_km: 4.6,
      estimated_minutes: 6
    },
    "Tibet hotel skardu": {
      distance_km: 4.9,
      estimated_minutes: 7
    },
    "Alpha Nomads House": {
      distance_km: 5,
      estimated_minutes: 7
    },
    "Dirleh Hotel": {
      distance_km: 5.2,
      estimated_minutes: 7
    },
    "North Home Skardu": {
      distance_km: 5.2,
      estimated_minutes: 7
    },
    "Valhalla Guest House": {
      distance_km: 5.1,
      estimated_minutes: 7
    },
    "Creek villa skardu": {
      distance_km: 5.2,
      estimated_minutes: 7
    },
    "Prince Tourist Hut": {
      distance_km: 5.5,
      estimated_minutes: 7
    },
    "Mountain House": {
      distance_km: 5.6,
      estimated_minutes: 7
    },
    "Reechan Resort House": {
      distance_km: 5.3,
      estimated_minutes: 7
    },
    "Himalayan Guest House Hassan colony": {
      distance_km: 5.3,
      estimated_minutes: 7
    },
    "Jasmine Skardu": {
      distance_km: 5.4,
      estimated_minutes: 7
    },
    "Mountain Face Skardu": {
      distance_km: 5.5,
      estimated_minutes: 7
    },
    "Four Seasons Bed and Breakfast": {
      distance_km: 5.4,
      estimated_minutes: 7
    },
    "Flora Inn skardu": {
      distance_km: 5.4,
      estimated_minutes: 7
    },
    "Broadpeak Resort skardu": {
      distance_km: 5.5,
      estimated_minutes: 7
    },
    "Chinar Residency": {
      distance_km: 6.2,
      estimated_minutes: 7
    },
    "Buddha Rock Guest House Skardu": {
      distance_km: 6.3,
      estimated_minutes: 8
    },
    "Buddha view Resort skardu": {
      distance_km: 6.3,
      estimated_minutes: 8
    },
    "Moonal Residency": {
      distance_km: 6.5,
      estimated_minutes: 8
    },
    "Skarchan Resort skardu": {
      distance_km: 6.6,
      estimated_minutes: 8
    },
    "ZAGO Guest House": {
      distance_km: 5,
      estimated_minutes: 6
    },
    "Skardu Blossom Guest House": {
      distance_km: 5,
      estimated_minutes: 6
    },
    "Harpo Resorts": {
      distance_km: 5,
      estimated_minutes: 7
    },
    "Baltistan Continental Hotel skardu": {
      distance_km: 4.4,
      estimated_minutes: 5
    },
    "Al Abbas Guest House": {
      distance_km: 4.3,
      estimated_minutes: 5
    },
    "Apricot Spring Resort Skardu": {
      distance_km: 4.2,
      estimated_minutes: 5
    },
    "Executive Guest House Skardu": {
      distance_km: 4.2,
      estimated_minutes: 5
    },
    "Hotel Bloom Hills,Skardu": {
      distance_km: 2.8,
      estimated_minutes: 3
    },
    "Siachen Stay&Tours": {
      distance_km: 2.9,
      estimated_minutes: 3
    },
    "Mountain Guest House and Desi Restaurant": {
      distance_km: 3,
      estimated_minutes: 4
    },
    "Decent Baltistan guest house": {
      distance_km: 3.2,
      estimated_minutes: 4
    },
    "Baltistan Village Guest House": {
      distance_km: 3.2,
      estimated_minutes: 4
    },
    "Bareen": {
      distance_km: 3.3,
      estimated_minutes: 4
    },
    "SUMMIT GUEST HOUSE": {
      distance_km: 3.3,
      estimated_minutes: 4
    },
    "Serene Baltistan Hotel": {
      distance_km: 3.4,
      estimated_minutes: 4
    },
    "Alpha Hotel & Restaurant": {
      distance_km: 3.8,
      estimated_minutes: 4
    },
    "Saani Rooms": {
      distance_km: 3.8,
      estimated_minutes: 4
    },
    "Ridakh Inn": {
      distance_km: 4.1,
      estimated_minutes: 5
    },
    "Clifton Spachan Hotel": {
      distance_km: 4.1,
      estimated_minutes: 5
    },
    "K2 Tourism Guest House": {
      distance_km: 4.4,
      estimated_minutes: 5
    },
    "Heaven's Adventure.pk": {
      distance_km: 3.1,
      estimated_minutes: 4
    },
    "Desert one hotel and restaurant skardu": {
      distance_km: 2.9,
      estimated_minutes: 3
    },
    "Yazgar Residency Skardu": {
      distance_km: 3,
      estimated_minutes: 3
    },
    "The Next Home Skardu": {
      distance_km: 3,
      estimated_minutes: 3
    },
    "Heaven Hotel Skardu": {
      distance_km: 3,
      estimated_minutes: 3
    },
    "Skardu Midway hotel": {
      distance_km: 3.5,
      estimated_minutes: 4
    },
    "Sarfaranga Reaidency": {
      distance_km: 3.9,
      estimated_minutes: 4
    },
    "Skengoo Inn Hotel": {
      distance_km: 4,
      estimated_minutes: 4
    },
    "Alnoor Starlet Hotel": {
      distance_km: 4.2,
      estimated_minutes: 4
    },
    "Top Hill Resort": {
      distance_km: 4.8,
      estimated_minutes: 5
    },
    "Royal Resort Skardu": {
      distance_km: 4.4,
      estimated_minutes: 4
    },
    "Signature Skardu Hotel": {
      distance_km: 4.5,
      estimated_minutes: 4
    },
    "Shama Resort Skardu": {
      distance_km: 4.5,
      estimated_minutes: 4
    },
    "Pearl of Skardu Resort": {
      distance_km: 4.5,
      estimated_minutes: 4
    },
    "Crystal Mountain Lodge": {
      distance_km: 4.7,
      estimated_minutes: 5
    },
    "H A K S RESSORT": {
      distance_km: 5.3,
      estimated_minutes: 5
    },
    "Shaheen Guest House Skardu": {
      distance_km: 5.6,
      estimated_minutes: 5
    },
    "Nirvana Resort Skardu": {
      distance_km: 5.9,
      estimated_minutes: 6
    }
  
  },
};

// ---------------------------------------------------------------------
// TABLE 3 — Office -> Restaurant
// ---------------------------------------------------------------------
// Shape: OFFICE_TO_RESTAURANT[restaurantName] = { distance_km, estimated_minutes }
// DUMMY DATA — every entry below is placeholder, not yet measured for real.

export const OFFICE_TO_RESTAURANT: Record<string, DistanceTimeEntry> = {
  "Yak and Bull Cafe Skardu": { distance_km: 0.85, estimated_minutes: 3 },
  "Baltistan Tea and Grill House": { distance_km: 1.3, estimated_minutes: 6 },
  "The Kitchen": { distance_km: 0.95, estimated_minutes: 4 },
  "Domino's Pizza Skardu": { distance_km: 2.5, estimated_minutes: 9 },
  "The Balti Table": { distance_km: 0.55, estimated_minutes: 3 },
  "Skyway Pizza Skardu": { distance_km: 1.0, estimated_minutes: 4 },
  "The Food Corridor Skardu": { distance_km: 0.45, estimated_minutes: 2 },
  "Sungum Hotel Restaurant Skardu ": { distance_km: 0.25, estimated_minutes: 1 },
  "MFC Skardu": { distance_km: 0.28, estimated_minutes: 1 },
  "Hassan Hussain Host": { distance_km: 0.55, estimated_minutes: 3 },
  "Pizza King Skardu": { distance_km: 0.25, estimated_minutes: 1 },
  "Yak Grill Skardu": { distance_km: 1.6, estimated_minutes: 5 },
};

// ---------------------------------------------------------------------
// TABLE 4 — Area -> Office
// ---------------------------------------------------------------------
// Areas AND hotels together in one table (never split into two) —
// destinationType tells the calculation layer which one it is.
//
// Shape: AREA_TO_OFFICE[destinationName] = { destinationType, distance_km, estimated_minutes }
// DUMMY DATA — every entry below is placeholder, not yet measured for real.

export const AREA_TO_OFFICE: Record<string, DestinationToOfficeEntry> = {
  "Sundus Skilgrong": { destinationType: "Area", distance_km: 4.4, estimated_minutes: 14 },
  "Sundus Gond": { destinationType: "Area", distance_km: 5.2, estimated_minutes: 16 },
  "Newranga": { destinationType: "Area", distance_km: 3.9, estimated_minutes: 11 },
  "Katpana": { destinationType: "Area", distance_km: 7.7, estimated_minutes: 22 },
  "Khargrong": { destinationType: "Area", distance_km: 1.1, estimated_minutes: 4 },
  "Hasnain Nagar": { destinationType: "Area", distance_km: 0.6, estimated_minutes: 3 },
  "Alamdar Chowk": { destinationType: "Area", distance_km: 0.45, estimated_minutes: 2 },
  "Hassan Colony": { destinationType: "Area", distance_km: 1.7, estimated_minutes: 7 },
  "Hassan Colony Pine": { destinationType: "Area", distance_km: 1.7, estimated_minutes: 7 },
  "Shinkhani Gond": { destinationType: "Area", distance_km: 1.2, estimated_minutes: 6 },
  "Oldiing Nansoq": { destinationType: "Area", distance_km: 2.3, estimated_minutes: 8 },
  "RHQ Road Harriot Hotel": { destinationType: "Area", distance_km: 2.1, estimated_minutes: 7 },
  "Newranga Near Agha Ali House": { destinationType: "Area", distance_km: 2.1, estimated_minutes: 7 },
  "Newranga ": { destinationType: "Area", distance_km: 4.6, estimated_minutes: 19 }, // NOT in the WhatsApp list — still dummy, see note below
  "Kushmarah": { destinationType: "Area", distance_km: 3.2, estimated_minutes: 9 },
  "Sherthang Girls High School": { destinationType: "Area", distance_km: 2.0, estimated_minutes: 7 },
  "Marfie Colony": { destinationType: "Area", distance_km: 1.5, estimated_minutes: 6 },
  "Chumik": { destinationType: "Area", distance_km: 1.6, estimated_minutes: 7 },
  "Gamba Skardu": { destinationType: "Area", distance_km: 15, estimated_minutes: 25 },
  "United Line, Hassan Colony": { destinationType: "Area", distance_km: 1.5, estimated_minutes: 6 },
  "Muhib Road Khargrong": { destinationType: "Area", distance_km: 1.3, estimated_minutes: 4 },
  "GB Chief Court Skardu Registry Skardu": { destinationType: "Area", distance_km: 4.3, estimated_minutes: 12 },
  "Shaheen Public School Skardu": { destinationType: "Area", distance_km: 2.5, estimated_minutes: 10 },
  "Mehdi Colony Skardu": { destinationType: "Area", distance_km: 2.5, estimated_minutes: 10 },
  "Agha Hadi Chowk": { destinationType: "Area", distance_km: 0.9, estimated_minutes: 3 },
  "Hussainabad": { destinationType: "Area", distance_km: 17.5, estimated_minutes: 17 },
  "Himalaya Hotel Hussainabad, Skardu": { destinationType: "Area", distance_km: 17.5, estimated_minutes: 17 },
  "Hameed Garh": { destinationType: "Area", distance_km: 1.7, estimated_minutes: 6 },
  "Shaheed colony": { destinationType: "Area", distance_km: 3.8, estimated_minutes: 13 },
  "Tufail colony": { destinationType: "Area", distance_km: 3.1, estimated_minutes: 10 },
  "Jafferi Mohallah": { destinationType: "Area", distance_km: 2.2, estimated_minutes: 8 },
  "Chogo Matamsara": { destinationType: "Area", distance_km: 1.8, estimated_minutes: 8 },
  "Nagulispang Road": { destinationType: "Area", distance_km: 1.0, estimated_minutes: 4 },
  "Eidgah,Sundus ": { destinationType: "Area", distance_km: 2.8, estimated_minutes: 10 },
  "Sukemaidan ": { destinationType: "Area", distance_km: 1.2, estimated_minutes: 4 },
  "Hargissa shakthang": { destinationType: "Area", distance_km: 1.7, estimated_minutes: 6 },
  "Bhutto Bazar Skardu": { destinationType: "Area", distance_km: 1.7, estimated_minutes: 6 },
  "Devision": { destinationType: "Area", distance_km: 2.4, estimated_minutes: 8 },
  "Abbas Town": { destinationType: "Area", distance_km: 1.4, estimated_minutes: 5 },
  "Musa Line": { destinationType: "Area", distance_km: 1.3, estimated_minutes: 4 },
  "Clifton pull": { destinationType: "Area", distance_km: 1.3, estimated_minutes: 5 },
  "Sheikh ijaz masjid": { destinationType: "Area", distance_km: 1.8, estimated_minutes: 7 },
  "Khila Toq Road": { destinationType: "Area", distance_km: 1.7, estimated_minutes: 5 },
  "Public school area": { destinationType: "Area", distance_km: 2.5, estimated_minutes: 8 },
  "Xhathang": { destinationType: "Area", distance_km: 2.7, estimated_minutes: 9 },
  "Brolmo colony sundus": { destinationType: "Area", distance_km: 4.4, estimated_minutes: 15 },
  "Ghazi Colony sundus": { destinationType: "Area", distance_km: 4.8, estimated_minutes: 16 },
  "Hyderabad Gangupi Area": { destinationType: "Area", distance_km: 0.75, estimated_minutes: 3 },
  "LT Col ihsan Ali rd": { destinationType: "Area", distance_km: 0.45, estimated_minutes: 2 },
  "Astana skardu": { destinationType: "Area", distance_km: 4.2, estimated_minutes: 12 },
  "Bintul Huda Girls model school": { destinationType: "Area", distance_km: 5.0, estimated_minutes: 14 },
  "Brolmo colony astana": { destinationType: "Area", distance_km: 4.0, estimated_minutes: 12 },
  "Raees mohalla Haji Gam": { destinationType: "Area", distance_km: 2.1, estimated_minutes: 8 },
  "Haji Gam": { destinationType: "Area", distance_km: 1.2, estimated_minutes: 4 },
  "Gulshan e Ali skardu": { destinationType: "Area", distance_km: 2.1, estimated_minutes: 7 },
  "Jamia masjid road": { destinationType: "Area", distance_km: 0.9, estimated_minutes: 4 },
  "Gayool skardu": { destinationType: "Area", distance_km: 5.8, estimated_minutes: 15 },
  "Toqrangah Skardu": { destinationType: "Area", distance_km: 4.1, estimated_minutes: 13 },
  "Maqponsar skardu": { destinationType: "Area", distance_km: 3.7, estimated_minutes: 12 },
  "Newranga road": { destinationType: "Area", distance_km: 3.7, estimated_minutes: 11 },
  "Quaidabad": { destinationType: "Area", distance_km: 2.2, estimated_minutes: 8 },
  "Kharpocho Road": { destinationType: "Area", distance_km: 1.7, estimated_minutes: 8 },
  "Patwal": { destinationType: "Area", distance_km: 1.4, estimated_minutes: 5 },
  "Olding": { destinationType: "Area", distance_km: 2.3, estimated_minutes: 8 },
  "Karasmathang": { destinationType: "Area", distance_km: 1.4, estimated_minutes: 4 },
  "Kachura": { destinationType: "Area", distance_km: 58, estimated_minutes: 51 },
  "Teen Talwar Chowk": { destinationType: "Area", distance_km: 2.8, estimated_minutes: 7 }, // NEW — not yet in AREAS / location.ts, see note below
  "3 talwar chowk": { destinationType: "Area", distance_km: 2.8, estimated_minutes: 7 }, // NEW — not yet in AREAS / location.ts, see note below
  "Teen talwar chowk": { destinationType: "Area", distance_km: 2.8, estimated_minutes: 7 }, // NEW — not yet in AREAS / location.ts, see note below
  "Ali plaza": { destinationType: "Area", distance_km: 1.4, estimated_minutes: 6 }, // NEW — not yet in AREAS / location.ts, see note below
  "Radio Pakistan Chowk": { destinationType: "Area", distance_km: 2.9, estimated_minutes: 10 }, // NEW — not yet in AREAS / location.ts, see note below
  "Sahara Complex": { destinationType: "Area", distance_km: 2.4, estimated_minutes: 8 }, // NEW — not yet in AREAS / location.ts, see note below
  "Manthal": { destinationType: "Area", distance_km: 4.6, estimated_minutes: 14 }, // NEW — not yet in AREAS / location.ts, see note below


  // Hotels
  "Rus Olive Lodge": { destinationType: "Hotel", distance_km: 5.9, estimated_minutes: 22 },
  "Hargisa Resort Skardu": { destinationType: "Hotel", distance_km: 3.8, estimated_minutes: 16 },
  "LOKAL Rooms x Skardu (Katpana Retreat)": { destinationType: "Hotel", distance_km: 2.5, estimated_minutes: 10 },
  "Green Orchard Skardu": { destinationType: "Hotel", distance_km: 4.1, estimated_minutes: 14 },
  "Oasis Resort Katpana Skardu": { destinationType: "Hotel", distance_km: 7.2, estimated_minutes: 25 },
  "Avari Xpress Skardu Hotel": { destinationType: "Hotel", distance_km: 3.0, estimated_minutes: 26 },
  "Hotel Mashabrum Skardu": { destinationType: "Hotel", distance_km: 6.2, estimated_minutes: 24 },
  "Skardu Luxus Hotel": { destinationType: "Hotel", distance_km: 2.3, estimated_minutes: 10 },
  "The Mountain Cottage Skardu": { destinationType: "Hotel", distance_km: 7.7, estimated_minutes: 29 },
  "Summit Hotel Skardu": { destinationType: "Hotel", distance_km: 6.9, estimated_minutes: 26 },
  "Skardu Saraye Hotel & Resort": { destinationType: "Hotel", distance_km: 3.6, estimated_minutes: 13 },
  "Baltistan Tourist Cottage - Skardu": { destinationType: "Hotel", distance_km: 1.6, estimated_minutes: 6 },
  "Glamp Pakistan": { destinationType: "Hotel", distance_km: 5.6, estimated_minutes: 19 },
  "Montagna Pods": { destinationType: "Hotel", distance_km: 4.3, estimated_minutes: 15 },
  "Hotel Luxy Skardu": { destinationType: "Hotel", distance_km: 8.7, estimated_minutes: 33 },
  "Baltistan Fort, Skardu Resort Hotel": { destinationType: "Hotel", distance_km: 6.1, estimated_minutes: 24 },
  "Hotel Skardu1": { destinationType: "Hotel", distance_km: 4.3, estimated_minutes: 14 },
  "Baltistan Resort": { destinationType: "Hotel", distance_km: 4.4, estimated_minutes: 18 },
  "Skardu Royal Hotel & Restaurant": { destinationType: "Hotel", distance_km: 1.2, estimated_minutes: 6 },
  "Sharif Cottages and Hotel Skardu": { destinationType: "Hotel", distance_km: 8.7, estimated_minutes: 33 },
  "Base Camp Katpana": { destinationType: "Hotel", distance_km: 6.4, estimated_minutes: 22 },
  "Hotel Dewan-e-Khas": { destinationType: "Hotel", distance_km: 0.8, estimated_minutes: 4 },
  "Legend Hotel Skardu": { destinationType: "Hotel", distance_km: 6.2, estimated_minutes: 22 },
  "Northlanders Guest House Skardu": { destinationType: "Hotel", distance_km: 5.9, estimated_minutes: 20 },
  "Hotel Travellodge Skardu": { destinationType: "Hotel", distance_km: 3.7, estimated_minutes: 15 },
  "Qayam Skardu": { destinationType: "Hotel", distance_km: 5.2, estimated_minutes: 21 },
  "Rafsal A Countryside Cottage": { destinationType: "Hotel", distance_km: 5.3, estimated_minutes: 19 },
  "Kentish Lodge Skardu": { destinationType: "Hotel", distance_km: 1.1, estimated_minutes: 4 },
  "Skardu Villas": { destinationType: "Hotel", distance_km: 7.0, estimated_minutes: 26 },
  "The Cherry Courtyard": { destinationType: "Hotel", distance_km: 2.8, estimated_minutes: 12 },
  "Ringchan Guest House & Restaurant": { destinationType: "Hotel", distance_km: 3.8, estimated_minutes: 16 },
  "Skardu Lodge": { destinationType: "Hotel", distance_km: 6.6, estimated_minutes: 25 },
  "Karakoram Nest": { destinationType: "Hotel", distance_km: 3.4, estimated_minutes: 13 },
  "Dynasty Skardu": { destinationType: "Hotel", distance_km: 9.0, estimated_minutes: 31 },
  "Sehrish Guest House Skardu": { destinationType: "Hotel", distance_km: 9.5, estimated_minutes: 34 },
  "PTDC Motel Skardu": { destinationType: "Hotel", distance_km: 8.6, estimated_minutes: 32 },
  "Hotel Reego Skardu": { destinationType: "Hotel", distance_km: 6.0, estimated_minutes: 22 },
  "Lavender Cottage & Guest House": { destinationType: "Hotel", distance_km: 8.0, estimated_minutes: 30 },
  "Rock View Skardu": { destinationType: "Hotel", distance_km: 2.4, estimated_minutes: 11 },
  "Dream Guest House Haji Gam Chowk": { destinationType: "Hotel", distance_km: 5.5, estimated_minutes: 21 },
  "Indus Lodges Skardu": { destinationType: "Hotel", distance_km: 5.7, estimated_minutes: 22 },
  "Pacific Guest House Skardu": { destinationType: "Hotel", distance_km: 1.1, estimated_minutes: 4 },
  "Skardu View Point Hotel and Huts": { destinationType: "Hotel", distance_km: 2.8, estimated_minutes: 11 },
  "Khar Hotel Skardu": { destinationType: "Hotel", distance_km: 6.3, estimated_minutes: 25 },
  "HIKK Inn Skardu": { destinationType: "Hotel", distance_km: 3.0, estimated_minutes: 13 },
  "Taaj Residence Skardu": { destinationType: "Hotel", distance_km: 5.2, estimated_minutes: 20 },
  "Homeland Guest House Skardu": { destinationType: "Hotel", distance_km: 4.0, estimated_minutes: 14 },
  "Sultan Guest House Skardu": { destinationType: "Hotel", distance_km: 3.7, estimated_minutes: 12 },
  "The Hill Town Resort": { destinationType: "Hotel", distance_km: 3.9, estimated_minutes: 15 },
  "AlJannah Guest House Skardu": { destinationType: "Hotel", distance_km: 9.0, estimated_minutes: 33 },
  "Deosai Gateway Inn Skardu": { destinationType: "Hotel", distance_km: 4.9, estimated_minutes: 17 },
  "Skardu Arcadian Resort": { destinationType: "Hotel", distance_km: 4.6, estimated_minutes: 17 },
  "Areena Hotel Skardu": { destinationType: "Hotel", distance_km: 4.2, estimated_minutes: 17 },
  "Skardu Farmhouse for stay": { destinationType: "Hotel", distance_km: 6.1, estimated_minutes: 24 },
  "Adventure Sarai Hotel Skardu": { destinationType: "Hotel", distance_km: 0.6, estimated_minutes: 2 },
  "Maple Resort": { destinationType: "Hotel", distance_km: 8.8, estimated_minutes: 34 },
  "Candela Resorts": { destinationType: "Hotel", distance_km: 9.3, estimated_minutes: 35 },
  "Hispar Hotel Skardu": { destinationType: "Hotel", distance_km: 8.8, estimated_minutes: 33 },
  "K2 Paradise Guest House": { destinationType: "Hotel", distance_km: 6.9, estimated_minutes: 25 },
  "Holiday Mountain Resort & Camping Site": { destinationType: "Hotel", distance_km: 6.1, estimated_minutes: 23 },
  "Mountain Lodge Skardu": { destinationType: "Hotel", distance_km: 0.7, estimated_minutes: 4 },
  "Mulberry Continental Hotel Skardu": { destinationType: "Hotel", distance_km: 2.8, estimated_minutes: 10 },
  "PC Legacy Skardu": { destinationType: "Hotel", distance_km: 6.9, estimated_minutes: 24 },
  "GB Lodges": { destinationType: "Hotel", distance_km: 2.8, estimated_minutes: 9 },
  "Bilafond Cottage": { destinationType: "Hotel", distance_km: 7.0, estimated_minutes: 26 },
  "North Hills Skardu": { destinationType: "Hotel", distance_km: 4.8, estimated_minutes: 18 },
  "Pinnacle Executive Lodges": { destinationType: "Hotel", distance_km: 3.5, estimated_minutes: 12 },
  "Safena Hotel Skardu": { destinationType: "Hotel", distance_km: 4.2, estimated_minutes: 17 },
  "Byarsa Hotel Skardu": { destinationType: "Hotel", distance_km: 7.6, estimated_minutes: 29 },
  "Dream Nest Resort Hotels Skardu": { destinationType: "Hotel", distance_km: 3.6, estimated_minutes: 14 },
  "Stream view guest house skardu": { destinationType: "Hotel", distance_km: 6.3, estimated_minutes: 24 },
  "Shangrila Resort Skardu": { destinationType: "Hotel", distance_km: 60, estimated_minutes: 16 },
  "Kachura Inn Skardu": { destinationType: "Hotel", distance_km: 59, estimated_minutes: 25 },
  "Tibet Hotel Kachura Skardu": { destinationType: "Hotel", distance_km: 61, estimated_minutes: 25 },
  "Hotel Mountain Lagoon Skardu": { destinationType: "Hotel", distance_km: 9.5, estimated_minutes: 34 },
  "Skardu River Resort": { destinationType: "Hotel", distance_km: 5.5, estimated_minutes: 19 },
  "Morning Resort": { destinationType: "Hotel", distance_km: 5.9, estimated_minutes: 23 },
  "Hotel Desert Bloom Skardu": { destinationType: "Hotel", distance_km: 7.0, estimated_minutes: 26 },
  "TheQue Skardu": { destinationType: "Hotel", distance_km: 0.7, estimated_minutes: 4 },
  "Singay Homestay Skardu": { destinationType: "Hotel", distance_km: 6.2, estimated_minutes: 22 },
  "Baltistan Crown Resort": { destinationType: "Hotel", distance_km: 0.4, estimated_minutes: 2 },
  "Fatah inn Guest House": { destinationType: "Hotel", distance_km: 9.2, estimated_minutes: 32 },
  "Kunhar": { destinationType: "Hotel", distance_km: 4.2, estimated_minutes: 14 },
  "Maltoro guest house": { destinationType: "Hotel", distance_km: 4.8, estimated_minutes: 19 },
  "Apex Hotels and Resorts Skardu": { destinationType: "Hotel", distance_km: 5.6, estimated_minutes: 20 },
  "Hotel virsa": { destinationType: "Hotel", distance_km: 5.9, estimated_minutes: 23 },
  "Elli's Luxus": { destinationType: "Hotel", distance_km: 4.8, estimated_minutes: 17 },
  "Skardu Gateway Hotel & Restaurant": { destinationType: "Hotel", distance_km: 7.5, estimated_minutes: 29 },
  "Polo Land Hotel by Skyline": { destinationType: "Hotel", distance_km: 2.5, estimated_minutes: 9 },
  "Baltistan White House Hotel": { destinationType: "Hotel", distance_km: 3.3, estimated_minutes: 11 },
  "The Pioneer Hotel": { destinationType: "Hotel", distance_km: 8.5, estimated_minutes: 32 },
  "Ramovi Guest House": { destinationType: "Hotel", distance_km: 1.6, estimated_minutes: 8 },
  "Friends & Family Guest House": { destinationType: "Hotel", distance_km: 1.9, estimated_minutes: 8 },
  "SKY LAKE GUEST HOUSE": { destinationType: "Hotel", distance_km: 3.5, estimated_minutes: 15 },
  "Skardu bliss hotel": { destinationType: "Hotel", distance_km: 3.5, estimated_minutes: 13 },
  "Comfort inn hotel": { destinationType: "Hotel", distance_km: 8.6, estimated_minutes: 33 },
  "Grand Hotel Skardu": { destinationType: "Hotel", distance_km: 1.1, estimated_minutes: 6 },
  "Baltistan inn hotel": { destinationType: "Hotel", distance_km: 9.1, estimated_minutes: 35 },
  "Grand view hotel": { destinationType: "Hotel", distance_km: 1.5, estimated_minutes: 4 },
  "Hotel walnut": { destinationType: "Hotel", distance_km: 5.0, estimated_minutes: 20 },
  "ABC hotel": { destinationType: "Hotel", distance_km: 9.1, estimated_minutes: 32 },
  "Lashari Resort Skardu": { destinationType: "Hotel", distance_km: 8.6, estimated_minutes: 30 },
  "Melody Hills Skardu": { destinationType: "Hotel", distance_km: 5.9, estimated_minutes: 23 },
  "NJM House Near Skardu Airport": { destinationType: "Hotel", distance_km: 5.8, estimated_minutes: 23 },
  "Le Yurt Skardu": { destinationType: "Hotel", distance_km: 5.9, estimated_minutes: 20 },
  "FearLess lodge": { destinationType: "Hotel", distance_km: 5.7, estimated_minutes: 21 },
  "Wamiq Skardu Resort": { destinationType: "Hotel", distance_km: 5.4, estimated_minutes: 18 },
  "Hosho Guest House": { destinationType: "Hotel", distance_km: 7.1, estimated_minutes: 25 },
  "Orgventure Resorts Skardu": { destinationType: "Hotel", distance_km: 3.9, estimated_minutes: 13 },
  "Green orchard skardu": { destinationType: "Hotel", distance_km: 7.4, estimated_minutes: 26 },
  "Mount View hotel skardu": { destinationType: "Hotel", distance_km: 0.5, estimated_minutes: 3 },
  "Laal Haveli": { destinationType: "Hotel", distance_km: 9.0, estimated_minutes: 31 },
  "Skardu view Guest house": { destinationType: "Hotel", distance_km: 7.7, estimated_minutes: 27 },
  "Baltistan Mountain Chalet Hotel": { destinationType: "Hotel", distance_km: 2.3, estimated_minutes: 8 },
  "Hotel Five star & restaurant skardu": { destinationType: "Hotel", distance_km: 3.7, estimated_minutes: 14 },
  "Tufail palace hotel & restaurant": { destinationType: "Hotel", distance_km: 2.7, estimated_minutes: 12 },
  "Indus motel": { destinationType: "Hotel", distance_km: 8.7, estimated_minutes: 33 },
  "Paradise hotel": { destinationType: "Hotel", distance_km: 0.6, estimated_minutes: 3 },
  "Hotel Red sun": { destinationType: "Hotel", distance_km: 2.9, estimated_minutes: 11 },
  "Haks hotel": { destinationType: "Hotel", distance_km: 0.4, estimated_minutes: 2 },
  "Hotel inn skardu": { destinationType: "Hotel", distance_km: 6.8, estimated_minutes: 26 },
  "Skardu embassy hotel": { destinationType: "Hotel", distance_km: 2.2, estimated_minutes: 8 },
  "Hotel Delight Skardu": { destinationType: "Hotel", distance_km: 2.5, estimated_minutes: 11 },
  "Ayan Hotel": { destinationType: "Hotel", distance_km: 4.0, estimated_minutes: 14 },
  "Hotel Highlander inn": { destinationType: "Hotel", distance_km: 5.0, estimated_minutes: 19 },
  "The North face inn hotel skardu": { destinationType: "Hotel", distance_km: 2.5, estimated_minutes: 11 },
  "The yak Hotel skardu": { destinationType: "Hotel", distance_km: 7.4, estimated_minutes: 26 },
  "Indus lodge skardu": { destinationType: "Hotel", distance_km: 6.3, estimated_minutes: 23 },
  "Stay inn hotel": { destinationType: "Hotel", distance_km: 1.5, estimated_minutes: 7 },
  "Eden Rock skardu": { destinationType: "Hotel", distance_km: 2.9, estimated_minutes: 12 },
  "Concordia Motel Baltistan": { destinationType: "Hotel", distance_km: 5.4, estimated_minutes: 18 },
  "Harriot Skardu": { destinationType: "Hotel", distance_km: 3.6, estimated_minutes: 14 },
  "Hotel PeakNest": { destinationType: "Hotel", distance_km: 8.4, estimated_minutes: 32 },
  "Royal Glaxy Hotel": { destinationType: "Hotel", distance_km: 2.3, estimated_minutes: 9 },
  "Sarfaranga view rock Guest house skardu": { destinationType: "Hotel", distance_km: 8.1, estimated_minutes: 29 },
  "Eat and Read Guesthouse skardu": { destinationType: "Hotel", distance_km: 0.5, estimated_minutes: 3 },
  "North Face explorers": { destinationType: "Hotel", distance_km: 3.2, estimated_minutes: 11 },
  "Holiday resort skardu": { destinationType: "Hotel", distance_km: 6.3, estimated_minutes: 22 },
  "Kallisto Resort": { destinationType: "Hotel", distance_km: 3.7, estimated_minutes: 13 },
  "Sagar hotel skardu": { destinationType: "Hotel", distance_km: 8.8, estimated_minutes: 32 },
  "Hotel Elite skardu": { destinationType: "Hotel", distance_km: 8.2, estimated_minutes: 31 },
  "SnowLand Resort": { destinationType: "Hotel", distance_km: 1.5, estimated_minutes: 4 },
  "Bismillah Guest House": { destinationType: "Hotel", distance_km: 7.3, estimated_minutes: 25 },
  "Hotel Yak sarai": { destinationType: "Hotel", distance_km: 3.5, estimated_minutes: 12 },
  "The North Palace": { destinationType: "Hotel", distance_km: 5.9, estimated_minutes: 23 },
  "Duqsa Family Guest House": { destinationType: "Hotel", distance_km: 4.0, estimated_minutes: 16 },
  "Wazir's villa": { destinationType: "Hotel", distance_km: 0.5, estimated_minutes: 2 },
  "Hotel Rewaaj": { destinationType: "Hotel", distance_km: 2.4, estimated_minutes: 8 },
  "Comfort Hotel & Huts skardu": { destinationType: "Hotel", distance_km: 2.9, estimated_minutes: 11 },
  "Zam Zam Guest House": { destinationType: "Hotel", distance_km: 1.5, estimated_minutes: 5 },
  "The Mountain Gypsy Resort": { destinationType: "Hotel", distance_km: 5.9, estimated_minutes: 20 },
  "Rigo Resort Skardu": { destinationType: "Hotel", distance_km: 3.9, estimated_minutes: 13 },
  "Arish Luxury Sites": { destinationType: "Hotel", distance_km: 7.2, estimated_minutes: 27 },
  "InterContinental Hotel": { destinationType: "Hotel", distance_km: 4.9, estimated_minutes: 17 },
  "Royal fort resort skardu": { destinationType: "Hotel", distance_km: 5.2, estimated_minutes: 18 },
  "Meer Stay and Dine skardu": { destinationType: "Hotel", distance_km: 1.0, estimated_minutes: 4 },
  "Dream Land Guest House": { destinationType: "Hotel", distance_km: 6.0, estimated_minutes: 23 },
  "Hotel GraceLand": { destinationType: "Hotel", distance_km: 6.5, estimated_minutes: 22 },
  "MOUNTAIN MAJESTY INN SKARDU": { destinationType: "Hotel", distance_km: 8.0, estimated_minutes: 31 },
  "Alnoor Lodges": { destinationType: "Hotel", distance_km: 2.2, estimated_minutes: 10 },
  "Jasper House": { destinationType: "Hotel", distance_km: 1.4, estimated_minutes: 6 },
  "The Himalayan Guest House": { destinationType: "Hotel", distance_km: 8.2, estimated_minutes: 31 },
  "Epoch Inn Guest House Skardu": { destinationType: "Hotel", distance_km: 3.0, estimated_minutes: 10 },
  "Mountaindale Guest House": { destinationType: "Hotel", distance_km: 3.9, estimated_minutes: 13 },
  "Al Jannah Guest House Skardu": { destinationType: "Hotel", distance_km: 8.7, estimated_minutes: 32 },
  "Biafo Resort Skardu": { destinationType: "Hotel", distance_km: 1.4, estimated_minutes: 5 },
  "Skardu Blossom Inn": { destinationType: "Hotel", distance_km: 1.2, estimated_minutes: 6 },
  "The Diamond Guest House Skardu": { destinationType: "Hotel", distance_km: 3.6, estimated_minutes: 15 },
  "Anarres | A Creative Residency": { destinationType: "Hotel", distance_km: 4.8, estimated_minutes: 17 },
  "Submit Embassy Hotel": { destinationType: "Hotel", distance_km: 5.9, estimated_minutes: 20 },
  "Alpine Abode Skardu": { destinationType: "Hotel", distance_km: 2.3, estimated_minutes: 10 },
  "Relax Inn Skardu": { destinationType: "Hotel", distance_km: 2.5, estimated_minutes: 10 },
  "Gumaan Resort Skardu": { destinationType: "Hotel", distance_km: 8.0, estimated_minutes: 28 },
  "Yuligo Resort Skardu": { destinationType: "Hotel", distance_km: 8.3, estimated_minutes: 32 },
  "Urban escape resort": { destinationType: "Hotel", distance_km: 2.2, estimated_minutes: 9 },
  "Mohsin Lodge Skardu": { destinationType: "Hotel", distance_km: 4.3, estimated_minutes: 15 },
  "Back To Home Lodging": { destinationType: "Hotel", distance_km: 2.2, estimated_minutes: 9 },
  "Royal Brangsa Guest House": { destinationType: "Hotel", distance_km: 1.3, estimated_minutes: 5 },
  "Wazir Guest House Skardu": { destinationType: "Hotel", distance_km: 4.3, estimated_minutes: 17 },
  "Golden Ibex Guest House": { destinationType: "Hotel", distance_km: 4.4, estimated_minutes: 18 },
  "Up Way Guest House": { destinationType: "Hotel", distance_km: 9.2, estimated_minutes: 32 },
  "Kunlun Peak Inn skardu": { destinationType: "Hotel", distance_km: 0.8, estimated_minutes: 5 },
  "Markhor Hotel": { destinationType: "Hotel", distance_km: 8.9, estimated_minutes: 31 },
  "Tibet hotel skardu": { destinationType: "Hotel", distance_km: 1.4, estimated_minutes: 6 },
  "Alpha Nomads House": { destinationType: "Hotel", distance_km: 7.3, estimated_minutes: 26 },
  "Dirleh Hotel": { destinationType: "Hotel", distance_km: 3.4, estimated_minutes: 14 },
  "North Home Skardu": { destinationType: "Hotel", distance_km: 6.1, estimated_minutes: 22 },
  "Valhalla Guest House": { destinationType: "Hotel", distance_km: 2.9, estimated_minutes: 10 },
  "Creek villa skardu": { destinationType: "Hotel", distance_km: 6.9, estimated_minutes: 24 },
  "Prince Tourist Hut": { destinationType: "Hotel", distance_km: 3.8, estimated_minutes: 14 },
  "Mountain House": { destinationType: "Hotel", distance_km: 6.5, estimated_minutes: 23 },
  "Reechan Resort House": { destinationType: "Hotel", distance_km: 2.2, estimated_minutes: 8 },
  "Himalayan Guest House Hassan colony": { destinationType: "Hotel", distance_km: 2.8, estimated_minutes: 11 },
  "Jasmine Skardu": { destinationType: "Hotel", distance_km: 6.3, estimated_minutes: 24 },
  "Mountain Face Skardu": { destinationType: "Hotel", distance_km: 1.0, estimated_minutes: 4 },
  "Four Seasons Bed and Breakfast": { destinationType: "Hotel", distance_km: 0.9, estimated_minutes: 2 },
  "Flora Inn skardu": { destinationType: "Hotel", distance_km: 6.0, estimated_minutes: 24 },
  "Broadpeak Resort skardu": { destinationType: "Hotel", distance_km: 5.1, estimated_minutes: 20 },
  "Chinar Residency": { destinationType: "Hotel", distance_km: 8.1, estimated_minutes: 29 },
  "Buddha Rock Guest House Skardu": { destinationType: "Hotel", distance_km: 4.5, estimated_minutes: 15 },
  "Buddha view Resort skardu": { destinationType: "Hotel", distance_km: 8.4, estimated_minutes: 30 },
  "Moonal Residency": { destinationType: "Hotel", distance_km: 7.2, estimated_minutes: 27 },
  "Skarchan Resort skardu": { destinationType: "Hotel", distance_km: 6.0, estimated_minutes: 21 },
  "ZAGO Guest House": { destinationType: "Hotel", distance_km: 6.8, estimated_minutes: 23 },
  "Skardu Blossom Guest House": { destinationType: "Hotel", distance_km: 5.7, estimated_minutes: 23 },
  "Harpo Resorts": { destinationType: "Hotel", distance_km: 4.1, estimated_minutes: 14 },
  "Baltistan Continental Hotel skardu": { destinationType: "Hotel", distance_km: 8.2, estimated_minutes: 31 },
  "Al Abbas Guest House": { destinationType: "Hotel", distance_km: 0.6, estimated_minutes: 3 },
  "Apricot Spring Resort Skardu": { destinationType: "Hotel", distance_km: 8.5, estimated_minutes: 32 },
  "Executive Guest House Skardu": { destinationType: "Hotel", distance_km: 8.3, estimated_minutes: 30 },
  "Hotel Bloom Hills,Skardu": { destinationType: "Hotel", distance_km: 4.9, estimated_minutes: 17 },
  "Siachen Stay&Tours": { destinationType: "Hotel", distance_km: 5.5, estimated_minutes: 20 },
  "Mountain Guest House and Desi Restaurant": { destinationType: "Hotel", distance_km: 4.5, estimated_minutes: 18 },
  "Decent Baltistan guest house": { destinationType: "Hotel", distance_km: 8.1, estimated_minutes: 28 },
  "Baltistan Village Guest House": { destinationType: "Hotel", distance_km: 0.5, estimated_minutes: 3 },
  "Bareen": { destinationType: "Hotel", distance_km: 8.7, estimated_minutes: 32 },
  "SUMMIT GUEST HOUSE": { destinationType: "Hotel", distance_km: 7.8, estimated_minutes: 29 },
  "Serene Baltistan Hotel": { destinationType: "Hotel", distance_km: 8.5, estimated_minutes: 31 },
  "Alpha Hotel & Restaurant": { destinationType: "Hotel", distance_km: 0.6, estimated_minutes: 4 },
  "Saani Rooms": { destinationType: "Hotel", distance_km: 8.8, estimated_minutes: 33 },
  "Ridakh Inn": { destinationType: "Hotel", distance_km: 4.8, estimated_minutes: 18 },
  "Clifton Spachan Hotel": { destinationType: "Hotel", distance_km: 3.2, estimated_minutes: 12 },
  "K2 Tourism Guest House": { destinationType: "Hotel", distance_km: 8.4, estimated_minutes: 32 },
  "Heaven's Adventure.pk": { destinationType: "Hotel", distance_km: 2.0, estimated_minutes: 8 },
  "Desert one hotel and restaurant skardu": { destinationType: "Hotel", distance_km: 3.2, estimated_minutes: 11 },
  "Yazgar Residency Skardu": { destinationType: "Hotel", distance_km: 2.9, estimated_minutes: 10 },
  "The Next Home Skardu": { destinationType: "Hotel", distance_km: 5.7, estimated_minutes: 23 },
  "Heaven Hotel Skardu": { destinationType: "Hotel", distance_km: 0.9, estimated_minutes: 5 },
  "Skardu Midway hotel": { destinationType: "Hotel", distance_km: 5.9, estimated_minutes: 23 },
  "Sarfaranga Reaidency": { destinationType: "Hotel", distance_km: 3.6, estimated_minutes: 14 },
  "Skengoo Inn Hotel": { destinationType: "Hotel", distance_km: 5.3, estimated_minutes: 19 },
  "Alnoor Starlet Hotel": { destinationType: "Hotel", distance_km: 2.8, estimated_minutes: 12 },
  "Top Hill Resort": { destinationType: "Hotel", distance_km: 5.0, estimated_minutes: 18 },
  "Royal Resort Skardu": { destinationType: "Hotel", distance_km: 0.6, estimated_minutes: 3 },
  "Signature Skardu Hotel": { destinationType: "Hotel", distance_km: 7.5, estimated_minutes: 27 },
  "Shama Resort Skardu": { destinationType: "Hotel", distance_km: 0.7, estimated_minutes: 4 },
  "Pearl of Skardu Resort": { destinationType: "Hotel", distance_km: 7.3, estimated_minutes: 27 },
  "Crystal Mountain Lodge": { destinationType: "Hotel", distance_km: 7.5, estimated_minutes: 28 },
  "H A K S RESSORT": { destinationType: "Hotel", distance_km: 3.4, estimated_minutes: 11 },
  "Shaheen Guest House Skardu": { destinationType: "Hotel", distance_km: 2.7, estimated_minutes: 9 },
  "Nirvana Resort Skardu": { destinationType: "Hotel", distance_km: 2.3, estimated_minutes: 9 },
};

// ---------------------------------------------------------------------
// Scaffolding helpers — keep the structure easy to expand
// ---------------------------------------------------------------------
// Call these when you add a new restaurant/area/hotel so you get null
// placeholder rows everywhere that name needs a measurement — a
// checklist of exactly what's still missing, instead of silently
// undefined lookups. Safe to call repeatedly; never overwrites an entry
// that already has real data.

/** Call after adding a new restaurant to RESTAURANTS. */
export function ensureRestaurantScaffolding(restaurantName: string): void {
  if (!RESTAURANT_TO_AREA[restaurantName]) RESTAURANT_TO_AREA[restaurantName] = {};
  for (const area of AREAS) {
    if (!RESTAURANT_TO_AREA[restaurantName][area]) {
      RESTAURANT_TO_AREA[restaurantName][area] = { ...UNMEASURED };
    }
  }
  for (const hotel of HOTELS) {
    if (!RESTAURANT_TO_AREA[restaurantName][hotel]) {
      RESTAURANT_TO_AREA[restaurantName][hotel] = { ...UNMEASURED };
    }
  }

  if (!OFFICE_TO_RESTAURANT[restaurantName]) {
    OFFICE_TO_RESTAURANT[restaurantName] = { ...UNMEASURED };
  }

  // Pairwise scaffolding against every OTHER existing restaurant, one
  // direction per pair (matches the "enter only one direction" rule above).
  if (!RESTAURANT_TO_RESTAURANT[restaurantName]) RESTAURANT_TO_RESTAURANT[restaurantName] = {};
  for (const other of RESTAURANTS) {
    if (other === restaurantName) continue;
    const alreadyHasReverse = RESTAURANT_TO_RESTAURANT[other]?.[restaurantName] !== undefined;
    if (!alreadyHasReverse && !RESTAURANT_TO_RESTAURANT[restaurantName][other]) {
      RESTAURANT_TO_RESTAURANT[restaurantName][other] = { ...UNMEASURED };
    }
  }
}

/** Call after adding a new area or hotel to AREAS / HOTELS. */
export function ensureDestinationScaffolding(destinationName: string, type: DestinationType): void {
  if (!AREA_TO_OFFICE[destinationName]) {
    AREA_TO_OFFICE[destinationName] = { destinationType: type, ...UNMEASURED };
  }

  for (const restaurant of RESTAURANTS) {
    if (!RESTAURANT_TO_AREA[restaurant]) RESTAURANT_TO_AREA[restaurant] = {};
    if (!RESTAURANT_TO_AREA[restaurant][destinationName]) {
      RESTAURANT_TO_AREA[restaurant][destinationName] = { ...UNMEASURED };
    }
  }
}