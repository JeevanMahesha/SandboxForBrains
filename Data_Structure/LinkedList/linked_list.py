class Node:
    def __init__(self,val=None):
        self.DataValue = val
        self.NextValue = None
    
class LinkedList():
    def __init__(self):
        self.HeadValue = None
    
    def listprint(self):
        printval = self.HeadValue
        while printval is not None:
            print (printval.DataValue)
            printval = printval.NextValue
if __name__ == "__main__":    
    LinkedListObject = LinkedList()
    LinkedListObject.HeadValue = Node('Monday')
    obj1 = Node('Tuesday')
    obj2 = Node('Wednesday')
    LinkedListObject.HeadValue.NextValue = obj1
    obj1.NextValue = obj2
    LinkedListObject.listprint()