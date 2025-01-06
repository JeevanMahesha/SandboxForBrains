l1=[1,2,3,4,5,6,7,8,9,0]
l2=[1,2,3,4]
l3=[]
count=0
for i in range (len(l1)):
    if l1[i] in l2:
        l3.append(l1[i])
        count += 1
    else:
        continue
if len(l3) == count:
    print('TRUE')
else:
    print('FALSE')
    
