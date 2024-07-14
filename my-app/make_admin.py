import firebase_admin
from firebase_admin import credentials, auth

# Ensure this path is correct
cred = credentials.Certificate('./firebase-adminsdk-tnq7v@smartshelf-426516.iam.gserviceaccount.com.json')
firebase_admin.initialize_app(cred)

email = input("Enter the email of the user to make admin: ")

user = auth.get_user_by_email(email)
print(f'Successfully fetched user data: {user.uid}')

# Set custom claims for the user
auth.set_custom_user_claims(user.uid, {'admin': True})
print(f'Successfully made {email} an admin')
