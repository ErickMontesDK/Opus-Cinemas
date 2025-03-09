//Important data for conection comes from this import
import { supabaseUrl, supabaseKey } from '../config.js'
const supabase = window.supabase.createClient(supabaseUrl, supabaseKey);

const time_limit = 24* 60

export async function get_data_by_id(table_name = "testing", record_id) {
    let { data, error } = await supabase
        .from(table_name)
        .select('*')
        .eq('id', record_id);

    if (error) {
        console.error("Error getting data from DB:", error);
    } else {
        return data;
    }
}
export async function get_booked_tickets(uuid) {
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
    
    let { data, error } = await supabase
        .from("tickets")
        .select('*')
        .eq('uuid', uuid)
        .eq('status', 'reserved')
        .gt('reserved_at', limit_time);

    if (error) {
        console.error("Error getting data from DB:", error);
    } else {
        return data;
    }
}
export async function get_showtime_seats(showtime) {
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
    
    let { data:reserved, error_reserved } = await supabase
        .from("tickets")
        .select('seat_number')
        .eq('showtime_id', showtime)
        .eq('status', 'reserved')
        .gt('reserved_at', limit_time);

    let { data: sold, error_sold } = await supabase
        .from("tickets")
        .select('seat_number')
        .eq('showtime_id', showtime)
        .eq('status','sold');

    if (error_sold || error_reserved) {
        console.error("Error getting data from DB:", error);
    } else {
        const allTickets = [...(reserved || []), ...(sold || [])];
        return allTickets;
    }
}

export async function insert_payment(sale){
    let { data, error } = await supabase
    .from("sales")
    .insert([
        sale,
    ])
    .select()
        
    if (error) {
        console.error("Error insertando datos:", error);
        return;
    } 
    return data;
}

export async function insert_tickets(tickets){
    let { data, error } = await supabase
    .from("tickets")
    .insert(tickets)
    .select()
        
    if (error) {
        console.error("Error insertando datos:", error);
        return;
    } 
    return data;
}





export async function get_showtimesPerMovie_db(id, date, showing_type=null) {
    let { data, error } = await supabase
        .from('showtimes')
        .select('*')
        .eq('movie_id', parseInt(id))
        .eq('start_date',date);


    if (error) {
        console.error("Error getting data from DB:", error);
    } else {
        return data;
    }
}

export async function insert_showtime_db(showtime) {
    const { data, error } = await supabase
        .from('showtimes')
        .insert([
            showtime,
        ])
        .select()
            
        if (error) {
            console.error("Error insertando datos:", error);
            return;
        } 
        return data;
}

export async function get_available_auditorium(showtimes, date){
    const showtimes_record = [];
    for (let showtime of showtimes){
        
        const { data, error: showtimesError } = await supabase
            .from('showtimes')
            .select('auditorium_id')
            .eq('start_date', date) 
            .lt('start_time', showtime.end_time)  
            .gt('end_time', showtime.start_time); 
    
        if (showtimesError) {
            console.error('Error fetching showtimes:', showtimesError);
            return;
        }
        let unavailable_auditoriums = data.map(showtime => showtime.auditorium_id);
        unavailable_auditoriums = `(${unavailable_auditoriums.join(',')})`

        const { data: auditoriums, error: auditoriumsError } = await supabase
            .from('auditoriums')
            .select('*')
            .not('id', 'in', unavailable_auditoriums);

        if (auditoriumsError) {
            console.error('Error fetching auditoriums:', auditoriumsError);
            return;
        }
        const available_auditoriums = auditoriums.map(auditorium => auditorium.id);
        console.log("available auditors:", available_auditoriums);
        showtime.auditorium_id = available_auditoriums[0];

        const showtime_record = await insert_showtime_db(showtime)
        showtimes_record.push(showtime_record);
        
    }
    return showtimes_record
};

export async function update_tickets_salesid(uuid, sales_id) {
    let { data, error } = await supabase
        .from("tickets")
        .update({'sales_id': sales_id, 'status':'sold'})
        .select('*')
        .eq('uuid', uuid);

    if (error) {
        console.error("Error getting data from DB:", error);
    } else {
        return data;
    }
}

export async function get_sale_by_uuid(uuid) {
    let { data, error } = await supabase
        .from('sales')
        .select('*')
        .eq('uuid', uuid);

    if (error) {
        console.error("Error getting data from DB:", error);
    } else {
        return data;
    }
}

export async function get_tickets_by_sale(sale_id) {
    let { data, error } = await supabase
        .from('tickets')
        .select('*')
        .eq('sales_id', sale_id);

    if (error) {
        console.error("Error getting data from DB:", error);
    } else {
        return data;
    }
}






