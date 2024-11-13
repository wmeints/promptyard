from django.views.generic import UpdateView
from profiles.models import UserProfile


class EditProfileView(UpdateView):
    model = UserProfile
    fields = ["biography"]
