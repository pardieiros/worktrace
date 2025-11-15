from __future__ import annotations

from datetime import timedelta

from django.conf import settings
from django.http import HttpRequest, HttpResponse
from django.middleware.csrf import get_token


def _seconds(delta: timedelta) -> int:
    return int(delta.total_seconds())


def set_jwt_cookies(
    request: HttpRequest,
    response: HttpResponse,
    access_token: str,
    refresh_token: str,
) -> None:
    access_lifetime = settings.SIMPLE_JWT["ACCESS_TOKEN_LIFETIME"]
    refresh_lifetime = settings.SIMPLE_JWT["REFRESH_TOKEN_LIFETIME"]
    secure = settings.REST_COOKIE_SECURE
    samesite = settings.REST_COOKIE_SAMESITE
    response.set_cookie(
        settings.JWT_COOKIE_ACCESS_KEY,
        access_token,
        httponly=True,
        secure=secure,
        samesite=samesite,
        path="/",
        max_age=_seconds(access_lifetime),
    )
    response.set_cookie(
        settings.JWT_COOKIE_REFRESH_KEY,
        refresh_token,
        httponly=True,
        secure=secure,
        samesite=samesite,
        path="/api/auth/",
        max_age=_seconds(refresh_lifetime),
    )
    csrf_token = get_token(request)
    response.set_cookie(
        "csrftoken",
        csrf_token,
        secure=secure,
        samesite=samesite,
        path="/",
    )


def clear_jwt_cookies(response: HttpResponse) -> None:
    response.delete_cookie(settings.JWT_COOKIE_ACCESS_KEY, path="/")
    response.delete_cookie(settings.JWT_COOKIE_REFRESH_KEY, path="/api/auth/")


