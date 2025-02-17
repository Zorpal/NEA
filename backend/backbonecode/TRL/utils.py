from oauth2client import client

def get_google_token(code):
    credentials = client.credentials_from_clientsecrets_and_code(
        'client_secret.json',
        ['email', 'profile'],
        code
    )
    return credentials.id_token

