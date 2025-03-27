const hour_options = {
    hour12: false,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
}


export const convertDateIso = (datestring = `${ new Date().toLocaleString('en-US', hour_options)}`) => {
    const [datePart, timePart] = datestring.split(', ');
    const [month, day, year] = datePart.split('/');
    const iso_date = `${year}-${month}-${day}T${timePart}`

    return iso_date
}