from django.views.generic import UpdateView
from profiles.models import UserProfile


class EditProfileView(UpdateView):
    model = UserProfile
    fields = ["biography"]
    template_name = "profiles/edit_profile.html"

    def get_object(self):
        return None
