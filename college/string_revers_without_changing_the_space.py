s = 'itvsc rocks'
rev_s = s[::-1] 
rev_s = rev_s.split()
rev_s = ''.join(rev_s)
rev_s = list(rev_s)
n = 0
l = list(s)
final=[]
for i in range(len(l)):
    if l[i].isspace():
        final.append(l[i])
    else:
        final.append(rev_s[n])
        n+=1
print(''.join(final))
