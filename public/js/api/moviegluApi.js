async function fetchFromApi(endpoint) {
    try {
        const response = await fetch(endpoint);
        
        if (!response.ok){
            throw new Error(`Netlify Server Error: ${response.status} - ${response.statusText}`);
        }
        const data = await response.json();
        return data;
        
    } catch (error) {
        console.log('Error: ' + error.message);
        throw error
    }

}

export async function fetchMoviesFromAPI(numberOfMovies){
    const endpoint = `/.netlify/functions/listMovies?numberOfMovies=${numberOfMovies}`
    return await fetchFromApi(endpoint);
}
export async function fetchMovieInformationFromAPI(movieId=7772){
    const endpoint = `/.netlify/functions/movieDetails?movieId=${movieId}`
    return await fetchFromApi(endpoint);
}

async function mglu_schedules_movie(movie_id=7772, date){
    const response = await fetch(`/.netlify/functions/movieDetails?movie_id=${movie_id}&date=${date}`)
    return await response.json();
    // return await fetchFromApi(endpoint);
}
export async function fetchMoviesSchedulesFromAPI(dateTime){
    const endpoint = `/.netlify/functions/movieSchedules?dateTime=${dateTime}`
    return await fetchFromApi(endpoint);
}

export { mglu_schedules_movie };