import React, { useEffect } from 'react';
import useNotificationStore from '../../store/notificationStore';

const NotificationModal = () => {
  const { isOpen, message, type, hideNotification } = useNotificationStore();

  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        hideNotification();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isOpen, hideNotification]);

  if (!isOpen) return null;

  const typeStyle = {
    success: 'bg-green-500',
    error: 'bg-red-500',
    info: 'bg-blue-500',
  };

  return (
    <div className={`fixed top-20 right-5 px-6 py-3 rounded shadow-lg text-white ${typeStyle[type] || 'bg-blue-500'}`}>
      {message}
    </div>
  );
};

export default NotificationModal;
