//Important data for conection comes from this import
import { supabaseUrl, supabaseKey } from './config.js'
const supabase = window.supabase.createClient(supabaseUrl, supabaseKey);


async function getData() {
    let { data: testing, error } = await supabase
        .from('testing')
        .select('*');

    if (error) {
        console.error("Error obteniendo datos:", error);
    } else {
        console.log("Datos obtenidos:", testing);
    }
}

await getData();


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


