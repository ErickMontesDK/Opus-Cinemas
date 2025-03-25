// import { ,get_booked_tickets, get_showtimesPerMovie_db,get_data_by_id, get_showtime_seats, insert_payment, insert_tickets, update_tickets_salesid, get_sale_by_uuid, get_tickets_by_sale} from "../api/supabase_api.js";
import {getUserBookedTickets, getTicketsBySale, getSaleByUuid, insertPaymentInDB, getAuditoriumInDbById, getShowtimeDataInDb, getShowtimesPerMovieDb, getBookedTicketsFromDb, insertShowtimeRecordDb, updateMultipleTicketsInDb, insertMultipleTicketsInDb, updateTicketsBySale, updateAvailableSeatsShowtime, getAvailableAuditorium } from "../api/supabaseApi.js";
import { fetchMovieInformationFromAPI, fetchMoviesFromAPI, fetchMoviesSchedulesFromAPI } from "../api/moviegluApi.js";  
import { adjustedDatetime, convert_date_iso as convertDateIso } from "../utils.js";

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

export async function getMovies(numberOfMovies, date=convertDateIso().split("T")[0]) {
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


export async function getMovieDetails(movieId, datetime=convertDateIso()) {
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
    try {
        console.log("getting booked seats for showtime:", showtimeId)
        
        if(showtimeId){
            const showtimeData = await getShowtimeDataInDb(showtimeId);
            
            if(showtimeData.length > 0){
                const { movie_id: movieId, auditorium_id: auditoriumId, start_date: date, start_time: hour, available_seats: totalSeats } = showtimeData[0];
    
                const [ bookedSeats, movieData, auditoriumData ] = Promise.all([
                    getBookedTicketsFromDb(showtimeId),
                    fetchMovieInformationFromAPI(movieId),
                    getAuditoriumInDbById(auditoriumId)
                ]);

                console.log(movieData);
                const booking_data = {
                    movieTitle: movieData.film_name,
                    moviePoster: movieData.images?.poster['1']?.medium?.film_image || null,
                    movieId,
                    auditorium: auditoriumData[0].name,
                    bookedSeats,
                    date,
                    hour,
                    totalSeats
                }
                return booking_data;
            } 
        }
    
        throw new Error("Error loading showtime information");
        
    } catch (error) {
        console.log("Error", error);
    }
    
}

export async function registerTickets(seats, showtimeId, ticketTypeId=1, price=15){
    console.log("registering tickets for showtime:", showtimeId)
    console.log("list of seats", seats)
    try {
        if (seats.length > 0 && Array.isArray(seats) && showtimeId){
            const ticketUuid = crypto.randomUUID();
            const commonTicketData = {
                sales_id: null,
                ticket_type_id: ticketTypeId,
                price,
                status: "reserved",
                reserved_at: convertDateIso(),
                uuid: ticketUuid
            };

            let newTickets = [];
            let expiredReservationIds = [];
    
            seats.forEach(seat => {
                if (seat.id !== null){
                    expiredReservationIds.push(seat.id) 
                } else {
                    const customTicketData = {
                        ...commonTicketData,
                        seat_number : seat.seat_number,
                        showtime_id : showtimeId
                    };
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
                sessionStorage.setItem('ticketToken', ticketUuid);
                return ticketUuid;
            }
        } else {
            throw new Error("Invalid input for registering tickets");
        }
        
    } catch (error) {
        console.log("Error registering tickets", error.message);
        throw new Error("Error registering tickets: " + error.message);
    }
}

export async function getBookingInfo(uuid){
    try {
        const tickets = await getUserBookedTickets(uuid);
    
        const totalAmount = tickets.reduce((sum, ticket) => sum + ticket.price, 0);
        const seatsReserved = tickets.map(ticket => ticket.seat_number);
        const showtimeId = tickets[0]?.showtime_id;

        if(showtimeId){
            const showtimeData = await getShowtimeDataInDb(showtimeId);

            if(showtimeData.length > 0){
                const { movie_id: movieId, auditorium_id: auditoriumId, start_date: date, start_time: hour, available_seats: totalSeats } = showtimeData[0];

                const [ movieData, auditoriumData ] = await Promise.all([
                    fetchMovieInformationFromAPI(movieId),
                    getAuditoriumInDbById(auditoriumId)
                ]);


                const bookingData = {
                    movie: {
                        title: movieData.film_name,
                        poster: movieData.images.poster[1].medium.film_image,
                        age_rated_image: movieData.age_rating[0].age_rating_image,
                        age_rated: movieData.age_rating[0].rating
                    },
                    auditorium: auditoriumData[0].name,
                    seatsReserved,
                    total_amount: totalAmount,
                    date,
                    hour,
                    available_seats: totalSeats     
                }
                return bookingData;
            } 
        }

        throw new Error("Booked information was not found");  
    } catch (error) {
        console.log("Error getting booking information: ", error.message);
        throw new Error("Error getting booking information: " + error.message);
    }
    
}

export async function paymentProcess(paymentInformation){
    const { email, totalPrice, showtimeId, ticketUuid } = paymentInformation;

    const paymentDataToProcess = {
        email,
        total: totalPrice,
        showtime_id: showtimeId,
        payment_time: convertDateIso()
    };

    try {
        const paymentResponse = await insertPaymentInDB(paymentDataToProcess);
        
        if(paymentResponse.length > 0 ){
            const paymentRecord = paymentResponse[0];
            const { id: saleId, uuid: saleUuid } = paymentRecord
            
            const updatedTickets = await updateTicketsBySale(ticketUuid, saleId);
            if(updatedTickets.length > 0){
                const updatedShowtime = await updateAvailableSeatsShowtime(showtimeId, updatedTickets.length);

                if (updatedShowtime.length > 0){
                    console.log("updateTicketsBySale",updatedTickets);
                    sessionStorage.setItem('paymentToken', saleUuid);
                    console.log(updatedShowtime);
                    return saleUuid;
                }

            } else {
                throw new Error("No tickets were updated after payment");
            }
        }

    
    } catch (error) {
        console.error(error.message);
        throw new Error("Error processing payment");
        
    }
}        

export async function getPaymentConfirmation(saleUuid){
    try {
        const saleResponse = await getSaleByUuid(saleUuid);
        console.log("sale",saleResponse);

        if (saleResponse.length > 0){
            const saleRecord = saleResponse[0];
            const email = saleRecord.email;
            let totalAmount = saleRecord.total;
            let showtimeId = saleRecord.showtime_id;

            const tickets = await getTicketsBySale(saleRecord.id);

            const seatsReserved = tickets.map(ticket => ticket.seat_number)
            const showtimeData = await getShowtimeDataInDb(showtimeId);

            if(showtimeData.length > 0){
                const { movie_id: movieId, auditorium_id: auditoriumId, start_date: date, start_time: hour, available_seats: totalSeats } = showtimeData[0];

                const [ movieData, auditoriumData ] = await Promise.all([
                    fetchMovieInformationFromAPI(movieId),
                    getAuditoriumInDbById(auditoriumId)
                ]);

                const sale_data = {
                    movie: {
                        title: movieData.film_name,
                        poster: movieData.images.poster[1].medium.film_image,
                        age_rated_image: movieData.age_rating[0].age_rating_image,
                        age_rated: movieData.age_rating[0].rating
                    },
                    auditorium: auditoriumData[0].name,
                    seatsReserved,
                    totalAmount,
                    email
                }
                return sale_data;
            }
            throw new Error("No showtime information was found");
        } 
        throw new Error("Payment confirmation information was not found");
        
    } catch (error) {
        throw new Error("Error at processing the payment request: " + error);
    }
    
}




