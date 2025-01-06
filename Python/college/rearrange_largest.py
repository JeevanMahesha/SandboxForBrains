a = input().split()
max_num_in_list = len(max(a))+1
l1 = [(max_num_in_list*i[:max_num_in_list:] , i ) for i in a ]
l1.sort(reverse=True)
for i in range(len(l1)):
    print(l1[i][1],end="")