#  Python program to swap first and last element of the list.
lst = [1,2,3,4,5]
temp = lst[0]
lst[0] = lst[-1]
lst[-1] = temp 
print(lst)