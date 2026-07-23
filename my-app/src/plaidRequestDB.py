import os
from dotenv import load_dotenv

import plaid
from plaid.api import plaid_api
from plaid.model.accounts_get_request import AccountsGetRequest
from plaid.model.sandbox_public_token_create_request import SandboxPublicTokenCreateRequest
from plaid.model.item_public_token_exchange_request import ItemPublicTokenExchangeRequest
from plaid.model.products import Products
import json
import email

load_dotenv()
client_id = os.getenv("CLIENT_ID")
sand_box = os.getenv("SANDBOX_SEC")
accounts = []


configuration = plaid.Configuration(
    host=plaid.Environment.Sandbox,
    api_key={
        "clientId": client_id,
        "secret": sand_box,
    })

def create_request():
    api_client = plaid.ApiClient(configuration)
    client = plaid_api.PlaidApi(api_client)
    request = SandboxPublicTokenCreateRequest(
        institution_id="ins_35", #Chime
        initial_products=[
            Products("transactions")
        ]
    )
    response = client.sandbox_public_token_create(request)
    public_token = response.public_token
    exchange_request = ItemPublicTokenExchangeRequest(
        public_token=public_token
    )
    exchange_response = client.item_public_token_exchange(exchange_request)
    access_token = exchange_response.access_token
    accounts_request = AccountsGetRequest(
        access_token=access_token
    )
    accounts_response = client.accounts_get(accounts_request)
  

def add_account(accounts_response):
    accounts = []

    for account in accounts_response.accounts:
        accounts.append({
            "id": account.account_id,
            "name": account.name,
            "type": str(account.type),
            "subtype": str(account.subtype),
            "balance": account.balances.current,
            "available": account.balances.available,
        })

    with open("userDB.json", "w", encoding="utf-8") as file:
        json.dump({"accounts": accounts}, file, indent=4, default=str)










create_request()


