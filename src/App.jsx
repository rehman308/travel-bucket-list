import { useCallback, useEffect, useRef, useState } from 'react';

import logoImg from './assets/logo.png';
import Modal from './components/Modal.jsx';
import ErrorPage from './components/ErrorPage.jsx';
import Places from './components/Places.jsx';
import AvailablePlaces from './components/AvailablePlaces.jsx';
import DeleteConfirmation from './components/DeleteConfirmation.jsx';

import { fetchUserPlaces, updateSelectedPlaces } from './utils/utils.js';

function App() {
  // Reference to currently selected place for deletion
  const selectedPlace = useRef();

  // State to manage user's selected places
  const [userPlaces, setUserPlaces] = useState([]);

  // Loading and error state management
  const [isFetching, setIsFetching] = useState(false);
  const [error, setError] = useState(null);
  const [errorUpdatingPlaces, setErrorUpdatingPlaces] = useState(null);

  // Modal state
  const [modalIsOpen, setModalIsOpen] = useState(false);

  // Uncomment this block if running with Backend
  //Fetch user's selected places from backend
  // useEffect(() => {
  //   async function fetchPlaces() {
  //     setIsFetching(true);
  //     try {
  //       const places = await fetchUserPlaces();
  //       setUserPlaces(places);
  //     } catch (err) {
  //       setError({ message: err.message || 'Failed to fetch user places.' });
  //     } finally {
  //       setIsFetching(false);
  //     }
  //   }
  //
  //   fetchPlaces();
  // }, []);

  //Begin delete process by showing confirmation modal
  const handleStartRemovePlace = (place) => {
    selectedPlace.current = place;
    setModalIsOpen(true);
  };

//Cancel deletion and close modal
  const handleStopRemovePlace = () => {
    setModalIsOpen(false);
  };

  /**
   * Add a new place to the list
   * Performs optimistic update and reverts on error
   */
  const handleSelectPlace = async (placeToAdd) => {
    // Prevent duplicates
    if (userPlaces.some(place => place.id === placeToAdd.id)) return;

    const updatedPlaces = [placeToAdd, ...userPlaces];
    setUserPlaces(updatedPlaces); // Optimistic update

    // Uncomment this block if running with Backend
    // try {
    //   await updateSelectedPlaces(updatedPlaces);
    // } catch (err) {
    //   // Rollback to previous state on failure
    //   setUserPlaces(userPlaces);
    //   setErrorUpdatingPlaces({ message: err.message || 'Failed to update the places.' });
    // }
  };

  /**
   * Confirm deletion of a place
   * Performs optimistic removal and reverts on error
   */
  const handleRemovePlace = useCallback(async () => {
    const placeIdToRemove = selectedPlace.current?.id;
    const updatedPlaces = userPlaces.filter(place => place.id !== placeIdToRemove);

    setUserPlaces(updatedPlaces); // Optimistic removal

    // Uncomment this block if running with Backend
    // try {
    //   await updateSelectedPlaces(updatedPlaces);
    // } catch (err) {
    //   // Rollback on failure
    //   setUserPlaces(userPlaces);
    //   setErrorUpdatingPlaces({ message: err.message || 'Failed to delete the place.' });
    // }
    setModalIsOpen(false);
  }, [userPlaces]);

  /**
   * Clear any error after showing error modal
   */
  const handleError = () => {
    setErrorUpdatingPlaces(null);
  };

  return (
    <>
      {/* Modal for API update/delete errors */}
      <Modal open={!!errorUpdatingPlaces} onClose={handleError}>
        {errorUpdatingPlaces && (
          <ErrorPage
            title="An Error Occurred"
            message={errorUpdatingPlaces.message}
            onConfirm={handleError}
          />
        )}
      </Modal>

      {/* Modal for confirming place deletion */}
      <Modal open={modalIsOpen} onClose={handleStopRemovePlace}>
        <DeleteConfirmation
          onCancel={handleStopRemovePlace}
          onConfirm={handleRemovePlace}
        />
      </Modal>

      <header>
        <img src={logoImg} alt="Stylized globe" />
        <h1>Travel Bucket List</h1>
        <p>Create your personal collection of places you would like to visit.</p>
      </header>

      <main>
        {/* Initial fetching error */}
        {error ? (
          <ErrorPage title="An Error Occurred" message={error.message} />
        ) : (
          <Places
            title="I'd like to visit ..."
            fallbackText="Select the places you would like to visit below."
            isLoading={isFetching}
            isLoadingText="Fetching your places..."
            places={userPlaces}
            onSelectPlace={handleStartRemovePlace}
          />
        )}

        {/* List of available places */}
        <AvailablePlaces onSelectPlace={handleSelectPlace} />
      </main>
    </>
  );
}

export default App;