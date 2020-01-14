d = dict()
for i in range(6):
    val = input().split()
    l = [i for i in val if i.isdigit()]
    val.remove(l[0])
    val = ' '.join(val)
    l = ''.join(l)
    d[val]=l
print(d)

""" ans = dict()

for k,v in d.items():
    for tk,tv in d.items():
        if k == tk :
           total =  int(v)+int(tv)
           ans[k]=total
ans = {k:v for k,v in sorted(ans.items())}
print(ans) """