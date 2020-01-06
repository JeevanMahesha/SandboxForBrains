n = 5
for i in range(n):
    for j in range(i,n+1-1):
        print(end=" ")
    for k in range(i+1):
        print('*',end="")
    for l in range(i+1):
        print('*',end="")
    print()
for i in range(n-1,-1,-1):
    for j in range(i,n+1-1):
        print(end=" ")
    for k in range(i+1):
        print('*',end="")
    for l in range(i+1):
        print('*',end="")
    print()
 
"""
     **
    ****
   ******
  ********
 **********
 **********
  ********
   ******
    ****
     **
      """