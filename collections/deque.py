import collections as c 

de  = c.deque([1,2,3])
de.extendleft([7,8,9])
print(de)

#-----------------------------------------------------------
a = dict()
a = c.defaultdict(int)
print(a[0])

#--------------------------------------------------------------
count = c.defaultdict(int)

name_list = 'Mike Jhon Mike Anna Mike Jhon Jhon Mike Mike Britney Smith Anna Smith'.split()
for name in name_list:
    count[name] +=1
print('Executed')