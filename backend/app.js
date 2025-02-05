import fs from 'node:fs/promises';
// importing fs-modul for folders manipulation (File System) from Node.js, 
// but using the version which supports asyncronous work through 'promises'
// we use it here because our 'database' is located inside of this project, in data-fodler (in backend-folder)
// (so we have to go through our file system), and are not fetching data from some remote database.

import bodyParser from 'body-parser';
import express from 'express';
// ES-module syntax for importing modules
// express is a web framework for Node.js which enables fast creation of servera and API-s.
// - here we import main express modul to use his functionalities, such as route defining & handling HTTP requests
// body-parser is middleware for Express which enables data parsing from the body of HTTP request (req.body).
// - used when we need to handle data sent in POST or PUT requests, like JSON data or data from HTML forms.


const app = express();
// initialising new Express app -> creates an instance of express-app / creates an Express server, 
// so later we can use methods like app.get / app.use / app.post / app-listen (starting server)...

app.use(express.static('images'));
app.use(bodyParser.json());

// CORS

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*'); // allow all domains
  res.setHeader('Access-Control-Allow-Methods', 'GET, PUT');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  next();
});

app.get('/places', async (req, res) => {
  const fileContent = await fs.readFile('./data/places.json');
  // places.json is here acctually a local file, inside our data-fodler (in backend-folder), but
  // it could also be an outside place / outer database, whose endpoints for data fetching are known to us.

  const placesData = JSON.parse(fileContent);

  res.status(200).json({ places: placesData });
});

app.get('/user-places', async (req, res) => {
  const fileContent = await fs.readFile('./data/user-places.json');

  const places = JSON.parse(fileContent);

  res.status(200).json({ places });
});

app.put('/user-places', async (req, res) => {
  const places = req.body.places;

  await fs.writeFile('./data/user-places.json', JSON.stringify(places));

  res.status(200).json({ message: 'User places updated!' });
});

// 404
app.use((req, res, next) => {
  if (req.method === 'OPTIONS') {
    return next();
  }
  res.status(404).json({ message: '404 - Not Found' });
});

// app.listen(3000);



app.listen(3000, () => {
    console.log(`🚀 Server started on port http://localhost:3000`);
});


// RESTful API = Representational State Transfer - is a server, but we don't need full html as response, 
// we just need to send data back and forth.
// RESTful APIs = stateless backends / servers. They don't care about individual client.
// We can have different endpoints (f.e. /users, /places, /products etc), which can accept some methods 
// / types of requests (f.e. get, post, delete, patch) but not all methods. 
// AYAX-request (comes from the client) = asyncronous HTTP-request

// What makes an API / server RESTful?
// - client-server architecture (frontend vs. backend separation)
// - stateless - API is not storing any client content, like session (not handling sessions)
// - cacheability - responses must define themselves as cacheable or non-cacheable
// - layered system - client connects to a server, but server doesn't have to be our final API 
// (there could be some intermediate servers in-between)
// - uniform interface - recources are identified in requests, data can be decaouled from database shema
// - code on demand - executable code can be trasferred