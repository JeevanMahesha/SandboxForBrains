from datetime import datetime, timedelta
x = datetime.now()
y = x + timedelta(minutes=0.5)
while True:
    if y.strftime("%H:%M") == x.strftime("%H:%M"):
        break
    x = datetime.now()
    print(x.strftime("%H:%M"), y.strftime("%H:%M"))
print('Break')

