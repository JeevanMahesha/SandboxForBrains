n = 5
for row in range(1, n + 1):
    for col_space in range(n - row):
        print(end="  ")
    for col in range(1, row + 1):
        print("*", end=" ")
    print()
