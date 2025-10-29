question = [[],['Author of python'],['Which function is used to diplay a user content'],['Which function is used to get data from user']]
option = [[],['Guido van rossum','steve jobs','james gosling','Patrick Naughton'],['print()','input()','format()','rval()']]
ans = [[],['Guido van rossum'],['print()'],['input()']]
print('welcome to python quize')
choice = input('enter 1 to start a quiz')
mrk = 0
question_index = 1  

def question_function():
    print(question[question_index])
    print(option[question_index])
    ans_from_user = input()
    if ans_from_user == ans[1]:
        mrk +=1

if choice == '1':
    total = question_function()    
    question_index = int(input('1.next   2. prev'))
    if question_index == 1:
        question_index+=1
    elif question_index == 2:
        question_index-=1
    