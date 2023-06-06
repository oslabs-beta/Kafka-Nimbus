#!/bin/bash
# Wait for Grafana to start
until curl -s http://grafana:3000
do
  echo "Waiting for Grafana to start..."
  sleep 5
done
# POST request to create organization
response=$(curl -s -X POST -H "Content-Type: application/json" -d '{"name":"kafka-nimbus"}' http://admin:admin@grafana:3000/api/orgs)
# Extract the orgId from the response
orgId=$(echo $response | jq -r '.orgId')
# POST request to use new org
curl -X POST http://admin:admin@grafana:3000/api/user/using/$orgId
# POST request to create API Key
keyResponse=$(curl -s -X POST -H "Content-Type: application/json" -d '{"name":"apikeycurl", "role": "Admin"}' http://admin:admin@grafana:3000/api/auth/keys)
# Extract the key from the response
apiKey=$(echo $keyResponse | jq -r '.key')
# Store the key in a file
echo $apiKey > /keys/apikey.txt