import sqlite3

connection = sqlite3.connect('Flask/simple_project_using_Database/data.db')
cursor = connection.cursor()

create_table = "CREATE TABLE user (id int,username text,password text)"
cursor.execute(create_table)

user = (1,'jeevan','123')
insert_query = "INSERT INTO user VALUES (?, ?, ?);"
cursor.execute(insert_query,user)

connection.commit()
connection.close()