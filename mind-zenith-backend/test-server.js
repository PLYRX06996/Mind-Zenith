const fetch = require('node-fetch');

async function testServer() {
    try {
        console.log('Testing server connection...');
        
        // Test 1: Check if server is running
        const response = await fetch('http://localhost:5000/');
        const data = await response.json();
        console.log('✅ Server is running:', data);
        
        // Test 2: Test registration
        console.log('\nTesting registration...');
        const registerResponse = await fetch('http://localhost:5000/api/auth/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: 'test@example.com',
                password: 'password123',
                displayName: 'Test User'
            })
        });
        
        const registerData = await registerResponse.json();
        console.log('Registration response:', registerData);
        console.log('Status:', registerResponse.status);
        
        if (registerData.token) {
            console.log('✅ Registration successful!');
            
            // Test 3: Test login
            console.log('\nTesting login...');
            const loginResponse = await fetch('http://localhost:5000/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email: 'test@example.com',
                    password: 'password123'
                })
            });
            
            const loginData = await loginResponse.json();
            console.log('Login response:', loginData);
            console.log('Status:', loginResponse.status);
            
            if (loginData.token) {
                console.log('✅ Login successful!');
                
                // Test 4: Test quizzes
                console.log('\nTesting quizzes...');
                const quizzesResponse = await fetch('http://localhost:5000/api/quizzes', {
                    headers: {
                        'Authorization': `Bearer ${loginData.token}`
                    }
                });
                
                const quizzesData = await quizzesResponse.json();
                console.log('Quizzes response:', quizzesData);
                console.log('Status:', quizzesResponse.status);
                
                if (quizzesData.length > 0) {
                    console.log('✅ Quizzes retrieved successfully!');
                }
            }
        }
        
    } catch (error) {
        console.error('❌ Error:', error.message);
    }
}

testServer(); 