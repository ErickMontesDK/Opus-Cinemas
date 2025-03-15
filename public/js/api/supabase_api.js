// //Important data for conection comes from this import
// import { supabaseUrl, supabaseKey } from '../config.js'
// const supabase = window.supabase.createClient(supabaseUrl, supabaseKey);

const time_limit = 24* 60

// export async function get_data_by_id(table_name = "testing", record_id) {
//     let { data, error } = await supabase
//         .from(table_name)
//         .select('*')
//         .eq('id', record_id);

//     if (error) {
//         throw new Error("Error getting data from DB:", error);        
//     } else {
//         return data;
//     }
// }
// export async function get_booked_tickets(uuid) {
//     const hour_options = {
//         hour12: false,
//         year: 'numeric',
//         month: '2-digit',
//         day: '2-digit',
//         hour: '2-digit',
//         minute: '2-digit',
//         second: '2-digit',
//     }
//     const limit_time = `${new Date(Date.now() - time_limit * 60 *1000).toLocaleString('en-US', hour_options)}`;
    
//     let { data, error } = await supabase
//         .from("tickets")
//         .select('*')
//         .eq('uuid', uuid)
//         .eq('status', 'reserved')
//         .gt('reserved_at', limit_time);

//     if (error) {
//         throw new Error("Error getting booked tickets from DB:", error);
//     } else {
//         return data;
//     }
// }
export async function get_showtime_seats(showtime_id) {
    const hour_options = {
        hour12: false,
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
    }
    const limit_time = `${new Date(Date.now() - time_limit * 60 *1000).toLocaleString('en-US', hour_options)}`;
    
    console.log("start fetch for supabase unavailable seats", limit_time, showtime_id)
    const response = await fetch(`/.netlify/functions/ticketsHandling?limit_time=${limit_time}&showtime_id=${showtime_id}`,
        {
            method: 'GET', 
            headers: {'Content-Type': 'application/json'},
        }
    );

    if (!response.ok) {
        throw new Error(`Error: ${response.status} - ${response.statusText}`);
    }

    const data = await response.json();
    return data;
}
    
// export async function insert_payment(sale){
//     let { data, error } = await supabase
//         .from("sales")
//         .insert([
//             sale,
//         ])
//         .select()
    
//     if (error) {
//         throw new Error("Error processing payment in db:", error);
//     } 
//     return data;
// }
    
export async function insertMultipleTicketsInDb(newTickets){
    console.log("entro a updateMultipleTicketsInDb")
    const databaseResponse = await fetch(`/.netlify/functions/ticketsHandling`,
        {
            method: 'POST', 
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ newTickets })
        },
    );

    if (!databaseResponse.ok) {
        throw new Error(`Error: ${databaseResponse.status} - ${databaseResponse.statusText}`);
    }

    const insertedTicketsData = await databaseResponse.json();
    return insertedTicketsData;
}


export async function updateMultipleTicketsInDb(ticketIdsToUpdate, fieldsToUpdate){
    console.log("entro a updateMultipleTicketsInDb")
    const databaseResponse = await fetch(`/.netlify/functions/ticketsHandling`,
        {
            method: 'PUT', 
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ ticketIdsToUpdate, fieldsToUpdate })
        },
    );

    if (!databaseResponse.ok) {
        throw new Error(`Error: ${databaseResponse.status} - ${databaseResponse.statusText}`);
    }

    const updatedTicketsData = await databaseResponse.json();
    return updatedTicketsData;
}




export async function get_showtimesPerMovie_db(movie_id, date, showing_type=null) {
    console.log("start fetch for supabase showtimes", movie_id, date)
    const response = await fetch(`/.netlify/functions/showtimesHandling?movie_id=${movie_id}&start_date=${date}`,
        {
            method: 'GET', 
            headers: {'Content-Type': 'application/json'},
        }
    );

    if (!response.ok) {
        throw new Error(`Error: ${response.status} - ${response.statusText}`);
    }

    const data = await response.json();
    return data;
}

export async function insert_showtime_db(showtime) {
    console.log("inserting showtimes in db")
    const response = await fetch(`/.netlify/functions/showtimesHandling`,
        {
            method: 'POST', 
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ showtime: showtime })
        },
    );

    if (!response.ok) {
        throw new Error(`Error: ${response.status} - ${response.statusText}`);
    }

    const data = await response.json();
    return data;
}

export async function get_available_auditorium(showtime){
    console.log("start fetch for supabase auditoriums", showtime.start_time, showtime.end_time)
    const response = await fetch(`/.netlify/functions/auditoriumsHandling?start_date=${showtime.start_date}&start_time=${showtime.start_time}&end_time=${showtime.end_time}`,
        {
            method: 'GET', 
            headers: {'Content-Type': 'application/json'},
        }
    );

    if (!response.ok) {
        throw new Error(`Error: ${response.status} - ${response.statusText}`);
    }

    const data = await response.json();
    return data;
    // const showtimes_record = [];
    // for (let showtime of showtimes){
        
        
        // const { data, error: showtimesError } = await supabase
        //                 .from('showtimes')
        //                 .select('auditorium_id')
        //                 .eq('start_date', date) 
        //                 .lt('start_time', showtime.end_time)  
        //                 .gt('end_time', showtime.start_time);
        
        // let unavailable_auditoriums = data.map(showtime => showtime.auditorium_id);
        // unavailable_auditoriums = `(${unavailable_auditoriums.join(',')})`
        
        // const { data: auditoriums, error: auditoriumsError } = await supabase
        //     .from('auditoriums')
        //     .select('*')
        //     .not('id', 'in', unavailable_auditoriums);
        
        // if (auditoriumsError) {
        //     throw new Error("Error fetching auditoriums in db", error);
        // }
        // const available_auditoriums = auditoriums.map(auditorium => auditorium.id);
        // showtime.auditorium_id = available_auditoriums[0];

        // const showtime_record = await insert_showtime_db(showtime)
        // showtimes_record.push(showtime_record);
        
    // }
    // return "webos"
    // return showtimes_record
};

// export async function update_tickets_salesid(uuid, sales_id) {
//     let { data, error } = await supabase
//         .from("tickets")
//         .update({'sales_id': sales_id, 'status':'sold'})
//         .select('*')
//         .eq('uuid', uuid);

//     if (error) {
//         throw new Error("Error updating sales_id field in ticket from db:"+error);
//     } else {
//         return data;
//     }
// }

// export async function get_sale_by_uuid(uuid) {
//     let { data, error } = await supabase
//         .from('sales')
//         .select('*')
//         .eq('uuid', uuid);
    
//     if (error) {
//         throw new Error("Error getting sale by uuid " + error);
//     } else {
//         return data;
//     }
// }

// export async function get_tickets_by_sale(sale_id) {
//     let { data, error } = await supabase
//     .from('tickets')
//     .select('*')
//     .eq('sales_id', sale_id);
    
//     if (error) {
//         throw new Error("Error getting tickets by sale " + error);
//     } else {
//         return data;
//     }
// }






