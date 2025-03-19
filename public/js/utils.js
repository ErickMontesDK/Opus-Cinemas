const hour_options = {
    hour12: false,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
}


export const convert_date_iso = (datestring = `${ new Date().toLocaleString('en-US', hour_options)}`) => {
    console.log("date: " + datestring)
    const [datePart, timePart] = datestring.split(', ');
    const [month, day, year] = datePart.split('/');
    const iso_date = `${year}-${month}-${day}T${timePart}`
    console.log("date: " + iso_date)
    return iso_date
}


export function adjustedDatetime(baseDatetime, daysToAdd) {
    let newDate = new Date(baseDatetime);
    newDate.setDate(newDate.getDate() + daysToAdd);
    return newDate.toISOString().split('T')[0]+"T05:00:00"; // Elimina la parte de milisegundos
}