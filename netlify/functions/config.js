import { convert_date_iso } from './utils.js';

export const movieglu_headers = {
    'client': 'SDPR',
    'x-api-key': process.env.MOVIEGLU_APIKEY,
    'authorization': process.env.MOVIEGLU_AUTH,
    'territory': process.env.MOVIEGLU_TERRITORY,
    'api-version': 'v201',
    'geolocation': process.env.MOVIEGLU_GEOLOCATION,
    'device-datetime': convert_date_iso()
};

export const cinema_id_movieglu = 8845;

export const supabaseUrl = process.env.SUPABASE_URL;
export const supabaseKey = process.env.SUPABASE_KEY;
