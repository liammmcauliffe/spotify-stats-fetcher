# Spotify Stats Fetcher

A comprehensive Spotify statistics dashboard built with SvelteKit that provides detailed insights into your music listening habits. Features a modern glass-morphism design with real-time updates and seamless Spotify integration.

## ✨ Features

### 🏠 Overview Dashboard

- **User Profile**: Display name, profile picture, follower count, and premium status
- **Now Playing**: Real-time currently playing track with progress bar and 1-second updates
- **Top Artists Preview**: Quick view of your most listened-to artists with follower counts and popularity
- **Top Tracks Preview**: Quick view of your most played tracks with duration and popularity

### 🎵 Music Analytics

- **Top Tracks**: Your most played tracks with popularity scores, duration, and play buttons
- **Top Artists**: Your most listened-to artists with follower counts, genres, and popularity metrics
- **Recently Played**: Chronological feed of your listening history with timestamps and context

### 📚 Personal Library

- **Saved Playlists**: All your playlists with cover art, descriptions, track counts, and privacy status
- **Followed Artists**: Artists you follow with genre information, popularity, and follower counts
- **Saved Albums**: Albums in your library with release dates, track counts, and album types
- **Saved Tracks**: All your liked songs with pagination support and detailed metadata

### 🔊 Device Management

- **Available Devices**: List of all your Spotify devices with volume levels, status indicators, and device types
- **Active Device Indicators**: Shows which device is currently playing music with real-time status updates
- **Device Status**: Dynamic status badges (Active, Restricted, Available) with appropriate icons

### 🎨 Modern UI/UX

- **Glass-morphism Design**: Beautiful transparent cards with backdrop blur effects
- **3D Hover Effects**: Interactive artist cards with tilt and scale animations
- **Lucide Icons**: Consistent iconography throughout the application
- **Responsive Design**: Mobile-first approach that works on all screen sizes
- **Real-time Updates**: Live polling for currently playing track and device status

## 🛠️ Technology Stack

- **Frontend**: SvelteKit with TypeScript
- **Styling**: Tailwind CSS with custom glass-morphism components
- **Icons**: Lucide Svelte for consistent iconography
- **Authentication**: Spotify OAuth 2.0 with PKCE and automatic token refresh
- **API**: Spotify Web API with real-time polling
- **Animations**: CSS transforms and transitions for smooth interactions

## Setup

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd spotify-stats-fetcher
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Configure Spotify App**
   - Go to [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)
   - Create a new app
   - Set redirect URI to `http://127.0.0.1:5173`
   - Copy your Client ID

4. **Set up environment variables**
   Create a `.env` file in the root directory:

   ```env
   VITE_SPOTIFY_CLIENT_ID=your_client_id_here
   ```

5. **Start the development server**

   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to `http://127.0.0.1:5173`

## Spotify API Scopes

The application requests the following permissions:

- `user-read-private`: Access to user's subscription details
- `user-read-email`: Access to user's email address
- `user-top-read`: Access to user's top artists and tracks
- `user-read-recently-played`: Access to recently played tracks
- `user-read-currently-playing`: Access to currently playing track
- `user-read-playback-state`: Access to playback state and devices
- `playlist-read-private`: Access to user's private playlists
- `playlist-read-collaborative`: Access to collaborative playlists
- `user-follow-read`: Access to followed artists
- `user-library-read`: Access to saved tracks and albums

## 📁 Project Structure

