const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();

// Proxy endpoint for Solscan API
app.use('/v2/validator/stake/reward', createProxyMiddleware({
    target: 'https://api.solscan.io/v2/validator/stake/reward',
    changeOrigin: true,
    pathRewrite: { '^/v2/validator/stake/reward': '' },
}));

// Proxy endpoint for Coinbase API for SOL-USD
app.use('/products/SOL-USD/candles', createProxyMiddleware({
    target: 'https://api.exchange.coinbase.com/products/SOL-USD/candles',
    changeOrigin: true,
    pathRewrite: { '^/products/SOL-USD/candles': '' },
}));

const port = 3000; // You can choose any port
app.listen(port, () => {
    console.log(`CORS proxy running on port ${port}`);
});

