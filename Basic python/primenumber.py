"""
find prime number 
a number that is divisible only by itself and 1 (e.g. 2, 3, 5, 7, 11). 
"""
num =eval(input('Enter the Number to check its prime or not\n'))
if num == 1 or num == 2:
    print('Its nither a prime number nor not')
elif num % 2 == 0:
    print('Its not a prime number')
else:
    print('Its a prime number')