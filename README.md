# Progress Tracker

A modern web application for tracking project progress with input forms and comprehensive reporting capabilities. Built to be deployed on GitHub Pages with Firebase as the backend database.

## Features

- **Input Form**: Easy-to-use form for adding progress entries
- **Report Dashboard**: Comprehensive reporting with DataTables for easy searching and filtering
- **Real-time Statistics**: Dashboard showing total tasks, completed tasks, in-progress tasks, and overdue tasks
- **Firebase Integration**: Cloud-based database for data persistence
- **Responsive Design**: Works perfectly on desktop and mobile devices
- **GitHub Pages Ready**: Built with static hosting in mind

## Technologies Used

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **CSS Framework**: Bootstrap 5
- **Database**: Firebase Firestore
- **Data Tables**: DataTables.js for advanced table functionality
- **Icons**: Font Awesome
- **Build Tool**: Webpack
- **Deployment**: GitHub Pages

## Setup Instructions

### 1. Clone and Install Dependencies

```bash
cd /Users/hasan/nodejs/progress-tracker
npm install
```

### 2. Firebase Setup

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project or select an existing one
3. Enable Firestore Database:
   - Go to "Firestore Database" in the left sidebar
   - Click "Create database"
   - Choose "Start in test mode" for development
   - Select a location for your database

4. Get your Firebase configuration:
   - Go to Project Settings (gear icon)
   - Scroll down to "Your apps" section
   - Click "Add app" and select "Web" (</> icon)
   - Register your app with a nickname
   - Copy the Firebase configuration object

5. Update Firebase configuration:
   - Open `src/js/firebase-config.js`
   - Replace the placeholder configuration with your actual Firebase config

### 3. Firebase Security Rules

Set up Firestore security rules for your database:

```javascript
// Firestore Security Rules
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /progress_entries/{document} {
      allow read, write: if true; // For development - restrict in production
    }
  }
}
```

### 4. Development

Run the development server:

```bash
npm start
```

This will start a development server at `http://localhost:3000`

### 5. Build for Production

Create a production build:

```bash
npm run build
```

This creates a `dist` folder with all the static files ready for deployment.

### 6. Deploy to GitHub Pages

1. Install gh-pages (if not already installed):

```bash
npm install -g gh-pages
```

2. Deploy to GitHub Pages:

```bash
npm run deploy
```

This will build the project and deploy the `dist` folder to the `gh-pages` branch of your repository.

### 7. GitHub Pages Configuration

1. Go to your repository settings on GitHub
2. Scroll down to "Pages" section
3. Set source to "Deploy from a branch"
4. Select `gh-pages` branch and `/ (root)` folder
5. Your app will be available at `https://yourusername.github.io/progress-tracker`

## Usage

### Adding Progress Entries

1. Navigate to the main page (Input Form)
2. Fill in all required fields:
   - Project Name
   - Task Name
   - Status (Not Started, In Progress, Completed, On Hold)
   - Priority (Low, Medium, High, Critical)
   - Start Date and Due Date
   - Progress percentage (0-100%)
   - Assignee
   - Description (optional)
3. Click "Save Progress"

### Viewing Reports

1. Navigate to the Reports page
2. View summary statistics at the top
3. Use the DataTable to:
   - Search for specific entries
   - Sort by any column
   - Filter by status, priority, etc.
   - Edit or delete entries

### Managing Entries

- **Edit**: Click the edit button (pencil icon) in the Actions column
- **Delete**: Click the delete button (trash icon) in the Actions column
- **Refresh**: Click the "Refresh" button to reload data

## Project Structure

```text
progress-tracker/
├── src/
│   ├── css/
│   │   └── style.css          # Custom styles
│   ├── js/
│   │   ├── app.js             # Main application logic
│   │   └── firebase-config.js # Firebase configuration
│   ├── index.html             # Input form page
│   └── report.html            # Reports page
├── dist/                      # Built files (generated)
├── package.json
├── webpack.config.js
└── README.md
```

## Available Scripts

- `npm start` - Start development server
- `npm run build` - Build for production
- `npm run clean` - Clean dist directory
- `npm run deploy` - Deploy to GitHub Pages

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

If you encounter any issues:

1. Check that your Firebase configuration is correct
2. Ensure Firestore is enabled in your Firebase project
3. Verify that your security rules allow read/write access
4. Check the browser console for any error messages

## Security Notes

- The current Firestore rules allow open read/write access for development
- For production, implement proper authentication and security rules
- Consider adding user authentication for multi-user environments
- Regularly review and update Firebase security rules
