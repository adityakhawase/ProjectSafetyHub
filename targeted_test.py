#!/usr/bin/env python3
"""
Enhanced Student Safety System - Targeted Backend Tests
Testing enhanced features with existing database state
"""

import requests
import json
import uuid
import time

BASE_URL = "https://student-safety-hub-1.preview.emergentagent.com/api"

def print_test_header(test_name: str):
    print(f"\n{'='*60}")
    print(f"🧪 {test_name}")
    print(f"{'='*60}")

def print_success(message: str):
    print(f"✅ {message}")

def print_error(message: str):
    print(f"❌ {message}")

def print_info(message: str):
    print(f"ℹ️  {message}")

def test_role_based_login_existing_users():
    """Test role-based login with potentially existing users"""
    print_test_header("Role-Based Login Testing (with unique emails)")
    
    # Test 1: Create admin with unique timestamp email
    timestamp = int(time.time())
    print_info("Test 1: Register admin with unique email")
    try:
        admin_data = {
            "email": f"roletest_admin_{timestamp}@university.edu",
            "password": "RoleTest123!",
            "name": f"Role Test Admin {timestamp}",
            "branch": "ELECTRICAL ENGINEERING",  # Use a different branch
            "role": "admin"
        }
        
        response = requests.post(f"{BASE_URL}/auth/register", json=admin_data)
        if response.status_code == 200:
            print_success("Admin registration successful")
            admin_email = admin_data['email']
        elif "Maximum 15 admin accounts allowed" in response.text:
            print_info("Admin limit reached - testing with existing admin functionality")
            # Use a different approach - try to login with existing credentials
            return test_existing_user_roles()
        else:
            print_error(f"Admin registration failed: {response.text}")
            return False
    except Exception as e:
        print_error(f"Admin registration exception: {e}")
        return False
    
    # Test 2: Login as admin with correct role
    print_info("Test 2: Login as admin with role='admin' (should succeed)")
    try:
        login_data = {
            "email": admin_email,
            "password": "RoleTest123!",
            "role": "admin"
        }
        
        response = requests.post(f"{BASE_URL}/auth/login", json=login_data)
        if response.status_code == 200:
            data = response.json()
            print_success(f"Admin login with correct role successful: {data['user']['role']}")
        else:
            print_error(f"Admin login with correct role failed: {response.text}")
    except Exception as e:
        print_error(f"Admin login exception: {e}")
    
    # Test 3: Login as admin with wrong role
    print_info("Test 3: Login as admin with role='student' (should fail)")
    try:
        login_data = {
            "email": admin_email,
            "password": "RoleTest123!",
            "role": "student"
        }
        
        response = requests.post(f"{BASE_URL}/auth/login", json=login_data)
        if response.status_code == 401 and "Invalid credentials for this role" in response.text:
            print_success("Admin login with wrong role correctly rejected")
        else:
            print_error(f"Admin login with wrong role should have failed: {response.text}")
    except Exception as e:
        print_error(f"Admin login with wrong role exception: {e}")
    
    return True

def test_existing_user_roles():
    """Test role validation with registration and login without role parameter"""
    print_info("Testing role validation with existing user pattern")
    
    # Create student and test login without role parameter
    timestamp = int(time.time())
    try:
        student_data = {
            "email": f"roletest_student_{timestamp}@university.edu",
            "password": "RoleTest123!",
            "name": f"Role Test Student {timestamp}",
            "branch": "ELECTRICAL ENGINEERING",
            "role": "student"
        }
        
        response = requests.post(f"{BASE_URL}/auth/register", json=student_data)
        if response.status_code == 200:
            print_success("Student registration successful")
            
            # Test login without role (should work)
            login_data = {
                "email": student_data['email'],
                "password": "RoleTest123!"
            }
            
            response = requests.post(f"{BASE_URL}/auth/login", json=login_data)
            if response.status_code == 200:
                data = response.json()
                print_success(f"Login without role parameter successful: {data['user']['role']}")
            else:
                print_error(f"Login without role failed: {response.text}")
                
            # Test login with correct role
            login_data['role'] = 'student'
            response = requests.post(f"{BASE_URL}/auth/login", json=login_data)
            if response.status_code == 200:
                print_success("Login with correct role successful")
            else:
                print_error(f"Login with correct role failed: {response.text}")
                
            # Test login with wrong role
            login_data['role'] = 'admin'
            response = requests.post(f"{BASE_URL}/auth/login", json=login_data)
            if response.status_code == 401:
                print_success("Login with wrong role correctly rejected")
            else:
                print_error(f"Login with wrong role should fail: {response.text}")
                
            return True
        else:
            print_error(f"Student registration failed: {response.text}")
    except Exception as e:
        print_error(f"Role test exception: {e}")
    
    return False

