#!/usr/bin/env python3

import requests 
import json
import sys
import os
from typing import Dict, Any

# Test configuration
BASE_URL = "https://student-safety-hub-1.preview.emergentagent.com"
API_BASE = f"{BASE_URL}/api"

def make_request(method: str, endpoint: str, data: Dict[Any, Any] = None, headers: Dict[str, str] = None) -> Dict[Any, Any]:
    """Make HTTP request and return response data"""
    url = f"{API_BASE}/{endpoint}"
    
    default_headers = {"Content-Type": "application/json"}
    if headers:
        default_headers.update(headers)
    
    try:
        if method.upper() == "GET":
            response = requests.get(url, headers=default_headers)
        elif method.upper() == "POST":
            response = requests.post(url, json=data, headers=default_headers)
        elif method.upper() == "PATCH":
            response = requests.patch(url, json=data, headers=default_headers)
        else:
            raise ValueError(f"Unsupported method: {method}")
        
        return {
            "status_code": response.status_code,
            "data": response.json() if response.content else {},
            "success": 200 <= response.status_code < 300
        }
    except requests.exceptions.RequestException as e:
        return {
            "status_code": 0,
            "data": {"error": str(e)},
            "success": False
        }
    except json.JSONDecodeError as e:
        return {
            "status_code": response.status_code,
            "data": {"error": f"JSON decode error: {str(e)}"},
            "success": False
        }

def test_public_stats_api():
    """Test 1: Public Stats API - No authentication required"""
    print("=== TEST 1: Public Stats API (No Authentication) ===")
    
    try:
        # Test public stats endpoint without any authentication
        result = make_request("GET", "public/stats")
        
        if not result["success"]:
            print(f"❌ Public stats API failed with status: {result['status_code']}")
            print(f"   Error: {result['data'].get('error', 'Unknown error')}")
            return False
        
        stats_data = result["data"]
        print(f"✅ Public stats API accessible without authentication")
        print(f"   Status code: {result['status_code']}")
        
        # Verify data structure
        required_fields = ["total", "resolved", "byBranch"]
        for field in required_fields:
            if field not in stats_data:
                print(f"❌ Missing required field: {field}")
                return False
                
        print(f"✅ All required fields present: {required_fields}")
        
        # Verify data types and content
        if not isinstance(stats_data["total"], int) or stats_data["total"] < 0:
            print(f"❌ Invalid total complaints: {stats_data['total']}")
            return False
            
        if not isinstance(stats_data["resolved"], int) or stats_data["resolved"] < 0:
            print(f"❌ Invalid resolved complaints: {stats_data['resolved']}")
            return False
            
        if not isinstance(stats_data["byBranch"], list):
            print(f"❌ byBranch should be an array")
            return False
        
        print(f"✅ Data format validation passed")
        print(f"   Total complaints: {stats_data['total']}")
        print(f"   Resolved complaints: {stats_data['resolved']}")
        print(f"   Branch count: {len(stats_data['byBranch'])}")
        
        # Store stats for accuracy verification later
        global public_stats_snapshot
        public_stats_snapshot = stats_data
        
        return True
        
    except Exception as e:
        print(f"❌ Test failed with exception: {str(e)}")
        return False

