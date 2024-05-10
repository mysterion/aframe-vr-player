import sqlite3

def connect(fd = ''):
    global db

    if len(fd) == 0:
        fd = ':memory:'

    db = sqlite3.connect(fd)

    cur = db.cursor()
    with open("migrate.sql", "r") as f:
        script = f.read()
        cur.executescript(script)

    db.commit()

def close():
    global db
    db.close()

