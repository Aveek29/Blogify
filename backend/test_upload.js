const fs = require('fs');
const path = require('path');
const http = require('http');
const mongoose = require('mongoose');
require('dotenv').config();

const Post = require('./models/Post');

async function main() {
  // 1. Get auth token
  const creds = JSON.stringify({ email: 'demo@blogify.dev', password: 'Demo123!' });

  const token = await new Promise((resolve, reject) => {
    const opts = {
      hostname: 'localhost', port: 5000, path: '/api/auth/login',
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(creds) }
    };
    const req = http.request(opts, res => {
      let d = '';
      res.on('data', c => d += c);
      res.on('end', () => {
        try { resolve(JSON.parse(d).token); } catch(e) { reject(e); }
      });
    });
    req.write(creds);
    req.end();
  });
  console.log('Got token');

  // 2. Upload image via multipart
  const imgPath = path.join(__dirname, 'test-image.png');
  const testImg = Buffer.from(
    'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
    'base64'
  );
  fs.writeFileSync(imgPath, testImg);

  const boundary = '----WebKitFormBoundary' + Date.now();
  const header = Buffer.from(
    '--' + boundary + '\r\n' +
    'Content-Disposition: form-data; name="image"; filename="monkey.png"\r\n' +
    'Content-Type: image/png\r\n\r\n',
    'latin1'
  );
  const imgData = fs.readFileSync(imgPath);
  const footer = Buffer.from('\r\n--' + boundary + '--\r\n', 'latin1');
  const body = Buffer.concat([header, imgData, footer]);

  const uploadResult = await new Promise((resolve, reject) => {
    const opts = {
      hostname: 'localhost', port: 5000, path: '/api/upload',
      method: 'POST',
      headers: {
        'Content-Type': 'multipart/form-data; boundary=' + boundary,
        'Content-Length': body.length,
        'Authorization': 'Bearer ' + token
      }
    };
    const req = http.request(opts, res => {
      let d = '';
      res.on('data', c => d += c);
      res.on('end', () => {
        try { resolve({ status: res.statusCode, body: JSON.parse(d) }); } catch(e) { reject(e); }
      });
    });
    req.write(body);
    req.end();
  });

  console.log('Upload status:', uploadResult.status);
  console.log('Upload body:', JSON.stringify(uploadResult.body, null, 2));

  // 3. Update monkey post
  if (uploadResult.status === 200 && uploadResult.body.url) {
    await mongoose.connect(process.env.MONGODB_URI);
    const post = await Post.findOne({ title: /monkey/i });
    if (post) {
      console.log('\nBefore: imageUrl =', post.imageUrl);
      post.imageUrl = uploadResult.body.url;
      await post.save();
      console.log('After:  imageUrl =', post.imageUrl);

      // 4. Verify file on disk
      const filename = path.basename(uploadResult.body.url);
      const savedPath = path.join(__dirname, 'uploads', filename);
      console.log('\nFile on disk:', fs.existsSync(savedPath) ? 'YES ✓' : 'MISSING ✗');
      if (fs.existsSync(savedPath)) {
        console.log('File size:', fs.statSync(savedPath).size, 'bytes');
      }

      // 5. Verify it can be read back via the static route
      console.log('\nImage accessible at: http://localhost:5000/uploads/' + filename);
    }
    await mongoose.disconnect();
  }

  // Cleanup test file
  fs.unlinkSync(imgPath);
  console.log('\nDone');
  process.exit(0);
}

main().catch(e => { console.error(e); process.exit(1); });
