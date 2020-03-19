def plusMinus(arr):
    lz,gz,z = 0,0,0 
    for i in arr:
        if i<0:
            lz+=1
        elif i>0:
            gz+=1
        elif i ==0:
            z+=1
    print('{0:.5f}'.format(gz/len(arr)))
    print('{0:.5f}'.format(lz/len(arr)))
    print('{0:.5f}'.format(z/len(arr)))


if __name__ == '__main__':
    n = int(input())
    arr = list(map(int, input().rstrip().split()))
    plusMinus(arr)