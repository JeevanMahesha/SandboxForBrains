"""
Factorial Number

 the factorial of a non-negative integer n, denoted by n!, 
 is the product of all positive integers less than or equal to n. 
 For example, 5 ! = 5 × 4 × 3 × 2 × 1 = 120

"""
num = eval(input("Enter the number to find the factorial\n"))
fact = 1
for i in range(1,num + 1):
   fact = fact * i
print("The factorial of number {} is {}".format(num,fact))
