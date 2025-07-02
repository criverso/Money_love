// Exchange rates for conversion from local currency to USD (approximate, based on search results)
export const EXCHANGE_RATES = {
  EUR: 1.08,   // 1 Euro = ~1.08 USD (approximate for 2024/2025)
  MXN: 0.059,  // 1 Mexican Peso = ~0.059 USD (or 1 USD = ~17 MXN)
  PLN: 0.25,   // 1 Polish Zloty = ~0.25 USD (or 1 USD = ~4 PLN)
  MDL: 0.056,  // 1 Moldovan Leu = ~0.056 USD (or 1 USD = ~17.8 MDL)
  CNY: 0.138,  // 1 Chinese Yuan = ~0.138 USD (or 1 USD = ~7.25 CNY)
  THB: 0.027,  // 1 Thai Baht = ~0.027 USD (or 1 USD = ~36.5 THB)
  NPR: 0.0075, // 1 Nepalese Rupee = ~0.0075 USD (or 1 USD = ~133 NPR)
  GBP: 1.27,   // 1 British Pound = ~1.27 USD
  JPY: 0.0063, // 1 Japanese Yen = ~0.0063 USD (or 1 USD = ~158 JPY)
  AUD: 0.66,   // 1 Australian Dollar = ~0.66 USD
  BRL: 0.18,   // 1 Brazilian Real = ~0.18 USD
  ZAR: 0.055,  // 1 South African Rand = ~0.055 USD
  HNL: 0.040,  // 1 Honduran Lempira = ~0.040 USD
};

// Function to convert local currency to USD
export const convertToUSD = (amount, currency) => {
  if (EXCHANGE_RATES[currency]) {
    return amount * EXCHANGE_RATES[currency];
  }
  return amount; // Return original amount if currency not found (assumed USD)
};

