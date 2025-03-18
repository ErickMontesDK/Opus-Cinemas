// import { ,get_booked_tickets, get_showtimesPerMovie_db,get_data_by_id, get_showtime_seats, insert_payment, insert_tickets, update_tickets_salesid, get_sale_by_uuid, get_tickets_by_sale} from "../api/supabase_api.js";
import {get_booked_tickets, get_tickets_by_sale, get_sale_by_uuid, insert_payment, getAuditoriumInDbById, getShowtimeDataInDb, getShowtimesPerMovieDb, getBookedTicketsFromDb, insertShowtimeRecordDb, updateMultipleTicketsInDb, insertMultipleTicketsInDb, updateTicketsBySale, updateAvailableSeatsShowtime, getAvailableAuditorium } from "../api/supabaseApi.js";
import { fetchMovieInformationFromAPI, fetchMoviesFromAPI, fetchMoviesSchedulesFromAPI } from "../api/moviegluApi.js";  
import { adjustedDatetime, convert_date_iso } from "../utils.js";

function getReleaseStatus(currentDate, movieReleaseDate){
    const releaseDate = new Date(movieReleaseDate);
    const today = new Date(currentDate);
    const daysOfDifference = Math.ceil((today - releaseDate)/(1000*60*60*24));

    if (daysOfDifference < 1) {
        return "preSale"; 
    } else if (daysOfDifference < 15) {
        return "newRelease";
    } else {
        return "regular"; 
    }
}

export async function getMovies(numberOfMovies, date=convert_date_iso().split("T")[0]) {
    const dateTime = date+"T05:00:00"
    const moviesListResponse  = await fetchMoviesFromAPI(numberOfMovies);
    const schedulesResponse  = await fetchMoviesSchedulesFromAPI(dateTime);

    let moviesList = moviesListResponse.films;
    let moviesSchedules = schedulesResponse.films;

    const cleanedMovies = moviesList.map(movie =>{
        const movieSchedulesData = moviesSchedules.find(movieData => movieData.film_id == movie.film_id);
        const releaseStatus = getReleaseStatus(date, movie.release_dates[0].release_date)
        
        let movieGenres = [];
        if (movieSchedulesData){
            movieGenres = movieSchedulesData.genres.map(genre => genre.genre_name)
        }

        return {
            id: movie.film_id,
            title: movie.film_name,
            poster: movie.images.poster[1].medium.film_image,
            trailer: movie.film_trailer,
            ageRating: movie.age_rating[0].rating,
            ageAdvisory: movie.age_rating[0].age_advisory,
            genres: movieGenres,
            releaseStatus
        }
    });
    return cleanedMovies;
}


async function consultMovieSchedules(movieId, datetime, movieDurationInMin){
    try {
        const [date, time] = datetime.split("T");
        let showtimes = await getShowtimesPerMovieDb(movieId, date, time);
        
        if (showtimes.length == 0){
            let apiSchedulesResponse = await fetchMoviesSchedulesFromAPI(datetime);

            if (apiSchedulesResponse){
                const movieSchedulesResponse = apiSchedulesResponse.films.find(film => film.film_id == movieId )

                if(movieSchedulesResponse?.showings){
                    const schedulesInDate = movieSchedulesResponse.showings ? movieSchedulesResponse.showings : []; 
                    console.log("showtimes in API", schedulesInDate)
                    showtimes = await insertShowtimesInDb(movieId, date, movieDurationInMin, schedulesInDate);
                }
            }            
        } 
        return showtimes;
    } catch (error) {
        console.log("Error consulting schedules", error);
        throw new Error("Error consulting schedules: " + error.message);
    }
}


