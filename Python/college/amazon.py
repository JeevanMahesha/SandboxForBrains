n = list('a1b2c3d4')
a = []
d = []
a_t,d_t = [],[]
for i in n:
    if i.isalpha():
        d.append(''.join(d_t))
        d_t = []
        a_t.append(i)
    elif i.isdigit():
        a.append(''.join(a_t))
        a_t = []
        d_t.append(i)
d.append(''.join(d_t))
a = list(filter(None,a))
d = list(filter(None,d))
d = list(map(int,d))
for i in range(len(d)):
    for j in range(d[i]):
        print(a[i],end=" ")
    print()