n = 4
# ---------- method 1

for row in range(1, n + 1):
    for col in range(1, n + 1):
        if(col < row):
            print(' ', end='  ')
        else:
            print('*', end='  ')
    print()


# ---------- Method 2
for row in range(n + 1 - 1, -1, -1):
    print((n - row) * " " + row * "*")


# ----------- mathod 3
n = int(input("Enter the number of rows: "))
for i in range(1, n+1):
    for j in range(1, i):
        print(end=" ")
    for j in range(i, n+1):
        print("*", end="")
    print()
