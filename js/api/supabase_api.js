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

export async function get_available_auditorium(showtime, date){
    console.log(showtime);
    let { data, error } = await supabase
        .from('auditoriums')
        .select('*')
        .not('id', 'in', supabase
            .from('showtimes')
            .select('auditorium_id')
            .eq('start_date', showtime.date)
            .or(`start_time.lt.${showtime.end_time}, end_time.gt.${showtime.start_time}`)
        );
    console.log(data);
};




export async function insert_showtime_db(api_showtimes) {
    
    const { data, error } = await supabase
        .from('showtimes')
        .insert([
            { name: 'example' },
        ])
        .select()
            
        if (error) {
            console.error("Error insertando datos:", error);
        } else {
            console.log("Datos insertados:", data);
        }
}


