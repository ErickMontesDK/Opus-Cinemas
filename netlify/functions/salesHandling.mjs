// netlify/functions/tickets.js
import { supabaseUrl, supabaseKey } from './config.js';
import { createClient } from '@supabase/supabase-js';


export const handler = async (event) => {
    console.log("hello i'm the handler")
    const supabase = createClient(supabaseUrl, supabaseKey);

    try {
        const { httpMethod, queryStringParameters, body } = event;

        switch (httpMethod) {
            case 'GET':{
                const { saleUuid } = queryStringParameters;
                let { data: saleData , error } = await supabase
                    .from('sales')
                    .select('*')
                    .eq('uuid', saleUuid);

                if (error) {
                    console.log("Error: " + error.message);
                    throw new Error(error?.message);

                }
                return { statusCode: 200, body: JSON.stringify(saleData) };

            }
            case 'POST':
                const {saleData} = JSON.parse(body);
                console.log("saleData",saleData);
                if ( saleData ) {
    
                    const { data: insertSaleData, error } = await supabase
                        .from('sales')
                        .insert( [saleData] )
                        .select('*');
            
                    if (error) {
                        console.log("Error: " + error.message);
                        throw new Error(error?.message);

                    }
                    return { statusCode: 200, body: JSON.stringify(insertSaleData) };
                } else {
                    throw new Error("asds");
                    
                }
                break;
            // case 'PUT':
            //     const { uuid, sales_id, price, tickets_ids, reserved_at } = JSON.parse(body);

            //     break;
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