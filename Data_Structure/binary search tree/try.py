class Node:
    def __init__(self, data = None):
        self.Data  = data
        self.right = None
        self.left  = None


def AddNode(root,NewData):
    if root is not None:
        TempValue  = root
        ParentNode = TempValue 
        while TempValue is not None:
            ParentNode = TempValue
            if TempValue.Data>NewData:
                TempValue = TempValue.right
            else:
                TempValue = TempValue.left
        if ParentNode.Data > NewData:
            ParentNode.right = Node(NewData)
            return root
        else:
            ParentNode.left  = Node(NewData)
            return root
    else:
        root = Node(NewData)
        return root

  
def InOrder(root):   
    if root is not None:
        InOrder(root.left)
        print(root.Data,end=" ")
        InOrder(root.right)
        
            
    
if __name__ == "__main__":
    root = None
    root = AddNode(root,20)
    root = AddNode(root,15)
    root = AddNode(root,18)
    root = AddNode(root,35)
    
    InOrder(root)