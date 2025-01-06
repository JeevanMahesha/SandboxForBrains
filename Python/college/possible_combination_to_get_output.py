# ------------------------------------ Type 1
import operator as o
op = [o.add,o.sub,o.mul,o.floordiv]
v = ['+','-','*','/']
l = [10,5,2]
ans=[]
temp=[]
for i in range(len(op)):
    for j in range(len(op)):
        a = op[i](l[0],l[1])
        b = op[j](a,l[2])
        temp.append(l[0])
        temp.append(v[i])
        temp.append(l[1])
        temp.append(v[j])
        temp.append(l[2])
        temp.append('=')
        temp.append(b)
        ans.append(temp)
        temp=[]
    
for i in ans:
    print(i)
        
#------------------------------------------- Type 2
import operator as o
op = [o.add,o.sub,o.mul,o.floordiv]
v = ['+','-','*','/']
l = [2,2,3]
t = 3
for i in range(len(op)):
    for j in range(len(op)):
        a = op[i](l[0],l[1])
        b = op[j](a,l[2])
        if b == t:
            print("{} {} {} {} {} {} {}".format(l[0],v[i],l[1],v[j],l[2],'=',b))
            break
