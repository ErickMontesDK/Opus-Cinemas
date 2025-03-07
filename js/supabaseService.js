//Important data for conection comes from this import
import { supabaseUrl, supabaseKey } from './config.js'
const supabase = window.supabase.createClient(supabaseUrl, supabaseKey);


async function getData(table_name = "testing") {
    let { data: testing, error } = await supabase
        .from(table_name)
        .select('*');

    if (error) {
        console.error("Error getting data from DB:", error);
    } else {
        return testing;
    }
}

export { getData };



// async function insertData() {
    
// const { data, error } = await supabase
//     .from('testing')
//     .insert([
//     { name: 'example' },
//     ])
//     .select()
        
//     if (error) {
//         console.error("Error insertando datos:", error);
//     } else {
//         console.log("Datos insertados:", data);
//     }
// }


