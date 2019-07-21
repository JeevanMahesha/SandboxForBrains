import numpy as np

intial = np.array([[1,5,2],[4,6,0],[8,7,3]])
print(intial)

goal = np.array([[1,2,3],[4,5,6],[7,8,0]])
visited=np.array[[]]

#value = 0

for i in range(3):
    for j in range(3):
        if (intial[i,j] == 0):
            r=i
            c=j
            print(r)
            print(c)
        break;

def right(r,c):
    print[intial]
    intial[r,c],intial[r,c+1] = intial[r,c+1],intial[r,c]
    checkgoal(r,c)
    print[intial]
   
   
 
   
def left(r,c):
    intial[r,c],intial[r,c-1]= intial[r,c-1],intial[r,c]
    print[intial]
   
   
def top(r,c):
    intial[r,c],intial[r-1,c]= intial[r-1,c],intial[r,c]
    print[intial]
   
   
def down(r,c):
    intial[r,c],intial[r+1,c]= intial[r+1,c],intial[r,c]
    print[intial]


def checkgoal(r,c):
    if(intial ==  goal):
        print("Game Over")
    else:
        visted=np.visted.append(intial)
    if intial in visted:

       
   
       
       
       # print(intial)



def moves(r,c):
    if (r==0):    
        if(c==0):
            right(r,c)
            down(r,c)
        if(c==1):
            left(r,c)
            right(r,c)
            down(r,c)
        if(c==2):
            left(r,c)
            down(r,c)
    if(r==1):
        if(c==0):
            top(r,c)
            right(r,c)
            down(r,c)
        if(c==1):
            top(r,c)
            left(r,c)
            right(r,c)
            down(r,c)
        if(c==2):
            left(r,c)
            down(r,c)
            top(r,c)
    if(r==2):
        if(c==0):
            top(r,c)
            right(r,c)
   
        if(c==1):
            top(r,c)
            left(r,c)
            right(r,c)
       
        if(c==2):
            left(r,c)
            top(r,c)