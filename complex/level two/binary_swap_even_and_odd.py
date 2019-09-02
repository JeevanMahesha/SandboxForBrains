num = int(input('Enter the number\n'))
binary = bin(num)
lst = list(binary[2::])
for i in range(0,len(lst),2):
    lst[i],lst[i+1] = lst[i+1],lst[i]
var = ''
k = var.join(lst)
print(int(k,2))