enval=eval(input())
enl=[]
frl=[]
rl=[]

val=input()
a = val.split()
a=range(enval)
print(a)

for i in range (len(a)):
    enl.append(int(a[i]))
print(enl)

fval=eval(input())

val=input()
a=val.split()
print(a)

for i in range (len(a)):
    frl.append(int(a[i]))
print(frl)

if len(enl)>len(frl):
    for i in range (len(enl)):
        if enl[i] not in frl:
            rl.append(enl[i])
        else:
            continue
    print(rl)
elif len(enl)<len(frl):
    for i in range (len(frl)):
        if frl[i] not in enl:
            rl.append(frl[i])
        else:
            continue
    print(rl)
