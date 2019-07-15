n=eval(input())
d1={}
lst=[]
rd={}
lst1=[]
for i in range (n):
    key =input()
    a=key.split(" ")
    d1[a[0]] = a
    a.remove(a[0])
for k,v in d1.items():
    lst1=[]
    for i in range (len(v)):
        lst1.append(float(v[i]))        
        a=sum(lst1)
        total=a/3
    rd[k]=total
print(rd)
key=input()
print(rd[key])
