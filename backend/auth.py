from flask import Blueprint, request, jsonify
from werkzeug.security import generate_password_hash, check_password_hash
from utils.supabase import supabase_client
from utils.token_utils import create_token

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    if not email or not password:
        return jsonify({'message': 'Email and password required'}), 400

    # Check if user already exists
    response = supabase_client.table('users').select('id').eq('email', email).execute()
    if response.data:
        return jsonify({'message': 'User already exists'}), 400

    password_hash = generate_password_hash(password)
    
    # Insert new user
    response = supabase_client.table('users').insert({
        'email': email,
        'password_hash': password_hash
    }).execute()

    if not response.data:
        return jsonify({'message': 'Could not create user'}), 500

    user_id = response.data[0]['id']
    token = create_token(user_id)
    return jsonify({'token': token}), 201

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    if not email or not password:
        return jsonify({'message': 'Email and password required'}), 400

    response = supabase_client.table('users').select('id, password_hash').eq('email', email).execute()

    if not response.data:
        return jsonify({'message': 'Invalid credentials'}), 401

    user = response.data[0]
    if not check_password_hash(user['password_hash'], password):
        return jsonify({'message': 'Invalid credentials'}), 401

    token = create_token(user['id'])
    return jsonify({'token': token}), 200