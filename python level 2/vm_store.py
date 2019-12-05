n = 0
if n>=0 and n<=4:
    def to_purchase():
        product_list,temp = [['slno','name','product','price','total']],list()
        num_of_items = int(input())
        for i in range(num_of_items):
            item_name = input()
            product = int(input())
            price = int(input())
            total = product * price
            temp.append(item_name)
            temp.append(product)
            temp.append(price)
            temp.append(total)
            product_list.append(temp)
            temp=[]
        return product_list
    def view_items(items_list):
        for i in range(len(items_list)):
            if i == 0:
                print('{:<10}{:<12}{:<12}{:<12}{:<12}'.format(items_list[i][0],items_list[i][1],items_list[i][2],items_list[i][3],items_list[i][4]))
            else:
                print('{:<10}{:<12}{:<12}{:<12}{:<12}'.format(i,items_list[i][0],items_list[i][1],items_list[i][2],items_list[i][3]))

    def bill(items_list):
        l=list()
        for i in range(1,len(items_list)):
            l.append(items_list[i][3])
        total_price = sum(l)
        print(total_price)
        if total_price >= 0 and total_price<=500:
            temp =  total_price * 0.02   
            total_price -= temp
            print(temp)
        elif total_price > 500 and total_price<=1000:
            temp =  total_price * 0.05   
            total_price -= temp
            print(temp)
        elif total_price > 1000 :
            temp =  total_price * 0.08   
            total_price -= temp
            print(temp)
        print(total_price)

    while(n!=4):
        print('1.to purchase 2.view items 3.Generate bill 4.exit')
        n = int(input())
        if n == 1:
            items_list =  to_purchase()
        elif n == 2:
            view_items(items_list)
        elif n == 3:
             bill(items_list)
                
    print('Thanks')
else:
    print('f')