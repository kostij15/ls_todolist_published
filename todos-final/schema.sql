CREATE TABLE users (username TEXT PRIMARY KEY,
                                          password TEXT NOT NULL);


CREATE TABLE todolists (id SERIAL PRIMARY KEY,
                                          title TEXT UNIQUE NOT NULL,
                                                            username TEXT NOT NULL) ;


CREATE TABLE todos
  (id SERIAL PRIMARY KEY,
                     title TEXT NOT NULL,
                                done BOOLEAN NOT NULL DEFAULT FALSE,
                                                              todolist_id INTEGER NOT NULL REFERENCES todolists(id) ON DELETE CASCADE) ;