import sqlite3

migrate = '''
CREATE TABLE IF NOT EXISTS generating(
    id INTEGER PRIMARY KEY,
    file_name TEXT,
    file_size TEXT
);
CREATE TABLE IF NOT EXISTS duration(
    file_path TEXT,
    duration INT
);
'''

def connect(fd = ''):
    global db

    if len(fd) == 0:
        fd = ':memory:'

    db = sqlite3.connect(fd, check_same_thread=False)

    cur = db.cursor()
    cur.executescript(migrate)

    db.commit()

def close():
    global db
    db.close()

