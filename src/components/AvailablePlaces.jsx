import { useState, useEffect } from "react";

import Places from "./Places.jsx";

const places = localStorage.getItem("places");

export default function AvailablePlaces({ onSelectPlace }) {
  const [availablePlaces, setAvailablePlaces] = useState([]);

  useEffect(() => {

    fetch("http://localhost:3000/places ")
    .then((response) => {
      return response.json();
    })
    .then((resData) => {
      setAvailablePlaces(resData.places);
    });
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

  return (
    <Places
      title="Available Places"
      places={availablePlaces}
      fallbackText="No places available."
      onSelectPlace={onSelectPlace}
    />
  );
}
