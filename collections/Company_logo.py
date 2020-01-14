import collections as c
val = 'bbbccaaadeeee'
val = sorted(val)
val = dict(c.Counter(val))
val = [(k, v)
       for k, v in sorted(val.items(), key=lambda k: k[1], reverse=True)]
val = val[:3:]
print(val)
