
const ticketPrice = 15

$(document).ready(function () {
    function calculateTotalPrice(){
        let ticketNumber = parseInt($('#numberTickets').text());
        const price = ticketNumber * ticketPrice
        $('#totalPrice').text(price);

    }
    calculateTotalPrice(); 
    function addTicketNumber(){
        let ticketNumber = parseInt($('#numberTickets').text());
        ticketNumber += 1;
        
        $('#numberTickets').text(ticketNumber);
        calculateTotalPrice(); 
        
        if (ticketNumber === 8){
            $('#ticketAdd').prop('disabled', true);
        }
        if (ticketNumber > 1){
            $('#ticketSubtract').prop('disabled', false);
        }
    }
    function subtractTicketNumber(){
        let ticketNumber = parseInt($('#numberTickets').text());
        ticketNumber -= 1;
        $('#numberTickets').text(ticketNumber);
        calculateTotalPrice(); 
        
        if (ticketNumber < 8){
            $('#ticketAdd').prop('disabled', false);
        }
        if (ticketNumber === 1){
            $('#ticketSubtract').prop('disabled', true);
        }
    }
    
    $('#ticketAdd').click(function () {
        addTicketNumber();
        verifiedSeatAndTickets();
    });
    $('#ticketSubtract').click(function () {
        subtractTicketNumber();
        verifiedSeatAndTickets();
    });

    function addSeatSelected(ticketNumber){
        const seatsContainer = $('#seatsSelected');
        seatsContainer.append(`<button class="seats">${ticketNumber}</button>`);
    }

    function removeSeatSelected(ticketNumber){
        const seatToRemove = $(`#seatsSelected .seats:contains(${ticketNumber})`);
        seatToRemove.remove();
    }

    function verifiedSeatAndTickets(){
        let seatSelected = $('#seatsSelected .seats').length;
        let ticketNumber = parseInt($('#numberTickets').text());
        const seatsLeft = ticketNumber - seatSelected;

        $('.seatsLeft').text(seatsLeft);
        
        if (seatSelected === ticketNumber){
            $('#continuePayment').prop('disabled', false);
            $('#seatsDraw .seat:not(.selectedSeat)').prop('disabled', true);
            $('#remainingSeats').hide();
            $('#overSeats').hide();
        } else {
            $('#continuePayment').prop('disabled', true);
            $('#seatsDraw .seat:not(.selectedSeat)').prop('disabled', false);
            
            if (seatSelected > ticketNumber) {
                $('#overSeats').show();
                $('#remainingSeats').hide();
                $('.seatsLeft').text(-1*seatsLeft);
            } else {
                $('#overSeats').hide();
                $('#remainingSeats').show();
                $('.seatsLeft').text(seatsLeft);
            }
        }
    }

    $('#seatsDraw .seat').click(function () {
        if ($(this).hasClass('selectedSeat')){
            $(this).removeClass('selectedSeat');
            removeSeatSelected($(this).text());
        } else {
            $(this).addClass('selectedSeat');
            addSeatSelected($(this).text());
        }
        verifiedSeatAndTickets();

    $('#seatsSelected .seats').click(function(){
        $(this).remove();
        $(`#seatsDraw .seat:contains(${$(this).text()})`).removeClass('selectedSeat');
        verifiedSeatAndTickets();
    })



    });

});