import collections as c
number_of_shoes = int(input())
shoe_size = input().split()
shoe_size = list(map(int, shoe_size))
shoe_size = dict(c.Counter(shoe_size))
ans = 0
for i in range(int(input())):
    val = input().split()
    val = list(map(int, val))
    if val[0] in shoe_size.keys():
        shoe_count = shoe_size.get(val[0])
        if shoe_count != 0:
            ans += val[1]
            shoe_count -= 1
            shoe_size.update({val[0]: shoe_count})
print(ans)
