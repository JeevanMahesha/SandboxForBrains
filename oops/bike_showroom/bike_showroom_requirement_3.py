class Showroom:
    count_showroom = {}
    def __init__(self,id,name,email,brand,city):
        self.__Id = id
        self.__Name = name
        self.__Email = email
        self.__Brand = brand
        self.__City = city
       

    def get_showroom_Details(self):
        print(self.__Id)
        print(self.__Name)
        print(self.__Email)
        print(self.__Brand)
        print(self.__City)

    def set_showroom_Details(self,id,name,email,brand,city):
        self.__Id = id
        self.__Name = name
        self.__Email = email
        self.__Brand = brand
        self.__City = city
    
    def cityWiseShowroomCount(self,showroom_list):
        if showroom_list.__City not in self.count_showroom.keys():
            self.count_showroom[showroom_list.__City] = 1
        else:
            v = self.count_showroom.get(showroom_list.__City)
            v += 1
            self.count_showroom[showroom_list.__City] = v 
        print(self.count_showroom)


if __name__ == "__main__":
    showroom_list = []

    for i in range(int(input())):
        user_input_showroom = input().split(",")
        user_input_showroom = Showroom(user_input_showroom[0],user_input_showroom[1],user_input_showroom[2],user_input_showroom[3],user_input_showroom[4])
        showroom_list.append(user_input_showroom)
    
    for i in range(len(showroom_list)):
        showroom_list[i].cityWiseShowroomCount(showroom_list[i])
    