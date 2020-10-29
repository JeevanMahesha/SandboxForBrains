from collections import namedtuple as nt
student = nt('student', ["name", "age", "marks"])
s1 = student('Jeevan',18,99)
l = ['Raja',1,1]
s2 = student._make(l)
print(s2)

