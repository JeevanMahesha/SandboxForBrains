num = input('Enter the number\n')
lst = list(num)
lst1=[]
for i in range(len(lst)):
    a = int(lst[i])
    lst1.append(a)
var = lst1[-2]

if len(lst1) == 3:
    if var % 3 == 0:
        print('trendy number')
    else:
        print('its not trendy number')
else:
    print('Enter the 3 digit number')