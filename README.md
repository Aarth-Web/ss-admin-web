# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Environment Configuration

This project uses environment variables for configuration. Before running the app, make sure to set up the appropriate environment files:

- `.env`: Default environment variables
- `.env.development`: Development environment variables (used with `npm start`)
- `.env.production`: Production environment variables (used with `npm run build`)
- `.env.local`: Local overrides (not committed to repository)

### Required Environment Variables

```
# API Configuration
REACT_APP_API_URL=https://ss-backend-uqx4.onrender.com  # Base API URL
REACT_APP_COUNTRY_CODE=91                # Country code for phone numbers

# Authentication Settings
REACT_APP_TOKEN_EXPIRY_DAYS=30           # Token expiry in days

# Feature Flags
REACT_APP_ENABLE_DEBUG_LOGGING=false     # Enable debug logging

# App Information
REACT_APP_VERSION=1.0.0                  # Application version
```

Copy `.env.example` to `.env.local` and modify the values as needed for your local development environment.

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).
