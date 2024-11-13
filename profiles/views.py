from django.views.generic import UpdateView
from profiles.models import UserProfile
from django.contrib.auth.views import LoginView as AuthLoginView


class EditProfileView(UpdateView):
    model = UserProfile
    fields = ["biography"]


class LoginView(AuthLoginView):
    template_name = "authentication/login.html"
