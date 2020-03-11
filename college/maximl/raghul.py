from itertools import groupby
def longest(x):
         if x in long:
             long.clear()
             return False
         long.add(x)
         return True
def find_longest(string):
    return len(max((list(j) for i,j in groupby(string, key=longest)),key=len))    

string= input()
long = set()
print (find_longest(string))