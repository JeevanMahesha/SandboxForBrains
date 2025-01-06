n = 6
c = 1
for row in range(1, n + 1):
    for col_space in range(n - row):
        print(end="    ")
    for col in range(1, c + 1):
        print('*', end=" ")
    c += 2
    print()
