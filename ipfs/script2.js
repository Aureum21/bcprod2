const channel = new BroadcastChannel('fileHashChannel'); // Connect to the same channel

channel.addEventListener('message', (event) => {
    console.log("Received Hash:", event.data.fileHash);
});

window.handlePreview = function(fileData) {
    try {
        const file = JSON.parse(decodeURIComponent(fileData));
        console.log('Preview file data:', file);
        
        if (!file.hash || !file.filename) {
            throw new Error('Invalid file data: missing hash or filename');
        }
        
        openPreview(file.hash, file.filename);
    } catch (error) {
        console.error('Error handling preview:', error);
        alert('Error opening preview: ' + error.message);
    }
};