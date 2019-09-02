num =int(input('Enter the pattran size\n'))
star = '*'
for i in range(1,num+1):
    for j in range(0,i+1):
        if i == j:
            print(' ',star,end='')
        else:
            print(' ',end='')
    print()
   

for i in range(num-1,0,-1):
    for j in range(0,i+1):
        if i == j:
            print(' ',star,end='')
        else:
            print(' ',end='')
    print()