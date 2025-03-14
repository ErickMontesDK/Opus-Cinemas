// netlify/functions/tickets.js
import { supabaseUrl, supabaseKey } from './config.js';
import { createClient } from '@supabase/supabase-js';

export const handler = async (event) => {
    const supabase = createClient(supabaseUrl, supabaseKey);

    try {
        const { httpMethod, queryStringParameters, body } = event;

        switch (httpMethod) {
            case 'GET': {
                const { uuid, showtime_id, sale_id, limit_time } = queryStringParameters;

                if (showtime_id && limit_time) {
                    const { data: unav_seats, error } = await supabase
                        .rpc('get_showtime_seats', {
                            p_showtime_id: showtime_id,
                            p_limit_time: limit_time,
                        });
            
                    if (error) {
                        console.log("Error: " + error.message);
                        throw new Error(error?.message);

                    }
                    
                    return { statusCode: 200, body: JSON.stringify(unav_seats) };
                }
            
                break;
            }
            
            case 'PUT':

            default:
                return {
                    statusCode: 405,
                    body: JSON.stringify({ error: 'Method Not Allowed' })
                };
        }
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Error communicating with Supabase', details: error.message }),
        };
    }
};