// Updated data for cities and countries (2024/2025 data)
export const initialData = [
  {
    id: 1,
    city: 'New York City',
    country: 'United States',
    region: 'North America',
    latitude: 40.7128,
    longitude: -74.0060,
    gdp_per_capita_usd: 89110,
    happiness_score: 6.724,
    avg_net_monthly_salary_usd: 6664,
    date_cost_coffee_usd: 6,
    date_cost_dinner_mid_usd: 100,
    date_cost_entertainment_usd: 50,
    date_cost_dinner_upscale_usd: 250,
    monthly_rent_usd: 3500,
    monthly_utilities_usd: 200,
    citation: 'Numbeo, World Happiness Report 2025, IMF 2025, HousingAnywhere, Radical Storage, Godigit',
  },
  {
    id: 2,
    city: 'Los Angeles',
    country: 'United States',
    region: 'North America',
    latitude: 34.0522,
    longitude: -118.2437,
    gdp_per_capita_usd: 89110,
    happiness_score: 6.724,
    avg_net_monthly_salary_usd: 4898.15,
    date_cost_coffee_usd: 5.50,
    date_cost_dinner_mid_usd: 120,
    date_cost_entertainment_usd: 20,
    date_cost_dinner_upscale_usd: 200,
    monthly_rent_usd: 2500,
    monthly_utilities_usd: 180,
    citation: 'Numbeo, World Happiness Report 2025, IMF 2025, Wise',
  },
  {
    id: 3,
    city: 'Chicago',
    country: 'United States',
    region: 'North America',
    latitude: 41.8781,
    longitude: -87.6298,
    gdp_per_capita_usd: 89110,
    happiness_score: 6.724,
    avg_net_monthly_salary_usd: 6212,
    date_cost_coffee_usd: 5.40,
    date_cost_dinner_mid_usd: 100,
    date_cost_entertainment_usd: 20,
    date_cost_dinner_upscale_usd: 200,
    monthly_rent_usd: 1800,
    monthly_utilities_usd: 150,
    citation: 'Numbeo, World Happiness Report 2025, IMF 2025, ZipRecruiter, Fly Homes, Ben Lalez',
  },
  {
    id: 4,
    city: 'San Francisco',
    country: 'United States',
    region: 'North America',
    latitude: 37.7749,
    longitude: -122.4194,
    gdp_per_capita_usd: 89110,
    happiness_score: 6.724,
    avg_net_monthly_salary_usd: 7301.78,
    date_cost_coffee_usd: 5.55,
    date_cost_dinner_mid_usd: 120,
    date_cost_entertainment_usd: 17,
    date_cost_dinner_upscale_usd: 250,
    monthly_rent_usd: 3800,
    monthly_utilities_usd: 220,
    citation: 'Numbeo, World Happiness Report 2025, IMF 2025, Wise',
  },
  {
    id: 5,
    city: 'Miami',
    country: 'United States',
    region: 'North America',
    latitude: 25.7617,
    longitude: -80.1918,
    gdp_per_capita_usd: 89110,
    happiness_score: 6.724,
    avg_net_monthly_salary_usd: 4271.18,
    date_cost_coffee_usd: 5.09,
    date_cost_dinner_mid_usd: 100,
    date_cost_entertainment_usd: 16.32,
    date_cost_dinner_upscale_usd: 200,
    monthly_rent_usd: 2200,
    monthly_utilities_usd: 160,
    citation: 'Numbeo, World Happiness Report 2025, IMF 2025, Wise, RentCafe',
  },
  {
    id: 6,
    city: 'Mexico City',
    country: 'Mexico',
    region: 'North America',
    latitude: 19.4326,
    longitude: -99.1332,
    gdp_per_capita_usd: 12614,
    happiness_score: 6.979,
    avg_net_monthly_salary_usd: convertToUSD(14339.57, 'MXN'),
    date_cost_coffee_usd: convertToUSD(61.46, 'MXN'),
    date_cost_dinner_mid_usd: convertToUSD(1000, 'MXN'),
    date_cost_entertainment_usd: convertToUSD(100, 'MXN'),
    date_cost_dinner_upscale_usd: 150,
    monthly_rent_usd: convertToUSD(10000, 'MXN'),
    monthly_utilities_usd: convertToUSD(800, 'MXN'),
    citation: 'Numbeo, World Happiness Report 2025, World Bank, Wise',
  },
  {
    id: 7,
    city: 'Berlin',
    country: 'Germany',
    region: 'Europe',
    latitude: 52.5200,
    longitude: 13.4050,
    gdp_per_capita_usd: 55910,
    happiness_score: 6.892,
    avg_net_monthly_salary_usd: convertToUSD(2875, 'EUR'),
    date_cost_coffee_usd: convertToUSD(3.5, 'EUR'),
    date_cost_dinner_mid_usd: convertToUSD(70, 'EUR'),
    date_cost_entertainment_usd: convertToUSD(30, 'EUR'),
    date_cost_dinner_upscale_usd: convertToUSD(150, 'EUR'),
    monthly_rent_usd: convertToUSD(1000, 'EUR'),
    monthly_utilities_usd: convertToUSD(150, 'EUR'),
    citation: 'Numbeo, IMF 2025, AllAboutBerlin, NomadAndInLove, Kummuni',
  },
  {
    id: 8,
    city: 'London',
    country: 'United Kingdom',
    region: 'Europe',
    latitude: 51.5074,
    longitude: -0.1278,
    gdp_per_capita_usd: 63660,
    happiness_score: 6.724,
    avg_net_monthly_salary_usd: 3500,
    date_cost_coffee_usd: 4.5,
    date_cost_dinner_mid_usd: 80,
    date_cost_entertainment_usd: 30,
    date_cost_dinner_upscale_usd: 200,
    monthly_rent_usd: convertToUSD(2000, 'GBP'),
    monthly_utilities_usd: convertToUSD(200, 'GBP'),
    citation: 'Numbeo, IMF 2025, World Happiness Report 2025',
  },
  {
    id: 9,
    city: 'Tokyo',
    country: 'Japan',
    region: 'Asia',
    latitude: 35.6895,
    longitude: 139.6917,
    gdp_per_capita_usd: 33960,
    happiness_score: 5.940,
    avg_net_monthly_salary_usd: 2500,
    date_cost_coffee_usd: 3.5,
    date_cost_dinner_mid_usd: 60,
    date_cost_entertainment_usd: 20,
    date_cost_dinner_upscale_usd: 150,
    monthly_rent_usd: convertToUSD(100000, 'JPY'),
    monthly_utilities_usd: convertToUSD(10000, 'JPY'),
    citation: 'Numbeo, IMF 2025',
  },
  {
    id: 10,
    city: 'Sydney',
    country: 'Australia',
    region: 'Oceania',
    latitude: -33.8688,
    longitude: 151.2093,
    gdp_per_capita_usd: 64820,
    happiness_score: 7.057,
    avg_net_monthly_salary_usd: 4000,
    date_cost_coffee_usd: 4.0,
    date_cost_dinner_mid_usd: 75,
    date_cost_entertainment_usd: 25,
    date_cost_dinner_upscale_usd: 180,
    monthly_rent_usd: convertToUSD(2500, 'AUD'),
    monthly_utilities_usd: convertToUSD(200, 'AUD'),
    citation: 'Numbeo, World Bank, World Happiness Report 2025',
  }
];

// Data for the insights section charts
export const financialStressData = [
  { name: 'Ended due to financial incompatibility', value: 23, fill: '#8884d8' },
  { name: 'Consider ending for financial incompatibility', value: 34, fill: '#82ca9d' },
  { name: 'Staying due to financial constraints', value: 24, fill: '#ffc658' },
  { name: 'Had conflict over finances', value: 87, fill: '#ff7300' },
  { name: 'Money factor in past breakup', value: 41, fill: '#00C49F' },
];

