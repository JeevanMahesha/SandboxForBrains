import sqlite3

connection = sqlite3.connect('Flask/Sqlite/data.db')
cursor = connection.cursor()

create_table = "CREATE TABLE user (id int,username text,password text)"
cursor.execute(create_table)

user = (1,'jeevan','123')
insert_query = "INSERT INTO user VALUES (?, ?, ?);"
cursor.execute(insert_query,user)

ul =[
    (2,'raja','123'),
    (3,'latha','asdas'),
    (4,'varsha','v123')
]
cursor.executemany(insert_query,ul)

# Delete_all_record="DELETE FROM user"
# cursor.execute(Delete_all_record)

select_query = "SELECT * FROM user"
for row in cursor.execute(select_query):
    print(row)
connection.commit()
connection.close()