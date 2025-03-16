// netlify/functions/listMovies.js
import { movieglu_headers, cinema_id_movieglu } from './config.js';

export const handler = async (event) => {
    try {
        const { movie_id, date } = event.queryStringParameters;

        const endpoint = `https://api-gate2.movieglu.com/cinemaShowTimes/?film_id=${movie_id}&cinema_id=${cinema_id_movieglu}&date=${date}`

        const response = await fetch(endpoint, { headers: movieglu_headers });
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