# app/api/maps_routes.py

from flask import Blueprint, jsonify
from flask_wtf.csrf import generate_csrf
import os

maps_routes = Blueprint('maps', __name__)

@maps_routes.route('/key', methods=['POST'])
def get_maps_key():
    # Get the Maps API key from environment variables
    google_maps_api_key = os.environ.get('MAPS_API_KEY')

    # Return the API key in the response
    return jsonify({'googleMapsAPIKey': google_maps_api_key})


@maps_routes.route('/id', methods=['POST'])
def get_maps_id():
    # Get the Maps API key from environment variables
    google_maps_id = os.environ.get('MAPS_ID')

    # Return the API key in the response
    return jsonify({'googleMapsID': google_maps_id})
