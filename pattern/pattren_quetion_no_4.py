
def Diamond(rows):
    for i in range(rows):
        for j in range(rows-i-1):
            print(end=" ")
        for j in range(i+1):
            print('*',end=" ")
        print('\n')
    for i in range(rows-2,0,-1):
        for j in range(rows-i-1):
            print(end=" ")
        for j in range(i+1):
            print('*',end=" ")
        print('\n')
      
        
rows = 5
Diamond(rows)