export function makeQrCode(canvas, movieInformation) {
    // check if there is null
    const allNotNull = Object.values(movieInformation).every(value => value !== null);
    if (allNotNull) {
        // const movieInformationString = JSON.stringify(movieInformation);
        const movieInformationString = `${movieInformation.salesId}\nPlease arrive at ${movieInformation.time} on ${movieInformation.date} in ${movieInformation.auditorium} for the screening of ${movieInformation.movieTitle}. Enjoy the show at seat ${movieInformation.seats}!\nOpus Cinemas`;
        QRCode.toCanvas(canvas, movieInformationString, function (error) {
            if (error) {
                console.error("QRcode error", error);
                return;
            }
        });
    } else {
        console.log("Error: There is a missing value in the object.");
        window.location.href = `/pages/error.html`;
    }
}