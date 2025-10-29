def array_special_product(arr):
    lst = []
    a = 1
    for i in range(len(arr)):
        for j in range(len(arr)):
            if arr[i] != arr[j]:
                a = a * arr[j]
        lst.append(a)
        a = 1 
    return lst
    


arr = [1,2,3,4,5]
a = array_special_product(arr)
print(a)
