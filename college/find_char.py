s = list(input())
fs = input()
a = 0
for i in range(len(s)):
    if fs == s[i]:
        a = i
        break
    else:
        continue 
print(a)
