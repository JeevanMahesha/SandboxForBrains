val_input ,lst_count,ans_lst = [] ,[], []

keypad = ["", "", ['a','b','c'], ['d','e','f'], ['g','h','i']
, ['j','k','l'], ['m','n','o'], ['p','q','r','s']
, ['t','u','v'], ['w','x','y','z']]

size_of_array = int(input('Enter the size of array'))
for i in range(size_of_array):
    val = list(input())
    val_input.append(val)

for i in range(len(val_input)):
    for j in range(len(val_input[i])):
        for k in range(len(keypad)):
            for l in range(len(keypad[k])):
                if keypad[k][l] == val_input[i][j]:
                    lst_count.append(k)
                else:
                    continue
    ans_lst.append(lst_count)
    lst_count=[]
for i in range(len(ans_lst)):
    a = ''
    a = a.join(map(str,ans_lst[i]))
    print(a)