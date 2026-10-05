import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { dataService } from '../services/dataService';
import { BootstrapAlert } from '../components/BootstrapAlert';
import { ReceiptModal } from '../components/ReceiptModal';
import { DocumentViewer } from '../components/DocumentViewer';
import { DashboardSidebarDrawer } from '../components/DashboardSidebarDrawer';

import { ManagerDashboard } from './ManagerDashboard';
import { AccountantDashboard } from './AccountantDashboard';
import { FinanceDashboard } from './FinanceDashboard';
import { StoreManagerDashboard } from './StoreManagerDashboard';
import { JanitorDashboard } from './JanitorDashboard';
import { HRDashboard } from './HRDashboard';
import {
  Users,
  Building2,
  CalendarCheck,
  Utensils,
  Briefcase,
  BellRing,
  Globe2,
  FileCheck2,
  Plus,
  Trash2,
  Edit,
  RotateCcw,
  Check,
  X,
  FileText,
  Eye,
  Layout,
  CheckSquare,
  Square,
  Sparkles,
  Download,
  Settings,
  MessageSquare,
  Upload,
  ImageIcon,
  Video,
  Share2,
  Star,
  CheckCircle2,
  FolderPlus,
  Layers,
  ShoppingBag
} from 'lucide-react';

export const MainRegistrarDashboard = () => {
  const { t } = useLanguage();
  const { currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState('users');
  const [alert, setAlert] = useState(null);

  // Data States
  const [users, setUsers] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [onlineOrders, setOnlineOrders] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [menuCategories, setMenuCategories] = useState([]);
  const [vacancies, setVacancies] = useState([]);
  const [applications, setApplications] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [siteSettings, setSiteSettings] = useState(null);
  const [bankAccounts, setBankAccounts] = useState([]);
  const [reports, setReports] = useState([]);
  const [customDashboards, setCustomDashboards] = useState([]);
  const [selectedDeptDashboard, setSelectedDeptDashboard] = useState('manager');

  // Modals & Active selections
  const [selectedReceiptReservation, setSelectedReceiptReservation] = useState(null);
  const [selectedApplicantDoc, setSelectedApplicantDoc] = useState(null);

  // User Creation Form with File Picker
  const [newFullName, setNewFullName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newRole, setNewRole] = useState('JANITOR');
  const [newGender, setNewGender] = useState('Female');
  const [newProfilePicUrl, setNewProfilePicUrl] = useState('');

  // Room Form & Editing State
  const [editingRoom, setEditingRoom] = useState(null);
  const [roomNum, setRoomNum] = useState('');
  const [roomBlock, setRoomBlock] = useState('Block A');
  const [roomFloor, setRoomFloor] = useState('1');
  const [roomType, setRoomType] = useState('Solo Room');
  const [roomPrice, setRoomPrice] = useState('2500');
  const [roomDiscount, setRoomDiscount] = useState('0');
  const [roomFeaturesText, setRoomFeaturesText] = useState('WiFi, Smart TV, Air Conditioner, Mini Bar');
  const [roomSpecialHighlights, setRoomSpecialHighlights] = useState('Free Airport Transfer & Complimentary Breakfast');
  const [roomDesc, setRoomDesc] = useState('');
  const [roomImageUrl, setRoomImageUrl] = useState('');

  // 1 & 2. Menu Item Form & Category Manager States
  const [editingMenuItem, setEditingMenuItem] = useState(null);
  const [menuTitle, setMenuTitle] = useState('');
  const [menuCategory, setMenuCategory] = useState('Meal');
  const [customCategoryInput, setCustomCategoryInput] = useState('');
  const [menuPrice, setMenuPrice] = useState('500');
  const [menuDiscountPercent, setMenuDiscountPercent] = useState('0');
  const [menuDesc, setMenuDesc] = useState('');
  const [menuImageUrl, setMenuImageUrl] = useState('');

  // Category Creation Form State
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newCategoryDesc, setNewCategoryDesc] = useState('');

  // Announcement & Event Media File Picker
  const [annTitle, setAnnTitle] = useState('');
  const [annContent, setAnnContent] = useState('');
  const [annCategory, setAnnCategory] = useState('GENERAL');
  const [annTargetRole, setAnnTargetRole] = useState('ALL');
  const [annMediaUrl, setAnnMediaUrl] = useState('');
  const [annMediaType, setAnnMediaType] = useState('NONE');

  // Vacancy Form
  const [vacTitle, setVacTitle] = useState('');
  const [vacDept, setVacDept] = useState('General');
  const [vacDesc, setVacDesc] = useState('');
  const [vacReq, setVacReq] = useState('');
  const [vacDeadline, setVacDeadline] = useState('2026-09-30');

  // Custom Dashboard Form with File Picker
  const [dashName, setDashName] = useState('');
  const [dashLogoUrl, setDashLogoUrl] = useState('');

  // Site Settings Form with All 7 Social Links & File Pickers
  const [editHotelName, setEditHotelName] = useState('');
  const [editLogoUrl, setEditLogoUrl] = useState('');
  const [editHeroBg, setEditHeroBg] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [editLocation, setEditLocation] = useState('');

  const [editFacebook, setEditFacebook] = useState('');
  const [editInstagram, setEditInstagram] = useState('');
  const [editTelegram, setEditTelegram] = useState('');
  const [editWhatsapp, setEditWhatsapp] = useState('');
  const [editLinkedin, setEditLinkedin] = useState('');
  const [editYoutube, setEditYoutube] = useState('');
  const [editTiktok, setEditTiktok] = useState('');

  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    const u = await dataService.getUsers(); setUsers(u);
    const r = await dataService.getRooms(); setRooms(r);
    const res = await dataService.getReservations(); setReservations(res);
    const ords = await dataService.getOnlineOrders(); setOnlineOrders(ords);
    const m = await dataService.getMenuItems(); setMenuItems(m);
    const cats = await dataService.getMenuCategories(); setMenuCategories(cats);
    const v = await dataService.getVacancies(); setVacancies(v);
    const a = await dataService.getApplications(); setApplications(a);
    const ann = await dataService.getAnnouncements(); setAnnouncements(ann);
    const s = await dataService.getSiteSettings(); setSiteSettings(s);
    const banks = await dataService.getBankAccounts(); setBankAccounts(banks);
    if (s) {
      setEditHotelName(s.hotel_name || '');
      setEditLogoUrl(s.logo_url || '');
      setEditHeroBg(s.hero_bg_url || '');
      setEditPhone(s.contact_phone || '');
      setEditEmail(s.contact_email || '');
      setEditLocation(s.location_address || '');
      setEditFacebook(s.social_facebook || '');
      setEditInstagram(s.social_instagram || '');
      setEditTelegram(s.social_telegram || '');
      setEditWhatsapp(s.social_whatsapp || '');
      setEditLinkedin(s.social_linkedin || '');
      setEditYoutube(s.social_youtube || '');
      setEditTiktok(s.social_tiktok || '');
    }
    const rep = await dataService.getReports(); setReports(rep);
    const cd = await dataService.getCustomDashboards(); setCustomDashboards(cd);
  };

  const handleSaveBankAccounts = async (e) => {
    e.preventDefault();
    await dataService.saveBankAccounts(bankAccounts);
    setAlert({ type: 'success', message: 'Bank Accounts configuration updated! Active banks will now appear in room reservation forms.' });
  };

  const handleUpdateBankField = (index, field, value) => {
    const updated = [...bankAccounts];
    updated[index] = { ...updated[index], [field]: value };
    setBankAccounts(updated);
  };

  const handleFilePicked = (e, setter, mediaTypeSetter) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setter(reader.result);
      if (mediaTypeSetter) {
        if (file.type.startsWith('video/')) mediaTypeSetter('VIDEO');
        else if (file.type.startsWith('image/')) mediaTypeSetter('IMAGE');
      }
    };
    reader.readAsDataURL(file);
  };

  // --- HANDLERS ---
  const handleCreateUser = async (e) => {
    e.preventDefault();
    const created = await dataService.createUser({
      full_name: newFullName,
      email: newEmail,
      phone: newPhone,
      role: newRole,
      gender: newGender,
      profile_image: newProfilePicUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80"
    });
    setAlert({
      type: 'success',
      message: `User created! Username: ${created.username} | Password PIN: ${created.default_password}`
    });
    setNewFullName('');
    setNewEmail('');
    setNewPhone('');
    setNewProfilePicUrl('');
    loadAllData();
  };

  const handleResetPassword = async (userId, username) => {
    const defaultPin = await dataService.resetUserPassword(userId);
    setAlert({
      type: 'info',
      message: `Password for ${username} reset back to default PIN: ${defaultPin}`
    });
    loadAllData();
  };

  const handleToggleUserStatus = async (user) => {
    const newStatus = user.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
    await dataService.updateUser(user.id, { status: newStatus });
    setAlert({ type: 'warning', message: `User ${user.username} status set to ${newStatus}.` });
    loadAllData();
  };

  const handleDeleteUser = async (id) => {
    await dataService.deleteUser(id);
    setAlert({ type: 'danger', message: 'User deleted from system.' });
    loadAllData();
  };

  const handleSaveRoom = async (e) => {
    e.preventDefault();
    const roomData = {
      id: editingRoom ? editingRoom.id : undefined,
      room_number: roomNum,
      block_name: roomBlock,
      floor_number: parseInt(roomFloor),
      room_type: roomType,
      price_per_night: parseFloat(roomPrice),
      discount_percentage: parseFloat(roomDiscount),
      features: roomFeaturesText,
      special_highlights: roomSpecialHighlights,
      description: roomDesc,
      image_url: roomImageUrl || (editingRoom ? editingRoom.image_url : "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&w=800&q=80")
    };
    await dataService.saveRoom(roomData);
    setAlert({ 
      type: 'success', 
      message: editingRoom ? `Room #${roomNum} updated!` : `Room #${roomNum} created successfully!` 
    });
    setEditingRoom(null);
    setRoomNum('');
    setRoomDesc('');
    setRoomImageUrl('');
    loadAllData();
  };

  const handleStartEditRoom = (room) => {
    setEditingRoom(room);
    setRoomNum(room.room_number);
    setRoomBlock(room.block_name || 'Block A');
    setRoomFloor((room.floor_number || 1).toString());
    setRoomType(room.room_type || 'Solo Room');
    setRoomPrice((room.price_per_night || 2500).toString());
    setRoomDiscount((room.discount_percentage || 0).toString());
    setRoomFeaturesText(Array.isArray(room.features) ? room.features.join(', ') : (room.features || 'WiFi, Smart TV'));
    setRoomSpecialHighlights(room.special_highlights || '');
    setRoomDesc(room.description || '');
    setRoomImageUrl(room.image_url || '');

    setTimeout(() => {
      document.getElementById('room-form')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 50);
  };

  const handleDeleteRoom = async (id) => {
    await dataService.deleteRoom(id);
    setAlert({ type: 'danger', message: 'Room removed from inventory.' });
    loadAllData();
  };

  const handleToggleRoomReservationMatrix = async (room) => {
    const updated = await dataService.toggleRoomReservation(room.id, !room.is_reserved);
    setAlert({
      type: 'info',
      message: `Room #${room.room_number} is now marked as ${updated.is_reserved ? 'RESERVED' : 'UNRESERVED / FREE'}.`
    });
    loadAllData();
  };

  // 1 & 2. Create & Save Custom Menu Category
  const handleCreateMenuCategory = async (e) => {
    e.preventDefault();
    if (!newCategoryName.trim()) return;
    const cat = await dataService.saveMenuCategory({
      name: newCategoryName.trim(),
      description: newCategoryDesc
    });
    setAlert({ type: 'success', message: `Custom Menu Category "${cat.name}" created and saved to database!` });
    setNewCategoryName('');
    setNewCategoryDesc('');
    loadAllData();
  };

  const handleDeleteMenuCategory = async (id, catName) => {
    await dataService.deleteMenuCategory(id);
    setAlert({ type: 'warning', message: `Category "${catName}" removed.` });
    loadAllData();
  };

  const handleSaveMenuItem = async (e) => {
    e.preventDefault();
    const targetCategory = menuCategory === 'NEW_CUSTOM' ? customCategoryInput.trim() : menuCategory;
    if (!targetCategory) {
      setAlert({ type: 'warning', message: 'Please specify a menu category.' });
      return;
    }

    // Save custom category to DB if new
    if (menuCategory === 'NEW_CUSTOM' && customCategoryInput.trim()) {
      await dataService.saveMenuCategory({ name: customCategoryInput.trim() });
    }

    const itemData = {
      id: editingMenuItem ? editingMenuItem.id : undefined,
      title: menuTitle,
      category: targetCategory,
      price: parseFloat(menuPrice),
      discount_percentage: parseFloat(menuDiscountPercent),
      description: menuDesc,
      image_url: menuImageUrl || "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80"
    };
    await dataService.saveMenuItem(itemData);
    setAlert({ 
      type: 'success', 
      message: editingMenuItem 
        ? `Menu item "${menuTitle}" updated under category "${targetCategory}"!` 
        : `Menu item "${menuTitle}" added under category "${targetCategory}".` 
    });
    setEditingMenuItem(null);
    setMenuTitle('');
    setMenuDesc('');
    setMenuDiscountPercent('0');
    setMenuImageUrl('');
    setCustomCategoryInput('');
    loadAllData();
  };

  const handleStartEditMenuItem = (item) => {
    setEditingMenuItem(item);
    setMenuTitle(item.title);
    setMenuCategory(item.category);
    setMenuPrice(item.price.toString());
    setMenuDiscountPercent(item.discount_percentage ? item.discount_percentage.toString() : '0');
    setMenuDesc(item.description || '');
    setMenuImageUrl(item.image_url || '');

    setTimeout(() => {
      document.getElementById('menu-form')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 50);
  };

  const handlePostAnnouncement = async (e) => {
    e.preventDefault();
    await dataService.createAnnouncement({
      title: annTitle,
      content: annContent,
      category: annCategory,
      target_role: annTargetRole,
      media_url: annMediaUrl,
      media_type: annMediaType,
      posted_by: `Main Registrar Admin (${currentUser?.full_name})`
    });
    setAlert({ type: 'success', message: `Announcement/Event "${annTitle}" posted successfully!` });
    setAnnTitle('');
    setAnnContent('');
    setAnnMediaUrl('');
    loadAllData();
  };

  const handleCreateVacancy = async (e) => {
    e.preventDefault();
    await dataService.saveVacancy({
      title: vacTitle,
      department: vacDept,
      description: vacDesc,
      requirements: vacReq,
      application_deadline: vacDeadline,
      expiry_date: vacDeadline
    });
    setAlert({ type: 'success', message: `Vacancy "${vacTitle}" posted.` });
    setVacTitle('');
    setVacDesc('');
    setVacReq('');
    loadAllData();
  };

  const handleCreateCustomDashboard = async (e) => {
    e.preventDefault();
    await dataService.createCustomDashboard({
      dashboard_name: dashName,
      logo_url: dashLogoUrl || '/logo.svg'
    });
    setAlert({ type: 'success', message: `New Dashboard "${dashName}" created and logo saved!` });
    setDashName('');
    setDashLogoUrl('');
    loadAllData();
  };

  const handleSaveSettings = async (e) => {
    e.preventDefault();
    await dataService.updateSiteSettings({
      ...siteSettings,
      hotel_name: editHotelName,
      logo_url: editLogoUrl,
      hero_bg_url: editHeroBg,
      contact_phone: editPhone,
      contact_email: editEmail,
      location_address: editLocation,
      social_facebook: editFacebook,
      social_instagram: editInstagram,
      social_telegram: editTelegram,
      social_whatsapp: editWhatsapp,
      social_linkedin: editLinkedin,
      social_youtube: editYoutube,
      social_tiktok: editTiktok
    });
    setAlert({ type: 'success', message: 'Website settings, logo, background images, and social media brand links updated!' });
    loadAllData();
  };

  const handleApplicantStatusUpdate = async (appId, statusFields) => {
    await dataService.updateApplicationResult(appId, statusFields);
    setAlert({ type: 'success', message: 'Applicant status and exam results updated.' });
    setSelectedApplicantDoc(null);
    loadAllData();
  };

  const totalRooms = rooms.length;
  const reservedRoomsCount = rooms.filter(r => r.is_reserved).length;
  const unreservedRoomsCount = totalRooms - reservedRoomsCount;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      
      {/* Header Banner */}
      <div className="glass-card p-6 sm:p-8 bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 text-white flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <span className="px-3 py-1 rounded-full bg-amber-600 text-white font-extrabold text-xs tracking-wider uppercase">
            Super Admin Control Center
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight mt-2">
            {t('mainRegistrarDash')}
          </h1>
          <p className="text-xs text-slate-300">
            Welcome, {currentUser?.full_name} ({currentUser?.username})
          </p>
        </div>

        {/* Dynamic Counters Card */}
        <div className="flex items-center gap-3 bg-white/10 p-3 rounded-xl border border-white/20 text-xs">
          <div className="text-center px-3 border-r border-white/20">
            <span className="text-slate-300 font-bold block">Total Rooms</span>
            <span className="text-lg font-black text-amber-400">{totalRooms}</span>
          </div>
          <div className="text-center px-3 border-r border-white/20">
            <span className="text-slate-300 font-bold block">Reserved</span>
            <span className="text-lg font-black text-red-400">{reservedRoomsCount}</span>
          </div>
          <div className="text-center px-3">
            <span className="text-slate-300 font-bold block">Available / Free</span>
            <span className="text-lg font-black text-emerald-400">{unreservedRoomsCount}</span>
          </div>
        </div>
      </div>

      {alert && <BootstrapAlert type={alert.type} message={alert.message} onClose={() => setAlert(null)} />}

      {/* Left-Side Mobile Slide Drawer & Desktop Responsive Navigation Bar */}
      <DashboardSidebarDrawer
        tabs={[
          { id: 'users', label: t('userMgmt'), icon: <Users className="w-4 h-4" /> },
          { id: 'rooms', label: `${t('roomMgmt')} & Matrix`, icon: <Building2 className="w-4 h-4" /> },
          { id: 'bookings', label: `${t('bookingReview')} & Receipts`, icon: <CalendarCheck className="w-4 h-4" /> },
          { id: 'orders', label: 'Online Food & Item Orders', icon: <ShoppingBag className="w-4 h-4" /> },
          { id: 'menu', label: `${t('menuMgmt')} & Categories`, icon: <Utensils className="w-4 h-4" /> },
          { id: 'announcements', label: 'Events & Media', icon: <BellRing className="w-4 h-4" /> },
          { id: 'vacancies', label: t('vacancyMgmt'), icon: <Briefcase className="w-4 h-4" /> },
          { id: 'all_dashboards', label: 'All Department Dashboards', icon: <Layers className="w-4 h-4" /> },
          { id: 'dashboards', label: 'Create Custom Dashboards', icon: <Layout className="w-4 h-4" /> },
          { id: 'settings', label: 'Site & Social Settings', icon: <Settings className="w-4 h-4" /> },
          { id: 'reports', label: 'Reports & Feedback', icon: <MessageSquare className="w-4 h-4" /> }
        ]}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        title="Main Registrar Control Center"
      />

      {/* TAB 1: USER MANAGEMENT */}
      {activeTab === 'users' && (
        <div className="space-y-8" id="tab-content-users">
          <div className="glass-card p-6 space-y-4">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Plus className="w-5 h-5 text-amber-500" />
              <span>Create New User / Staff Role</span>
            </h3>

            <form onSubmit={handleCreateUser} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  value={newFullName}
                  onChange={(e) => setNewFullName(e.target.value)}
                  className="form-input text-xs"
                  placeholder="e.g. Almaz Tadesse"
                />
              </div>
              <div>
                <label className="block text-xs font-bold mb-1">Role *</label>
                <select value={newRole} onChange={(e) => setNewRole(e.target.value)} className="form-input text-xs font-bold">
                  <option value="MAIN_REGISTRAR">Main Registrar Admin (MR/id/yr)</option>
                  <option value="MANAGER">Hotel Manager (MG/id/yr)</option>
                  <option value="ACCOUNTANT">Accountant (AC/id/yr)</option>
                  <option value="FINANCE">Finance (FN/id/yr)</option>
                  <option value="STORE_MANAGER">Store Manager (SM/id/yr)</option>
                  <option value="JANITOR">Janitor (JN/id/yr)</option>
                  <option value="COOK">Cook / Chef (CK/id/yr)</option>
                  <option value="GUARDIAN">Guardian (GD/id/yr)</option>
                  <option value="HR">HR Officer (HR/id/yr)</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold mb-1">Gender *</label>
                <select value={newGender} onChange={(e) => setNewGender(e.target.value)} className="form-input text-xs font-bold">
                  <option value="Female">Female</option>
                  <option value="Male">Male</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold mb-1">Phone Number</label>
                <input
                  type="tel"
                  value={newPhone}
                  onChange={(e) => setNewPhone(e.target.value)}
                  className="form-input text-xs"
                  placeholder="+251 9..."
                />
              </div>

              <div>
                <label className="block text-xs font-bold mb-1">Profile Photo (Pick from Directory)</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFilePicked(e, setNewProfilePicUrl)}
                  className="form-input text-xs"
                />
              </div>

              <div className="flex items-end">
                <button type="submit" className="btn-pattern-gold w-full py-2.5 text-xs font-bold">
                  Generate Username & Password
                </button>
              </div>
            </form>
          </div>

          <div className="glass-card overflow-x-auto p-4">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b bg-slate-100 dark:bg-slate-900/60">
                  <th className="p-3">Photo</th>
                  <th className="p-3">Username ID</th>
                  <th className="p-3">Full Name</th>
                  <th className="p-3">Role</th>
                  <th className="p-3">Gender</th>
                  <th className="p-3">Default PIN</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {users.map((u) => (
                  <tr key={u.id}>
                    <td className="p-3">
                      <img src={u.profile_image} alt="Avatar" className="w-8 h-8 rounded-full object-cover border" />
                    </td>
                    <td className="p-3 font-mono font-bold text-amber-600">{u.username}</td>
                    <td className="p-3 font-semibold">{u.full_name}</td>
                    <td className="p-3">{u.role}</td>
                    <td className="p-3">{u.gender || 'Female'}</td>
                    <td className="p-3 font-mono">{u.default_password || '1234'}</td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded font-bold text-[10px] ${
                        u.status === 'ACTIVE' ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {u.status}
                      </span>
                    </td>
                    <td className="p-3 text-right space-x-1">
                      <button onClick={() => handleResetPassword(u.id, u.username)} className="px-2 py-1 bg-amber-600 text-white rounded text-[11px] font-bold">Reset Pass</button>
                      <button onClick={() => handleToggleUserStatus(u)} className="px-2 py-1 bg-blue-600 text-white rounded text-[11px] font-bold">{u.status === 'ACTIVE' ? 'Disable' : 'Enable'}</button>
                      <button onClick={() => handleDeleteUser(u.id)} className="p-1 bg-red-600 text-white rounded"><Trash2 className="w-3.5 h-3.5" /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: ROOM MANAGEMENT & MATRIX */}
      {activeTab === 'rooms' && (
        <div className="space-y-8" id="tab-content-rooms">
          <div className="glass-card p-6 space-y-4" id="room-form">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Plus className="w-5 h-5 text-amber-500" />
                <span>{editingRoom ? `Edit Room #${editingRoom.room_number}` : 'Post Guest Room Details'}</span>
              </span>
              {editingRoom && (
                <button
                  type="button"
                  onClick={() => {
                    setEditingRoom(null);
                    setRoomNum('');
                    setRoomDesc('');
                    setRoomImageUrl('');
                  }}
                  className="px-3 py-1 bg-slate-200 text-slate-800 text-xs font-bold rounded"
                >
                  Cancel Edit
                </button>
              )}
            </h3>

            <form onSubmit={handleSaveRoom} className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              <div>
                <label className="block text-xs font-bold mb-1">Room Number *</label>
                <input type="text" required value={roomNum} onChange={(e) => setRoomNum(e.target.value)} className="form-input text-xs" placeholder="e.g. 405" />
              </div>
              <div>
                <label className="block text-xs font-bold mb-1">Block Name</label>
                <input type="text" value={roomBlock} onChange={(e) => setRoomBlock(e.target.value)} className="form-input text-xs" placeholder="Block B" />
              </div>
              <div>
                <label className="block text-xs font-bold mb-1">Floor Number</label>
                <input type="number" value={roomFloor} onChange={(e) => setRoomFloor(e.target.value)} className="form-input text-xs" />
              </div>
              <div>
                <label className="block text-xs font-bold mb-1">Room Type</label>
                <select value={roomType} onChange={(e) => setRoomType(e.target.value)} className="form-input text-xs font-bold">
                  <option value="Solo Room">Solo Room</option>
                  <option value="Family Room">Family Room</option>
                  <option value="Business Class">Business Class</option>
                  <option value="Economy Class">Economy Class</option>
                  <option value="VIP Room">VIP Room</option>
                  <option value="Private Room">Private Room</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold mb-1">Regular Price (ETB)</label>
                <input type="number" value={roomPrice} onChange={(e) => setRoomPrice(e.target.value)} className="form-input text-xs" />
              </div>
              <div>
                <label className="block text-xs font-bold mb-1">Discount (%)</label>
                <input type="number" value={roomDiscount} onChange={(e) => setRoomDiscount(e.target.value)} className="form-input text-xs" />
              </div>

              <div className="col-span-1 sm:col-span-2">
                <label className="block text-xs font-bold mb-1">Room Features (Comma-separated)</label>
                <input type="text" value={roomFeaturesText} onChange={(e) => setRoomFeaturesText(e.target.value)} className="form-input text-xs" placeholder="WiFi, Jacuzzi, Balcony" />
              </div>

              <div className="col-span-1 sm:col-span-2">
                <label className="block text-xs font-bold mb-1 text-amber-600 dark:text-amber-400">
                  Special Highlights / Unique Amenities *
                </label>
                <input type="text" value={roomSpecialHighlights} onChange={(e) => setRoomSpecialHighlights(e.target.value)} className="form-input text-xs font-semibold" placeholder="Complimentary Airport Transfer" />
              </div>

              <div className="col-span-1 sm:col-span-2">
                <label className="block text-xs font-bold mb-1">Room Photo (Pick from Directory)</label>
                <input type="file" accept="image/*" onChange={(e) => handleFilePicked(e, setRoomImageUrl)} className="form-input text-xs" />
              </div>

              <div className="col-span-1 sm:col-span-3 lg:col-span-4">
                <label className="block text-xs font-bold mb-1">Room Description</label>
                <textarea rows="2" value={roomDesc} onChange={(e) => setRoomDesc(e.target.value)} className="form-input text-xs" placeholder="Detailed room overview..."></textarea>
              </div>

              <div className="flex items-end col-span-1 sm:col-span-3 lg:col-span-4">
                <button type="submit" className="btn-pattern-gold w-full py-2.5 text-xs font-bold">
                  {editingRoom ? 'Update Room Post' : 'Post New Guest Room'}
                </button>
              </div>
            </form>
          </div>

          <div className="glass-card p-4 overflow-x-auto">
            <h4 className="text-sm font-bold mb-3 text-slate-900 dark:text-white">Active Rooms Inventory</h4>
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b bg-slate-100 dark:bg-slate-900/60">
                  <th className="p-3">Photo</th>
                  <th className="p-3">Room No</th>
                  <th className="p-3">Type</th>
                  <th className="p-3">Price / Discount</th>
                  <th className="p-3">Special Highlights</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {rooms.map((r) => (
                  <tr key={r.id}>
                    <td className="p-3">
                      <img src={r.image_url} alt="Room" className="w-10 h-10 rounded-lg object-cover border" />
                    </td>
                    <td className="p-3 font-bold text-amber-600">#{r.room_number}</td>
                    <td className="p-3">{r.room_type} ({r.block_name})</td>
                    <td className="p-3 font-semibold">
                      {r.price_per_night} ETB <span className="text-red-600 font-bold">({r.discount_percentage || 0}% OFF)</span>
                    </td>
                    <td className="p-3 text-amber-700 font-medium">{r.special_highlights || 'Standard'}</td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${r.is_reserved ? 'bg-red-100 text-red-800' : 'bg-emerald-100 text-emerald-800'}`}>
                        {r.is_reserved ? 'Reserved' : 'Available'}
                      </span>
                    </td>
                    <td className="p-3 text-right space-x-1">
                      <button onClick={() => handleStartEditRoom(r)} className="px-2.5 py-1 bg-amber-600 text-white rounded text-[11px] font-bold inline-flex items-center gap-1">
                        <Edit className="w-3 h-3" /> Edit
                      </button>
                      <button onClick={() => handleDeleteRoom(r.id)} className="p-1 bg-red-600 text-white rounded"><Trash2 className="w-3.5 h-3.5" /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: RESERVATIONS & RECEIPT GENERATOR */}
      {activeTab === 'bookings' && (
        <div className="glass-card p-6 space-y-4" id="tab-content-bookings">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">Customer Room Reservations & Invoice Receipts</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b bg-slate-100 dark:bg-slate-900/60">
                  <th className="p-3">Booking Code</th>
                  <th className="p-3">Guest Name</th>
                  <th className="p-3">Room Type / No</th>
                  <th className="p-3">Total Paid</th>
                  <th className="p-3">Payment Bank</th>
                  <th className="p-3 text-right">Generate Receipt</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {reservations.map((res) => (
                  <tr key={res.id}>
                    <td className="p-3 font-mono font-bold text-amber-600">{res.booking_code}</td>
                    <td className="p-3 font-semibold">{res.customer_name}</td>
                    <td className="p-3">{res.room_type} (#{res.room_number})</td>
                    <td className="p-3 font-bold text-emerald-600">{res.total_amount?.toLocaleString()} ETB</td>
                    <td className="p-3">{res.payment_bank}</td>
                    <td className="p-3 text-right">
                      <button onClick={() => setSelectedReceiptReservation(res)} className="btn-pattern-primary px-3 py-1.5 text-[11px] font-bold">
                        <FileText className="w-3.5 h-3.5" /> Print / PDF Receipt
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3B: ONLINE FOOD & ITEM ORDERS */}
      {activeTab === 'orders' && (
        <div className="glass-card p-6 space-y-4" id="tab-content-orders">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-800 pb-3">
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-amber-500" />
                <span>Online Food & Item Orders Management</span>
              </h3>
              <p className="text-xs text-slate-500">Review online customer food orders, payment receipts, delivery locations, and update fulfillment status.</p>
            </div>
            <span className="px-3 py-1 bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 font-bold text-xs rounded-full border border-amber-300 dark:border-amber-700">
              {onlineOrders.filter(o => o.status === 'PENDING').length} Pending Orders
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b bg-slate-100 dark:bg-slate-900/60">
                  <th className="p-3">Order Code</th>
                  <th className="p-3">Customer Contact</th>
                  <th className="p-3">Item & Qty</th>
                  <th className="p-3">Total Paid</th>
                  <th className="p-3">Payment Bank</th>
                  <th className="p-3">Delivery Spot / Notes</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right">Actions / Invoice</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {onlineOrders.map((ord) => (
                  <tr key={ord.id}>
                    <td className="p-3 font-mono font-bold text-amber-600">{ord.order_code}</td>
                    <td className="p-3">
                      <div className="font-semibold text-slate-900 dark:text-white">{ord.customer_name}</div>
                      <div className="text-[11px] text-slate-500">{ord.phone || ord.customer_phone}</div>
                      <div className="text-[10px] text-slate-400">{ord.email || ord.customer_email}</div>
                    </td>
                    <td className="p-3">
                      <span className="font-bold text-blue-600 dark:text-blue-400">{ord.item_title}</span>
                      <span className="ml-1 text-slate-500 font-extrabold">x {ord.quantity || 1}</span>
                      <div className="text-[10px] text-slate-400">{ord.item_category || 'Meal'}</div>
                    </td>
                    <td className="p-3 font-bold text-emerald-600">{(ord.total_amount || 0).toLocaleString()} ETB</td>
                    <td className="p-3">{ord.payment_bank || 'Bank Transfer'}</td>
                    <td className="p-3">
                      <div className="font-semibold text-amber-700 dark:text-amber-300">{ord.delivery_location || 'Standard'}</div>
                      {ord.order_notes && <div className="text-[10px] text-slate-500 italic">"{ord.order_notes}"</div>}
                    </td>
                    <td className="p-3">
                      <select
                        value={ord.status || 'PENDING'}
                        onChange={async (e) => {
                          const newStatus = e.target.value;
                          await dataService.updateOnlineOrderStatus(ord.id, newStatus);
                          setAlert({ type: 'success', message: `Order ${ord.order_code} status updated to ${newStatus}` });
                          loadAllData();
                        }}
                        className={`text-[11px] font-extrabold px-2.5 py-1 rounded-lg border ${
                          ord.status === 'CONFIRMED' ? 'bg-blue-100 text-blue-800 border-blue-300' :
                          ord.status === 'COMPLETED' ? 'bg-emerald-100 text-emerald-800 border-emerald-300' :
                          ord.status === 'CANCELLED' ? 'bg-red-100 text-red-800 border-red-300' :
                          'bg-amber-100 text-amber-800 border-amber-300'
                        }`}
                      >
                        <option value="PENDING">PENDING</option>
                        <option value="CONFIRMED">CONFIRMED</option>
                        <option value="COMPLETED">COMPLETED</option>
                        <option value="CANCELLED">CANCELLED</option>
                      </select>
                    </td>
                    <td className="p-3 text-right">
                      <button
                        onClick={() => setSelectedReceiptReservation(ord)}
                        className="btn-pattern-primary px-3 py-1.5 text-[11px] font-bold inline-flex items-center gap-1"
                      >
                        <FileText className="w-3.5 h-3.5" /> Print / PDF Receipt
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 1 & 2. TAB 4: MENU ITEMS & CUSTOM MENU CATEGORIES MANAGER (BY MAIN REGISTRAR ADMIN) */}
      {activeTab === 'menu' && (
        <div className="space-y-8" id="tab-content-menu">
          
          {/* Section A: Create & Manage Custom Menu Categories */}
          <div className="glass-card p-6 space-y-4">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <FolderPlus className="w-5 h-5 text-amber-500" />
              <span>Create Custom Menu Category (Saved in Database & Homepage)</span>
            </h3>

            <form onSubmit={handleCreateMenuCategory} className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-bold mb-1">New Category Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ethiopian Fasting, Chef Specials, Desserts"
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  className="form-input text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold mb-1">Category Description</label>
                <input
                  type="text"
                  placeholder="Brief description for menu tabs..."
                  value={newCategoryDesc}
                  onChange={(e) => setNewCategoryDesc(e.target.value)}
                  className="form-input text-xs"
                />
              </div>

              <div className="flex items-end">
                <button type="submit" className="btn-pattern-gold w-full py-2.5 text-xs font-bold">
                  Save Category to Database
                </button>
              </div>
            </form>

            {/* List of Custom Categories */}
            <div className="pt-3 border-t border-slate-200 dark:border-slate-800">
              <span className="text-xs font-bold text-slate-500 block mb-2">
                Active Menu Categories in Database ({menuCategories.length}):
              </span>
              <div className="flex flex-wrap gap-2">
                {menuCategories.map((cat) => (
                  <div key={cat.id || cat.name} className="px-3 py-1.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-700 text-amber-900 dark:text-amber-200 text-xs font-bold flex items-center gap-2">
                    <span>{cat.name}</span>
                    <button
                      type="button"
                      onClick={() => handleDeleteMenuCategory(cat.id, cat.name)}
                      className="text-red-500 hover:text-red-700 font-bold text-xs"
                      title="Remove Category"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Section B: Add / Edit Menu Items with Dynamic Category Selection */}
          <div className="glass-card p-6 space-y-4" id="menu-form">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center justify-between">
              <span>{editingMenuItem ? 'Edit Menu Item' : 'Add Food / Drink Item'}</span>
              {editingMenuItem && (
                <button type="button" onClick={() => { setEditingMenuItem(null); setMenuTitle(''); }} className="px-3 py-1 bg-slate-200 text-xs font-bold rounded">
                  Cancel Edit
                </button>
              )}
            </h3>

            <form onSubmit={handleSaveMenuItem} className="grid grid-cols-1 sm:grid-cols-4 gap-3">
              <div>
                <label className="block text-xs font-bold mb-1">Item Title *</label>
                <input type="text" required value={menuTitle} onChange={(e) => setMenuTitle(e.target.value)} className="form-input text-xs" placeholder="e.g. Doro Wot" />
              </div>

              {/* Dynamic Menu Categories Dropdown + Inline Custom Category */}
              <div>
                <label className="block text-xs font-bold mb-1">Category *</label>
                <select 
                  value={menuCategory} 
                  onChange={(e) => setMenuCategory(e.target.value)} 
                  className="form-input text-xs font-bold"
                >
                  {menuCategories.map((c) => (
                    <option key={c.id || c.name} value={c.name}>{c.name}</option>
                  ))}
                  <option value="NEW_CUSTOM">+ Add New Custom Category...</option>
                </select>
              </div>

              {menuCategory === 'NEW_CUSTOM' && (
                <div>
                  <label className="block text-xs font-bold mb-1 text-amber-600">Type New Category Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Cocktails & Spirits"
                    value={customCategoryInput}
                    onChange={(e) => setCustomCategoryInput(e.target.value)}
                    className="form-input text-xs font-bold"
                  />
                </div>
              )}

              <div>
                <label className="block text-xs font-bold mb-1">Regular Price (ETB) *</label>
                <input type="number" required value={menuPrice} onChange={(e) => setMenuPrice(e.target.value)} className="form-input text-xs" />
              </div>

              <div>
                <label className="block text-xs font-bold mb-1">Discount %</label>
                <input type="number" value={menuDiscountPercent} onChange={(e) => setMenuDiscountPercent(e.target.value)} className="form-input text-xs" />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold mb-1">Food Photo (Pick from Directory)</label>
                <input type="file" accept="image/*" onChange={(e) => handleFilePicked(e, setMenuImageUrl)} className="form-input text-xs" />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold mb-1">Description</label>
                <input type="text" value={menuDesc} onChange={(e) => setMenuDesc(e.target.value)} className="form-input text-xs" placeholder="Ingredients..." />
              </div>

              <div className="sm:col-span-4">
                <button type="submit" className="btn-pattern-gold w-full py-2.5 text-xs font-bold">
                  {editingMenuItem ? 'Update Menu Item' : 'Add Menu Item'}
                </button>
              </div>
            </form>
          </div>

          <div className="glass-card p-4 overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b bg-slate-100 dark:bg-slate-900/60">
                  <th className="p-3">Photo</th>
                  <th className="p-3">Title</th>
                  <th className="p-3">Category</th>
                  <th className="p-3">Regular Price</th>
                  <th className="p-3">Discount %</th>
                  <th className="p-3">Offer Price</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {menuItems.map(m => {
                  const finalPrice = m.discount_percentage > 0 ? (m.price * (1 - m.discount_percentage / 100)) : (m.discount_price || m.price);
                  return (
                    <tr key={m.id}>
                      <td className="p-3">
                        <img src={m.image_url} alt={m.title} className="w-10 h-10 rounded-lg object-cover border" />
                      </td>
                      <td className="p-3 font-bold">{m.title}</td>
                      <td className="p-3 font-bold text-amber-600">{m.category}</td>
                      <td className="p-3 text-slate-500">{m.price} ETB</td>
                      <td className="p-3 text-red-600 font-bold">{m.discount_percentage || 0}%</td>
                      <td className="p-3 text-amber-600 font-black">{finalPrice} ETB</td>
                      <td className="p-3 text-right space-x-1">
                        <button onClick={() => handleStartEditMenuItem(m)} className="px-2.5 py-1 bg-amber-600 text-white rounded text-[11px] font-bold inline-flex items-center gap-1">
                          <Edit className="w-3 h-3" /> Edit
                        </button>
                        <button onClick={async () => { await dataService.deleteMenuItem(m.id); loadAllData(); }} className="p-1 text-red-600 rounded">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 5: POST ANNOUNCEMENTS, EVENTS, GALLERIES */}
      {activeTab === 'announcements' && (
        <div className="glass-card p-6 space-y-4" id="tab-content-announcements">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <BellRing className="w-5 h-5 text-amber-500" />
            <span>Post Events, Galleries, Video & Photo Moments (Pick from Directory)</span>
          </h3>

          <form onSubmit={handlePostAnnouncement} className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-bold mb-1">Title *</label>
              <input type="text" required value={annTitle} onChange={(e) => setAnnTitle(e.target.value)} className="form-input text-xs" placeholder="Event / Moment Title" />
            </div>
            <div>
              <label className="block text-xs font-bold mb-1">Category</label>
              <select value={annCategory} onChange={(e) => setAnnCategory(e.target.value)} className="form-input text-xs font-bold">
                <option value="GENERAL">General Notice</option>
                <option value="URGENT_MEETING">Urgent Meeting</option>
                <option value="TRAINING">Staff Training</option>
                <option value="SHIFT">Shift Assignment</option>
                <option value="SANITATION">Sanitation Program</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold mb-1">Target Viewers *</label>
              <select value={annTargetRole} onChange={(e) => setAnnTargetRole(e.target.value)} className="form-input text-xs font-bold">
                <option value="ALL">ALL (Public Web Portal & Everyone)</option>
                <option value="PUBLIC">Public Only</option>
                <option value="JANITOR">Janitor Department Internal Only</option>
                <option value="CHEFS_COOKS">Chefs & Cooks Internal Only</option>
                <option value="RECEPTIONISTS">Receptionists Internal Only</option>
                <option value="ACCOUNTANT">Accountants Internal Only</option>
              </select>
            </div>

            <div className="sm:col-span-3">
              <label className="block text-xs font-bold mb-1">Announcement Details</label>
              <textarea required rows="3" value={annContent} onChange={(e) => setAnnContent(e.target.value)} className="form-input text-xs" placeholder="Details..."></textarea>
            </div>

            <div className="sm:col-span-3">
              <label className="block text-xs font-bold mb-1">Attach Image / Video File (Pick from Directory)</label>
              <input type="file" accept="image/*,video/*" onChange={(e) => handleFilePicked(e, setAnnMediaUrl, setAnnMediaType)} className="form-input text-xs" />
            </div>

            <div className="sm:col-span-3">
              <button type="submit" className="btn-pattern-gold w-full py-2.5 text-xs font-bold">
                Post Announcement / Gallery Event
              </button>
            </div>
          </form>
        </div>
      )}

      {/* TAB 6: VACANCIES & APPLICANTS */}
      {activeTab === 'vacancies' && (
        <div className="space-y-8" id="tab-content-vacancies">
          <div className="glass-card p-6 space-y-4">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Post Job Vacancy</h3>
            <form onSubmit={handleCreateVacancy} className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <input type="text" required placeholder="Title" value={vacTitle} onChange={(e) => setVacTitle(e.target.value)} className="form-input text-xs" />
              <input type="text" placeholder="Department" value={vacDept} onChange={(e) => setVacDept(e.target.value)} className="form-input text-xs" />
              <input type="date" value={vacDeadline} onChange={(e) => setVacDeadline(e.target.value)} className="form-input text-xs" />
              <textarea placeholder="Description..." value={vacDesc} onChange={(e) => setVacDesc(e.target.value)} className="form-input text-xs col-span-3"></textarea>
              <textarea placeholder="Requirements..." value={vacReq} onChange={(e) => setVacReq(e.target.value)} className="form-input text-xs col-span-3"></textarea>
              <button type="submit" className="btn-pattern-gold py-2.5 text-xs font-bold col-span-3">Post Vacancy</button>
            </form>
          </div>

          <div className="glass-card p-6 space-y-4">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Applicants & Document Viewer</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b bg-slate-100 dark:bg-slate-900/60">
                    <th className="p-3">Applicant Name</th>
                    <th className="p-3">Contact</th>
                    <th className="p-3">Written / Interview</th>
                    <th className="p-3">Status</th>
                    <th className="p-3 text-right">Document Viewer</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {applications.map(app => (
                    <tr key={app.id}>
                      <td className="p-3 font-bold">{app.applicant_name}</td>
                      <td className="p-3">{app.email}<br/>{app.phone}</td>
                      <td className="p-3">Written: {app.written_exam_result}<br/>Interview: {app.interview_result}</td>
                      <td className="p-3"><span className="px-2 py-0.5 rounded bg-amber-100 text-amber-800 font-bold">{app.recruitment_status}</span></td>
                      <td className="p-3 text-right">
                        <button onClick={() => setSelectedApplicantDoc(app)} className="btn-pattern-primary px-3 py-1.5 text-[11px] font-bold">
                          <Eye className="w-3.5 h-3.5" /> View Documents
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB: ALL EXISTING ROLE DASHBOARDS (SUPER ADMIN INSPECTOR MODE) */}
      {activeTab === 'all_dashboards' && (
        <div className="space-y-6" id="tab-content-all_dashboards">
          <div className="glass-card p-4 bg-gradient-to-r from-amber-950 via-slate-900 to-blue-950 text-white flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Layers className="w-5 h-5 text-amber-400 shrink-0" />
              <div>
                <h3 className="text-base font-extrabold">Super Admin View: All Department Dashboards</h3>
                <p className="text-xs text-slate-300">Select any department below to view real-time operations, records, and controls.</p>
              </div>
            </div>

            {/* Department Switcher Pills */}
            <div className="flex flex-wrap items-center gap-1.5">
              <button
                type="button"
                onClick={() => setSelectedDeptDashboard('manager')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  selectedDeptDashboard === 'manager' ? 'bg-amber-600 text-white shadow-md' : 'bg-white/10 text-slate-300 hover:bg-white/20'
                }`}
              >
                Manager
              </button>
              <button
                type="button"
                onClick={() => setSelectedDeptDashboard('accountant')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  selectedDeptDashboard === 'accountant' ? 'bg-amber-600 text-white shadow-md' : 'bg-white/10 text-slate-300 hover:bg-white/20'
                }`}
              >
                Accountant
              </button>
              <button
                type="button"
                onClick={() => setSelectedDeptDashboard('finance')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  selectedDeptDashboard === 'finance' ? 'bg-amber-600 text-white shadow-md' : 'bg-white/10 text-slate-300 hover:bg-white/20'
                }`}
              >
                Finance
              </button>
              <button
                type="button"
                onClick={() => setSelectedDeptDashboard('store')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  selectedDeptDashboard === 'store' ? 'bg-amber-600 text-white shadow-md' : 'bg-white/10 text-slate-300 hover:bg-white/20'
                }`}
              >
                Store Manager
              </button>
              <button
                type="button"
                onClick={() => setSelectedDeptDashboard('janitor')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  selectedDeptDashboard === 'janitor' ? 'bg-amber-600 text-white shadow-md' : 'bg-white/10 text-slate-300 hover:bg-white/20'
                }`}
              >
                Janitor
              </button>
              <button
                type="button"
                onClick={() => setSelectedDeptDashboard('hr')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  selectedDeptDashboard === 'hr' ? 'bg-amber-600 text-white shadow-md' : 'bg-white/10 text-slate-300 hover:bg-white/20'
                }`}
              >
                HR & Recruitment
              </button>
            </div>
          </div>

          {/* Embedded Target Dashboard */}
          <div className="p-2 sm:p-4 rounded-3xl bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 shadow-xl">
            {selectedDeptDashboard === 'manager' && <ManagerDashboard />}
            {selectedDeptDashboard === 'accountant' && <AccountantDashboard />}
            {selectedDeptDashboard === 'finance' && <FinanceDashboard />}
            {selectedDeptDashboard === 'store' && <StoreManagerDashboard />}
            {selectedDeptDashboard === 'janitor' && <JanitorDashboard />}
            {selectedDeptDashboard === 'hr' && <HRDashboard />}
          </div>
        </div>
      )}

      {/* TAB 7: CREATE DYNAMIC DASHBOARDS */}
      {activeTab === 'dashboards' && (
        <div className="glass-card p-6 space-y-4" id="tab-content-dashboards">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Layout className="w-5 h-5 text-amber-500" />
            <span>Create Dynamic Role Dashboard & Logo File</span>
          </h3>
          <form onSubmit={handleCreateCustomDashboard} className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <input type="text" required placeholder="Dashboard Name" value={dashName} onChange={(e) => setDashName(e.target.value)} className="form-input text-xs" />
            <div>
              <label className="block text-[10px] font-bold mb-1">Pick Logo File</label>
              <input type="file" accept="image/*" onChange={(e) => handleFilePicked(e, setDashLogoUrl)} className="form-input text-xs" />
            </div>
            <button type="submit" className="btn-pattern-gold py-2.5 text-xs font-bold">Unlock & Create Dashboard</button>
          </form>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-4">
            {customDashboards.map(cd => (
              <div key={cd.id} className="p-4 rounded-xl border flex items-center gap-3">
                <img src={cd.logo_url} alt="Logo" className="w-10 h-10 rounded-full object-cover border" />
                <div>
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white">{cd.dashboard_name}</h4>
                  <span className="text-[10px] text-emerald-600 font-bold">✓ Functionalities Unlocked</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 8: SITE SETTINGS */}
      {activeTab === 'settings' && (
        <div className="glass-card p-6 space-y-6" id="tab-content-settings">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">
            Custom Hotel Branding, File Directory Logos & 7 Social Media Brand Links
          </h3>

          <form onSubmit={handleSaveSettings} className="space-y-6">
            <div className="space-y-3 border-b border-slate-200 dark:border-slate-800 pb-6">
              <h4 className="text-xs font-bold uppercase text-amber-600">1. Hotel Branding & Images (Pick from Directory)</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold mb-1">Hotel Title</label>
                  <input type="text" value={editHotelName} onChange={(e) => setEditHotelName(e.target.value)} className="form-input text-xs" />
                </div>
                <div>
                  <label className="block text-xs font-bold mb-1">Hotel Logo File (Pick from Directory)</label>
                  <input type="file" accept="image/*" onChange={(e) => handleFilePicked(e, setEditLogoUrl)} className="form-input text-xs" />
                </div>
                <div>
                  <label className="block text-xs font-bold mb-1">Homepage Hero Background Image (Pick from Directory)</label>
                  <input type="file" accept="image/*" onChange={(e) => handleFilePicked(e, setEditHeroBg)} className="form-input text-xs" />
                </div>
                <div>
                  <label className="block text-xs font-bold mb-1">Physical Location Address</label>
                  <input type="text" value={editLocation} onChange={(e) => setEditLocation(e.target.value)} className="form-input text-xs" />
                </div>
              </div>
            </div>

            <div className="space-y-3 border-b border-slate-200 dark:border-slate-800 pb-6">
              <h4 className="text-xs font-bold uppercase text-amber-600">2. Hotel Contacts</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold mb-1">Telephone Lines</label>
                  <input type="text" value={editPhone} onChange={(e) => setEditPhone(e.target.value)} className="form-input text-xs" />
                </div>
                <div>
                  <label className="block text-xs font-bold mb-1">Contact Email</label>
                  <input type="text" value={editEmail} onChange={(e) => setEditEmail(e.target.value)} className="form-input text-xs" />
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase text-amber-600 flex items-center gap-1.5">
                <Share2 className="w-4 h-4" />
                <span>3. Fields to Provide Links for All 7 Social Media Platforms</span>
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold mb-1 text-purple-600">Instagram URL</label>
                  <input type="url" value={editInstagram} onChange={(e) => setEditInstagram(e.target.value)} className="form-input text-xs" placeholder="https://instagram.com/..." />
                </div>
                <div>
                  <label className="block text-xs font-bold mb-1 text-blue-600">Facebook URL</label>
                  <input type="url" value={editFacebook} onChange={(e) => setEditFacebook(e.target.value)} className="form-input text-xs" placeholder="https://facebook.com/..." />
                </div>
                <div>
                  <label className="block text-xs font-bold mb-1 text-black dark:text-cyan-400">TikTok URL</label>
                  <input type="url" value={editTiktok} onChange={(e) => setEditTiktok(e.target.value)} className="form-input text-xs" placeholder="https://tiktok.com/@..." />
                </div>
                <div>
                  <label className="block text-xs font-bold mb-1 text-emerald-600">WhatsApp Link / Number</label>
                  <input type="url" value={editWhatsapp} onChange={(e) => setEditWhatsapp(e.target.value)} className="form-input text-xs" placeholder="https://wa.me/..." />
                </div>
                <div>
                  <label className="block text-xs font-bold mb-1 text-blue-700">LinkedIn URL</label>
                  <input type="url" value={editLinkedin} onChange={(e) => setEditLinkedin(e.target.value)} className="form-input text-xs" placeholder="https://linkedin.com/in/..." />
                </div>
                <div>
                  <label className="block text-xs font-bold mb-1 text-red-600">YouTube Channel URL</label>
                  <input type="url" value={editYoutube} onChange={(e) => setEditYoutube(e.target.value)} className="form-input text-xs" placeholder="https://youtube.com/@..." />
                </div>
                <div>
                  <label className="block text-xs font-bold mb-1 text-sky-500">Telegram Channel / User</label>
                  <input type="url" value={editTelegram} onChange={(e) => setEditTelegram(e.target.value)} className="form-input text-xs" placeholder="https://t.me/..." />
                </div>
              </div>
            </div>

            <div className="space-y-4 border-t border-slate-200 dark:border-slate-800 pt-6">
              <h4 className="text-xs font-bold uppercase text-amber-600 flex items-center gap-1.5">
                <Building2 className="w-4 h-4" />
                <span>4. Configure Active Hotel Bank Accounts (8 Fields - Appears in Room Booking Forms)</span>
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {bankAccounts.map((acc, index) => (
                  <div key={acc.id || index} className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 space-y-2 bg-slate-50/50 dark:bg-slate-900/40">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-extrabold text-amber-600">Bank #{index + 1}</span>
                      <select
                        value={acc.status}
                        onChange={(e) => handleUpdateBankField(index, 'status', e.target.value)}
                        className={`text-[10px] font-extrabold px-2 py-0.5 rounded ${
                          acc.status === 'ACTIVE' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-700'
                        }`}
                      >
                        <option value="ACTIVE">ACTIVE</option>
                        <option value="INACTIVE">INACTIVE</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-slate-500">Bank Name</label>
                      <input
                        type="text"
                        value={acc.bank_name}
                        onChange={(e) => handleUpdateBankField(index, 'bank_name', e.target.value)}
                        className="form-input text-xs"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-slate-500">Account Number</label>
                      <input
                        type="text"
                        value={acc.account_number}
                        onChange={(e) => handleUpdateBankField(index, 'account_number', e.target.value)}
                        className="form-input text-xs font-mono"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-slate-500">Account Holder Name</label>
                      <input
                        type="text"
                        value={acc.account_holder}
                        onChange={(e) => handleUpdateBankField(index, 'account_holder', e.target.value)}
                        className="form-input text-xs"
                      />
                    </div>
                  </div>
                ))}
              </div>

              <button
                type="button"
                onClick={handleSaveBankAccounts}
                className="btn-pattern-gold px-6 py-2.5 text-xs font-bold shadow-md"
              >
                Save Bank Accounts Configuration
              </button>
            </div>

            <div>
              <button type="submit" className="btn-pattern-gold px-8 py-3 text-xs font-bold shadow-lg">
                Save All Site & Social Settings
              </button>
            </div>
          </form>
        </div>
      )}

      {/* TAB 9: REPORTS & FEEDBACK */}
      {activeTab === 'reports' && (
        <div className="glass-card p-6 space-y-4" id="tab-content-reports">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">Received Department Reports & Feedback Center</h3>
          <div className="space-y-4">
            {reports.map((rep) => (
              <div key={rep.id} className="p-4 rounded-xl border space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="font-bold text-amber-600">{rep.sender_role} - {rep.sender_name}</span>
                  <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-600">{rep.status}</span>
                </div>
                <h4 className="font-bold text-sm">{rep.report_title}</h4>
                <p className="text-xs text-slate-600">{rep.content}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* RECEIPT MODAL */}
      <ReceiptModal reservation={selectedReceiptReservation} isOpen={!!selectedReceiptReservation} onClose={() => setSelectedReceiptReservation(null)} />

      {/* APPLICANT DOCUMENT VIEWER MODAL */}
      <DocumentViewer applicant={selectedApplicantDoc} isOpen={!!selectedApplicantDoc} onClose={() => setSelectedApplicantDoc(null)} onUpdateStatus={handleApplicantStatusUpdate} />

    </div>
  );
};
