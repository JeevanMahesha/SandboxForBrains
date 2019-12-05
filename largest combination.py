def permute(seq):

    if len(seq) <= 1:
        perms = [seq]
    else:
        perms = []
        for i in range(len(seq)):
            sub = permute(seq[:i]+seq[i+1:]) 
            for p in sub:    
                perms.append(seq[i:i+1]+p)

    return perms
x=[7,76,10,415]
n=[]
z=permute(x)
for i in z:
    s=''
    for j in i:
        s=s+str(j)
    n.append(int(s))
print(max(n))
