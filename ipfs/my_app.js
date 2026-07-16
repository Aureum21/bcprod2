const express = require("express");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const axios = require("axios");
const FormData = require("form-data");
const pdfParse = require("pdf-parse");
const cors = require("cors");

const app = express();
app.use(cors());
const upload = multer({ dest: "temp/" });

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

// Constants
const IPFS_API = "http://127.0.0.1:5001";
const KEY_FILE = "encryption.key";
const FILENAME_MAPPING = "filename_mapping.json";
const SESSION_FILES = new Set();

// Helper function to reverse filename mapping
// function reverseMapping(mappings) {
//     const reversed = {};
//     for (const [hash, filename] of Object.entries(mappings)) {
//         reversed[filename] = hash;
//     }
//     return reversed;
// }

// Encryption functions
function getEncryptionKey() {
  try {
    if (fs.existsSync(KEY_FILE)) {
      return fs.readFileSync(KEY_FILE);
    } else {
      const key = crypto.randomBytes(32);
      fs.writeFileSync(KEY_FILE, key);
      return key;
    }
  } catch (error) {
    console.error("Error with encryption key:", error);
    throw error;
  }
}

function encryptFile(filePath, key) {
  try {
    const fileData = fs.readFileSync(filePath);
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv("aes-256-cbc", key, iv);
    const encrypted = Buffer.concat([
      iv,
      cipher.update(fileData),
      cipher.final(),
    ]);
    const encryptedPath = filePath + ".encrypted";
    fs.writeFileSync(encryptedPath, encrypted);
    return encryptedPath;
  } catch (error) {
    console.error("Error encrypting file:", error);
    throw error;
  }
}

function decryptFile(encryptedData, key) {
  try {
    const iv = encryptedData.slice(0, 16);
    const encryptedContent = encryptedData.slice(16);
    const decipher = crypto.createDecipheriv("aes-256-cbc", key, iv);
    return Buffer.concat([decipher.update(encryptedContent), decipher.final()]);
  } catch (error) {
    console.error("Error decrypting file:", error);
    throw error;
  }
}

function decryptBuffer(encryptedBuffer, key) {
  try {
    const iv = encryptedBuffer.slice(0, 16);
    const data = encryptedBuffer.slice(16);
    const decipher = crypto.createDecipheriv("aes-256-cbc", key, iv);
    const decrypted = Buffer.concat([decipher.update(data), decipher.final()]);
    return decrypted;
  } catch (error) {
    console.error("Decryption error:", error);
    throw error;
  }
}

// function decryptData(encryptedData) {
//     const key = getEncryptionKey();
//     return decryptFile(encryptedData, key);
// }

// async function uploadToIPFS(filePath) {
//     try {
//         const formData = new FormData();
//         formData.append('file', fs.createReadStream(filePath));

//         const response = await axios.post(`${IPFS_API}/api/v0/add?pin=true`, formData, {
//             headers: formData.getHeaders()
//         });

//         const ipfsHash = response.data.Hash;

//         // Pin the file
//         await axios.post(`${IPFS_API}/api/v0/pin/add?arg=${ipfsHash}`);
//         process.exit(0);

//     } catch (error) {
//         console.error('Error uploading to IPFS:', error);
//         return null;
//     }
// }

// async function extractPdfText(pdfBuffer) {
//     try {
//         const data = await pdfParse(pdfBuffer);

