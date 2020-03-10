def exp(value):
    print()
    temp,expr = list(),list()
    for i in value:
        if i.isdigit():
            temp.append(i)
        else:
            expr.append(i)
    for i in range(len(temp)):
        if len(temp)>1:
            a = int(temp.pop())
            b = int(temp.pop())
            opt = expr.pop()
            if opt == '+':
                temp.append(a+b)
            elif opt == '-':
                temp.append(a-b)
            elif opt == '*':
                temp.append(a*b)
            elif opt == '/':
                temp.append(a/b)
    print(temp)

value = '10 + 2 * 6'.split()
exp(value)