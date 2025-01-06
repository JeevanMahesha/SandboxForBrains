def minimun_amount(n):
    l=[1,5,10,25]
    length_of_list = len(l)-1
    ans = list()
    while(length_of_list>=0):
        while(n>=l[length_of_list]):
            n-=l[length_of_list]
            ans.append(l[length_of_list])
        length_of_list-=1
    print(ans)
n = 16
minimun_amount(n)