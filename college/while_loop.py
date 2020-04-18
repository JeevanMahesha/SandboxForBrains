n = 3456
ans = 0
while n > 0:
    d = n%10
    ans += d
    n = n//10
print(ans)
