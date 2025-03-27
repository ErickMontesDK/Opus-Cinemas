import { convertDateIso } from './utils.js';

export const moviegluHeaders = {
    'client': 'SDPR',
    'x-api-key': process.env.MOVIEGLU_APIKEY,
    'authorization': process.env.MOVIEGLU_AUTH,
    'territory': process.env.MOVIEGLU_TERRITORY,
    'api-version': 'v201',
    'geolocation': process.env.MOVIEGLU_GEOLOCATION,
    'device-datetime': convertDateIso()
};

export const moviegluCinemaId = 8845;

export const supabaseUrl = process.env.SUPABASE_URL;
export const supabaseKey = process.env.SUPABASE_KEY;

export const SERVICE_ID = process.env.EMAILJS_SERVICE_ID;
export const TEMPLATE_ID = process.env.EMAILJS_TEMPLATE_ID;
export const EMAILJS_PUBLIC_KEY = process.env.EMAILJS_PUBLIC_KEY;
export const EMAILJS_PRIVATE_KEY = process.env.EMAILJS_PRIVATE_KEY;
