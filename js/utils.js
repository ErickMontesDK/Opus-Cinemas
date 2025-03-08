export const convert_date_iso = (datestring = `${ new Date().toLocaleString('en-US')}`) => {
    let formattedDateString = datestring.replace(/([ap])\.?m\.?/i, "$1m").replace(/,/, '');
    const date = new Date(formattedDateString);
    return date.toISOString();
}