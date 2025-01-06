from itertools import combinations
def get_combination(string):
	string_array = []
	for y in range(len(string)-1,1,-1):
		for x in combinations(string,y):
			if ''.join(x)==''.join(x)[::-1]:
				string_array.append(''.join(x))
				break
	return string_array
def funPal(string):
	palindrome_len = []
	for i in range(0, len(string)):
		str1_array = []
		str2_array = []
		string1 = string[:i]
		string2 = string[i:]
		str1_array = get_combination(string1)
		str2_array = get_combination(string2)
		if str1_array and str2_array:
			print str1_array[0], "\t", str2_array[0]
			palindrome_len.append(len(str1_array[0]) * len(str2_array[0]))
	return max(palindrome_len)
		
_s = 'axbawbaseksqke'
res = funPal(_s);
print res
