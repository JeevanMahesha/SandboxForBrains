import re 
class Main:
    def __init__(self,vin):
        self.__VIN = vin

    def validateVIN(self):
       output_match = re.match(r'^[A-Z0-9]{3}[A-Z]{2}[0-9]{1}[A-Z0-9]{1}[0-9]{2}[A-Z0-9]{2}[0-9]{6}$',self.__VIN)
       print('VIN is valid') if output_match else print('VIN is invalid') 

if __name__ == "__main__":
    vin1 = Main("ME1CF2384HN874621")
    vin1.validateVIN()

    vin2 = Main("MD24H4341JD471245")
    vin2.validateVIN()