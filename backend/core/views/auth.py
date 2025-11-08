from __future__ import annotations

from django.conf import settings
from django.middleware import csrf
from rest_framework import status
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken

from ..serializers import LoginSerializer, UserSerializer
from ..tokens import clear_jwt_cookies, set_jwt_cookies


class LoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = LoginSerializer(data=request.data, context={"request": request})
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data["user"]
        access = serializer.validated_data["access"]
        refresh = serializer.validated_data["refresh"]
        csrf_token = csrf.get_token(request)
        response = Response(
            {"user": UserSerializer(user).data, "csrfToken": csrf_token},
            status=status.HTTP_200_OK,
        )
        set_jwt_cookies(request, response, access, refresh)
        return response


class RefreshView(APIView):
    def post(self, request):
        refresh_token = request.COOKIES.get(settings.JWT_COOKIE_REFRESH_KEY)
        if not refresh_token:
            return Response({"detail": "Refresh token missing."}, status=status.HTTP_401_UNAUTHORIZED)

        token = RefreshToken(refresh_token)
        access_token = token.access_token
        csrf_token = csrf.get_token(request)
        response = Response({"csrfToken": csrf_token}, status=status.HTTP_200_OK)
        set_jwt_cookies(request, response, str(access_token), str(token))
        return response


class LogoutView(APIView):
    def post(self, request):
        response = Response(status=status.HTTP_204_NO_CONTENT)
        clear_jwt_cookies(response)
        return response


class MeView(APIView):
    def get(self, request):
        csrf_token = csrf.get_token(request)
        data = UserSerializer(request.user).data
        return Response({"user": data, "csrfToken": csrf_token})

