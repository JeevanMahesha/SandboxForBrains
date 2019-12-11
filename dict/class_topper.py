school = {'class_A':{'jeevan':{'eng':80,'math':90,'tamil':99},
        'sam':{'eng':89,'math':90,'tamil':100},
        'raghul':{'eng':87,'math':100,'tamil':66},
        'kishor':{'eng':100,'math':90,'tamil':55},
        'kutty':{'eng':80,'math':55,'tamil':77}
        },
        'class_B':{'sankar':{'eng':100,'math':90,'tamil':62},
        'varsha':{'eng':44,'math':90,'tamil':44},
        'shruthi':{'eng':80,'math':88,'tamil':66},
        'sanjeev':{'eng':80,'math':100,'tamil':77},
        'hari':{'eng':100,'math':90,'tamil':89}
        },
        'class_C':{'gowtham':{'eng':80,'math':90,'tamil':100},
        'swathi':{'eng':73,'math':88,'tamil':65},
        'deepki':{'eng':68,'math':100,'tamil':79},
        'latha':{'eng':90,'math':90,'tamil':90},
        'raja':{'eng':100,'math':100,'tamil':100}
        }
        }

# Topper in perticular subject
def topper_in_perticular_subject():
        subject = 'eng'
        clss = 'class_C'
        marks_dict = { clss_k : subject_v for school_k,school_v in school.items() if school_k == clss 
          for clss_k,clss_v in school_v.items() for subject_k,subject_v in clss_v.items() if subject_k == subject }
        marks_dict = [v for k,v in marks_dict.items()]
        avg = sum(marks_dict)/len(marks_dict)
        print()
        print(' The Average Marks of {} is {} in {}'.format(clss,avg,subject))
        print()

# view_marks_of_perticualar_subject
def view_marks_of_perticualar_subject():
    subject = 'tamil'
    clss = 'class_A'
    marks_dict = { clss_k : subject_v for school_k,school_v in school.items() if school_k == clss for clss_k,clss_v in school_v.items() for subject_k,subject_v in clss_v.items() if subject_k == subject }
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
        print(school)


# overall topper in school
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
        print('1. Topper in perticular subject 2.view Topper in subject 3.overall Topper in class 4. overall Topper in School')
        option = int(input())
        if option == 1:
                topper_in_perticular_subject()
        elif option == 2:
                view_marks_of_perticualar_subject()
        elif option == 3:
                overall_topper_in_class()
        elif option == 4:
                overall_topper_in_school()
        elif(option > 5 or option<=0):
                print('wrong input')
print('Thanks')
