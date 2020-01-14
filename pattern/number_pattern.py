n = 5
c =1
for i in range(n):
    for j in range(i+1):
        print(c,end="")
        c+=1
        if j != i :
            print('*',end="")
    print()
for i in range(n-1,-1,-1):
    for j in range(i+1):
        c-=1
        print(c,end="")        
        if j != i :
            print('*',end="")
    print()
