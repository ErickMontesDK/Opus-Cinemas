import { get_available_auditorium,get_booked_tickets, get_showtimesPerMovie_db,get_data_by_id, insert_showtime_db, get_showtime_seats, insert_payment, insert_tickets, update_tickets_salesid, get_sale_by_uuid, get_tickets_by_sale} from "../api/supabase_api.js";
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

export async function register_tickets(seats, showtime_id, ticket_type_id=1, price=15, sales_id=undefined){
    let tickets_info = [];
    const uuid = crypto.randomUUID();

    for (let index in seats){
        let ticket = {
            seat_number: seats[index],
            showtime_id,
            sales_id,
            ticket_type_id,
            price,
            status: "reserved",
            reserved_at: convert_date_iso(),
            uuid:uuid 
        }
        tickets_info.push(ticket);
    }
    console.log("tickets_info", tickets_info);
    try {
        const ticket_records = await insert_tickets(tickets_info);
        sessionStorage.setItem('ticket_uuid', uuid);
        return uuid;
    } catch (error) {
        console.error(error);
        throw new Error("Error registering tickets");
    }

}

export async function get_booked_info(uuid){
    const tickets = await get_booked_tickets(uuid);
    let total_amount = 0;
    let seats_reserved = [];
    let showtime_id;

    for(let ticket of tickets){
        total_amount += ticket.price;
        seats_reserved.push(ticket.seat_number);

        if (ticket == tickets[0]){
            showtime_id = ticket.showtime_id;
            continue;
        }
    }
    if(showtime_id){
        const showtime = await get_data_by_id('showtimes',showtime_id);

        if(showtime.length > 0){
            let movie_id =showtime[0].movie_id
            let auditorium_id = showtime[0].auditorium_id

            const movie = await mglu_data_movie(movie_id);
            const auditorium = await get_data_by_id('auditoriums', auditorium_id);


            const booking_data = {
                movie: {
                    title: movie.film_name,
                    poster: movie.images.poster[1].medium.film_image,
                    age_rated_image: movie.age_rating[0].age_rating_image,
                    age_rated: movie.age_rating[0].rating
                },
                auditorium: auditorium[0].name,
                seats_reserved,
                total_amount
            }
            return booking_data;
        } 
    }

    throw new Error("Booked information was not found");
}

export async function payment_process(uuid, email, total, showtime_id){
    const sale = {
        email,
        total,
        showtime_id,
        payment_time: convert_date_iso(),
    };

    try {
        const response = await insert_payment(sale);
        const sale_record = response[0];
        const sale_id = sale_record.id;
        const sale_uuid = sale_record.uuid;
    
        const tickets_updated = await update_tickets_salesid(uuid,sale_id)
        
        console.log("sale_record", sale_record);
        console.log("tickets_updated", tickets_updated);
        sessionStorage.setItem('payment_uuid', sale_uuid);
        return sale_uuid;
    } catch (error) {
        throw new Error("Error processing payment");
        
    }
}        

export async function get_payment_confirmation(uuid){
    try {
        const response = await get_sale_by_uuid(uuid);
        const sale = response[0];
        const email = sale.email;
    
        let total_amount = sale.total;
        let seats_reserved = [];
        let showtime_id = sale.showtime_id;
    
        const tickets = await get_tickets_by_sale(sale.id);
        for(let ticket of tickets){
            seats_reserved.push(ticket.seat_number);
        }
        if(showtime_id){
            const showtime = await get_data_by_id('showtimes',showtime_id);
    
            if(showtime.length > 0){
                let movie_id =showtime[0].movie_id
                let auditorium_id = showtime[0].auditorium_id
    
                const movie = await mglu_data_movie(movie_id);
                const auditorium = await get_data_by_id('auditoriums', auditorium_id);
    
    
                const sale_data = {
                    movie: {
                        title: movie.film_name,
                        poster: movie.images.poster[1].medium.film_image,
                        age_rated_image: movie.age_rating[0].age_rating_image,
                        age_rated: movie.age_rating[0].rating
                    },
                    auditorium: auditorium[0].name,
                    seats_reserved,
                    total_amount,
                    email
                }
                return sale_data;
            } 
        
        }
        
    } catch (error) {
        throw new Error("Error at processing the payment request: " + error);
        
    }
    
}




