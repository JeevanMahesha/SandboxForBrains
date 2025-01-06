n = '00100101'
num_list = list(map(int,n))
for i in range(len(num_list)):
    if num_list[i] == 1:
        for j in range(i,len(num_list)):
            print(num_list[j],end="")
        print()