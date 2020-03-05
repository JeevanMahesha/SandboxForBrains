class Human:
    def __init__(self,a=None,b=None,c=None):
        self.a=a
        self.b=b
        self.c=c

    def sayHello(self):
        if self.a!=None and self.b!=None and self.c!=None:
            print(str(self.a)+str(self.b)+str(self.c))
        elif self.a!=None and self.b!=None:
            print(str(self.a)+str(self.b))
        else:
            print('No Display')

if __name__ == "__main__":
    a = 'Python'
    b = 'Language'
    c = 'Easy'
    d = 'Python'
    e = 'Language'

    obj = Human(a,b,c)
    obj.sayHello()
    obj = Human(d,e)
    obj.sayHello()
    obj = Human()
    obj.sayHello()
    