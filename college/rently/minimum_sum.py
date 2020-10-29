import math
import heapq

def minSum(num, k):
    heap = [-n for n in num]  # negate values for max-heap
    heapq.heapify(heap)
    for _ in range(k):
        max_value = heap[0]
        heapq.heapreplace(heap, math.floor(max_value/2))
    # Calculate minimum sum
    return -sum(heap)  # reverse polarity again

num = [100,100,100]
k = 10
print(minSum(num,k))