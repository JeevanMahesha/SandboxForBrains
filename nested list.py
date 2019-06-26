n = eval(input())
arr=[]
lst=[]
lst1=[]
dlst=[]
rlst=[]
for i in range (n):
    lst=[]
    arr.append(lst)
    for j in range (1):
        val=input()
        lst.append(val)
        for j in range (1):
            val=eval(input())
            lst.append(val)
arr.sort(key = lambda x:x[1])
for i in range(len(arr)):
    lst1.append(arr[i][1])
for i in range (len(lst1)):
    if lst1[i] not in dlst:
        dlst.append(lst1[i])
for i in range (len(arr)):
    if dlst[1] == arr[i][1]:
        rlst.append(arr[i])
rlst.sort()
for i in range (len(rlst)):
    print(rlst[i][0])
        

