// netlify/functions/listMovies.js
import { movieglu_headers } from './config.js';

export const handler = async (event) => {
    try {
        console.log("Event:",event)
        const { n_movies } = event.queryStringParameters;
        console.log("n_movies:", n_movies);

        console.log("headers: " + JSON.stringify(movieglu_headers));

        const endpoint = `https://api-gate2.movieglu.com/filmsNowShowing/?n=${n_movies}`;
        console.log("endpoint: " + endpoint);

        const response = await fetch(endpoint, { headers: movieglu_headers });
        console.log("response: " + JSON.stringify(response));
        if (!response.ok) {
            throw new Error(`Error: ${response.status} - ${response.statusText}`);
        }

        const data = await response.json();
        console.log("data: " + JSON.stringify(data));
        return {
            statusCode: 200,
            body: JSON.stringify(data),
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Internal Server Error', details: error.message }),
        };
    }
};