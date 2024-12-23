import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../css/Notifications.css'; // Import the CSS file
const apiUrl = import.meta.env.VITE_REACT_APP_API_URL;
const Notifications = () => {
    const [notifications, setNotifications] = useState([]);

    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                // Check for low stock products and add notifications
                await axios.post(`${apiUrl}/api/notifications/check-low-stock`);

                const response = await axios.get(`${apiUrl}/api/notifications`);
                setNotifications(response.data);
            } catch (error) {
                console.error('Error fetching notifications:', error);
            }
        };

        fetchNotifications();
    }, []);

    const deleteNotification = async (id) => {
        console.log(id);
        try {
            await axios.delete(`${apiUrl}/api/notifications/${id}`);
            // Filter out the deleted notification from the state
            setNotifications(notifications.filter((notification) => notification._id !== id));
        } catch (error) {
            console.error('Error deleting notification:', error.response ? error.response : error);
            alert('Error deleting notification');
        }
    };

    return (
        <div className="notifications-container">
            <h2 className="notifications-title">Notifications</h2>
            {notifications.length === 0 ? (
                <p>No notifications</p>
            ) : (
                <ul className="notifications-list">
                    {notifications.map((notification) => (
                        <li key={notification._id} className="notification-item">
                            <span className="notification-message">{notification.message}</span>
                            <button
                                className="delete-button"
                                onClick={() => deleteNotification(notification._id)}
                            >
                                Delete
                            </button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default Notifications;
