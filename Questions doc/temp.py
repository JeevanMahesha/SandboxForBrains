a =[1,2,1,2,3,2]
c = 0
for i in range(len(a)):
    for j in range(len(a)):
        if a[i] == a[j]:
            c+=1
print(c)