n = 5
a,b=0,1
if n < 0: 
    print("Incorrect input") 
elif n == 0: 
    print(a) 
elif n == 1: 
    print(b) 
else: 
    for i in range(2,n): 
        a,b = b,a+b 
        print(a)