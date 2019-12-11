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


def topper_in_perticular_subject():
        subject = 'eng'
        clss = 'class_A'
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
        


"""
tp = {nk:nv 
for clsk,clsv in school.items()
for nk,nv in clsv.items() 
 }
print(tp)  
"""



option = 0
while(option != 5):
        print('1. Topper in perticular subject 2.view Topper in subject 3.overall Topper in class 4. overall Topper in School')
        option = int(input())
        if option == 1:
                topper_in_perticular_subject()
        elif option == 2 :
                view_topper_in_subject()
        elif option == 3:
                overall_topper_in_class()
        elif option == 4 :
                overall_topper_in_school()
        elif(option > 5 or option<=0):
                print('wrong input')
print('Thanks')
