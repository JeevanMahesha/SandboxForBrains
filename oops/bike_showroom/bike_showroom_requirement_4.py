class Bike:
    def __init__(self,vin,brand,model,enginedisplacement,breaksystem,cost):
        self.__VIN = vin
        self.__Brand = brand
        self.__Model = model
        self.__EngineDisplacement = enginedisplacement
        self.__BreakSystem = breaksystem
        self.__Cost = cost
    
    def getter(self):
        print('{:<20}{:<10}{:<10}{:<20}{:<12}{:<12}'.format(self.__VIN,self.__Brand,self.__Model,self.__EngineDisplacement,self.__BreakSystem,self.__Cost))

    
    @staticmethod
    def createBike(Input_Value):
        return Input_Value.split(',')
    
    def EngineDisplacementComparator(self,Bike_Object):
        while True:
            try:        
                opt = input(' Enter a type to sort:\n 1.Sort by Brand\n 2.Sort by Engine Displacement\n')
                if opt == '1':
                    Bike_Object = [i for i in sorted(Bike_Object,key= lambda x:x.__Brand)]
                    return Bike_Object
                elif opt == '2':
                    Bike_Object = [i for i in sorted(Bike_Object,key= lambda x:x.__EngineDisplacement)]
                    return Bike_Object
                else:
                    print('Wrong input')
            except:
                print('Creat the Bike Object First')


if __name__ == "__main__":
    Bike_Object = []
    for i in range(int(input())):
        val = Bike.createBike(input())
        vin = val[0]
        brand = val[1]
        model = val[2]
        enginedisplacement = val[3]
        breaksystem = val[4]
        cost = float(val[5])
        Bike_Object.append(Bike(vin,brand,model,enginedisplacement,breaksystem,cost))
    print()
    print('{:<20}{:<10}{:<10}{:<20}{:<12}{:<12}'.format('vin','brand','model','enginedisplacement','breaksystem','cost'))
    for i in Bike_Object:
        i.getter()
    print()
    Bike_Object = Bike_Object[0].EngineDisplacementComparator(Bike_Object)
    print()
    print('{:<20}{:<10}{:<10}{:<20}{:<12}{:<12}'.format('vin','brand','model','enginedisplacement','breaksystem','cost'))
    for i in Bike_Object:
        i.getter()
    print()
    Bike_Object = Bike_Object[0].EngineDisplacementComparator(Bike_Object)
    print()
    print('{:<20}{:<10}{:<10}{:<20}{:<12}{:<12}'.format('vin','brand','model','enginedisplacement','breaksystem','cost'))
    for i in Bike_Object:
        i.getter()
    print()