function insertShowingsInContainer(showings, containerId) {
    if (showings.length > 0){
        showings.forEach(showing => {
            console.log(showing)
            const timeSlotElement = document.createElement('a');
            timeSlotElement.classList.add('time-slot');
            timeSlotElement.innerText = `${showing.start_time.slice(0,-3)}`;
            console.log(timeSlotElement)
            document.getElementById(containerId).appendChild(timeSlotElement);  
        });

    } else {
        const message = document.createElement('p');
        message.innerText = "Not available for this day"
        document.getElementById(containerId).appendChild(message);  
    }  
} 
    
    

function insertMovieData(movieData){
    let scheduletoday =  'today'
    let scheduletomo =  'tomorrow'
    let scheduleafter =  'afterTomorrow'

    const todayShowings = movieData.showings.today
    console.log(todayShowings)
    const tomorrowShowings = movieData.showings.tomorrow
    console.log(tomorrowShowings)
    const afterShowings = movieData.showings.afterTomorrow
    console.log(afterShowings)

    insertShowingsInContainer(todayShowings, scheduletoday)
    insertShowingsInContainer(tomorrowShowings, scheduletomo)
    insertShowingsInContainer(afterShowings, scheduleafter)

    const image = document.createElement('img');
    image.src = movieData.poster
    
    const imageContainer = document.getElementById('poster')
    console.log(imageContainer)
    imageContainer.appendChild(image)
    document.body.style.backgroundImage = `url("${movieData.poster}")`
    
    
    let trailer = movieData.trailer; 
    if (trailer !== null && trailer !== undefined && trailer !== "") {
        
        let trailerSpace = document.createElement('iframe');
        trailerSpace.src = movieData.trailer
        document.getElementById('trailer').appendChild(trailerSpace)
        
    } else {
        console.log("No trailer")
    }

    document.getElementById('title').innerText = movieData.title;
    document.getElementById('synopsis').innerText = movieData.synopsis;
    document.getElementById('duration').innerText = `Duration: ${movieData.duration} minutes`;
    document.getElementById('rating').innerText = `Age Rating: ${movieData.age_rating}`;
    document.getElementById('director').innerText = `Director: ${movieData.director}`;
    document.getElementById('advisory').innerText = `Advisory: ${movieData.age_advisory}`;
    
    document.getElementById('genre').innerText = `Genre: ${movieData.genres}`;
    

}

