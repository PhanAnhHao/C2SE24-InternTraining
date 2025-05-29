import axios from 'axios';

export const getAccountStats = async () => {
    try {
        const response = await axios.get("http://localhost:5000/api/accounts/all-accounts");
        const accounts = response.data;

        // Đếm số lượng account theo từng role
        const stats = accounts.reduce((acc, account) => {
            const role = account.role?.name?.toLowerCase();
            if (role === 'student') acc.students++;
            else if (role === 'business') acc.businesses++;
            else if (role === 'admin') acc.admins++;
            acc.total++;
            return acc;
        }, {
            total: 0,
            students: 0,
            businesses: 0,
            admins: 0
        });

        return stats;
    } catch (error) {
        console.error('Error fetching account stats:', error);
        return {
            total: 0,
            students: 0,
            businesses: 0,
            admins: 0
        };
    }
};
