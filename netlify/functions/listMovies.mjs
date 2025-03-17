import { moviegluHeaders } from './config.js';

export const handler = async (event) => {
    try {
        const { numberOfMovies } = event.queryStringParameters;

        if (numberOfMovies){
            const endpoint = `https://api-gate2.movieglu.com/filmsNowShowing/?n=${numberOfMovies}`;
            const apiResponse = await fetch(endpoint, { headers: moviegluHeaders });

            if (!apiResponse.ok) {
                throw new Error(`Error: ${apiResponse.status} - ${apiResponse.statusText}`);
            }
            
            const movieData = await apiResponse.json();              
            return {
                statusCode: 200,
                body: JSON.stringify(movieData),
            };
        } else {
            throw new Error('Missing required parameter: numberOfMovies');
        }
    } catch (error) {
        console.log('Error: ' + error.message);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Internal Server Error', details: error.message }),
        };
    }
};