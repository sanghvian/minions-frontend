import dayjs from 'dayjs';
import { User, UserStatus } from "@models/user.model";
import toast from "react-hot-toast";
import { pushEvent } from './analytics';
import axios from 'axios'

export const checkUserEligibility = (user: User): UserStatus => {
    // pushEvent('UserTrialStarted');
    if (!user?.token?.length) {
        // User is authenticated
        return UserStatus.UNAUTHENTICATED;
    }
    // TODO PATCHFIX - Remove hardcoding user subscription once we move out of beta
    // If the user has more than 5 tries, check their subscription status
    else if (true) {
    // else if (user?.usageCount && user?.usageCount < 500) {
        // else if (true) {
        return UserStatus.SUBSCRIBED;
    }
    if (user.subscriptionExpiryDate) {
        // Parse the subscription expiry date string
        const expiryDate = dayjs(user.subscriptionExpiryDate);
        const currentDate = dayjs();

        // Check if the subscription is still active
        if (expiryDate.isAfter(currentDate)) {
            // User has an active subscription
            return UserStatus.SUBSCRIBED;
        } else {
            // Subscription has expired
            toast.error('Your subscription has expired. Please renew to continue using the app.');
            return UserStatus.UNSUBSCRIBED;
        }
    } else {
        // User does not have a subscription and has used the app more than 5 times
        toast.error('You have used the app 5 times for free. Please subscribe to continue using.');
        return UserStatus.UNSUBSCRIBED;
    }
};

function cleanAddress(address: string) {
    // Regex pattern to match the Plus Code part
    const pattern = /^[A-Z0-9]{4}\+[A-Z0-9]{2,3}\s/;

    // Remove the Plus Code part and return the cleaned address
    return address.replace(pattern, '');
}


export const getUserCurrentLocation = async (navigator: any): Promise<string> => {
    return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(async (position: any) => {
            const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${position.coords.latitude},${position.coords.longitude}&key=${process.env.REACT_APP_GCP_API_KEY}`;
            try {
                const response = await axios.get(url);
                if (response.data.plus_code && response.data.plus_code.compound_code) {
                    resolve(cleanAddress(response.data.plus_code.compound_code));
                } else {
                    resolve('');
                }
            } catch (error) {
                console.error('Error fetching address:', error);
                resolve(''); // Or reject(error) if you want to handle the error outside.
            }
        }, (error: any) => {
            console.error('Error getting location:', error);
            resolve(''); // Or reject(error) if you want to handle the error outside.
        });
    });
}
