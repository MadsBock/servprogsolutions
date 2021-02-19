DROP DATABASE IF EXISTS servprogsolutionsRest;
CREATE DATABASE servprogsolutionsRest;
USE servprogsolutionsRest;

CREATE TABLE rooms(
    id INT AUTO_INCREMENT PRIMARY KEY,
    name TEXT
);

CREATE TABLE bookings(
    id INT AUTO_INCREMENT PRIMARY KEY,
    room_id INT NOT NULL,
    bookedBy TEXT,
    bookingDay TEXT NOT NULL,
    FOREIGN KEY (room_id) REFERENCES rooms(id) ON DELETE RESTRICT ON UPDATE RESTRICT
);

CREATE TABLE apikeys(
    id INT AUTO_INCREMENT PRIMARY KEY,
    apikey VARCHAR(20) NOT NULL
);

INSERT INTO rooms(name) VALUES ("Steve Jobs"), ("Alan Turing"), ("Glas");
INSERT INTO apikeys(apikey) VALUES ("qfGljZ59Rw7PiDtxLY3Y"), ("iasgkyOWIGIPjDtktJ9p");

CREATE PROCEDURE addBooking(IN roomName TEXT, IN bookerName TEXT, IN dayBooked TEXT)
INSERT INTO bookings(room_id, bookedBy, bookingDay) VALUES ((SELECT id FROM rooms WHERE name = roomName), bookerName, bookingDay);

CREATE VIEW booking_view AS
SELECT rooms.name AS room, bookings.bookedBy AS booker, bookings.bookingDay AS day
FROM rooms
INNER JOIN bookings ON rooms.id = bookings.room_id;

CREATE VIEW room_view AS
SELECT name FROM rooms;