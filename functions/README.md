# Cloud Functions env

Migrate off functions.config() to dotenv (.env) per Firebase deprecation.

1) Copy `env.sample` to `.env` in this directory.
2) Fill values:
   - RAZORPAY_KEY_ID
   - RAZORPAY_KEY_SECRET
   - RAZORPAY_WEBHOOK_SECRET
3) Deploy normally: `firebase deploy --only functions`

Notes:
- Code reads process.env first, then falls back to functions.config() for backward compatibility.
- For local emulation, `.env` is loaded automatically by Functions runtime.
