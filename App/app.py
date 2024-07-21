from flask import Flask, request, render_template, redirect, url_for, session
import google.generativeai as genai
import requests

app = Flask(__name__)
app.secret_key = 'your_secret_key'  # Change this to a secure secret key

# Configure Google Generative AI
GOOGLE_API_KEY = "AIzaSyDpqKm-N1x0Lyzam235kPyMdfDeaDXvj88"
genai.configure(api_key=GOOGLE_API_KEY)
model = genai.GenerativeModel('gemini-pro')

# OpenWeather API key
OPENWEATHER_API_KEY = "014bc847ccb58ee9516a4c16f596e610"

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/admin-login', methods=['GET', 'POST'])
def admin_login():
    if 'logged_in' in session:
        return redirect(url_for('admin_dashboard'))
    
    if request.method == 'POST':
        admin_id = request.form.get('id')
        admin_password = request.form.get('password')
        if admin_id == 'admin' and admin_password == 'admin':
            session['logged_in'] = True
            return redirect(url_for('admin_dashboard'))
        else:
            return "Invalid ID or Password. Please try again.", 401
    
    return render_template('admin_login.html')

@app.route('/admin-dashboard')
def admin_dashboard():
    if 'logged_in' not in session:
        return redirect(url_for('admin_login'))
    return render_template('admin_dashboard.html')

@app.route('/get-itinerary', methods=['POST'])
def get_itinerary():
    data = request.get_json()
    destination = data.get('destination')
    start_date = data.get('start_date')
    end_date = data.get('end_date')
    interests = data.get('interests')
    
    itinerary = f"Plan your trip to {destination} from {start_date} to {end_date} with interests in {', '.join(interests)}."
    return jsonify({'itinerary': itinerary})

@app.route('/chat', methods=['POST'])
def chat():
    data = request.get_json()
    message = data.get('message')
    
    response = model.generate_content(message)
    response.resolve()
    
    return jsonify({'response': response.text})

@app.route('/get-weather', methods=['POST'])
def get_weather():
    data = request.get_json()
    latitude = data.get('latitude')
    longitude = data.get('longitude')
    
    weather_response = requests.get(f'http://api.openweathermap.org/data/2.5/weather?lat={latitude}&lon={longitude}&appid={OPENWEATHER_API_KEY}')
    weather_data = weather_response.json()

    air_quality_response = requests.get(f'http://api.openweathermap.org/data/2.5/air_pollution?lat={latitude}&lon={longitude}&appid={OPENWEATHER_API_KEY}')
    air_quality_data = air_quality_response.json()
    
    weather_description = weather_data['weather'][0]['description']
    air_quality = air_quality_data['list'][0]['main']['aqi']
    
    return jsonify({
        'weather': weather_description,
        'air_quality': air_quality
    })

if __name__ == '__main__':
    app.run(debug=True)
