class Person:
    def __init__(self, name=None, age=0, city=None, phone=None):
        self.name = name
        self.age = age
        self.city = city
        self.phone = phone


PersonList = []
n = int(input("enter the number of officers"))
for i in range(n):
    print("Enter the details of Employee", i+1)
    name = input("name:")
    age = int(input("age:"))
    city = input("city:")
    phone = input("phone:")
    e = Person(name, age, city, phone)
    PersonList.append(e)

""" print("---NAME && AGE----")
for l in PersonList:
    print(l.name,l.age)
print("---BRANCH OFFICE NAMES----")
for l in PersonList:
    print(l.city)
print("---CONTACT NUMBER OF PERSON ABI----")
flag=0
for l in PersonList:
    if(l.name=="abi"):
        flag=1
        print(l.phone)
if flag==0:
    print("ABI NOT OFFICER")
print("CLASS NAME",Person.__name__)

print("---ALL BRANCH OFFICE DETAILS----")
for l in PersonList:
    print(l.name,l.age,l.phone,l.city) """
