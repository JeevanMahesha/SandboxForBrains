n = ['{', '(', ')', '}', '[', ']']
open_brackets = ['{','(','[']
close_brackets = ['}',')',']']
map = dict(zip(open_brackets,close_brackets))
q = []
for i in n:
    if i in open_brackets:
        q.append(map[i])
    elif i in close_brackets:
        if not q or i != q.pop():
            a =  False
a = True
if a == True:
    print('Balanced')
else:
    print('Not Balanced')