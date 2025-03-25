// netlify/functions/tickets.js
import { supabaseUrl, supabaseKey } from './config.js';
import { createClient } from '@supabase/supabase-js';

export const handler = async (event) => {
    const supabase = createClient(supabaseUrl, supabaseKey);

    try {
        const { httpMethod, queryStringParameters, body } = event;

        switch (httpMethod) {
            case 'GET': {
                const { movieId, startDate, startTime, end_time, selectedShowtimeId } = queryStringParameters;

                if (movieId && startDate && startTime) {
                    let { data:showtimes_db, error } = await supabase
                        .from('showtimes')
                        .select('*')
                        .eq('movie_id', parseInt(movieId))
                        .eq('start_date',startDate)
                        .gt('start_time', startTime);
                        
                    if (error) {
                        throw new Error("Error searching showtimes for the movie:", error);
                    } 
                    return { statusCode: 200, body: JSON.stringify(showtimes_db) };
                    
                } else if (selectedShowtimeId) {
                    let { data:showtimeData, error } = await supabase
                        .from('showtimes')
                        .select('*')
                        .eq('id', parseInt(selectedShowtimeId));
                        
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
                const {selectedShowtimeId, numberTicketsBought} = JSON.parse(body);
                console.log("aqui esta la raza", selectedShowtimeId, numberTicketsBought);

                const { data: currentShowtime, error: fetchError } = await supabase
                    .from('showtimes')
                    .select('available_seats')
                    .eq('id', parseInt(selectedShowtimeId))
                    .single();

                if (fetchError) throw new Error(`Error fetching showtime: ${fetchError.message}`);
                if (!currentShowtime) throw new Error('Showtime no encontrado');

                const numberSeats = currentShowtime.available_seats - numberTicketsBought;

                const { data: showtimeData, error } = await supabase
                    .from('showtimes')
                    .update({available_seats: numberSeats})
                    .eq('id', parseInt(selectedShowtimeId))
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