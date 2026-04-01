import firebase_admin
from firebase_admin import credentials, auth
import os

credentials_path = os.environ.get('FIREBASE_ADMIN_CREDENTIALS', './credentials.json')
cred = credentials.Certificate(credentials_path)
firebase_admin.initialize_app(cred)

email = input("Enter the email of the user to make admin: ")

user = auth.get_user_by_email(email)
print(f'Successfully fetched user data: {user.uid}')

# Set custom claims for the user
auth.set_custom_user_claims(user.uid, {'admin': True})
print(f'Successfully made {email} an admin')
