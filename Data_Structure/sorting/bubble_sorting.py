def bubble(l):
    swape=True
    while swape:
        swape=False
        for i in range(len(l)-1):
            if l[i] > l[i+1]:
                l[i],l[i+1] = l[i+1],l[i]
                swape=True

l = [5, 2, 1, 8, 4]
bubble(l)
print(l)