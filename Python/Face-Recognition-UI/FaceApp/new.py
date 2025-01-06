import os
import cv2
import time
path = './dataset/Jeevan/'
t = time.localtime()
current_time = time.strftime("%H:%M:%S", t).replace(':', '_')
videoCaptureObject = cv2.VideoCapture(0)
result = True
while(result):
    ret, frame = videoCaptureObject.read()
    cv2.imwrite(path+"Jeevan"+current_time+".jpg", frame)
    result = False
videoCaptureObject.release()
cv2.waitKey(1)
