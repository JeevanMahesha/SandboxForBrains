n = int(input())
if n<=999:
    print(n*0.40)
elif n>=1000 and n<=1999:
    print(n*0.33)
elif n>=2000 and n<= 4999:
    print(n*0.30)
elif n>= 5000:
    print(n*0.20)