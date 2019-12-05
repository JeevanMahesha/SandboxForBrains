import math as m 

n = [25,16,24,21,19]
temp_weight_list,val_list,weight_list = [],[],[]

for i in range(len(n)):
    sqrt_val = m.sqrt(n[i])
    if int(sqrt_val) * int(sqrt_val) - n[i] == 0 :
        temp_weight_list.append(5)
    if n[i]%4 == 0 and n[i]%6 == 0:
        temp_weight_list.append(4)
    if n[i] % 2 ==0:
        temp_weight_list.append(3)
    else:
        temp_weight_list.append(0)
    sum_of_weight = sum(temp_weight_list)
    weight_list.append(sum_of_weight)
    temp_weight_list =[]
    val_list.append(n[i])
mapped = zip(weight_list,val_list)
mapped = list(mapped)
mapped.sort()
for i in range(len(mapped)):
    print(mapped[i][1],end=" ")

