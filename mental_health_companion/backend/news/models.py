from django.db import models

class Article(models.Model):
    title = models.CharField(max_length=255)
    description = models.TextField()
    url = models.URLField()
    image_url = models.URLField(blank=True, null=True)
    source = models.CharField(max_length=100)
    published_at = models.DateTimeField()
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['-published_at']