const datatemplate = {
    
    "showings": {
        "today": [
            {
                "id": 133,
                "movie_id": 7772,
                "auditorium_id": 1,
                "start_date": "2025-03-17",
                "start_time": "22:30:00",
                "end_time": "00:15:00",
                "available_seats": 91
            },
            {
                "id": 134,
                "movie_id": 7772,
                "auditorium_id": 1,
                "start_date": "2025-03-17",
                "start_time": "23:00:00",
                "end_time": "00:45:00",
                "available_seats": 91
            }
        ],
        "tomorrow": [
            {
                "id": 173,
                "movie_id": 7772,
                "auditorium_id": 1,
                "start_date": "2025-03-19",
                "start_time": "11:30:00",
                "end_time": "13:15:00",
                "available_seats": 91
            },
            {
                "id": 174,
                "movie_id": 7772,
                "auditorium_id": 2,
                "start_date": "2025-03-19",
                "start_time": "12:00:00",
                "end_time": "13:45:00",
                "available_seats": 91
            },
            {
                "id": 175,
                "movie_id": 7772,
                "auditorium_id": 3,
                "start_date": "2025-03-19",
                "start_time": "12:30:00",
                "end_time": "14:15:00",
                "available_seats": 91
            },
            {
                "id": 176,
                "movie_id": 7772,
                "auditorium_id": 1,
                "start_date": "2025-03-19",
                "start_time": "13:30:00",
                "end_time": "15:15:00",
                "available_seats": 91
            },
            {
                "id": 177,
                "movie_id": 7772,
                "auditorium_id": 2,
                "start_date": "2025-03-19",
                "start_time": "14:30:00",
                "end_time": "16:15:00",
                "available_seats": 91
            },
            {
                "id": 178,
                "movie_id": 7772,
                "auditorium_id": 3,
                "start_date": "2025-03-19",
                "start_time": "15:00:00",
                "end_time": "16:45:00",
                "available_seats": 91
            },
            {
                "id": 179,
                "movie_id": 7772,
                "auditorium_id": 1,
                "start_date": "2025-03-19",
                "start_time": "15:30:00",
                "end_time": "17:15:00",
                "available_seats": 91
            },
            {
                "id": 180,
                "movie_id": 7772,
                "auditorium_id": 2,
                "start_date": "2025-03-19",
                "start_time": "16:30:00",
                "end_time": "18:15:00",
                "available_seats": 91
            },
            {
                "id": 181,
                "movie_id": 7772,
                "auditorium_id": 1,
                "start_date": "2025-03-19",
                "start_time": "17:30:00",
                "end_time": "19:15:00",
                "available_seats": 91
            },
            {
                "id": 182,
                "movie_id": 7772,
                "auditorium_id": 3,
                "start_date": "2025-03-19",
                "start_time": "18:00:00",
                "end_time": "19:45:00",
                "available_seats": 91
            },
            {
                "id": 183,
                "movie_id": 7772,
                "auditorium_id": 2,
                "start_date": "2025-03-19",
                "start_time": "18:30:00",
                "end_time": "20:15:00",
                "available_seats": 91
            },
            {
                "id": 184,
                "movie_id": 7772,
                "auditorium_id": 4,
                "start_date": "2025-03-19",
                "start_time": "19:30:00",
                "end_time": "21:15:00",
                "available_seats": 91
            },
            {
                "id": 185,
                "movie_id": 7772,
                "auditorium_id": 2,
                "start_date": "2025-03-19",
                "start_time": "20:30:00",
                "end_time": "22:15:00",
                "available_seats": 91
            },
            {
                "id": 186,
                "movie_id": 7772,
                "auditorium_id": 3,
                "start_date": "2025-03-19",
                "start_time": "21:00:00",
                "end_time": "22:45:00",
                "available_seats": 91
            },
            {
                "id": 187,
                "movie_id": 7772,
                "auditorium_id": 4,
                "start_date": "2025-03-19",
                "start_time": "21:30:00",
                "end_time": "23:15:00",
                "available_seats": 91
            }
        ],
        "afterTomorrow": [
            {
                "id": 254,
                "movie_id": 7772,
                "auditorium_id": 1,
                "start_date": "2025-03-20",
                "start_time": "11:00:00",
                "end_time": "12:45:00",
                "available_seats": 91
            },
            {
                "id": 255,
                "movie_id": 7772,
                "auditorium_id": 2,
                "start_date": "2025-03-20",
                "start_time": "12:00:00",
                "end_time": "13:45:00",
                "available_seats": 91
            },
            {
                "id": 256,
                "movie_id": 7772,
                "auditorium_id": 1,
                "start_date": "2025-03-20",
                "start_time": "13:00:00",
                "end_time": "14:45:00",
                "available_seats": 91
            },
            {
                "id": 257,
                "movie_id": 7772,
                "auditorium_id": 2,
                "start_date": "2025-03-20",
                "start_time": "14:00:00",
                "end_time": "15:45:00",
                "available_seats": 91
            },
            {
                "id": 258,
                "movie_id": 7772,
                "auditorium_id": 1,
                "start_date": "2025-03-20",
                "start_time": "15:00:00",
                "end_time": "16:45:00",
                "available_seats": 91
            },
            {
                "id": 259,
                "movie_id": 7772,
                "auditorium_id": 2,
                "start_date": "2025-03-20",
                "start_time": "16:00:00",
                "end_time": "17:45:00",
                "available_seats": 91
            },
            {
                "id": 260,
                "movie_id": 7772,
                "auditorium_id": 1,
                "start_date": "2025-03-20",
                "start_time": "17:00:00",
                "end_time": "18:45:00",
                "available_seats": 91
            },
            {
                "id": 261,
                "movie_id": 7772,
                "auditorium_id": 2,
                "start_date": "2025-03-20",
                "start_time": "18:00:00",
                "end_time": "19:45:00",
                "available_seats": 91
            },
            {
                "id": 262,
                "movie_id": 7772,
                "auditorium_id": 1,
                "start_date": "2025-03-20",
                "start_time": "19:00:00",
                "end_time": "20:45:00",
                "available_seats": 91
            },
            {
                "id": 263,
                "movie_id": 7772,
                "auditorium_id": 2,
                "start_date": "2025-03-20",
                "start_time": "20:00:00",
                "end_time": "21:45:00",
                "available_seats": 91
            },
            {
                "id": 264,
                "movie_id": 7772,
                "auditorium_id": 1,
                "start_date": "2025-03-20",
                "start_time": "21:00:00",
                "end_time": "22:45:00",
                "available_seats": 91
            },
            {
                "id": 265,
                "movie_id": 7772,
                "auditorium_id": 2,
                "start_date": "2025-03-20",
                "start_time": "22:00:00",
                "end_time": "23:45:00",
                "available_seats": 91
            }
        ]
    }
}

