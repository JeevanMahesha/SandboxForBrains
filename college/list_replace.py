size = eval(input('Enter the size of list\n'))
lst=[]
lst1=[0,1,2,3,4,5,6,7,8,9]
lst2=[]
for i in range(size):
    num = eval(input('Enter the number\n'))
    lst.append(num)
print(lst)

for i in range(len(lst1)):
    if lst1[i] not in lst:
        lst2.append(-1)
    else:
        lst2.append(lst1[i])
print(lst2)    