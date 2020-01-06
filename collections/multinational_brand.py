import collections as c
val = input()
val = dict(c.Counter(val))
val = [(k, v)
       for k, v in sorted(val.items(), key=lambda k: k[1], reverse=True)]
val = val[:3:]
ans = []
for i in range(len(val)-1):
    if val[i][1] == val[i+1][1]:
        if val[i][0] > val[i+1][0]:
            ans.append(val[i+1])
        else:
            ans.append(val[i])
    else:
        ans.append(val[i])
print(ans)
