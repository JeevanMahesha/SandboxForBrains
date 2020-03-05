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
    LinkedListObject.HeadValue = Node('days')

    obj = []
    for i in range(int(input('Enter the Number of day\n'))):
        obj.append(Node(input()))
        
    LinkedListObject.HeadValue.NextValue = obj[0]

    for i in range(len(obj)-1):
        obj[i].NextValue = obj[i+1]
    print()
    LinkedListObject.listprint()