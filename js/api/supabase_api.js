//Important data for conection comes from this import
import { supabaseUrl, supabaseKey } from '../config.js'
const supabase = window.supabase.createClient(supabaseUrl, supabaseKey);


export async function get_data_db(table_name = "testing") {
    let { data: testing, error } = await supabase
        .from(table_name)
        .select('*');

    if (error) {
        console.error("Error getting data from DB:", error);
    } else {
        return testing;
    }
}
export async function get_showtime_seats(showtime) {
    let { data: tickets, error } = await supabase
        .from("tickets")
        .select('seat_number')
        .eq('showtime_id', showtime);

    if (error) {
        console.error("Error getting data from DB:", error);
    } else {
        return tickets;
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






