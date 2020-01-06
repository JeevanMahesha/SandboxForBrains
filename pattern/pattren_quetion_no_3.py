
def righttriangle(num):
    k = 2 * num - 2
    dig = 1
    for i in range(num):
        for j in range(k):
            print(end=" ")
        k -=2
        for i in range(i+1):
            print(dig,end=" ")
        print('\n')
        dig +=1 

num = 5
righttriangle(num)