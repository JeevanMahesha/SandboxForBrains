n = 5
temp=1
row = 2 * n - 2
for i in range(n):
    for j in range(row):
        print(end=" ")
    row = row -2
    for k in range(temp):
        print('*',end=" ")
    print('\r')
    temp+=2