//         // Create a simple HTML preview with the text content
//         const htmlContent = `
//             <!DOCTYPE html>
//             <html>
//             <head>
//                 <style>
//                     body {
//                         font-family: Arial, sans-serif;
//                         line-height: 1.6;
//                         margin: 0;
//                         padding: 20px;
//                         background: #f5f5f5;
//                     }
//                     .container {
//                         max-width: 800px;
//                         margin: 0 auto;
//                         background: white;
//                         padding: 20px;
//                         border-radius: 8px;
//                         box-shadow: 0 2px 4px rgba(0,0,0,0.1);
//                     }
//                     .preview-text {
//                         white-space: pre-wrap;
//                         background: #f8f9fa;
//                         padding: 15px;
//                         border-radius: 4px;
//                         border: 1px solid #dee2e6;
//                         margin: 10px 0;
//                     }
//                     .info {
//                         color: #6c757d;
//                         font-style: italic;
//                         margin-top: 15px;
//                         font-size: 0.9em;
//                     }
//                 </style>
//             </head>
//             <body>
//                 <div class="container">
//                     <h2>PDF Preview</h2>
//                     <div class="preview-text">
//                         ${data.text.substring(0, 1500)}${data.text.length > 1500 ? '...' : ''}
//                     </div>
//                     <div class="info">
//                         <p>Pages: ${data.numpages}</p>
//                         <p>Note: This is a text-only preview. Download the file to view the complete PDF.</p>
//                     </div>
//                 </div>
//             </body>
//             </html>
//         `;

//         return Buffer.from(htmlContent);
//     } catch (error) {
//         console.error('PDF extraction error:', error);
//         throw error;
//     }
// }

// Routes
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.post("/upload", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    // Get the encryption key
    const key = getEncryptionKey();

    // Encrypt the file
    const encryptedData = encryptFile(req.file.path, key);

    // Create form data for IPFS
    const formData = new FormData();
    formData.append("file", fs.createReadStream(encryptedData), {
      filename: req.file.originalname,
      contentType: req.file.mimetype,
    });

    // Upload to IPFS
    const response = await axios.post(`${IPFS_API}/api/v0/add`, formData, {
      headers: formData.getHeaders(),
    });

    const hash = response.data.Hash;

    // Update filename mapping
    let filenameMapping = {};
    if (fs.existsSync(FILENAME_MAPPING)) {
      filenameMapping = JSON.parse(fs.readFileSync(FILENAME_MAPPING, "utf8"));
    }
    filenameMapping[hash] = req.file.originalname;
    fs.writeFileSync(
      FILENAME_MAPPING,
      JSON.stringify(filenameMapping, null, 2)
    );

    // Send data to the parent window instead of writing to file
    const fileData = {
      hash: hash,
      filename: req.file.originalname,
    };

    // Add to session files
    SESSION_FILES.add(req.file.originalname);
    console.log("Added to session files:", req.file.originalname);
    console.log("Current session files:", Array.from(SESSION_FILES));

    res.json({
      success: true,
      hash: hash,
      filename: req.file.originalname,
    });
  } catch (error) {
    console.error("Error uploading file:", error);
    res.status(500).json({ error: error.message });
  }
});

app.get("/files", (req, res) => {
  try {
    const viewOption = req.query.view;
    let files = [];
    const mappings = JSON.parse(
      fs.readFileSync("filename_mapping.json", "utf8")
    );

    console.log("View option:", viewOption);
    console.log("Session files:", Array.from(SESSION_FILES));
    console.log("All mappings:", mappings);

    if (viewOption === "current") {
      // Return only files from current session
      files = Array.from(SESSION_FILES)
        .map((filename) => {
          // Find the hash for this filename
          const hash = Object.entries(mappings).find(
            ([h, f]) => f === filename
          )?.[0];
          return hash ? { filename, hash } : null;
        })
        .filter((f) => f !== null); // Remove any null entries
    } else {
      // Return all files from mapping
      files = Object.entries(mappings).map(([hash, filename]) => ({
        hash,
        filename,
      }));
    }

    console.log("Sending files:", files);
    res.json(files);
  } catch (error) {
    console.error("Error getting files:", error);
    res.status(500).json({ error: "Error getting files" });
  }
});

