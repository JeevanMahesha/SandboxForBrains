num = 8
num1 = 1
strr = 65
flag = 1
for i in range(num,0,-1):
    for j in range(i):
        if flag%2 == 0:
            print(' ',num1,end="")
            num1 +=1
        else:
            print(' ',chr(strr),end="")
            strr +=1         
    print('\n')
    num1 = 1
    strr = 65 
    flag +=1




