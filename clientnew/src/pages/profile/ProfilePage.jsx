import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, 
  Mail, 
  School, 
  GraduationCap, 
  Phone, 
  Star, 
  Package, 
  ShoppingBag, 
  Tag, 
  Calendar, 
  ShieldCheck, 
  Edit3, 
  KeyRound, 
  Trash2, 
  Camera, 
  CheckCircle2, 
  AlertTriangle,
  Lock,
  Eye,
  EyeOff,
  LogOut,
  Sparkles,
  Palette
} from 'lucide-react';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Select from '../../components/common/Select';
import Modal from '../../components/common/Modal';
import { useThemeColor } from '../../context/ThemeColorContext';
import { uploadFileToFirebase } from '../../config/firebase';
import { 
  updateUserProfile, 
  updateUserAvatar, 
  changeUserPassword, 
  deleteUserAccount,
  logoutStudent 
} from '../../redux/slices/authSlice';
import { addToast } from '../../redux/slices/uiSlice';

export const ProfilePage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const { setIsThemeModalOpen, currentPalette } = useThemeColor();

  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'edit' | 'security' | 'danger'
  
  // Edit Profile Form State
  const [editForm, setEditForm] = useState({
    fullName: user?.fullName || '',
    phoneNumber: user?.phoneNumber || '',
    department: user?.department || '',
    semester: user?.semester || '',
    about: user?.about || '',
  });
  const [isUpdating, setIsUpdating] = useState(false);

  // Change Password State
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [showCurrentPass, setShowCurrentPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);
  const [isChangingPass, setIsChangingPass] = useState(false);

  // Avatar Modal State
  const [avatarModalOpen, setAvatarModalOpen] = useState(false);
  const [selectedAvatarUrl, setSelectedAvatarUrl] = useState(user?.avatar || '');

  // Delete Account Modal State
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deletePassword, setDeletePassword] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  const sampleAvatars = [
    'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=200&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&auto=format&fit=crop&q=80',
  ];

  const departmentsList = [
    { value: 'Computer Science & Engineering', label: 'Computer Science & Engineering (CSE)' },
    { value: 'Electronics & Communication', label: 'Electronics & Communication (ECE)' },
    { value: 'Mechanical Engineering', label: 'Mechanical Engineering (ME)' },
    { value: 'Electrical Engineering', label: 'Electrical Engineering (EE)' },
    { value: 'Civil Engineering', label: 'Civil Engineering (CE)' },
    { value: 'Information Technology', label: 'Information Technology (IT)' },
    { value: 'Biotechnology & Medical', label: 'Biotechnology / Medical' },
    { value: 'Business Administration (MBA/BBA)', label: 'Business Administration (MBA/BBA)' },
    { value: 'Basic Sciences & Humanities', label: 'Basic Sciences & Humanities' },
  ];

  const semestersList = [
    { value: '1st Semester (Freshman)', label: '1st Semester (Freshman)' },
    { value: '2nd Semester (Freshman)', label: '2nd Semester (Freshman)' },
    { value: '3rd Semester (Sophomore)', label: '3rd Semester (Sophomore)' },
    { value: '4th Semester (Sophomore)', label: '4th Semester (Sophomore)' },
    { value: '5th Semester (Junior)', label: '5th Semester (Junior)' },
    { value: '6th Semester (Junior)', label: '6th Semester (Junior)' },
    { value: '7th Semester (Senior)', label: '7th Semester (Senior)' },
    { value: '8th Semester (Graduating)', label: '8th Semester (Graduating)' },
    { value: 'Postgraduate / PhD', label: 'Postgraduate / PhD Scholar' },
  ];

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setIsUpdating(true);
    await dispatch(updateUserProfile(editForm));
    setIsUpdating(false);
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      dispatch(
        addToast({
          type: 'error',
          title: 'Mismatch',
          message: 'New passwords do not match.',
        })
      );
      return;
    }
    setIsChangingPass(true);
    const res = await dispatch(
      changeUserPassword({
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
      })
    );
    setIsChangingPass(false);
    if (changeUserPassword.fulfilled.match(res)) {
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setActiveTab('overview');
    }
  };

  const handleAvatarSave = async () => {
    if (selectedAvatarUrl) {
      await dispatch(updateUserAvatar(selectedAvatarUrl));
      setAvatarModalOpen(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!deletePassword) return;
    setIsDeleting(true);
    const res = await dispatch(deleteUserAccount(deletePassword));
    setIsDeleting(false);
    if (deleteUserAccount.fulfilled.match(res)) {
      setDeleteModalOpen(false);
      navigate('/');
    }
  };

  const handleLogout = async () => {
    await dispatch(logoutStudent());
    navigate('/');
  };

  const joinedDateFormatted = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString('en-US', {
        month: 'long',
        year: 'numeric',
      })
    : 'Recent Member';

  return (
    <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
      
      {/* Profile Header Banner Card */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-200/80 dark:border-dark-border text-left relative overflow-hidden"
      >
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
          
          {/* Avatar & Core Identity */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
            {/* Avatar with Camera Trigger */}
            <div className="relative group">
              <img
                src={user?.avatar || sampleAvatars[0]}
                alt={user?.fullName}
                className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl object-cover border-4 border-white dark:border-dark-card shadow-lg"
              />
              <button
                onClick={() => setAvatarModalOpen(true)}
                aria-label="Change photo"
                className="absolute inset-0 bg-slate-900/60 rounded-3xl flex flex-col items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-xs font-semibold text-xs gap-1"
              >
                <Camera className="w-5 h-5" />
                <span>Change</span>
              </button>
            </div>

            {/* Student Info */}
            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center gap-2.5">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white font-display">
                  {user?.fullName}
                </h1>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                  <ShieldCheck className="w-3.5 h-3.5" /> Verified Student
                </span>
              </div>

              <p className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <School className="w-4 h-4 text-brand-600 dark:text-brand-400" />
                <span>{user?.college}</span>
              </p>

              <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 dark:text-slate-400 pt-0.5">
                <span>{user?.department}</span>
                <span>•</span>
                <span>{user?.semester}</span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" /> Joined {joinedDateFormatted}
                </span>
              </div>
            </div>
          </div>

          {/* Quick Actions / Rating Box */}
          <div className="flex flex-row md:flex-col items-center md:items-end justify-between w-full md:w-auto gap-3 pt-4 md:pt-0 border-t md:border-t-0 border-slate-100 dark:border-dark-border">
            <div className="flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-900/60 text-amber-800 dark:text-amber-300">
              <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
              <div className="text-left">
                <p className="text-xs font-bold">{user?.rating || '5.0'} / 5.0</p>
                <p className="text-[10px] text-amber-600 dark:text-amber-400">{user?.totalRatings || 0} student ratings</p>
              </div>
            </div>

            <Button
              variant="ghost"
              size="sm"
              className="text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40"
              icon={LogOut}
              onClick={handleLogout}
            >
              Log Out
            </Button>
          </div>

        </div>
      </motion.div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="glass-card rounded-2xl p-5 text-left space-y-1">
          <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-950 text-amber-600 dark:text-amber-400 flex items-center justify-center mb-2">
            <Sparkles className="w-5 h-5" />
          </div>
          <span className="font-display font-black text-2xl sm:text-3xl text-slate-900 dark:text-white">
            {user?.creditPoints || 100} PTS
          </span>
          <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">{user?.creditTier || 'Bronze'} Tier Balance</p>
        </div>

        <div className="glass-card rounded-2xl p-5 text-left space-y-1">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-2">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <span className="font-display font-black text-2xl sm:text-3xl text-slate-900 dark:text-white">
            {user?.trustRatio || 100}%
          </span>
          <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">Campus Trust Ratio</p>
        </div>

        <div className="glass-card rounded-2xl p-5 text-left space-y-1">
          <div className="w-10 h-10 rounded-xl bg-brand-100 dark:bg-brand-950 text-brand-600 dark:text-brand-400 flex items-center justify-center mb-2">
            <Tag className="w-5 h-5" />
          </div>
          <span className="font-display font-black text-2xl sm:text-3xl text-slate-900 dark:text-white">
            {user?.itemsListed || 0} / {user?.itemsSold || 0}
          </span>
          <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">Listed / Sold</p>
        </div>

        <div className="glass-card rounded-2xl p-5 text-left space-y-1">
          <div className="w-10 h-10 rounded-xl bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-2">
            <Star className="w-5 h-5 fill-current" />
          </div>
          <span className="font-display font-black text-2xl sm:text-3xl text-slate-900 dark:text-white">
            {user?.buyerRating || '5.0'}★
          </span>
          <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">Buyer Care Score ({user?.totalBuyerRatings || 0})</p>
        </div>
      </div>

      {/* Main Tabbed Profile Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Sidebar Navigation */}
        <div className="lg:col-span-4 space-y-2 text-left">
          <button
            onClick={() => setActiveTab('overview')}
            className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl font-bold text-sm transition-all ${
              activeTab === 'overview'
                ? 'bg-brand-600 text-white shadow-md'
                : 'glass-card text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <User className="w-5 h-5" /> Overview & Bio
          </button>

          <button
            onClick={() => setActiveTab('edit')}
            className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl font-bold text-sm transition-all ${
              activeTab === 'edit'
                ? 'bg-brand-600 text-white shadow-md'
                : 'glass-card text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Edit3 className="w-5 h-5" /> Edit Profile Details
          </button>

          <button
            onClick={() => setActiveTab('security')}
            className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl font-bold text-sm transition-all ${
              activeTab === 'security'
                ? 'bg-brand-600 text-white shadow-md'
                : 'glass-card text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <KeyRound className="w-5 h-5" /> Password & Security
          </button>

          <button
            onClick={() => setActiveTab('danger')}
            className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl font-bold text-sm transition-all ${
              activeTab === 'danger'
                ? 'bg-rose-600 text-white shadow-md'
                : 'glass-card text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30'
            }`}
          >
            <Trash2 className="w-5 h-5" /> Danger Zone (Delete Account)
          </button>

          <button
            type="button"
            onClick={() => setIsThemeModalOpen(true)}
            className="w-full flex items-center justify-between px-4 py-3.5 rounded-2xl font-bold text-sm glass-card text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all border border-slate-200 dark:border-dark-border"
          >
            <span className="flex items-center gap-3">
              <Palette className="w-5 h-5 text-brand-600 dark:text-brand-400" />
              Theme Accent
            </span>
            <span
              className="w-3.5 h-3.5 rounded-full border border-white dark:border-slate-800 shadow-xs"
              style={{ backgroundColor: currentPalette.primaryColor }}
            />
          </button>
        </div>

        {/* Tab Content Panel */}
        <div className="lg:col-span-8">
          <div className="glass-card rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-dark-border text-left">
            
            {/* 1. Overview Tab */}
            {activeTab === 'overview' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                <div className="border-b border-slate-100 dark:border-dark-border pb-4">
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white font-display">
                    About Me & Academic Profile
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Your public bio visible to campus buyers and sellers.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-dark-card/60 border border-slate-200/60 dark:border-dark-border space-y-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Bio</h4>
                  <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                    {user?.about || 'No bio provided yet. Click "Edit Profile Details" to add a bio about what items you typically buy or sell.'}
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-4 rounded-2xl border border-slate-200/60 dark:border-dark-border space-y-1">
                    <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">Official College Email</p>
                    <p className="text-sm font-bold text-slate-900 dark:text-white">{user?.collegeEmail}</p>
                  </div>
                  <div className="p-4 rounded-2xl border border-slate-200/60 dark:border-dark-border space-y-1">
                    <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">Personal Email</p>
                    <p className="text-sm font-bold text-slate-900 dark:text-white">{user?.personalEmail}</p>
                  </div>
                  <div className="p-4 rounded-2xl border border-slate-200/60 dark:border-dark-border space-y-1">
                    <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">Contact Number</p>
                    <p className="text-sm font-bold text-slate-900 dark:text-white">{user?.phoneNumber}</p>
                  </div>
                  <div className="p-4 rounded-2xl border border-slate-200/60 dark:border-dark-border space-y-1">
                    <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">Student Roll / ID</p>
                    <p className="text-sm font-bold text-slate-900 dark:text-white">{user?.collegeId}</p>
                  </div>
                </div>
              </motion.div>
            )}

            {/* 2. Edit Profile Tab */}
            {activeTab === 'edit' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                <div className="border-b border-slate-100 dark:border-dark-border pb-4">
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white font-display">
                    Edit Profile Details
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Update your display name, contact phone, department, or about bio.
                  </p>
                </div>

                <form onSubmit={handleEditSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Input
                      label="Full Name"
                      value={editForm.fullName}
                      onChange={(e) => setEditForm({ ...editForm, fullName: e.target.value })}
                      required
                    />
                    <Input
                      label="Phone Number"
                      value={editForm.phoneNumber}
                      onChange={(e) => setEditForm({ ...editForm, phoneNumber: e.target.value })}
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Select
                      label="Academic Department"
                      options={departmentsList}
                      value={editForm.department}
                      onChange={(e) => setEditForm({ ...editForm, department: e.target.value })}
                      required
                    />
                    <Select
                      label="Current Semester"
                      options={semestersList}
                      value={editForm.semester}
                      onChange={(e) => setEditForm({ ...editForm, semester: e.target.value })}
                      required
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                      About Bio
                    </label>
                    <textarea
                      rows={4}
                      value={editForm.about}
                      onChange={(e) => setEditForm({ ...editForm, about: e.target.value })}
                      placeholder="Tell campus peers what you study, items you sell, or hobbies..."
                      className="block w-full rounded-2xl border border-slate-300 dark:border-dark-border bg-white dark:bg-dark-card/90 text-slate-900 dark:text-dark-text p-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
                    />
                  </div>

                  <Button
                    type="submit"
                    variant="gradient"
                    size="md"
                    isLoading={isUpdating}
                    className="font-bold"
                  >
                    Save Changes
                  </Button>
                </form>
              </motion.div>
            )}

            {/* 3. Password & Security Tab */}
            {activeTab === 'security' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                <div className="border-b border-slate-100 dark:border-dark-border pb-4">
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white font-display">
                    Change Account Password
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Verify your current password and choose a strong new password.
                  </p>
                </div>

                <form onSubmit={handlePasswordSubmit} className="space-y-5 max-w-md">
                  <Input
                    label="Current Password"
                    type={showCurrentPass ? 'text' : 'password'}
                    placeholder="••••••••"
                    required
                    value={passwordForm.currentPassword}
                    onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                    rightElement={
                      <button
                        type="button"
                        onClick={() => setShowCurrentPass(!showCurrentPass)}
                        className="text-slate-400 hover:text-slate-600"
                      >
                        {showCurrentPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    }
                  />

                  <Input
                    label="New Password"
                    type={showNewPass ? 'text' : 'password'}
                    placeholder="••••••••"
                    required
                    value={passwordForm.newPassword}
                    onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                    rightElement={
                      <button
                        type="button"
                        onClick={() => setShowNewPass(!showNewPass)}
                        className="text-slate-400 hover:text-slate-600"
                      >
                        {showNewPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    }
                  />

                  <Input
                    label="Confirm New Password"
                    type={showNewPass ? 'text' : 'password'}
                    placeholder="••••••••"
                    required
                    value={passwordForm.confirmPassword}
                    onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                  />

                  <Button
                    type="submit"
                    variant="gradient"
                    size="md"
                    isLoading={isChangingPass}
                    className="font-bold"
                  >
                    Update Password
                  </Button>
                </form>
              </motion.div>
            )}

            {/* 4. Danger Zone Tab */}
            {activeTab === 'danger' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                <div className="border-b border-rose-100 dark:border-rose-950/60 pb-4">
                  <h3 className="text-xl font-bold text-rose-600 dark:text-rose-400 font-display">
                    Delete Student Account
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Permanently delete your profile, listings, and trade history.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 text-xs text-rose-900 dark:text-rose-200 space-y-2">
                  <p className="font-bold flex items-center gap-1.5">
                    <AlertTriangle className="w-4 h-4 text-rose-600" /> Irreversible Action Warning
                  </p>
                  <p>
                    Deleting your account is permanent. All your listed items, message threads, ratings, and saved wishlists will be wiped immediately.
                  </p>
                </div>

                <Button
                  variant="danger"
                  size="md"
                  onClick={() => setDeleteModalOpen(true)}
                  icon={Trash2}
                  className="font-bold"
                >
                  Permanently Delete My Account
                </Button>
              </motion.div>
            )}

          </div>
        </div>

      </div>

      {/* Avatar Selection Modal */}
      <Modal
        isOpen={avatarModalOpen}
        onClose={() => setAvatarModalOpen(false)}
        title="Select Profile Avatar"
        subtitle="Choose from realistic student avatars or paste a custom image URL."
      >
        <div className="space-y-6 text-left">
          {/* Avatar grid */}
          <div className="grid grid-cols-3 gap-3">
            {sampleAvatars.map((url, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setSelectedAvatarUrl(url)}
                className={`relative aspect-square rounded-2xl overflow-hidden border-2 transition-all ${
                  selectedAvatarUrl === url
                    ? 'border-brand-500 ring-4 ring-brand-500/20 scale-95'
                    : 'border-transparent hover:scale-105'
                }`}
              >
                <img src={url} alt={`Avatar ${i}`} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>

          {/* Firebase Storage Upload Button */}
          <div className="pt-1">
            <label className="flex items-center justify-center gap-2 p-3 rounded-2xl border-2 border-dashed border-brand-400/50 hover:border-brand-500 bg-brand-50/50 dark:bg-brand-950/20 hover:bg-brand-50 text-brand-700 dark:text-brand-300 text-xs font-bold cursor-pointer transition-all">
              <Camera className="w-4 h-4" />
              <span>Upload Custom Photo to Firebase Cloud</span>
              <input
                type="file"
                accept="image/*"
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  try {
                    const downloadUrl = await uploadFileToFirebase(file, 'avatars');
                    setSelectedAvatarUrl(downloadUrl);
                  } catch (err) {
                    console.error('Avatar upload failed:', err);
                  }
                }}
                className="sr-only"
              />
            </label>
          </div>

          <Input
            label="Or Paste Custom Image URL"
            type="url"
            placeholder="https://images.unsplash.com/..."
            value={selectedAvatarUrl}
            onChange={(e) => setSelectedAvatarUrl(e.target.value)}
          />

          <div className="flex justify-end gap-3 pt-2">
            <Button variant="outline" size="sm" onClick={() => setAvatarModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" onClick={handleAvatarSave}>
              Apply Photo
            </Button>
          </div>
        </div>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        title="Confirm Account Deletion"
        subtitle="Please enter your password to confirm that you wish to delete your account."
      >
        <div className="space-y-5 text-left">
          <Input
            label="Your Password"
            type="password"
            placeholder="••••••••"
            value={deletePassword}
            onChange={(e) => setDeletePassword(e.target.value)}
            required
          />

          <div className="flex justify-end gap-3 pt-2">
            <Button variant="outline" size="sm" onClick={() => setDeleteModalOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="danger"
              size="sm"
              isLoading={isDeleting}
              onClick={handleDeleteAccount}
            >
              Confirm Deletion
            </Button>
          </div>
        </div>
      </Modal>

    </div>
  );
};

export default ProfilePage;
