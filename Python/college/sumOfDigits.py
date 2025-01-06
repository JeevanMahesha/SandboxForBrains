num = input('Enter the number\n')
lst=list(num)
lst1=[]
for i in range(len(lst)):
    lst1.append(int(lst[i]))
print(sum(lst1))  
