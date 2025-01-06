arr = [64, 34, 25, 12, 22, 11, 90]
def bubblesort(arr):   
    for i in range(len(arr)):
        swap = False
        for j in range(len(arr)-i-1):
            if arr[j]>arr[j+1]:
                arr[j],arr[j+1] = arr[j+1],arr[j] 
                swap = True
        if swap == False:
            break
bubblesort(arr)
print(arr)