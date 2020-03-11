import random as r
import string 
""" for i in range(4):
    l = string.ascii_lowercase
    a = ''.join(r.choice(l) for i in range(2))
    b = str(r.randint(0000,9999))
    print(a+b) """
l = string.ascii_lowercase
n = 10 ** 2
print(n)
a = ''.join(r.choice(l) for i in range(10**5))
print(a)