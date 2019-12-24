n = 5
row = 2 * n - 2
for i in range(n,-1,-1):
    for j in range(row):
        print(end="")
    row -=2
    for k in range(i+1):
        print('*',end=" ")
    print()
    
