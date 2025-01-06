class Device:
    def __init__(self,name,connected_by):
        self.name = name
        self.connected_by = connected_by
        self.connection = True
    
    def __str__(self):
        return f"The {self.name} is connected by {self.connected_by}"

    def disconnection(self):
        self.connection = False
        print('Device is Disconnected')

class Printer(Device):
    def __init__(self,name,connected_by,capacity):
        super().__init__(name,connected_by)
        self.capacity = capacity
    
    def __str__(self):
        return f"{super().__str__()} and its capacity is {self.capacity}"

    def print_page(self,pages):
        if not self.connection:
            print(f'{self.name} is not connected')
            return
        else:
            print(f"{pages} are printed")
            self.capacity -=pages
    
if __name__ == "__main__":
    printer = Printer('Printer','USB',500)
    printer.print_page(30)
    print(printer)
    printer.disconnection()
    printer.print_page(300)


    