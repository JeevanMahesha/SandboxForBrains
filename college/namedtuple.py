import collections as c 
l = []
for i in range(int(input())):
    student = c.namedtuple('Student',['ID','MARKS','NAME','CLASS'])
    s = input().split()
    s = student(s[0],s[1],s[2],s[3])
    l.append(int(s.MARKS))
print(sum(l)/len(l))