# AI-Powered Chemistry Virtual Lab

An intelligent chemistry virtual lab powered by AI (LangChain + GPT-4) that predicts chemical reactions and visualizes molecules in 3D.

## 🧪 Features

- **AI Reaction Prediction**: Describe a chemical reaction scenario and get accurate reactants and products
- **Detailed Compound Information**: Each compound includes:
  - Common name and IUPAC name
  - SMILES notation
  - Properly rendered molecular formula (H₂O, CH₄, etc.)
  - Molecular weight
- **3D Molecular Visualization**: Click any compound to view its 3D structure
- **Modern UI**: Beautiful, responsive interface with Material UI
- **Fast Performance**: Built with Vite for instant HMR and quick builds

## 🚀 Tech Stack

### Frontend
- **Vite** - Lightning-fast build tool
- **React 19** + **TypeScript**
- **Material UI** - Component library
- **3Dmol.js** - 3D molecular visualization
- **Axios** - API communication

### Backend
- **Express** + **TypeScript**
- **LangChain** - AI orchestration
- **OpenAI GPT-4** - Chemical knowledge AI

## 📦 Setup

### Prerequisites
- Node.js 18+ and npm
- OpenAI API key

### Installation

1. **Clone and install dependencies**:
```bash
cd /home/qss/projects/fullstack-demo
npm install
cd server && npm install && cd ..
```

2. **Configure OpenAI API Key**:
Edit `server/.env` and add your OpenAI API key:
```bash
OPENAI_API_KEY=sk-your-actual-api-key-here
PORT=3001
```

3. **Start the application**:
```bash
npm run dev
```

This will start both:
- Frontend dev server: http://localhost:5173
- Backend API server: http://localhost:3001

## 🎯 Usage

1. Open http://localhost:5173 in your browser
2. Enter a chemical reaction scenario (e.g., "combustion of methane")
3. Optionally add temperature, catalyst, or conditions
4. Click "Predict Reaction" to see results
5. Click on any compound card to view its 3D molecular structure

## 📝 Example Scenarios

Try these reaction scenarios:
- "Combustion of methane in oxygen"
- "Neutralization of hydrochloric acid with sodium hydroxide"
- "Photosynthesis reaction"
- "Rusting of iron"
- "Esterification of acetic acid with ethanol"

## 🏗️ Project Structure

```
fullstack-demo/
├── src/                      # Frontend React app
│   ├── components/           # React components
│   │   ├── ReactionInput.tsx
│   │   ├── CompoundCard.tsx
│   │   ├── ReactionDisplay.tsx
│   │   ├── MoleculeViewer.tsx
│   │   └── FormulaRenderer.tsx
│   ├── types/               # TypeScript types
│   ├── theme.ts             # Material UI theme
│   └── App.tsx              # Main application
├── server/                  # Backend Express app
│   └── src/
│       ├── routes/          # API endpoints
│       ├── services/        # LangChain AI service
│       ├── types/           # TypeScript types
│       └── index.ts         # Server entry point
└── package.json            # Root package config
```

## 🔧 Build for Production

```bash
# Build frontend and backend
npm run build:all

# Preview frontend build
npm run preview

# Start production backend
cd server && npm start
```

## ⚡ Performance

- **Vite HMR**: Instant updates during development
- **Optimized builds**: Fast production builds with code splitting
- **Efficient API**: Express backend with TypeScript

## 🎨 UI Features

- Dark chemistry lab theme
- Smooth animations and transitions
- Responsive design
- Gradient effects and glassmorphism
- Color-coded reactants (cyan) and products (green)

## 📄 License

MIT

## 🤝 Contributing

Feel free to open issues or submit pull requests!
