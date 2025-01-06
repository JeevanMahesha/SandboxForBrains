from itertools import combinations_with_replacement as cwp
for _ in range(int(input())):    
    sizeofarray = int(input())
    array = list(map(int,input().split()[:sizeofarray]))
    k = int(input())
    for i,value in enumerate(list(cwp(array,2))):
        if sum(value)==k:
            print(array.index(value[0]),array.index(value[1]))
            break