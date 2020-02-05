class Bike:
    def __init__(self,vin,brand,model,enginedisplacement,breaksystem,cost):
        self.__VIN = vin
        self.__Brand = brand
        self.__Model = model
        self.__EngineDisplacement = enginedisplacement
        self.__BreakSystem = breaksystem
        self.__cost = cost
    
    def Display(self):
        print()
        print('VIN:{}'.format(self.__VIN))
        print('Brand:{}'.format(self.__Brand))
        print('Model:{}'.format(self.__Model))
        print('Engine Displacement:{}'.format(self.__EngineDisplacement))
        print('Brake System:{}'.format(self.__BreakSystem))
        print('Cost:{}'.format(self.__cost))

    def set_bike_Details(self,vin,brand,model,enginedisplacement,breaksystem,cost):
        self.__VIN = vin
        self.__Brand = brand
        self.__Model = model
        self.__EngineDisplacement = enginedisplacement
        self.__BreakSystem = breaksystem
        self.__cost = cost


    def get_bike_Details(self):
        print()
        print('VIN:{}'.format(self.__VIN))
        print('Brand:{}'.format(self.__Brand))
        print('Model:{}'.format(self.__Model))
        print('Engine Displacement:{}'.format(self.__EngineDisplacement))
        print('Brake System:{}'.format(self.__BreakSystem))
        print('Cost:{}'.format(self.__cost))


if __name__ == "__main__":  
    val = "MD2GJ3214JR258416,KTM,RC,390cc,Disk,225000.0".split(",")
    B1 = Bike(val[0],val[1],val[2],val[3],val[4],float(val[5]))

    val = "MD2GJ3214JR258416,KTM,RC,390cc,Disk,225000.0".split(",")
    B2 = Bike(val[0],val[1],val[2],val[3],val[4],float(val[5]))

    B1.get_bike_Details()
    B2.get_bike_Details()
    print()

    if B1._Bike__VIN.lower() == B2._Bike__VIN.lower() and B2._Bike__Brand == B2._Bike__Brand:
        print('Bike 1 is same as Bike 2')
    else:
        print('Bike 1 and Bike 2 are different')
