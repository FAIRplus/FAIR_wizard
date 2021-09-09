DROP TABLE IF EXISTS billionaires;

CREATE TABLE billionaires (
                            id INT AUTO_INCREMENT  PRIMARY KEY,
                            first_name VARCHAR(250) NOT NULL,
                            last_name VARCHAR(250) NOT NULL,
                            career VARCHAR(250) DEFAULT NULL
);

INSERT INTO billionaires (first_name, last_name, career) VALUES
                                                           ('Aliko', 'Dangote', 'Billionaire Industrialist'),
                                                           ('Bill', 'Gates', 'Billionaire Tech Entrepreneur'),
                                                           ('Folrunsho', 'Alakija', 'Billionaire Oil Magnate');


DROP TABLE IF EXISTS saved_searches;
CREATE TABLE saved_searches (perma_link VARCHAR(250) NOT NULL, resource_link VARCHAR(250) NOT NULL);
INSERT INTO saved_searches (perma_link, resource_link) VALUES ('123', 'http://localhost:8080/wizard?answers=Project%20manager&answers=Prospective%20data&answers=Interoperability&answers=Data%20formatting'),
                                                              ('234', 'http://localhost:8080/wizard?answers=Project%20manager&answers=Prospective%20data&answers=Interoperability&answers=Data%20formatting');
