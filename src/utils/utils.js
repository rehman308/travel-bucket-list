import { sortPlacesByDistance } from '../loc.js';

/**
 * Attempts to retrieve the user's current geolocation using the browser's
 * Geolocation API. Returns a position object on success, or null on failure.
 */
async function getUserLocation() {
  try {
    return await new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(resolve, reject);
    });
  } catch {
    return null; // if permission denied or an error occurs
  }
}

/**
 * Fetches all available places from the server.
 * Attempts to retrieve user location to sort the list by proximity.
 */
export async function fetchAvailablePlaces() {
  try {
    const response = await fetch('http://localhost:3000/places');

    if (!response.ok) {
      throw new Error('Failed to fetch available places from the server.');
    }

    const { places } = await response.json();

    const userLocation = await getUserLocation();

    // Sort places by distance if user location is available
    if (userLocation?.coords) {
      return sortPlacesByDistance(
        places,
        userLocation.coords.latitude,
        userLocation.coords.longitude,
      );
    }

    // Return unsorted list if location is unavailable
    return places;

  } catch (error) {
    // Surface error to caller for proper handling
    throw new Error(error.message || 'An unexpected error occurred while fetching places.');
  }
}

/**
 * Fetches the user's currently selected (saved) places from the server.
 */
export async function fetchUserPlaces() {
  const response = await fetch('http://localhost:3000/user-places');

  if (!response.ok) {
    throw new Error('Failed to fetch user places.');
  }

  const { places } = await response.json();
  return places;
}

/**
 * Updates the list of user-selected places on the server.
 */
export async function updateSelectedPlaces(places) {
  const response = await fetch('http://localhost:3000/user-places', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ places }),
  });

  if (!response.ok) {
    throw new Error('Failed to update selected places.');
  }

  // Optional: you can use response.json() if you need confirmation data
  await response.json(); // Not used, but awaited for completeness
}