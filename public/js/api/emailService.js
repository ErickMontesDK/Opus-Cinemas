export async function sendEmailToClient(bookingInfo) {
    try {
        console.log("Sending email to", bookingInfo)
        const endpoint = `/.netlify/functions/emailService`
        const response = await fetch(endpoint, {
            method: 'POST', 
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ bookingInfo })
        });
        
        if (!response.ok){
            throw new Error(`Netlify Server Error: ${response.status} - ${response.statusText}`);
        }
        const data = await response.json();
        return data;
        
    } catch (error) {
        console.log('Error: ' + error.message);
        throw new Error("Failed to send email" + error.message);
        
    }

}