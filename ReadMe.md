# Preschool Interactive Learning App

An engaging web application that helps preschool children (ages 3-5) learn alphabet letters (A-Z) and numbers (0-9) through interactive typing and drawing activities.

## 🎯 Learning Objectives
1. **Letter Recognition**: Identify uppercase letters A-Z
2. **Number Recognition**: Identify numbers 0-9
3. **Counting Skills**: Associate letters with their position (A=1, B=2...Z=26)
4. **Fine Motor Skills**: Mouse control for dot placement


## 🛠 Tech Stack
  Frontend: Reactjs + TypeScript,
  Styling: CSS Modules with animations,
  Development: NodeMon for live reloading,
  API: Fetch API (no Axios),
  Build: Vite
}

## 🧩 Core Components

| Component | Purpose |
|-----------|---------|
| `CharacterGenerator.tsx` | Random letter/number display |
| `InputValidator.tsx` | Text input validation |
| `DotCanvas.tsx` | Interactive drawing surface |
| `FeedbackSystem.tsx` | Visual/audio responses |
| `ProgressTracker.tsx` | Session statistics |

## 🖥 UI Specifications
```ts
// Color Palette
const colors = {
  primary: '#FF6B6B', // Coral
  secondary: '#4ECDC4', // Turquoise
  accent: '#FFD166', // Yellow
  background: '#F7F9FC' // Light blue
};

// Font Sizes
const typography = {
  displayChar: '72px',
  instructions: '24px',
  buttons: '20px'
};
```

## 🎨 Design Principles
1. **Interactive Elements**: 
   - 60px minimum touch targets
   - Pulse animations on correct answers
   - Gentle vibration on errors
2. **Accessibility**:
   - High contrast mode
   - Keyboard navigable
   - Screen reader support
3. **Engagement**:
   - Random celebratory animations (confetti, bouncing)
   - Positive audio feedback

## 📬 Next Features
- [ ] Letter pronunciation audio
- [ ] Dot connection for letter tracing
- [ ] Printable achievement certificates
- [ ] Parental progress dashboard