# 🎯 Habit Tracker App

A beautiful, modern habit tracking application built with React Native and Expo. Track your daily habits, build streaks, and achieve your goals with an intuitive and engaging interface.

![Habit Tracker](https://images.pexels.com/photos/6147094/pexels-photo-6147094.jpeg?auto=compress&cs=tinysrgb&w=800)

## ✨ Features

### 🏠 **Smart Dashboard**
- **Dynamic Greeting**: Personalized greetings based on time of day
- **Today's Progress**: Real-time completion tracking
- **Streak Counter**: Visual streak tracking with fire emoji
- **Weekly Statistics**: 7-day progress overview
- **Quick Add**: One-tap habit creation

### 📝 **Habit Management**
- **Flexible Scheduling**: Daily, weekdays, weekends, or weekly habits
- **Smart Time Selection**: Pre-defined slots or custom times
- **Emoji Icons**: 12+ beautiful emoji categories
- **Rich Descriptions**: Add motivational details to your habits
- **Easy Editing**: Update habits anytime with intuitive forms

### 📊 **Progress Tracking**
- **Visual Charts**: Weekly and monthly progress visualization
- **Completion Rates**: Individual habit performance metrics
- **Streak Analytics**: Track your longest streaks
- **Success Patterns**: Identify your most successful habits

### 🎨 **Modern Design**
- **Clean Interface**: Minimalist, distraction-free design
- **Smooth Animations**: Delightful micro-interactions
- **Dark/Light Themes**: Automatic theme adaptation
- **Responsive Layout**: Perfect on all screen sizes

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Expo CLI
- iOS Simulator or Android Emulator (optional)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/habit-tracker-app.git
   cd habit-tracker-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npx expo start
   ```

4. **Run on your device**
   - Scan the QR code with Expo Go app (iOS/Android)
   - Press `i` for iOS Simulator
   - Press `a` for Android Emulator
   - Press `w` for web browser

## 📱 App Structure

```
app/
├── (tabs)/                 # Tab navigation screens
│   ├── index.tsx          # Home dashboard
│   ├── add.tsx            # Add new habit
│   ├── stats.tsx          # Statistics & analytics
│   └── profile.tsx        # User profile
├── edit-habit.tsx         # Edit existing habit
├── _layout.tsx            # Root layout
└── +not-found.tsx         # 404 error page

components/
├── HabitCard.tsx          # Individual habit display
└── StatsCard.tsx          # Progress statistics card

services/
└── habitService.ts        # Database operations

context/
└── AuthContext.tsx        # Authentication state

types/
└── habit.ts               # TypeScript interfaces
```

## 🛠️ Tech Stack

- **Framework**: React Native with Expo
- **Navigation**: Expo Router (file-based routing)
- **Language**: TypeScript
- **Icons**: Lucide React Native + Emojis
- **Database**: Firebase Firestore (configurable)
- **State Management**: React Context + Hooks
- **Styling**: StyleSheet (React Native)

## 🎯 Core Features

### Habit Creation
```typescript
// Create a new habit with frequency options
const habit = {
  title: "Morning Exercise",
  description: "30 minutes of cardio workout",
  time: "07:00",
  icon: "exercise",
  frequency: "daily" // daily, weekdays, weekends, weekly
};
```

### Smart Scheduling
- **Daily**: Every day of the week
- **Weekdays**: Monday through Friday
- **Weekends**: Saturday and Sunday only
- **Weekly**: Once per week (flexible day)

### Progress Tracking
- Real-time completion status
- Streak calculation with smart logic
- Weekly and monthly statistics
- Individual habit performance metrics

## 📊 Database Schema

### Habit Document
```typescript
interface Habit {
  id: string;
  title: string;
  description: string;
  time: string;
  icon: string;
  frequency: 'daily' | 'weekdays' | 'weekends' | 'weekly';
  userId: string;
  createdAt: Date;
  completions: { [date: string]: boolean };
}
```

## 🎨 Design System

### Colors
- **Primary**: `#3B82F6` (Blue)
- **Success**: `#10B981` (Green)
- **Warning**: `#F59E0B` (Amber)
- **Background**: `#F8FAFC` (Slate)
- **Text**: `#1E293B` (Dark Slate)

### Typography
- **Headers**: Bold, 24-28px
- **Body**: Regular, 16px
- **Captions**: Medium, 12-14px

### Spacing
- **Base Unit**: 8px
- **Sections**: 24px
- **Cards**: 16px padding
- **Elements**: 12px gaps

## 🔧 Configuration

### Environment Setup
Create a `.env` file in the root directory:
```env
EXPO_PUBLIC_FIREBASE_API_KEY=your_api_key
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=your_domain
EXPO_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
```

### Firebase Setup (Optional)
1. Create a Firebase project
2. Enable Firestore Database
3. Configure authentication
4. Update `config/firebase.ts` with your credentials

## 📈 Performance

- **Lazy Loading**: Components load on demand
- **Optimized Rendering**: Efficient FlatList usage
- **Memory Management**: Proper cleanup and disposal
- **Smooth Animations**: 60fps micro-interactions

## 🧪 Testing

```bash
# Run tests
npm test

# Run with coverage
npm run test:coverage

# E2E tests
npm run test:e2e
```

## 📦 Building for Production

### iOS
```bash
npx expo build:ios
```

### Android
```bash
npx expo build:android
```

### Web
```bash
npx expo export:web
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Expo Team** for the amazing development platform
- **Lucide** for beautiful icons
- **React Native Community** for continuous innovation
- **Firebase** for backend infrastructure

## 📞 Support

- 📧 Email: support@habittracker.app
- 🐛 Issues: [GitHub Issues](https://github.com/yourusername/habit-tracker-app/issues)
- 💬 Discussions: [GitHub Discussions](https://github.com/yourusername/habit-tracker-app/discussions)

## 🗺️ Roadmap

- [ ] **Social Features**: Share progress with friends
- [ ] **Habit Templates**: Pre-built habit suggestions
- [ ] **Advanced Analytics**: Detailed insights and trends
- [ ] **Notifications**: Smart reminders and motivations
- [ ] **Themes**: Customizable color schemes
- [ ] **Export Data**: CSV/PDF progress reports
- [ ] **Habit Categories**: Organize habits by life areas
- [ ] **Rewards System**: Gamification elements

---

**Built with ❤️ for better habits and a healthier lifestyle**

*Start your journey today - one habit at a time! 🎯*
