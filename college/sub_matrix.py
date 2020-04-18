l = [
    [1,2,3],
    [4,5,6],
    [7,8,9]
    ]
    
n1 = 1
n2 = 2
m1 = 2
m2 = 3
summ = 0

for  i in range(n1-1,m1):
       for j in range(n2-1,m2):
              summ += l[i][j]
print(summ)

#-----------------------------------


l = {
     1:[1,2,3],
     2:[4,5,6],
     3:[7,8,9]
    }
    
n1 = 1
n2 = 2
m1 = 2
m2 = 3

summ = 0

print('normal')
for  k,v in l.items():
    if k == n1 or k == m1:
        for j in range(n2-1,m2):
            summ += v[j]
print(summ)

print()

print('list comprehension python')
print(sum([ v[j]  for k,v in l.items() if k == n1 or k == m1  for j in range(n2-1,m2) ]))
