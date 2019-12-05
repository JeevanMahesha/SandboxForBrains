print('Welcome to my Application')
option = 0
car_name = input('Enter the car name\n')
initial_car_speed = int(input('Enter your car speed\n'))
while(1):
    if initial_car_speed <0:
        initial_car_speed = int(input('Please enter the valid car speed\n'))
    else:
        break
while(option !=3):
    print('Your car speed is ',initial_car_speed)
    print('1. Increase the car speed')
    print('2. Decrease the car speed')
    print('3. exit from the Application')
    option = int(input('Enter your option\n'))
    if option == 1:
        if initial_car_speed <=80 and initial_car_speed >= 0:
            initial_car_speed +=10
            print('your car in {} speed'.format(initial_car_speed))
            if initial_car_speed == 80:
                print('your car is in already max speed')
            elif initial_car_speed >80:
                initial_car_speed = 0
                print('Your car is stopped you crossed max speed')
    elif option == 2:
        initial_car_speed-=10
        if initial_car_speed<0:
            print('car is already in initial state')
            initial_car_speed = 0
        elif initial_car_speed == 0:
           print('car is already in initial state')
        else:
            print('your car in {} speed'.format(initial_car_speed))
