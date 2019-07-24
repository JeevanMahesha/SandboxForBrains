str1 = str(input('Enter the string\n'))
dec = {}
c = 0
for i in str1:
    val = str1.count(i)
    if i not in dec:
        dec[i] = val
k  = sorted(dec.items(),key=lambda i:i[1], reverse = True)

dec2 = dict(k)
second = k[1][1]
print(second)

for (key , val) in dec2.items():
        if val == second:
                c += 1

                