from jose import JWTError, jwt, ExpiredSignatureError
from datetime import datetime, timedelta

from jose.exceptions import JWTClaimsError

from config import settings

SECRET_KEY = settings.SECRET_KEY


def create_jwt(data: dict, expires_delta: timedelta = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=60)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm='HS256')


def decode_jwt(token):
    try:
        return jwt.decode(token, SECRET_KEY, algorithms='HS256')
    except ExpiredSignatureError:
        return
        print("Token has expired.")
    except JWTClaimsError:
        print("Invalid claims. Please check the audience and issuer.")
    except JWTError as e:
        print(f"JWT error occurred: {e}")
    return None
