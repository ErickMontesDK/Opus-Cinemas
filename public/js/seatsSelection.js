
// Helper to generate the theater grid if it's not pre-populated
function generateAuditorium() {
    const container = $('#seatsDraw');
    if (container.children().length > 0) return; // Already populated

    const layout = [
        { row: 'A', seats: 11, offset: 1 },
        { row: 'B', seats: 11, offset: 1 },
        { row: 'C', seats: 11, offset: 1 },
        { row: 'D', seats: 11, offset: 1 },
        { row: 'spacer', height: '20px' },
        { row: 'E', seats: 13, offset: 0 },
        { row: 'F', seats: 13, offset: 0 },
        { row: 'G', seats: 13, offset: 0 }
    ];

    layout.forEach(config => {
        if (config.row === 'spacer') {
            container.append('<div class="emptyRow"></div>');
            return;
        }

        // Left offset spacer
        if (config.offset > 0) {
            for (let i = 0; i < config.offset; i++) container.append('<div class="emptyPlace"></div>');
        }

        // Seats
        for (let i = 1; i <= config.seats; i++) {
            const num = i < 10 ? `0${i}` : i;
            const id = `${config.row}${num}`;
            container.append(`<button class="seat" id="${id}">${id}</button>`);
        }

        // Right offset spacer
        if (config.offset > 0) {
            for (let i = 0; i < config.offset; i++) container.append('<div class="emptyPlace"></div>');
        }

        // Row label (matching previous layout)
        container.append(`<div class="rowName">${config.row}</div>`);
    });
}

document.addEventListener('updatedTicketsAvailabilty', (event) => {
    generateAuditorium();

    const ticketPrice = 15;
    const [totalSeats, bookedSeats] = event.detail;
    const maxTickets = totalSeats > 8 ? 8 : totalSeats;

    function calculateTotalPrice() {
        let ticketNumber = parseInt($('#numberTickets').text());
        const price = ticketNumber * ticketPrice;
        $('#totalPrice').text(price);
    }

    calculateTotalPrice();

    function updateTicketCounter(delta) {
        let ticketNumber = parseInt($('#numberTickets').text());
        ticketNumber += delta;

        if (ticketNumber < 1 || ticketNumber > maxTickets) return;

        $('#numberTickets').text(ticketNumber);
        calculateTotalPrice();

        $('#ticketSubtract').prop('disabled', ticketNumber === 1);
        $('#ticketAdd').prop('disabled', ticketNumber === maxTickets);

        verifiedSeatAndTickets();
    }

    $('#ticketAdd').off().on('click', () => updateTicketCounter(1));
    $('#ticketSubtract').off().on('click', () => updateTicketCounter(-1));

    function addSeatToken(seatId) {
        const container = $('#seatsSelected');
        container.append(`<button class="seats" data-value="${seatId}">${seatId}</button>`);
    }

    function removeSeatToken(seatId) {
        $(`#seatsSelected .seats[data-value="${seatId}"]`).remove();
    }

    function verifiedSeatAndTickets() {
        const seatSelected = $('#seatsSelected .seats').length;
        const ticketNumber = parseInt($('#numberTickets').text());
        const diff = ticketNumber - seatSelected;

        $('.seatsLeft').text(Math.abs(diff));

        if (diff === 0) {
            $('#continuePayment').prop('disabled', false);
            $('#seatsDraw .seat:not(.selectedSeat)').prop('disabled', true);
            $('#remainingSeats').hide();
            $('#overSeats').hide();
        } else if (diff < 0) {
            $('#continuePayment').prop('disabled', true);
            $('#seatsDraw .seat').prop('disabled', false); // Allow deselecting
            $('#overSeats').show();
            $('#remainingSeats').hide();
        } else {
            $('#continuePayment').prop('disabled', true);
            $('#seatsDraw .seat:not(.unavailableSeat)').prop('disabled', false);
            $('#overSeats').hide();
            $('#remainingSeats').show();
        }
    }

    // Delegation for dynamic seats
    $(document).off('click', '#seatsDraw .seat').on('click', '#seatsDraw .seat', function () {
        if ($(this).hasClass('unavailableSeat')) return;

        if ($(this).hasClass('selectedSeat')) {
            $(this).removeClass('selectedSeat');
            removeSeatToken($(this).attr('id'));
        } else {
            const currentSelected = $('#seatsSelected .seats').length;
            const ticketNumber = parseInt($('#numberTickets').text());

            if (currentSelected < ticketNumber) {
                $(this).addClass('selectedSeat');
                addSeatToken($(this).attr('id'));
            }
        }
        verifiedSeatAndTickets();
    });

    // Delegation for selected tokens
    $(document).off('click', '#seatsSelected .seats').on('click', '#seatsSelected .seats', function () {
        const seatId = $(this).attr('data-value');
        $(this).remove();
        $(`#${seatId}`).removeClass('selectedSeat');
        verifiedSeatAndTickets();
    });

    $('#continuePayment').off().on('click', function () {
        const ticketNumber = parseInt($('#numberTickets').text());
        const selectedSeats = $('#seatsSelected .seats').map(function () {
            return $(this).attr('data-value');
        }).get();

        if (ticketNumber === selectedSeats.length) {
            const tickets = selectedSeats.map(seatId => {
                const record = bookedSeats.find(s => s.seat_number === seatId);
                return {
                    id: record ? record.id : null,
                    seat_number: seatId
                };
            });

            document.dispatchEvent(new CustomEvent('seatsObjectReady', { detail: tickets }));
        } else {
            alert('Please select all your seats before proceeding.');
        }
    });

    verifiedSeatAndTickets();
});
