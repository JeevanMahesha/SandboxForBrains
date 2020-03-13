def requiredWaterForGivenDays(Number_Of_Days,clusters,connection):
    print()
    capacity_of_each_cluster = []
    for k,v in clusters.items():
       capacity_of_each_cluster.append((k,list(v.values())[0]))
    for i in range(Number_Of_Days):
        for j in connection:
            for k in range(len(j)-1,-1,-1):
                   if j[k] in clusters.keys():
                       key = list(clusters.get(j[k]).keys())[0]
                       value = list(clusters.get(j[k]).values())[0]
                       clusters.get(j[k]).update({key:value-key})
                       print(clusters.get(j[k]))


if __name__ == "__main__":    
    Number_Of_Days = int(input())
    clusters = {}
    for i in range(int(input())):
        Temp_dict = {}
        input_value = input().split()
        Temp_dict[int(input_value[1])] = int(input_value[2])
        clusters [input_value[0]] = Temp_dict
    connection = list()
    for i in range(int(input())):
        input_value = input().split('_')
        if input_value[0] == 'F':
            connection.append(input_value)
        else:
            for i in connection:
                if input_value[0] in i:
                    i.append(input_value[1])
    requiredWaterForGivenDays(Number_Of_Days,clusters,connection)
    