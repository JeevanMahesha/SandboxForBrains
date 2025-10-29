class Circle:
    def __init__(self):
        self.radius = int(input())
        self.area = 0
        self.perimeter = 0

    def compute(self):
        self.area = 3.14*(self.radius**2)
        self.perimeter = round(2*3.14*self.radius, 2)

    def display(self):
        print('The Area of the Circle is :', self.area)
        print('The Perimeter Of the Circle is :', self.perimeter)


if __name__ == "__main__":
    obj = Circle()
    obj.compute()
    obj.display()
