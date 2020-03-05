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

#==================================================
dic1 = {'a':1,'b':2}
dic2 = {'b':3,'c':4}
chain = c.ChainMap(dic1,dic2)
print(list(chain.keys()))
print(list(chain.values()))

