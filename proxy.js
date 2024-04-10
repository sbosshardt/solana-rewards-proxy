const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();

const corsHeaders = (req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization, Method');
    next();
};

app.use(corsHeaders);  // Apply CORS headers to all incoming requests

app.options('*', (req, res) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization, Method');
    res.sendStatus(200);
});

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
    onProxyRes: function (proxyRes, req, res) {
        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization, Method');
    },
    pathRewrite: { '^/products/SOL-USD/candles': '' },
}));

const port = 3000; // You can choose any port
app.listen(port, () => {
    console.log(`CORS proxy running on port ${port}`);
});
