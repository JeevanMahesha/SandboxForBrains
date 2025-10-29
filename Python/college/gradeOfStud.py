"""
0-40  U
41-50  D
51-60  C
61-70  B+
71-80  B
81-90  A
91-100  S
"""
num = int(input('Enter the total mark of that student\n'))

if num<=40:
    print('U')
elif num<=50:
    print('D')
elif num<=60:
    print('C')
elif num<=70:
    print('B+')
elif num<=80:
    print('B')
elif num<=90:
    print('A')
elif num<=100:
    print('S')
else:
    print('Enter the mark 0 to 100')