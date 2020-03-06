class Node:
    def __init__(self,val=None):
        self.DataValue = val
        self.NextValue = None
    
class LinkedList():
    def __init__(self):
        self.HeadValue = None
    
    def TempCreate(self):
       self.HeadValue = Node('Monday')
       obj1 = Node('Tuesday')
       obj2 = Node('Wednesday')
       obj3 = Node('Friday')
       self.HeadValue.NextValue = obj1
       obj1.NextValue = obj2
       obj2.NextValue = obj3

    def Push(self):
        if self.HeadValue == None:
            self.HeadValue = Node(input())
        else:
            temp = self.HeadValue
            self.HeadValue = Node(input())
            self.HeadValue.NextValue = temp

    def PushBetween(self):
        if self.HeadValue is not None :
            AfterValue = input()
            NewValue   = Node(input())
            TempValue = self.HeadValue
            while (TempValue.DataValue!=AfterValue):
                TempValue = TempValue.NextValue
                if TempValue.NextValue is None:
                    break
            if TempValue.NextValue is not None:
                NewValue.NextValue = TempValue.NextValue
                TempValue.NextValue = NewValue
            else:
                print('No Recored Found Link',AfterValue)
        else:
            print('Linked List is Empty')


    def Append(self):
        if self.HeadValue is None:
            self.HeadValue = Node(input())
        else:
            temp = self.HeadValue
            while (temp.NextValue):
                temp = temp.NextValue
            temp.NextValue = Node(input())

    def DeleteHead(self):
        if self.HeadValue is not None:
            TempValue = self.HeadValue.NextValue
            self.HeadValue = TempValue 
        else:
            print('Linked List is Empty')
    
    def DeletePeek(self):
        if self.HeadValue is not None:
            TempValue = self.HeadValue
            while TempValue.NextValue.NextValue is not None:

                TempValue = TempValue.NextValue
            TempValue.NextValue = None            
        else:
            print('Linked List is Empty')

    def listprint(self):
        printval = self.HeadValue
        while printval is not None:
            print (printval.DataValue)
            printval = printval.NextValue

            
if __name__ == "__main__":    
    LinkedListObject = LinkedList()
    option = 0 
    while option <=7:
        print()
        option = int(input(' 1.Add Beging \n 2.Add inBetween \n 3.Add End \n 4.display  \n 5.TempCreate \n 6.Delete Head \n 7.Delete Peek \n 8.exit \n '))
        print()
        if option == 1:
            LinkedListObject.Push()
        elif option == 2:
           LinkedListObject.PushBetween()
        elif option == 3:
            LinkedListObject.Append()
        elif option == 4:
            LinkedListObject.listprint()
        elif option == 5:
            LinkedListObject.TempCreate()
        elif option == 6:
            LinkedListObject.DeleteHead()
        elif option == 7:
            LinkedListObject.DeletePeek()
    print('Thank You')
