// // netlify/functions/tickets.js
// import { supabaseUrl, supabaseKey } from './config.js';


// const time_limit = 24 * 60;
// const hour_options = {
//     hour12: false,
//     year: 'numeric',
//     month: '2-digit',
//     day: '2-digit',
//     hour: '2-digit',
//     minute: '2-digit',
//     second: '2-digit',
// };

// export const handler = async (event) => {
//     const supabase = createClient(supabaseUrl, supabaseKey);

//     try {
//         const { httpMethod, queryStringParameters, body } = event;

//         switch (httpMethod) {

//             //Just to get the information from our db
//             case 'GET': {
//                 const { uuid, showtime, sale_id } = queryStringParameters;
//                 const limit_time = `${new Date(Date.now() - time_limit * 60 * 1000).toLocaleString('en-US', hour_options)}`;
            
//                 //When we need reserved tickets
//                 if (uuid) {
//                     const { data, error } = await supabase
//                         .from("tickets")
//                         .select('*')
//                         .eq('uuid', uuid)
//                         .eq('status', 'reserved')
//                         .gt('reserved_at', limit_time);
            
//                     if (error) throw new Error(error.message);
//                     return { statusCode: 200, body: JSON.stringify(data) };
//                 }
            
//                 //When we need the occupied seats in the showtime
//                 if (showtime) {
//                     const { data: reserved, error: error_reserved } = await supabase
//                         .from("tickets")
//                         .select('seat_number')
//                         .eq('showtime_id', showtime)
//                         .eq('status', 'reserved')
//                         .gt('reserved_at', limit_time);
            
//                     const { data: sold, error: error_sold } = await supabase
//                         .from("tickets")
//                         .select('seat_number')
//                         .eq('showtime_id', showtime)
//                         .eq('status', 'sold');
            
//                     if (error_reserved || error_sold) throw new Error(error_reserved?.message || error_sold?.message);
                    
//                     return { statusCode: 200, body: JSON.stringify([...(reserved || []), ...(sold || [])]) };
//                 }
            
//                 //When we need the tickets from a sale
//                 if (sale_id) {
//                     const { data, error } = await supabase
//                         .from('tickets')
//                         .select('*')
//                         .eq('sales_id', sale_id);
            
//                     if (error) throw new Error(error.message);
//                     return { statusCode: 200, body: JSON.stringify(data) };
//                 }
            
//                 break;
//             }
            
//         //When... i think when we need to create a new ticket, POST is for creating things
//             case 'POST':
//                 // Creating tickets when user makes a reservation but still hasn't payed
//                 const tickets = JSON.parse(body);
//                 const { data: insertedTickets, error: insertError } = await supabase
//                     .from('tickets')
//                     .insert(tickets)
//                     .select();

//                 if (insertError) throw new Error(insertError.message);
//                 return { statusCode: 200, body: JSON.stringify(insertedTickets) };
//         //PUT  methods if for update the data already... that we already have, I think using POST works too but for convention
//         //we use PUT
//             case 'PUT':
//                 //Updating reserved tickets to sold when the payment proceeded
//                 const { uuid, sales_id, price, tickets_ids, reserved_at } = JSON.parse(body);
//                 if (tickets_ids){
//                     const { data: updatedTickets, error: updateError } = await supabase
//                         .from('tickets')
//                         .update({ price, uuid, reserved_at })
//                         .in('id', tickets_ids)
//                         .eq('status', "reserved")
//                         .eq("sales_id", null)
//                         .select();
    
//                     if (updateError) throw new Error(updateError.message);
//                     return { statusCode: 200, body: JSON.stringify(updatedTickets)};

//                 } else if (sales_id){
//                     const { data: updatedTickets, error: updateError } = await supabase
//                         .from('tickets')
//                         .update({ sales_id, status: 'sold' })
//                         .eq('uuid', uuid)
//                         .select();
    
//                     if (updateError) throw new Error(updateError.message);
//                     return { statusCode: 200, body: JSON.stringify(updatedTickets)};
//                 }

//             default:
//                 return {
//                     statusCode: 405,
//                     body: JSON.stringify({ error: 'Method Not Allowed' })
//                 };
//         }
//     } catch (error) {
//         return {
//             statusCode: 500,
//             body: JSON.stringify({ error: 'Error communicating with Supabase', details: error.message }),
//         };
//     }
// };