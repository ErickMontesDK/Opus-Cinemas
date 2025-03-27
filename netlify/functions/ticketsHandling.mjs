// netlify/functions/tickets.js
import { supabaseUrl, supabaseKey } from './config.js';
import { createClient } from '@supabase/supabase-js';

export const handler = async (event) => {
    const supabase = createClient(supabaseUrl, supabaseKey);

    try {
        const { httpMethod, queryStringParameters, body } = event;

        switch (httpMethod) {
            case 'GET': {
                const { uuid, showtime_id, saleId, limit_time } = queryStringParameters;

                if (showtime_id && limit_time) {
                    const { data: unav_seats, error } = await supabase
                        .rpc('getShowtimeSeats', {
                            p_showtime_id: showtime_id,
                            p_limit_time: limit_time,
                        });
            
                    if (error) {
                        console.log("Error: " + error.message);
                        throw new Error(error?.message);
                    }
                    
                    return { statusCode: 200, body: JSON.stringify(unav_seats) };
                
                } else if(uuid && limit_time ){
                    const { data: ticketsBookedByUser, error } = await supabase
                        .from('tickets')
                        .select('*')
                        .eq('uuid', uuid)
                        .eq('status', 'reserved')
                        .gt('reserved_at', limit_time);

                    if (error) {
                        console.log("Error: " + error.message);
                        throw new Error(error?.message);

                    }
                    return { statusCode: 200, body: JSON.stringify(ticketsBookedByUser) };

                } else if (saleId) {
                    console.log("Sale ID: " + saleId);
                    let { data: ticketsBookedBySale, error } = await supabase
                        .from('tickets')
                        .select('*')
                        .eq('sales_id', saleId);
                    
                    if (error) {
                        throw new Error("Error getting tickets by sale " + error);
                    } 
                    return { statusCode: 200, body: JSON.stringify(ticketsBookedBySale) };
                }
            
                break;
            }
            
            case 'PUT':
                const {ticketIdsToUpdate, fieldsToUpdate, ticketsUuid, saleId } = JSON.parse(body);
                if (ticketIdsToUpdate && fieldsToUpdate) {

                    const { data: updatedTicketsData, error } = await supabase
                        .from('tickets')
                        .update([
                            fieldsToUpdate
                        ])
                        .in('id',ticketIdsToUpdate)
                        .select('*');
            
                    if (error) {
                        console.log("Error: " + error.message);
                        throw new Error(error?.message);

                    }
                    return { statusCode: 200, body: JSON.stringify(updatedTicketsData) };

                } else if (ticketsUuid && saleId){
                
                    const { data: updatedTicketsSaleData, error } = await supabase
                        .from('tickets')
                        .update([
                            { sales_id: saleId, status: 'sold' }
                        ])
                        .eq('uuid', ticketsUuid)
                        .select('*');

                    if (error) {
                        console.log("Error: " + error.message);
                        throw new Error(error?.message);
                    }
                    return { statusCode: 200, body: JSON.stringify(updatedTicketsSaleData) };
                }
                
                case 'POST':
                    const { newTickets } = JSON.parse(body);
                    if ( newTickets ) {
    
                        const { data: insertedTicketsData, error } = await supabase
                            .from('tickets')
                            .insert( newTickets )
                            .select('*');
                
                        if (error) {
                            console.log("Error: " + error.message);
                            throw new Error(error?.message);
    
                        }
                        return { statusCode: 200, body: JSON.stringify(insertedTicketsData) };
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