
import { User, UserStatus } from '@models/user.model';
import mixpanel from 'mixpanel-browser';

export const setupAnalytics = (user: User) => {
    try {
        mixpanel.identify(user.email);
        mixpanel.people.set({
            'Plan': user.status === UserStatus.SUBSCRIBED ? "Subscribed" : "Unsubscribed",
            $name: user.name,
            $email: user.email,
        });
        mixpanel.register(transformUserForAnalytics(user))
    } catch (error) {
        // console.log(error, 'Mixpanel init error')
    }
}

export const pushEvent = (
    eventName: string,
    eventProperties?: { [key: string]: any }): void => {
    if (process.env.REACT_APP_NODE_ENV === "production") {
        mixpanel.track(
            eventName,
            {
                ...eventProperties,
                environment: process.env.REACT_APP_NODE_ENV
            },

        );
    }
}

export const transformUserForAnalytics = (user: User): { [key: string]: string | boolean | number } => {
    return {
        // num_tries: user.numTries,
        subscription_expiry_date: user.subscriptionExpiryDate ? user.subscriptionExpiryDate : "",
        email: user.email,
        user_id: user.id ? user.id : "",
        display_name: user.name ? user.name : "",
        status: user.status ? user.status : UserStatus.UNAUTHENTICATED,
    };
}