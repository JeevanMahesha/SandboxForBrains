from django.conf.urls import url
from FaceApp import views
urlpatterns = [
    url(r'^(?P<slug>[\w-]+)/$', views.face_reg_attendance, name="attendance-facecam"),
]