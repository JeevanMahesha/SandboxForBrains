n = int(input())
for i in range(n):
    num = int(input())
    l= []
    for val in range(2, num + 1): 
        for n in range(2, val): 
            if (val % n) == 0: 
                break
        else: 
            l.append(val)