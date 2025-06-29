import axios from 'axios';

const testGroupAPI = async () => {
  try {
    console.log('Testing Group API...');
    
    // First, let's test if the server is running
    const healthCheck = await axios.get('http://localhost:5000/api/users');
    console.log('✅ Server is running');
    
    // Test group creation endpoint
    const testGroup = {
      groupName: 'Test Group',
      members: ['507f1f77bcf86cd799439011', '507f1f77bcf86cd799439012'] // Dummy user IDs
    };
    
    console.log('Testing group creation with:', testGroup);
    
    // Note: This will fail without a valid token, but it will show if the endpoint exists
    try {
      const response = await axios.post('http://localhost:5000/api/groups', testGroup, {
        headers: { 
          'Authorization': 'Bearer invalid-token',
          'Content-Type': 'application/json'
        }
      });
      console.log('✅ Group creation endpoint working:', response.data);
    } catch (error) {
      if (error.response?.status === 401) {
        console.log('✅ Group creation endpoint exists (401 Unauthorized expected)');
      } else {
        console.log('❌ Group creation endpoint error:', error.response?.data || error.message);
      }
    }
    
  } catch (error) {
    console.error('❌ Server connection error:', error.message);
  }
};

testGroupAPI(); 