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
    const req = http.request(url, {
      method: 'GET',
      headers: { Authorization: `Bearer ${token}` }
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
    console.log("Logging in as student1@school.com...");
    const loginRes = await post('http://localhost:5000/api/auth/login', {
      role: 'student',
      studentCode: 'S2001',
      password: 'Student@123'
    });
    
    if (loginRes.status !== 200) {
      console.error("Login failed:", loginRes);
      return;
    }
    
    const token = loginRes.data.token;
    console.log("Login successful! Token acquired. User ID:", loginRes.data.user.id);

    console.log("\nFetching raw homework documents...");
    const debugRes = await get('http://localhost:5000/api/student/debug-hw', token);
    console.log("Debug status:", debugRes.status);
    
    const testHw = debugRes.data.find(h => h.title === "Homework Test");
    if (testHw) {
      console.log("Found Homework Test:", JSON.stringify(testHw, null, 2));
    } else {
      console.log("Homework Test not found in debug list!");
    }

  } catch (err) {
    console.error("API request failed:", err);
  }
}

test();
