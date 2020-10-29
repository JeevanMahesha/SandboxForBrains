n = int(input())
val = input().split()
l = [str(i) for i in range(1,n+1) if str(i) not in val]
if l != [] :
    print(' '.join(l))
else:
    print(-1)