t = int(input())
for i in range(t):
    val = input().split()
    val = [list(val[i]) for i in range(len(val))]
    ans = list()
    for i in range(len(val)):
        if '9' not in val[i]:
            temp = list()
            for j in range(len(val[i])):
                if val[i][j].isdigit():
                    temp.append(val[i][j])
            ans.append(temp)
    ans = list(filter(None,ans))
    ans = [''.join(ans[i]) for i in range(len(ans))]
    for i in range(len(ans)):
        print(ans[i],end=" ")