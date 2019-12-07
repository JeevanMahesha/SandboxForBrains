num = input('Enter the number\n')
extval,ans = [],""

l = len(str(max(num))) + 1
print(len(num))

for i in num: 
        temp = str(i) * l 
        extval.append((temp[:l:], i)) 
        extval.sort(reverse = True)

for i in extval:
        ans += str(i[1])
        
print(ans)              