export const relationshipCostBreakdown = [
  { name: 'Eating Out', value: 1624 },
  { name: 'Events (Concerts, Sports)', value: 1569 },
  { name: 'Casual Outings (Museums, Coffee)', value: 1203 },
  { name: 'Other (Gifts, Transport, Apps)', value: 1742 },
];

export const PIE_COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

export const averageDateCostTrend = [
  { year: '2019', cost: 100 },
  { year: '2020', cost: 111.33 },
  { year: '2021', cost: 122.66 },
  { year: '2022', cost: 134.00 },
  { year: '2023', cost: 145.33 },
  { year: '2024', cost: 156.66 },
  { year: '2025', cost: 168.00 },
];

export const datingAppImpactData = [
  { name: 'Gen Z Dating App Fatigue', value: 21, fill: '#FF6347' },
  { name: 'Gen Z Frustrations with Dating Apps', value: 90, fill: '#4682B4' },
  { name: 'US Pop. w/ Anxiety/Depression (Dating App Assoc.)', value: 34, fill: '#DA70D6' },
  { name: 'Men Pressure for Expensive Dates (Gen Z)', value: 46, fill: '#20B2AA' },
  { name: 'Men Net Worth Affects Dating Prospects', value: 48, fill: '#BDB76B' },
];

// Gender & Orientation section data
export const heterosexualPaymentPerceptions = [
  { statement: 'Men report paying more (Men)', value: 84, fill: '#4CAF50' },
  { statement: 'Women report men pay more (Women)', value: 58, fill: '#FFC0CB' },
  { statement: 'Women wish men reject offers to pay', value: 39, fill: '#8A2BE2' },
  { statement: 'Women bothered by expectation to pay', value: 44, fill: '#FF4500' },
  { statement: 'Men believe women should contribute', value: 64, fill: '#1E90FF' },
  { statement: 'Men feel guilty accepting women\'s money', value: 76, fill: '#DAA520' },
  { statement: 'Men would stop dating if woman never pays', value: 44, fill: '#DC143C' },
];

export const incomeByCoupleType = [
  { type: 'Male Same-Sex Married', income: 172689, fill: '#007BFF' },
  { type: 'Female Same-Sex Married', income: 121900, fill: '#FF69B4' },
  { type: 'Different-Sex Married', income: 121000, fill: '#28A745' },
];

export const financialStayReasons = [
  { name: 'Staying due to financial constraints', value: 24, fill: '#FF6347' },
  { name: 'Not staying due to financial constraints', value: 76, fill: '#4CAF50' }
];

// Personal Match & Preferences data
export const GENDER_OPTIONS = ['Male', 'Female', 'Non-binary', 'Prefer not to say'];
export const EDUCATION_OPTIONS = ['High School', 'Associate Degree', 'Bachelor\'s Degree', 'Master\'s Degree', 'Doctorate'];

export const AVERAGE_DEMOGRAPHICS = {
  Male: {
    height_cm: 175,
    weight_kg: 80,
    salary_usd_monthly: { 'High School': 3000, 'Associate Degree': 3500, 'Bachelor\'s Degree': 5000, 'Master\'s Degree': 6500, 'Doctorate': 8000 },
  },
  Female: {
    height_cm: 162,
    weight_kg: 68,
    salary_usd_monthly: { 'High School': 2500, 'Associate Degree': 3000, 'Bachelor\'s Degree': 4000, 'Master\'s Degree': 5500, 'Doctorate': 7000 },
  },
  'Non-binary': {
    height_cm: 168,
    weight_kg: 74,
    salary_usd_monthly: { 'High School': 2750, 'Associate Degree': 3250, 'Bachelor\'s Degree': 4500, 'Master\'s Degree': 6000, 'Doctorate': 7500 },
  },
  'Prefer not to say': {
    height_cm: 168,
    weight_kg: 74,
    salary_usd_monthly: { 'High School': 2750, 'Associate Degree': 3250, 'Bachelor\'s Degree': 4500, 'Master\'s Degree': 6000, 'Doctorate': 7500 },
  },
};

export const SIMULATED_POPULATION_DISTRIBUTION = {
  gender_distribution: { 'Male': 0.49, 'Female': 0.51, 'Non-binary': 0.005, 'Prefer not to say': 0.005 },
  education_distribution: { 'High School': 0.25, 'Associate Degree': 0.15, 'Bachelor\'s Degree': 0.35, 'Master\'s Degree': 0.20, 'Doctorate': 0.05 },
  salary_distribution_factor: {
    'low': 0.3,
    'medium': 0.4,
    'high': 0.2,
  },
  age_distribution_factor: {
    'same_age': 0.2,
    'close_age': 0.4,
    'wider_age': 0.3,
    'any_age': 0.1,
  },
  height_weight_factor: 0.8,
}; 