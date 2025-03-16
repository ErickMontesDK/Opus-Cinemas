// netlify/functions/tickets.js
import { supabaseUrl, supabaseKey } from './config.js';
import { createClient } from '@supabase/supabase-js';

export const handler = async (event) => {
    const supabase = createClient(supabaseUrl, supabaseKey);

    try {
        const { httpMethod, queryStringParameters, body } = event;

        switch (httpMethod) {
            case 'GET': {
                const { movie_id, start_date, start_time, end_time, selectedShowtimeId } = queryStringParameters;

                console.log("query parameters: " + queryStringParameters)

                if (movie_id && start_date) {
                    console.log("movie_id", movie_id);
                    console.log("start_date", start_date)
                    let { data:showtimes_db, error } = await supabase
                        .from('showtimes')
                        .select('*')
                        .eq('movie_id', parseInt(movie_id))
                        .eq('start_date',start_date);
                        
                    console.log("showtime_list", showtimes_db)
                    if (error) {
                        
                        throw new Error("Error searching showtimes for the movie:", error);
                    } 
                    return { statusCode: 200, body: JSON.stringify(showtimes_db) };
                    
                } else if (selectedShowtimeId) {
                    let { data:showtimeData, error } = await supabase
                        .from('showtimes')
                        .select('*')
                        .eq('id', parseInt(selectedShowtimeId));
                        
                    console.log("showtime_list", showtimeData)
                    if (error) {
                        console.log("error", error.message);
                        throw new Error("Error searching showtimes for the movie:", error);
                    } 
                    return { statusCode: 200, body: JSON.stringify(showtimeData) };

                }
                        
                break;
            }
            
            case 'POST':
                const {showtime} = JSON.parse(body);
                const { data, error } = await supabase
                    .from('showtimes')
                    .insert([
                        showtime,
                    ])
                    .select()
                    
                if (error) {
                    throw new Error("Error searching showtimes for the movie:", error);
                } 
                return { statusCode: 200, body: JSON.stringify(data) };


            case 'PUT':{
                const {showtimeId, numberSeats} = JSON.parse(body);
                const { data: showtimeData, error } = await supabase
                    .from('showtimes')
                    .update({available_seats: numberSeats})
                    .eq('id', parseInt(showtimeId))
                    .select('*');
                    
                if (error) {
                    throw new Error("Error searching showtimes for the movie:", error);
                } 
                return { statusCode: 200, body: JSON.stringify(showtimeData) };

            }
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