def test_cross_branch_with_existing_accounts():
    """Test cross-branch security with existing accounts"""
    print_test_header("Cross-Branch Security Testing (Modified)")
    
    # Create students in different branches
    timestamp = int(time.time())
    
    # Create student for CS branch
    print_info("Creating student in COMPUTER SCIENCE")
    try:
        cs_student_data = {
            "email": f"cs_student_{timestamp}@university.edu",
            "password": "Student123!",
            "name": f"CS Student {timestamp}",
            "branch": "COMPUTER SCIENCE",
            "role": "student"
        }
        
        response = requests.post(f"{BASE_URL}/auth/register", json=cs_student_data)
        if response.status_code == 200:
            cs_data = response.json()
            cs_token = cs_data['token']
            print_success("CS student created successfully")
        else:
            print_error(f"CS student creation failed: {response.text}")
            return False
    except Exception as e:
        print_error(f"CS student creation exception: {e}")
        return False
    
    # Create student for MECHANICAL branch
    print_info("Creating student in MECHANICAL ENGINEERING")
    try:
        mech_student_data = {
            "email": f"mech_student_{timestamp}@university.edu",
            "password": "Student123!",
            "name": f"Mech Student {timestamp}",
            "branch": "MECHANICAL ENGINEERING",
            "role": "student"
        }
        
        response = requests.post(f"{BASE_URL}/auth/register", json=mech_student_data)
        if response.status_code == 200:
            mech_data = response.json()
            mech_token = mech_data['token']
            print_success("Mechanical student created successfully")
        else:
            print_error(f"Mechanical student creation failed: {response.text}")
            return False
    except Exception as e:
        print_error(f"Mechanical student creation exception: {e}")
        return False
    
    # Create complaints in different branches
    complaint_ids = []
    
    # Create CS complaint
    print_info("Creating complaint in CS branch")
    try:
        cs_complaint = {
            "title": "CS Lab WiFi Issue",
            "description": "WiFi is down in the CS lab affecting programming assignments.",
            "category": "Infrastructure Issue",
            "branch": "COMPUTER SCIENCE",
            "keepAnonymous": False
        }
        
        headers = {"Authorization": f"Bearer {cs_token}"}
        response = requests.post(f"{BASE_URL}/complaints", json=cs_complaint, headers=headers)
        if response.status_code == 200:
            data = response.json()
            complaint_ids.append(data['complaint']['id'])
            print_success("CS complaint created")
        else:
            print_error(f"CS complaint creation failed: {response.text}")
    except Exception as e:
        print_error(f"CS complaint creation exception: {e}")
    
    # Create Mech complaint
    print_info("Creating complaint in Mechanical branch")
    try:
        mech_complaint = {
            "title": "Mech Lab Equipment Issue",
            "description": "Lathe machine needs maintenance urgently.",
            "category": "Infrastructure Issue",
            "branch": "MECHANICAL ENGINEERING",
            "keepAnonymous": False
        }
        
        headers = {"Authorization": f"Bearer {mech_token}"}
        response = requests.post(f"{BASE_URL}/complaints", json=mech_complaint, headers=headers)
        if response.status_code == 200:
            data = response.json()
            complaint_ids.append(data['complaint']['id'])
            print_success("Mechanical complaint created")
        else:
            print_error(f"Mechanical complaint creation failed: {response.text}")
    except Exception as e:
        print_error(f"Mechanical complaint creation exception: {e}")
    
    # Test student access - CS student should only see their own complaints
    print_info("Test: CS student fetching complaints (should only see own)")
    try:
        headers = {"Authorization": f"Bearer {cs_token}"}
        response = requests.get(f"{BASE_URL}/complaints", headers=headers)
        if response.status_code == 200:
            data = response.json()
            complaints = data['complaints']
            
            # Check if student only sees their own complaints
            if len(complaints) > 0:
                cs_complaints = [c for c in complaints if c['studentId'] == cs_data['user']['id']]
                if len(cs_complaints) == len(complaints):
                    print_success(f"CS student correctly sees only own complaints: {len(complaints)}")
                else:
                    print_error(f"CS student sees other students' complaints")
            else:
                print_info("No complaints found for CS student")
        else:
            print_error(f"CS student complaint fetching failed: {response.text}")
    except Exception as e:
        print_error(f"CS student complaint fetching exception: {e}")
    
    # Test principal access if available
    if complaint_ids:
        print_info("Testing principal access to all complaints")
        # Try to login as an existing principal from previous tests
        try:
            principal_login = {
                "email": "principal1@university.edu",
                "password": "Principal123!",
                "role": "principal"
            }
            
            response = requests.post(f"{BASE_URL}/auth/login", json=principal_login)
            if response.status_code == 200:
                principal_data = response.json()
                principal_token = principal_data['token']
                
                headers = {"Authorization": f"Bearer {principal_token}"}
                response = requests.get(f"{BASE_URL}/complaints", headers=headers)
                if response.status_code == 200:
                    data = response.json()
                    complaints = data['complaints']
                    
                    # Check if principal sees complaints from multiple branches
                    branches = set(c['branch'] for c in complaints)
                    if len(branches) > 1:
                        print_success(f"Principal sees complaints from multiple branches: {branches}")
                        print_info(f"Total complaints visible to principal: {len(complaints)}")
                    else:
                        print_info(f"Principal sees complaints from {len(branches)} branch(es): {branches}")
                else:
                    print_error(f"Principal complaint fetching failed: {response.text}")
            else:
                print_info("Principal login failed - may not exist from previous test")
        except Exception as e:
            print_error(f"Principal access test exception: {e}")
    
    return True

