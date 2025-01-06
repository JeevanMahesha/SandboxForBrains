import re

Nameage = '''
Janice is 22 and Theon is 33
Gabriel is 44 and Joey is 21
'''

Str = "Sat, hat, mat, pat"

Food = "hat rat mat pat"

allAnd = re.findall('and',Nameage)
# print(allAnd)

# print(re.search('and',Nameage))

# find_pattern = re.findall('[Sm]at',Str)
# print(find_pattern)

find_in_between = re.findall('[h-z]at',Str)
# print(find_in_between)


match = re.compile('[r]at')
find_and_replace = match.sub('food',Food)
# print(find_and_replace)

data = 'Hai this is \\Jeevan'
# print(re.search(r'\\Jeevan',data))


randstr = '''
You Never
Walk Alone
Liverpool FC
'''

regex = re.compile("\n")
randstr = regex.sub(" ", randstr)
# print(randstr)

randstr = "12345"

print("Matches:", len(re.findall("\d{4}", randstr)))

# ^[h-z]at expect the match
# r gets the raw data input
# \d match any number /D only int
