n = 5
for row in range(1, n+1):
    for col in range(1, n+1):
        if row == col or n == row+col-1:
            print('*', end="")
        else:
            print(end=" ")
    print()
