import React, { useState, useEffect, useRef } from 'react';
import { BarChart, Bar, PieChart, Pie, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
import {
  initialData,
  convertToUSD,
  financialStressData,
  relationshipCostBreakdown,
  PIE_COLORS,
  averageDateCostTrend,
  datingAppImpactData,
  heterosexualPaymentPerceptions,
  incomeByCoupleType,
  financialStayReasons,
  GENDER_OPTIONS,
  EDUCATION_OPTIONS,
  AVERAGE_DEMOGRAPHICS,
  SIMULATED_POPULATION_DISTRIBUTION
} from './data';

const App = () => {
  const [selectedCity, setSelectedCity] = useState(initialData[0]);
  const [compareCity, setCompareCity] = useState(initialData[1]);
  const [mode, setMode] = useState('single');
  const [chatHistory, setChatHistory] = useState([]);
  const [userInput, setUserInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatContainerRef = useRef(null);
  const eyeLeftRef = useRef(null);
  const eyeRightRef = useRef(null);
  const mouthRef = useRef(null);

  // User's personal financial inputs for the calculator
  const [userMonthlyIncome, setUserMonthlyIncome] = useState('');
  const [userMonthlyRent, setUserMonthlyRent] = useState('');
  const [userMonthlyUtilities, setUserMonthlyUtilities] = useState('');
  const [userOtherExpenses, setUserOtherExpenses] = useState('');

  // Personal Match State
  const [myGender, setMyGender] = useState(GENDER_OPTIONS[0]);
  const [myAge, setMyAge] = useState('');
  const [myHeightCm, setMyHeightCm] = useState('');
  const [myWeightKg, setMyWeightKg] = useState('');
  const [myEducation, setMyEducation] = useState(EDUCATION_OPTIONS[0]);
  const [myOccupation, setMyOccupation] = useState('');
  const [mySalary, setMySalary] = useState('');

  const [partnerGender, setPartnerGender] = useState('Any');
  const [partnerMinAge, setPartnerMinAge] = useState('');
  const [partnerMaxAge, setPartnerMaxAge] = useState('');
  const [partnerEducation, setPartnerEducation] = useState('Any');
  const [partnerMinSalary, setPartnerMinSalary] = useState('');
  const [partnerMaxSalary, setPartnerMaxSalary] = useState('');
  const [partnerHeightPreference, setPartnerHeightPreference] = useState('Any');
  const [partnerWeightPreference, setPartnerWeightPreference] = useState('Any');

  const [matchResult, setMatchResult] = useState(null);

  // Add state for custom city/country in Guru section
  const [guruCityOption, setGuruCityOption] = useState('preset'); // 'preset' or 'other'
  const [customGuruCity, setCustomGuruCity] = useState('');
  const [customGuruCountry, setCustomGuruCountry] = useState('');

  // Add state for user and partner city selection in Personal Match
  const [myCityOption, setMyCityOption] = useState('preset'); // 'preset' or 'other'
  const [myCity, setMyCity] = useState(initialData[0]);
  const [myCustomCity, setMyCustomCity] = useState('');
  const [myCustomCountry, setMyCustomCountry] = useState('');
  const [partnerCityOption, setPartnerCityOption] = useState('preset');
  const [partnerCity, setPartnerCity] = useState(initialData[0]);
  const [partnerCustomCity, setPartnerCustomCity] = useState('');
  const [partnerCustomCountry, setPartnerCustomCountry] = useState('');

  // Scroll chat to bottom on new messages
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatHistory]);

  // Eye movement animation for the Guru
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (eyeLeftRef.current && eyeRightRef.current) {
        const guruRect = eyeLeftRef.current.closest('svg').getBoundingClientRect();
        const eyeCenterX = guruRect.left + guruRect.width / 2;
        const eyeCenterY = guruRect.top + guruRect.height / 2;

        const deltaX = e.clientX - eyeCenterX;
        const deltaY = e.clientY - eyeCenterY;

        const angle = Math.atan2(deltaY, deltaX);
        const distance = Math.min(5, Math.sqrt(deltaX * deltaX + deltaY * deltaY) / 20);

        const moveX = Math.cos(angle) * distance;
        const moveY = Math.sin(angle) * distance;

        eyeLeftRef.current.style.transform = `translate(${moveX}px, ${moveY}px)`;
        eyeRightRef.current.style.transform = `translate(${moveX}px, ${moveY}px)`;
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  // Mouth animation when AI is thinking/talking
  useEffect(() => {
    if (mouthRef.current) {
      if (isLoading) {
        mouthRef.current.style.animation = 'talking 0.8s infinite alternate';
      } else {
        mouthRef.current.style.animation = 'none';
      }
    }
  }, [isLoading]);

  // Function to calculate overall average date cost for a given city
  const calculateOverallAvgDateCost = (cityData) => {
    const costs = [
      cityData.date_cost_coffee_usd,
      cityData.date_cost_dinner_mid_usd,
      cityData.date_cost_entertainment_usd,
      cityData.date_cost_dinner_upscale_usd,
    ];
    const total = costs.reduce((sum, cost) => sum + cost, 0);
    return total / costs.length;
  };

  // Function to calculate Love Affordability Index
  const calculateLoveAffordabilityIndex = (cityData) => {
    if (cityData.avg_net_monthly_salary_usd === 0) return 0;
    const overallAvgDateCost = calculateOverallAvgDateCost(cityData);
    return (cityData.avg_net_monthly_salary_usd / overallAvgDateCost).toFixed(2);
  };

  // Function to calculate Quality of Life Index
  const calculateQualityOfLifeIndex = (cityData) => {
    const gdpFactor = cityData.gdp_per_capita_usd / 10000;
    const happinessFactor = cityData.happiness_score * 10;
    return ((gdpFactor + happinessFactor) / 2).toFixed(2);
  };

  // Function to get gender/identity specific dating costs
  const getGenderSpecificCosts = (overallAvgDateCost) => {
    return {
      male_female_date_cost_usd: (overallAvgDateCost * 1.1).toFixed(2),
      female_male_date_cost_usd: (overallAvgDateCost * 0.9).toFixed(2),
      lgbtq_date_cost_usd: (overallAvgDateCost * 1.0).toFixed(2),
      gender_neutral_date_cost_usd: overallAvgDateCost.toFixed(2),
    };
  };

  // Guru Advice Logic
  const getGuruAdvice = (cityData) => {
    const affordability = parseFloat(calculateLoveAffordabilityIndex(cityData));
    const qualityOfLife = parseFloat(calculateQualityOfLifeIndex(cityData));

    let advice = `**${cityData.city}** offers a unique blend.`;

    if (affordability > 20 && qualityOfLife > 70) {
      advice += " It's an excellent choice for both romance and a high quality of life! You can afford many dates here while enjoying great stability and well-being.";
    } else if (affordability > 15 && qualityOfLife > 60) {
      advice += " This city provides a good balance of dating affordability and a solid quality of life. You'll find plenty of opportunities for both.";
    } else if (affordability > 10 && qualityOfLife > 50) {
      advice += " Dating here is reasonably affordable, and the quality of life is decent. It's a practical choice for many.";
    } else {
      advice += " You might find dating a bit more expensive relative to income, or the quality of life could be improved. Consider budgeting carefully for dates or exploring other options if quality of life is a top priority.";
    }

    if (cityData.gdp_per_capita_usd > 50000) {
      advice += " Its strong economy (high GDP per capita) suggests good infrastructure and opportunities.";
    } else {
      advice += " The economy is developing, which might mean lower costs but also fewer amenities compared to wealthier cities.";
    }

    if (cityData.happiness_score > 6.5) {
      advice += " The high happiness score indicates a generally content population, which can contribute to a positive dating environment.";
    } else {
      advice += " A lower happiness score might suggest some societal challenges, which could subtly impact the overall vibe.";
    }

    return advice;
  };

  // Function to send message to AI Guru
  const sendMessageToGuru = async () => {
    if (!userInput.trim()) return;

    const newUserMessage = { role: 'user', parts: [{ text: userInput }] };
    setChatHistory((prev) => [...prev, newUserMessage]);
    setUserInput('');
    setIsLoading(true);

    // Use custom city/country if 'Other' is selected
    let currentCityData = selectedCity;
    let cityName = selectedCity.city;
    let countryName = selectedCity.country;
    let isCustom = false;
    if (guruCityOption === 'other') {
      cityName = customGuruCity || 'Unknown City';
      countryName = customGuruCountry || 'Unknown Country';
      isCustom = true;
    }

    const overallAvgDateCost = calculateOverallAvgDateCost(currentCityData);
    const loveAffordabilityIndex = calculateLoveAffordabilityIndex(currentCityData);
    const qualityOfLifeIndex = calculateQualityOfLifeIndex(currentCityData);
    const genderSpecificCosts = getGenderSpecificCosts(overallAvgDateCost);
    const userAffordabilityData = calculateUserAffordability();

    // If custom, show only city/country and user financials, not city stats
    const prompt = isCustom ? `
      You are the "Romance & Riches Guru", an AI assistant specialized in providing advice on living and dating costs globally.
      The user has entered a custom city and country: City: ${cityName}, Country: ${countryName}.
      There is no detailed cost-of-living data for this city, so base your advice on general principles, the user's financials, and any information the user provides in their question.
      User's Personal Financials:
      Monthly Income: ${userMonthlyIncome ? `$${parseFloat(userMonthlyIncome).toLocaleString()}` : 'Not provided'}
      Monthly Rent: ${userMonthlyRent ? `$${parseFloat(userMonthlyRent).toLocaleString()}` : 'Not provided'}
      Monthly Utilities: ${userMonthlyUtilities ? `$${parseFloat(userMonthlyUtilities).toLocaleString()}` : 'Not provided'}
      Other Monthly Expenses: ${userOtherExpenses ? `$${parseFloat(userOtherExpenses).toLocaleString()}` : 'Not provided'}
      Calculated Disposable Income: $${userAffordabilityData.disposableIncome}
      Calculated Dates Afforded (based on your inputs and a typical average date cost): ${userAffordabilityData.datesAffordable} dates
      Be empathetic, practical, and helpful. If the user asks for specific city data, explain that you can only provide general advice for custom locations.
      User's question: "${newUserMessage.parts[0].text}"
    ` : `
      You are the "Romance & Riches Guru", an AI assistant specialized in providing advice on living and dating costs globally.
      Your goal is to be helpful, empathetic, and provide practical advice.
      **Respond like a human, use a conversational tone, and keep your answers concise unless the user explicitly asks for more detail or a detailed breakdown.**

      You have access to data for various cities, including their estimated monthly rent and utilities.
      Always refer to the data of the *currently selected city* in the application for your calculations and advice.

      Here is the data for the currently selected city:
      City: ${cityName}, ${countryName}
      Average Net Monthly Salary: $${currentCityData.avg_net_monthly_salary_usd.toLocaleString()}
      Average Cost of Coffee Date: $${currentCityData.date_cost_coffee_usd.toFixed(2)}
      Average Cost of Mid-Range Dinner Date (for 2): $${currentCityData.date_cost_dinner_mid_usd.toFixed(2)}
      Average Cost of Entertainment Date (per person): $${currentCityData.date_cost_entertainment_usd.toFixed(2)}
      Average Cost of Upscale Dinner Date (per person): $${currentCityData.date_cost_dinner_upscale_usd.toFixed(2)}
      Overall Average Date Cost: $${overallAvgDateCost.toFixed(2)}
      Love Affordability Index: ${loveAffordabilityIndex} dates per month
      GDP Per Capita (USD): $${currentCityData.gdp_per_capita_usd.toLocaleString()}
      Happiness Score: ${currentCityData.happiness_score}
      Quality of Life Index: ${qualityOfLifeIndex}
      Estimated Monthly Rent: $${currentCityData.monthly_rent_usd ? currentCityData.monthly_rent_usd.toLocaleString() : 'N/A'}
      Estimated Monthly Utilities: $${currentCityData.monthly_utilities_usd ? currentCityData.monthly_utilities_usd.toLocaleString() : 'N/A'}

      Illustrative Gender/Identity Specific Date Costs in this city:
      - Male-Female Date Cost: $${genderSpecificCosts.male_female_date_cost_usd}
      - Female-Male Date Cost: $${genderSpecificCosts.female_male_date_cost_usd}
      - LGBTQ+ Date Cost: $${genderSpecificCosts.lgbtq_date_cost_usd}
      - Gender Neutral Date Cost: $${genderSpecificCosts.gender_neutral_date_cost_usd}

      User's Personal Financials (from the calculator section, if provided):
      Monthly Income: ${userMonthlyIncome ? `$${parseFloat(userMonthlyIncome).toLocaleString()}` : 'Not provided'}
      Monthly Rent: ${userMonthlyRent ? `$${parseFloat(userMonthlyRent).toLocaleString()}` : 'Not provided'}
      Monthly Utilities: ${userMonthlyUtilities ? `$${parseFloat(userMonthlyUtilities).toLocaleString()}` : 'Not provided'}
      Other Monthly Expenses: ${userOtherExpenses ? `$${parseFloat(userOtherExpenses).toLocaleString()}` : 'Not provided'}
      Calculated Disposable Income: $${userAffordabilityData.disposableIncome}
      Calculated Dates Afforded (based on your inputs and city's average date cost): ${userAffordabilityData.datesAffordable} dates

      Based on the user's question and ALL the provided data (city data and user's personal financials), offer insightful, empathetic, and practical advice.
      You can discuss affordability, quality of life, dating strategies, mental health considerations related to dating/finances, and specific costs.
      If the user asks for a comparison or structured data, try to format your response in a clear, possibly tabular, or CSV-like format.
      Do NOT ask the user for data that is already provided in the prompt (like income, city, or existing expenses). Directly use the provided values.

      User's question: "${newUserMessage.parts[0].text}"
    `;

    try {
      const payload = {
        model: "anthropic/claude-3.5-sonnet",
        messages: [
          {
            role: "user",
            content: prompt
          }
        ],
        max_tokens: 1000,
        temperature: 0.7
      };

      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer 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',
          'HTTP-Referer': window.location.origin,
          'X-Title': 'Dating Cost Calculator'
        },
        body: JSON.stringify(payload)
      });

      const result = await response.json();
      if (result.choices && result.choices.length > 0 && result.choices[0].message) {
        const guruResponse = result.choices[0].message.content;
        setChatHistory((prev) => [...prev, { role: 'model', parts: [{ text: guruResponse }] }]);
      } else {
        setChatHistory((prev) => [...prev, { role: 'model', parts: [{ text: "I'm sorry, I couldn't generate a response. Please try again." }] }]);
        console.error("AI response structure unexpected:", result);
      }
    } catch (error) {
      setChatHistory((prev) => [...prev, { role: 'model', parts: [{ text: "I'm having trouble connecting right now. Please check your network or try again later." }] }]);
      console.error("Error calling OpenRouter API:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Function to calculate user's disposable income and dates affordable
  const calculateUserAffordability = () => {
    const income = parseFloat(userMonthlyIncome) || 0;
    const rent = parseFloat(userMonthlyRent) || 0;
    const utilities = parseFloat(userMonthlyUtilities) || 0;
    const otherExpenses = parseFloat(userOtherExpenses) || 0;

    const totalFixedExpenses = rent + utilities + otherExpenses;
    const disposableIncome = income - totalFixedExpenses;

    const overallAvgDateCost = calculateOverallAvgDateCost(selectedCity);
    const datesAffordable = overallAvgDateCost > 0 ? (disposableIncome / overallAvgDateCost) : 0;

    return {
      disposableIncome: disposableIncome.toFixed(2),
      datesAffordable: datesAffordable.toFixed(2),
    };
  };

  const userAffordability = calculateUserAffordability();

  // Personal Match & Preferences Logic
  const calculatePersonalMatch = () => {
    let comparison = {};
    let matchProbability = 1.0;

    // Use selected or custom city for population
    let userCityName = myCityOption === 'other' ? (myCustomCity || 'Unknown City') : myCity.city;
    let userCountryName = myCityOption === 'other' ? (myCustomCountry || 'Unknown Country') : myCity.country;
    let partnerCityName = partnerCityOption === 'other' ? (partnerCustomCity || 'Unknown City') : partnerCity.city;
    let partnerCountryName = partnerCityOption === 'other' ? (partnerCustomCountry || 'Unknown Country') : partnerCity.country;

    const myHeight = parseFloat(myHeightCm);
    const myWeight = parseFloat(myWeightKg);
    const mySalaryNum = parseFloat(mySalary);
    const myAgeNum = parseInt(myAge);

    if (myGender && AVERAGE_DEMOGRAPHICS[myGender]) {
      const avgDem = AVERAGE_DEMOGRAPHICS[myGender];
      comparison.height = myHeight ? (myHeight > avgDem.height_cm ? 'taller than' : myHeight < avgDem.height_cm ? 'shorter than' : 'about the same height as') + ` the average ${myGender.toLowerCase()}` : 'N/A';
      comparison.weight = myWeight ? (myWeight > avgDem.weight_kg ? 'heavier than' : myWeight < avgDem.weight_kg ? 'lighter than' : 'about the same weight as') + ` the average ${myGender.toLowerCase()}` : 'N/A';
      comparison.salary = mySalaryNum ? (mySalaryNum > avgDem.salary_usd_monthly[myEducation] ? 'higher than' : mySalaryNum < avgDem.salary_usd_monthly[myEducation] ? 'lower than' : 'about the same as') + ` the average ${myEducation.toLowerCase()} ${myGender.toLowerCase()} salary` : 'N/A';
    }

    // Calculate Match Probability
    if (partnerGender !== 'Any') {
      matchProbability *= SIMULATED_POPULATION_DISTRIBUTION.gender_distribution[partnerGender] || 0;
    } else {
      matchProbability *= 1;
    }

    if (myAgeNum && partnerMinAge && partnerMaxAge) {
      const minAge = parseInt(partnerMinAge);
      const maxAge = parseInt(partnerMaxAge);
      const ageRangeSize = maxAge - minAge + 1;
      if (ageRangeSize > 0) {
        matchProbability *= (Math.min(maxAge, myAgeNum + 10) - Math.max(minAge, myAgeNum - 10) + 1) / 20;
        matchProbability = Math.max(0, matchProbability);
      }
    } else if (myAgeNum) {
      matchProbability *= SIMULATED_POPULATION_DISTRIBUTION.age_distribution_factor.close_age;
    }

    if (partnerEducation !== 'Any') {
      matchProbability *= SIMULATED_POPULATION_DISTRIBUTION.education_distribution[partnerEducation] || 0;
    } else {
      matchProbability *= 1;
    }

    if (partnerMinSalary || partnerMaxSalary) {
      const minSal = parseFloat(partnerMinSalary) || 0;
      const maxSal = parseFloat(partnerMaxSalary) || Infinity;
      let salaryTierFactor = 0;
      if (minSal < 2000 && maxSal >= 2000) salaryTierFactor += SIMULATED_POPULATION_DISTRIBUTION.salary_distribution_factor.low;
      if (minSal <= 5000 && maxSal >= 2000) salaryTierFactor += SIMULATED_POPULATION_DISTRIBUTION.salary_distribution_factor.medium;
      if (minSal <= Infinity && maxSal > 5000) salaryTierFactor += SIMULATED_POPULATION_DISTRIBUTION.salary_distribution_factor.high;
      matchProbability *= salaryTierFactor;
    } else {
      matchProbability *= 1;
    }

    if (partnerHeightPreference !== 'Any' || partnerWeightPreference !== 'Any') {
      matchProbability *= SIMULATED_POPULATION_DISTRIBUTION.height_weight_factor;
    }

    matchProbability = Math.min(1, Math.max(0, matchProbability));

    // Use user city for population estimate (if custom, use 1,000,000)
    const cityPopulationMap = {
      'New York City': 8000000,
      'Los Angeles': 4000000,
      'Chicago': 2700000,
      'San Francisco': 870000,
      'Miami': 470000,
      'Mexico City': 9000000,
      'Berlin': 3700000,
      'London': 9000000,
      'Tokyo': 14000000,
      'Sydney': 5300000,
    };
    const population = cityPopulationMap[userCityName] || 1000000;

    const estimatedMatches = Math.round(population * matchProbability * 0.01);

    setMatchResult({
      comparison,
      estimatedMatches,
      matchProbability: (matchProbability * 100).toFixed(2),
      userCityName,
      userCountryName,
      partnerCityName,
      partnerCountryName
    });
  };

  // Function to copy text to clipboard
  const copyToClipboard = (text) => {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(() => {
        showMessageBox('Copied to clipboard!');
      }).catch(err => {
        console.error('Failed to copy text: ', err);
        fallbackCopyTextToClipboard(text);
      });
    } else {
      fallbackCopyTextToClipboard(text);
    }
  };

  const fallbackCopyTextToClipboard = (text) => {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    textArea.style.position = "fixed";
    textArea.style.left = "-999999px";
    textArea.style.top = "-999999px";
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    try {
      document.execCommand('copy');
      showMessageBox('Copied to clipboard!');
    } catch (copyErr) {
      console.error('Fallback copy failed: ', copyErr);
      showMessageBox('Failed to copy to clipboard. Please copy manually.');
    }
    document.body.removeChild(textArea);
  };

  const showMessageBox = (message) => {
    const messageBox = document.createElement('div');
    messageBox.textContent = message;
    messageBox.style.cssText = `
      position: fixed;
      top: 20px;
      left: 50%;
      transform: translateX(-50%);
      background-color: #4CAF50;
      color: white;
      padding: 10px 20px;
      border-radius: 8px;
      z-index: 1000;
      opacity: 0;
      transition: opacity 0.5s ease-in-out;
    `;
    document.body.appendChild(messageBox);

    setTimeout(() => {
      messageBox.style.opacity = 1;
    }, 10);

    setTimeout(() => {
      messageBox.style.opacity = 0;
      messageBox.addEventListener('transitionend', () => messageBox.remove());
    }, 3000);
  };

  // Render city data block
  const renderCityData = (cityData) => {
    const overallAvgDateCost = calculateOverallAvgDateCost(cityData);
    const loveAffordabilityIndex = calculateLoveAffordabilityIndex(cityData);
    const qualityOfLifeIndex = calculateQualityOfLifeIndex(cityData);
    const genderSpecificCosts = getGenderSpecificCosts(overallAvgDateCost);

    return (
      <div className="bg-white p-6 rounded-lg shadow-md border border-purple-100 flex-1 min-w-[300px]">
        <h2 className="text-xl font-bold text-purple-700 mb-4">{cityData.city}, {cityData.country}</h2>
        <p className="text-gray-700 mb-2">
          <span className="font-semibold">GDP Per Capita (USD):</span> ${cityData.gdp_per_capita_usd.toLocaleString()}
        </p>
        <p className="text-gray-700 mb-2">
          <span className="font-semibold">Happiness Score:</span> {cityData.happiness_score}
        </p>
        <p className="text-gray-700 mb-2">
          <span className="font-semibold">Quality of Life Index:</span> {qualityOfLifeIndex}
        </p>
        <p className="text-gray-700 mb-2">
          <span className="font-semibold">Avg Net Monthly Salary:</span> ${cityData.avg_net_monthly_salary_usd.toLocaleString()}
        </p>
        <p className="text-gray-700 mb-2">
          <span className="font-semibold">Overall Avg Date Cost:</span> ${overallAvgDateCost.toFixed(2)}
        </p>
        <p className="text-gray-700">
          <span className="font-semibold">Love Affordability Index:</span> {loveAffordabilityIndex} dates/month
        </p>
        <h3 className="text-md font-bold text-blue-600 mt-4 mb-2">Illustrative Date Costs:</h3>
        <ul className="text-sm text-gray-600">
          <li>Coffee: ${cityData.date_cost_coffee_usd.toFixed(2)}</li>
          <li>Mid-Range Dinner (for 2): ${cityData.date_cost_dinner_mid_usd.toFixed(2)}</li>
          <li>Entertainment (per person): ${cityData.date_cost_entertainment_usd.toFixed(2)}</li>
          <li>Upscale Dinner (per person): ${cityData.date_cost_dinner_upscale_usd.toFixed(2)}</li>
        </ul>
        <h3 className="text-md font-bold text-green-600 mt-4 mb-2">Gender Specific Date Costs:</h3>
        <ul className="text-sm text-gray-600">
          <li>Male-Female Date Cost: ${genderSpecificCosts.male_female_date_cost_usd}</li>
          <li>Female-Male Date Cost: ${genderSpecificCosts.female_male_date_cost_usd}</li>
          <li>LGBTQ+ Date Cost: ${genderSpecificCosts.lgbtq_date_cost_usd}</li>
          <li>Gender Neutral Date Cost: ${genderSpecificCosts.gender_neutral_date_cost_usd}</li>
        </ul>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 to-pink-100 p-4 sm:p-8 font-inter">
      <div className="max-w-6xl mx-auto bg-white shadow-xl rounded-xl p-6 sm:p-10 border border-purple-200">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-center text-purple-800 mb-8">
          Global Living & Dating Cost Calculator
        </h1>

        <div className="flex justify-center mb-8 space-x-4 flex-wrap gap-2">
          <button
            className={`px-4 py-2 sm:px-6 sm:py-3 rounded-lg font-bold text-sm sm:text-lg transition-all duration-300 ${
              mode === 'single'
                ? 'bg-purple-600 text-white shadow-lg'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
            onClick={() => setMode('single')}
          >
            Single City View
          </button>
          <button
            className={`px-4 py-2 sm:px-6 sm:py-3 rounded-lg font-bold text-sm sm:text-lg transition-all duration-300 ${
              mode === 'compare'
                ? 'bg-purple-600 text-white shadow-lg'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
            onClick={() => setMode('compare')}
          >
            Vs (City Comparison)
          </button>
          <button
            className={`px-4 py-2 sm:px-6 sm:py-3 rounded-lg font-bold text-sm sm:text-lg transition-all duration-300 ${
              mode === 'guru'
                ? 'bg-purple-600 text-white shadow-lg'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
            onClick={() => setMode('guru')}
          >
            Romance Guru AI & Calculator
          </button>
          <button
            className={`px-4 py-2 sm:px-6 sm:py-3 rounded-lg font-bold text-sm sm:text-lg transition-all duration-300 ${
              mode === 'insights'
                ? 'bg-purple-600 text-white shadow-lg'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
            onClick={() => setMode('insights')}
          >
            Dating & Well-being Insights
          </button>
          <button
            className={`px-4 py-2 sm:px-6 sm:py-3 rounded-lg font-bold text-sm sm:text-lg transition-all duration-300 ${
              mode === 'gender_insights'
                ? 'bg-purple-600 text-white shadow-lg'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
            onClick={() => setMode('gender_insights')}
          >
            Dating Costs by Gender & Orientation
          </button>
          <button
            className={`px-4 py-2 sm:px-6 sm:py-3 rounded-lg font-bold text-sm sm:text-lg transition-all duration-300 ${
              mode === 'personal_match'
                ? 'bg-purple-600 text-white shadow-lg'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
            onClick={() => setMode('personal_match')}
          >
            Personal Match & Preferences
          </button>
        </div>

        {mode === 'single' && (
          <>
            <div className="mb-8">
              <label htmlFor="city-select" className="block text-lg font-semibold text-gray-700 mb-2">
                Select a City:
              </label>
              <select
                id="city-select"
                className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-purple-500 focus:border-purple-500 text-gray-800"
                value={selectedCity.id}
                onChange={(e) => setSelectedCity(initialData.find(city => city.id === parseInt(e.target.value)))}
              >
                {initialData.map((city) => (
                  <option key={city.id} value={city.id}>
                    {city.city}, {city.country}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {renderCityData(selectedCity)}
              <div className="bg-yellow-50 p-6 rounded-lg shadow-md border border-yellow-100 flex-1">
                <h2 className="text-xl font-bold text-yellow-800 mb-4">Romance & Riches Guru Says...</h2>
                <p className="text-gray-700 leading-relaxed">
                  {getGuruAdvice(selectedCity)}
                </p>
              </div>
            </div>
          </>
        )}

        {mode === 'compare' && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div>
                <label htmlFor="city1-select" className="block text-lg font-semibold text-gray-700 mb-2">
                  Select City 1:
                </label>
                <select
                  id="city1-select"
                  className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-purple-500 focus:border-purple-500 text-gray-800"
                  value={selectedCity.id}
                  onChange={(e) => setSelectedCity(initialData.find(city => city.id === parseInt(e.target.value)))}
                >
                  {initialData.map((city) => (
                    <option key={city.id} value={city.id}>
                      {city.city}, {city.country}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="city2-select" className="block text-lg font-semibold text-gray-700 mb-2">
                  Select City 2:
                </label>
                <select
                  id="city2-select"
                  className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-purple-500 focus:border-purple-500 text-gray-800"
                  value={compareCity.id}
                  onChange={(e) => setCompareCity(initialData.find(city => city.id === parseInt(e.target.value)))}
                >
                  {initialData.map((city) => (
                    <option key={city.id} value={city.id}>
                      {city.city}, {city.country}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex flex-wrap lg:flex-nowrap gap-6 justify-center mb-8">
              {renderCityData(selectedCity)}
              <div className="flex items-center justify-center text-4xl font-bold text-purple-700">
                VS
              </div>
              {renderCityData(compareCity)}
            </div>

            <div className="bg-yellow-50 p-6 rounded-lg shadow-md border border-yellow-100 flex-1 mt-8">
              <h2 className="text-xl font-bold text-yellow-800 mb-4">Cost of Living Comparison Summary</h2>
              <p className="text-gray-700 leading-relaxed mb-2">
                Comparing {selectedCity.city} and {compareCity.city}:
              </p>
              <ul className="list-disc list-inside text-gray-700">
                <li>
                  <span className="font-semibold">Average Monthly Salary:</span> {selectedCity.city} (${selectedCity.avg_net_monthly_salary_usd.toLocaleString()}) vs. {compareCity.city} (${compareCity.avg_net_monthly_salary_usd.toLocaleString()})
                </li>
                <li>
                  <span className="font-semibold">Estimated Monthly Rent:</span> {selectedCity.city} (${selectedCity.monthly_rent_usd.toLocaleString()}) vs. {compareCity.city} (${compareCity.monthly_rent_usd.toLocaleString()})
                </li>
                <li>
                  <span className="font-semibold">Estimated Monthly Utilities:</span> {selectedCity.city} (${selectedCity.monthly_utilities_usd.toLocaleString()}) vs. {compareCity.city} (${compareCity.monthly_utilities_usd.toLocaleString()})
                </li>
                <li>
                  <span className="font-semibold">Overall Average Date Cost:</span> {selectedCity.city} (${calculateOverallAvgDateCost(selectedCity).toFixed(2)}) vs. {compareCity.city} (${calculateOverallAvgDateCost(compareCity).toFixed(2)})
                </li>
                <li>
                  <span className="font-semibold">Love Affordability Index:</span> {selectedCity.city} ({calculateLoveAffordabilityIndex(selectedCity)} dates/month) vs. {compareCity.city} ({calculateLoveAffordabilityIndex(compareCity)} dates/month)
                </li>
                <li>
                  <span className="font-semibold">Quality of Life Index:</span> {selectedCity.city} ({calculateQualityOfLifeIndex(selectedCity)}) vs. {compareCity.city} ({calculateQualityOfLifeIndex(compareCity)})
                </li>
              </ul>
              <p className="text-gray-700 leading-relaxed mt-4">
                The city with the higher Love Affordability Index and Quality of Life Index generally offers a more favorable environment for both financial well-being and dating opportunities. Consider your personal priorities when evaluating these differences.
              </p>
            </div>
          </>
        )}

        {mode === 'guru' && (
          <div className="bg-green-50 p-6 rounded-lg shadow-md border border-green-100 flex flex-col items-center">
            <h2 className="text-2xl font-bold text-green-700 mb-6 text-center">Chat with the Romance & Riches Guru!</h2>
            <p className="text-gray-700 mb-6 text-center">
              First, select a city and enter your monthly financial details below. Then, ask the Guru anything about living, dating, and finances!
            </p>

            <div className="mb-6 w-full max-w-2xl">
              <label htmlFor="city-select-guru" className="block text-lg font-semibold text-gray-700 mb-2">
                Select a City:
              </label>
              <div className="flex gap-2">
                <select
                  id="city-select-guru"
                  className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-purple-500 focus:border-purple-500 text-gray-800"
                  value={guruCityOption === 'preset' ? selectedCity.id : 'other'}
                  onChange={(e) => {
                    if (e.target.value === 'other') {
                      setGuruCityOption('other');
                    } else {
                      setGuruCityOption('preset');
                      setSelectedCity(initialData.find(city => city.id === parseInt(e.target.value)));
                    }
                  }}
                >
                  {initialData.map((city) => (
                    <option key={city.id} value={city.id}>
                      {city.city}, {city.country}
                    </option>
                  ))}
                  <option value="other">Other (Type your own)</option>
                </select>
              </div>
              {guruCityOption === 'other' && (
                <div className="mt-4 flex flex-col gap-2">
                  <input
                    type="text"
                    className="p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-purple-500 focus:border-purple-500 text-gray-800"
                    placeholder="Enter City Name"
                    value={customGuruCity}
                    onChange={e => setCustomGuruCity(e.target.value)}
                  />
                  <input
                    type="text"
                    className="p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-purple-500 focus:border-purple-500 text-gray-800"
                    placeholder="Enter Country Name"
                    value={customGuruCountry}
                    onChange={e => setCustomGuruCountry(e.target.value)}
                  />
                </div>
              )}
            </div>

            <div className="bg-blue-100 p-6 rounded-lg shadow-md border border-blue-200 w-full max-w-2xl mb-6">
              <h3 className="text-xl font-bold text-blue-800 mb-4 text-center">Your Monthly Financials</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="income" className="block text-gray-700 text-sm font-bold mb-2">
                    Monthly Income ($):
                  </label>
                  <input
                    type="number"
                    id="income"
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    value={userMonthlyIncome}
                    onChange={(e) => setUserMonthlyIncome(e.target.value)}
                    placeholder="e.g., 3000"
                  />
                </div>
                <div>
                  <label htmlFor="rent" className="block text-gray-700 text-sm font-bold mb-2">
                    Monthly Rent ($):
                  </label>
                  <input
                    type="number"
                    id="rent"
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    value={userMonthlyRent}
                    onChange={(e) => setUserMonthlyRent(e.target.value)}
                    placeholder="e.g., 1500"
                  />
                </div>
                <div>
                  <label htmlFor="utilities" className="block text-gray-700 text-sm font-bold mb-2">
                    Monthly Utilities ($):
                  </label>
                  <input
                    type="number"
                    id="utilities"
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    value={userMonthlyUtilities}
                    onChange={(e) => setUserMonthlyUtilities(e.target.value)}
                    placeholder="e.g., 120"
                  />
                </div>
                <div>
                  <label htmlFor="other-expenses" className="block text-gray-700 text-sm font-bold mb-2">
                    Other Monthly Expenses ($):
                  </label>
                  <input
                    type="number"
                    id="other-expenses"
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    value={userOtherExpenses}
                    onChange={(e) => setUserOtherExpenses(e.target.value)}
                    placeholder="e.g., 500"
                  />
                </div>
              </div>
              <div className="mt-6 text-center bg-blue-200 p-3 rounded-lg">
                <p className="text-lg font-bold text-blue-900 mb-1">
                  Your Disposable Income: <span className="text-green-700">${userAffordability.disposableIncome}</span>
                </p>
                <p className="text-lg font-bold text-blue-900">
                  Dates You Can Afford (approx. average cost): <span className="text-green-700">{userAffordability.datesAffordable}</span> per month
                </p>
                <p className="text-xs text-gray-700 mt-1">
                  (Based on average date cost of ${calculateOverallAvgDateCost(selectedCity).toFixed(2)} in {selectedCity.city})
                </p>
              </div>
            </div>

            <div className="w-full max-w-sm mb-6 flex justify-center items-center relative">
              <svg width="150" height="150" viewBox="0 0 200 200" className="bg-white rounded-full shadow-lg border-2 border-green-300">
                <circle cx="100" cy="100" r="90" fill="#FFF8DC" />
                <circle cx="100" cy="100" r="80" fill="#FFDDC1" />
                <circle ref={eyeLeftRef} cx="70" cy="80" r="10" fill="#333" />
                <circle ref={eyeRightRef} cx="130" cy="80" r="10" fill="#333" />
                <circle cx="70" cy="80" r="5" fill="white" />
                <circle cx="130" cy="80" r="5" fill="white" />
                <rect ref={mouthRef} x="80" y="120" width="40" height="10" rx="5" ry="5" fill="#C0392B" />
                <path d="M55 80 Q65 70 75 80 M125 80 Q135 70 145 80 M75 80 L125 80" stroke="#333" strokeWidth="3" fill="none" />
                <circle cx="70" cy="80" r="15" stroke="#333" strokeWidth="2" fill="none" />
                <circle cx="130" cy="80" r="15" stroke="#333" strokeWidth="2" fill="none" />
                <path d="M50 50 C50 20 150 20 150 50 L100 100 Z" fill="#8B4513" />
              </svg>
              {isLoading && (
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 bg-green-200 text-green-800 text-xs px-3 py-1 rounded-full animate-pulse">
                  Guru is thinking...
                </div>
              )}
            </div>

            <div ref={chatContainerRef} className="w-full max-w-2xl h-80 bg-white border border-gray-300 rounded-lg p-4 overflow-y-auto mb-4 shadow-inner chat-container">
              {chatHistory.length === 0 ? (
                <p className="text-gray-500 text-center mt-10">Ask the Guru anything about living, dating, and finances!</p>
              ) : (
                chatHistory.map((msg, index) => (
                  <div key={index} className={`mb-3 p-2 rounded-lg max-w-[80%] ${
                    msg.role === 'user' ? 'bg-blue-100 ml-auto text-right' : 'bg-gray-100 mr-auto text-left'
                  }`}>
                    <p className="font-semibold text-sm mb-1">{msg.role === 'user' ? 'You' : 'Guru'}:</p>
                    <div className="text-gray-800" dangerouslySetInnerHTML={{ __html: msg.parts[0].text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />
                    {msg.role === 'model' && msg.parts[0].text.includes('|') && (
                      <button
                        onClick={() => copyToClipboard(msg.parts[0].text)}
                        className="mt-2 px-3 py-1 bg-purple-500 text-white text-xs rounded-md hover:bg-purple-600 transition-colors"
                      >
                        Copy as CSV
                      </button>
                    )}
                  </div>
                ))
              )}
            </div>

            <div className="w-full max-w-2xl flex">
              <input
                type="text"
                className="flex-1 p-3 border border-gray-300 rounded-l-lg focus:ring-green-500 focus:border-green-500 text-gray-800"
                placeholder="Ask the Guru..."
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && !isLoading) {
                    sendMessageToGuru();
                  }
                }}
                disabled={isLoading}
              />
              <button
                className="px-6 py-3 bg-green-600 text-white rounded-r-lg font-bold hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={sendMessageToGuru}
                disabled={isLoading}
              >
                Ask
              </button>
            </div>
          </div>
        )}

        {mode === 'insights' && (
          <div className="bg-orange-50 p-6 rounded-lg shadow-md border border-orange-100 flex flex-col items-center">
            <h2 className="text-2xl font-bold text-orange-700 mb-6 text-center">Dating & Well-being Insights</h2>
            <p className="text-gray-700 mb-8 text-center max-w-2xl">
              Explore recent trends and statistics (2019-2025) on how the cost of living and dating culture impact financial stress and mental health in relationships.
            </p>

            <div className="w-full max-w-3xl bg-white p-4 rounded-lg shadow-md mb-8">
              <h3 className="text-xl font-semibold text-gray-800 mb-4 text-center">Financial Stress in Relationships (2025 Data)</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={financialStressData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" angle={-15} textAnchor="end" height={60} interval={0} tick={{fontSize: 12}} />
                  <YAxis unit="%" domain={[0, 100]} />
                  <Tooltip cursor={{ fill: 'transparent' }} formatter={(value) => `${value}%`} />
                  <Legend wrapperStyle={{ paddingTop: '20px' }} />
                  <Bar dataKey="value">
                    {financialStressData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
              <p className="text-sm text-gray-600 mt-4 text-center">
                *Data from LendingTree (Feb 2025) and Newsweek (May 2025). Percentages indicate the proportion of respondents agreeing with the statement.
              </p>
            </div>

            <div className="w-full max-w-3xl bg-white p-4 rounded-lg shadow-md mb-8">
              <h3 className="text-xl font-semibold text-gray-800 mb-4 text-center">Breakdown of Average Annual Relationship Costs (2025)</h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={relationshipCostBreakdown}
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                  >
                    {relationshipCostBreakdown.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => `$${value.toLocaleString()}`} />
                  <Legend wrapperStyle={{ paddingTop: '20px' }} />
                </PieChart>
              </ResponsiveContainer>
              <p className="text-sm text-gray-600 mt-4 text-center">
                *Based on average annual relationship costs of $6,138 (CouponPi survey, Jan 2025).
              </p>
            </div>

            <div className="w-full max-w-3xl bg-white p-4 rounded-lg shadow-md mb-8">
              <h3 className="text-xl font-semibold text-gray-800 mb-4 text-center">Estimated Average Date Cost Trend (2019-2025)</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={averageDateCostTrend} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="year" />
                  <YAxis unit="$" domain={[80, 180]} />
                  <Tooltip formatter={(value) => `$${value.toFixed(2)}`} />
                  <Legend wrapperStyle={{ paddingTop: '20px' }} />
                  <Line type="monotone" dataKey="cost" stroke="#8884d8" activeDot={{ r: 8 }} name="Avg. Date Cost" />
                </LineChart>
              </ResponsiveContainer>
              <p className="text-sm text-gray-600 mt-4 text-center">
                *Estimated trend based on reported average date costs of ~$100 in 2019 and ~$168 in 2025 (BMO Survey, Newsweek). This represents a general increase due to inflation and rising living costs.
              </p>
            </div>

            <div className="w-full max-w-3xl bg-white p-4 rounded-lg shadow-md mb-8">
              <h3 className="text-xl font-semibold text-gray-800 mb-4 text-center">Dating App Impact on Mental Health (Recent Data)</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={datingAppImpactData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" angle={-15} textAnchor="end" height={60} interval={0} tick={{fontSize: 12}} />
                  <YAxis unit="%" domain={[0, 100]} />
                  <Tooltip cursor={{ fill: 'transparent' }} formatter={(value) => `${value}%`} />
                  <Legend wrapperStyle={{ paddingTop: '20px' }} />
                  <Bar dataKey="value">
                    {datingAppImpactData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
              <p className="text-sm text-gray-600 mt-4 text-center">
                *Data from Psychiatric Times (May 2025), PMC (April 2025), Savanta (2021), and BMO Survey (Feb 2025). Percentages are approximate or represent reported figures.
              </p>
            </div>

            <p className="text-gray-700 text-center max-w-2xl mt-8">
              These insights highlight the growing financial pressures and mental health considerations within the modern dating landscape. Understanding these trends can help individuals navigate their romantic lives more mindfully.
            </p>
          </div>
        )}

        {mode === 'gender_insights' && (
          <div className="bg-blue-50 p-6 rounded-lg shadow-md border border-blue-100 flex flex-col items-center">
            <h2 className="text-2xl font-bold text-blue-700 mb-6 text-center">Dating Costs by Gender & Orientation</h2>
            <p className="text-gray-700 mb-8 text-center max-w-2xl">
              Explore how financial expectations and realities differ across various gender identities and sexual orientations in dating and relationships.
            </p>

            <div className="w-full max-w-3xl bg-white p-4 rounded-lg shadow-md mb-8">
              <h3 className="text-xl font-semibold text-gray-800 mb-4 text-center">Heterosexual Dating: Who Pays and Perceptions (2019-2025)</h3>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={heterosexualPaymentPerceptions} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="statement" angle={-30} textAnchor="end" height={80} interval={0} tick={{fontSize: 12}} />
                  <YAxis unit="%" domain={[0, 100]} />
                  <Tooltip cursor={{ fill: 'transparent' }} formatter={(value) => `${value}%`} />
                  <Legend wrapperStyle={{ paddingTop: '20px' }} />
                  <Bar dataKey="value">
                    {heterosexualPaymentPerceptions.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
              <p className="text-sm text-gray-600 mt-4 text-center">
                *Data primarily from ResearchGate (Mar 2025 & Dec 2021) and Self Financial (2024). Reflects reported behaviors and attitudes in heterosexual dating.
              </p>
            </div>

            <div className="w-full max-w-3xl bg-white p-4 rounded-lg shadow-md mb-8">
              <h3 className="text-xl font-semibold text-gray-800 mb-4 text-center">US Median Household Income by Married Couple Type (2025)</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={incomeByCoupleType} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="type" angle={-15} textAnchor="end" height={60} interval={0} tick={{fontSize: 12}} />
                  <YAxis unit="$" formatter={(value) => `$${(value / 1000).toFixed(0)}K`} />
                  <Tooltip cursor={{ fill: 'transparent' }} formatter={(value) => `$${value.toLocaleString()}`} />
                  <Legend wrapperStyle={{ paddingTop: '20px' }} />
                  <Bar dataKey="income">
                    {incomeByCoupleType.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
              <p className="text-sm text-gray-600 mt-4 text-center">
                *Data from Pew Research (June 2025). Shows median household income for married couples. Note that income dynamics can vary significantly within each group.
              </p>
            </div>

            <div className="w-full max-w-3xl bg-white p-4 rounded-lg shadow-md mb-8">
              <h3 className="text-xl font-semibold text-gray-800 mb-4 text-center">Staying in Relationships Due to Financial Constraints (2025)</h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={financialStayReasons}
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                  >
                    {financialStayReasons.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => `${value}%`} />
                  <Legend wrapperStyle={{ paddingTop: '20px' }} />
                </PieChart>
              </ResponsiveContainer>
              <p className="text-sm text-gray-600 mt-4 text-center">
                *Data from Newsweek (May 2025). Highlights the impact of financial pressures on relationship decisions.
              </p>
            </div>

            <p className="text-gray-700 text-center max-w-2xl mt-8">
              These charts and insights demonstrate the varied financial landscapes within dating and relationships, influenced by traditional gender roles, economic factors, and individual circumstances.
            </p>
          </div>
        )}

        {mode === 'personal_match' && (
          <div className="bg-yellow-50 p-6 rounded-lg shadow-md border border-yellow-100 flex flex-col items-center">
            <h2 className="text-2xl font-bold text-yellow-800 mb-6 text-center">Personal Match & Preferences</h2>
            <p className="text-gray-700 mb-8 text-center max-w-2xl">
              Enter your details and what you're looking for in a partner to see how you compare to averages and get a *simulated* estimate of potential matches in your chosen city.
              <br/><span className="font-semibold text-red-600">Disclaimer: These calculations are illustrative and based on general demographic assumptions, not precise real-time population data.</span>
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl">
              <div className="bg-white p-6 rounded-lg shadow-md border border-purple-100">
                <h3 className="text-xl font-bold text-purple-700 mb-4">Your Attributes</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-gray-700 text-sm font-bold mb-2">Your City:</label>
                    <div className="flex gap-2">
                      <select
                        className="w-full p-2 border border-gray-300 rounded-lg"
                        value={myCityOption === 'preset' ? myCity.id : 'other'}
                        onChange={e => {
                          if (e.target.value === 'other') {
                            setMyCityOption('other');
                          } else {
                            setMyCityOption('preset');
                            setMyCity(initialData.find(city => city.id === parseInt(e.target.value)));
                          }
                        }}
                      >
                        {initialData.map(city => (
                          <option key={city.id} value={city.id}>{city.city}, {city.country}</option>
                        ))}
                        <option value="other">Other (Type your own)</option>
                      </select>
                    </div>
                    {myCityOption === 'other' && (
                      <div className="mt-2 flex flex-col gap-2">
                        <input
                          type="text"
                          className="p-2 border border-gray-300 rounded-lg"
                          placeholder="Enter City Name"
                          value={myCustomCity}
                          onChange={e => setMyCustomCity(e.target.value)}
                        />
                        <input
                          type="text"
                          className="p-2 border border-gray-300 rounded-lg"
                          placeholder="Enter Country Name"
                          value={myCustomCountry}
                          onChange={e => setMyCustomCountry(e.target.value)}
                        />
                      </div>
                    )}
                  </div>
                  <div>
                    <label htmlFor="my-age" className="block text-gray-700 text-sm font-bold mb-2">Age:</label>
                    <input type="number" id="my-age" className="w-full p-2 border border-gray-300 rounded-lg" value={myAge} onChange={(e) => setMyAge(e.target.value)} placeholder="e.g., 30" />
                  </div>
                  <div>
                    <label htmlFor="my-height" className="block text-gray-700 text-sm font-bold mb-2">Height (cm):</label>
                    <input type="number" id="my-height" className="w-full p-2 border border-gray-300 rounded-lg" value={myHeightCm} onChange={(e) => setMyHeightCm(e.target.value)} placeholder="e.g., 175" />
                  </div>
                  <div>
                    <label htmlFor="my-weight" className="block text-gray-700 text-sm font-bold mb-2">Weight (kg):</label>
                    <input type="number" id="my-weight" className="w-full p-2 border border-gray-300 rounded-lg" value={myWeightKg} onChange={(e) => setMyWeightKg(e.target.value)} placeholder="e.g., 70" />
                  </div>
                  <div>
                    <label htmlFor="my-education" className="block text-gray-700 text-sm font-bold mb-2">Education:</label>
                    <select
                      id="my-education"
                      className="w-full p-2 border border-gray-300 rounded-lg"
                      value={myEducation}
                      onChange={(e) => setMyEducation(e.target.value)}
                    >
                      {EDUCATION_OPTIONS.map(option => <option key={option} value={option}>{option}</option>)}
                    </select>
                  </div>
                  <div>
                    <label htmlFor="my-occupation" className="block text-gray-700 text-sm font-bold mb-2">Occupation:</label>
                    <input type="text" id="my-occupation" className="w-full p-2 border border-gray-300 rounded-lg" value={myOccupation} onChange={(e) => setMyOccupation(e.target.value)} placeholder="e.g., Software Engineer" />
                  </div>
                  <div>
                    <label htmlFor="my-salary" className="block text-gray-700 text-sm font-bold mb-2">Monthly Salary ($):</label>
                    <input type="number" id="my-salary" className="w-full p-2 border border-gray-300 rounded-lg" value={mySalary} onChange={(e) => setMySalary(e.target.value)} placeholder="e.g., 4000" />
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-md border border-pink-100">
                <h3 className="text-xl font-bold text-pink-700 mb-4">Partner Preferences</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-gray-700 text-sm font-bold mb-2">Partner's City:</label>
                    <div className="flex gap-2">
                      <select
                        className="w-full p-2 border border-gray-300 rounded-lg"
                        value={partnerCityOption === 'preset' ? partnerCity.id : 'other'}
                        onChange={e => {
                          if (e.target.value === 'other') {
                            setPartnerCityOption('other');
                          } else {
                            setPartnerCityOption('preset');
                            setPartnerCity(initialData.find(city => city.id === parseInt(e.target.value)));
                          }
                        }}
                      >
                        {initialData.map(city => (
                          <option key={city.id} value={city.id}>{city.city}, {city.country}</option>
                        ))}
                        <option value="other">Other (Type your own)</option>
                      </select>
                    </div>
                    {partnerCityOption === 'other' && (
                      <div className="mt-2 flex flex-col gap-2">
                        <input
                          type="text"
                          className="p-2 border border-gray-300 rounded-lg"
                          placeholder="Enter City Name"
                          value={partnerCustomCity}
                          onChange={e => setPartnerCustomCity(e.target.value)}
                        />
                        <input
                          type="text"
                          className="p-2 border border-gray-300 rounded-lg"
                          placeholder="Enter Country Name"
                          value={partnerCustomCountry}
                          onChange={e => setPartnerCustomCountry(e.target.value)}
                        />
                      </div>
                    )}
                  </div>
                  <div className="flex space-x-2">
                    <div className="flex-1">
                      <label htmlFor="partner-min-age" className="block text-gray-700 text-sm font-bold mb-2">Min Age:</label>
                      <input type="number" id="partner-min-age" className="w-full p-2 border border-gray-300 rounded-lg" value={partnerMinAge} onChange={(e) => setPartnerMinAge(e.target.value)} placeholder="e.g., 25" />
                    </div>
                    <div className="flex-1">
                      <label htmlFor="partner-max-age" className="block text-gray-700 text-sm font-bold mb-2">Max Age:</label>
                      <input type="number" id="partner-max-age" className="w-full p-2 border border-gray-300 rounded-lg" value={partnerMaxAge} onChange={(e) => setPartnerMaxAge(e.target.value)} placeholder="e.g., 35" />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="partner-education" className="block text-gray-700 text-sm font-bold mb-2">Education:</label>
                    <select
                      id="partner-education"
                      className="w-full p-2 border border-gray-300 rounded-lg"
                      value={partnerEducation}
                      onChange={(e) => setPartnerEducation(e.target.value)}
                    >
                      <option value="Any">Any</option>
                      {EDUCATION_OPTIONS.map(option => <option key={option} value={option}>{option}</option>)}
                    </select>
                  </div>
                  <div className="flex space-x-2">
                    <div className="flex-1">
                      <label htmlFor="partner-min-salary" className="block text-gray-700 text-sm font-bold mb-2">Min Monthly Salary ($):</label>
                      <input type="number" id="partner-min-salary" className="w-full p-2 border border-gray-300 rounded-lg" value={partnerMinSalary} onChange={(e) => setPartnerMinSalary(e.target.value)} placeholder="e.g., 3000" />
                    </div>
                    <div className="flex-1">
                      <label htmlFor="partner-max-salary" className="block text-gray-700 text-sm font-bold mb-2">Max Monthly Salary ($):</label>
                      <input type="number" id="partner-max-salary" className="w-full p-2 border border-gray-300 rounded-lg" value={partnerMaxSalary} onChange={(e) => setPartnerMaxSalary(e.target.value)} placeholder="e.g., 6000" />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="partner-height-pref" className="block text-gray-700 text-sm font-bold mb-2">Height Preference:</label>
                    <select
                      id="partner-height-pref"
                      className="w-full p-2 border border-gray-300 rounded-lg"
                      value={partnerHeightPreference}
                      onChange={(e) => setPartnerHeightPreference(e.target.value)}
                    >
                      <option value="Any">Any</option>
                      <option value="Taller">Taller than me</option>
                      <option value="Shorter">Shorter than me</option>
                      <option value="Similar">Similar height to me</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="partner-weight-pref" className="block text-gray-700 text-sm font-bold mb-2">Weight Preference:</label>
                    <select
                      id="partner-weight-pref"
                      className="w-full p-2 border border-gray-300 rounded-lg"
                      value={partnerWeightPreference}
                      onChange={(e) => setPartnerWeightPreference(e.target.value)}
                    >
                      <option value="Any">Any</option>
                      <option value="Lighter">Lighter than me</option>
                      <option value="Heavier">Heavier than me</option>
                      <option value="Similar">Similar weight to me</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            <button
              className="mt-8 px-8 py-4 bg-green-600 text-white rounded-lg font-bold text-lg shadow-lg hover:bg-green-700 transition-colors"
              onClick={calculatePersonalMatch}
            >
              Calculate My Match!
            </button>

            {matchResult && (
              <div className="bg-white p-6 rounded-lg shadow-md border border-green-100 w-full max-w-4xl mt-8">
                <h3 className="text-xl font-bold text-green-700 mb-4 text-center">Your Personal Match Insights</h3>

                <div className="mb-6">
                  <h4 className="text-lg font-semibold text-gray-800 mb-2">How You Compare to Averages:</h4>
                  <ul className="list-disc list-inside text-gray-700 space-y-1">
                    {matchResult.comparison.height && <li>You are {matchResult.comparison.height}.</li>}
                    {matchResult.comparison.weight && <li>You are {matchResult.comparison.weight}.</li>}
                    {matchResult.comparison.salary && <li>Your salary is {matchResult.comparison.salary}.</li>}
                    {!matchResult.comparison.height && !matchResult.comparison.weight && !matchResult.comparison.salary && (
                      <li>Please fill in your attributes to see comparisons.</li>
                    )}
                  </ul>
                </div>

                <div>
                  <h4 className="text-lg font-semibold text-gray-800 mb-2">Estimated Matches in {matchResult.userCityName}:</h4>
                  <p className="text-gray-700 text-lg">
                    Based on your preferences, approximately <span className="font-bold text-green-600">{matchResult.estimatedMatches.toLocaleString()}</span> people in {matchResult.userCityName} might meet your criteria.
                  </p>
                  <p className="text-gray-600 text-sm mt-2">
                    (This is a simulated estimate with a match probability of {matchResult.matchProbability}% within a hypothetical population of {matchResult.userCityName}. Actual numbers may vary significantly.)
                  </p>
                  <p className="text-gray-600 text-sm mt-2">
                    Your city: {matchResult.userCityName}, {matchResult.userCountryName} | Partner's city: {matchResult.partnerCityName}, {matchResult.partnerCountryName}
                  </p>
                </div>
              </div>
            )}
          </div>
        )}

        <div className="mt-8 text-sm text-gray-500 text-center">
          <p>Data Year: 2024/2025 (where available), otherwise latest available.</p>
          <p>Sources: Numbeo, World Happiness Report, IMF World Economic Outlook, LendingTree, Newsweek, CouponPi, BMO Real Financial Progress Index, Psychiatric Times, PMC, Savanta, UT Health Austin, Pew Research, The Motley Fool, Self Financial, ResearchGate, and other cited sources.</p>
        </div>
      </div>
    </div>
  );
};

export default App; 