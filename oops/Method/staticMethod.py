class d:
    def __init__(self,n):
        self.name = n
    
    def getter(self):
        print(self.name)
        
    @staticmethod
    def stm():
        n = input()
        return n

if __name__ == "__main__":
    dobj = d(d.stm())
    dobj.getter()