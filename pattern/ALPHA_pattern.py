n = 7

for i in range(n+1):  
    c = 65
    for j in range(n-i-1+1):
        print(end=" ")
    for j in range(i+1):
        print(chr(c),end=" ")
        c+=1
    print()
for i in range(n,-1,-1):
    for j in range(n-i+1):
        print(end=" ")
    for j in range(i):
        print(chr(c),end=" ")
        c+=1
    print()

"""
---------------------------------------
       A 
      A B 
     A B C 
    A B C D 
   A B C D E 
  A B C D E F 
 A B C D E F G 
A B C D E F G H 
 I J K L M N O 
  P Q R S T U 
   V W X Y Z 
    [ \ ] ^ 
     _ ` a 
      b c 
       d
-----------------------------------------
       """
