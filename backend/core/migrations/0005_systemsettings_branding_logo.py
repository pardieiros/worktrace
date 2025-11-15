from __future__ import annotations

from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("core", "0004_systemsettings"),
    ]

    operations = [
        migrations.AddField(
            model_name="systemsettings",
            name="branding_logo",
            field=models.ImageField(blank=True, null=True, upload_to="branding/"),
        ),
    ]


