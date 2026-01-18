function insertShowingsInContainer(showings, containerId) {
    const container = document.getElementById(containerId);
    container.innerHTML = ""; // Clear existing

    if (showings.length > 0) {
        showings.forEach(showing => {
            const timeSlotElement = document.createElement('a');
            timeSlotElement.classList.add('time-slot');
            timeSlotElement.innerText = `${showing.start_time.slice(0, -3)}`;
            timeSlotElement.href = `/pages/seat-selection.html?showtimeId=${showing.id}`;
            container.appendChild(timeSlotElement);
        });
    } else {
        const message = document.createElement('p');
        message.innerText = "No showtimes available for this day.";
        container.appendChild(message);
    }
}

function insertMovieData(movieData) {
    // Background and Poster
    const bg = document.getElementById('movieBackground');
    if (bg) bg.style.backgroundImage = `url("${movieData.poster}")`;

    const imageContainer = document.getElementById('poster');
    if (imageContainer) {
        imageContainer.innerHTML = `<img src="${movieData.poster}" alt="${movieData.title}">`;
    }

    // Essentials
    document.getElementById('title').innerText = movieData.title;
    document.getElementById('synopsis').innerText = movieData.synopsis;
    document.getElementById('duration').innerText = `${movieData.duration} min`;
    document.getElementById('rating').innerText = movieData.age_rating;
    document.getElementById('genre').innerText = movieData.genres;

    // Extra Credits
    document.getElementById('director').innerText = `Director: ${movieData.director}`;
    document.getElementById('advisory').innerText = `Advisory: ${movieData.age_advisory}`;

    // Trailer
    const trailer = movieData.trailer;
    const trailerContainer = document.getElementById('trailer');
    if (trailer) {
        trailerContainer.innerHTML = `<iframe src="${trailer}" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`;
    } else {
        trailerContainer.style.display = 'none';
    }

    // Showings
    insertShowingsInContainer(movieData.showings.today, 'today');
    insertShowingsInContainer(movieData.showings.tomorrow, 'tomorrow');
    insertShowingsInContainer(movieData.showings.afterTomorrow, 'afterTomorrow');

    // Remove loading screen with a smooth fade
    $('#loadingScreen').fadeOut(800);
}

// Global function for toggle
window.toggleSchedule = function (id) {
    // Update panes
    $('.schedule-pane').removeClass('active');
    $(`#${id}`).addClass('active');

    // Update buttons
    $('.date-btn').removeClass('active');
    // Direct match by onclick attribute to be precise
    $(`.date-btn[onclick*="${id}"]`).addClass('active');
}
