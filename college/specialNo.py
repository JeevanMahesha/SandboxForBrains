num = int(input('Enter the number\n'))
a = num // 10
b = num % 10

add = a+b
mul = a*b

total = add + mul
if total == num:
    print('Special Number')
else:
    print('not Special Number')