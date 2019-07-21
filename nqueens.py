import numpy as np

inital = np.array([[1,2,3],[4,0,6,],[7,8,5]])

goal =np.array([[1,2,3],[4,5,6,],[7,8,0]])

for i in range(3):
    for j in range(3):
        if (inital[i,j] == 0):
            r = i
            c = j
            print(inital[i,j])
            print(i,j)
            break

lst = np.equal(inital,goal)

if lst[0] == lst[1]:
    print('Game over')
else:
    print('End game')  
        
def right(r,c):
    temp = inital[r,c]
    inital[r,c] = inital[r,c+1]
    inital[r,c+1] = temp

right(r,c)


