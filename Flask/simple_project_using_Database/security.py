from werkzeug.security import safe_str_cmp
from user import User


user_list = [
    User(1,'jeevan',"123")
]

username_mapping = {u.username: u for u in user_list}
userid_mapping = {u.id : u for u in user_list}


def authenticate(username,password):
    user = username_mapping.get(username,None)
    if user and safe_str_cmp(user.password,password):
        return user

def identity(payload):
    user_id = payload['identity']
    return userid_mapping.get(user_id,None)


