const https = require('https');
const fs = require('fs');
const path = require('path');
const url = 'https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ7Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpaCiVodG1sXzFkMTk2MDQzYTFkNDQ4N2I5MmZkYTIzNDY0NjllNTk4EgsSBxD-_4fGoR8YAZIBIwoKcHJvamVjdF9pZBIVQhM2NTQ1MzQ0Mjg5NDAwMzc1Mzg5&filename=&opi=89354086';

https.get(url, (res) => {
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    fs.writeFileSync(path.join(__dirname, 'mock_interview.html'), data);
    console.log('Saved mock_interview.html with length:', data.length);
  });
}).on('error', (err) => {
  console.error('Error fetching:', err);
});
