n = 5
row = 2 * n - 2
for i in range(n):
    for j in range(row):
        print(end=" ")
    row -=2
    for k in range(i+1):
        print('*',end=" ")
    print()
    
