class Graph(object):
    def __init__(self, size):
        self.adjMatrix = []
        for i in range(size):
            self.adjMatrix.append([0 for i in range(size)])
        self.size = size

    def addEdge(self, v1, v2):
        if v1 == v2:
            print("Same vertex %d and %d" % (v1, v2))
        self.adjMatrix[v1][v2] = 1
        self.adjMatrix[v2][v1] = 1

    def removeEdge(self, v1, v2):
        if self.adjMatrix[v1][v2] == 0:
            print("No edge between %d and %d" % (v1, v2))
            return
        self.adjMatrix[v1][v2] = 0
        self.adjMatrix[v2][v1] = 0

    def containsEdge(self, v1, v2):
        return True if self.adjMatrix[v1][v2] > 0 else False

    def __len__(self):
        return self.size
        
    def toString(self):
        a=[i for i in range(len(self.adjMatrix[0]))]
        for i in a:
            print('{:6}'.format(i),end="")
        print()
        c=0
        for row in self.adjMatrix:
            print(a[c],end=" ")
            for val in row:
                print('{:4}'.format(val),end=' ')
            print()
            c+=1  
def main():
        g = Graph(5)
        g.addEdge(0, 1);
        g.addEdge(0, 2);
        g.addEdge(1, 2);
        g.addEdge(2, 0);
        g.addEdge(2, 3);
    
        g.toString()
            
if __name__ == '__main__':
   main()
