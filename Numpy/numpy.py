import numpy as np 
l = [1,2,3]
a = np.array([1,2,3])
print(a) #123 output

result = a + np.array([4,5,6])
print(result) # output 579
"""
The Above code will add the two array as vector 
example 
    a = [1,2,3]
    b = np.array([4,5,6])
    result = a + b ([1+4,2+5,3+6])
    result = [5 7 9]
"""

l2 = [e + 2 for e in l ]
print(l2) # [3, 4, 5]

num = 2+a
print(num) # [3, 4, 5]

#power

l2 = [e**2 for e in l]
print(l2)

num =  