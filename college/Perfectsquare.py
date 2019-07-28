num = int(input('Enter the number\n'))
a = 0
for i in range(num):
    if  i * i == num:
        a = 1 
        break
    else:
        a = 0
if a == 1:
    print('Perfect square')
else:
    print('its not Perfect square')



