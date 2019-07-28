num = int(input('Enter the number\n'))

binary_number = bin(num)[2:]

binary_string = str(binary_number)
lst = []
c= 0
print(binary_number)
for i in binary_string:
    if i == "0":
        c+=1
    elif i == '1':
        lst.append(c)
        c = 0
    else:
        print('its not binary number')

