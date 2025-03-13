// netlify/functions/tickets.js
import { supabaseUrl, supabaseKey } from './config.js';
import { createClient } from '@supabase/supabase-js';

const time_limit = 24 * 60;
const hour_options = {
    hour12: false,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
};

export const handler = async (event) => {
    const supabase = createClient(supabaseUrl, supabaseKey);

    try {
        const { httpMethod, queryStringParameters, body } = event;

        switch (httpMethod) {

            //Just to get the information from our db
            case 'GET': {
                const { movie_id, start_date, start_time, end_time } = queryStringParameters;
                // const limit_time = `${new Date(Date.now() - time_limit * 60 * 1000).toLocaleString('en-US', hour_options)}`;
                //When we need reserved tickets
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
                    
                // } else if (start_date && start_time && end_time) {
                //     const { data: available_aud , error: showtimesError } = await supabase
                //         .from('auditoriums')
                //         .select('*')
                //         .eq('start_date', date) 
                //         .lt('start_time', showtime.end_time)  
                //         .gt('end_time', showtime.start_time); 
                        
                //     if (showtimesError) {
                //         throw new Error("Error fetching showtimes in db", error);
                //     }
                //     return { statusCode: 200, body: JSON.stringify(unavailable_aud) };
                }
            
                //When we need the occupied seats in the showtime
            
                break;
            }
            
        //When... i think when we need to create a new ticket, POST is for creating things
            case 'POST':
                // Creating tickets when user makes a reservation but still hasn't payed
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

                // if (insertError) throw new Error(insertError.message);
                // return { statusCode: 200, body: JSON.stringify(insertedTickets) };
        //PUT  methods if for update the data already... that we already have, I think using POST works too but for convention
        //we use PUT
            case 'PUT':
                //Updating reserved tickets to sold when the payment proceeded
                const { uuid, sales_id, price, tickets_ids, reserved_at } = JSON.parse(body);
                // if (tickets_ids){
                //     const { data: updatedTickets, error: updateError } = await supabase
                //         .from('tickets')
                //         .update({ price, uuid, reserved_at })
                //         .in('id', tickets_ids)
                //         .eq('status', "reserved")
                //         .eq("sales_id", null)
                //         .select();
    
                //     if (updateError) throw new Error(updateError.message);
                //     return { statusCode: 200, body: JSON.stringify(updatedTickets)};

                // } else if (sales_id){
                //     const { data: updatedTickets, error: updateError } = await supabase
                //         .from('tickets')
                //         .update({ sales_id, status: 'sold' })
                //         .eq('uuid', uuid)
                //         .select();
    
                //     if (updateError) throw new Error(updateError.message);
                //     return { statusCode: 200, body: JSON.stringify(updatedTickets)};
                // }

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