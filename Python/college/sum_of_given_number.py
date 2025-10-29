size_of_array = int(input())
outer_list  = [] 
sum_of_list = 0
for i in range(size_of_array):
    val = list(input())
    outer_list.append(val)
print(outer_list)    
for i in range(len(outer_list)):
    if outer_list[i][0] == '-':
        for j in range(1,len(outer_list[i])):
            sum_of_list += int(outer_list[i][j])
        print('-',sum_of_list)
        sum_of_list = 0
    else:
        print(sum(map(int,outer_list[i])))