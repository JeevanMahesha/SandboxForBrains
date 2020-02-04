class Bike:
    def __init__(self,vin,brand,model,enginedisplacement,breaksystem,cost):
        self.__VIN = vin
        self.__Brand = brand
        self.__Model = model
        self.__EngineDisplacement = enginedisplacement
        self.__BreakSystem = breaksystem
        self.__cost = cost
    
    def Display(self):
        print('VIN:{}'.format(self.__VIN))
        print('Brand:{}'.format(self.__Brand))
        print('Model:{}'.format(self.__Model))
        print('Engine Displacement:{}'.format(self.__EngineDisplacement))
        print('Brake System:{}'.format(self.__BreakSystem))
        print('Cost:{}'.format(self.__cost))
    
    def compare(self):
        print()

val = input().split(",")
B1 = Bike(val[0],val[1],val[2],val[3],val[4],float(val[5]))
B1.Display()