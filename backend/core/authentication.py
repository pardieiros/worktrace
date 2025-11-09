from __future__ import annotations

from typing import Optional, Tuple

from django.conf import settings
from rest_framework.request import Request
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework_simplejwt.tokens import Token


class CookieJWTAuthentication(JWTAuthentication):
    """
    Authentication class that reads JWT access tokens from HttpOnly cookies.
    """

    access_cookie_name = getattr(settings, "JWT_COOKIE_ACCESS_KEY", "worktrace_access")

    def authenticate(self, request: Request) -> Optional[Tuple[object, Token]]:
        header = self.get_header(request)
        if header:
            return super().authenticate(request)

        raw_token = request.COOKIES.get(self.access_cookie_name)
        if raw_token is None:
            return None

        validated_token = self.get_validated_token(raw_token)
        return self.get_user(validated_token), validated_token


