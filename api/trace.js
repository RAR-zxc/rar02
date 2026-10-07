export default async function handler(req, res) {
  // Enable CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Get target IP from URL parameter ?ip=x.x.x.x
  const targetIp = req.query.ip || '';

  try {
    // Fetch data server-side from ipwho.is
    const response = await fetch(`https://ipwho.is/${targetIp}`);
    const data = await response.json();

    if (!data.success) {
      return res.status(400).json({ success: false, message: data.message || 'Invalid IP or lookup failed.' });
    }

    // Return clean JSON to frontend
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Server error processing request.' });
  }
}