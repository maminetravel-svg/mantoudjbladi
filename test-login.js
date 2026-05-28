async function testLogin() {
  try {
    const res = await fetch('https://api.mantoudjfellahbladi.com/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone: '0555000000', password: 'admin123' })
    });
    const text = await res.text();
    console.log('API Status:', res.status);
    console.log('API Response:', text);
  } catch(e) { console.error('API Error:', e); }

  try {
    const res2 = await fetch('https://mantoudjfellahbladi.com/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone: '0555000000', password: 'admin123' })
    });
    const text2 = await res2.text();
    console.log('Root Status:', res2.status);
    console.log('Root Response:', text2.substring(0, 50));
  } catch(e) { console.error('Root Error:', e); }
  
  try {
    const res3 = await fetch('https://mantoudj.rflydz.com/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone: '0555000000', password: 'admin123' })
    });
    const text3 = await res3.text();
    console.log('Rflydz Status:', res3.status);
    console.log('Rflydz Response:', text3);
  } catch(e) { console.error('Rflydz Error:', e); }
}
testLogin();
