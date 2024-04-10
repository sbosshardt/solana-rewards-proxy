const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();

app.use('/api', createProxyMiddleware({
    target: 'https://api.solscan.io',
    changeOrigin: true,
    pathRewrite: {
        '^/api': '',
    },
    onProxyReq: (proxyReq, req, res) => {
        // Add headers or modify the request here
    }
}));

const port = 3000; // You can choose any port
app.listen(port, () => {
    console.log(`CORS proxy running on port ${port}`);
});

