class Bike:
    def __init__(self,brand,cc,color,fuel,engine):
        self.brand = brand
        self.cc = cc
        self.color = color
        self.fuel_type = fuel
        self.engine_type = engine
    
    def display(self):
        print('Brand :',self.brand)
        print('CC :',self.cc)
        print('Color :',self.color)
        print('Fuel Type :',self.fuel_type)
        print('Engine Type :',self.engine_type)
    
if __name__ == "__main__":
    print('Before Update')
    b1 = Bike("Pulser","150cc","Black","Petrol","BSIV")
    b2 = Bike("Jawa","349cc","Green","Petrol","BSIV")
    b3 = Bike("Harley Davidson","500CC","Black","Petrol","BSIV")
    b4 = Bike("Royal Enfield","350cc","Battle Green","Petrol","BSIV")
    b1.display()
    print()
    b2.display()
    print()
    b3.display()
    print()
    b4.display()
    print()
    b2.cc = "500CC"
    b4.color ="White"
    print('After Update')
    b1.display()
    print()
    b2.display()
    print()
    b3.display()
    print()
    b4.display()
    print()
  

    