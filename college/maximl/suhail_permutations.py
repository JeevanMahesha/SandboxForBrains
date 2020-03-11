from collections import defaultdict as default_dict
def subString(input_value):
    default_dict_value=default_dict()
    Count=0
    for i in input_value:
        if i not in default_dict_value:
            Count+=1
            default_dict_value.setdefault(i,Count)
        elif i in default_dict_value:
            default_dict_value[i]=Count
    return(min(default_dict_value.items())[1])

if __name__ == "__main__":
    print(subString(list(input())))