def test_auto_resolve_infrastructure():
    """Test 2: Auto-Resolve Infrastructure Issues"""
    print("\n=== TEST 2: Auto-Resolve Infrastructure Issues ===")
    
    try:
        # First register and login a student
        print("Step 1: Register test student...")
        register_data = {
            "email": "infrastructure.test@university.edu",
            "password": "TestPass123!",
            "name": "Infrastructure Test Student",
            "branch": "COMPUTER SCIENCE",
            "role": "student"
        }
        
        register_result = make_request("POST", "auth/register", register_data)
        
        if not register_result["success"]:
            print(f"❌ Student registration failed: {register_result['data'].get('error')}")
            return False
            
        token = register_result["data"]["token"]
        headers = {"Authorization": f"Bearer {token}"}
        print(f"✅ Student registered and logged in")
        
        # Submit Infrastructure Issue complaint
        print("Step 2: Submit Infrastructure Issue complaint...")
        complaint_data = {
            "title": "Broken Elevator in Engineering Block",
            "description": "The elevator on the 3rd floor has been out of order for weeks, making it difficult for students with disabilities to access upper floors.",
            "category": "Infrastructure Issue", 
            "branch": "COMPUTER SCIENCE",
            "keepAnonymous": False
        }
        
        complaint_result = make_request("POST", "complaints", complaint_data, headers)
        
        if not complaint_result["success"]:
            print(f"❌ Infrastructure complaint submission failed: {complaint_result['data'].get('error')}")
            return False
            
        complaint = complaint_result["data"]["complaint"]
        print(f"✅ Infrastructure Issue complaint submitted")
        print(f"   Complaint ID: {complaint['id']}")
        
        # Verify auto-resolve status
        if complaint["status"] != "resolved":
            print(f"❌ Infrastructure Issue NOT auto-resolved. Status: {complaint['status']}")
            return False
            
        print(f"✅ Infrastructure Issue automatically resolved")
        
        # Verify auto-reply message exists
        if not complaint.get("responses") or len(complaint["responses"]) == 0:
            print(f"❌ No auto-reply message found in responses")
            return False
            
        auto_reply = complaint["responses"][0]
        if auto_reply.get("adminId") != "system":
            print(f"❌ Auto-reply not from system. AdminId: {auto_reply.get('adminId')}")
            return False
            
        if "👍 HAVE A GOOD DAY 😊" not in auto_reply.get("message", ""):
            print(f"❌ Auto-reply message missing expected emoji text")
            return False
            
        print(f"✅ Auto-reply message present with correct system adminId")
        print(f"   Auto-reply preview: {auto_reply['message'][:100]}...")
        
        return True
        
    except Exception as e:
        print(f"❌ Test failed with exception: {str(e)}")
        return False

def test_non_infrastructure_complaints():
    """Test 3: Non-Infrastructure Complaints - Should NOT auto-resolve"""
    print("\n=== TEST 3: Non-Infrastructure Complaints (No Auto-Resolve) ===")
    
    try:
        # Register another student
        print("Step 1: Register test student for non-infrastructure test...")
        register_data = {
            "email": "harassment.test@university.edu",
            "password": "TestPass123!",
            "name": "Harassment Test Student", 
            "branch": "MECHANICAL ENGINEERING",
            "role": "student"
        }
        
        register_result = make_request("POST", "auth/register", register_data)
        
        if not register_result["success"]:
            print(f"❌ Student registration failed: {register_result['data'].get('error')}")
            return False
            
        token = register_result["data"]["token"]
        headers = {"Authorization": f"Bearer {token}"}
        print(f"✅ Student registered and logged in")
        
        # Submit Harassment complaint (non-infrastructure)
        print("Step 2: Submit Harassment complaint...")
        complaint_data = {
            "title": "Inappropriate Behavior by Senior Student",
            "description": "A senior student has been making inappropriate comments and creating an uncomfortable environment.",
            "category": "Harassment",
            "branch": "MECHANICAL ENGINEERING", 
            "keepAnonymous": True
        }
        
        complaint_result = make_request("POST", "complaints", complaint_data, headers)
        
        if not complaint_result["success"]:
            print(f"❌ Harassment complaint submission failed: {complaint_result['data'].get('error')}")
            return False
            
        complaint = complaint_result["data"]["complaint"]
        print(f"✅ Harassment complaint submitted")
        print(f"   Complaint ID: {complaint['id']}")
        
        # Verify status is pending (NOT auto-resolved)
        if complaint["status"] != "pending":
            print(f"❌ Non-infrastructure complaint should be pending. Status: {complaint['status']}")
            return False
            
        print(f"✅ Non-infrastructure complaint correctly remains pending")
        
        # Verify NO auto-reply for non-infrastructure
        if complaint.get("responses") and len(complaint["responses"]) > 0:
            print(f"❌ Non-infrastructure complaint should NOT have auto-reply. Found {len(complaint['responses'])} responses")
            return False
            
        print(f"✅ No auto-reply added for non-infrastructure complaint")
        
        return True
        
    except Exception as e:
        print(f"❌ Test failed with exception: {str(e)}")
        return False

