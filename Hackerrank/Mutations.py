def mutate_string(string, position, character):
    lst=list(string)
    lst[position]= character
    out=''.join(lst)
    return out

s =input()
i, c =input().split()
s_new = mutate_string(s, int(i), c)
print(s_new)