app.get("/download/:hash", async (req, res) => {
  try {
    const response = await axios.post(
      `${IPFS_API}/api/v0/cat?arg=${req.params.hash}`,
      {},
      { responseType: "arraybuffer" }
    );

    const key = getEncryptionKey();
    const decryptedData = decryptFile(Buffer.from(response.data), key);

    // Get original filename
    let filename = req.params.hash;
    if (fs.existsSync(FILENAME_MAPPING)) {
      const mapping = JSON.parse(fs.readFileSync(FILENAME_MAPPING));
      if (mapping[req.params.hash]) {
        filename = mapping[req.params.hash];
      }
    }

    res.set("Content-Type", "application/octet-stream");
    res.set("Content-Disposition", `attachment; filename="${filename}"`);
    res.send(Buffer.from(decryptedData));
  } catch (error) {
    console.error("Download error:", error);
    res.status(500).json({ error: error.message });
  }
});

app.get("/preview/:hash", async (req, res) => {
  try {
    const hash = req.params.hash;
    console.log("Preview requested for hash:", hash);

    // Get the file mapping to determine content type
    const mappings = JSON.parse(
      fs.readFileSync("filename_mapping.json", "utf8")
    );
    const filename = mappings[hash];

    if (!filename) {
      return res.status(404).json({
        error: "File not found",
        requestedHash: hash,
        availableHashes: Object.keys(mappings),
      });
    }

    const ext = filename.split(".").pop().toLowerCase();
    const isPdf = ext === "pdf";
    const isImage = ["jpg", "jpeg", "png", "gif"].includes(ext);

    if (!isPdf && !isImage) {
      return res.status(400).json({
        error: "File type not supported for preview",
        extension: ext,
        supportedTypes: ["pdf", "jpg", "jpeg", "png", "gif"],
      });
    }

    try {
      // Get the encrypted file from IPFS
      const response = await axios({
        method: "post",
        url: "http://127.0.0.1:5001/api/v0/cat",
        params: { arg: hash },
        responseType: "arraybuffer",
      });

      console.log("File fetched from IPFS, size:", response.data.length);

      // Get encryption key and decrypt
      const key = fs.readFileSync("encryption.key");
      const decrypted = decryptBuffer(Buffer.from(response.data), key);
      console.log("File decrypted, size:", decrypted.length);

      if (isPdf) {
        // For PDFs, set content disposition to attachment to force download
        res.setHeader("Content-Type", "application/pdf");
        res.setHeader(
          "Content-Disposition",
          `attachment; filename="${filename}"`
        );
      } else {
        // For images, show inline
        res.setHeader(
          "Content-Type",
          {
            jpg: "image/jpeg",
            jpeg: "image/jpeg",
            png: "image/png",
            gif: "image/gif",
          }[ext]
        );
      }

      res.send(decrypted);
      console.log("File sent successfully");
    } catch (error) {
      console.error("IPFS or processing error:", error);
      res.status(500).json({
        error: "Error processing file",
        details: error.message,
        hash: hash,
        filename: filename,
      });
    }
  } catch (error) {
    console.error("Preview route error:", error);
    res.status(500).json({
      error: "Server error",
      details: error.message,
    });
  }
});

// Server startup
const PORT = process.env.PORT || 3000;
app.listen(PORT, async () => {
  console.log(`Server running on port ${PORT}`);

  // Check IPFS connection
  try {
    await axios.post(`${IPFS_API}/api/v0/version`);
    console.log("Successfully connected to IPFS");
  } catch (error) {
    console.warn(
      "Warning: Could not connect to IPFS. Please make sure IPFS Desktop is running!"
    );
  }
});

// Add cleanup function for server shutdown
process.on("SIGINT", async () => {
  console.log("Cleaning up session files...");
  try {
    // Unpin files from this session
    for (const hash of SESSION_FILES) {
      try {
        await axios.post(`${IPFS_API}/api/v0/pin/rm?arg=${hash}`);
        console.log(`Unpinned file: ${hash}`);
      } catch (error) {
        console.error(`Error unpinning file ${hash}:`, error.message);
      }
    }
  } catch (error) {
    console.error("Error during cleanup:", error);
  }
  process.exit(0);
});
