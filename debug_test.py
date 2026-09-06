#!/usr/bin/env python3
"""
Debug test to identify the issue with backend_test.py
"""

import requests
import json
import uuid

BASE_URL = "https://student-safety-hub-1.preview.emergentagent.com"
API_BASE = f"{BASE_URL}/api"

def test_duplicate_registration():
    """Test duplicate registration"""
    test_email = f"debug_test_{uuid.uuid4().hex[:8]}@university.edu"
    
    test_data = {
        'email': test_email,
        'password': 'TestPass123!',
        'name': 'Debug User',
        'branch': 'COMPUTER SCIENCE',
        'role': 'student'
    }
    
    url = f"{API_BASE}/auth/register"
    
    print("=== Testing Duplicate Registration ===")
    
    # First registration
    print("1. First registration:")
    response1 = requests.post(url, json=test_data, timeout=30)
    print(f"   Status: {response1.status_code}")
    print(f"   Response type: {type(response1)}")
    print(f"   Is None: {response1 is None}")
    
    # Duplicate registration  
    print("2. Duplicate registration:")
    response2 = requests.post(url, json=test_data, timeout=30)
    print(f"   Status: {response2.status_code}")
    print(f"   Response type: {type(response2)}")
    print(f"   Is None: {response2 is None}")
    
    # Test the logic used in main test
    print("3. Logic test:")
    print(f"   response2: {response2}")
    print(f"   response2 and response2.status_code == 400: {response2 and response2.status_code == 400}")
    print(f"   bool(response2): {bool(response2)}")
    print(f"   response2.status_code: {response2.status_code}")
    
    if response2 and response2.status_code == 400:
        print("   ✅ Test would PASS")
    else:
        print(f"   ❌ Test would FAIL - got {response2.status_code if response2 else 'None'}")

def test_unauthorized_access():
    """Test unauthorized complaint access"""
    print("\n=== Testing Unauthorized Access ===")
    
    url = f"{API_BASE}/complaints"
    
    response = requests.get(url, timeout=30)
    print(f"Status: {response.status_code}")
    print(f"Response type: {type(response)}")
    print(f"Is None: {response is None}")
    
    if response and response.status_code == 401:
        print("✅ Test would PASS")
    else:
        print(f"❌ Test would FAIL - got {response.status_code if response else 'None'}")

if __name__ == "__main__":
    test_duplicate_registration()
    test_unauthorized_access()