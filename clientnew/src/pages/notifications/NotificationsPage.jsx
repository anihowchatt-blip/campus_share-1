import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { 
  Bell, 
  Tag, 
  MessageSquare, 
  CheckCircle2, 
  Star, 
  Megaphone, 
  Trash2, 
  Check, 
  Filter,
  CheckCheck
} from 'lucide-react';
import Button from '../../components/common/Button';
import { 
  fetchNotifications, 
  markNotificationRead, 
  markAllNotificationsRead, 
  deleteNotificationAction 
} from '../../redux/slices/notificationSlice';

export const NotificationsPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { notifications, unreadCount, isLoading } = useSelector((state) => state.notifications);

  const [filterType, setFilterType] = useState('all'); // 'all' | 'unread' | 'price_drop' | 'chat_message'

  useEffect(() => {
    dispatch(fetchNotifications());
  }, [dispatch]);

  const filtered = notifications.filter((n) => {
    if (filterType === 'unread') return !n.isRead;
    if (filterType !== 'all') return n.type === filterType;
    return true;
  });

  const handleNotificationClick = (notif) => {
    if (!notif.isRead) {
      dispatch(markNotificationRead(notif._id));
    }
    if (notif.link) {
      navigate(notif.link);
    }
  };

  const getIcon = (type) => {
    switch (type) {
      case 'price_drop':
        return <Tag className="w-5 h-5 text-emerald-500" />;
      case 'chat_message':
        return <MessageSquare className="w-5 h-5 text-brand-500" />;
      case 'item_sold':
        return <CheckCircle2 className="w-5 h-5 text-indigo-500" />;
      case 'review_received':
        return <Star className="w-5 h-5 text-amber-500 fill-amber-500" />;
      case 'campus_announcement':
        return <Megaphone className="w-5 h-5 text-purple-500" />;
      default:
        return <Bell className="w-5 h-5 text-brand-500" />;
    }
  };

  return (
    <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto space-y-8 text-left">
      
      {/* Header */}
      <div className="glass-card rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-dark-border flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white font-display">
              Notification Center
            </h1>
            {unreadCount > 0 && (
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-brand-600 text-white">
                {unreadCount} Unread
              </span>
            )}
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Real-time price drop alerts, message updates, and campus trade notifications.
          </p>
        </div>

        {unreadCount > 0 && (
          <Button
            variant="outline"
            size="sm"
            icon={CheckCheck}
            onClick={() => dispatch(markAllNotificationsRead())}
          >
            Mark all as read
          </Button>
        )}
      </div>

      {/* Filter Chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {[
          { id: 'all', label: 'All Alerts' },
          { id: 'unread', label: 'Unread Only' },
          { id: 'price_drop', label: 'Price Drops' },
          { id: 'chat_message', label: 'Messages' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setFilterType(tab.id)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              filterType === tab.id
                ? 'bg-brand-600 text-white shadow-soft'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Notifications List */}
      <div className="glass-card rounded-3xl overflow-hidden border border-slate-200/80 dark:border-dark-border divide-y divide-slate-100 dark:divide-dark-border">
        {filtered.length === 0 ? (
          <div className="p-12 text-center space-y-2">
            <Bell className="w-10 h-10 text-slate-300 dark:text-slate-600 mx-auto" />
            <h3 className="text-base font-bold text-slate-900 dark:text-white">No Notifications Found</h3>
            <p className="text-xs text-slate-500">You are completely up to date with your campus activity!</p>
          </div>
        ) : (
          filtered.map((n) => (
            <div
              key={n._id}
              onClick={() => handleNotificationClick(n)}
              className={`p-5 flex items-start justify-between gap-4 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors ${
                !n.isRead ? 'bg-brand-50/30 dark:bg-brand-950/20' : ''
              }`}
            >
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-2xl bg-slate-100 dark:bg-slate-800 flex-shrink-0 mt-0.5">
                  {getIcon(n.type)}
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-sm text-slate-900 dark:text-white">{n.title}</h4>
                    {!n.isRead && (
                      <span className="w-2 h-2 rounded-full bg-brand-500" />
                    )}
                  </div>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                    {n.message}
                  </p>
                  <span className="text-[10px] text-slate-400 block pt-1">
                    {new Date(n.createdAt).toLocaleString()}
                  </span>
                </div>
              </div>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  dispatch(deleteNotificationAction(n._id));
                }}
                className="p-2 rounded-xl text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                title="Delete notification"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))
        )}
      </div>

    </div>
  );
};

export default NotificationsPage;
