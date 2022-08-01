DROP TABLE IF EXISTS saved_searches;
CREATE TABLE saved_searches (perma_link VARCHAR(250) NOT NULL, resource_link VARCHAR(250) NOT NULL);
INSERT INTO saved_searches (perma_link, resource_link) VALUES ('123', 'http://localhost:8080/wizard?answers=Project%20manager&answers=Prospective%20data&answers=Interoperability&answers=Data%20formatting'),
                                                              ('234', 'http://localhost:8080/wizard?answers=Project%20manager&answers=Prospective%20data&answers=Interoperability&answers=Data%20formatting');
