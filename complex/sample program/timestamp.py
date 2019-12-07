"""
num_of_entery = int(input('Enter the number\n'))
inner_lst = []
outer_lst = []

for i in range(num_of_entery):
    time = input('Enter the time\n')
    empy = input('Enter the empy\n')
    enter = input('Enter or Exit\n')
    inner_lst.extend([time,empy,enter])
    outer_lst.append(inner_lst)
    inner_lst = []



[[830,2,'enter'],
[930,4,'enter'],
[1000,0,'exit'],
[1030,2,'exit'],
[1100,7,'exit']]

print(outer_lst)
"""

array_of_input =[[830,2,'enter'],[930,4,'enter'],[1000,0,'exit'],[1030,2,'exit'],[1100,7,'exit']]
in_time_lst =[]
out_time_lst =[]
member = 0
member_lst =[]
for i in range(5):
        if array_of_input[i][2] == 'enter':
                member += array_of_input[i][1]
                in_time_lst.append(array_of_input[i][0])
        else:
                member_lst.append(member)
                out_time_lst.append(array_of_input[i][0])
                member -= array_of_input[i][1]
max_member = max(member_lst)
max_index = member_lst.index(max_member)
print(member_lst[max_index])
print(in_time_lst[max_index])
print(out_time_lst[max_index])

            