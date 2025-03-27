import { SERVICE_ID, TEMPLATE_ID, EMAILJS_PUBLIC_KEY, EMAILJS_PRIVATE_KEY } from './config.js';
import emailjs, { EmailJSResponseStatus } from '@emailjs/nodejs';


export const handler = async (event) => {
    try {
        const { httpMethod, queryStringParameters, body } = event;

        if ( httpMethod === 'POST'){
            const {bookingInfo} = JSON.parse(body);
            console.log("booking info",bookingInfo)
            if (bookingInfo !== undefined ){
                const response = await emailjs.send(
                    SERVICE_ID,
                    TEMPLATE_ID,
                    {
                        name: bookingInfo.name,
                        reservationId: bookingInfo.reservationId,
                        date: bookingInfo.date,
                        time: bookingInfo.time,
                        movieTitle: bookingInfo.movieTitle,
                        auditorium: bookingInfo.auditorium,
                        numberOfTickets: bookingInfo.numberOfTickets,
                        seats: bookingInfo.seats,
                        price: bookingInfo.price,
                        email: bookingInfo.email,
                        qrCodeImage: bookingInfo.qrCodeImage
                    },
                    {
                        publicKey: EMAILJS_PUBLIC_KEY,
                        privateKey: EMAILJS_PRIVATE_KEY
                    }
                );
                console.log("Email sent successfully:", response);
                return {
                    statusCode: 200,
                    body: JSON.stringify({ 
                        message: 'Booking confirmation email sent successfully',
                        response: response 
                    }),
                };
    
    
            } else{
        
                throw new Error('Missing required parameter for the email function');
            }
        } else {
            throw new Error('Invalid HTTP method');
        }
    } catch (error) {
        if (error instanceof EmailJSResponseStatus) {
            console.log('EMAILJS FAILED...', error);
            return;
        }
        console.log('Error: ' + error.message);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Internal Server Error', details: error.message }),
        };
    }
};