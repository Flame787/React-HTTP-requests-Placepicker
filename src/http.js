// optional, to separate the utility function fetchAvailablePlaces which sends http-request:

export async function fetchAvailablePlaces() {
  const response = await fetch("http://localhost:3000/places");
  const resData = await response.json();

  // managing error as response:
  // if (response.ok) -> if this is true => 200 or 300 response / if false => 400 or 500 response
  if (!response.ok) {
    throw new Error("Failed to fetch places.");
    // but when we throw the error, we will crash the application!
    // to avoid app crash, we should wrap the error-code with 'try' and then define which code should be executed instead
  }

  return resData.places;
}

// to enable fetching data about already added places (at next reload):
export async function fetchUserPlaces() {
  const response = await fetch("http://localhost:3000/user-places");
  const resData = await response.json();

  if (!response.ok) {
    throw new Error("Failed to fetch user places.");
  }

  return resData.places;
}

// sending our updated state (changed data) to the backend - new function for updating user's places:
export async function updateUserPlaces(places) {
  // we are expecting to get an array of places, which should be sent to backend
  const response = await fetch("http://localhost:3000/user-places", {
    // to change the method from usual 'get' method (if no 2nd argument):
    // we are adding a 2nd argument = a configuration object
    method: "PUT",
    // body: JSON.stringify({places: places}),
    body: JSON.stringify({ places }), // shortcut {places}, if key and value have same names: {places: places}
    // {places} must be wrapped with {}, & added a key 'places', & places added as a value.
    // -> user-places.json file is not empty anymore, it gets populated with locations the user has picked:
    // f.e. [{"id":"p7","title":"Northern Lights","image":{"src":"northern-lights.jpg","alt":"Dazzling display of the Northern Lights in a starry sky."},"lat":64.9631,"lon":-19.0208},{"id":"p10","title":"Parisian Streets","image":{"src":"parisian-streets.jpg","alt":"Charming streets of Paris with historic buildings and cafes."},"lat":48.8566,"lon":2.3522},{"id":"p1","title":"Forest Waterfall","image":{"src":"forest-waterfall.jpg","alt":"A tranquil forest with a cascading waterfall amidst greenery."},"lat":44.5588,"lon":-80.344}]
    headers: {
      "Content-type": "application/json",
      // informs backend that the data attached to this put-request will be in json-format
    },
  });

  const resData = await response.json();

  // error handling:
  if (!response.ok) {
    throw new Error("Failed to update user data.");
  }

  return resData.message;
}
