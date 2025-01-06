n=int(input())
a=0
lst=[]
dummylst=[]
while(a<n-1):
    opp=input()
    lstsplit=opp.split()
    if lstsplit[0] == 'insert':
        lst.insert(int(lstsplit[1]),int(lstsplit[2]))
        a+=1        
    elif lstsplit[0] == 'remove':
        lstsplit.remove(lstsplit[0])
        lst.remove(int(lstsplit[0]))
        a+=1
    elif lstsplit[0] == 'append':
        lstsplit.remove(lstsplit[0])
        lst.append(int(lstsplit[0]))
        a+=1
    elif lstsplit[0] == 'sort':
        lst.sort()
        a+=1
    elif lstsplit[0] == 'pop':
        lst.pop()
        a+=1
    elif lstsplit[0] == 'reverse':
        lst.reverse()
        a+=1
    elif lstsplit[0] == 'print':
        print(lst)
        a+=1

