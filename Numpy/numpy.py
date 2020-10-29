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
print(l2) #[1, 4, 9]

num =  a**2
print(num)  # [1, 4, 9]

print(np.sqrt(a)) # give the squrt of all element in array
print(np.exp(a)) # give the exponential of all element of array
print(np.log(a)) # give the logarithmic of all element of array
print(np.tan(a)) # give the tan of all element of array

#========================================================================

# Dot Product
a1 = np.array([1,2,3])
b1= np.array([4,5,6])
d = 0
for i,j in zip(a1,b1):
    d+=i*j
print(d) #32


d = sum(a1*b1)
print(d) #32 
    #or
dd = (a1*b1).sum()
print(dd) #32
  #or 
print(a1.dot(b1)) #32
    #or
print(a1 @ b1)   #32
