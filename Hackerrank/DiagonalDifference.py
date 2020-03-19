def diagonalDifference(arr):
    # Write your code here
    rd = sum([arr[i][i] for i in range(len(arr))])
    ld = sum([arr[i][len(arr)-i-1] for i in range(len(arr))])
    return abs(rd-ld)

if __name__ == "__main__":
    n = int(input().strip())
    arr = []
    for _ in range(n):
        arr.append(list(map(int, input().rstrip().split())))
    result = diagonalDifference(arr)
    print(result)