import { mg_geolocation, mg_territory, movieglu_apikey, movieglu_auth } from "./config.js";

const headers = {
    'client': 'SDPR',
    'x-api-key': movieglu_apikey,
    'authorization': movieglu_auth,
    'territory': mg_territory,
    'api-version': 'v201',
    'geolocation': mg_geolocation, 
    'device-datetime': new Date().toISOString(), 
};

async function fetch_api(endpoint) {
    console.log(headers)
    const response = await fetch(endpoint, {headers});

    const data = await response.json();
    return data;
}

async function get_list_movies(n_movies = 1){
    const endpoint = 'https://api-gate2.movieglu.com/filmsNowShowing/?n='+n_movies
    return await fetch_api(endpoint); 
}
async function get_data_movie(movie_id){
    const endpoint = 'https://api-gate2.movieglu.com/filmDetails/?film_id='+movie_id
    return await fetch_api(endpoint); 
}

async function get_schedules_movie(movie_id, date, cinema_id=8845){
    const endpoint = `https://api-gate2.movieglu.com/cinemaShowTimes/?film_id=${movie_id}&cinema_id=${cinema_id}&date=${date}`
    return await fetch_api(endpoint); 
}

export { get_list_movies, get_data_movie, get_schedules_movie };