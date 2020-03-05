class Node:
    def __init__(self,val=None):
        self.DataValue = val
        self.NextValue = None
    
class LinkedList():
    def __init__(self):
        self.HeadValue = None

    def Push(self):
        if self.HeadValue == None:
            self.HeadValue = Node(input())
        else:
            temp = self.HeadValue
            self.HeadValue = Node(input())
            self.HeadValue.NextValue = temp

    def Append(self):
        if self.HeadValue is None:
            self.HeadValue = Node(input())
        else:
            temp = self.HeadValue
            while (temp.NextValue):
                temp = temp.NextValue
            temp.NextValue = Node(input())

    def listprint(self):
        printval = self.HeadValue
        while printval is not None:
            print (printval.DataValue)
            printval = printval.NextValue

            
if __name__ == "__main__":    
    LinkedListObject = LinkedList()
    """ LinkedListObject.HeadValue = Node('days')

    obj1 = Node('Tuesday')
    obj2 = Node('Wednesday')
    LinkedListObject.HeadValue.NextValue = obj1
    obj1.NextValue = obj2
    LinkedListObject.listprint() """
    option = 0 
    while option <=4:
        option = int(input(' 1.Add Beging \n 2.Add in Between \n 3.Add End \n 4.display \n 5.exit \n'))
        if option == 1:
            LinkedListObject.Push()
        elif option == 2:
            print('btw')
        elif option == 3:
            LinkedListObject.Append()
        elif option == 4:
            LinkedListObject.listprint()
