export const convert_date_iso = (datestring = `${ new Date().toLocaleString()}`) => {
    const [datePart, timePart] = datestring.split(', ');
    const [day, month, year] = datePart.split('/');
    const correct_date = `${month}/${day}/${year}, ${timePart}`
    let formattedDateString = correct_date.replace(/([ap])\.?m\.?/i, "$1m").replace(/,/, '');
    const date = new Date(formattedDateString);

    return date.toISOString();
}