```
src/
├── lib/
│   ├── components/          # Reusable Svelte components
│   │   ├── UserProfile.svelte      # User profile with premium status
│   │   ├── NowPlaying.svelte       # Real-time currently playing track
│   │   ├── Navigation.svelte       # Tabbed navigation system
│   │   ├── TopTracks.svelte        # Top tracks with play buttons
│   │   ├── TrackCard.svelte        # Reusable track display component
│   │   ├── RecentlyPlayed.svelte   # Listening history with context
│   │   ├── SavedPlaylists.svelte   # Playlists with privacy indicators
│   │   ├── FollowedArtists.svelte  # Followed artists with 3D effects
│   │   ├── SavedAlbums.svelte      # Saved albums with metadata
│   │   ├── SavedTracks.svelte      # Liked songs with pagination
│   │   └── DevicesInfo.svelte      # Device management with status
│   └── spotify.ts          # Spotify API with token refresh
├── routes/
│   └── +page.svelte        # Main application with real-time polling
└── app.html                # HTML template with favicon
```

### Key Components

- **`+page.svelte`**: Main orchestrator with real-time polling and authentication
- **`spotify.ts`**: API utilities with automatic token refresh and error handling
- **`TrackCard.svelte`**: Reusable component for consistent track display
- **`NowPlaying.svelte`**: Real-time updates with enhanced empty states
- **All Library Components**: Glass-morphism design with Lucide icons

## 🚀 Features in Detail

### Modern Glass-morphism Design

- **Transparent Cards**: All components use `bg-white/5 backdrop-blur` for a modern glass effect
- **Gradient Overlays**: Subtle emerald and teal gradients for visual depth
- **Hover Effects**: Smooth transitions with scale, translate, and glow effects
- **Consistent Theming**: Unified color palette with emerald accents throughout

### Real-time Updates

- **Now Playing Polling**: Updates every second to show current track progress
- **Automatic Token Refresh**: Seamless authentication without user intervention
- **Live Device Status**: Real-time device availability and status updates
- **Error Handling**: Graceful handling of API failures with user feedback

### Interactive Components

- **3D Artist Cards**: Tilt and scale effects on hover with `transform-style: preserve-3d`
- **Play Button Overlays**: Hover-activated play buttons on track and album cards
- **Status Indicators**: Dynamic badges with appropriate colors and icons
- **Smooth Animations**: CSS transitions for all interactive elements

### Enhanced Data Display

- **Follower Counts**: Formatted numbers (K/M) with Lucide icons
- **Popularity Metrics**: Visual indicators for artist and track popularity
- **Context Information**: Shows where tracks were played (playlist, album, artist)
- **Time Formatting**: Human-readable timestamps and durations

### User Experience

- **Logout Functionality**: Complete session cleanup with logout button
- **Empty States**: Informative placeholder content when no data is available
- **Loading States**: Smooth loading transitions for all data fetching
- **Accessibility**: Proper ARIA labels and keyboard navigation support

## Development

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run linting
npm run lint

# Format code
npm run format
```

## 🔧 Recent Updates

### v2.0 - Modern Glass-morphism Redesign

- ✨ Complete UI overhaul with glass-morphism design
- 🎨 3D hover effects on artist cards
- 🔄 Real-time polling for now playing (1-second updates)
- 🔐 Automatic token refresh for seamless authentication
- 🎯 Lucide icons throughout the application
- 📱 Enhanced responsive design
- 🚪 Logout functionality with session cleanup
- 📊 Improved data display with follower counts and popularity
- 🎵 Enhanced empty states and loading indicators

### Key Improvements

- **Performance**: Optimized API calls and reduced unnecessary requests
- **UX**: Smooth animations and transitions throughout
- **Accessibility**: Better ARIA labels and keyboard navigation
- **Reliability**: Robust error handling and token management
- **Visual**: Consistent theming and modern design language

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Run linting (`npm run lint`)
5. Commit your changes (`git commit -m 'Add amazing feature'`)
6. Push to the branch (`git push origin feature/amazing-feature`)
7. Open a Pull Request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments

- [Spotify Web API](https://developer.spotify.com/documentation/web-api/) for comprehensive music data
- [Lucide](https://lucide.dev/) for beautiful, consistent icons
- [Tailwind CSS](https://tailwindcss.com/) for utility-first styling
- [SvelteKit](https://kit.svelte.dev/) for the amazing framework
