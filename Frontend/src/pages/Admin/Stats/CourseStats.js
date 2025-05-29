import axios from 'axios';

export const getCourseStats = async () => {
    try {
        const role = localStorage.getItem('role');
        let url = "http://localhost:5000/courses";

        // Nếu role là Business, lấy businessId và thêm vào query
        if (role === "Business") {
            const businessId = localStorage.getItem('businessId');
            if (!businessId) {
                throw new Error("Business ID not found");
            }
            url = `http://localhost:5000/courses/business/${businessId}`;
        }

        const response = await axios.get(url);
        let courses = [];

        if (role === "Business") {
            courses = response.data.courses || [];
        } else {
            courses = response.data || [];
        }

        return {
            total: courses.length
        };
    } catch (error) {
        console.error("Error fetching course stats:", error);
        return {
            total: 0
        };
    }
};
