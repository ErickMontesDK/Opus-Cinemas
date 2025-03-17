const time_limit = 24* 60

export async function get_booked_tickets(uuid) {
    console.log("tickets uuid: " + uuid);
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
    console.log("Limit", limit_time)
    const response = await fetch(`/.netlify/functions/ticketsHandling?limit_time=${limit_time}&uuid=${uuid}`,
        {
            method: 'GET', 
            headers: {'Content-Type': 'application/json'},
        }
    );

    if (!response.ok) {
        throw new Error(`Error: ${response.status} - ${response.statusText}`);
    }

    const data = await response.json();
    return data;
}
export async function get_showtime_seats(showtime_id) {
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
    
    console.log("start fetch for supabase unavailable seats", limit_time, showtime_id)
    const response = await fetch(`/.netlify/functions/ticketsHandling?limit_time=${limit_time}&showtime_id=${showtime_id}`,
        {
            method: 'GET', 
            headers: {'Content-Type': 'application/json'},
        }
    );

    if (!response.ok) {
        throw new Error(`Error: ${response.status} - ${response.statusText}`);
    }

    const data = await response.json();
    return data;
}

export async function getAuditoriumInDbById(auditoriumId) {
    const response = await fetch(`/.netlify/functions/auditoriumsHandling?auditoriumId=${auditoriumId}`,
        {
            method: 'GET', 
            headers: {'Content-Type': 'application/json'},
        }
    );

    if (!response.ok) {
        throw new Error(`Error: ${response.status} - ${response.statusText}`);
    }

    const data = await response.json();
    return data;
}
    
export async function insert_payment(saleData){
    console.log("entro a insert_payment", saleData)
    const databaseResponse = await fetch(`/.netlify/functions/salesHandling`,
        {
            method: 'POST', 
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ saleData })
        },
    );

    if (!databaseResponse.ok) {
        throw new Error(`Error: ${databaseResponse.status} - ${databaseResponse.statusText}`);
    }

    const insertedSaleData = await databaseResponse.json();
    return insertedSaleData;
}
    
export async function insertMultipleTicketsInDb(newTickets){
    console.log("entro a updateMultipleTicketsInDb")
    const databaseResponse = await fetch(`/.netlify/functions/ticketsHandling`,
        {
            method: 'POST', 
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ newTickets })
        },
    );

    if (!databaseResponse.ok) {
        throw new Error(`Error: ${databaseResponse.status} - ${databaseResponse.statusText}`);
    }

    const insertedTicketsData = await databaseResponse.json();
    return insertedTicketsData;
}


export async function updateMultipleTicketsInDb(ticketIdsToUpdate, fieldsToUpdate){
    console.log("entro a updateMultipleTicketsInDb")
    const databaseResponse = await fetch(`/.netlify/functions/ticketsHandling`,
        {
            method: 'PUT', 
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ ticketIdsToUpdate, fieldsToUpdate })
        },
    );

    if (!databaseResponse.ok) {
        throw new Error(`Error: ${databaseResponse.status} - ${databaseResponse.statusText}`);
    }

    const updatedTicketsData = await databaseResponse.json();
    return updatedTicketsData;
}


export async function updateTicketsBySale(ticketsUuid, saleId){
    console.log("entro a update_tickets_salesid")
    const databaseResponse = await fetch(`/.netlify/functions/ticketsHandling`,
        {
            method: 'PUT', 
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ ticketsUuid, saleId })
        },
    );

    if (!databaseResponse.ok) {
        throw new Error(`Error: ${databaseResponse.status} - ${databaseResponse.statusText}`);
    }

    const updatedTicketsData = await databaseResponse.json();
    return updatedTicketsData;
}




export async function getShowtimeDataInDb(selectedShowtimeId) {
    console.log("start fetch for supabase showtime by id", selectedShowtimeId)
    const response = await fetch(`/.netlify/functions/showtimesHandling?selectedShowtimeId=${selectedShowtimeId}`,
        {
            method: 'GET', 
            headers: {'Content-Type': 'application/json'},
        }
    );

    if (!response.ok) {
        throw new Error(`Error: ${response.status} - ${response.statusText}`);
    }

    const data = await response.json();
    return data;
}

export async function updateAvailableSeatsShowtime(selectedShowtimeId, numberSeats) {
    console.log("start fetch for supabase showtime by id", selectedShowtimeId)
    const response = await fetch(`/.netlify/functions/showtimesHandling`,
        {
            method: 'PUT', 
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ selectedShowtimeId, numberSeats })
        }
    );

    if (!response.ok) {
        throw new Error(`Error: ${response.status} - ${response.statusText}`);
    }

    const data = await response.json();
    return data;
}
export async function getShowtimesPerMovieDb(movieId, date, startTime) {
    console.log("start fetch for supabase showtimes", movieId, date)
    const response = await fetch(`/.netlify/functions/showtimesHandling?movieId=${movieId}&startDate=${date}&startTime=${startTime}`,
        {
            method: 'GET', 
            headers: {'Content-Type': 'application/json'},
        }
    );

    if (!response.ok) {
        throw new Error(`Error: ${response.status} - ${response.statusText}`);
    }

    const data = await response.json();
    return data;
}

export async function insertShowtimeRecordDb(showtime) {
    console.log("inserting showtimes in db")
    const response = await fetch(`/.netlify/functions/showtimesHandling`,
        {
            method: 'POST', 
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ showtime: showtime })
        },
    );

    if (!response.ok) {
        throw new Error(`Error: ${response.status} - ${response.statusText}`);
    }

    const data = await response.json();
    return data;
}

export async function getAvailableAuditorium(showtime){
    console.log("start fetch for supabase auditoriums", showtime.start_time, showtime.end_time)
    const response = await fetch(`/.netlify/functions/auditoriumsHandling?start_date=${showtime.start_date}&start_time=${showtime.start_time}&end_time=${showtime.end_time}`,
        {
            method: 'GET', 
            headers: {'Content-Type': 'application/json'},
        }
    );

    if (!response.ok) {
        throw new Error(`Error: ${response.status} - ${response.statusText}`);
    }

    const data = await response.json();
    console.log("vamos america", data)
    return data;
};



export async function get_sale_by_uuid(uuid) {
    console.log("entro a get_sale_by_uuid", uuid)
    const databaseResponse = await fetch(`/.netlify/functions/salesHandling?saleUuid=${uuid}`,
        {
            method: 'GET', 
            headers: {'Content-Type': 'application/json'},
        },
    );

    if (!databaseResponse.ok) {
        throw new Error(`Error: ${databaseResponse.status} - ${databaseResponse.statusText}`);
    }

    const saleData = await databaseResponse.json();
    return saleData;
}

export async function get_tickets_by_sale(sale_id) {
    console.log("start fetch for supabase get_tickets_by_sale", sale_id)
    const response = await fetch(`/.netlify/functions/ticketsHandling?saleId=${sale_id}`,
        {
            method: 'GET', 
            headers: {'Content-Type': 'application/json'},
        }
    );

    if (!response.ok) {
        throw new Error(`Error: ${response.status} - ${response.statusText}`);
    }

    const data = await response.json();
    return data;

}






