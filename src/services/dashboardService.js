// src/services/dashboardService.js
import mockData from './mockData.js';

// In the future, this function will make an actual API call with axios
export const getDashboardData = async () => {
    console.log("Fetching dashboard data from mock service...");
    // We simulate a network delay
    await new Promise(resolve => setTimeout(resolve, 800));
    return mockData;
};