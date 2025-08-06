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

async function testServer() {
    try {
        console.log('🧪 Testing server connection...');
        
        // Test 1: Check if server is running
        const response = await makeRequest('/');
        console.log('✅ Server response:', response);
        
        // Test 2: Test registration with new email
        console.log('\n🧪 Testing registration...');
        const registerResponse = await makeRequest('/api/auth/register', 'POST', {
            email: 'newuser2@example.com',
            password: 'password123',
            displayName: 'New Test User 2'
        });
        
        console.log('Registration response:', registerResponse);
        
        if (registerResponse.data.token) {
            console.log('✅ Registration successful!');
            const token = registerResponse.data.token;
            
            // Test 3: Test login
            console.log('\n🧪 Testing login...');
            const loginResponse = await makeRequest('/api/auth/login', 'POST', {
                email: 'newuser2@example.com',
                password: 'password123'
            });
            
            console.log('Login response:', loginResponse);
            
            if (loginResponse.data.token) {
                console.log('✅ Login successful!');
                
                // Test 4: Test quizzes with token
                console.log('\n🧪 Testing quizzes...');
                const quizzesResponse = await makeRequest('/api/quizzes', 'GET', null, token);
                console.log('Quizzes response:', quizzesResponse);
                
                if (quizzesResponse.data.length > 0) {
                    console.log('✅ Quizzes retrieved successfully!');
                    
                    // Test 5: Test quiz submission
                    console.log('\n🧪 Testing quiz submission...');
                    const quizId = quizzesResponse.data[0]._id;
                    const submitResponse = await makeRequest(`/api/quizzes/${quizId}/submit`, 'POST', {
                        answers: [
                            { questionId: "q1", userAnswer: "1", score: 1 },
                            { questionId: "q2", userAnswer: "2", score: 2 },
                            { questionId: "q3", userAnswer: "1", score: 1 },
                            { questionId: "q4", userAnswer: "0", score: 0 },
                            { questionId: "q5", userAnswer: "2", score: 2 },
                            { questionId: "q6", userAnswer: "1", score: 1 },
                            { questionId: "q7", userAnswer: "0", score: 0 }
                        ],
                        timeSpent: 180
                    }, token);
                    
                    console.log('Quiz submission response:', submitResponse);
                    
                    if (submitResponse.data._id) {
                        console.log('✅ Quiz submission successful!');
                        
                        // Test 6: Test quiz results
                        console.log('\n🧪 Testing quiz results...');
                        const resultsResponse = await makeRequest('/api/quizzes/results', 'GET', null, token);
                        console.log('Quiz results response:', resultsResponse);
                        
                        if (resultsResponse.data.results) {
                            console.log('✅ Quiz results retrieved successfully!');
                        }
                        
                        // Test 7: Test quiz statistics
                        console.log('\n🧪 Testing quiz statistics...');
                        const statsResponse = await makeRequest('/api/quizzes/stats', 'GET', null, token);
                        console.log('Quiz statistics response:', statsResponse);
                        
                        if (statsResponse.data.overall) {
                            console.log('✅ Quiz statistics retrieved successfully!');
                        }
                    }
                }
            }
        }
        
    } catch (error) {
        console.error('❌ Error:', error.message);
    }
}

testServer(); 