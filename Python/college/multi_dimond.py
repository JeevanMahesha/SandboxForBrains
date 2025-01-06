n = 3
temp,od,ch = n,0,65
for i in range(n):
    ch=65+i
    for j in range(i,n+1-1):
        print(end=" ")
    for k in range(i+1):
        print('*',end="")
    print(end=" ")
    for l in range(i+1):
        print(chr(ch),end="")
        ch+=1
    print()
for i in range(n-1,-1,-1):
    for j in range(i,n+1-1):
        print(end=" ")
    for k in range(i+1):
        print(temp,end="")
        temp-=1
    temp = n
    print(end=" ")
    for l in range(od,(n*2)):
        if l % 2 !=0:
            print(l,end="")
    od+=2
    print()