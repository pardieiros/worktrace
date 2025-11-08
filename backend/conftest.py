from __future__ import annotations

import pytest
from model_bakery import baker

from core import models


@pytest.fixture
def client_obj(db) -> models.Client:
    return baker.make(models.Client, name="Acme Corp", email="client@example.com")


@pytest.fixture
def admin_user(db) -> models.User:
    user = baker.make(models.User, role=models.User.Roles.ADMIN, email="admin@example.com")
    user.set_password("password123")
    user.save()
    return user


@pytest.fixture
def client_user(db, client_obj: models.Client) -> models.User:
    user = baker.make(
        models.User,
        role=models.User.Roles.CLIENT,
        client=client_obj,
        email="clientuser@example.com",
    )
    user.set_password("password123")
    user.save()
    return user


@pytest.fixture
def project(db, client_obj: models.Client, admin_user: models.User) -> models.Project:
    return baker.make(
        models.Project,
        name="Project Alpha",
        client=client_obj,
        created_by=admin_user,
        visibility=models.Project.Visibility.CLIENT,
    )


@pytest.fixture
def assignment(db, project: models.Project, client_user: models.User) -> models.ProjectAssignment:
    return baker.make(
        models.ProjectAssignment,
        project=project,
        user=client_user,
        role=models.ProjectAssignment.AssignmentRole.MEMBER,
        is_active=True,
    )


@pytest.fixture
def api_client():
    from rest_framework.test import APIClient

    return APIClient()

