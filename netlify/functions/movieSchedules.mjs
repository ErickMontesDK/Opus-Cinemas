import { moviegluHeaders, moviegluCinemaId } from './config.js';

export const handler = async (event) => {
    try {
        const { dateTime } = event.queryStringParameters;
        
        if (dateTime){
            const date = dateTime.split('T')[0]
            const endpoint = `https://api-gate2.movieglu.com/cinemaShowTimes/?cinema_id=${moviegluCinemaId}&date=${date}`
            const headers = {...moviegluHeaders}
            
            headers["device-datetime"] = dateTime;
            const apiResponse = await fetch(endpoint, { headers: headers });

            if (!apiResponse.ok) {
                throw new Error(`Error: ${apiResponse.status} - ${apiResponse.statusText}`);
            }
    
            const schedulesData = await apiResponse.json();
            return {
                statusCode: 200,
                body: JSON.stringify(schedulesData),
            };
        } else {
            throw new Error('Missing required parameter: dateTime');
        }
    } catch (error) {
        console.log(`Error: ${error.message}`);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Internal Server Error', details: error.message }),
        };
    }
};