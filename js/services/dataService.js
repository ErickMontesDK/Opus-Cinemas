import { get_available_auditorium, get_data_db, get_showtimesPerMovie_db, insert_showtime_db, get_showtime_seats} from "../api/supabase_api.js";
import { mglu_list_movies, mglu_data_movie, mglu_schedules_movie } from "../api/movieglu_api.js";  
import { convert_date_iso } from "../utils.js";

export async function getMovies(n_movies) {
    let response = await mglu_list_movies(n_movies);
    let movies = response.films;
    let movies_clean = [];

    for (let movie of movies){
        let movie_data = {
            id: movie.film_id,
            title: movie.film_name,
            poster: movie.images.poster[1].medium.film_image,
            trailer: movie.film_trailer,
            age_rating: movie.age_rating[0].rating
        };
        movies_clean.push(movie_data);

    }
    return movies_clean;
}

async function get_db_showtimes(movie_id, date){
    let db_showtimes = await get_showtimesPerMovie_db(movie_id, date);
    // console.log(db_showtimes);
    return db_showtimes;
}



const get_end_hour = (start_time, minutes) => {
    const [start_hour, start_minutes] = start_time.split(':').map(number => parseInt(number))

    let end_minutes = start_minutes + minutes;
    let end_hour = end_minutes >= 60? start_hour + Math.floor(end_minutes/60) : start_hour;
    end_hour = end_hour >=24? end_hour - 24 : end_hour;
    end_minutes = end_minutes % 60;

    return `${end_hour.toString().padStart(2, '0')}:${end_minutes.toString().padStart(2, '0')}`
}

async function insert_db_showtimes(movie_id, date, duration, showtimes){
    const showtimes_clean = [];
    for (let showing in showtimes){
        const showing_type = showing;
        const functions = showtimes[showing_type].times;

        for (let function_time of functions){            
            let function_clean = {
                start_time: function_time.start_time,
                start_date: date,
                end_time:  get_end_hour(function_time.start_time, duration),
                movie_id: parseInt(movie_id)
            };
            
            showtimes_clean.push(function_clean);
        }
    }
    return await get_available_auditorium(showtimes_clean, date);
}

export async function getMovieDetails(movie_id, date=convert_date_iso().split('T')[0]) {
    console.log(date)
    let response = await mglu_schedules_movie(movie_id, date);
    console.log(response)
    const films_list = response.films 
    let film_clean = {}
    for (let film of films_list){
        console.log(movie_id, film.film_id)
        if (film.film_id == movie_id){
            console.log("found film " + film.film_id)
            film_clean = {
                id: movie_id,
                title: film.film_name,
                age_rating: film.age_rating[0].rating,
                duration: film.duration_hrs_mins,
                synopsis: film.synopsis_long
            };
            const genres = [];
            for (let genre of film.genres) {
                genres.push(genre.genre_name);
            }
            film_clean.genres = genres;

            let showtimes = await get_db_showtimes(movie_id, date);
            if (showtimes.length == 0){
                const duration_min = film.duration_mins
                showtimes = await insert_db_showtimes(movie_id, date, duration_min, film.showings);

            } 
            film_clean.showings = showtimes;
            break;
        }
    }
    console.log(film_clean);
}

export async function get_booked_seats(showtime=30){
    const seats = await get_showtime_seats(showtime);
    console.log("seat", seats);
}

