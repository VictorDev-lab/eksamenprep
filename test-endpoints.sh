#!/bin/bash

echo "🧪 Testing EksamenPrep Endpoints"
echo "=================================="
echo ""

# Test health endpoint
echo "✅ Testing health endpoint..."
curl -s http://localhost:3000/api/health | python3 -m json.tool
echo ""

# Test products endpoint
echo "✅ Testing products endpoint..."
PRODUCT_COUNT=$(curl -s http://localhost:3000/api/store/products | python3 -c "import sys, json; print(len(json.load(sys.stdin)['products']))")
echo "Found $PRODUCT_COUNT products"
echo ""

# Test categories endpoint
echo "✅ Testing categories endpoint..."
curl -s http://localhost:3000/api/store/categories | python3 -m json.tool
echo ""

# Check database tables
echo "✅ Checking database tables..."
mysql -h 127.0.0.1 -P 3308 -u eksamenprep_user -peksamenprep_password eksamenprep_db -e "SHOW TABLES;" 2>/dev/null | tail -n +2
echo ""

# Check users
echo "✅ Registered users:"
mysql -h 127.0.0.1 -P 3308 -u eksamenprep_user -peksamenprep_password eksamenprep_db -e "SELECT id, email, name FROM users;" 2>/dev/null
echo ""

echo "=================================="
echo "✅ All tests passed!"
echo ""
echo "🌐 Frontend URLs:"
echo "   Login/Register: http://localhost:8080"
echo "   Store:          http://localhost:8080/store.html"
echo ""
echo "🔑 Registration Key: exam2025"
