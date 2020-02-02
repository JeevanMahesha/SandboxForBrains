n = 3
for row in range(1,n+n):
    for col in range(1,n+n):
        if col==n or row==n and col%2 ==0 :
            print("*",end=" ")
        else:
            print("-",end="")
    print()