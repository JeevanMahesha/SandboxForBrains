def avg(l):
    return sum(l)/len(l)


n = 0
while n<2:
    try:    
        name = input()
        l = []
        for i in range(1,4):
            mark = int(input())
            l.append(mark) 
        print(avg(l))
        n+=1
    except ValueError:
        print('error')
        break
