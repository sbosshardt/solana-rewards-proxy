const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const cors = require('cors');

const app = express();

app.use(cors());

// Function to generate a random string for the Sol-Au header
function generateRandomString() {
    let e = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789==--",
        t = Array(16).join().split(",").map(function () {
            return e.charAt(Math.floor(Math.random() * e.length));
        }).join(""),
        r = Array(16).join().split(",").map(function () {
            return e.charAt(Math.floor(Math.random() * e.length));
        }).join(""),
        n = Math.floor(31 * Math.random()),
        o = "".concat(t).concat(r),
        i = [o.slice(0, n), "B9dls02fK", o.slice(n)].join("");
    return i;
}

const middlewareHandler = {
    proxyReq: (proxyReq, req, res) => {
        console.log('onProxyReq triggered');
        console.log('proxyReq headers before modification:', proxyReq.getHeaders());

        // Remove potentially problematic headers
        proxyReq.removeHeader('host');
        proxyReq.removeHeader('x-forwarded-for');
        proxyReq.removeHeader('x-forwarded-host');
        proxyReq.removeHeader('x-forwarded-port');
        proxyReq.removeHeader('x-forwarded-proto');
        proxyReq.removeHeader('x-forwarded-server');
        proxyReq.removeHeader('x-real-ip');
        proxyReq.removeHeader('connection');
        //proxyReq.removeHeader('method');

        // Optionally, modify the Origin and Referer headers to match the expected values
        proxyReq.setHeader('origin', 'https://solscan.io');
        proxyReq.setHeader('referer', 'https://solscan.io/');
        proxyReq.setHeader('accept', 'application/json, text/plain, */*');
        proxyReq.setHeader('sol-au', generateRandomString());

        console.log('proxyReq after modification:', proxyReq);
        console.log('Modified request headers for upstream server:', proxyReq.getHeaders());
    },
    proxyRes: (proxyRes, req, res) => {
        console.log('onProxyRes triggered');
        console.log('Response from upstream server:', proxyRes);
    },
    error: (err, req, res) => {
        console.log('Proxy error:', err);
    },
}

// Explicitly handle OPTIONS for the proxy route
app.options('/v2/validator/stake/reward', cors());

app.use('/v2/validator/stake/reward', createProxyMiddleware({
    target: 'https://api.solscan.io',
    changeOrigin: true,
    pathRewrite: { '^/': '/v2/validator/stake/reward' },
    on: middlewareHandler,
    secure: false, // Set to true if you want to verify the SSL certificate
}));

const port = 3000;
app.listen(port, () => {
    console.log(`CORS proxy running on port ${port}`);
});