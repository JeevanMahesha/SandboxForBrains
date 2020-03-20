import re as r 
string = 'Janice is 22 and Theon is 33 Gabril is 44 and Latha is 40'
age = r.findall(r'\d{1,3}',string)
name = r.findall(r'[A-Z][a-z]*',string)
print(age,name)