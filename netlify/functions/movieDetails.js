import { moviegluHeaders } from './config.js';

export const handler = async (event) => {
    try {
        const { movieId } = event.queryStringParameters;
        
        if (movieId){
            const endpoint = `https://api-gate2.movieglu.com/filmDetails/?film_id=${movieId}`
            
            const apiResponse = await fetch(endpoint, { headers: moviegluHeaders });

            if (!apiResponse.ok) {
                throw new Error(`Error: ${apiResponse.status} - ${apiResponse.statusText}`);
            }
    
            const schedulesData = await apiResponse.json();
            return {
                statusCode: 200,
                body: JSON.stringify(schedulesData),
            };
        } else {
            throw new Error('Missing required parameter: movieId');
        }
    } catch (error) {
        console.log(`Error: ${error.message}`);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Internal Server Error', details: error.message }),
        };
    }
};