def findcompounds(dict_chem,find):
    count = 0
    for i in find:
        if i in dict_chem.keys():
            count+=1
            value = dict_chem.get(i)
            for j in value:
                if j in dict_chem.keys():
                    count+=1
    print(count)



if __name__ == "__main__":
    dict_chem = {}
    for _ in range(int(input())):
        val = input().split('=')
        val = [i.strip() for i in val]
        val[1] = set(val[1].split('+'))
        val[1] = [i.strip() for i in val[1]]
        dict_chem.setdefault(val[0],set(val[1]))
    find = []
    for _ in range(int(input())):
        find.append(input())
    print('===================================')
    print(dict_chem)
    print(find)
    findcompounds(dict_chem,find)