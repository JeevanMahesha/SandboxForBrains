n1 = int(input('Enter the first number\n'))
n2 = int(input('Enter the second number\n'))
a = 0
for i in range(1,1000):
    if i % n1 == 0 and i % n2 == 0:
        print('LCM',i)
        break

for i in range(1,1000):
    if n1 % i == 0 and n2 % i == 0:
        a = i    
print('GCM',a)
        


