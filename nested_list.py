"""
Given the names and grades for each student in a Physics class of students,
store them in a nested list and print the name(s) of any student(s) having the second lowest grade.


Note: If there are multiple students with the same grade, order their names alphabetically and print each name on a new line.
"""

n = eval(input())
arr=[]
lst=[]
lst1=[]
dlst=[]
rlst=[]
for i in range (n):
    lst=[]
    arr.append(lst)
    for j in range (1):
        val=input()
        lst.append(val)
        for j in range (1):
            val=eval(input())
            lst.append(val)
arr.sort(key = lambda x:x[1])
for i in range(len(arr)):
    lst1.append(arr[i][1])
for i in range (len(lst1)):
    if lst1[i] not in dlst:
        dlst.append(lst1[i])
for i in range (len(arr)):
    if dlst[1] == arr[i][1]:
        rlst.append(arr[i])
rlst.sort()
for i in range (len(rlst)):
    print(rlst[i][0])
