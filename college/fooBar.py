num = int(input('Enter the number\n'))

if num % 3 == 0 and num % 5 == 0:
    print('fooBar')
elif num % 3 == 0:
    print('foo')
elif num % 5 == 0 :
    print('Bar')
else:
    print('None')