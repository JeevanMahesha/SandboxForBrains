l=[1,1,2,2,3,3,4,4,5,5,5]
l1=[]
for i in range(len(l)):
    if l[i] not in l1:
        l1.append(l[i])
print(l1)
