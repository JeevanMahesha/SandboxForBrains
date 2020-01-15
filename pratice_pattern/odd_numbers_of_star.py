n = 5
c = 1
for row in range(1, n + 1):
    for col_spc in range(n - row):
        print(end=" ")
    for col in range(1, c + 1):
        print(c, end="")
    c += 2
    print()
