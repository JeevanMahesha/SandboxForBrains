import json
import os
from os import walk
import face_recognition as fr

encodeJsonFile = 'Face_Encoding_Data.json'

if not(os.path.isfile(encodeJsonFile)):
    with open(encodeJsonFile, 'w') as outfile:
        json.dump({}, outfile)

with open(encodeJsonFile) as f:
    EncodeJsonData = json.load(f)
    known_face_encodings = list(EncodeJsonData.values())
    known_names = list(EncodeJsonData.keys())


File_Dir_names = []
for (dirpath, dirnames, filenames) in walk("images"):
    File_Dir_names.extend(dirnames)
    break
for dirname in File_Dir_names:
    if dirname not in known_names:
        Image_path = []
        Image_encoded = list()
        for (dirpath, dirnames, filenames) in walk("images/"+str(dirname)):
            Image_path.extend(filenames)
        for image in Image_path:
            Training_Image_path = "images/"+str(dirname)+"/"+str(image)
            train_image = fr.load_image_file(Training_Image_path)
            train_image_encoding = fr.face_encodings(train_image)[0]
            Image_encoded.append(list(train_image_encoding))
        EncodeJsonData.update({dirname: Image_encoded})
        with open(encodeJsonFile, "w") as outfile:
            json.dump(EncodeJsonData, outfile)
        print()
        print(f'{dirname} added to json file')
    else:
        print()
        print(f'{dirname} already encoded')

print()
print('Face Encoding is finished')
