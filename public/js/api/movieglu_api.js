// async function fetch_api(endpoint) {
//     const response = await fetch(endpoint, {headers});
//     const data = await response.json();

//     return data;
// }

async function mglu_list_movies(n_movies = 1){
    const response = await fetch(`/.netlify/functions/listMovies?n_movies=${n_movies}`)
    return await response.json();
}
async function mglu_data_movie(movie_id=7772){
    const endpoint = 'https://api-gate2.movieglu.com/filmDetails/?film_id='+movie_id
}

async function mglu_schedules_movie(movie_id=7772, date){
    const response = await fetch(`/.netlify/functions/movieDetails?movie_id=${movie_id}&date=${date}`)
    return await response.json();
}

export { mglu_list_movies, mglu_data_movie, mglu_schedules_movie };