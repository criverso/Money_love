# Global Living & Dating Cost Calculator

A comprehensive React application that helps users understand and compare dating costs, living expenses, and financial considerations across different cities worldwide. Features include AI-powered advice, interactive charts, and personalized match calculations.

## Features

- **Single City View**: Detailed breakdown of dating costs and living expenses for individual cities
- **City Comparison**: Side-by-side comparison of two cities across multiple metrics
- **AI Romance Guru**: Interactive chatbot providing personalized advice on dating and finances
- **Dating & Well-being Insights**: Charts and statistics on financial stress in relationships
- **Gender & Orientation Analysis**: Data on how dating costs vary across different demographics
- **Personal Match Calculator**: Simulated match probability based on user preferences and city data

## Technologies Used

- React 18.2.0
- Recharts 2.12.7 (for data visualization)
- Tailwind CSS (for styling)
- OpenRouter AI API (deepseekr1 for the Guru chatbot)

## Prerequisites

- Node.js (version 16 or higher)
- npm or yarn package manager

## Installation

1. **Clone or download the project files**
   ```bash
   # If you have the files locally, navigate to the project directory
   cd dating-cost-calculator
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Start the development server**
   ```bash
   npm start
   # or
   yarn start
   ```

4. **Open your browser**
   The application will open at `http://localhost:3000`

## Building for Production

To create a production build:

```bash
npm run build
# or
yarn build
```

This creates a `build` folder with optimized static files ready for deployment.

## Hosting Options

### 1. Netlify (Recommended for beginners)

1. **Sign up for Netlify** at [netlify.com](https://netlify.com)
2. **Drag and drop** the `build` folder to Netlify's deploy area
3. **Or connect your GitHub repository** and Netlify will auto-deploy

### 2. Vercel

1. **Sign up for Vercel** at [vercel.com](https://vercel.com)
2. **Install Vercel CLI**: `npm i -g vercel`
3. **Deploy**: `vercel --prod`

### 3. GitHub Pages

1. **Add homepage** to `package.json`:
   ```json
   {
     "homepage": "https://yourusername.github.io/repository-name"
   }
   ```
2. **Install gh-pages**: `npm install --save-dev gh-pages`
3. **Add scripts** to `package.json`:
   ```json
   {
     "scripts": {
       "predeploy": "npm run build",
       "deploy": "gh-pages -d build"
     }
   }
   ```
4. **Deploy**: `npm run deploy`

### 4. Firebase Hosting

1. **Install Firebase CLI**: `npm install -g firebase-tools`
2. **Login**: `firebase login`
3. **Initialize**: `firebase init hosting`
4. **Build and deploy**: `npm run build && firebase deploy`

### 5. AWS S3 + CloudFront

1. **Upload build folder** to S3 bucket
2. **Configure CloudFront** for CDN
3. **Set up custom domain** (optional)

## API Configuration

The AI Guru feature uses OpenRouter API with Claude 3.5 Sonnet:

1. **API key is already configured** in the application
2. **For production deployment**, you may want to move the API key to environment variables:
   - Create `.env` file in project root
   - Add: `REACT_APP_OPENROUTER_API_KEY=your_api_key_here`
   - Update the Authorization header in `src/App.js` to use the environment variable
3. **Alternative**: Use your own OpenRouter API key by replacing the key in the code

## Data Sources

The application uses data from various sources including:
- Numbeo (cost of living data)
- World Happiness Report
- IMF World Economic Outlook
- LendingTree
- Newsweek
- CouponPi
- BMO Real Financial Progress Index
- And others as cited in the application

## Customization

### Adding New Cities

Edit `src/data.js` to add new cities to the `initialData` array:

```javascript
{
  id: 11,
  city: 'Your City',
  country: 'Your Country',
  region: 'Your Region',
  latitude: 0.0,
  longitude: 0.0,
  gdp_per_capita_usd: 50000,
  happiness_score: 6.5,
  avg_net_monthly_salary_usd: 3000,
  date_cost_coffee_usd: 5,
  date_cost_dinner_mid_usd: 80,
  date_cost_entertainment_usd: 25,
  date_cost_dinner_upscale_usd: 150,
  monthly_rent_usd: 1200,
  monthly_utilities_usd: 100,
  citation: 'Your source',
}
```

### Modifying Exchange Rates

Update the `EXCHANGE_RATES` object in `src/data.js` with current rates.

## Troubleshooting

### Common Issues

1. **Build fails**: Ensure all dependencies are installed with `npm install`
2. **Charts not rendering**: Check that Recharts is properly installed
3. **AI Guru not working**: Verify API key is correctly configured
4. **Styling issues**: Ensure Tailwind CSS is properly loaded

### Performance Optimization

- The application is optimized for production builds
- Images and assets are minified
- Code splitting is implemented for better loading times

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is open source and available under the MIT License.

## Support

For issues or questions:
1. Check the troubleshooting section
2. Review the code comments
3. Create an issue in the repository

## Updates

The application is regularly updated with:
- Latest cost of living data
- New cities and regions
- Improved AI responses
- Enhanced user interface features 
