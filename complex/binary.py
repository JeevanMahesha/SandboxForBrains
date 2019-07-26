num = int(input('Enter the number\n'))
binary_number = bin(num)[2:]
binary_string = str(binary_number)
lst = []
c= 0
for i in binary_string:
        if i == "0":
                c+=1
        else:
                lst.append(c)
                c = 0
print(max(lst))