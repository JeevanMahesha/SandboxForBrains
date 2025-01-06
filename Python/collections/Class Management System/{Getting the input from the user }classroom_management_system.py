school = {}
l = ['English','Maths','Tamil','Science']
for i in range(int(input('Enter the number of class\n'))):
    class_name = input('Enter class name\n')
    school.setdefault(class_name)
    for i in range(int(input('Enter the number of students\n'))):
        students_name = dict()
        stu_name = input('Enter the student name\n')
        students_name.setdefault(stu_name)
        marks= dict()
        for i in range(len(l)):
            print('Enter the marks for',l[i])
            mrk = int(input())
            marks.update({l[i]:mrk})
        students_name.update({stu_name:marks})
        school.update({class_name:students_name})
for class_k,class_v in school.items():
    print('\n---------------------------------------------')
    print('|{:<10}|{:<10}|{:<10}|{:<10}|'.format(class_k,l[0],l[1],l[2]))
    print('---------------------------------------------')
    for student_k,student_v in class_v.items():
            mrk = list(student_v.values())
            print('|{:<10}|{:<10}|{:<10}|{:<10}|'.format(student_k,mrk[0],mrk[1],mrk[2]))
    print('---------------------------------------------')