import axios from 'axios';

export const getTestStats = async () => {
    try {
        const response = await axios.get("http://localhost:5000/tests");
        return {
            total: response.data.length,
            activeTests: response.data.filter(test => test.isActive).length,
            completedTests: response.data.filter(test => !test.isActive).length
        };
    } catch (error) {
        console.error('Error fetching test stats:', error);
        return {
            total: 0,
            activeTests: 0,
            completedTests: 0
        };
    }
};
