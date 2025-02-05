import { useState, useEffect } from "react";

import Places from "./Places.jsx";
import Error from "./Error.jsx";

// const places = localStorage.getItem("places");

export default function AvailablePlaces({ onSelectPlace }) {
  // managing loading-state:
  const [isFetching, setIsFetching] = useState();

  // managing data-state:
  const [availablePlaces, setAvailablePlaces] = useState([]);

  // managing errors:
  const [error, setError] = useState();

  // one way - just useEffect, without async-await:

  // useEffect(() => {
  //   fetch("http://localhost:3000/places ")
  //   .then((response) => {
  //     return response.json();
  //   })
  //   .then((resData) => {
  //     setAvailablePlaces(resData.places);
  //   });
  // }, []);

  // other way, with async-await:
  useEffect(() => {
    async function fetchPlaces() {
      setIsFetching(true);

      try {
        const response = await fetch("http://localhost:3000/places");
        const resData = await response.json();

        // managing error as response:
        // if (response.ok) -> if this is true => 200 or 300 response / if false => 400 or 500 response
        if (!response.ok) {
          throw new Error("Failed to fetch places.");
          // but when we throw the error, we will crash the application!
          // to avoid app crash, we should wrap the error-code with 'try' and then define which code should be executed instead
        }

        setAvailablePlaces(resData.places);
      } catch (error) {
        // handling the error - show error message on the user interface - we also need state for error handling
        setError({
          message:
            error.message || "Could not fetch places, please try again later.",
        });
        // we are stting this error-object (containing error-message) as value for error-state
        // we either show the error-text, or || if this is not existing, we define our own custom error-text
      }

      setIsFetching(false); // lastly, we want to end the loading state, no matter if we get data or an error.
    }
    fetchPlaces();
  }, []);

  // fetch()- method provided by browser, to send htttp-requests to some other server (used to send and fetch data)
  // fetch will return a Promise (a wrapper object around another object: an eventually received Response-object)
  // to handle all possible response, we can chain methods on the result of calling fetch:
  // f.e. then()-method, whith a function which handles what happens when we fetch wanted response-object.
  // then()-method will not be resolved instantly, but at some point in the future, once we fetch the response.
  // json()-method to extract data attached in json-format
  // .then((resData) => {}) - chaining another method, so we can work with the returned response-data.
  // response-object has this structure:
  // {
  //   "places": [18 items]    // items = different objects in this array.
  //   }
  // calling the function setAvailablePlaces and passing response-data (places-array) to it.
  // -> But with this code, we update the state, which causes the whole component to execute again, and
  // the we get an infinite loop! -> instead, wrap this code with useEffect to avoid infinite loop.
  // useEffect code will execute immediatelly after the component function execution, but only if it's dependency changed
  // if no dependencies, then it won't re-execute based on that.

  // ** Alternative way:
  // const response = await fetch("http://localhost:3000/places ").then((response) => {});
  // but AWAIT is always accompanied with ASYNC before that -> then we would need to add above that:
  // export default async function AvailablePlaces({ onSelectPlace }) {
  // -> but ASYNC is not allowed to be added to Component-functions (but only to other 'normal' functions).

  if (error) {
    // if error is truethy (if we have an error), we are showing/rendering special new component:
    return <Error title="An error occurred!" message={error.message} />;
  }

  return (
    <Places
      title="Available Places"
      places={availablePlaces}
      isLoading={isFetching}
      loadingText="Fetching place data..."
      fallbackText="No places available."
      onSelectPlace={onSelectPlace}
    />
  );
}
