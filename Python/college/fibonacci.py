num = int(input('Enter the number to run the loop\n'))
num_d = 0

while(num_d<num):
    num_d +=1
    a = 0
    b = 1
    fib_num = int(input('Enter the number\n'))
    for i in range(fib_num):
        print(a,' ',end = '')
        a , b = b,b+a
    print('\n')
        
        

