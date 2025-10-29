class office:
    def __init__(self):
        self.office_name = ""
        self.age = ""
        self.city = ""
        self.phone = ""
    
    def get_input(self):
        self.office_name = input()
        self.age = input()
        self.city = input()
        self.phone = input()
    
    def display(self):
        print(self.office_name,end="")
        print(self.age,end="")
        print(self.city,end="")
        print(self.phone,end="")
    
    def all_officer(self):
        print(self.office_name,self.age)

off = []
n =int(input())
for i in range(n):
    off.append(office())
    off[i].get_input()
for i in range(n):
    off[i].all_officer()    
for i in range(n):
    if off[i].office_name == 'Vijay Kumar':
        print(off[i].city)
for i in range(n):
    if off[i].office_name == 'Abinanth':
        print(off[i].phone)
for i in range(n):
    off[i].display()
