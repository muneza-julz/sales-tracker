# Sales Tracker

A mobile shop-management app for recording sales, tracking expenses, and monitoring profit — backed by a lightweight Java REST API and built with React Native (Expo).

## Features

### Dashboard (Home)
- Today's sales, expenses, and profit at a glance
- Weekly overview bar chart comparing daily sales vs. profit
- Quick actions to record a sale or expense
- Low-stock awareness across the product catalog

### Products
- Product catalog with category, cost price, selling price, and stock level
- Low-stock badges when inventory runs low
- Inline form validation when adding products

### Sales
- Sales grouped by day (Today / Yesterday / earlier)
- Per-sale detail view: product, quantity, amount, gross profit, payment method
- Stock-aware quantity validation — can't sell more than what's on hand
- Payment methods: **Cash** and **Mobile Money**

### Expenses
- Expense tracking by category: **Rent, Transport, Utilities, Others**
- Running totals feed directly into the daily/weekly profit summary

### Cross-cutting
- Inline per-field validation errors on every form (no popup alerts)
- Success confirmation screen after every save
- Auto-detecting API host — survives LAN IP changes without config edits
- Works on Android, iOS (via Expo Go), and web

## Tech Stack

| Layer    | Technology |
|----------|------------|
| Backend  | Java 25, Javalin 7, Jackson, Gradle |
| Frontend | React Native 0.88, Expo SDK 58, Expo Router, TypeScript |
| Storage  | In-memory repositories with seeded demo data |
| Design   | Figma-driven UI, Inter font, custom SVG icon set |

## Project Structure

```
sales-tracker/
├── backend/                  # Java REST API (Javalin)
│   ├── src/shoptracker/
│   │   ├── api/              # ApiServer, DTOs, demo seed data
│   │   └── *.java            # Domain model & in-memory repository
│   └── build.gradle
│
└── frontend/                 # Expo / React Native app
    └── src/
        ├── app/              # Expo Router screens
        │   ├── _layout.tsx   # Root stack navigator
        │   ├── (tabs)/       # Bottom tabs: Home, Sales, Products, Expenses
        │   ├── add-*.tsx     # Add Product / Sale / Expense forms
        │   └── success.tsx   # Post-save confirmation
        ├── api/              # Typed REST client matching backend DTOs
        ├── components/       # Shared UI (headers, form controls, dialogs)
        └── config.ts         # API base URL (auto-detected)
```

## Getting Started

### Prerequisites
- **Java 25** (or let Gradle's toolchain resolve it)
- **Node.js 20+** and npm
- A phone with **Expo Go** (or a browser for the web preview)

### 1. Start the backend

```bash
cd backend
./gradlew run
```

The API listens on `http://<your-machine-ip>:8080` and serves seeded demo data on first run.

### 2. Start the frontend

```bash
cd frontend
npx expo start
```

Then either:
- **Scan the QR code** with Expo Go on your phone (same Wi-Fi), or
- Press `w` for the **web preview**, or
- Press `a` for the **Android emulator**

The app auto-detects the API host from Metro's address — no IP configuration needed when you change networks. (Fallbacks cover `localhost` and the Android emulator's `10.0.2.2`.)

## API Reference

Base URL: `http://<host>:8080`

| Method | Endpoint              | Description                          |
|--------|-----------------------|--------------------------------------|
| GET    | `/api/health`         | Health check                         |
| GET    | `/api/products`       | List all products                    |
| POST   | `/api/products`       | Create a product                     |
| GET    | `/api/products/low-stock` | Products below their low-stock threshold |
| GET    | `/api/sales`          | List all sales                       |
| POST   | `/api/sales`          | Record a sale (decrements stock)     |
| GET    | `/api/sales/by-day`   | Sales grouped by day                 |
| GET    | `/api/expenses`       | List all expenses                    |
| POST   | `/api/expenses`       | Record an expense                    |
| GET    | `/api/summary`        | Today's sales / expenses / profit    |
| GET    | `/api/summary/weekly` | Per-day breakdown for the week       |

### Example

```bash
curl -X POST http://localhost:8080/api/products \
  -H 'Content-Type: application/json' \
  -d '{"name":"Rice 5kg","category":"Groceries","costPrice":8000,"sellingPrice":9500,"stock":20}'
```

## Development

```bash
# Backend
cd backend
./gradlew compileJava     # compile check
./gradlew run             # run API on :8080

# Frontend
cd frontend
npx tsc --noEmit          # typecheck
npx expo lint             # lint
npx expo start            # dev server
npx expo export --platform web   # production web bundle
```

## Notes

- **Data persistence:** the backend uses in-memory repositories seeded with demo data — data resets on restart. Swapping in a real database only requires implementing the `Repository` interface.
- **Images:** product thumbnails are placeholders; the backend has no image field yet.
- **Design source:** UI implemented from the Figma "Mobile-tracker" file; see `frontend/src/theme.ts` for the design tokens.

## License

See [LICENSE](frontend/LICENSE).

---

Built with [Expo](https://expo.dev) and [Javalin](https://javalin.io).
