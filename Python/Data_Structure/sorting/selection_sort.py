def selection(l):
    for i in range(len(l)):
        lowest = i
        for j in range(i+1,len(l)):
            if l[j] < l[lowest]:
                lowest = j
        l[i],l[lowest] = l[lowest],l[i]

def selection_enumerate(l):
    for i,iv in enumerate(l):
        lowest = i
        for j in range(i+1,len(l)):
            if l[j]<iv:
                lowest = j 
    l[i],l[lowest] = l[lowest],l[i]

l = [12, 8, 3, 20, 11]
selection(l)
print(l)