export async function getMovieDetails(movieId, datetime=convert_date_iso()) {
    try {
        console.log("getMovieDetails", movieId);
        let responseMovieDetails = await fetchMovieInformationFromAPI(movieId);
        const durationInMs = responseMovieDetails.duration_mins;
        
        const cleanedFilmData = {
            id: movieId,
            title: responseMovieDetails.film_name,
            age_rating: responseMovieDetails.age_rating?.[0]?.rating || null,
            age_advisory: responseMovieDetails.age_rating?.[0]?.age_advisory || null,
            duration: durationInMs,
            synopsis: responseMovieDetails.synopsis_long,
            poster : responseMovieDetails.images?.poster?.['1']?.medium?.film_image || null,
            trailer: responseMovieDetails.trailers?.high?.[0]?.film_trailer || null,
            director: responseMovieDetails?.directors?.[0]?.director_name || null,
            genres: responseMovieDetails?.genres?.map(genre => genre.genre_name) || []
        }        
        const todaysDate = datetime
        const tomorrowsData = adjustedDatetime(datetime, 1);
        const afterTomorrowsData = adjustedDatetime(datetime, 2);

        console.log(todaysDate, tomorrowsData, afterTomorrowsData)

        const [todaySchedules, tomorrowSchedules, afterTomorrowsSchedules] = await Promise.all([
            consultMovieSchedules(movieId, todaysDate, cleanedFilmData.duration),
            consultMovieSchedules(movieId, tomorrowsData, cleanedFilmData.duration),
            consultMovieSchedules(movieId, afterTomorrowsData, cleanedFilmData.duration),
        ]);

        cleanedFilmData.showings = {
            today: todaySchedules,
            tomorrow: tomorrowSchedules,
            afterTomorrow: afterTomorrowsSchedules,
        }
    
        return cleanedFilmData;
    } catch (error) {
        console.log("Error consulting schedules", error);
        throw new Error("Error consulting schedules: " + error.message);
    }
}


const getEndFunctionHour = (start_time, minutes) => {
    const [start_hour, start_minutes] = start_time.split(':').map(number => parseInt(number))

    let end_minutes = start_minutes + minutes;
    let end_hour = end_minutes >= 60? start_hour + Math.floor(end_minutes/60) : start_hour;
    end_hour = end_hour >=24? end_hour - 24 : end_hour;
    end_minutes = end_minutes % 60;

    return `${end_hour.toString().padStart(2, '0')}:${end_minutes.toString().padStart(2, '0')}`
}

async function insertShowtimesInDb(movieId, date, duration, showtimes){
    const showtimesClean = [];

    for (let showing in showtimes){
        const showingType = showing;
        const showtimesHours = showtimes[showingType].times;

        for (let showtimeHour of showtimesHours){            
            let showtimeDbFields = {
                start_time: showtimeHour.start_time,
                start_date: date,
                end_time:  getEndFunctionHour(showtimeHour.start_time, duration),
                movie_id: parseInt(movieId),
                available_seats: 91
            };
            const auditoriumsAvailable = await getAvailableAuditorium(showtimeDbFields);
            showtimeDbFields.auditorium_id = auditoriumsAvailable[0].id;

            const insertShowtimeResponse = await insertShowtimeRecordDb(showtimeDbFields);
            const showtimeRecord = insertShowtimeResponse[0];
            console.log("showtime inserted: ", showtimeRecord);
            showtimesClean.push(showtimeRecord);
        }
    }
    return showtimesClean;
}





export async function getBookedSeats(showtimeId=30){
    console.log("getting booked seats for showtime:", showtimeId)
    const seats = await getBookedTicketsFromDb(showtimeId);
    return seats;
}

