const time_limit = 24* 60
const hour_options = {
    hour12: false,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
}
const limit_time = `${new Date(Date.now() - time_limit * 60 *1000).toLocaleString('en-US', hour_options)}`;

async function fetchFromDatabase(endpoint, options = {}) {
    try {
        const response = await fetch(endpoint,{...options});
        
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


export async function getUserBookedTickets(uuid) {    
    console.log("tickets uuid: " + uuid);
    const endpoint = `/.netlify/functions/ticketsHandling?limit_time=${limit_time}&uuid=${uuid}`
    const options = {
        method: 'GET', 
        headers: {'Content-Type': 'application/json'},
    }

    const response = fetchFromDatabase(endpoint, options);
    return await response
}

export async function getBookedTicketsFromDb(showtimeId) {
    console.log("Search limited to date:",limit_time)
    const endpoint = `/.netlify/functions/ticketsHandling?limit_time=${limit_time}&showtime_id=${showtimeId}`
    const options = {
        method: 'GET', 
        headers: {'Content-Type': 'application/json'},
    }

    const response = fetchFromDatabase(endpoint, options);
    return await response
}

export async function getAuditoriumInDbById(auditoriumId) {
    console.log("getAuditoriumInDbById", auditoriumId)
    const endpoint = `/.netlify/functions/auditoriumsHandling?auditoriumId=${auditoriumId}`;
    const options = {    
        method: 'GET', 
        headers: {'Content-Type': 'application/json'},
    }

    const response = fetchFromDatabase(endpoint, options);
    return await response
}
    
export async function insertPaymentInDB(paymentDataToProcess){
    console.log("entro a insert_payment", paymentDataToProcess)
    const endpoint = `/.netlify/functions/salesHandling`;
    const options = {    
        method: 'POST', 
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ paymentDataToProcess })
    }

    const response = fetchFromDatabase(endpoint, options);
    return await response
}
    
export async function insertMultipleTicketsInDb(newTickets){
    console.log("entro a updateMultipleTicketsInDb")

    const endpoint = `/.netlify/functions/ticketsHandling`;
    const options = {    
        method: 'POST', 
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ newTickets })
    }

    const response = fetchFromDatabase(endpoint, options);
    return await response
}


export async function updateMultipleTicketsInDb(ticketIdsToUpdate, fieldsToUpdate){
    console.log("entro a updateMultipleTicketsInDb")
    const endpoint = `/.netlify/functions/ticketsHandling`;
    const options = {    
        method: 'PUT', 
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ ticketIdsToUpdate, fieldsToUpdate })
    }

    const response = fetchFromDatabase(endpoint, options);
    return await response
}


export async function updateTicketsBySale(ticketsUuid, saleId){
    console.log("entro a update_tickets_salesid", ticketsUuid, saleId)
    const endpoint = `/.netlify/functions/ticketsHandling`;
    const options = {    
        method: 'PUT', 
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ ticketsUuid, saleId })
    }

    const response = fetchFromDatabase(endpoint, options);
    return await response
}




export async function getShowtimeDataInDb(selectedShowtimeId) {
    console.log("start fetch for supabase showtime by id", selectedShowtimeId)
    const endpoint = `/.netlify/functions/showtimesHandling?selectedShowtimeId=${selectedShowtimeId}`;
    const options = {
            method: 'GET', 
            headers: {'Content-Type': 'application/json'},
        }
    const response = fetchFromDatabase(endpoint, options);
    return await response
}

export async function updateAvailableSeatsShowtime(selectedShowtimeId, numberTicketsBought) {
    console.log("start fetch for supabase showtime by id", selectedShowtimeId, numberTicketsBought);
    const endpoint = `/.netlify/functions/showtimesHandling`;
    const options = {
        method: 'PUT', 
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ selectedShowtimeId, numberTicketsBought })
    }
    const response = fetchFromDatabase(endpoint, options);
    return await response
}



export async function getShowtimesPerMovieDb(movieId, date, startTime) {
    console.log("Getting showtimes for Movie", movieId, date)
    const endpoint = `/.netlify/functions/showtimesHandling?movieId=${movieId}&startDate=${date}&startTime=${startTime}`;
    const options = {
        method: 'GET', 
        headers: {'Content-Type': 'application/json'},
    }

    const data = await fetchFromDatabase(endpoint, options);
    return data;
}

export async function insertShowtimeRecordDb(showtime) {
    console.log("inserting showtimes in db")
    const endpoint = `/.netlify/functions/showtimesHandling`
    const options = {
        method: 'POST', 
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ showtime: showtime })
    }

    const data = await fetchFromDatabase(endpoint, options);
    return data;
}

export async function getAvailableAuditorium(showtime){
    console.log("Searching an available auditorium for the showtime", showtime.start_time, showtime.end_time)
    const endpoint =`/.netlify/functions/auditoriumsHandling?start_date=${showtime.start_date}&start_time=${showtime.start_time}&end_time=${showtime.end_time}`
    const options = {
        method: 'GET', 
        headers: {'Content-Type': 'application/json'},
    }

    const data = await fetchFromDatabase(endpoint, options);
    return data;
};



export async function getSaleByUuid(saleUuid) {
    console.log("entro a get_sale_by_uuid", saleUuid)
    const endpoint =`/.netlify/functions/salesHandling?saleUuid=${saleUuid}`
    const options = {
        method: 'GET', 
        headers: {'Content-Type': 'application/json'},
    }

    const data = await fetchFromDatabase(endpoint, options);
    return data;
}

export async function getTicketsBySale(saleId) {
    console.log("start fetch for supabase get_tickets_by_sale", saleId)
    const endpoint =`/.netlify/functions/ticketsHandling?saleId=${saleId}`
    const options = {
        method: 'GET', 
        headers: {'Content-Type': 'application/json'},
    }

    const data = await fetchFromDatabase(endpoint, options);
    return data;
}






