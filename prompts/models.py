from django.db import models
from django.contrib.auth.models import User
from simple_history.models import HistoricalRecords
from taggit.managers import TaggableManager


class Prompt(models.Model):
    content = models.TextField()
    title = models.CharField(max_length=500)
    owner = models.ForeignKey(User, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    slug = models.SlugField(max_length=250, unique=True)
    version = models.IntegerField(default=1)
    history = HistoricalRecords()
    tags = TaggableManager()

    def __str__(self):
        return self.title
