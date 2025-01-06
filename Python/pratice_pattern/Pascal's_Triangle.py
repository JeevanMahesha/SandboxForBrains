n = 5
for row in range(1, n + 1):
    num = 1
    for col in range(1, row + 1):
        print(num, end=" ")
        num = num * (row - col) // col
    print()
