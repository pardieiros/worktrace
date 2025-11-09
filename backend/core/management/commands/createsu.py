from __future__ import annotations

from django.contrib.auth import get_user_model
from django.core.management.base import BaseCommand, CommandError


class Command(BaseCommand):
    help = "Creates an initial superuser for Worktrace."

    def add_arguments(self, parser):
        parser.add_argument("--email", default="admin@worktrace.local")
        parser.add_argument("--password", default="admin123")
        parser.add_argument("--username", default="admin")

    def handle(self, *args, **options):
        User = get_user_model()
        email = options["email"]
        username = options["username"]
        password = options["password"]

        if User.objects.filter(email=email).exists():
            raise CommandError(f"User with email {email} already exists.")

        user = User.objects.create_superuser(
            username=username,
            email=email,
            password=password,
        )
        user.role = User.Roles.ADMIN
        user.save(update_fields=["role"])
        self.stdout.write(self.style.SUCCESS(f"Superuser {email} created."))


