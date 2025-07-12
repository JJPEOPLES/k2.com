// Maintenance notice script
document.addEventListener('DOMContentLoaded', function() {
    // Create maintenance notice
    var notice = document.createElement('div');
    notice.style.backgroundColor = '#ffcc00';
    notice.style.color = '#333';
    notice.style.textAlign = 'center';
    notice.style.padding = '15px';
    notice.style.fontWeight = 'bold';
    notice.style.fontSize = '16px';
    notice.style.position = 'sticky';
    notice.style.top = '0';
    notice.style.zIndex = '1000';
    notice.innerHTML = '⚠️ This website is currently locked down as the developer is taking a break. ⚠️';
    
    // Insert at the beginning of the body
    document.body.insertBefore(notice, document.body.firstChild);
});