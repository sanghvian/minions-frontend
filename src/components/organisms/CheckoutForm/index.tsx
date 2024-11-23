import { DollarOutlined } from "@ant-design/icons";
import { setSubscriptionExpiryDate, setUserEmail } from "../../../redux/features/userSlice";
import { AppDispatch, RootState } from "@redux/store";
import { Button, Input, Space } from "antd";
import dayjs from "dayjs";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import Stripe from "stripe";
import { User } from "../../../models/user.model";
import { pushEvent } from "@utils/analytics";
import apiService from "@utils/api/api-service";

const CheckoutForm = () => {
    const user = useSelector((state: RootState) => state.persisted.user.value)
    const stripe = new Stripe(process.env.REACT_APP_STRIPE_SECRET_KEY || "", {
        apiVersion: '2023-08-16',
        // maxNetworkRetries: 1,
        // httpAgent: new ProxyAgent(process.env.http_proxy),
        timeout: 3000,
        // host: 'api.example.com',
        // port: 123,
        // telemetry: true,
    })
    const dispatch: AppDispatch = useDispatch();
    const checkoutWithStripe = async () => {
        try {
            const session = await stripe.checkout.sessions.create({
                customer_email: user.email,
                // submit_type: 'pay',
                billing_address_collection: 'required',
                shipping_address_collection: {
                    allowed_countries: ['US', 'CA', 'IN'],
                },
                line_items: [
                    {
                        // Provide the exact Price ID (for example, pr_1234) of the product you want to sell
                        price: process.env.REACT_APP_STRIPE_PRICE_ID,
                        quantity: 1,
                    },
                ],
                mode: 'subscription',
                success_url: `${process.env.REACT_APP_DOMAIN}?success=true`,
                cancel_url: `${process.env.REACT_APP_DOMAIN}?canceled=true`,
                automatic_tax: { enabled: true },
            });
            (window as any).location = session.url;
            toast.success('Payment successful!')
        } catch (error: any) {
            toast.error(error.message);
        }
    }
    return (
        <div style={{ width: '90%' }}>
            <Space.Compact style={{ width: '100%' }}>
                <Input
                    placeholder="Enter email address"
                    value={user.email}
                    width={50}
                    onChange={(e) => dispatch(setUserEmail(e.target.value))}
                />
                <Button icon={<DollarOutlined />} onClick={checkoutWithStripe} >
                    Subscribe for $25/month
                </Button>
            </Space.Compact>
        </div>
    )
};

export default function App() {
    const [message, setMessage] = useState("");
    const dispatch: AppDispatch = useDispatch();
    const user = useSelector((state: RootState) => state.persisted.user.value)

    useEffect(() => {
        // Check to see if this is a redirect back from Checkout
        const query = new URLSearchParams(window.location.search);

        if (query.get("success")) {
            setMessage("Order placed! You will receive an email confirmation.");
            const currentDate = dayjs()
            const subscriptionExpiryDate = currentDate.add(1, 'month').format('YYYY-MM-DD');
            dispatch(setSubscriptionExpiryDate(subscriptionExpiryDate))
            // Update user subscription date in firestore
            const updatedUser: User = {
                ...user,
                subscriptionExpiryDate
            };
            (async () => {
                await apiService.updateUser(user.email, user.id!, updatedUser, user.token);
            })()
            pushEvent('UserSubscriptionActivated', {
                planName: 'Basic',
                paymentFrequency: 'monthly',
                paymentMethod: 'stripe',
                paymentAmount: 5,
                subscriptionExpiryDate
            })

        }

        if (query.get("canceled")) {
            setMessage(
                "Order canceled -- continue to shop around and checkout when you're ready."
            );
        }
    }, [dispatch, user]);

    return message ? (
        <section>
            <p>{message}</p>
        </section>
    ) : (
        <CheckoutForm />
    );
}