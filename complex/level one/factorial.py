num = int(input('Enter the number to run the loop\n'))
fact = 1
for i in range(num):
    fact_num = int(input('Enter the number to find the factorial\n'))
    if fact_num == 0:
        print(0)
    else:
        for i in range(1,fact_num+1):
            fact = fact * i
        print(fact)
        fact = 1