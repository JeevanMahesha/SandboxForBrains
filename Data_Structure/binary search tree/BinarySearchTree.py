class Node:
    def __init__(self, data = None):
        self.Data  = data
        self.right = None
        self.left  = None

class BinarySearchTree:
    def __init__(self):
        self.root = None
    
    def AddNode(self,NewData):
        if self.root is not None:
            TempValue  = self.root
            ParentNode = TempValue 
            while TempValue is not None:
                ParentNode = TempValue
                if TempValue.Data>NewData:
                    TempValue = TempValue.right
                else:
                    TempValue = TempValue.left
            if ParentNode.Data > NewData:
                ParentNode.right = Node(NewData)
            else:
                ParentNode.left  = Node(NewData)
        else:
            self.root = Node(NewData)

    def InOrder(self):   
        if self.root is not None:
            self.InOrder(self.root.left)
            print(self.root.Data)
            self.InOrder(self.root.right)
            

    
if __name__ == "__main__":
    BinarySearchTreeObject = BinarySearchTree()
    BinarySearchTreeObject.AddNode(20)
    BinarySearchTreeObject.AddNode(15)
    BinarySearchTreeObject.AddNode(18)
    BinarySearchTreeObject.AddNode(35)
    BinarySearchTreeObject.InOrder()