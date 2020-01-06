"""
Question 
0-40  U
41-50  D
51-60  C
61-70  B
71-80  B+
81-90  A
91-100  S
Anything outside print “Invalid input”

"""
num =int(input('Enter the number of student\n'))
for i in range(num):

    gread = int(input('Enter the student total mark\n'))

    if gread >=0 and gread <=40:
        print('The gread is U')
    elif gread >= 41 and gread <= 50:
        print('The gread is D')
    elif gread >= 51 and gread <= 60:
        print('The gread is C')
    elif gread >= 61 and gread <= 70:
        print('The gread is B')
    elif gread >= 71 and gread <= 80:
        print('The gread is B+')
    elif gread >= 81 and gread <= 90:
        print('The gread is A')
    elif gread >= 91 and gread <= 100:
        print('The gread is S')
    else:
        print('Invalid input')