function isValidIP(ip) {
    const ipv4Pattern = /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
    const ipv6Pattern = /^([0-9a-fA-F]{1,4}:){7}([0-9a-fA-F]{1,4}|:)$/;
    return ipv4Pattern.test(ip) || ipv6Pattern.test(ip);
}

document.getElementById('ipForm').addEventListener('submit', function (event) {
    event.preventDefault();
    const ip = document.getElementById('ipInput').value;

    if (!isValidIP(ip)) {
        document.getElementById('results').innerHTML = `<div>❌ Error: Invalid IP address</div>`;
        return;
    }

    fetch(`https://ipwhois.app/json/${ip}`)
        .then(response => response.json())
        .then(data => {
            if (data.success === false) {
                document.getElementById('results').innerHTML = `<div>❌ Error: ${data.message}</div>`;
                return;
            }
            const resultDiv = document.getElementById('results');
            resultDiv.innerHTML = `
                <div><strong> 🌐 IP:</strong> ${data.ip}</div>
                <div><strong> 🏙️ City:</strong> ${data.city}</div>
                <div><strong> 🌍 Region:</strong> ${data.region}</div>
                <div><strong> 🇺🇸 Country:</strong> ${data.country}</div>
                <div><strong> 📍 Location:</strong> ${data.latitude}, ${data.longitude}</div>
                <div><strong> 💼 ISP:</strong> ${data.isp}</div>
                <div><strong> 🕒 Timezone:</strong> ${data.timezone}</div>
                <button id="showMapBtn">Show Location on Map</button>
            `;

            const showMapBtn = document.getElementById('showMapBtn');
            showMapBtn.addEventListener('click', function() {
                const modal = document.getElementById('locationModal');
                modal.style.display = "block";
                const map = L.map('map').setView([data.latitude, data.longitude], 13);
                L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                }).addTo(map);
                L.marker([data.latitude, data.longitude]).addTo(map)
                    .bindPopup(`<b>${data.city}</b><br>${data.region}, ${data.country}`).openPopup();
            });

            const span = document.getElementsByClassName('close')[0];
            span.onclick = function() {
                const modal = document.getElementById('locationModal');
                modal.style.display = "none";
            }

            window.onclick = function(event) {
                const modal = document.getElementById('locationModal');
                if (event.target == modal) {
                    modal.style.display = "none";
                }
            }
        })
        .catch(() => {
            const results = document.getElementById('results');
            results.innerHTML = `<div>Error fetching data. Please try again. 😞</div>`;
        });
});

document.addEventListener('DOMContentLoaded', function () {
    const colors = ['#FF5733', '#33FF57', '#3357FF', '#FF33A1', '#000000', '#FF5733', '#FF8C00', '#FFD700', '#ADFF2F', '#00FF7F', '#00CED1', '#1E90FF', '#9370DB', '#FF1493', '#000000'];
    let colorIndex = 0;

    setInterval(() => {
        document.body.style.backgroundColor = colors[colorIndex];
        colorIndex = (colorIndex + 1) % colors.length;
    }, 5000);
});