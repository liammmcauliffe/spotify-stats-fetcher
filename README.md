# Spotify Stats Fetcher

A comprehensive Spotify statistics dashboard built with SvelteKit that provides detailed insights into your music listening habits.

## Features

### 🏠 Overview Dashboard

- **User Profile**: Display name, profile picture, follower count, and premium status
- **Now Playing**: Real-time currently playing track with progress bar
- **Top Artists Preview**: Quick view of your most listened-to artists
- **Top Tracks Preview**: Quick view of your most played tracks

### 🎵 Music Analytics

- **Top Tracks**: Your most played tracks with popularity scores and duration
- **Top Artists**: Your most listened-to artists with follower counts and genres
- **Recently Played**: Chronological feed of your listening history with timestamps and context

### 📚 Personal Library

- **Saved Playlists**: All your playlists with cover art, descriptions, and track counts
- **Followed Artists**: Artists you follow with genre information and popularity
- **Saved Albums**: Albums in your library with release dates and track counts
- **Saved Tracks**: All your liked songs with pagination support

### 🔊 Device Management

- **Available Devices**: List of all your Spotify devices with volume levels and status
- **Active Device Indicators**: Shows which device is currently playing music

## Technology Stack

- **Frontend**: SvelteKit with TypeScript
- **Styling**: Tailwind CSS
- **Authentication**: Spotify OAuth 2.0 with PKCE
- **API**: Spotify Web API

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

## Project Structure

```
src/
├── lib/
│   ├── components/          # Reusable Svelte components
│   │   ├── UserProfile.svelte
│   │   ├── NowPlaying.svelte
│   │   ├── Navigation.svelte
│   │   ├── TopTracks.svelte
│   │   ├── RecentlyPlayed.svelte
│   │   ├── SavedPlaylists.svelte
│   │   ├── FollowedArtists.svelte
│   │   ├── SavedAlbums.svelte
│   │   ├── SavedTracks.svelte
│   │   └── DevicesInfo.svelte
│   └── spotify.ts          # Spotify API utility functions
├── routes/
│   └── +page.svelte        # Main application page
└── app.html                # HTML template
```

## Features in Detail

### User Profile Component

- Displays user's display name, profile picture, and follower count
- Shows premium status with a badge
- Includes country information and external Spotify link

### Navigation System

- Tabbed navigation between different sections
- Responsive design that works on all screen sizes
- Icons and clear labeling for each section

### Data Fetching

- Parallel API calls for optimal performance
- Error handling for failed requests
- Pagination support for large datasets (saved tracks)

### Responsive Design

- Mobile-first approach with Tailwind CSS
- Grid layouts that adapt to screen size
- Touch-friendly interface elements

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

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## License

This project is open source and available under the [MIT License](LICENSE).
