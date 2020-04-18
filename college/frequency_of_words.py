import collections as c 
data = 'New to Python or choosing between Python 2 and Python 3? Read Python 2 or Python 3.'
data = data.split()
sapreted_data = c.Counter(data)
sapreted_data = dict(sapreted_data)
for k,v in sorted (sapreted_data.items()):
    print(k,':',v)

"""
----------- OUTPUT -------------

2 : 2
3. : 1
3? : 1
New : 1
Python : 5
Read : 1
and : 1
between : 1
choosing : 1
or : 2
to : 1

"""