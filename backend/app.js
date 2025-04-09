import fs from 'node:fs/promises';
import bodyParser from 'body-parser';
import express from 'express';

const app = express();

// Serve static files (e.g., images) from the 'images' directory
app.use(express.static('images'));

// Parse incoming JSON request bodies
app.use(bodyParser.json());

/**
 * CORS Middleware:
 * Allows access from any origin and supports GET and PUT methods
 * Ensures frontend apps can communicate with this backend
 */
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*'); // Allow requests from all domains
  res.setHeader('Access-Control-Allow-Methods', 'GET, PUT'); // Allow specific HTTP methods
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type'); // Allow Content-Type header

  // Handle preflight requests without returning 404
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }

  next();
});

/**
 * GET /places
 * Reads all available places from 'places.json' and returns them
 */
app.get('/places', async (req, res) => {
  try {
    const fileContent = await fs.readFile('./data/places.json', 'utf-8');
    const placesData = JSON.parse(fileContent);
    res.status(200).json({ places: placesData });
  } catch (error) {
    console.error('Error reading places:', error);
    res.status(500).json({ message: 'Failed to load places.' });
  }
});

/**
 * GET /user-places
 * Retrieves user-selected places from 'user-places.json'
 */
app.get('/user-places', async (req, res) => {
  try {
    const fileContent = await fs.readFile('./data/user-places.json', 'utf-8');
    const userPlaces = JSON.parse(fileContent);
    res.status(200).json({ places: userPlaces });
  } catch (error) {
    console.error('Error reading user places:', error);
    res.status(500).json({ message: 'Failed to load user places.' });
  }
});

/**
 * PUT /user-places
 * Updates the user-selected places in 'user-places.json'
 */
app.put('/user-places', async (req, res) => {
  const { places } = req.body;

  if (!Array.isArray(places)) {
    return res.status(400).json({ message: 'Invalid data format. Expected an array of places.' });
  }

  try {
    await fs.writeFile('./data/user-places.json', JSON.stringify(places, null, 2));
    res.status(200).json({ message: 'User places updated!' });
  } catch (error) {
    console.error('Error writing user places:', error);
    res.status(500).json({ message: 'Failed to update user places.' });
  }
});

/**
 * Fallback Route Handler
 * Handles all non-matching routes with a 404 error response
 */
app.use((req, res) => {
  res.status(404).json({ message: '404 - Not Found' });
});

/**
 * Start the server on port 3000
 */
app.listen(3000, () => {
  console.log('Backend running on http://localhost:3000');
});