def test_public_stats_accuracy():
    """Test 4: Verify Public Stats Accuracy"""
    print("\n=== TEST 4: Public Stats Accuracy Verification ===")
    
    try:
        # Get fresh stats after complaint submissions
        print("Step 1: Fetch updated public stats...")
        result = make_request("GET", "public/stats")
        
        if not result["success"]:
            print(f"❌ Public stats API failed: {result['data'].get('error')}")
            return False
            
        current_stats = result["data"]
        print(f"✅ Public stats retrieved successfully")
        
        # Compare with previous snapshot
        if 'public_stats_snapshot' in globals():
            prev_stats = public_stats_snapshot
            total_increase = current_stats["total"] - prev_stats["total"]
            resolved_increase = current_stats["resolved"] - prev_stats["resolved"]
            
            print(f"   Previous total: {prev_stats['total']}, Current total: {current_stats['total']}")
            print(f"   Previous resolved: {prev_stats['resolved']}, Current resolved: {current_stats['resolved']}")
            
            # We submitted 2 complaints: 1 infrastructure (auto-resolved) + 1 harassment (pending)
            # So total should increase by 2, resolved should increase by 1
            if total_increase >= 2:
                print(f"✅ Total complaints increased correctly by {total_increase}")
            else:
                print(f"⚠️  Total complaints increased by {total_increase} (expected at least 2)")
                
            if resolved_increase >= 1:
                print(f"✅ Resolved complaints increased correctly by {resolved_increase}")
            else:
                print(f"⚠️  Resolved complaints increased by {resolved_increase} (expected at least 1)")
        
        # Verify branch-wise stats structure
        branch_stats = current_stats["byBranch"]
        expected_branches = [
            "AIML", "COMPUTER SCIENCE", "MECHANICAL ENGINEERING", 
            "CIVIL ENGINEERING", "ELECTRONICS AND TELECOMMUNICATION", "ELECTRICAL ENGINEERING"
        ]
        
        found_branches = [branch["branch"] for branch in branch_stats]
        for expected_branch in expected_branches:
            if expected_branch not in found_branches:
                print(f"❌ Missing branch in stats: {expected_branch}")
                return False
                
        print(f"✅ All expected branches present in stats")
        
        # Verify branch stats have correct structure
        for branch_stat in branch_stats:
            required_fields = ["branch", "submitted", "resolved"]
            for field in required_fields:
                if field not in branch_stat:
                    print(f"❌ Missing field {field} in branch stats")
                    return False
                if not isinstance(branch_stat[field], (int, str)):
                    print(f"❌ Invalid type for {field} in branch stats")
                    return False
                    
        print(f"✅ Branch-wise stats structure validation passed")
        
        # Show some sample branch stats
        cs_stats = next((b for b in branch_stats if b["branch"] == "COMPUTER SCIENCE"), None)
        me_stats = next((b for b in branch_stats if b["branch"] == "MECHANICAL ENGINEERING"), None)
        
        if cs_stats:
            print(f"   COMPUTER SCIENCE: {cs_stats['submitted']} submitted, {cs_stats['resolved']} resolved")
        if me_stats:
            print(f"   MECHANICAL ENGINEERING: {me_stats['submitted']} submitted, {me_stats['resolved']} resolved")
        
        return True
        
    except Exception as e:
        print(f"❌ Test failed with exception: {str(e)}")
        return False

def main():
    """Run all tests for public dashboard and auto-resolve features"""
    print("🚀 STARTING PUBLIC DASHBOARD & AUTO-RESOLVE FEATURE TESTS")
    print("=" * 70)
    
    tests = [
        ("Public Stats API (No Auth)", test_public_stats_api),
        ("Auto-Resolve Infrastructure Issues", test_auto_resolve_infrastructure), 
        ("Non-Infrastructure Complaints", test_non_infrastructure_complaints),
        ("Public Stats Accuracy", test_public_stats_accuracy)
    ]
    
    passed = 0
    failed = 0
    
    for test_name, test_func in tests:
        try:
            if test_func():
                passed += 1
                print(f"✅ {test_name} - PASSED")
            else:
                failed += 1
                print(f"❌ {test_name} - FAILED")
        except Exception as e:
            failed += 1
            print(f"❌ {test_name} - FAILED with exception: {str(e)}")
        
        print("-" * 50)
    
    print("\n🏁 TEST SUMMARY")
    print("=" * 30)
    print(f"✅ Passed: {passed}")
    print(f"❌ Failed: {failed}")
    print(f"📊 Success Rate: {passed}/{len(tests)} ({100*passed//len(tests) if len(tests) > 0 else 0}%)")
    
    if failed > 0:
        print("\n⚠️  Some tests failed. Check the detailed output above.")
        sys.exit(1)
    else:
        print("\n🎉 All tests passed successfully!")
        sys.exit(0)

if __name__ == "__main__":
    main()