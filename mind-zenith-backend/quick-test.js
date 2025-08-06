const http = require('http');

function makeRequest(path, method = 'GET', data = null, token = null) {
    return new Promise((resolve, reject) => {
        const options = {
            hostname: 'localhost',
            port: 5000,
            path: path,
            method: method,
            headers: {
                'Content-Type': 'application/json'
            }
        };

        if (token) {
            options.headers['Authorization'] = `Bearer ${token}`;
        }

        const req = http.request(options, (res) => {
            let body = '';
            res.on('data', (chunk) => {
                body += chunk;
            });
            res.on('end', () => {
                try {
                    const jsonData = JSON.parse(body);
                    resolve({ status: res.statusCode, data: jsonData });
                } catch (error) {
                    resolve({ status: res.statusCode, data: body });
                }
            });
        });

        req.on('error', (error) => {
            reject(error);
        });

        if (data) {
            req.write(JSON.stringify(data));
        }
        req.end();
    });
}

async function quickTest() {
    try {
        // Use the token from previous successful test
        const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2ODkyM2M1ZTYyMTliMjhkODZkYzM3OGEiLCJpYXQiOjE3NTQ0MTQxNzQsImV4cCI6MTc1NzAwNjE3NH0.TGk18ZqP2mssGp2PuaJ_35W9EPqvZLcm8e_RajYFrwQ';
        
        console.log('🧪 Testing quiz results...');
        const resultsResponse = await makeRequest('/api/quizzes/results', 'GET', null, token);
        console.log('Quiz results response:', resultsResponse);
        
        console.log('\n🧪 Testing quiz statistics...');
        const statsResponse = await makeRequest('/api/quizzes/stats', 'GET', null, token);
        console.log('Quiz statistics response:', statsResponse);
        
    } catch (error) {
        console.error('❌ Error:', error.message);
    }
}

quickTest(); 