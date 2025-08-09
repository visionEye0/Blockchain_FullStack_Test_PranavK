### 1. POST /policies — create a new policy

```
curl -X POST http://localhost:5000/policies \
-H "Content-Type: application/json" \
-d '{
  "farmer_id": "Farmer123",
  "crop_type": "Wheat",
  "coverage_amount": 10000,
  "premium": 500,
  "expiration_date": 1735689600,
  "token_id": 1
}'
```

### 2. GET /policies/:farmer_id — get all policies of a farmer
Replace Farmer123 with the actual farmer_id you want to query (case insensitive):

```
curl http://localhost:5000/policies/farmer123
```

### 3. POST /policies/claim — claim a policy by farmer_id and token_id

```
curl -X POST http://localhost:5000/policies/claim \
-H "Content-Type: application/json" \
-d '{
  "farmer_id": "Farmer123",
  "token_id": 1
}'

```
Notes:
Make sure your server is running at http://localhost:5000 or adjust URL accordingly.

The farmer_id is case-insensitive since you call .toLowerCase() on it in your routes.

You can check the responses to verify if the routes behave correctly.

For the claim route, if the policy doesn't exist or required fields are missing, you'll get appropriate errors.

