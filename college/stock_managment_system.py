option = 0
#Function for inserting the items 
def insert():
    temp_lst  = list()
    item_id = input()
    item_name = input()
    item_qty = input()
    item_price = input()
    item_expy = input()
    item_mafx = input()
    temp_lst.append(item_id)
    temp_lst.append(item_name)
    temp_lst.append(item_qty)
    temp_lst.append(item_price)
    temp_lst.append(item_expy)
    temp_lst.append(item_mafx)
    return temp_lst

#Function for updateing the items
def update(items_list):
    update_id = input('Enter the update id')
    for i in range(len(items_list)):
        if update_id == items_list[i][0]:
            temp_list = list()
            item_id = input()
            item_name = input()
            item_qty = input()
            item_price = input()
            item_expy = input()
            item_mafx = input()
            temp_list.append(item_id)
            temp_list.append(item_name)
            temp_list.append(item_qty)
            temp_list.append(item_price)
            temp_list.append(item_expy)
            temp_list.append(item_mafx)
            items_list.pop(i)
            items_list.insert(i,temp_list)
    return items_list


#Function for deleting the items    
def delete(items_list):
    delete_id = input('Enter the delete id')
    for i in range(len(items_list)):
        if delete_id == items_list[i][0]:
            items_list.pop(i)
    
#Function for searching  the items
def search(items_list):
    search_id = input('Enter the search id')
    for i in range(len(items_list)):
        if search_id == items_list[i][0]:
            print('{:<10}{:<10}{:<10}{:<10}{:<10}{:<10}'.format(items_list[i][0],items_list[i][1],items_list[i][2],items_list[i][3],items_list[i][4],items_list[i][5]))
    
#Function for display the items
def view(items_list):
    for i in range(len(items_list)):
        print('{:<10}{:<10}{:<10}{:<10}{:<10}{:<10}'.format(items_list[i][0],items_list[i][1],items_list[i][2],items_list[i][3],items_list[i][4],items_list[i][5]))


items_list = [['ID','NAME','QTY','PRICE','EXPY','MAFX']]

while(option != 6):
    print('1.insert 2.update 3.delete 4.search 5.view 6.exit')
    option = int(input())
    if option == 1:
        val = insert()
        items_list.append(val)
    elif option == 2:
        update(items_list)
    elif option == 3:
        delete(items_list)
    elif option == 4:
        search(items_list)
    elif option == 5:
        view(items_list)
    elif option >6 or option<=0:
        print('wrong input')
print('Thanks ')