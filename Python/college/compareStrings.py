str1 = input('Enter the first string\n')
str2 = input('Enter the second string\n')

if len(str1) <= 50 and len(str1) <= 50:
    if str1 == str2:
        print('Strings are equal')
    else:
        print('Strings are not equal')
else:
    print('Enter the string less than 50 characters')