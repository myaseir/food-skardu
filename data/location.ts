export const SKARDU_HOTELS: { [key: string]: number } = {
  "Rus Olive Lodge": 2.5,
  "Sundus Guest house": 3.2,
  "Shangrila Resort Skardu": 12.5,
  "Serena Hotel Shigar": 35.0,
  "Kharpocho Guest House": 1.8,
  "Himalaya Hotel Skardu": 2.1,
  "Dewan-e-Khas Resort": 4.5,
};

export const SKARDU_AREAS: { [key: string]: number } = {
  "Sundus": 3.0,
  "Katpanah": 4.0,
  "Olding": 5.5,
  "Newrang": 6.0,
  "Hassan Colony": 2.0,
};

// Merged list for the delivery calculator to use
export const SKARDU_LOCATIONS = { ...SKARDU_HOTELS, ...SKARDU_AREAS };