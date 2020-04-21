import sqlite3

connection = sqlite3.connect('Flask/simple_project_using_Database/data.db')
cursor = connection.cursor()

create_user_table = "CREATE TABLE IF NOT EXISTS user (id INTEGER PRIMARY KEY ,username text,password text)"
cursor.execute(create_user_table)

create_items_table = "CREATE TABLE IF NOT EXISTS items (name text,price real)"
cursor.execute(create_items_table)

insert = "INSERT INTO items VALUES ('apple',10.90)"
cursor.execute(insert)
connection.commit()
connection.close()