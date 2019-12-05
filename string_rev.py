n = 'This is a world'
n = n.split()
result = (list(map(lambda x : x[::-1],n)))
print(' '.join(result))