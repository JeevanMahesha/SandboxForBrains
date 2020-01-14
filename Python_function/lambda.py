import functools as fn 

# normal function declaration and function call 

def mul(n):
    return n **2
print(mul(3))

# passing the single arg
f = (lambda x:x**2)(4)
print(f)

# passing the multiple arg 
f = (lambda x,y:x*y)(4,5)
print(f)

# map function  
l = [1,2,3,4,5]
l = tuple(map( lambda x:x**10,l))
print(l)

# map in list comphen
l = [i for i in range(1,10) ]
l = list(map((lambda i:i**1),l))
print(l)

# filter function 
l = [1,2,3,4,5,2,2,5,4,3,5,4,3,2,3,4,5,2,21,3,4,2]
l = list(filter((lambda x : x*2 > 5),l))
print(l)

# filter function  Will remove the empty space
l = [1,2,3,4,'','',5,6,'','',7,5,4,3,2,'','']
l = list(filter(None,l))
print(l)

# reduce function
l = [1,2,3,4,5]
l = fn.reduce((lambda x,y : x*y),l)
print(l)

# yeild
def add():
    l = [i for i in range(1,10) ]
    l = list(map((lambda i:i**1),l))
    yield l
print(list(add()))