document.addEventListener('DOMContentLoaded', () => {
    const itineraryForm = document.getElementById('itinerary-form');
    const chatboxForm = document.getElementById('chatbox-form');
    const chatboxInput = document.getElementById('chatbox-input');
    const chatboxMessages = document.getElementById('chatbox-messages');
    const weatherElement = document.getElementById('weather');
    const airQualityElement = document.getElementById('air-quality');

    itineraryForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const formData = new FormData(itineraryForm);
        const data = {
            destination: formData.get('destination'),
            start_date: formData.get('start-date'),
            end_date: formData.get('end-date'),
            interests: []
        };
        
        formData.getAll('interests').forEach(interest => {
            data.interests.push(interest);
        });
        
        const response = await fetch('/get-itinerary', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        const result = await response.json();
        alert(result.itinerary);
    });

    chatboxForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const message = chatboxInput.value;
        chatboxInput.value = '';

        const response = await fetch('/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ message })
        });

        const result = await response.json();
        chatboxMessages.innerHTML += `<p>User: ${message}</p>`;
        chatboxMessages.innerHTML += `<p>AI: ${result.response}</p>`;
        chatboxMessages.scrollTop = chatboxMessages.scrollHeight;
    });

    async function updateRealTimeUpdates() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(async (position) => {
                const latitude = position.coords.latitude;
                const longitude = position.coords.longitude;

                const response = await fetch('/get-weather', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ latitude, longitude })
                });

                const result = await response.json();
                weatherElement.textContent = `Weather: ${result.weather}`;
                airQualityElement.textContent = `Air Quality: ${result.air_quality}`;
            });
        }
    }

    // Update real-time data every 30 minutes
    updateRealTimeUpdates();
    setInterval(updateRealTimeUpdates, 1800000);
});
