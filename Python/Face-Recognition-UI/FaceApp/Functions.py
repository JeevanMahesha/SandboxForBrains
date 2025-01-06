# All functions are here!!!

from os import walk
import os

def File_Dir_name(filepath):
    f= []
    for (dirpath, dirnames, filenames) in walk(filepath):
        print(dirnames)
        f.extend(dirnames)
        break
    return f

def Image_Path(filepath):
    for (dirpath,dirnames, filenames) in walk(filepath):
        # filename = filenames[0]
        return filenames

def TimeDiff(Start,End):
    l = []
    Start_time = Start.split()
    S_time = Start_time[0].split(":")
    End_time = End.split()
    E_time = End_time[0].split(":")
    for i in range(0,len(S_time)):
        l.append(int(E_time[i])-int(S_time[i]))
    working_hours = str(abs(l[0]))+":"+str(abs(l[1]))+":"+str(abs(l[2]))
    return working_hours




