def requiredWaterForGivenDays(Number_Of_Days,clusters,connection):
    print()
    capacity_of_each_cluster = {}
    for k,v in clusters.items():
       capacity_of_each_cluster[k]=list(v.values())[0]
    print(capacity_of_each_cluster)
    ans = [v for k,v in capacity_of_each_cluster.items()]
    for i in range(Number_Of_Days):
        print('Day :',i+1)
        for j in connection:
            for k in range(len(j)-1,-1,-1):
                   if j[k] in clusters.keys():
                       key = list(clusters.get(j[k]).keys())[0]
                       value = list(clusters.get(j[k]).values())[0]
                       if key <= value and value>0 :
                           print(j[k],'=',clusters.get(j[k]),end=" ")
                           clusters.get(j[k]).update({key:value-key})
                           print('Balance',j[k],'=',clusters.get(j[k]))
                       else:
                           print(j[k],'=',clusters.get(j[k]),'before update',end=" ")
                           for l in range(k,-1,-1):
                               if j[l] in capacity_of_each_cluster.keys():
                                   value = capacity_of_each_cluster.get(j[l])
                                   ans.append(value)
                                   clusters.get(j[k]).update({key:value})
                                   clusters.get(j[k]).update({key:value-key})
                           print(j[k],'=',clusters.get(j[k]),'after update')
        print()
    print(sum(ans))
  
if __name__ == "__main__":    
    Number_Of_Days = 5
    clusters = {'c1': {200: 300}, 'c2': {150: 300}, 'c3': {200: 200}, 'c4': {100: 400}}
    connection = [['F', 'c1', 'c2'], ['F', 'c3', 'c4']]
    requiredWaterForGivenDays(Number_Of_Days,clusters,connection)
    