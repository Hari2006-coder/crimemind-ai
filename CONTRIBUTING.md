# 🤝 Contributing to CrimeMind AI

Thank you for your interest in contributing to **CrimeMind AI**! 🛡️

---

## 🚀 How to Get Started

```bash
# 1. Fork the repository on GitHub
# 2. Clone your fork
git clone https://github.com/YOUR_USERNAME/crimemind-ai.git
cd crimemind-ai

# 3. Open in browser (no build step needed!)
start index.html   # Windows
open index.html    # macOS
```

---

## 📁 Project Structure

```
crimemind-ai/
├── index.html          ← Main entry point (edit HTML structure here)
├── css/
│   ├── variables.css   ← Design tokens (colors, spacing, fonts)
│   ├── base.css        ← Global resets + animations
│   ├── layout.css      ← Sidebar + topbar layout
│   ├── components.css  ← Reusable UI components
│   └── pages.css       ← Page-specific styles
└── js/
    ├── data.js         ← Mock crime data (add new data here)
    ├── app.js          ← SPA router + global state
    ├── dashboard.js    ← Dashboard page logic
    ├── map.js          ← Leaflet.js GIS map
    ├── investigation.js← AI investigation copilot
    ├── network.js      ← D3.js force graph
    ├── patrol.js       ← Patrol simulator
    ├── prediction.js   ← AI prediction engine
    ├── reports.js      ← Report generator
    └── alerts.js       ← Alert center + settings
```

---

## 🧩 Ways to Contribute

| Type | Examples |
|------|---------|
| 🐛 **Bug Fixes** | Fix layout issues, broken features, JS errors |
| ✨ **New Features** | Add new dashboard widgets, new AI features |
| 🗺️ **Map Improvements** | Add new hotspot zones, marker types |
| 📊 **Data** | Add more realistic mock crime data in `data.js` |
| 🎨 **Design** | Improve animations, color themes, glassmorphism effects |
| 📝 **Docs** | Improve README, add code comments |
| 🌍 **i18n** | Add multi-language support |

---

## 📋 Contribution Rules

1. **No frameworks** — Keep it vanilla HTML/CSS/JavaScript
2. **No build step** — Must run by just opening `index.html`
3. **Dark theme only** — Maintain the glassmorphism design system
4. **Use CSS variables** — All colors must use tokens from `variables.css`
5. **Follow naming** — Page modules follow the `CM_*` namespace pattern

---

## 🔀 Submitting a Pull Request

1. Create a branch: `git checkout -b feature/your-feature-name`
2. Make your changes
3. Test in Chrome, Firefox, and Edge
4. Commit: `git commit -m "✨ Add: your feature description"`
5. Push: `git push origin feature/your-feature-name`
6. Open a Pull Request on GitHub

---

## 🐛 Reporting Bugs

Open an [Issue](https://github.com/Hari2006-coder/crimemind-ai/issues) with:
- Browser and OS version
- Steps to reproduce
- Screenshot if possible

---

## 📜 Code of Conduct

Be respectful, inclusive, and constructive. This project is built for public safety — keep that spirit in all contributions.

---

**Thank you for making CrimeMind AI better!** 🙏
