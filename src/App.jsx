import { useRef, useState, useCallback, useEffect } from "react";

import Places from "./components/Places.jsx";
import Modal from "./components/Modal.jsx";
import Error from "./components/Error.jsx";
import DeleteConfirmation from "./components/DeleteConfirmation.jsx";
import logoImg from "./assets/logo.png";
import AvailablePlaces from "./components/AvailablePlaces.jsx";
import { fetchUserPlaces, updateUserPlaces } from "./http.js";

function App() {
  const selectedPlace = useRef();

  const [userPlaces, setUserPlaces] = useState([]);

  // copied from AvailablePlces - same 2 states:
  // managing loading-state:
  const [isFetching, setIsFetching] = useState(false);
  // managing errors:
  const [error, setError] = useState();

  const [errorUpdatingPlaces, setErrorUpdatingPlaces] = useState();

  const [modalIsOpen, setModalIsOpen] = useState(false);

  // useEffect:
  useEffect(() => {
    async function fetchPlaces() {
      setIsFetching(true);
      try {
        const places = await fetchUserPlaces();
        setUserPlaces(places);
      } catch (error) {
        setError({
          message:
            error.message || "Failed to fetch already picked user places."
        });
      }
      setIsFetching(false);
    }
    fetchPlaces();
  }, []);

  function handleStartRemovePlace(place) {
    setModalIsOpen(true);
    selectedPlace.current = place;
  }

  function handleStopRemovePlace() {
    setModalIsOpen(false);
  }

  // optimistic updating: updating my local state before sending the request and before waiting for response
  // - sometimes provides better user experience (instead of a loader-animation, there is immediatelly some constent on the page)
  async function handleSelectPlace(selectedPlace) {
    setUserPlaces((prevPickedPlaces) => {
      if (!prevPickedPlaces) {
        prevPickedPlaces = [];
      }
      if (prevPickedPlaces.some((place) => place.id === selectedPlace.id)) {
        return prevPickedPlaces;
      }
      return [selectedPlace, ...prevPickedPlaces];
    });

    try {
      // sending our updated state (changed data) to the backend: fetch() - in http.js helper-file:
      await updateUserPlaces([selectedPlace, ...userPlaces]);
      // adding newly seleceted place infront of old saved places -> sending updated state of data to our backend
      // this operation takes some time, so we can add 'await', but then handleSelectPlace-function should have 'async'
    } catch (error) {
      setUserPlaces(userPlaces);
      // if it comes to error (updating user-palces failes), just set user-palces to already existing user-places
      // (we rollback the change)
      setErrorUpdatingPlaces({
        message: error.message || "Failed to update places.",
      });
    }
  }

  const handleRemovePlace = useCallback(
    async function handleRemovePlace() {
      setUserPlaces((prevPickedPlaces) =>
        prevPickedPlaces.filter(
          (place) => place.id !== selectedPlace.current.id
        )
      );

      try {
        // optimistic updating - 1st updating the state, then sending http-request
        await updateUserPlaces(
          userPlaces.filter((place) => place.id !== selectedPlace.current.id)
        );
      } catch (error) {
        setUserPlaces(userPlaces); // rollback the change, set user-places to the old user-places, before update
        setErrorUpdatingPlaces({
          message: error.message || "Failed to delete place."
        });
      }

      setModalIsOpen(false);
    },
    [userPlaces]
  );
  // added as dependancy because we filter it in previous code - if changed, then this function needs to be recreated
  // then this function sends new data to the backend

  function handleError() {
    setErrorUpdatingPlaces(null); // clearing the error back to null
  }

  return (
    <>
      <Modal open={errorUpdatingPlaces} onClose={handleError}>
        {/* onClose - by pressing the Esc key */}
        {errorUpdatingPlaces && (
          <Error // conditionally, only if errorUpdatingPlaces is truethy, Error will show up
            title="An error occured!"
            message={errorUpdatingPlaces.message}
            onConfirm={handleError} // when user clicks to close the modal, error is cleaned, dissapears
          />
        )}
      </Modal>

      <Modal open={modalIsOpen} onClose={handleStopRemovePlace}>
        <DeleteConfirmation
          onCancel={handleStopRemovePlace}
          onConfirm={handleRemovePlace}
        />
      </Modal>

      <header>
        <img src={logoImg} alt="Stylized globe" />
        <h1>PlacePicker</h1>
        <p>
          Create your personal collection of places you would like to visit or
          you have visited.
        </p>
      </header>
      <main>
        {error && <Error title="An error occurred!" message={error.message} />}
        {!error && (
          <Places
            title="I'd like to visit ..."
            fallbackText="Select the places you would like to visit below."
            isLoading={isFetching}
            loadingText="Fetching your places..."
            places={userPlaces}
            onSelectPlace={handleStartRemovePlace}
          />
        )}

        <AvailablePlaces onSelectPlace={handleSelectPlace} />
        {/* event-listener function, triggered whenever we select a place */}
      </main>
    </>
  );
}

export default App;

// BACKEND:
// 1. navigate to the folder 'backend' (cd backend), open git bash terminal there
// 2. npm install - run command inside of the backend terminal, because backend has special dependencies
// (like body-parser)
// 3. node app.js - run this to start local backend server on port 3000 (different from frontend server)
// 4. on http://localhost:3000  there will be a backend server running (at begin, it has no content, but runs)
// although main endpoint is empty, there are different endpoints like http://localhost:3000/places filled with data

// FRONTEND:
// 5. navigate to the main project folder, open another git bash terminal there (2nd one)
// 6. npm install  to install all project dependencies (for frontend)
// 7. npm run dev - run this to start local frontend server on port 5173 (different port for frontend and backend)
// 8. on http://localhost:5173/ there will be a frontend server running.

// ** keep both processes (front- & back-end running while coding)
