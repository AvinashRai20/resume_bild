#!/usr/bin/env python
"""Test authentication endpoints"""
import requests
import json

BASE_URL = 'http://127.0.0.1:3000'

def test_signup():
    """Test user signup"""
    print("\n=== Testing Signup ===")
    data = {
        'name': 'Test User',
        'email': 'test@example.com',
        'password': 'password123',
        'confirm_password': 'password123'
    }
    
    response = requests.post(f'{BASE_URL}/signup', data=data)
    print(f"Status: {response.status_code}")
    print(f"Response: {response.json()}")
    return response.status_code == 201

def test_login():
    """Test user login"""
    print("\n=== Testing Login ===")
    data = {
        'email': 'test@example.com',
        'password': 'password123'
    }
    
    response = requests.post(f'{BASE_URL}/login', data=data)
    print(f"Status: {response.status_code}")
    print(f"Response: {response.json()}")
    return response.status_code == 200

def test_api_user():
    """Test API user endpoint"""
    print("\n=== Testing /api/user ===")
    response = requests.get(f'{BASE_URL}/api/user')
    print(f"Status: {response.status_code}")
    print(f"Response: {response.json()}")

if __name__ == '__main__':
    try:
        # Test signup (may fail if user already exists)
        test_signup()
        
        # Test login
        test_login()
        
        # Test API user
        test_api_user()
        
        print("\n✅ All tests completed!")
    except Exception as e:
        print(f"\n❌ Error: {e}")