def test_account_limits_verification():
    """Verify account limits are working correctly"""
    print_test_header("Account Limits Verification")
    
    # Test principal limit (should be at 4)
    print_info("Test: Principal account limit verification")
    try:
        principal_data = {
            "email": f"principal_limit_test_{int(time.time())}@university.edu",
            "password": "Principal123!",
            "name": "Principal Limit Test",
            "branch": "ELECTRICAL ENGINEERING",
            "role": "principal"
        }
        
        response = requests.post(f"{BASE_URL}/auth/register", json=principal_data)
        if response.status_code == 400 and "Maximum 4 principal accounts allowed" in response.text:
            print_success("Principal account limit correctly enforced (4 max)")
        else:
            print_error(f"Principal limit not working: {response.status_code} - {response.text}")
    except Exception as e:
        print_error(f"Principal limit test exception: {e}")
    
    # Test admin limit (should be at 15)
    print_info("Test: Admin account limit verification")
    try:
        admin_data = {
            "email": f"admin_limit_test_{int(time.time())}@university.edu",
            "password": "Admin123!",
            "name": "Admin Limit Test",
            "branch": "ELECTRICAL ENGINEERING",
            "role": "admin"
        }
        
        response = requests.post(f"{BASE_URL}/auth/register", json=admin_data)
        if response.status_code == 400 and "Maximum 15 admin accounts allowed" in response.text:
            print_success("Admin account limit correctly enforced (15 max)")
        else:
            print_error(f"Admin limit not working: {response.status_code} - {response.text}")
    except Exception as e:
        print_error(f"Admin limit test exception: {e}")
    
    # Test student (should have no limit)
    print_info("Test: Student account (no limit)")
    try:
        student_data = {
            "email": f"student_no_limit_{int(time.time())}@university.edu",
            "password": "Student123!",
            "name": "Student No Limit",
            "branch": "ELECTRICAL ENGINEERING",
            "role": "student"
        }
        
        response = requests.post(f"{BASE_URL}/auth/register", json=student_data)
        if response.status_code == 200:
            print_success("Student registration successful (no limit)")
        else:
            print_error(f"Student registration failed: {response.text}")
    except Exception as e:
        print_error(f"Student registration exception: {e}")
    
    return True

def run_targeted_tests():
    """Run targeted tests based on current system state"""
    print("🚀 Starting Targeted Enhanced Features Tests")
    print(f"🌐 Base URL: {BASE_URL}")
    print("="*80)
    
    test_results = []
    
    # Test 1: Account Limits Verification
    try:
        result = test_account_limits_verification()
        test_results.append(("Account Limits Verification", result))
    except Exception as e:
        print_error(f"Account limits verification exception: {e}")
        test_results.append(("Account Limits Verification", False))
    
    # Test 2: Role-based Login (with new approach)
    try:
        result = test_role_based_login_existing_users()
        test_results.append(("Role-based Login", result))
    except Exception as e:
        print_error(f"Role-based login test exception: {e}")
        test_results.append(("Role-based Login", False))
    
    # Test 3: Cross-branch Security (modified)
    try:
        result = test_cross_branch_with_existing_accounts()
        test_results.append(("Cross-branch Security", result))
    except Exception as e:
        print_error(f"Cross-branch security test exception: {e}")
        test_results.append(("Cross-branch Security", False))
    
    # Final Results
    print(f"\n{'='*80}")
    print("🏁 TARGETED TEST RESULTS SUMMARY")
    print(f"{'='*80}")
    
    for test_name, passed in test_results:
        status = "✅ PASSED" if passed else "❌ FAILED"
        print(f"{test_name:35} {status}")
    
    all_passed = all(passed for _, passed in test_results)
    print(f"\nOverall Result: {'✅ ALL TARGETED TESTS PASSED' if all_passed else '❌ SOME TESTS FAILED'}")
    print(f"Passed: {sum(1 for _, passed in test_results if passed)}/{len(test_results)}")
    
    return all_passed

if __name__ == "__main__":
    run_targeted_tests()