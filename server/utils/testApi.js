const verifyApi = async () => {
  const BASE_URL = 'http://localhost:5000/api';
  console.log('--- Starting API Verification Tests ---');

  try {
    // 1. Verify health check
    console.log('\n1. Testing Server Health endpoint...');
    const healthRes = await fetch(`${BASE_URL}/health`);
    if (!healthRes.ok) throw new Error(`Health check failed: ${healthRes.statusText}`);
    const healthData = await healthRes.json();
    console.log(`✅ Server Status: ${healthData.status} - Message: "${healthData.message}"`);

    // 2. Verify login session
    console.log('\n2. Testing Customer User Authentication...');
    const loginRes = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'john@shopez.com',
        password: 'password123'
      })
    });
    if (!loginRes.ok) throw new Error(`User Login failed: ${loginRes.statusText}`);
    const loginData = await loginRes.json();
    console.log(`✅ Authentication Success! Username: "${loginData.username}" - Token: [Received]`);
    const userToken = loginData.token;

    // 3. Verify product listing
    console.log('\n3. Testing Product Catalog Retrieval...');
    const productsRes = await fetch(`${BASE_URL}/products`);
    if (!productsRes.ok) throw new Error(`Product listing retrieval failed: ${productsRes.statusText}`);
    const productsData = await productsRes.json();
    console.log(`✅ Catalog Retrieval Success! Total Products found: ${productsData.totalProducts}`);
    console.log(`   Sample product: "${productsData.products[0]?.title}" by ${productsData.products[0]?.brand}`);

    // 4. Verify profile endpoint (Protected route)
    console.log('\n4. Testing Protected Profile Retrieval...');
    const profileRes = await fetch(`${BASE_URL}/auth/profile`, {
      headers: { 'Authorization': `Bearer ${userToken}` }
    });
    if (!profileRes.ok) throw new Error(`Profile retrieval failed: ${profileRes.statusText}`);
    const profileData = await profileRes.json();
    console.log(`✅ Protected Route access verified! Retrieved email: "${profileData.email}"`);

    console.log('\n🎉 ALL backend API checks completed successfully!');
  } catch (err) {
    console.error(`❌ API verification failed: ${err.message}`);
    process.exit(1);
  }
};

verifyApi();
