from itertools import groupby
def substring(value):
         if value in long:
             long.clear()
             return False
         long.add(value)
         return True
def find_substring(input_value):
    return len(max((list(j) for i,j in groupby(input_value, key=substring)),key=len))    

if __name__ == "__main__":
    input_value= input()
    long = set()
    print (find_substring(input_value))