import textwrap

str1 = input("Enter the string\n")
num = int(input("Enter the number\n"))

data = textwrap.wrap(str1,num)


for i in data:
    print(i)
     