export async function registerTickets(seats, showtimeId, ticketTypeId=1, price=15){
    try {
        if (seats.length > 0 && !Array.isArray(seats) && showtimeId){
            const ticketUuid = crypto.randomUUID();
            const commonTicketData = {
                sales_id: null,
                ticket_type_id: ticketTypeId,
                price,
                status: "reserved",
                reserved_at: convert_date_iso(),
                uuid: ticketUuid
            };
            let newTickets = [];
            let expiredReservationIds = [];
    
            seats.forEach(seat => {
                if (seat.id !== null){
                    expiredReservationIds.push(seat.id) 
                } else {
                    const customTicketData = {...commonTicketData};
                    customTicketData.seat_number = seat.seat_number;
                    customTicketData.showtime_id = showtimeId;
                    newTickets.push(customTicketData);
                }
            });
            
            const [updatedTicketsData, insertedTicketsData] =await Promise.all([
                updateMultipleTicketsInDb(expiredReservationIds, commonTicketData),
                insertMultipleTicketsInDb(newTickets)
            ])         
            console.log("updatedTicketsData", updatedTicketsData);
            console.log("insertedTicketsData", insertedTicketsData);

            
            if(updatedTicketsData.length < 0 && updatedTicketsData.length < 0){
                throw new Error("No tickets were booked");
            } else {
                sessionStorage.setItem('ticket_uuid', ticketUuid);
                return ticketUuid;
            }
        } else {
            throw new Error("Invalid input for registering tickets");
        }
        
    } catch (error) {
        console.log("error registering tickets", error.message);
        throw new Error("Error registering tickets: " + error.message);
    }
}

export async function get_booked_info(uuid){
    const tickets = await get_booked_tickets(uuid);
    console.log("Booked tickets", tickets);
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
        const showtime = await getShowtimeDataInDb(showtime_id);

        if(showtime.length > 0){
            let movie_id =showtime[0].movie_id
            let auditorium_id = showtime[0].auditorium_id
            const available_seats = showtime[0].available_seats

            const movie = await fetchMovieInformationFromAPI(movie_id);
            const auditorium = await getAuditoriumInDbById(auditorium_id);

            console.log("keep rolling",showtime, movie_id, auditorium_id, movie)
            const booking_data = {
                movie: {
                    title: movie.film_name,
                    poster: movie.images.poster[1].medium.film_image,
                    age_rated_image: movie.age_rating[0].age_rating_image,
                    age_rated: movie.age_rating[0].rating
                },
                auditorium: auditorium[0].name,
                seats_reserved,
                total_amount,
                available_seats
            }
            return booking_data;
        } 
    }

    throw new Error("Booked information was not found");
}

export async function payment_process(uuid, email, total, showtime_id, available_seats){
    const sale = {
        email,
        total,
        showtime_id,
        payment_time: convert_date_iso(),
    };

    try {
        const response = await insert_payment(sale);
        console.log(response);
        const sale_record = response[0];
        const sale_id = sale_record.id;
        const sale_uuid = sale_record.uuid;
    
        const tickets_updated = await updateTicketsBySale(uuid,sale_id)
        console.log(tickets_updated);
        console.log("sale_record", sale_record);
        available_seats = available_seats - tickets_updated.length;
        // console.log("tickets_updated", tickets_updated);
        // sessionStorage.setItem('payment_uuid', sale_uuid);
        const showtimeUpdated = updateAvailableSeatsShowtime(showtime_id, available_seats)
        console.log(showtimeUpdated);
        return sale_uuid;
    } catch (error) {
        console.error(error.message);
        throw new Error("Error processing payment");
        
    }
}        

export async function get_payment_confirmation(uuid){
    try {
        const response = await get_sale_by_uuid(uuid);
        console.log("sale",response);
        const sale = response[0];
        const email = sale.email;
    
        let total_amount = sale.total;
        let seats_reserved = [];
        let showtime_id = sale.showtime_id;
    
        const tickets = await get_tickets_by_sale(sale.id);
        console.log(tickets);
        for(let ticket of tickets){
            seats_reserved.push(ticket.seat_number);
        }

        if(showtime_id){
            const showtime = await getShowtimeDataInDb(showtime_id);
    
            if(showtime.length > 0){
                let movie_id =showtime[0].movie_id
                let auditorium_id = showtime[0].auditorium_id
    
                const movie = await fetchMovieInformationFromAPI(movie_id);
                const auditorium = await getAuditoriumInDbById(auditorium_id);
    
    
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




