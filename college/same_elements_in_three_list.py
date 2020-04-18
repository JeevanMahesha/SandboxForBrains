def commen_in_list(l1,l2,l3):
    l1 = set(l1)
    l2 = set(l2)
    l3 = set(l3)
    if l1 & l2 & l3 :
        a = l1 & l2 & l3
        a = list(map(str,a))
        a.sort()
        print(' '.join(a))
    else:
        print('no element')

l1 = [1,5,10,20,40,80]
l2  = [6,7,20,80,100]
l3 = [3,4,15,20,30,70,80,120]
commen_in_list(l1,l2,l3)