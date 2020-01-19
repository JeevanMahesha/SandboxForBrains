n = 5
c = 1
for row in range(1, n+1):
    for col in range(n-row+1):
        print(c, end=" ")
        c += 1
    print()
for row in range(1, n+1):
    for i_col in range(1, row+1):
        print(c, end=" ")
        c += 1
    print()
