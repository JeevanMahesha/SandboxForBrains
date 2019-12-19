school = {'Class_A':{'jeevan':{'English':80,'Maths':90,'Tamil':99},
        'sam':{'English':89,'Maths':90,'Tamil':100},
        'raghul':{'English':87,'Maths':100,'Tamil':66},
        'kishor':{'English':100,'Maths':90,'Tamil':55},
        'kutty':{'English':80,'Maths':55,'Tamil':77}
        },
        'Class_B':{'sankar':{'English':100,'Maths':90,'Tamil':62},
        'varsha':{'English':44,'Maths':90,'Tamil':44},
        'shruthi':{'English':80,'Maths':88,'Tamil':66},
        'sanjeev':{'English':80,'Maths':100,'Tamil':77},
        'hari':{'English':100,'Maths':90,'Tamil':89}
        },
        'Class_C':{'gowtham':{'English':80,'Maths':90,'Tamil':100},
        'swathi':{'English':73,'Maths':88,'Tamil':65},
        'deepki':{'English':68,'Maths':100,'Tamil':79},
        'latha':{'English':90,'Maths':90,'Tamil':90},
        'raja':{'English':100,'Maths':100,'Tamil':100}
        }
        }

def average_in_perticualar_subject():
        print('\n There are Three Class in This School \n Class_A \n Class_B \n Class_C\n')
        clss = input('Please Enter The Class Name \n')
        print('\nSubject are English Maths Tamil \n')
        subject = input('Please Enter The Subject Name \n')
        marks_dict = {}
        for school_k,school_v in school.items():
                if school_k == clss:
                        for clss_k,clss_v in school_v.items():
                                for subject_k,subject_v in clss_v.items():
                                        if subject_k == subject:
                                                marks_dict[clss_k] = subject_v
        marks_dict = {k:v for k,v in sorted(marks_dict.items(),key = lambda kv : (kv[1],kv[0]),reverse = True )}
        marks_dict = list(marks_dict)
        print(marks_dict[0])

# view_marks_of_perticualar_subject
def view_marks_of_perticualar_subject():
        print('\n There are Three Class in This School \n Class_A \n Class_B \n Class_C\n')
        clss = input('Please Enter The Class Name \n')
        print('\nSubject are English Maths Tamil \n')
        subject = input('Please Enter The Subject Name \n')
        marks_dict = { student_k : subject_v for class_k,class_v in school.items() if class_k == clss for student_k,student_v in class_v.items() for subject_k,subject_v in student_v.items() if subject_k == subject}
        marks_dict = {k:v for k,v in sorted(marks_dict.items(),key = lambda kv : (kv[1],kv[0]),reverse = True )}
        if marks_dict == {}:
                print('NO RECORD') 
        else:
                print()
                print('{:<10} {:<10}'.format('Name','Marks'))
                for k,v in marks_dict.items():
                        print('{:<10} {:<10}'.format(k,v))
        print()



#overall topper in class
def overall_topper_in_class():
        cls = {}
        for ck,cv in school.items():
                for nk,nv in cv.items():
                        cls[nk]=sum(nv.values())
                print('{}'.format(max(cls.items(),key = lambda x:x[1])))
                cls={}


def overall_topper_in_school():
        topper_in_class = { nk:nv for clsk,clsv in school.items() for nk,nv in clsv.items() }
        l = {}
        a = 0
        for nk,nv in topper_in_class.items():
                for sk,sv in nv.items():
                        a += sv
                l[nk] = a
                a = 0
        l = {k:v  for k,v in sorted(l.items() , key=lambda kv: (kv[1],kv[0]),reverse = True)}
        print()
        print('Topper of the school is ', list(l)[0])
        print()


option = 0
while(option != 5):
        print('\n 1. Average Precentage in Perticualar Subject \n 2. view Student Marks in Perticualar subject \n 3. overall Topper in class \n 4. overall Topper in School \n 5.Exit \n')
        option = int(input('Please Enter Your Option \n'))
        if option == 1:
                average_in_perticualar_subject()
        elif option == 2:
                view_marks_of_perticualar_subject()
        elif option == 3:
                overall_topper_in_class()
        elif option == 4:
                overall_topper_in_school()
        elif(option > 5 or option<=0):
                print('wrong input')
print('Thanks')
