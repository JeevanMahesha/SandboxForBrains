n = 6
for i in range(n,0,-1):
    for j in range(i):
        print(((i*(i-1)//2)+1)+j,end=" ")
    print()
    """
    16 17 18 19 20 21 
    11 12 13 14 15    
    7 8 9 10 
    4 5 6 
    2 3 
    1
    """
