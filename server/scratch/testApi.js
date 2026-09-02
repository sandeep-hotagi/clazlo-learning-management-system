const http = require('http');

function post(url, data) {
  return new Promise((resolve, reject) => {
    const bodyStr = JSON.stringify(data);
    const req = http.request(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(bodyStr)
      }
    }, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, data: JSON.parse(body) });
        } catch (e) {
          resolve({ status: res.statusCode, data: body });
        }
      });
    });
    req.on('error', reject);
    req.write(bodyStr);
    req.end();
  });
}

function get(url, token) {
  return new Promise((resolve, reject) => {
    const headers = {};
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    const req = http.request(url, {
      method: 'GET',
      headers
    }, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, data: JSON.parse(body) });
        } catch (e) {
          resolve({ status: res.statusCode, data: body });
        }
      });
    });
    req.on('error', reject);
    req.end();
  });
}

async function test() {
  try {
    console.log("Logging in as teacher1@school.com...");
    const loginRes = await post('http://localhost:5000/api/auth/login', {
      role: 'teacher',
      teacherId: 'T1001',
      password: 'Teacher@123'
    });
    
    if (loginRes.status !== 200) {
      console.error("Login failed:", loginRes);
      return;
    }
    
    const token = loginRes.data.token;
    console.log("Login successful! Token acquired.");

    console.log("\nFetching classes...");
    const classesRes = await get('http://localhost:5000/api/teacher/classes', token);
    console.log("Classes status:", classesRes.status);
    console.log("Classes data:", JSON.stringify(classesRes.data, null, 2));

  } catch (err) {
    console.error("API request failed:", err);
  }
}

test();
