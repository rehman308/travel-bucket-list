import { useEffect, useState } from 'react';

import Places from './Places.jsx';
import ErrorPage from './ErrorPage.jsx';
import { fetchAvailablePlaces } from '../utils/utils.js';

// Remove it if running with Backend
import places from '../assets/places.json'

/**
 * Displays a list of available travel places fetched from the backend.
 * Handles loading and error states and passes selected places to parent.
 */
export default function AvailablePlaces({ onSelectPlace }) {
  // Indicates if the component is currently fetching data
  const [isLoading, setIsLoading] = useState(false);

  // Stores fetched places
  const [availablePlaces, setAvailablePlaces] = useState([]);

  // Stores any error encountered during fetch
  const [error, setError] = useState(null);

  /**
   * Fetch the available places from the server on start.
   * Handles loading and error states appropriately.
   */
  useEffect(() => {
    // Remove it if running with Backend
    setAvailablePlaces(places)

    // Uncomment this code
    // async function loadPlaces() {
    //   setIsLoading(true);
    //
    //   try {
    //     const places = await fetchAvailablePlaces();
    //     setAvailablePlaces(places);
    //   } catch (error) {
    //     setError({ message: error.message || 'Failed to fetch available places.' });
    //   } finally {
    //     setIsLoading(false);
    //   }
    // }
    //
    // loadPlaces();
  }, []);

  // If an error occurred during data fetch, show error page
  if (error) {
    return (
      <ErrorPage
        title="An Error Occurred"
        message={error.message}
      />
    );
  }

  // Render the list of available places using the Places component
  return (
    <Places
      title="Available Places"
      isLoading={isLoading}
      isLoadingText="Fetching places..."
      places={availablePlaces}
      fallbackText="No places available."
      onSelectPlace={onSelectPlace}
    />
  );
}