document.addEventListener('DOMContentLoaded', function() {
    const modal = document.getElementById('previewModal');
    const fileInput = document.getElementById('fileInput');
    const dropZone = document.getElementById('dropZone');
    const uploadList = document.getElementById('uploadList');
    const filesList = document.getElementById('filesList');
    const searchInput = document.getElementById('searchInput');
    const fileViewOption = document.getElementById('fileViewOption');
    const closeBtn = modal.querySelector('.close-btn');
    const previewContainer = document.getElementById('previewContainer');
    const previewFileName = document.getElementById('previewFileName');

    let currentFiles = [];
    let allFiles = [];
    let uploadQueue = [];
    let isUploading = false;

    // Existing drag and drop handlers
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        dropZone.addEventListener(eventName, preventDefaults, false);
        document.body.addEventListener(eventName, preventDefaults, false);
    });

    ['dragenter', 'dragover'].forEach(eventName => {
        dropZone.addEventListener(eventName, highlight, false);
    });

    ['dragleave', 'drop'].forEach(eventName => {
        dropZone.addEventListener(eventName, unhighlight, false);
    });

    dropZone.addEventListener('drop', handleDrop, false);
    fileInput.addEventListener('change', handleFiles);
    fileViewOption.addEventListener('change', loadFiles);
    searchInput.addEventListener('input', handleSearch);
    closeBtn.addEventListener('click', closeModal);

    // Modal close on outside click
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });

    function preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
    }

    function highlight(e) {
        dropZone.classList.add('drag-over');
    }

    function unhighlight(e) {
        dropZone.classList.remove('drag-over');
    }

    function handleDrop(e) {
        const dt = e.dataTransfer;
        const files = dt.files;
        handleFiles({ target: { files } });
    }

    function getFileIcon(filename) {
        const ext = filename.split('.').pop().toLowerCase();
        let iconClass = 'far fa-file';
        let colorClass = '';
        let previewable = false;

        switch (ext) {
            case 'pdf':
                iconClass = 'far fa-file-pdf';
                colorClass = 'pdf';
                previewable = true;
                break;
            case 'doc':
            case 'docx':
                iconClass = 'far fa-file-word';
                colorClass = 'doc';
                break;
            case 'xls':
            case 'xlsx':
                iconClass = 'far fa-file-excel';
                colorClass = 'doc';
                break;
            case 'jpg':
            case 'jpeg':
            case 'png':
            case 'gif':
                iconClass = 'far fa-file-image';
                colorClass = 'img';
                previewable = true;
                break;
            case 'zip':
            case 'rar':
                iconClass = 'far fa-file-archive';
                colorClass = 'zip';
                break;
        }

        return { iconClass, colorClass, previewable };
    }

    function formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    async function handleFiles(e) {
        const files = [...e.target.files];
        files.forEach(uploadFile);
    }

    async function uploadFile(file) {
        const uploadItem = createUploadItem(file);
        uploadList.appendChild(uploadItem);

        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await fetch('/upload', {
                method: 'POST',
                body: formData
            });

            const result = await response.json();
            
            if (response.ok) {
                updateUploadStatus(uploadItem, 'success');
                loadFiles();
            } else {
                updateUploadStatus(uploadItem, 'error', result.error);
            }
        } catch (error) {
            updateUploadStatus(uploadItem, 'error', error.message);
        }
    }

    function createUploadItem(file) {
        const { iconClass, colorClass } = getFileIcon(file.name);
        const div = document.createElement('div');
        div.className = 'upload-item';
        div.innerHTML = `
            <div class="file-icon ${colorClass}">
                <i class="${iconClass}"></i>
            </div>
            <div class="file-info">
                <div class="file-name">${file.name}</div>
                <div class="file-size">${formatFileSize(file.size)}</div>
                <div class="progress-bar">
                    <div class="progress" style="width: 0%"></div>
                </div>
            </div>
            <div class="file-status">
                <i class="fas fa-spinner fa-spin"></i>
            </div>
        `;
        return div;
    }

    function updateUploadStatus(uploadItem, status, message = '') {
        const statusIcon = uploadItem.querySelector('.file-status i');
        const progress = uploadItem.querySelector('.progress');

        if (status === 'success') {
            statusIcon.className = 'fas fa-check';
            progress.style.width = '100%';
            setTimeout(() => {
                uploadItem.remove();
            }, 2000);
        } else if (status === 'error') {
            statusIcon.className = 'fas fa-times';
            uploadItem.querySelector('.file-info').appendChild(
                createErrorMessage(message)
            );
        }
    }

    function createErrorMessage(message) {
        const div = document.createElement('div');
        div.className = 'error-message';
        div.style.color = '#f44336';
        div.style.fontSize = '12px';
        div.style.marginTop = '4px';
        div.textContent = message;
        return div;
    }

    function handleSearch(e) {
        const searchTerm = e.target.value.toLowerCase();
        const filteredFiles = allFiles.filter(file => 
            file.filename.toLowerCase().includes(searchTerm)
        );
        renderFiles(filteredFiles);
    }

    async function openPreview(hash, filename) {
        try {
            const ext = filename.split('.').pop().toLowerCase();
            const isPdf = ext === 'pdf';
            const previewContainer = document.getElementById('previewContainer');
            const previewModal = document.getElementById('previewModal');
            const previewFileName = document.getElementById('previewFileName');
            
            if (!previewContainer || !previewModal || !previewFileName) {
                throw new Error('Preview elements not found');
            }

            // Set the filename in the header
            previewFileName.textContent = filename;
            
            // Clear previous content
            previewContainer.innerHTML = '';
            
            if (isPdf) {
                // For PDFs, create a download button
                const downloadBtn = document.createElement('div');
                downloadBtn.className = 'download-pdf-btn';
                downloadBtn.innerHTML = `
                    <div class="pdf-info">
                        <i class="fas fa-file-pdf" style="font-size: 48px; color: #dc3545;"></i>
                        <h3>${filename}</h3>
                        <p>Click to download and view the PDF</p>
                    </div>
                `;
                downloadBtn.onclick = () => {
                    window.location.href = `/preview/${hash}`;
                };
                previewContainer.appendChild(downloadBtn);
            } else {
                // For images, show preview
                const img = document.createElement('img');
                img.src = `/preview/${hash}`;
                img.alt = filename;
                img.className = 'preview-image';
                previewContainer.appendChild(img);
            }
            
            // Show the modal
            previewModal.classList.add('show');
        } catch (error) {
            console.error('Error opening preview:', error);
            alert('Error opening preview. Please try again.');
        }
    }

    function closeModal() {
        modal.classList.remove('show');
        setTimeout(() => {
            previewContainer.innerHTML = '';
        }, 300);
    }

    async function loadFiles() {
        try {
            const viewOption = fileViewOption.value;
            const response = await fetch(`/files?view=${viewOption}`);
            allFiles = await response.json();
            
            // Convert the mapping object to an array of file objects
            if (!Array.isArray(allFiles)) {
                allFiles = Object.entries(allFiles).map(([hash, filename]) => ({
                    hash,
                    filename
                }));
            }
            
            console.log('Loaded files:', allFiles);
            renderFiles(allFiles);
        } catch (error) {
            console.error('Error loading files:', error);
        }
    }


    const channel = new BroadcastChannel('fileHashChannel');

    document.getElementById('fileInput').addEventListener('change', async function(event) {
        const files = event.target.files;
        if (files.length === 0) return;
    
        const formData = new FormData();
        formData.append('file', files[0]); // Assuming a single file upload
    
        try {
            const response = await fetch('/upload', {
                method: 'POST',
                body: formData
            });
    
            const result = await response.json();
            
            if (response.ok) {
                console.log('File uploaded:', result);
                
                // Create a modal for displaying the hash
                const hashModal = document.createElement('div');
                hashModal.style.cssText = `
                    position: fixed;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    background: white;
                    padding: 20px;
                    border-radius: 8px;
                    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
                    z-index: 1000;
                    text-align: center;
                `;
                
                hashModal.innerHTML = `
                    <h3 style="margin-top: 0;">File Uploaded Successfully!</h3>
                    <p>Your file hash:</p>
                    <input type="text" value="${result.hash}" readonly style="
                        width: 100%;
                        padding: 8px;
                        margin: 10px 0;
                        border: 1px solid #ddd;
                        border-radius: 4px;
                        font-family: monospace;
                    ">
                    <button onclick="this.parentElement.remove(); window.close();" style="
                        padding: 8px 16px;
                        background: #4CAF50;
                        color: white;
                        border: none;
                        border-radius: 4px;
                        cursor: pointer;
                    ">Close</button>
                `;
                
                document.body.appendChild(hashModal);
                
                // Select the hash text for easy copying
                const hashInput = hashModal.querySelector('input');
                hashInput.select();
                
                channel.postMessage({ fileHash: result.hash });
            } else {
                console.error('Upload failed:', result.error);
                alert('Upload failed: ' + result.error);
            }
        } catch (error) {
            console.error('Error:', error);
            alert('An error occurred while uploading.');
        }
        
    });

    function renderFiles(files) {
        filesList.innerHTML = '';
        
        if (files.length === 0) {
            filesList.innerHTML = '<p>No files found.</p>';
            return;
        }

        files.forEach(file => {
            console.log('Rendering file:', file);

            const { iconClass, colorClass, previewable } = getFileIcon(file.filename);
            const fileCard = document.createElement('div');
            fileCard.className = 'file-card';
            
            let previewButton = '';
            if (previewable) {
                // Ensure we have both hash and filename
                const previewData = {
                    hash: file.hash,
                    filename: file.filename
                };
                console.log('Preview data:', previewData);
                
                previewButton = `
                    <button class="preview-btn" onclick="handlePreview('${encodeURIComponent(JSON.stringify(previewData))}')">
                        <i class="fas fa-eye"></i> Preview
                    </button>
                `;
            }

            fileCard.innerHTML = `
                <div class="file-icon ${colorClass}">
                    <i class="${iconClass}"></i>
                </div>
                <div class="file-info">
                    <div class="file-name">${file.filename}</div>
                    <div class="file-hash">IPFS: ${file.hash.substring(0, 15)}...</div>
                </div>
                <div class="file-actions">
                    ${previewButton}
                    <button class="action-btn" onclick="window.location.href='/download/${file.hash}'">
                        <i class="fas fa-download"></i> Download
                    </button>
                </div>
            `;
            filesList.appendChild(fileCard);
        });
    }

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

    // Close modal when clicking the close button
    closeBtn.addEventListener('click', () => {
        modal.classList.remove('show');
    });

    // Close modal when clicking outside the content
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.remove('show');
        }
    });

    // Initialize
    loadFiles();
});
