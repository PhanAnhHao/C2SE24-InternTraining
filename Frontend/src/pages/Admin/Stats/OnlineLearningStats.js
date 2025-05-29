import axios from 'axios';

export const getOnlineLearningStats = async () => {
    try {
        const role = localStorage.getItem('role');
        let url = "http://localhost:5000/lessons";

        if (role === "Business") {
            const businessId = localStorage.getItem('businessId');
            if (!businessId) {
                return { total: 0 };
            }
            url = `http://localhost:5000/lessons/business/${businessId}`;
        }

        const response = await axios.get(url);
        const lessons = Array.isArray(response.data) ? response.data : [];

        return {
            total: lessons.length
        };
    } catch (error) {
        console.error("Error fetching online learning stats:", error);
        return { total: 0 };
    }
};
