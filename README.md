# KisanMitra

KisanMitra is a MERN stack farmer intelligence platform for India with Mandi Saarthi, Yojna Khoj, Fasal Saathi and an admin dashboard.

## Run

```bash
npm run install-all
npm run seed
npm run dev
```

Client: http://localhost:5173  
Server: http://localhost:5000

## Demo Accounts

Farmer: `9000000001` / `password123`  
Admin: `9999999999` / `password123`

## Notes

- Mandi prices are mock AGMARKNET-shaped records seeded from realistic Uttar Pradesh mandi data.
- Distance uses local Haversine calculation so the demo works without API keys.
- PWA files include `manifest.json` and a service worker that caches the dashboard shell plus mandi and scheme GET responses.
- MongoDB must be running locally at `mongodb://localhost:27017/kisanmitra`.
