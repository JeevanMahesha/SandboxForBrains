hx =input()
hx = hx[1:]
l =[]
for i in range(0,len(hx)-1,2):
    s = hx[i]+hx[i+1]
    l.append(s)
for i in range(len(l)):
    print(int(l[i],16))