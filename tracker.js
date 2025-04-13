// Generate unique tracking ID
function generateTrackingId() {
    return 'trk-' + Math.random().toString(36).substring(2, 9);
}

// Handle form submission
document.getElementById('linkForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const linkName = document.getElementById('linkName').value;
    const destinationUrl = document.getElementById('destinationUrl').value;
    const trackingId = generateTrackingId();
    
    // Create tracking link
    const trackingLink = `${window.location.origin}/track/${trackingId}?redirect=${encodeURIComponent(destinationUrl)}`;
    
    // Display the tracking link
    document.getElementById('trackingLink').value = trackingLink;
    document.getElementById('resultContainer').classList.remove('hidden');
    
    // Save to local storage for demo purposes
    const links = JSON.parse(localStorage.getItem('trackingLinks') || '[]');
    links.push({
        id: trackingId,
        name: linkName || 'Untitled Link',
        destination: destinationUrl,
        created: new Date().toISOString(),
        visits: []
    });
    localStorage.setItem('trackingLinks', JSON.stringify(links));
});

// Copy to clipboard function
function copyToClipboard() {
    const copyText = document.getElementById('trackingLink');
    copyText.select();
    copyText.setSelectionRange(0, 99999);
    document.execCommand('copy');
    alert('Copied to clipboard!');
}

// For the dashboard link (will be implemented in server.js)
document.getElementById('dashboardLink').addEventListener('click', function(e) {
    e.preventDefault();
    alert('Dashboard functionality will be implemented in the backend');
});
