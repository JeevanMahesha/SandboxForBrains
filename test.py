import copy
maze = [
    [0,0,0,0,0],
    [0,1,0,1,0],
    [0,0,1,0,0],
    [0,0,0,0,1],
    [1,1,1,0,0]
]
SIZE= len(maze)
d=0
ans=[]
mindis=[]
solution = [[0]*SIZE for _ in range(SIZE)]

def solvemaze(l,r):
    global d
    if l==SIZE-1 and r==SIZE-1:
        d+=1
        solution[l][r]=1
        mindis.append(d)
        ans.append(copy.deepcopy(solution))
        if(d not in mindis):
            return True
        d-=1
        return False

    if l<SIZE and r<SIZE and l>=0 and r>=0 and solution[l][r]==0 and maze[l][r]==0:
        solution[l][r]=1
        d+=1
        if solvemaze(l+1,r):
            return True
        if solvemaze(l-1,r):
            return True
        if solvemaze(l,r+1):
            return True
        if solvemaze(l,r-1):
            return True
        solution[l][r]=0
        d-=1
        return False
    return 0

if solvemaze(0,0)==True:
    pass
else:
    if(mindis==[]):
        print("no solution")
    else:
        print(min(mindis))
        for i in ans[mindis.index(min(mindis))]:
            print(i)
