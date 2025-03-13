// netlify/functions/listMovies.js
import { movieglu_headers, cinema_id_movieglu } from './config.js';

export const handler = async (event) => {
    try {
        console.log("Event:",event)
        const { movie_id } = event.queryStringParameters;
        const { date } = event.queryStringParameters;
        console.log("movie_id:", movie_id);
        console.log("date:", date);

        console.log("headers: " + JSON.stringify(movieglu_headers));

        const endpoint = `https://api-gate2.movieglu.com/cinemaShowTimes/?film_id=${movie_id}&cinema_id=${cinema_id_movieglu}&date=${date}`
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