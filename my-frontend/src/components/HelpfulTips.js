import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { CircularProgress } from '@mui/material';
import '../styles/HelpfulTips.css';

const HelpfulTips = ({ destination, fromDate, toDate }) => {
    // API keys
    const COUNTRY_API_KEY = process.env.REACT_APP_COUNTRY_API_KEY;
    const WEATHER_API_KEY = process.env.REACT_APP_WEATHER_API_KEY;

    // State variables
    const [loading, setLoading] = useState(true);
    const [currency, setCurrency] = useState(null);
    const [weatherData, setWeatherData] = useState(null);

    // Effect hook to fetch data
    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch weather data
                const weatherUrl = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${destination}/${fromDate}/${toDate}?key=${WEATHER_API_KEY}`;
                const weatherResponse = await axios.get(weatherUrl);

                console.log('Resolved Address:', weatherResponse.data.resolvedAddress);
                console.log('Destination:', destination);

                // Split resolved address by commas
                const resolvedParts = weatherResponse.data.resolvedAddress
                    .toLowerCase()
                    .split(',')
                    .map((part) => part.trim());

                // Check if resolved address contains only one part (likely a country)
                if (resolvedParts.length > 1) {
                    // Check if weather data is found and if any part of the resolved address matches any part of the destination
                    const destinationParts = destination.split(',').map((part) => part.trim().toLowerCase());
                    const match = destinationParts.some((part) => resolvedParts.includes(part));
                    if (match) {
                        setWeatherData(weatherResponse.data);
                    }
                }

                // Always fetch currency data regardless of weather data
                // Extract country name from weather data
                const { resolvedAddress } = weatherResponse.data;
                const addressParts = resolvedAddress.split(',');
                const countryName = addressParts[addressParts.length - 1].trim();
                const formattedCountry = countryName.replace(/\s/g, '-');

                // Fetch currency code using country name
                const currencyCode = await getCurrencyCode(formattedCountry);

                // Fetch currency exchange rates using currency code
                if (currencyCode) {
                    const currencyUrl = `https://v6.exchangerate-api.com/v6/2f1cb4da54518ebe578cfa09/pair/USD/${currencyCode}`;
                    const currencyResponse = await axios.get(currencyUrl);
                    const currencyString = `${currencyResponse.data.conversion_rate} ${currencyResponse.data.target_code}`;
                    setCurrency(currencyString);
                }
            } catch (error) {
                console.error('Error fetching data:', error);
                setLoading(false);
            } finally {
                setLoading(false); // Set loading to false after trying to fetch data
            }
        };

        fetchData();

        // Cleanup function
        return () => {};
    }, [fromDate, toDate, destination]);

    // Function to fetch currency code based on country name
    const getCurrencyCode = async (country) => {
        try {
            const countryResponse = await axios.get(`https://restfulcountries.com/api/v1/countries/${country}`, {
                headers: {
                    Accept: 'application/json',
                    Authorization: `Bearer ${COUNTRY_API_KEY}`,
                },
            });
            return countryResponse.data.data.currency;
        } catch (error) {
            console.error('Error fetching country code:', error);
            return null;
        }
    };

    // Mapping weather data
    const formattedWeatherData = weatherData?.days.map((day) => {
        const { datetime, tempmax, tempmin, icon } = day;
        return {
            date: datetime,
            maxTemperature: tempmax,
            minTemperature: tempmin,
            icon,
        };
    });

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        date.setDate(date.getDate() + 1);
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    };

    return (
        <>
            {currency && currency !== '1 USD' && (
                <div className="currency">
                    <strong>Currency Exchange Rate:</strong> {currency} (1 USD)
                </div>
            )}
            {loading ? (
                <CircularProgress />
            ) : (
                <div className="weather-slider">
                    {weatherData && (
                        <div className="weather-slider-inner">
                            {formattedWeatherData.map((day, index) => (
                                <div key={index} className="weather-card">
                                    <div>{formatDate(day.date)}</div>
                                    <div className="high-temp">{day.maxTemperature}°</div>
                                    {day.icon !== '' && ( // Check if icon is not an empty string
                                        <img src={require(`../weather-icons/${day.icon}.png`)} alt="Weather Icon" className="weather-icon" />
                                    )}
                                    <div className="low-temp">{day.minTemperature}°</div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </>
    );
};

export default HelpfulTips;
