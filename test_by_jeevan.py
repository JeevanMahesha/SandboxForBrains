import cv2
import json
import face_recognition as fr
import numpy as np

encodeJsonFile = 'Face_Encoding_Data.json'


with open(encodeJsonFile) as f:
    EncodeJsonData = json.load(f)
video = cv2.VideoCapture(0)

while(True):

    ret, frame = video.read()
    # The image transforms to the colour RGB order
    rgb_frame = frame[:, :, ::-1]
    face_locations = fr.face_locations(rgb_frame)
    face_encodings = fr.face_encodings(rgb_frame, face_locations)
    for (top, right, bottom, left), face_encoding in zip(face_locations, face_encodings):
        name = "Unknown"
        for personName, encodeValue in EncodeJsonData.items():
            matches = fr.compare_faces(
                encodeValue, face_encoding, tolerance=0.5)
            face_distances = fr.face_distance(
                encodeValue, face_encoding)
            best_match_index = np.argmin(face_distances)
            print(matches)
            if len(set(matches)) == 1 and matches[0] == bool(1):
                name = personName
            if name == "Unknown":
                cv2.rectangle(frame, (left + 2, top + 2),
                              (right + 2, bottom + 2), (0, 128, 255), 1)
                cv2.rectangle(frame, (left, bottom - 35),
                              (right, bottom), (0, 128, 255), cv2.FILLED)
                font = cv2.FONT_HERSHEY_SCRIPT_COMPLEX
                cv2.putText(frame, name, (left + 6, bottom - 6),
                            font, 1.0, (0, 0, 0), 1)
            else:
                cv2.rectangle(frame, (left + 2, top + 2),
                              (right + 2, bottom + 2), (0, 128, 0), 1)
                cv2.rectangle(frame, (left, bottom - 35),
                              (right, bottom), (0, 128, 0), cv2.FILLED)
                font = cv2.FONT_HERSHEY_SIMPLEX
                cv2.putText(frame, name, (left + 6, bottom - 6),
                            font, 1.0, (0, 0, 0), 1)
                cv2.putText(frame, name, (left, bottom + 52),
                            font, 0.5, (42, 163, 38), 2)

    cv2.imshow('frame', frame)

    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

video.release()
cv2.destroyAllWindows()
