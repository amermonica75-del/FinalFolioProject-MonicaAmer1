const fetch = global.fetch;

(async () => {
  try {
    const registerRes = await fetch('http://localhost:5000/api/auth/register', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        name: 'Debug User',
        email: 'debuguser@example.com',
        password: 'debugPass123'
      })
    });
    const registerData = await registerRes.json();
    console.log('register status', registerRes.status);
    console.log('register body', registerData);
    const token = registerData.token;
    if (!token) return;

    const formData = new FormData();
    formData.append('title', 'Debug Post');
    formData.append('body', 'This is created via a debug script.');

    const postRes = await fetch('http://localhost:5000/api/posts', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`
      },
      body: formData
    });
    const postData = await postRes.json();
    console.log('post status', postRes.status);
    console.log('post body', postData);
  } catch (error) {
    console.error('error', error);
  }
})();