n = int(input())
l = list()
for i in range(n):
    l.append(int(input()))
x = int(input())
less = sorted([l[i] for i in range(len(l)) if l[i] < x],reverse=True)
equal = [l[i] for i in range(len(l)) if l[i] == x]
grt = sorted([l[i] for i in range(len(l)) if l[i] > x],reverse=True)
print(less + equal + grt)
