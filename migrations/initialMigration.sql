CREATE TABLE Auditoriums (
    id SERIAL PRIMARY KEY,
    name VARCHAR(10) NOT NULL
);

CREATE TABLE Showtimes (
    id SERIAL PRIMARY KEY,
    movie_id INTEGER NOT NULL,
    auditorium_id INT REFERENCES Auditoriums(id) ON DELETE SET NULL,
    start_date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    available_seats INT DEFAULT 91
);

CREATE TABLE Sales (
    id SERIAL PRIMARY KEY,
    showtime_id INT REFERENCES Showtimes(id) ON DELETE SET NULL,
    email VARCHAR(50) NOT NULL,
    total NUMERIC(10, 2) NOT NULL,
    refunded BOOLEAN DEFAULT FALSE,
    payment_time TIMESTAMPTZ DEFAULT NOW(),
    uuid UUID DEFAULT gen_random_uuid()
);

CREATE TABLE TicketTypes (
    id SERIAL PRIMARY KEY,
    name VARCHAR(20) NOT NULL,
    base_price NUMERIC(10, 2) NOT NULL
);

CREATE TYPE seats_number AS ENUM (
    'A01', 'A02', 'A03', 'A04', 'A05', 'A06', 'A07', 'A08', 'A09', 'A10', 'A11', 'A12', 'A13',
    'B01', 'B02', 'B03', 'B04', 'B05', 'B06', 'B07', 'B08', 'B09', 'B10', 'B11', 'B12', 'B13',
    'C01', 'C02', 'C03', 'C04', 'C05', 'C06', 'C07', 'C08', 'C09', 'C10', 'C11', 'C12', 'C13',
    'D01', 'D02', 'D03', 'D04', 'D05', 'D06', 'D07', 'D08', 'D09', 'D10', 'D11', 'D12', 'D13',
    'E01', 'E02', 'E03', 'E04', 'E05', 'E06', 'E07', 'E08', 'E09', 'E10', 'E11', 'E12', 'E13',
    'F01', 'F02', 'F03', 'F04', 'F05', 'F06', 'F07', 'F08', 'F09', 'F10', 'F11', 'F12', 'F13',
    'G01', 'G02', 'G03', 'G04', 'G05', 'G06', 'G07', 'G08', 'G09', 'G10', 'G11', 'G12', 'G13'
);

CREATE TYPE ticket_status AS ENUM ('available', 'reserved', 'sold', 'refunded');

CREATE TABLE Tickets (
    seat_number seats_number NOT NULL,
    showtime_id INT REFERENCES Showtimes(id) NOT NULL,
    sales_id INT REFERENCES Sales(id),
    ticket_type_id INT REFERENCES TicketTypes(id),
    price NUMERIC(10, 2),
    status ticket_status DEFAULT 'available',
    reserved_at TIMESTAMP,
    uuid UUID,
    refunded BOOLEAN DEFAULT FALSE,
    PRIMARY KEY (seat_number, showtime_id)
);

CREATE OR REPLACE FUNCTION get_available_auditoriums(
    p_start_date DATE,
    p_start_time TIME,
    p_end_time TIME
)
RETURNS TABLE (
    id INT
) AS $$
BEGIN
    RETURN QUERY
    SELECT auditoriums.id
    FROM auditoriums
    WHERE auditoriums.id NOT IN (
        SELECT showtimes.auditorium_id
        FROM showtimes
        WHERE showtimes.start_date = p_start_date
            AND showtimes.start_time < p_end_time
            AND showtimes.end_time > p_start_time
    );
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION get_occupied_seats(
    p_showtime_id INT,
    p_limit_time TIMESTAMP
)
RETURNS TABLE (
    id INT,
    seat_number seats_number,
    status ticket_status
) AS $$
BEGIN
    RETURN QUERY
    SELECT tickets.id, tickets.seat_number, tickets.status
    FROM tickets
    WHERE tickets.showtime_id = p_showtime_id
        AND tickets.status = 'reserved'::ticket_status
        AND tickets.reserved_at > p_limit_time

    UNION

    SELECT tickets.id, tickets.seat_number, tickets.status
    FROM tickets
    WHERE tickets.showtime_id = p_showtime_id
        AND tickets.status = 'sold'::ticket_status;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION get_showtime_seats(
    p_showtime_id INT,
    p_limit_time TIMESTAMP
)
RETURNS TABLE (
    id INT,
    seat_number seats_number,
    status ticket_status,
    available BOOLEAN
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        tickets.id,
        tickets.seat_number,
        tickets.status,
        CASE
            WHEN tickets.status = 'reserved'::ticket_status AND tickets.reserved_at <= p_limit_time THEN TRUE
            WHEN tickets.status = 'sold'::ticket_status THEN FALSE
            ELSE FALSE
        END AS available
    FROM
        tickets
    WHERE
        tickets.showtime_id = p_showtime_id
    ORDER BY
        tickets.seat_number;
END;
$$ LANGUAGE plpgsql;