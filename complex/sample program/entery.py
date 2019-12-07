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

print(outer_lst)
"""

array_of_input = [[1526579928,3,'enter'],[1526579982,2,'exit'],[1526579991,6,'enter'],[1526579994,1,'exit'],[1526579999,2,'enter']]


for i in range(len(array_of_input),-1):
    for j in range(1,len(array_of_input)):
        if array_of_input[i][2] == 'enter':
                