// netlify/functions/tickets.js
import { supabaseUrl, supabaseKey } from './config.js';
import { createClient } from '@supabase/supabase-js';


export const handler = async (event) => {
    const supabase = createClient(supabaseUrl, supabaseKey);

    try {
        const { httpMethod, queryStringParameters, body } = event;

        switch (httpMethod) {
            case 'GET': {
                const { start_date, start_time, end_time } = queryStringParameters;
                if (start_date) {
                    
                    const { data: auditoriums, error } = await supabase
                        .rpc('get_available_auditoriums', {
                            p_start_date: start_date,
                            p_start_time: start_time,
                            p_end_time: end_time,
                        });
                    if (error) {
                        console.log(error.message)
                        throw new Error("Error searching showtimes for the movie:", error);
                    } 
                    return { statusCode: 200, body: JSON.stringify(auditoriums) };
                    
                }
                        
                break;
            }

            case 'POST':
                const {movie_id, date, duration_min, film} = JSON.parse(body);

            case 'PUT':
                const { uuid, sales_id, price, tickets_ids, reserved_at } = JSON.parse(body);


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