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
    FOREIGN KEY (room_id) REFERENCES rooms(id) ON DELETE RESTRICT ON UPDATE RESTRICT
);

CREATE TABLE apikeys(
    id INT AUTO_INCREMENT PRIMARY KEY,
    apikey VARCHAR(20) NOT NULL
);

INSERT INTO rooms(name) VALUES ("Steve Jobs"), ("Alan Turing"), ("Glas");
INSERT INTO apikeys(apikey) VALUES ("qfGljZ59Rw7PiDtxLY3Y"), ("iasgkyOWIGIPjDtktJ9p");

CREATE PROCEDURE addBooking(IN roomName TEXT, IN bookerName TEXT)
INSERT INTO bookings(room_id, bookedBy) VALUES ((SELECT id FROM rooms WHERE name = roomName), bookerName);