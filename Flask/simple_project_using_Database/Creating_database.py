import sqlite3

connection = sqlite3.connect('Flask/simple_project_using_Database/data.db')
cursor = connection.cursor()

create_table = "CREATE TABLE user (id INTEGER PRIMARY KEY ,username text,password text)"
cursor.execute(create_table)


connection.commit()
connection.close()