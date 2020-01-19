n = 6
for row in range(1, n+1):
    c = 1
    for col in range(1, n+1):
        if row == n-n+1 or n == row+col-1 or row == n:

            print(c, end=" ")
        else:
            print(' ', end=" ")
        c += 1
    print()
