CREATE TABLE users(
	id INT PRIMARY KEY AUTO_INCREMENT,
	username varchar(50) NOT NULL,
	pswd varchar(255) NOT NULL,
	email varchar(100) NOT NULL,
	created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	count INT DEFAULT 0,
	fullName varchar(255) NOT NULL
);

CREATE TABLE favoriteCities(
	id int PRIMARY KEY,
	user_id int, 
	FOREIGN KEY(user_id) REFERENCES users(id),
    json text
	cityName varchar(255)

);
 