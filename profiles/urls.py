from profiles.views import EditProfileView
from django.urls import path

urlpatterns = [path("/", EditProfileView.as_view(), name="edit_profile")]
