import React, { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppStore } from '../../store/appStore'
import {
  apiAdminStats, apiAdminUsers, apiAdminBlockUser, apiAdminDeleteUser,
  apiAdminCrops, apiAdminDeleteCrop, apiAdminCropStatus,
  apiAdminFarmers, apiAdminDeleteFarmer,
  apiAdminGetConfig, apiAdminAddConfigItem, apiAdminUpdateConfigItem, apiAdminDeleteConfigItem,
  apiAdminInitDefaults,
  apiAdminGetCropDurations, apiAdminUpdateCropDuration, apiAdminInitCropDurations,
  apiAdminEquipment, apiAdminEquipmentStatus, apiAdminDeleteEquipment,
  apiAdminLands, apiAdminLandStatus, apiAdminDeleteLand,
  apiAdminGetAutoApprove, apiAdminSetAutoApprove,
  apiAdminUpdateUser, apiAdminGetGeminiKey, apiAdminSetGeminiKey,
  apiAdminGetUserBadges, apiAdminSetUserBadges,
  apiAdminCreateUser, apiAdminCreateCrop, apiAdminCreateEquipment, apiAdminCreateLand,
  apiAdminGetUsersList, apiAdminGetFarmersList,
  apiSuperGetAdmins, apiSuperSetAdmin, apiSuperDeleteAdmin,
  apiSetUserAiLevel,
  apiAdminGetKnowledge, apiAdminVerifyKnowledge, apiAdminDeleteKnowledge,
  apiLoginAsUser,
} from '../../api/admin'
import { apiUploadImage, apiUploadImages, apiUploadVideo, apiUploadApk } from '../../api/uploads'
import { setToken, getToken } from '../../api/client'
import { getRoleBadges } from '../../types/badges'
import { CROP_LABELS, STAGE_LABELS } from '../../types'
import { WILAYAS as WILAYA_LIST, WILAYA_NAMES } from '../../data/algeriaLocations'
import {
  Users, Leaf, Tractor, LogOut, Search,
  Trash2, Ban, CheckCircle, RefreshCw, Plus, X, Edit2, Eye, EyeOff,
  Shield, ChevronLeft, ChevronRight, Wrench, TrendingUp,
  Menu, Package, LayoutGrid, Table2, MapPin, Scale, Video, UserPlus, BookOpen, Globe
} from 'lucide-react'

const ROLE_LABEL: Record<string, string> = { farmer: 'فلاح', buyer: 'مشتري', agent: 'وسيط' }
const ROLE_COLOR: Record<string, string> = { farmer: '#16a34a', buyer: '#2563eb', agent: '#7c3aed' }
const STAGE_COLOR: Record<string, string> = { seeds: '#84cc16', growth: '#16a34a', flowering: '#22c55e', ready: '#dc2626' }
type Tab = 'stats' | 'users' | 'crops' | 'farmers' | 'equipment' | 'lands' | 'cropTypes' | 'equipTypes' | 'cropDurations' | 'settings' | 'admins' | 'knowledge' | 'landing'

const NAV = [
  { id: 'stats',         label: 'الإحصائيات',    icon: TrendingUp },
  { id: 'users',         label: 'المستخدمون',    icon: Users },
  { id: 'crops',         label: 'المحاصيل',      icon: Leaf },
  { id: 'equipment',     label: 'المعدات',        icon: Wrench },
  { id: 'lands',         label: 'الأراضي',        icon: MapPin },
  { id: 'farmers',       label: 'الفلاحون',      icon: Tractor },
  { id: 'cropTypes',     label: 'أنواع المحاصيل', icon: Package },
  { id: 'equipTypes',    label: 'أنواع المعدات',  icon: LayoutGrid },
  { id: 'cropDurations', label: 'أيام النضج',     icon: Scale },
  { id: 'landing',       label: 'صفحة الهبوط',    icon: Globe },
  { id: 'admins',        label: 'المشرفون',        icon: UserPlus },
  { id: 'knowledge',     label: 'قاعدة المعرفة',  icon: BookOpen },
  { id: 'settings',      label: 'الإعدادات',      icon: Shield },
] as const

export default function AdminDashboard() {
  const navigate = useNavigate()
  const { currentUser, logout, rehydrateUser } = useAppStore()
  const isSuperAdmin = (currentUser as any)?.isSuperAdmin
  const [tab, setTab] = useState<Tab>(() => {
    const p = new URLSearchParams(window.location.search).get('tab') as Tab | null
    return p || 'stats'
  })
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < 768)
  const [sidebarOpen, setSidebarOpen] = useState(() => window.innerWidth >= 768)

  useEffect(() => {
    const onResize = () => {
      const mobile = window.innerWidth < 768
      setIsMobile(mobile)
      if (!mobile) setSidebarOpen(true)
      else setSidebarOpen(false)
    }
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  // ── Stats ──────────────────────────────────────────────────────────────────
  const [stats, setStats] = useState<any>(null)
  const [statsLoading, setStatsLoading] = useState(true)
  const loadStats = useCallback(() => {
    setStatsLoading(true)
    apiAdminStats().then(setStats).finally(() => setStatsLoading(false))
  }, [])
  useEffect(() => { if (tab === 'stats') loadStats() }, [tab])

  // ── Users ──────────────────────────────────────────────────────────────────
  const [users, setUsers] = useState<any[]>([])
  const [usersTotal, setUsersTotal] = useState(0)
  const [usersPage, setUsersPage] = useState(1)
  const [userSearch, setUserSearch] = useState('')
  const [userRole, setUserRole] = useState('')
  const [userBlocked, setUserBlocked] = useState('')
  const [usersLoading, setUsersLoading] = useState(false)
  const loadUsers = useCallback(() => {
    setUsersLoading(true)
    apiAdminUsers({ search: userSearch, role: userRole, blocked: userBlocked || undefined, page: usersPage })
      .then(d => { setUsers(d.users); setUsersTotal(d.total) })
      .finally(() => setUsersLoading(false))
  }, [userSearch, userRole, userBlocked, usersPage])
  useEffect(() => { if (tab === 'users') loadUsers() }, [tab, userSearch, userRole, userBlocked, usersPage])

  // ── Edit User Modal ─────────────────────────────────────────────────────────
  const [editUser, setEditUser] = useState<any>(null)
  const [editForm, setEditForm] = useState({ name: '', phone: '', wilaya: '', role: '' })
  const [editLoading, setEditLoading] = useState(false)
  const openEditUser = (u: any) => { setEditUser(u); setEditForm({ name: u.name, phone: u.phone, wilaya: u.wilaya, role: u.role }) }

  // ── Badge Modal ─────────────────────────────────────────────────────────────
  const [badgeModalUser, setBadgeModalUser] = useState<any>(null)
  const [badgeModalData, setBadgeModalData] = useState<string[]>([])
  const [badgeModalLoading, setBadgeModalLoading] = useState(false)

  const openBadgeModal = async (user: any) => {
    setBadgeModalUser(user)
    setBadgeModalLoading(true)
    try {
      const data = await apiAdminGetUserBadges(user._id)
      setBadgeModalData(data.badges || [])
    } catch {
      setBadgeModalData([])
    } finally {
      setBadgeModalLoading(false)
    }
  }

  const saveBadges = async () => {
    if (!badgeModalUser) return
    setBadgeModalLoading(true)
    try {
      await apiAdminSetUserBadges(badgeModalUser._id, badgeModalData)
      setBadgeModalUser(null)
    } catch {
      // ignore
    } finally {
      setBadgeModalLoading(false)
    }
  }

  const handleSaveUser = async () => {
    if (!editUser) return
    setEditLoading(true)
    try {
      await apiAdminUpdateUser(editUser._id, editForm)
      setEditUser(null); loadUsers()
    } catch (e: any) { alert(e?.message || 'خطأ') } finally { setEditLoading(false) }
  }

  // ── Gemini Settings ─────────────────────────────────────────────────────────
  const [geminiInfo, setGeminiInfo] = useState<{ hasKey: boolean; keyPreview: string | null } | null>(null)
  const [geminiInput, setGeminiInput] = useState('')
  const [geminiLoading, setGeminiLoading] = useState(false)
  const [showGeminiKey, setShowGeminiKey] = useState(false)
  useEffect(() => { if (tab === 'settings') apiAdminGetGeminiKey().then(setGeminiInfo) }, [tab])
  const handleSaveGemini = async () => {
    if (!geminiInput.trim()) return
    setGeminiLoading(true)
    try {
      const res = await apiAdminSetGeminiKey(geminiInput.trim())
      setGeminiInfo({ hasKey: true, keyPreview: res.keyPreview })
      setGeminiInput('')
      alert('✅ تم حفظ مفتاح Gemini بنجاح')
    } catch (e: any) { alert(e?.message || 'خطأ في الحفظ') } finally { setGeminiLoading(false) }
  }

  // ── Crops ──────────────────────────────────────────────────────────────────
  const [crops, setCrops] = useState<any[]>([])
  const [cropsTotal, setCropsTotal] = useState(0)
  const [cropsPage, setCropsPage] = useState(1)
  const [cropSearch, setCropSearch] = useState('')
  const [cropStage, setCropStage] = useState('')
  const [cropStatusFilter, setCropStatusFilter] = useState('')
  const [cropsView, setCropsView] = useState<'table' | 'cards'>('cards')
  const [cropsLoading, setCropsLoading] = useState(false)
  const loadCrops = useCallback(() => {
    setCropsLoading(true)
    apiAdminCrops({ search: cropSearch, stage: cropStage || undefined, status: cropStatusFilter || undefined, page: cropsPage })
      .then(d => { setCrops(d.crops); setCropsTotal(d.total) })
      .finally(() => setCropsLoading(false))
  }, [cropSearch, cropStage, cropStatusFilter, cropsPage])
  useEffect(() => { if (tab === 'crops') loadCrops() }, [tab, cropSearch, cropStage, cropStatusFilter, cropsPage])

  // ── Farmers ────────────────────────────────────────────────────────────────
  const [farmers, setFarmers] = useState<any[]>([])
  const [farmersTotal, setFarmersTotal] = useState(0)
  const [farmersPage, setFarmersPage] = useState(1)
  const [farmerSearch, setFarmerSearch] = useState('')
  const [farmersLoading, setFarmersLoading] = useState(false)
  const loadFarmers = useCallback(() => {
    setFarmersLoading(true)
    apiAdminFarmers({ search: farmerSearch, page: farmersPage })
      .then(d => { setFarmers(d.farmers); setFarmersTotal(d.total) })
      .finally(() => setFarmersLoading(false))
  }, [farmerSearch, farmersPage])
  useEffect(() => { if (tab === 'farmers') loadFarmers() }, [tab, farmerSearch, farmersPage])

  // ── Equipment (admin) ─────────────────────────────────────────────────────
  const [eqList, setEqList] = useState<any[]>([])
  const [eqTotal, setEqTotal] = useState(0)
  const [eqPage, setEqPage] = useState(1)
  const [eqSearch, setEqSearch] = useState('')
  const [eqStatus, setEqStatus] = useState('')
  const [eqLoading, setEqLoading] = useState(false)
  const loadEquipment = useCallback(() => {
    setEqLoading(true)
    apiAdminEquipment({ search: eqSearch, status: eqStatus || undefined, page: eqPage })
      .then(d => { setEqList(d.equipment); setEqTotal(d.total) })
      .finally(() => setEqLoading(false))
  }, [eqSearch, eqStatus, eqPage])
  useEffect(() => { if (tab === 'equipment') loadEquipment() }, [tab, eqSearch, eqStatus, eqPage])

  // ── Lands (admin) ─────────────────────────────────────────────────────────
  const [landList, setLandList] = useState<any[]>([])
  const [landTotal, setLandTotal] = useState(0)
  const [landPage, setLandPage] = useState(1)
  const [landSearch, setLandSearch] = useState('')
  const [landStatus, setLandStatus] = useState('')
  const [landsLoading, setLandsLoading] = useState(false)
  const loadLands = useCallback(() => {
    setLandsLoading(true)
    apiAdminLands({ search: landSearch, status: landStatus || undefined, page: landPage })
      .then(d => { setLandList(d.lands); setLandTotal(d.total) })
      .finally(() => setLandsLoading(false))
  }, [landSearch, landStatus, landPage])
  useEffect(() => { if (tab === 'lands') loadLands() }, [tab, landSearch, landStatus, landPage])

  // ── Auto-approve settings ─────────────────────────────────────────────────
  const [autoApprove, setAutoApprove] = useState<{ crops: boolean; equipment: boolean; lands: boolean } | null>(null)
  useEffect(() => {
    if (tab === 'crops' || tab === 'equipment' || tab === 'lands') {
      apiAdminGetAutoApprove().then(setAutoApprove).catch(() => {})
    }
  }, [tab])
  const handleToggleAutoApprove = async (category: 'crops' | 'equipment' | 'lands') => {
    if (!autoApprove) return
    const newVal = !autoApprove[category]
    const updated = await apiAdminSetAutoApprove(category, newVal)
    setAutoApprove(updated)
  }

  // ── Config Items (crop types / equip types) ────────────────────────────────
  const [configItems, setConfigItems] = useState<any[]>([])
  const [configLoading, setConfigLoading] = useState(false)
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingItem, setEditingItem] = useState<any>(null)
  const [formKey, setFormKey] = useState('')
  const [formLabel, setFormLabel] = useState('')
  const [formEmoji, setFormEmoji] = useState('🌱')
  const [formImage, setFormImage] = useState('')
  const [formSubcategory, setFormSubcategory] = useState('')
  const [formHidePlantingDate, setFormHidePlantingDate] = useState(false)
  const [imageUploading, setImageUploading] = useState(false)
  const [formError, setFormError] = useState('')

  const configType = tab === 'cropTypes' ? 'cropTypes' : 'equipmentTypes'

  // ── Crop Durations ──────────────────────────────────────────────────────────
  const [cropDurations, setCropDurations] = useState<{ key: string; labelAr: string; emoji: string; days: number }[]>([])
  const [durLoading, setDurLoading] = useState(false)
  const [editingDays, setEditingDays] = useState<Record<string, string>>({})

  useEffect(() => {
    if (tab !== 'cropDurations') return
    setDurLoading(true)
    apiAdminGetCropDurations()
      .then(items => {
        if (items.length === 0) return apiAdminInitCropDurations()
        return items
      })
      .then(items => setCropDurations(items))
      .catch(() => {})
      .finally(() => setDurLoading(false))
  }, [tab])

  const loadConfig = useCallback(() => {
    if (tab !== 'cropTypes' && tab !== 'equipTypes' && tab !== 'landing') return
    setConfigLoading(true)
    const type = tab === 'landing' ? 'landing' : (tab === 'cropTypes' ? 'cropTypes' : 'equipmentTypes')
    apiAdminGetConfig(type)
      .then(setConfigItems)
      .finally(() => setConfigLoading(false))
  }, [tab])
  useEffect(() => { loadConfig() }, [tab])

  // Landing Editor states & handler
  const [landingForm, setLandingForm] = useState({ heroTitle: '', heroSubtitle: '', apkUrl: '', contactPhone: '', showStats: true })
  const [saveLandingLoading, setSaveLandingLoading] = useState(false)
  const [apkUploading, setApkUploading] = useState(false)

  const getLandingVal = useCallback((key: string) => configItems.find(i => i.key === key)?.labelAr || '', [configItems])
  const isLandingActive = useCallback((key: string) => configItems.find(i => i.key === key)?.isActive !== false, [configItems])

  useEffect(() => {
    if (tab === 'landing') {
      setLandingForm({
        heroTitle: getLandingVal('heroTitle') || 'منصة منتوج بلادي الرقمية',
        heroSubtitle: getLandingVal('heroSubtitle') || 'التسويق يبدأ من يوم البذور. منصتكم الموثوقة لتسويق وتصفح المحاصيل الفلاحية والمعدات والأراضي الفلاحية في الجزائر.',
        apkUrl: getLandingVal('apkUrl') || '/apk/mantoudj-bladi.apk',
        contactPhone: getLandingVal('contactPhone') || '0555000000',
        showStats: isLandingActive('showStats')
      })
    }
  }, [configItems, tab, getLandingVal, isLandingActive])

  const handleSaveLandingConfig = async () => {
    setSaveLandingLoading(true)
    try {
      await Promise.all([
        apiAdminUpdateConfigItem('landing', 'heroTitle', { labelAr: landingForm.heroTitle }),
        apiAdminUpdateConfigItem('landing', 'heroSubtitle', { labelAr: landingForm.heroSubtitle }),
        apiAdminUpdateConfigItem('landing', 'apkUrl', { labelAr: landingForm.apkUrl }),
        apiAdminUpdateConfigItem('landing', 'contactPhone', { labelAr: landingForm.contactPhone }),
        apiAdminUpdateConfigItem('landing', 'showStats', { isActive: landingForm.showStats }),
      ])
      alert('✅ تم حفظ إعدادات صفحة الهبوط بنجاح!')
      loadConfig()
    } catch (err: any) {
      alert('❌ فشل حفظ الإعدادات: ' + (err?.message || 'حدث خطأ'))
    } finally {
      setSaveLandingLoading(false)
    }
  }

  const resetForm = () => { setFormKey(''); setFormLabel(''); setFormEmoji('🌱'); setFormImage(''); setFormSubcategory(''); setFormHidePlantingDate(false); setFormError(''); setEditingItem(null); setShowAddForm(false) }

  const handleSaveItem = async () => {
    if ((!editingItem && !formKey.trim()) || !formLabel.trim()) { setFormError('المفتاح والاسم مطلوبان'); return }
    try {
      if (editingItem) {
        const updates: any = { labelAr: formLabel, emoji: formEmoji, subcategory: formSubcategory, hidePlantingDate: formHidePlantingDate }
        if (formImage) updates.image = formImage
        const items = await apiAdminUpdateConfigItem(configType, editingItem.key, updates)
        setConfigItems(items)
      } else {
        const newItem: any = { key: formKey.trim(), labelAr: formLabel.trim(), emoji: formEmoji, subcategory: formSubcategory, hidePlantingDate: formHidePlantingDate }
        if (formImage) newItem.image = formImage
        const items = await apiAdminAddConfigItem(configType, newItem)
        setConfigItems(items)
      }
      resetForm()
    } catch (e: any) {
      setFormError(e.message || 'حدث خطأ')
    }
  }

  const handleToggleItem = async (item: any) => {
    const items = await apiAdminUpdateConfigItem(configType, item.key, { isActive: !item.isActive })
    setConfigItems(items)
  }

  const handleDeleteItem = async (key: string) => {
    if (!confirm('حذف هذا العنصر نهائياً؟')) return
    const items = await apiAdminDeleteConfigItem(configType, key)
    setConfigItems(items)
  }

  // ── Actions ────────────────────────────────────────────────────────────────
  const handleBlock = async (id: string) => {
    if (!confirm('تأكيد تغيير حالة الحساب؟')) return
    await apiAdminBlockUser(id); loadUsers()
  }
  const handleLoginAs = async (u: any) => {
    if (!confirm(`تسجيل الدخول كـ "${u.name}"؟`)) return
    try {
      const adminToken = getToken()
      const { token, user } = await apiLoginAsUser(u._id)
      if (adminToken && currentUser) {
        sessionStorage.setItem('admin_return_token', adminToken)
        // حفظ بيانات الأدمن لاستعادتها عند الرجوع
        sessionStorage.setItem('admin_return_user', JSON.stringify(currentUser))
        window.dispatchEvent(new Event('admin_session_changed'))
      }
      setToken(token)
      const roleHome: Record<string, string> = { agent: '/agent', buyer: '/buyer', farmer: '/farmer' }
      window.location.href = roleHome[user.role] || '/'
    } catch (err: any) {
      alert('خطأ: ' + (err?.message || 'فشل الدخول'))
    }
  }

  const handleAiLevel = async (id: string, level: 1 | 2 | 3) => {
    try {
      await apiSetUserAiLevel(id, level)
      loadUsers()
    } catch (err: any) {
      alert('خطأ: ' + (err?.message || JSON.stringify(err)))
    }
  }
  const handleDeleteUser = async (id: string) => {
    if (!confirm('حذف المستخدم نهائياً؟')) return
    await apiAdminDeleteUser(id); loadUsers()
  }
  const handleDeleteCrop = async (id: string) => {
    if (!confirm('حذف المحصول نهائياً؟')) return
    await apiAdminDeleteCrop(id); loadCrops()
  }
  const handleCropStatus = async (id: string, status: 'approved' | 'rejected') => {
    await apiAdminCropStatus(id, status); loadCrops()
  }
  const handleDeleteFarmer = async (id: string) => {
    if (!confirm('حذف الفلاح نهائياً؟')) return
    await apiAdminDeleteFarmer(id); loadFarmers()
  }
  const handleEqStatus = async (id: string, status: 'approved' | 'rejected') => {
    await apiAdminEquipmentStatus(id, status); loadEquipment()
  }
  const handleDeleteEq = async (id: string) => {
    if (!confirm('حذف المعدة نهائياً؟')) return
    await apiAdminDeleteEquipment(id); loadEquipment()
  }
  const handleLandStatus = async (id: string, status: 'approved' | 'rejected') => {
    await apiAdminLandStatus(id, status); loadLands()
  }
  const handleDeleteLandItem = async (id: string) => {
    if (!confirm('حذف الأرض نهائياً؟')) return
    await apiAdminDeleteLand(id); loadLands()
  }

  // ── Admin creation forms ─────────────────────────────────────────────────────
  const [showCreateModal, setShowCreateModal] = useState<null | 'user' | 'crop' | 'equipment' | 'land'>(null)
  const [createLoading, setCreateLoading] = useState(false)
  const [createError, setCreateError] = useState('')
  const [usersList, setUsersList] = useState<any[]>([])
  const [farmersList, setFarmersList] = useState<any[]>([])

  // create-user form
  const [cuName, setCuName] = useState('')
  const [cuPhone, setCuPhone] = useState('')
  const [cuPassword, setCuPassword] = useState('')
  const [cuWilaya, setCuWilaya] = useState('')
  const [cuCommune, setCuCommune] = useState('')
  const [cuEmail, setCuEmail] = useState('')
  const [cuProfileImage, setCuProfileImage] = useState('')
  const [cuImgUploading, setCuImgUploading] = useState(false)
  const [cuRole, setCuRole] = useState('farmer')

  // create-crop form
  const [ccFarmerId, setCcFarmerId] = useState('')
  const [ccType, setCcType] = useState('')
  const [ccQty, setCcQty] = useState('')
  const [ccPrice, setCcPrice] = useState('')
  const [ccWilaya, setCcWilaya] = useState('')
  const [ccCommune, setCcCommune] = useState('')
  const [ccStage, setCcStage] = useState('seeds')
  const [ccDate, setCcDate] = useState('')
  const [ccHarvestDate, setCcHarvestDate] = useState('')
  const [ccImages, setCcImages] = useState<string[]>([])
  const [ccVideo, setCcVideo] = useState('')
  const [ccImgUploading, setCcImgUploading] = useState(false)
  const [ccVidUploading, setCcVidUploading] = useState(false)
  const [ccDescription, setCcDescription] = useState('')
  const [ccCropTypes, setCcCropTypes] = useState<any[]>([])
  const [ccTypeOpen, setCcTypeOpen] = useState(false)

  // create-equipment form
  const [ceAgentId, setCeAgentId] = useState('')
  const [ceName, setCeName] = useState('')
  const [ceCategory, setCeCategory] = useState('')
  const [ceWilaya, setCeWilaya] = useState('')
  const [cePrice, setCePrice] = useState('')
  const [cePhone, setCePhone] = useState('')
  const [ceImages, setCeImages] = useState<string[]>([])
  const [ceVideo, setCeVideo] = useState('')
  const [ceImgUploading, setCeImgUploading] = useState(false)
  const [ceVidUploading, setCeVidUploading] = useState(false)
  const [ceDescription, setCeDescription] = useState('')

  // create-land form
  const [clAgentId, setClAgentId] = useState('')
  const [clArea, setClArea] = useState('')
  const [clWilaya, setClWilaya] = useState('')
  const [clGoal, setClGoal] = useState('بيع')
  const [clPriceType, setClPriceType] = useState('بيع')
  const [clPrice, setClPrice] = useState('')
  const [clImages, setClImages] = useState<string[]>([])
  const [clVideo, setClVideo] = useState('')
  const [clImgUploading, setClImgUploading] = useState(false)
  const [clVidUploading, setClVidUploading] = useState(false)
  const [clDescription, setClDescription] = useState('')
  const [clPhone, setClPhone] = useState('')
  const [clCommune, setClCommune] = useState('')

  // super admin tab
  const [adminsList, setAdminsList] = useState<any[]>([])
  const [adminsLoading, setAdminsLoading] = useState(false)
  const [promotePhone, setPromotePhone] = useState('')
  const [promoteLoading, setPromoteLoading] = useState(false)
  const [showCreateAdmin, setShowCreateAdmin] = useState(false)
  const [newAdminName, setNewAdminName] = useState('')
  const [newAdminPhone, setNewAdminPhone] = useState('')
  const [newAdminPassword, setNewAdminPassword] = useState('')
  const [newAdminWilaya, setNewAdminWilaya] = useState('')
  const [newAdminCommune, setNewAdminCommune] = useState('')
  const [newAdminEmail, setNewAdminEmail] = useState('')
  const [newAdminProfileImage, setNewAdminProfileImage] = useState('')
  const [newAdminImgUploading, setNewAdminImgUploading] = useState(false)
  const [createAdminLoading, setCreateAdminLoading] = useState(false)
  const [createAdminError, setCreateAdminError] = useState('')

  useEffect(() => {
    if (tab === 'admins' && isSuperAdmin) {
      setAdminsLoading(true)
      apiSuperGetAdmins().then(data => setAdminsList(Array.isArray(data) ? data : (data as any).data || [])).finally(() => setAdminsLoading(false))
    }
  }, [tab])

  // ── Knowledge ──────────────────────────────────────────────────────────────
  const [knowledgeList, setKnowledgeList] = useState<any[]>([])
  const [knowledgeLoading, setKnowledgeLoading] = useState(false)
  const loadKnowledge = useCallback(() => {
    setKnowledgeLoading(true)
    apiAdminGetKnowledge().then(d => setKnowledgeList(Array.isArray(d) ? d : [])).finally(() => setKnowledgeLoading(false))
  }, [])
  useEffect(() => { if (tab === 'knowledge') loadKnowledge() }, [tab])

  const openCreateModal = async (type: 'user' | 'crop' | 'equipment' | 'land') => {
    setShowCreateModal(type)
    setCreateError('')
    if (type === 'crop' || type === 'equipment' || type === 'land') {
      const [ul, fl] = await Promise.all([apiAdminGetUsersList(), apiAdminGetFarmersList()])
      setUsersList(Array.isArray(ul) ? ul : (ul as any).data || [])
      setFarmersList(Array.isArray(fl) ? fl : (fl as any).data || [])
    }
    if (type === 'crop') {
      apiAdminGetConfig('cropTypes').then(items => setCcCropTypes(Array.isArray(items) ? items : []))
    }
  }

  const handleCreateUser = async () => {
    if (!cuName || !cuPhone || !cuPassword || !cuWilaya) { setCreateError('جميع الحقول مطلوبة'); return }
    setCreateLoading(true); setCreateError('')
    try {
      await apiAdminCreateUser({ name: cuName, phone: cuPhone, password: cuPassword, wilaya: cuWilaya, commune: cuCommune || undefined, role: cuRole, email: cuEmail || undefined, profileImage: cuProfileImage || undefined })
      setShowCreateModal(null)
      setCuName(''); setCuPhone(''); setCuPassword(''); setCuWilaya(''); setCuCommune(''); setCuEmail(''); setCuProfileImage('')
      if (tab === 'users') loadUsers()
    } catch (e: any) { setCreateError(e.message || 'خطأ') } finally { setCreateLoading(false) }
  }

  const handleCreateCrop = async () => {
    if (!ccFarmerId || !ccType || !ccQty || !ccWilaya) { setCreateError('الحقول الأساسية مطلوبة'); return }
    setCreateLoading(true); setCreateError('')
    try {
      await apiAdminCreateCrop({ farmerId: ccFarmerId, agentId: ccFarmerId, type: ccType, estimatedQuantityKg: ccQty, wilaya: ccWilaya, commune: ccCommune || undefined, pricePerKg: ccPrice || undefined, stage: ccStage, plantingDate: ccDate || undefined, expectedHarvestDate: ccHarvestDate || undefined, images: ccImages, videos: ccVideo ? [ccVideo] : [], coverMediaType: ccVideo && !ccImages.length ? 'video' : 'image', description: ccDescription || undefined })
      setShowCreateModal(null)
      setCcFarmerId(''); setCcType(''); setCcQty(''); setCcPrice(''); setCcWilaya(''); setCcCommune(''); setCcImages([]); setCcVideo(''); setCcDescription(''); setCcHarvestDate('')
      if (tab === 'crops') loadCrops()
    } catch (e: any) { setCreateError(e.message || 'خطأ') } finally { setCreateLoading(false) }
  }

  const handleCreateEquipment = async () => {
    if (!ceAgentId || !ceName || !ceCategory || !ceWilaya) { setCreateError('الحقول الأساسية مطلوبة'); return }
    setCreateLoading(true); setCreateError('')
    try {
      await apiAdminCreateEquipment({ agentId: ceAgentId, name: ceName, category: ceCategory, wilaya: ceWilaya, pricePerDay: cePrice || undefined, phone: cePhone || undefined, images: ceImages, videos: ceVideo ? [ceVideo] : [], coverMediaType: ceVideo && !ceImages.length ? 'video' : 'image', description: ceDescription || undefined })
      setShowCreateModal(null)
      setCeAgentId(''); setCeName(''); setCeCategory(''); setCeWilaya(''); setCeImages([]); setCeVideo(''); setCeDescription('')
      if (tab === 'equipment') loadEquipment()
    } catch (e: any) { setCreateError(e.message || 'خطأ') } finally { setCreateLoading(false) }
  }

  const handleCreateLand = async () => {
    if (!clAgentId || !clArea || !clWilaya) { setCreateError('الحقول الأساسية مطلوبة'); return }
    setCreateLoading(true); setCreateError('')
    try {
      await apiAdminCreateLand({ agentId: clAgentId, area: clArea, wilaya: clWilaya, commune: clCommune || undefined, goal: clGoal, priceType: clPriceType, price: clPrice || undefined, phone: clPhone || undefined, images: clImages, videos: clVideo ? [clVideo] : [], coverMediaType: clVideo && !clImages.length ? 'video' : 'image', description: clDescription || undefined })
      setShowCreateModal(null)
      setClAgentId(''); setClArea(''); setClWilaya(''); setClImages([]); setClVideo(''); setClDescription(''); setClPhone(''); setClCommune('')
      if (tab === 'lands') loadLands()
    } catch (e: any) { setCreateError(e.message || 'خطأ') } finally { setCreateLoading(false) }
  }

  const handleCreateAdmin = async () => {
    if (!newAdminName || !newAdminPhone || !newAdminPassword || !newAdminWilaya) {
      setCreateAdminError('جميع الحقول مطلوبة'); return
    }
    setCreateAdminLoading(true); setCreateAdminError('')
    try {
      const res = await apiAdminCreateUser({ name: newAdminName, phone: newAdminPhone, password: newAdminPassword, wilaya: newAdminWilaya, commune: newAdminCommune || undefined, role: 'agent', email: newAdminEmail || undefined, profileImage: newAdminProfileImage || undefined })
      const userId = (res as any)?.user?._id || (res as any)?.user?.id || (res as any)?._id
      if (userId) await apiSuperSetAdmin(userId, { isAdmin: true })
      setShowCreateAdmin(false)
      setNewAdminName(''); setNewAdminPhone(''); setNewAdminPassword(''); setNewAdminWilaya(''); setNewAdminCommune(''); setNewAdminEmail(''); setNewAdminProfileImage('')
      const admins = await apiSuperGetAdmins()
      setAdminsList(Array.isArray(admins) ? admins : (admins as any).data || [])
    } catch (e: any) { setCreateAdminError(e.message || 'خطأ') } finally { setCreateAdminLoading(false) }
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f1f5f9', fontFamily: 'Tahoma, Arial, sans-serif' }} dir="rtl">

      {/* ── Mobile backdrop ─────────────────────────────────────────────────── */}
      {isMobile && sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 99 }}
        />
      )}

      {/* ── Sidebar ─────────────────────────────────────────────────────────── */}
      <aside style={{
        width: sidebarOpen ? '240px' : (isMobile ? '0' : '64px'),
        background: 'linear-gradient(180deg, #0f172a 0%, #1e293b 100%)',
        display: 'flex', flexDirection: 'column',
        transition: 'width 0.25s ease, transform 0.25s ease',
        position: 'fixed', top: 0, right: 0, bottom: 0, zIndex: 100,
        overflowX: 'hidden',
        transform: isMobile && !sidebarOpen ? 'translateX(100%)' : 'translateX(0)',
      }}>
        {/* Logo */}
        <div style={{ padding: '20px 16px', borderBottom: '1px solid #334155', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: 'linear-gradient(135deg,#f59e0b,#d97706)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <Shield size={20} color="white" />
          </div>
          {sidebarOpen && (
            <div>
              <div style={{ color: 'white', fontWeight: 900, fontSize: 14, whiteSpace: 'nowrap' }}>لوحة التحكم</div>
              <div style={{ color: '#94a3b8', fontSize: 11, whiteSpace: 'nowrap' }}>منتوج بلادي</div>
            </div>
          )}
        </div>

        {/* Nav items */}
        <nav style={{ flex: 1, padding: '12px 8px' }}>
          {NAV.filter(item => item.id !== 'admins' || isSuperAdmin).map(item => {
            const Icon = item.icon
            const active = tab === item.id
            return (
              <button
                key={item.id}
                onClick={() => { setTab(item.id as Tab); if (isMobile) setSidebarOpen(false) }}
                style={{
                  width: '100%', display: 'flex', alignItems: 'center', gap: 10,
                  padding: '10px 12px', borderRadius: 10, marginBottom: 4,
                  background: active ? 'rgba(245,158,11,0.15)' : 'transparent',
                  border: active ? '1px solid rgba(245,158,11,0.3)' : '1px solid transparent',
                  color: active ? '#f59e0b' : '#94a3b8',
                  cursor: 'pointer', transition: 'all 0.15s', textAlign: 'right',
                  whiteSpace: 'nowrap', overflow: 'hidden',
                }}
              >
                <Icon size={18} style={{ flexShrink: 0 }} />
                {sidebarOpen && <span style={{ fontSize: 13, fontWeight: 700 }}>{item.label}</span>}
              </button>
            )
          })}
        </nav>

        {/* User + logout */}
        <div style={{ padding: '12px 8px', borderTop: '1px solid #334155' }}>
          {sidebarOpen && (
            <div style={{ padding: '8px 12px', marginBottom: 8 }}>
              <div style={{ color: '#f1f5f9', fontSize: 12, fontWeight: 700 }}>{currentUser?.name}</div>
              <div style={{ color: '#64748b', fontSize: 11 }}>مشرف عام 🔑</div>
            </div>
          )}
          <button
            onClick={() => { logout(); navigate('/') }}
            style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', borderRadius: 10, background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', color: '#f87171', cursor: 'pointer', whiteSpace: 'nowrap', overflow: 'hidden' }}
          >
            <LogOut size={18} style={{ flexShrink: 0 }} />
            {sidebarOpen && <span style={{ fontSize: 13, fontWeight: 700 }}>تسجيل الخروج</span>}
          </button>
        </div>
      </aside>

      {/* ── Main content ────────────────────────────────────────────────────── */}
      <main style={{ flex: 1, marginRight: isMobile ? 0 : (sidebarOpen ? '240px' : '64px'), transition: 'margin-right 0.25s ease', minHeight: '100vh', width: '100%', overflowX: 'hidden' }}>

        {/* Top bar */}
        <header style={{ background: 'white', borderBottom: '1px solid #e2e8f0', padding: isMobile ? '0 12px' : '0 24px', height: 56, display: 'flex', alignItems: 'center', gap: 12, position: 'sticky', top: 0, zIndex: 50 }}>
          <button onClick={() => setSidebarOpen(v => !v)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b', display: 'flex', alignItems: 'center' }}>
            <Menu size={20} />
          </button>
          <div style={{ flex: 1 }}>
            <span style={{ fontWeight: 900, color: '#1e293b', fontSize: 16 }}>
              {NAV.find(n => n.id === tab)?.label}
            </span>
          </div>
          {tab === 'stats' && (
            <button onClick={loadStats} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 14px', background: '#f1f5f9', border: '1px solid #e2e8f0', borderRadius: 8, cursor: 'pointer', color: '#475569', fontSize: 13, fontWeight: 700 }}>
              <RefreshCw size={14} /> تحديث
            </button>
          )}
        </header>

        <div style={{ padding: isMobile ? 12 : 24 }}>

          {/* ══ STATS ════════════════════════════════════════════════════════ */}
          {tab === 'stats' && (
            <div>
              {statsLoading ? <Spinner /> : stats && (
                <>
                  {/* KPI row */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 16, marginBottom: 24 }}>
                    {[
                      { label: 'المستخدمون', value: stats.users, icon: '👥', color: '#3b82f6', bg: '#eff6ff' },
                      { label: 'الفلاحون',   value: stats.farmers, icon: '👨‍🌾', color: '#16a34a', bg: '#f0fdf4' },
                      { label: 'المحاصيل',  value: stats.crops, icon: '🌾', color: '#d97706', bg: '#fffbeb' },
                      { label: 'المعدات',    value: stats.equipment, icon: '🔧', color: '#7c3aed', bg: '#f5f3ff' },
                      { label: 'الأراضي',   value: stats.lands, icon: '🌍', color: '#0891b2', bg: '#ecfeff' },
                      { label: 'المحظورون', value: stats.blocked, icon: '🚫', color: '#dc2626', bg: '#fef2f2' },
                    ].map(c => (
                      <div key={c.label} style={{ background: 'white', borderRadius: 16, padding: 20, boxShadow: '0 1px 3px rgba(0,0,0,.06)', border: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', gap: 14 }}>
                        <div style={{ width: 48, height: 48, borderRadius: 12, background: c.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24 }}>{c.icon}</div>
                        <div>
                          <div style={{ fontSize: 26, fontWeight: 900, color: c.color }}>{c.value}</div>
                          <div style={{ fontSize: 12, color: '#94a3b8', fontWeight: 700 }}>{c.label}</div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Charts row */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 16 }}>
                    {/* By Role */}
                    <div style={{ background: 'white', borderRadius: 16, padding: 20, boxShadow: '0 1px 3px rgba(0,0,0,.06)', border: '1px solid #f1f5f9' }}>
                      <h3 style={{ fontWeight: 900, color: '#1e293b', marginBottom: 16, fontSize: 14 }}>المستخدمون حسب الدور</h3>
                      {stats.byRole?.map((r: any) => (
                        <div key={r._id} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                          <div style={{ flex: 1, height: 8, borderRadius: 4, background: '#f1f5f9', overflow: 'hidden' }}>
                            <div style={{ height: '100%', borderRadius: 4, background: ROLE_COLOR[r._id] || '#94a3b8', width: `${Math.round((r.count / stats.users) * 100)}%` }} />
                          </div>
                          <span style={{ fontSize: 13, fontWeight: 700, color: '#475569', minWidth: 60, textAlign: 'right' }}>{ROLE_LABEL[r._id]} ({r.count})</span>
                        </div>
                      ))}
                    </div>

                    {/* By Stage */}
                    <div style={{ background: 'white', borderRadius: 16, padding: 20, boxShadow: '0 1px 3px rgba(0,0,0,.06)', border: '1px solid #f1f5f9' }}>
                      <h3 style={{ fontWeight: 900, color: '#1e293b', marginBottom: 16, fontSize: 14 }}>المحاصيل حسب المرحلة</h3>
                      {stats.byStage?.map((s: any) => (
                        <div key={s._id} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                          <div style={{ flex: 1, height: 8, borderRadius: 4, background: '#f1f5f9', overflow: 'hidden' }}>
                            <div style={{ height: '100%', borderRadius: 4, background: STAGE_COLOR[s._id] || '#94a3b8', width: `${stats.crops > 0 ? Math.round((s.count / stats.crops) * 100) : 0}%` }} />
                          </div>
                          <span style={{ fontSize: 13, fontWeight: 700, color: '#475569', minWidth: 80, textAlign: 'right' }}>
                            {STAGE_LABELS[s._id as keyof typeof STAGE_LABELS] || s._id} ({s.count})
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Recent users */}
                    <div style={{ background: 'white', borderRadius: 16, padding: 20, boxShadow: '0 1px 3px rgba(0,0,0,.06)', border: '1px solid #f1f5f9' }}>
                      <h3 style={{ fontWeight: 900, color: '#1e293b', marginBottom: 16, fontSize: 14 }}>آخر المسجلين</h3>
                      {stats.recentUsers?.map((u: any) => (
                        <div key={u._id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: 8, marginBottom: 8, borderBottom: '1px solid #f8fafc' }}>
                          <span style={{ fontSize: 11, color: '#94a3b8' }}>{new Date(u.createdAt).toLocaleDateString('ar-DZ')}</span>
                          <div style={{ textAlign: 'right' }}>
                            <div style={{ fontSize: 13, fontWeight: 700, color: '#1e293b' }}>{u.name}</div>
                            <div style={{ fontSize: 11, color: '#94a3b8' }}>{u.phone}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>
          )}

          {/* ══ USERS ════════════════════════════════════════════════════════ */}
          {tab === 'users' && (
            <div>
              {/* Toolbar */}
              <div style={{ background: 'white', borderRadius: 12, padding: '14px 16px', marginBottom: 16, display: 'flex', gap: 12, alignItems: 'center', boxShadow: '0 1px 3px rgba(0,0,0,.06)', flexWrap: 'wrap' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, flex: '1 1 200px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 8, padding: '8px 12px' }}>
                  <Search size={14} color="#94a3b8" />
                  <input value={userSearch} onChange={e => { setUserSearch(e.target.value); setUsersPage(1) }} placeholder="ابحث باسم، هاتف، ولاية..." style={{ border: 'none', background: 'transparent', outline: 'none', fontSize: 13, fontWeight: 700, color: '#1e293b', width: '100%' }} />
                </div>
                <div style={{ display: 'flex', gap: 6 }}>
                  {[['', 'الكل'], ['farmer', 'فلاح'], ['buyer', 'مشتري'], ['agent', 'وسيط']].map(([v, l]) => (
                    <button key={v} onClick={() => { setUserRole(v); setUsersPage(1) }} style={{ padding: '6px 12px', borderRadius: 7, fontSize: 12, fontWeight: 700, cursor: 'pointer', background: userRole === v ? '#1e293b' : '#f1f5f9', color: userRole === v ? 'white' : '#475569', border: 'none' }}>{l}</button>
                  ))}
                </div>
                <button onClick={() => { setUserBlocked(userBlocked === 'true' ? '' : 'true'); setUsersPage(1) }} style={{ padding: '6px 12px', borderRadius: 7, fontSize: 12, fontWeight: 700, cursor: 'pointer', background: userBlocked === 'true' ? '#fef2f2' : '#f1f5f9', color: userBlocked === 'true' ? '#dc2626' : '#475569', border: userBlocked === 'true' ? '1px solid #fecaca' : '1px solid transparent' }}>
                  🚫 المحظورون
                </button>
                <button onClick={() => openCreateModal('user')} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 14px', background: '#16a34a', color: 'white', border: 'none', borderRadius: 8, fontWeight: 700, fontSize: 12, cursor: 'pointer' }}>
                  <Plus size={14} /> إضافة مستخدم
                </button>
                <span style={{ fontSize: 12, color: '#94a3b8', fontWeight: 700, marginRight: 'auto' }}>{usersTotal} مستخدم</span>
              </div>

              {/* Table */}
              <div style={{ background: 'white', borderRadius: 12, boxShadow: '0 1px 3px rgba(0,0,0,.06)', overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13, minWidth: 640 }}>
                  <thead>
                    <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                      {['الاسم', 'الهاتف', 'الدور', 'الولاية', 'تاريخ التسجيل', 'الحالة', ...(isSuperAdmin ? ['مستوى AI'] : []), 'إجراءات'].map(h => (
                        <th key={h} style={{ padding: '12px 16px', textAlign: 'right', fontWeight: 900, color: '#475569', fontSize: 12 }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {usersLoading ? (
                      <tr><td colSpan={isSuperAdmin ? 8 : 7} style={{ textAlign: 'center', padding: 40 }}><Spinner /></td></tr>
                    ) : users.map(u => (
                      <tr key={u._id} style={{ borderBottom: '1px solid #f1f5f9', background: u.isBlocked ? '#fef2f2' : 'white' }}>
                        <td style={{ padding: '12px 16px' }}>
                          <div style={{ fontWeight: 700, color: '#1e293b' }}>{u.name}</div>
                          {u.isAdmin && <span style={{ fontSize: 10, background: '#fef3c7', color: '#92400e', padding: '1px 6px', borderRadius: 4, fontWeight: 900 }}>🔑 مشرف</span>}
                        </td>
                        <td style={{ padding: '12px 16px', color: '#64748b', direction: 'ltr', textAlign: 'right' }}>{u.phone}</td>
                        <td style={{ padding: '12px 16px' }}>
                          <span style={{ padding: '3px 8px', borderRadius: 6, fontSize: 11, fontWeight: 700, background: (ROLE_COLOR[u.role] || '#94a3b8') + '22', color: ROLE_COLOR[u.role] || '#64748b' }}>
                            {ROLE_LABEL[u.role] || u.role}
                          </span>
                        </td>
                        <td style={{ padding: '12px 16px', color: '#64748b' }}>{u.wilaya}</td>
                        <td style={{ padding: '12px 16px', color: '#94a3b8', fontSize: 12 }}>{new Date(u.createdAt).toLocaleDateString('ar-DZ')}</td>
                        <td style={{ padding: '12px 16px' }}>
                          <span style={{ padding: '3px 8px', borderRadius: 6, fontSize: 11, fontWeight: 700, background: u.isBlocked ? '#fef2f2' : '#f0fdf4', color: u.isBlocked ? '#dc2626' : '#16a34a' }}>
                            {u.isBlocked ? 'محظور' : 'نشط'}
                          </span>
                        </td>
                        {isSuperAdmin && (
                          <td style={{ padding: '12px 16px' }}>
                            <div style={{ display: 'flex', gap: 4 }}>
                              {([1, 2, 3] as const).map(lvl => {
                                const labels: Record<number, string> = { 1: '🆓 20', 2: '⭐ 100', 3: '🔑 1500' }
                                const colors: Record<number, string> = { 1: '#64748b', 2: '#d97706', 3: '#7c3aed' }
                                const active = (u.aiLevel || 1) === lvl
                                return (
                                  <button key={lvl} onClick={() => handleAiLevel(u._id, lvl)}
                                    style={{ padding: '3px 7px', borderRadius: 6, fontSize: 10, fontWeight: 900, border: 'none', cursor: 'pointer', background: active ? colors[lvl] : '#f1f5f9', color: active ? 'white' : '#94a3b8' }}>
                                    {labels[lvl]}
                                  </button>
                                )
                              })}
                            </div>
                          </td>
                        )}
                        <td style={{ padding: '12px 16px' }}>
                          <div style={{ display: 'flex', gap: 6 }}>
                            <ActionBtn onClick={() => openEditUser(u)} color="#2563eb" title="تعديل">
                              <Edit2 size={14} />
                            </ActionBtn>
                            <ActionBtn onClick={() => openBadgeModal(u)} color="#d97706" title="إدارة الأوسمة">
                              <span style={{ fontSize: 12 }}>🏅</span>
                            </ActionBtn>
                            {isSuperAdmin && !u.isAdmin && (
                              <ActionBtn onClick={() => handleLoginAs(u)} color="#7c3aed" title="دخول كهذا المستخدم">
                                <span style={{ fontSize: 12 }}>🔐</span>
                              </ActionBtn>
                            )}
                            {!u.isAdmin && (
                              <>
                                <ActionBtn onClick={() => handleBlock(u._id)} color={u.isBlocked ? '#16a34a' : '#dc2626'} title={u.isBlocked ? 'رفع الحظر' : 'حظر'}>
                                  {u.isBlocked ? <CheckCircle size={14} /> : <Ban size={14} />}
                                </ActionBtn>
                                <ActionBtn onClick={() => handleDeleteUser(u._id)} color="#dc2626" title="حذف">
                                  <Trash2 size={14} />
                                </ActionBtn>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <Pagination page={usersPage} total={usersTotal} limit={20} onPage={setUsersPage} />
            </div>
          )}

          {/* ══ CROPS ════════════════════════════════════════════════════════ */}
          {tab === 'crops' && (
            <div>
              {/* Toolbar */}
              <div style={{ background: 'white', borderRadius: 12, padding: '14px 16px', marginBottom: 16, display: 'flex', gap: 10, alignItems: 'center', boxShadow: '0 1px 3px rgba(0,0,0,.06)', flexWrap: 'wrap' }}>
                {/* Search */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, flex: '1 1 200px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 8, padding: '8px 12px' }}>
                  <Search size={14} color="#94a3b8" />
                  <input value={cropSearch} onChange={e => { setCropSearch(e.target.value); setCropsPage(1) }} placeholder="ابحث بالولاية، النوع، الوصف..." style={{ border: 'none', background: 'transparent', outline: 'none', fontSize: 13, fontWeight: 700, color: '#1e293b', width: '100%' }} />
                </div>
                {/* Stage filter */}
                <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
                  {[['', 'الكل 🌐'], ['seeds', '🌱 بذرة'], ['growth', '🌿 نمو'], ['flowering', '🌸 إزهار'], ['ready', '✅ جاهز']].map(([v, l]) => (
                    <button key={v} onClick={() => { setCropStage(v); setCropsPage(1) }} style={{ padding: '6px 11px', borderRadius: 7, fontSize: 12, fontWeight: 700, cursor: 'pointer', background: cropStage === v ? (STAGE_COLOR[v] || '#1e293b') : '#f1f5f9', color: cropStage === v ? 'white' : '#475569', border: 'none', whiteSpace: 'nowrap' }}>{l}</button>
                  ))}
                </div>
                {/* Status filter */}
                <div style={{ display: 'flex', gap: 5 }}>
                  {[['', 'كل الحالات'], ['pending', '⏳ بانتظار'], ['approved', '✅ مقبول'], ['rejected', '✗ مرفوض']].map(([v, l]) => (
                    <button key={v} onClick={() => { setCropStatusFilter(v); setCropsPage(1) }} style={{ padding: '6px 11px', borderRadius: 7, fontSize: 12, fontWeight: 700, cursor: 'pointer', background: cropStatusFilter === v ? '#1e293b' : '#f1f5f9', color: cropStatusFilter === v ? 'white' : '#475569', border: 'none', whiteSpace: 'nowrap' }}>{l}</button>
                  ))}
                </div>
                {/* View toggle */}
                <div style={{ display: 'flex', gap: 4, background: '#f1f5f9', borderRadius: 8, padding: 3 }}>
                  <button onClick={() => setCropsView('cards')} style={{ padding: '5px 10px', borderRadius: 6, border: 'none', cursor: 'pointer', background: cropsView === 'cards' ? 'white' : 'transparent', color: cropsView === 'cards' ? '#1e293b' : '#94a3b8', boxShadow: cropsView === 'cards' ? '0 1px 3px rgba(0,0,0,.1)' : 'none' }}>
                    <LayoutGrid size={15} />
                  </button>
                  <button onClick={() => setCropsView('table')} style={{ padding: '5px 10px', borderRadius: 6, border: 'none', cursor: 'pointer', background: cropsView === 'table' ? 'white' : 'transparent', color: cropsView === 'table' ? '#1e293b' : '#94a3b8', boxShadow: cropsView === 'table' ? '0 1px 3px rgba(0,0,0,.1)' : 'none' }}>
                    <Table2 size={15} />
                  </button>
                </div>
                <span style={{ fontSize: 12, color: '#94a3b8', fontWeight: 700, marginRight: 'auto' }}>
                  {cropsTotal} محصول
                </span>
                {/* Auto-approve toggle */}
                {autoApprove !== null && (
                  <button
                    onClick={() => handleToggleAutoApprove('crops')}
                    style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 14px', borderRadius: 8, border: 'none', cursor: 'pointer', fontWeight: 700, fontSize: 12, background: autoApprove.crops ? '#f0fdf4' : '#fef2f2', color: autoApprove.crops ? '#16a34a' : '#dc2626' }}
                    title="تفعيل/تعطيل القبول التلقائي للمحاصيل"
                  >
                    {autoApprove.crops ? '✅ قبول تلقائي' : '⏳ مراجعة يدوية'}
                  </button>
                )}
                <button onClick={() => openCreateModal('crop')} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 14px', background: '#16a34a', color: 'white', border: 'none', borderRadius: 8, fontWeight: 700, fontSize: 12, cursor: 'pointer' }}>
                  <Plus size={14} /> إضافة
                </button>
              </div>

              {cropsLoading ? <Spinner /> : cropsView === 'cards' ? (
                /* ── Cards view ── */
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
                  {crops.length === 0 && (
                    <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: 60, color: '#94a3b8' }}>
                      <div style={{ fontSize: 48, marginBottom: 12 }}>🌾</div>
                      <div style={{ fontWeight: 700, fontSize: 15 }}>لا توجد محاصيل</div>
                    </div>
                  )}
                  {crops.map(c => {
                    const hasVideo = c.videos?.length > 0
                    const coverImg = c.coverMediaType === 'video' || (!c.images?.length && hasVideo) ? null : c.images?.[0]
                    return (
                      <div key={c._id} style={{ background: 'white', borderRadius: 16, overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,.07)', border: '1px solid #f1f5f9', display: 'flex', flexDirection: 'column' }}>
                        {/* Media */}
                        <div style={{ position: 'relative', height: 160, background: '#f8fafc', overflow: 'hidden' }}>
                          {coverImg ? (
                            <img src={coverImg} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          ) : hasVideo ? (
                            <video src={c.videos[0]} style={{ width: '100%', height: '100%', objectFit: 'cover' }} muted />
                          ) : (
                            <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 56 }}>
                              {CROP_LABELS[c.type as keyof typeof CROP_LABELS] ? '🌾' : '🌿'}
                            </div>
                          )}
                          {/* Stage badge */}
                          <div style={{ position: 'absolute', top: 10, right: 10 }}>
                            <span style={{ padding: '4px 10px', borderRadius: 20, fontSize: 11, fontWeight: 700, background: STAGE_COLOR[c.stage] || '#94a3b8', color: 'white', boxShadow: '0 2px 6px rgba(0,0,0,.2)' }}>
                              {STAGE_LABELS[c.stage as keyof typeof STAGE_LABELS] || c.stage}
                            </span>
                          </div>
                          {/* Video indicator */}
                          {hasVideo && (
                            <div style={{ position: 'absolute', top: 10, left: 10, background: 'rgba(0,0,0,.6)', borderRadius: 6, padding: '3px 7px', display: 'flex', alignItems: 'center', gap: 4 }}>
                              <Video size={11} color="white" />
                              <span style={{ fontSize: 11, color: 'white', fontWeight: 700 }}>{c.videos.length}</span>
                            </div>
                          )}
                          {/* Image count */}
                          {c.images?.length > 0 && (
                            <div style={{ position: 'absolute', bottom: 10, left: 10, background: 'rgba(0,0,0,.5)', borderRadius: 6, padding: '2px 8px', fontSize: 11, color: 'white', fontWeight: 700 }}>
                              📷 {c.images.length}
                            </div>
                          )}
                        </div>
                        {/* Info */}
                        <div style={{ padding: '14px 16px', flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
                          {/* Crop type + date */}
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <div style={{ fontWeight: 900, fontSize: 15, color: '#1e293b' }}>
                              {CROP_LABELS[c.type as keyof typeof CROP_LABELS] || c.type}
                            </div>
                            <div style={{ fontSize: 11, color: '#94a3b8' }}>{new Date(c.createdAt).toLocaleDateString('ar-DZ')}</div>
                          </div>
                          {/* Farmer */}
                          <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#475569', fontSize: 12 }}>
                            <span>👨‍🌾</span>
                            <span style={{ fontWeight: 700 }}>{c.farmerName}</span>
                            {c.farmerPhone && <span style={{ color: '#94a3b8', direction: 'ltr' }}>{c.farmerPhone}</span>}
                          </div>
                          {/* Location */}
                          <div style={{ display: 'flex', alignItems: 'center', gap: 5, color: '#64748b', fontSize: 12 }}>
                            <MapPin size={12} color="#94a3b8" />
                            <span>{c.wilaya}</span>
                          </div>
                          {/* Stats row */}
                          <div style={{ display: 'flex', gap: 12, marginTop: 4 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, color: '#475569' }}>
                              <Scale size={12} color="#94a3b8" />
                              <span style={{ fontWeight: 700 }}>{c.estimatedQuantityKg >= 1000 ? `${(c.estimatedQuantityKg/1000).toFixed(1)} طن` : `${c.estimatedQuantityKg} كغ`}</span>
                            </div>
                            {c.pricePerKg && (
                              <div style={{ fontSize: 12, color: '#16a34a', fontWeight: 700 }}>
                                {c.pricePerKg} دج/كغ
                              </div>
                            )}
                            {c.inspectionRequests?.length > 0 && (
                              <div style={{ fontSize: 11, color: '#7c3aed', fontWeight: 700 }}>👁 {c.inspectionRequests.length}</div>
                            )}
                            {c.preOrders?.length > 0 && (
                              <div style={{ fontSize: 11, color: '#2563eb', fontWeight: 700 }}>📦 {c.preOrders.length}</div>
                            )}
                          </div>
                        </div>
                        {/* Footer actions */}
                        <div style={{ padding: '10px 16px', borderTop: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                            <span style={{ fontSize: 10, padding: '2px 7px', borderRadius: 5, fontWeight: 700, background: c.status === 'approved' ? '#f0fdf4' : c.status === 'rejected' ? '#fef2f2' : '#fef9c3', color: c.status === 'approved' ? '#16a34a' : c.status === 'rejected' ? '#dc2626' : '#ca8a04' }}>
                              {c.status === 'approved' ? 'مقبول' : c.status === 'rejected' ? 'مرفوض' : 'بانتظار'}
                            </span>
                          </div>
                          <div style={{ display: 'flex', gap: 5 }}>
                            {c.status !== 'approved' && (
                              <ActionBtn onClick={() => handleCropStatus(c._id, 'approved')} color="#16a34a" title="قبول"><CheckCircle size={14} /></ActionBtn>
                            )}
                            {c.status !== 'rejected' && (
                              <ActionBtn onClick={() => handleCropStatus(c._id, 'rejected')} color="#f59e0b" title="رفض"><X size={14} /></ActionBtn>
                            )}
                            <ActionBtn onClick={() => navigate(`/app-admin/edit-crop/${c._id}`)} color="#2563eb" title="تعديل"><Edit2 size={14} /></ActionBtn>
                            {isSuperAdmin && c.farmerId && (
                              <ActionBtn onClick={() => handleLoginAs({ _id: c.farmerId, name: c.farmerName })} color="#7c3aed" title="دخول كالفلاح">
                                <span style={{ fontSize: 12 }}>🔐</span>
                              </ActionBtn>
                            )}
                            <ActionBtn onClick={() => handleDeleteCrop(c._id)} color="#dc2626" title="حذف المحصول">
                              <Trash2 size={14} />
                            </ActionBtn>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              ) : (
                /* ── Table view ── */
                <div style={{ background: 'white', borderRadius: 12, boxShadow: '0 1px 3px rgba(0,0,0,.06)', overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13, minWidth: 700 }}>
                    <thead>
                      <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                        {['الصورة', 'المحصول', 'الفلاح', 'الولاية', 'الكمية', 'السعر', 'المرحلة', 'الطلبات', 'التاريخ', ''].map(h => (
                          <th key={h} style={{ padding: '12px 14px', textAlign: 'right', fontWeight: 900, color: '#475569', fontSize: 12 }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {crops.length === 0 && (
                        <tr><td colSpan={10} style={{ textAlign: 'center', padding: 40, color: '#94a3b8', fontWeight: 700 }}>لا توجد محاصيل</td></tr>
                      )}
                      {crops.map(c => {
                        const coverImg = c.coverMediaType !== 'video' && c.images?.length ? c.images[0] : null
                        return (
                          <tr key={c._id} style={{ borderBottom: '1px solid #f8fafc' }}>
                            <td style={{ padding: '10px 14px' }}>
                              <div style={{ width: 52, height: 52, borderRadius: 10, overflow: 'hidden', background: '#f1f5f9', flexShrink: 0 }}>
                                {coverImg ? (
                                  <img src={coverImg} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                ) : c.videos?.length ? (
                                  <video src={c.videos[0]} style={{ width: '100%', height: '100%', objectFit: 'cover' }} muted />
                                ) : (
                                  <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24 }}>🌾</div>
                                )}
                              </div>
                            </td>
                            <td style={{ padding: '10px 14px', fontWeight: 700, color: '#1e293b' }}>
                              {CROP_LABELS[c.type as keyof typeof CROP_LABELS] || c.type}
                            </td>
                            <td style={{ padding: '10px 14px' }}>
                              <div style={{ fontWeight: 700, color: '#374151', fontSize: 12 }}>{c.farmerName}</div>
                              {c.farmerPhone && <div style={{ color: '#94a3b8', fontSize: 11, direction: 'ltr', textAlign: 'right' }}>{c.farmerPhone}</div>}
                            </td>
                            <td style={{ padding: '10px 14px', color: '#64748b' }}>{c.wilaya}</td>
                            <td style={{ padding: '10px 14px', color: '#475569', fontWeight: 700 }}>
                              {c.estimatedQuantityKg >= 1000 ? `${(c.estimatedQuantityKg/1000).toFixed(1)} طن` : `${c.estimatedQuantityKg} كغ`}
                            </td>
                            <td style={{ padding: '10px 14px', color: c.pricePerKg ? '#16a34a' : '#94a3b8', fontWeight: 700 }}>
                              {c.pricePerKg ? `${c.pricePerKg} دج` : '—'}
                            </td>
                            <td style={{ padding: '10px 14px' }}>
                              <span style={{ padding: '3px 8px', borderRadius: 6, fontSize: 11, fontWeight: 700, background: (STAGE_COLOR[c.stage] || '#94a3b8') + '22', color: STAGE_COLOR[c.stage] || '#64748b' }}>
                                {STAGE_LABELS[c.stage as keyof typeof STAGE_LABELS] || c.stage}
                              </span>
                            </td>
                            <td style={{ padding: '10px 14px' }}>
                              <div style={{ display: 'flex', gap: 6 }}>
                                {c.inspectionRequests?.length > 0 && <span style={{ fontSize: 11, color: '#7c3aed', fontWeight: 700 }}>👁 {c.inspectionRequests.length}</span>}
                                {c.preOrders?.length > 0 && <span style={{ fontSize: 11, color: '#2563eb', fontWeight: 700 }}>📦 {c.preOrders.length}</span>}
                                {!c.inspectionRequests?.length && !c.preOrders?.length && <span style={{ color: '#cbd5e1', fontSize: 12 }}>—</span>}
                              </div>
                            </td>
                            <td style={{ padding: '10px 14px', color: '#94a3b8', fontSize: 11 }}>{new Date(c.createdAt).toLocaleDateString('ar-DZ')}</td>
                            <td style={{ padding: '10px 14px' }}>
                              <div style={{ display: 'flex', gap: 4 }}>
                                <span style={{ fontSize: 10, padding: '2px 6px', borderRadius: 5, fontWeight: 700, background: c.status === 'approved' ? '#f0fdf4' : c.status === 'rejected' ? '#fef2f2' : '#fef9c3', color: c.status === 'approved' ? '#16a34a' : c.status === 'rejected' ? '#dc2626' : '#ca8a04' }}>
                                  {c.status === 'approved' ? '✓' : c.status === 'rejected' ? '✗' : '⏳'}
                                </span>
                                {c.status !== 'approved' && <ActionBtn onClick={() => handleCropStatus(c._id, 'approved')} color="#16a34a" title="قبول"><CheckCircle size={13} /></ActionBtn>}
                                {c.status !== 'rejected' && <ActionBtn onClick={() => handleCropStatus(c._id, 'rejected')} color="#f59e0b" title="رفض"><X size={13} /></ActionBtn>}
                                <ActionBtn onClick={() => navigate(`/app-admin/edit-crop/${c._id}`)} color="#2563eb" title="تعديل"><Edit2 size={13} /></ActionBtn>
                                {isSuperAdmin && c.farmerId && (
                                  <ActionBtn onClick={() => handleLoginAs({ _id: c.farmerId, name: c.farmerName })} color="#7c3aed" title="دخول كالفلاح"><span style={{ fontSize: 11 }}>🔐</span></ActionBtn>
                                )}
                                <ActionBtn onClick={() => handleDeleteCrop(c._id)} color="#dc2626" title="حذف"><Trash2 size={14} /></ActionBtn>
                              </div>
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              )}

              <Pagination page={cropsPage} total={cropsTotal} limit={20} onPage={setCropsPage} />
            </div>
          )}

          {/* ══ EQUIPMENT ════════════════════════════════════════════════════ */}
          {tab === 'equipment' && (
            <div>
              <div style={{ background: 'white', borderRadius: 12, padding: '14px 16px', marginBottom: 16, display: 'flex', gap: 10, alignItems: 'center', boxShadow: '0 1px 3px rgba(0,0,0,.06)', flexWrap: 'wrap' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, flex: '1 1 200px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 8, padding: '8px 12px' }}>
                  <Search size={14} color="#94a3b8" />
                  <input value={eqSearch} onChange={e => { setEqSearch(e.target.value); setEqPage(1) }} placeholder="ابحث بالاسم، الولاية، الوصف..." style={{ border: 'none', background: 'transparent', outline: 'none', fontSize: 13, fontWeight: 700, color: '#1e293b', width: '100%' }} />
                </div>
                <div style={{ display: 'flex', gap: 5 }}>
                  {[['', 'الكل'], ['pending', '⏳ بانتظار'], ['approved', '✅ مقبول'], ['rejected', '✗ مرفوض']].map(([v, l]) => (
                    <button key={v} onClick={() => { setEqStatus(v); setEqPage(1) }} style={{ padding: '6px 11px', borderRadius: 7, fontSize: 12, fontWeight: 700, cursor: 'pointer', background: eqStatus === v ? '#1e293b' : '#f1f5f9', color: eqStatus === v ? 'white' : '#475569', border: 'none', whiteSpace: 'nowrap' }}>{l}</button>
                  ))}
                </div>
                <span style={{ fontSize: 12, color: '#94a3b8', fontWeight: 700, marginRight: 'auto' }}>{eqTotal} معدة</span>
                {autoApprove !== null && (
                  <button onClick={() => handleToggleAutoApprove('equipment')} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 14px', borderRadius: 8, border: 'none', cursor: 'pointer', fontWeight: 700, fontSize: 12, background: autoApprove.equipment ? '#f0fdf4' : '#fef2f2', color: autoApprove.equipment ? '#16a34a' : '#dc2626' }}>
                    {autoApprove.equipment ? '✅ قبول تلقائي' : '⏳ مراجعة يدوية'}
                  </button>
                )}
                <button onClick={() => openCreateModal('equipment')} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 14px', background: '#16a34a', color: 'white', border: 'none', borderRadius: 8, fontWeight: 700, fontSize: 12, cursor: 'pointer' }}>
                  <Plus size={14} /> إضافة
                </button>
              </div>

              {eqLoading ? <Spinner /> : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
                  {eqList.length === 0 && (
                    <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: 60, color: '#94a3b8' }}>
                      <div style={{ fontSize: 48, marginBottom: 12 }}>🔧</div>
                      <div style={{ fontWeight: 700, fontSize: 15 }}>لا توجد معدات</div>
                    </div>
                  )}
                  {eqList.map(eq => {
                    const coverImg = eq.coverMediaType !== 'video' && eq.images?.length ? eq.images[0] : null
                    return (
                      <div key={eq._id} style={{ background: 'white', borderRadius: 16, overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,.07)', border: `1px solid ${eq.status === 'pending' ? '#fde68a' : eq.status === 'rejected' ? '#fecaca' : '#f1f5f9'}` }}>
                        <div style={{ height: 140, background: '#f8fafc', overflow: 'hidden', position: 'relative' }}>
                          {coverImg ? <img src={coverImg} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> :
                           eq.videos?.length ? <video src={eq.videos[0]} style={{ width: '100%', height: '100%', objectFit: 'cover' }} muted /> :
                           <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 48 }}>🔧</div>}
                          <span style={{ position: 'absolute', top: 8, right: 8, fontSize: 10, padding: '2px 8px', borderRadius: 10, fontWeight: 700, background: eq.status === 'approved' ? '#16a34a' : eq.status === 'rejected' ? '#dc2626' : '#f59e0b', color: 'white' }}>
                            {eq.status === 'approved' ? 'مقبول' : eq.status === 'rejected' ? 'مرفوض' : 'بانتظار'}
                          </span>
                        </div>
                        <div style={{ padding: '12px 14px' }}>
                          <div style={{ fontWeight: 900, fontSize: 14, color: '#1e293b', marginBottom: 4 }}>{eq.name}</div>
                          <div style={{ fontSize: 12, color: '#64748b', marginBottom: 2 }}>📂 {eq.category}</div>
                          <div style={{ fontSize: 12, color: '#64748b', marginBottom: 2 }}>📍 {eq.wilaya}</div>
                          {eq.pricePerDay && <div style={{ fontSize: 12, color: '#16a34a', fontWeight: 700 }}>{eq.pricePerDay} دج/يوم</div>}
                          <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 4 }}>{new Date(eq.createdAt).toLocaleDateString('ar-DZ')}</div>
                        </div>
                        <div style={{ padding: '10px 14px', borderTop: '1px solid #f1f5f9', display: 'flex', justifyContent: 'flex-end', gap: 6 }}>
                          {eq.status !== 'approved' && <ActionBtn onClick={() => handleEqStatus(eq._id, 'approved')} color="#16a34a" title="قبول"><CheckCircle size={14} /></ActionBtn>}
                          {eq.status !== 'rejected' && <ActionBtn onClick={() => handleEqStatus(eq._id, 'rejected')} color="#f59e0b" title="رفض"><X size={14} /></ActionBtn>}
                          <ActionBtn onClick={() => navigate(`/app-admin/edit-equipment/${eq._id}`)} color="#2563eb" title="تعديل"><Edit2 size={14} /></ActionBtn>
                          <ActionBtn onClick={() => handleDeleteEq(eq._id)} color="#dc2626" title="حذف"><Trash2 size={14} /></ActionBtn>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
              <Pagination page={eqPage} total={eqTotal} limit={20} onPage={setEqPage} />
            </div>
          )}

          {/* ══ LANDS ════════════════════════════════════════════════════════ */}
          {tab === 'lands' && (
            <div>
              <div style={{ background: 'white', borderRadius: 12, padding: '14px 16px', marginBottom: 16, display: 'flex', gap: 10, alignItems: 'center', boxShadow: '0 1px 3px rgba(0,0,0,.06)', flexWrap: 'wrap' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, flex: '1 1 200px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 8, padding: '8px 12px' }}>
                  <Search size={14} color="#94a3b8" />
                  <input value={landSearch} onChange={e => { setLandSearch(e.target.value); setLandPage(1) }} placeholder="ابحث بالولاية أو الوصف..." style={{ border: 'none', background: 'transparent', outline: 'none', fontSize: 13, fontWeight: 700, color: '#1e293b', width: '100%' }} />
                </div>
                <div style={{ display: 'flex', gap: 5 }}>
                  {[['', 'الكل'], ['pending', '⏳ بانتظار'], ['approved', '✅ مقبول'], ['rejected', '✗ مرفوض']].map(([v, l]) => (
                    <button key={v} onClick={() => { setLandStatus(v); setLandPage(1) }} style={{ padding: '6px 11px', borderRadius: 7, fontSize: 12, fontWeight: 700, cursor: 'pointer', background: landStatus === v ? '#1e293b' : '#f1f5f9', color: landStatus === v ? 'white' : '#475569', border: 'none', whiteSpace: 'nowrap' }}>{l}</button>
                  ))}
                </div>
                <span style={{ fontSize: 12, color: '#94a3b8', fontWeight: 700, marginRight: 'auto' }}>{landTotal} أرض</span>
                {autoApprove !== null && (
                  <button onClick={() => handleToggleAutoApprove('lands')} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 14px', borderRadius: 8, border: 'none', cursor: 'pointer', fontWeight: 700, fontSize: 12, background: autoApprove.lands ? '#f0fdf4' : '#fef2f2', color: autoApprove.lands ? '#16a34a' : '#dc2626' }}>
                    {autoApprove.lands ? '✅ قبول تلقائي' : '⏳ مراجعة يدوية'}
                  </button>
                )}
                <button onClick={() => openCreateModal('land')} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 14px', background: '#16a34a', color: 'white', border: 'none', borderRadius: 8, fontWeight: 700, fontSize: 12, cursor: 'pointer' }}>
                  <Plus size={14} /> إضافة
                </button>
              </div>

              {landsLoading ? <Spinner /> : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
                  {landList.length === 0 && (
                    <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: 60, color: '#94a3b8' }}>
                      <div style={{ fontSize: 48, marginBottom: 12 }}>🌍</div>
                      <div style={{ fontWeight: 700, fontSize: 15 }}>لا توجد أراضي</div>
                    </div>
                  )}
                  {landList.map(land => {
                    const coverImg = land.coverMediaType !== 'video' && land.images?.length ? land.images[0] : null
                    return (
                      <div key={land._id} style={{ background: 'white', borderRadius: 16, overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,.07)', border: `1px solid ${land.status === 'pending' ? '#fde68a' : land.status === 'rejected' ? '#fecaca' : '#f1f5f9'}` }}>
                        <div style={{ height: 140, background: '#f8fafc', overflow: 'hidden', position: 'relative' }}>
                          {coverImg ? <img src={coverImg} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> :
                           land.videos?.length ? <video src={land.videos[0]} style={{ width: '100%', height: '100%', objectFit: 'cover' }} muted /> :
                           <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 48 }}>🌍</div>}
                          <span style={{ position: 'absolute', top: 8, right: 8, fontSize: 10, padding: '2px 8px', borderRadius: 10, fontWeight: 700, background: land.status === 'approved' ? '#16a34a' : land.status === 'rejected' ? '#dc2626' : '#f59e0b', color: 'white' }}>
                            {land.status === 'approved' ? 'مقبول' : land.status === 'rejected' ? 'مرفوض' : 'بانتظار'}
                          </span>
                          <span style={{ position: 'absolute', top: 8, left: 8, fontSize: 10, padding: '2px 8px', borderRadius: 10, fontWeight: 700, background: 'rgba(0,0,0,0.6)', color: 'white' }}>
                            {land.goal}
                          </span>
                        </div>
                        <div style={{ padding: '12px 14px' }}>
                          <div style={{ fontWeight: 900, fontSize: 14, color: '#1e293b', marginBottom: 4 }}>{land.area} هكتار</div>
                          <div style={{ fontSize: 12, color: '#64748b', marginBottom: 2 }}>📍 {land.wilaya}{land.commune ? ` - ${land.commune}` : ''}</div>
                          {land.price && <div style={{ fontSize: 12, color: '#16a34a', fontWeight: 700 }}>{land.price.toLocaleString()} دج — {land.priceType}</div>}
                          {land.features?.length > 0 && <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 4 }}>{land.features.slice(0, 3).join(' • ')}</div>}
                          <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 4 }}>{new Date(land.createdAt).toLocaleDateString('ar-DZ')}</div>
                        </div>
                        <div style={{ padding: '10px 14px', borderTop: '1px solid #f1f5f9', display: 'flex', justifyContent: 'flex-end', gap: 6 }}>
                          {land.status !== 'approved' && <ActionBtn onClick={() => handleLandStatus(land._id, 'approved')} color="#16a34a" title="قبول"><CheckCircle size={14} /></ActionBtn>}
                          {land.status !== 'rejected' && <ActionBtn onClick={() => handleLandStatus(land._id, 'rejected')} color="#f59e0b" title="رفض"><X size={14} /></ActionBtn>}
                          <ActionBtn onClick={() => navigate(`/app-admin/edit-land/${land._id}`)} color="#2563eb" title="تعديل"><Edit2 size={14} /></ActionBtn>
                          <ActionBtn onClick={() => handleDeleteLandItem(land._id)} color="#dc2626" title="حذف"><Trash2 size={14} /></ActionBtn>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
              <Pagination page={landPage} total={landTotal} limit={20} onPage={setLandPage} />
            </div>
          )}

          {/* ══ FARMERS ══════════════════════════════════════════════════════ */}
          {tab === 'farmers' && (
            <div>
              <div style={{ background: 'white', borderRadius: 12, padding: '14px 16px', marginBottom: 16, display: 'flex', gap: 12, alignItems: 'center', boxShadow: '0 1px 3px rgba(0,0,0,.06)', flexWrap: 'wrap' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, flex: '1 1 200px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 8, padding: '8px 12px' }}>
                  <Search size={14} color="#94a3b8" />
                  <input value={farmerSearch} onChange={e => { setFarmerSearch(e.target.value); setFarmersPage(1) }} placeholder="ابحث باسم الفلاح أو الولاية..." style={{ border: 'none', background: 'transparent', outline: 'none', fontSize: 13, fontWeight: 700, color: '#1e293b', width: '100%' }} />
                </div>
                <span style={{ fontSize: 12, color: '#94a3b8', fontWeight: 700, marginRight: 'auto' }}>{farmersTotal} فلاح</span>
              </div>
              <div style={{ background: 'white', borderRadius: 12, boxShadow: '0 1px 3px rgba(0,0,0,.06)', overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13, minWidth: 500 }}>
                  <thead>
                    <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                      {['الاسم', 'الولاية', 'التخصص', 'الصفقات', 'التقييم', 'إجراءات'].map(h => (
                        <th key={h} style={{ padding: '12px 16px', textAlign: 'right', fontWeight: 900, color: '#475569', fontSize: 12 }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {farmersLoading ? (
                      <tr><td colSpan={6} style={{ textAlign: 'center', padding: 40 }}><Spinner /></td></tr>
                    ) : farmers.map(f => (
                      <tr key={f._id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                        <td style={{ padding: '12px 16px', fontWeight: 700, color: '#1e293b' }}>{f.name}</td>
                        <td style={{ padding: '12px 16px', color: '#64748b' }}>{f.wilaya}{f.commune ? ` · ${f.commune}` : ''}</td>
                        <td style={{ padding: '12px 16px', color: '#64748b' }}>{f.specialization || '—'}</td>
                        <td style={{ padding: '12px 16px', color: '#64748b' }}>{f.dealsCompleted}</td>
                        <td style={{ padding: '12px 16px', color: '#d97706', fontWeight: 700 }}>⭐ {f.trustScore?.toFixed(1)}</td>
                        <td style={{ padding: '12px 16px' }}>
                          <ActionBtn onClick={() => handleDeleteFarmer(f._id)} color="#dc2626" title="حذف"><Trash2 size={14} /></ActionBtn>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <Pagination page={farmersPage} total={farmersTotal} limit={20} onPage={setFarmersPage} />
            </div>
          )}

          {/* ══ LANDING PAGE SETTINGS ════════════════════════════════════════ */}
          {tab === 'landing' && (
            <div style={{ background: 'white', borderRadius: 16, padding: 24, boxShadow: '0 1px 3px rgba(0,0,0,.06)', border: '1px solid #f1f5f9' }}>
              <div style={{ borderBottom: '1px solid #f1f5f9', paddingBottom: 16, marginBottom: 20 }}>
                <h2 style={{ fontWeight: 900, color: '#1e293b', fontSize: 18, margin: 0 }}>⚙️ إعدادات صفحة الهبوط</h2>
                <p style={{ color: '#94a3b8', fontSize: 13, margin: '4px 0 0' }}>تعديل محتوى الصفحة الأولى للمنصة وتحديث روابط التحميل والإحصائيات مباشرة.</p>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 20, maxWidth: 640 }}>
                {/* Hero Title */}
                <div>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 900, color: '#475569', marginBottom: 6 }}>عنوان صفحة الهبوط الرئيسي (Hero Title)</label>
                  <input 
                    type="text" 
                    value={landingForm.heroTitle} 
                    onChange={e => setLandingForm(prev => ({ ...prev, heroTitle: e.target.value }))}
                    style={{ width: '100%', padding: '12px 14px', borderRadius: 10, border: '2px solid #e2e8f0', fontSize: 14, fontWeight: 700, outline: 'none', boxSizing: 'border-box' }}
                  />
                </div>

                {/* Hero Subtitle */}
                <div>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 900, color: '#475569', marginBottom: 6 }}>الوصف أو العنوان الفرعي (Hero Subtitle)</label>
                  <textarea 
                    value={landingForm.heroSubtitle} 
                    onChange={e => setLandingForm(prev => ({ ...prev, heroSubtitle: e.target.value }))}
                    rows={4}
                    style={{ width: '100%', padding: '12px 14px', borderRadius: 10, border: '2px solid #e2e8f0', fontSize: 14, fontWeight: 700, outline: 'none', boxSizing: 'border-box', resize: 'vertical' }}
                  />
                </div>

                {/* APK Link */}
                <div>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 900, color: '#475569', marginBottom: 6 }}>رابط تحميل تطبيق الأندرويد (APK Download Link)</label>
                  <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                    <input 
                      type="text" 
                      value={landingForm.apkUrl} 
                      onChange={e => setLandingForm(prev => ({ ...prev, apkUrl: e.target.value }))}
                      placeholder="/apk/mantoudj-bladi.apk"
                      style={{ flex: 1, padding: '12px 14px', borderRadius: 10, border: '2px solid #e2e8f0', fontSize: 14, fontWeight: 700, outline: 'none', boxSizing: 'border-box', direction: 'ltr', textAlign: 'right' }}
                    />
                    <label style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '12px 20px', background: apkUploading ? '#94a3b8' : '#2D6A4F', color: 'white', borderRadius: 10, fontSize: 13, fontWeight: 900, cursor: apkUploading ? 'not-allowed' : 'pointer', whiteSpace: 'nowrap' }}>
                      {apkUploading ? '⏳ جارٍ الرفع...' : '📤 رفع ملف APK'}
                      <input 
                        type="file" 
                        accept=".apk" 
                        style={{ display: 'none' }} 
                        disabled={apkUploading}
                        onChange={async (e) => {
                          const file = e.target.files?.[0]
                          if (!file) return
                          setApkUploading(true)
                          try {
                            const url = await apiUploadApk(file)
                            setLandingForm(prev => ({ ...prev, apkUrl: url }))
                            alert('✅ تم رفع ملف APK بنجاح! الرابط متوفر الآن في الحقل.')
                          } catch (err: any) {
                            alert('❌ فشل رفع الملف: ' + (err?.message || 'حدث خطأ'))
                          } finally {
                            setApkUploading(false)
                            e.target.value = ''
                          }
                        }}
                      />
                    </label>
                  </div>
                  <p style={{ color: '#94a3b8', fontSize: 11, marginTop: 4 }}>يمكنك استخدام رابط نسبي مثل <code>/apk/mantoudj-bladi.apk</code> أو رفع ملف <code>.apk</code> مباشرة ليتم توليد الرابط تلقائياً.</p>
                </div>

                {/* Contact Phone */}
                <div>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 900, color: '#475569', marginBottom: 6 }}>رقم هاتف الدعم الفني</label>
                  <input 
                    type="text" 
                    value={landingForm.contactPhone} 
                    onChange={e => setLandingForm(prev => ({ ...prev, contactPhone: e.target.value }))}
                    style={{ width: '100%', padding: '12px 14px', borderRadius: 10, border: '2px solid #e2e8f0', fontSize: 14, fontWeight: 700, outline: 'none', boxSizing: 'border-box', direction: 'ltr', textAlign: 'right' }}
                  />
                </div>

                {/* Show Stats Switch */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 0' }}>
                  <input 
                    type="checkbox" 
                    id="showStatsSwitch"
                    checked={landingForm.showStats} 
                    onChange={e => setLandingForm(prev => ({ ...prev, showStats: e.target.checked }))}
                    style={{ width: 18, height: 18, cursor: 'pointer' }}
                  />
                  <label htmlFor="showStatsSwitch" style={{ fontSize: 14, fontWeight: 900, color: '#475569', cursor: 'pointer' }}>إظهار بطاقات إحصائيات المنصة الحية</label>
                </div>

                {/* Submit button */}
                <div style={{ marginTop: 10 }}>
                  <button 
                    onClick={handleSaveLandingConfig} 
                    disabled={saveLandingLoading}
                    style={{
                      background: 'linear-gradient(135deg, #16a34a, #15803d)',
                      color: 'white',
                      padding: '14px 28px',
                      borderRadius: 12,
                      fontSize: 14,
                      fontWeight: 900,
                      border: 'none',
                      cursor: saveLandingLoading ? 'not-allowed' : 'pointer',
                      boxShadow: '0 4px 12px rgba(22,163,74,0.2)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8
                    }}
                  >
                    {saveLandingLoading ? <RefreshCw size={16} className="animate-spin" /> : '💾'}
                    <span>{saveLandingLoading ? 'جاري حفظ التعديلات...' : 'حفظ التغييرات'}</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ══ CONFIG SECTIONS (crop types / equip types) ════════════════════ */}
          {(tab === 'cropTypes' || tab === 'equipTypes') && (
            <div>
              {/* Header + Add button */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
                <div style={{ display: 'flex', gap: 10 }}>
                  <button
                    onClick={() => { resetForm(); setShowAddForm(true) }}
                    style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '9px 18px', background: 'linear-gradient(135deg,#16a34a,#15803d)', color: 'white', border: 'none', borderRadius: 10, fontSize: 13, fontWeight: 700, cursor: 'pointer' }}
                  >
                    <Plus size={16} />
                    إضافة جديد
                  </button>
                  <button
                    onClick={async () => {
                      if (!confirm('سيتم إضافة جميع المحاصيل الافتراضية. هل تريد المتابعة؟')) return
                      const items = await apiAdminInitDefaults(configType)
                      setConfigItems(items)
                    }}
                    style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '9px 18px', background: 'linear-gradient(135deg,#f59e0b,#d97706)', color: 'white', border: 'none', borderRadius: 10, fontSize: 13, fontWeight: 700, cursor: 'pointer' }}
                    title="تهيئة الافتراضيات"
                  >
                    <RefreshCw size={16} />
                    تهيئة الافتراضيات
                  </button>
                </div>
                <div>
                  <h2 style={{ fontWeight: 900, color: '#1e293b', fontSize: 16, margin: 0 }}>
                    {tab === 'cropTypes' ? '🌾 أنواع المحاصيل' : '🔧 أنواع المعدات'}
                  </h2>
                  <p style={{ color: '#94a3b8', fontSize: 12, margin: '2px 0 0' }}>
                    {tab === 'cropTypes' ? 'إدارة أنواع المحاصيل المتاحة في المنصة' : 'إدارة أنواع المعدات المتاحة في المنصة'}
                  </p>
                </div>
              </div>

              {/* Add / Edit form */}
              {(showAddForm || editingItem) && (
                <div style={{ background: 'white', borderRadius: 14, padding: 24, marginBottom: 20, boxShadow: '0 4px 16px rgba(0,0,0,.08)', border: '1px solid #e2e8f0' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                    <button onClick={resetForm} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8' }}><X size={18} /></button>
                    <h3 style={{ fontWeight: 900, color: '#1e293b', margin: 0, fontSize: 15 }}>{editingItem ? 'تعديل عنصر' : 'إضافة عنصر جديد'}</h3>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr 120px', gap: 12, marginBottom: 12 }}>
                    <div>
                      <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#475569', marginBottom: 6 }}>الاسم بالعربية *</label>
                      <input value={formLabel} onChange={e => setFormLabel(e.target.value)} placeholder="مثال: طماطم" style={{ width: '100%', padding: '9px 12px', border: '1.5px solid #e2e8f0', borderRadius: 8, fontSize: 13, fontWeight: 700, outline: 'none', boxSizing: 'border-box' }} />
                    </div>
                    {editingItem ? (
                      <div>
                        <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#475569', marginBottom: 6 }}>المفتاح (بالإنجليزية)</label>
                        <input value={editingItem.key} readOnly style={{ width: '100%', padding: '9px 12px', border: '1.5px solid #e2e8f0', borderRadius: 8, fontSize: 13, fontWeight: 700, outline: 'none', direction: 'ltr', boxSizing: 'border-box', background: '#f1f5f9', color: '#94a3b8', cursor: 'not-allowed' }} />
                      </div>
                    ) : (
                      <div>
                        <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#475569', marginBottom: 6 }}>المفتاح (بالإنجليزية) *</label>
                        <input value={formKey} onChange={e => setFormKey(e.target.value.toLowerCase().replace(/\s/g, '_'))} placeholder="مثال: tomato" style={{ width: '100%', padding: '9px 12px', border: '1.5px solid #e2e8f0', borderRadius: 8, fontSize: 13, fontWeight: 700, outline: 'none', direction: 'ltr', boxSizing: 'border-box' }} />
                      </div>
                    )}
                    <div>
                      <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#475569', marginBottom: 6 }}>الرمز (Emoji)</label>
                      <input value={formEmoji} onChange={e => setFormEmoji(e.target.value)} placeholder="🌱" style={{ width: '100%', padding: '9px 12px', border: '1.5px solid #e2e8f0', borderRadius: 8, fontSize: 20, textAlign: 'center', outline: 'none', boxSizing: 'border-box' }} />
                    </div>
                  </div>
                  {/* Subcategory + hidePlantingDate — only for crop types */}
                  {tab === 'cropTypes' && (
                    <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: 12, marginBottom: 12 }}>
                      <div>
                        <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#475569', marginBottom: 6 }}>الفئة</label>
                        <select value={formSubcategory} onChange={e => setFormSubcategory(e.target.value)} style={{ width: '100%', padding: '9px 12px', border: '1.5px solid #e2e8f0', borderRadius: 8, fontSize: 13, fontWeight: 700, outline: 'none', boxSizing: 'border-box' }}>
                          <option value="">غير محدد</option>
                          <option value="vegetable">خضر</option>
                          <option value="fruit">فواكه</option>
                          <option value="grain">حبوب</option>
                        </select>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10, paddingTop: 22 }}>
                        <input type="checkbox" id="hidePlanting" checked={formHidePlantingDate} onChange={e => setFormHidePlantingDate(e.target.checked)} style={{ width: 16, height: 16, cursor: 'pointer' }} />
                        <label htmlFor="hidePlanting" style={{ fontSize: 13, fontWeight: 700, color: '#475569', cursor: 'pointer' }}>إخفاء تاريخ الغرس</label>
                      </div>
                    </div>
                  )}
                  {/* Image upload — for crop types and equipment types */}
                  {(tab === 'cropTypes' || tab === 'equipTypes') && (
                    <div style={{ marginBottom: 12 }}>
                      <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#475569', marginBottom: 6 }}>{tab === 'cropTypes' ? 'صورة المحصول' : 'صورة المعدة'}</label>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <img
                          src={formImage || (editingItem ? (tab === 'cropTypes' ? `/images/crops/${editingItem.key}.jpg` : '') : '')}
                          alt=""
                          onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
                          style={{ width: 56, height: 56, borderRadius: 10, objectFit: 'cover', border: '1px solid #e2e8f0', background: '#f8fafc', display: formImage || editingItem ? 'block' : 'none' }}
                        />
                        <label style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '8px 14px', background: imageUploading ? '#94a3b8' : '#3b82f6', color: 'white', borderRadius: 8, fontSize: 12, fontWeight: 700, cursor: imageUploading ? 'not-allowed' : 'pointer' }}>
                          {imageUploading ? '⏳ جارٍ الرفع...' : '📷 تغيير الصورة'}
                          <input
                            type="file"
                            accept="image/*"
                            style={{ display: 'none' }}
                            disabled={imageUploading}
                            onChange={async (e) => {
                              const file = e.target.files?.[0]
                              if (!file) return
                              setImageUploading(true)
                              try {
                                const url = await apiUploadImage(file)
                                setFormImage(url)
                              } catch {
                                setFormError('فشل رفع الصورة')
                              } finally {
                                setImageUploading(false)
                              }
                            }}
                          />
                        </label>
                        {formImage && (
                          <button onClick={() => setFormImage('')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8', fontSize: 12 }}>
                            ✕ إزالة
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                  {formError && <p style={{ color: '#dc2626', fontSize: 12, fontWeight: 700, marginBottom: 8 }}>{formError}</p>}
                  <button onClick={handleSaveItem} style={{ padding: '9px 24px', background: '#16a34a', color: 'white', border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 700, cursor: 'pointer' }}>
                    {editingItem ? 'حفظ التعديلات' : 'إضافة'}
                  </button>
                </div>
              )}

              {/* Items grid */}
              {configLoading ? <Spinner /> : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 12 }}>
                  {configItems.length === 0 && (
                    <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: 60 }}>
                      <div style={{ fontSize: 56, marginBottom: 12 }}>{tab === 'cropTypes' ? '🌾' : '🔧'}</div>
                      <div style={{ fontWeight: 900, color: '#1e293b', fontSize: 16, marginBottom: 6 }}>لا توجد عناصر بعد</div>
                      <div style={{ fontSize: 13, color: '#94a3b8', marginBottom: 20 }}>
                        انقر على "تهيئة الافتراضيات" لإضافة جميع {tab === 'cropTypes' ? 'المحاصيل' : 'المعدات'} الافتراضية دفعة واحدة
                      </div>
                      <button
                        onClick={async () => {
                          const items = await apiAdminInitDefaults(configType)
                          setConfigItems(items)
                        }}
                        style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '12px 28px', background: 'linear-gradient(135deg,#f59e0b,#d97706)', color: 'white', border: 'none', borderRadius: 12, fontSize: 14, fontWeight: 700, cursor: 'pointer' }}
                      >
                        <RefreshCw size={18} />
                        تهيئة {tab === 'cropTypes' ? 'المحاصيل' : 'المعدات'} الافتراضية
                      </button>
                    </div>
                  )}
                  {configItems.map((item: any) => (
                    <div key={item.key} style={{
                      background: 'white', borderRadius: 14, padding: 16,
                      boxShadow: '0 1px 3px rgba(0,0,0,.06)',
                      border: item.isActive ? '1px solid #bbf7d0' : '1px solid #fee2e2',
                      opacity: item.isActive ? 1 : 0.7,
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
                        <div style={{ display: 'flex', gap: 6 }}>
                          <ActionBtn onClick={() => { setEditingItem(item); setFormLabel(item.labelAr); setFormEmoji(item.emoji); setFormImage(item.image || ''); setFormSubcategory(item.subcategory || ''); setFormHidePlantingDate(item.hidePlantingDate || false); setShowAddForm(false) }} color="#3b82f6" title="تعديل">
                            <Edit2 size={13} />
                          </ActionBtn>
                          <ActionBtn onClick={() => handleToggleItem(item)} color={item.isActive ? '#d97706' : '#16a34a'} title={item.isActive ? 'تعطيل' : 'تفعيل'}>
                            {item.isActive ? <EyeOff size={13} /> : <Eye size={13} />}
                          </ActionBtn>
                          <ActionBtn onClick={() => handleDeleteItem(item.key)} color="#dc2626" title="حذف">
                            <Trash2 size={13} />
                          </ActionBtn>
                        </div>
                        {item.image ? (
                          <img
                            src={item.image}
                            alt={item.labelAr}
                            onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
                            style={{ width: 48, height: 48, borderRadius: 10, objectFit: 'cover', border: '1px solid #e2e8f0' }}
                          />
                        ) : tab === 'cropTypes' ? (
                          <img
                            src={`/images/crops/${item.key}.jpg`}
                            alt={item.labelAr}
                            onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
                            style={{ width: 48, height: 48, borderRadius: 10, objectFit: 'cover', border: '1px solid #e2e8f0' }}
                          />
                        ) : (
                          <div style={{ fontSize: 32 }}>{item.emoji}</div>
                        )}
                      </div>
                      <div style={{ fontWeight: 900, color: '#1e293b', fontSize: 14 }}>{item.labelAr}</div>
                      <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 2, direction: 'ltr', textAlign: 'right' }}>{item.key}</div>
                      {item.subcategory && <div style={{ fontSize: 10, color: '#7c3aed', marginTop: 2, fontWeight: 700 }}>{item.subcategory === 'fruit' ? '🍎 فواكه' : item.subcategory === 'grain' ? '🌾 حبوب' : '🥦 خضر'}</div>}
                      {item.hidePlantingDate && <div style={{ fontSize: 10, color: '#dc2626', fontWeight: 700 }}>⛔ تاريخ الغرس مخفي</div>}
                      <span style={{ display: 'inline-block', marginTop: 8, padding: '2px 8px', borderRadius: 6, fontSize: 10, fontWeight: 700, background: item.isActive ? '#f0fdf4' : '#fef2f2', color: item.isActive ? '#16a34a' : '#dc2626' }}>
                        {item.isActive ? 'مفعّل' : 'معطّل'}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ══ CROP DURATIONS ══════════════════════════════════════════════ */}
          {tab === 'cropDurations' && (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
                <button
                  onClick={async () => {
                    if (!confirm('سيتم إعادة تعيين قيم الأيام الافتراضية. هل تريد المتابعة؟')) return
                    const items = await apiAdminInitCropDurations()
                    setCropDurations(items)
                  }}
                  style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '9px 18px', background: 'linear-gradient(135deg,#f59e0b,#d97706)', color: 'white', border: 'none', borderRadius: 10, fontSize: 13, fontWeight: 700, cursor: 'pointer' }}
                >
                  <RefreshCw size={16} />
                  تهيئة الافتراضيات
                </button>
                <div>
                  <h2 style={{ fontWeight: 900, color: '#1e293b', fontSize: 16, margin: 0 }}>📅 أيام النضج لكل محصول</h2>
                  <p style={{ color: '#94a3b8', fontSize: 12, margin: '2px 0 0' }}>عدد الأيام من الغرس/الإزهار حتى النضج</p>
                </div>
              </div>

              {durLoading ? <Spinner /> : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 12 }}>
                  {cropDurations.map(item => (
                    <div key={item.key} style={{ background: 'white', borderRadius: 14, padding: 16, boxShadow: '0 1px 3px rgba(0,0,0,.06)', border: '1px solid #e2e8f0' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                        <span style={{ fontSize: 28 }}>{item.emoji}</span>
                        <div>
                          <div style={{ fontWeight: 900, color: '#1e293b', fontSize: 13 }}>{item.labelAr}</div>
                          <div style={{ fontSize: 10, color: '#94a3b8', direction: 'ltr' }}>{item.key}</div>
                        </div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <input
                          type="number"
                          min="1"
                          max="500"
                          value={editingDays[item.key] ?? item.days}
                          onChange={e => setEditingDays(prev => ({ ...prev, [item.key]: e.target.value }))}
                          style={{ flex: 1, padding: '6px 8px', border: '1.5px solid #e2e8f0', borderRadius: 8, fontSize: 14, fontWeight: 900, textAlign: 'center', outline: 'none', direction: 'ltr' }}
                        />
                        <span style={{ fontSize: 11, color: '#94a3b8', fontWeight: 700 }}>يوم</span>
                        {editingDays[item.key] !== undefined && editingDays[item.key] !== String(item.days) && (
                          <button
                            onClick={async () => {
                              const days = parseInt(editingDays[item.key])
                              if (!days || days < 1) return
                              await apiAdminUpdateCropDuration(item.key, days)
                              setCropDurations(prev => prev.map(d => d.key === item.key ? { ...d, days } : d))
                              setEditingDays(prev => { const n = { ...prev }; delete n[item.key]; return n })
                            }}
                            style={{ padding: '6px 8px', background: '#16a34a', color: 'white', border: 'none', borderRadius: 8, cursor: 'pointer', fontSize: 12, fontWeight: 700 }}
                          >
                            ✓
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ══ SETTINGS ═════════════════════════════════════════════════════ */}
          {tab === 'settings' && (
            <div style={{ maxWidth: 600 }}>
              {/* Gemini API Key */}
              <div style={{ background: 'white', borderRadius: 16, padding: 24, boxShadow: '0 1px 3px rgba(0,0,0,.06)', marginBottom: 20 }}>
                <h3 style={{ fontWeight: 900, fontSize: 16, color: '#1e293b', marginBottom: 4 }}>🤖 مفتاح Gemini AI</h3>
                <p style={{ fontSize: 12, color: '#94a3b8', marginBottom: 16 }}>مفتاح مشترك لكل المستخدمين — يُستخدم في المساعد الزراعي الذكي</p>
                {geminiInfo?.hasKey && (
                  <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 10, padding: '10px 14px', marginBottom: 14, display: 'flex', alignItems: 'center', gap: 8 }}>
                    <CheckCircle size={16} color="#16a34a" />
                    <span style={{ fontSize: 13, fontWeight: 700, color: '#16a34a' }}>مفتاح نشط: {geminiInfo.keyPreview}</span>
                  </div>
                )}
                <div style={{ display: 'flex', gap: 8 }}>
                  <div style={{ flex: 1, position: 'relative' }}>
                    <input
                      type={showGeminiKey ? 'text' : 'password'}
                      value={geminiInput}
                      onChange={e => setGeminiInput(e.target.value)}
                      placeholder="AIzaSy..."
                      style={{ width: '100%', padding: '10px 40px 10px 12px', borderRadius: 10, border: '2px solid #e2e8f0', fontSize: 13, fontWeight: 700, outline: 'none', boxSizing: 'border-box' }}
                    />
                    <button onClick={() => setShowGeminiKey(s => !s)} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8' }}>
                      {showGeminiKey ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                  <button
                    onClick={handleSaveGemini}
                    disabled={geminiLoading || !geminiInput.trim()}
                    style={{ padding: '10px 20px', background: geminiInput.trim() ? '#2D6A4F' : '#e2e8f0', color: geminiInput.trim() ? 'white' : '#94a3b8', border: 'none', borderRadius: 10, fontWeight: 900, cursor: 'pointer', fontSize: 13 }}
                  >
                    {geminiLoading ? '...' : 'حفظ'}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ══ ADMINS (super admin only) ══════════════════════════════════════ */}
          {tab === 'admins' && isSuperAdmin && (
            <div>
              {/* Create new admin account */}
              <div style={{ background: 'white', borderRadius: 14, padding: 20, marginBottom: 16, boxShadow: '0 1px 3px rgba(0,0,0,.06)', border: '1px solid #e2e8f0' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: showCreateAdmin ? 16 : 0 }}>
                  <h3 style={{ fontWeight: 900, color: '#1e293b', fontSize: 15, margin: 0 }}>➕ إنشاء حساب مشرف جديد</h3>
                  <button
                    onClick={() => { setShowCreateAdmin(v => !v); setCreateAdminError('') }}
                    style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 16px', background: showCreateAdmin ? '#f1f5f9' : 'linear-gradient(135deg,#16a34a,#15803d)', color: showCreateAdmin ? '#64748b' : 'white', border: 'none', borderRadius: 8, fontWeight: 700, fontSize: 13, cursor: 'pointer' }}
                  >
                    {showCreateAdmin ? '✕ إلغاء' : '+ إنشاء'}
                  </button>
                </div>
                {showCreateAdmin && (
                  <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: 12 }}>
                    {[
                      { label: 'الاسم الكامل *', val: newAdminName, set: setNewAdminName, placeholder: 'اسم موظف خدمة العملاء' },
                      { label: 'رقم الهاتف *', val: newAdminPhone, set: setNewAdminPhone, placeholder: '0555000000', dir: 'ltr' },
                      { label: 'كلمة المرور *', val: newAdminPassword, set: setNewAdminPassword, placeholder: 'كلمة المرور الأولية' },
                      { label: 'البريد الإلكتروني', val: newAdminEmail, set: setNewAdminEmail, placeholder: 'email@example.com', dir: 'ltr' },
                    ].map(({ label, val, set, placeholder, dir }) => (
                      <div key={label}>
                        <label style={{ fontSize: 11, fontWeight: 700, color: '#64748b', display: 'block', marginBottom: 4 }}>{label}</label>
                        <input value={val} onChange={e => set(e.target.value)} placeholder={placeholder}
                          style={{ width: '100%', padding: '9px 12px', border: '1.5px solid #e2e8f0', borderRadius: 8, fontSize: 13, fontWeight: 700, outline: 'none', boxSizing: 'border-box', direction: dir as any || 'rtl' }} />
                      </div>
                    ))}
                    <div>
                      <label style={{ fontSize: 11, fontWeight: 700, color: '#64748b', display: 'block', marginBottom: 4 }}>الولاية *</label>
                      <select value={newAdminWilaya} onChange={e => { setNewAdminWilaya(e.target.value); setNewAdminCommune('') }}
                        style={{ width: '100%', padding: '9px 12px', border: '1.5px solid #e2e8f0', borderRadius: 8, fontSize: 13, fontWeight: 700, outline: 'none' }}>
                        <option value="">-- اختر الولاية --</option>
                        {WILAYA_NAMES.map(w => <option key={w} value={w}>{w}</option>)}
                      </select>
                    </div>
                    <div>
                      <label style={{ fontSize: 11, fontWeight: 700, color: '#64748b', display: 'block', marginBottom: 4 }}>البلدية</label>
                      <select value={newAdminCommune} onChange={e => setNewAdminCommune(e.target.value)}
                        style={{ width: '100%', padding: '9px 12px', border: '1.5px solid #e2e8f0', borderRadius: 8, fontSize: 13, fontWeight: 700, outline: 'none' }}>
                        <option value="">-- اختر البلدية --</option>
                        {(WILAYA_LIST.find(w => w.nameAr === newAdminWilaya)?.communes || []).map((c: any) => <option key={c.code} value={c.nameAr}>{c.nameAr}</option>)}
                      </select>
                    </div>
                    <div style={{ gridColumn: '1/-1' }}>
                      <label style={{ fontSize: 11, fontWeight: 700, color: '#64748b', display: 'block', marginBottom: 6 }}>📷 الصورة الشخصية</label>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        {newAdminProfileImage ? (
                          <div style={{ position: 'relative' }}>
                            <img src={newAdminProfileImage} style={{ width: 64, height: 64, borderRadius: '50%', objectFit: 'cover', border: '2px solid #e2e8f0' }} />
                            <button onClick={() => setNewAdminProfileImage('')} style={{ position: 'absolute', top: -4, right: -4, width: 18, height: 18, borderRadius: '50%', background: '#dc2626', color: 'white', border: 'none', cursor: 'pointer', fontSize: 10 }}>✕</button>
                          </div>
                        ) : (
                          <label style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '8px 14px', background: newAdminImgUploading ? '#94a3b8' : '#2563eb', color: 'white', borderRadius: 8, fontSize: 12, fontWeight: 700, cursor: newAdminImgUploading ? 'not-allowed' : 'pointer' }}>
                            {newAdminImgUploading ? '⏳ جارٍ الرفع...' : '📷 رفع صورة'}
                            <input type="file" accept="image/*" style={{ display: 'none' }} disabled={newAdminImgUploading}
                              onChange={async e => {
                                const file = e.target.files?.[0]; if (!file) return
                                setNewAdminImgUploading(true)
                                try { const url = await apiUploadImage(file); setNewAdminProfileImage(url) }
                                catch { setCreateAdminError('فشل رفع الصورة') } finally { setNewAdminImgUploading(false); e.target.value = '' }
                              }} />
                          </label>
                        )}
                      </div>
                    </div>
                    {createAdminError && <p style={{ color: '#dc2626', fontSize: 12, fontWeight: 700, gridColumn: '1/-1', margin: 0 }}>{createAdminError}</p>}
                    <div style={{ gridColumn: '1/-1' }}>
                      <button onClick={handleCreateAdmin} disabled={createAdminLoading}
                        style={{ padding: '10px 24px', background: '#16a34a', color: 'white', border: 'none', borderRadius: 8, fontWeight: 700, fontSize: 13, cursor: 'pointer' }}>
                        {createAdminLoading ? '...' : '✅ إنشاء الحساب'}
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Promote user to admin */}
              <div style={{ background: 'white', borderRadius: 14, padding: 20, marginBottom: 20, boxShadow: '0 1px 3px rgba(0,0,0,.06)', border: '1px solid #e2e8f0' }}>
                <h3 style={{ fontWeight: 900, color: '#1e293b', fontSize: 15, marginBottom: 16 }}>🔑 ترقية مستخدم موجود إلى مشرف</h3>
                <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                  <input value={promotePhone} onChange={e => setPromotePhone(e.target.value)} placeholder="رقم هاتف المستخدم" style={{ flex: '1 1 200px', padding: '9px 12px', border: '1.5px solid #e2e8f0', borderRadius: 8, fontSize: 13, fontWeight: 700, outline: 'none', direction: 'ltr' }} />
                  <button
                    disabled={promoteLoading || !promotePhone.trim()}
                    onClick={async () => {
                      setPromoteLoading(true)
                      try {
                        const users = await apiAdminGetUsersList()
                        const list = Array.isArray(users) ? users : (users as any).data || []
                        const found = list.find((u: any) => u.phone === promotePhone.trim())
                        if (!found) { alert('المستخدم غير موجود'); return }
                        await apiSuperSetAdmin(found.id, { isAdmin: true })
                        setPromotePhone('')
                        const admins = await apiSuperGetAdmins()
                        setAdminsList(Array.isArray(admins) ? admins : (admins as any).data || [])
                      } catch (e: any) { alert(e.message || 'خطأ') } finally { setPromoteLoading(false) }
                    }}
                    style={{ padding: '9px 20px', background: '#2563eb', color: 'white', border: 'none', borderRadius: 8, fontWeight: 700, fontSize: 13, cursor: 'pointer' }}
                  >
                    {promoteLoading ? '...' : '➕ ترقية'}
                  </button>
                </div>
              </div>

              {/* Admins list */}
              <div style={{ background: 'white', borderRadius: 14, boxShadow: '0 1px 3px rgba(0,0,0,.06)', overflowX: 'auto' }}>
                {adminsLoading ? <Spinner /> : (
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13, minWidth: 500 }}>
                    <thead>
                      <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                        {['الاسم', 'الهاتف', 'الدور', 'الولاية', 'النوع', 'إجراءات'].map(h => (
                          <th key={h} style={{ padding: '12px 16px', textAlign: 'right', fontWeight: 900, color: '#475569', fontSize: 12 }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {adminsList.map((a: any) => (
                        <tr key={a._id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                          <td style={{ padding: '12px 16px', fontWeight: 700, color: '#1e293b' }}>{a.name}</td>
                          <td style={{ padding: '12px 16px', color: '#64748b', direction: 'ltr', textAlign: 'right' }}>{a.phone}</td>
                          <td style={{ padding: '12px 16px', color: '#64748b' }}>{a.role}</td>
                          <td style={{ padding: '12px 16px', color: '#64748b' }}>{a.wilaya}</td>
                          <td style={{ padding: '12px 16px' }}>
                            {a.isSuperAdmin
                              ? <span style={{ padding: '3px 8px', borderRadius: 6, fontSize: 11, fontWeight: 700, background: '#fef3c7', color: '#92400e' }}>🔑 مشرف عام</span>
                              : <span style={{ padding: '3px 8px', borderRadius: 6, fontSize: 11, fontWeight: 700, background: '#eff6ff', color: '#2563eb' }}>👤 مشرف</span>
                            }
                          </td>
                          <td style={{ padding: '12px 16px' }}>
                            {!a.isSuperAdmin && (
                              <div style={{ display: 'flex', gap: 6 }}>
                                <ActionBtn onClick={async () => {
                                  if (!confirm('إلغاء صلاحيات المشرف لهذا المستخدم؟')) return
                                  await apiSuperSetAdmin(a._id, { isAdmin: false })
                                  setAdminsList(prev => prev.filter(x => x._id !== a._id))
                                }} color="#f59e0b" title="إلغاء الترقية">
                                  <EyeOff size={13} />
                                </ActionBtn>
                                <ActionBtn onClick={async () => {
                                  if (!confirm('حذف حساب المشرف نهائياً؟')) return
                                  await apiSuperDeleteAdmin(a._id)
                                  setAdminsList(prev => prev.filter(x => x._id !== a._id))
                                }} color="#dc2626" title="حذف">
                                  <Trash2 size={13} />
                                </ActionBtn>
                              </div>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          )}

          {/* ══ KNOWLEDGE ════════════════════════════════════════════════════ */}
          {tab === 'knowledge' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                <h2 style={{ fontWeight: 900, color: '#1e293b', fontSize: 16, margin: 0 }}>🧠 قاعدة المعرفة المحلية</h2>
                <button onClick={loadKnowledge} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 14px', background: '#f1f5f9', border: '1px solid #e2e8f0', borderRadius: 8, cursor: 'pointer', color: '#475569', fontSize: 13, fontWeight: 700 }}>
                  <RefreshCw size={14} /> تحديث
                </button>
              </div>
              {knowledgeLoading ? <Spinner /> : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {knowledgeList.length === 0 && (
                    <div style={{ background: 'white', borderRadius: 14, padding: 32, textAlign: 'center', color: '#94a3b8', fontSize: 14 }}>لا توجد معلومات محفوظة</div>
                  )}
                  {knowledgeList.map((k: any) => (
                    <div key={k._id} style={{ background: 'white', borderRadius: 14, padding: 16, boxShadow: '0 1px 3px rgba(0,0,0,.06)', borderRight: `4px solid ${k.verified ? '#16a34a' : '#f59e0b'}` }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12, flexWrap: 'wrap' }}>
                        <div style={{ flex: 1, minWidth: 200 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                            <span style={{ fontWeight: 900, color: '#1e293b', fontSize: 14 }}>{k.topic}</span>
                            <span style={{ padding: '2px 8px', borderRadius: 6, fontSize: 11, fontWeight: 700, background: k.verified ? '#dcfce7' : '#fef3c7', color: k.verified ? '#16a34a' : '#92400e' }}>
                              {k.verified ? '✅ موثّق' : '⏳ بانتظار التوثيق'}
                            </span>
                          </div>
                          <p style={{ margin: 0, color: '#475569', fontSize: 13, lineHeight: 1.6 }}>{k.content}</p>
                          <div style={{ display: 'flex', gap: 12, marginTop: 8, fontSize: 11, color: '#94a3b8' }}>
                            {k.userName && <span>👤 {k.userName}</span>}
                            {k.wilaya && <span>📍 {k.wilaya}</span>}
                            <span>📅 {new Date(k.createdAt).toLocaleDateString('ar-DZ')}</span>
                          </div>
                        </div>
                        <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexShrink: 0 }}>
                          {!k.verified && (
                            <ActionBtn onClick={async () => {
                              await apiAdminVerifyKnowledge(k._id)
                              setKnowledgeList(prev => prev.map(x => x._id === k._id ? { ...x, verified: true } : x))
                            }} color="#16a34a" title="توثيق">
                              <CheckCircle size={13} />
                            </ActionBtn>
                          )}
                          <ActionBtn onClick={async () => {
                            if (!confirm('حذف هذه المعلومة نهائياً؟')) return
                            await apiAdminDeleteKnowledge(k._id)
                            setKnowledgeList(prev => prev.filter(x => x._id !== k._id))
                          }} color="#dc2626" title="حذف">
                            <Trash2 size={13} />
                          </ActionBtn>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

        </div>
      </main>

      {/* ══ EDIT USER MODAL ══════════════════════════════════════════════════ */}
      {badgeModalUser && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }} dir="rtl">
          <div style={{ background: 'white', borderRadius: 20, padding: 24, width: '100%', maxWidth: 440, boxShadow: '0 20px 60px rgba(0,0,0,0.3)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <button onClick={() => setBadgeModalUser(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8', fontSize: 18 }}>✕</button>
              <h3 style={{ fontWeight: 900, fontSize: 16, color: '#1e293b', margin: 0 }}>أوسمة: {badgeModalUser.name}</h3>
            </div>
            {badgeModalLoading ? (
              <div style={{ textAlign: 'center', padding: 24, color: '#94a3b8' }}>جاري التحميل...</div>
            ) : (
              <>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, marginBottom: 16 }}>
                  {getRoleBadges(badgeModalUser.role).map(badge => {
                    const has = badgeModalData.includes(badge.id)
                    return (
                      <button
                        key={badge.id}
                        onClick={() => setBadgeModalData(prev =>
                          has ? prev.filter(id => id !== badge.id) : [...prev, badge.id]
                        )}
                        style={{
                          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
                          padding: 8, borderRadius: 12,
                          border: has ? '2px solid #f59e0b' : '2px solid #e2e8f0',
                          background: has ? '#fffbeb' : '#f8fafc',
                          opacity: has ? 1 : 0.5,
                          cursor: 'pointer', transition: 'all 0.15s',
                        }}
                      >
                        <span style={{ fontSize: 24 }}>{badge.icon}</span>
                        <span style={{ fontSize: 11, fontWeight: 700, textAlign: 'center' }}>{badge.label}</span>
                      </button>
                    )
                  })}
                </div>
                <button
                  onClick={saveBadges}
                  style={{ width: '100%', padding: '12px', background: '#2D6A4F', color: 'white', border: 'none', borderRadius: 12, fontWeight: 900, cursor: 'pointer', fontSize: 14 }}
                >
                  💾 حفظ الأوسمة
                </button>
              </>
            )}
          </div>
        </div>
      )}

      {/* ══ CREATE MODAL ════════════════════════════════════════════════════ */}
      {showCreateModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }} dir="rtl">
          <div style={{ background: 'white', borderRadius: 20, padding: 24, width: '100%', maxWidth: 480, boxShadow: '0 20px 60px rgba(0,0,0,0.3)', maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <h3 style={{ fontWeight: 900, fontSize: 16, color: '#1e293b', margin: 0 }}>
                {showCreateModal === 'user' ? '➕ إضافة مستخدم جديد' :
                 showCreateModal === 'crop' ? '🌾 إضافة محصول جديد' :
                 showCreateModal === 'equipment' ? '🔧 إضافة معدة جديدة' : '🌍 إضافة أرض جديدة'}
              </h3>
              <button onClick={() => { setShowCreateModal(null); setCreateError('') }} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8' }}><X size={20} /></button>
            </div>

            {showCreateModal === 'user' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {[
                  { label: 'الاسم الكامل *', val: cuName, set: setCuName, placeholder: 'اسم المستخدم' },
                  { label: 'رقم الهاتف *', val: cuPhone, set: setCuPhone, placeholder: '0555000000', dir: 'ltr' },
                  { label: 'كلمة المرور *', val: cuPassword, set: setCuPassword, placeholder: 'كلمة المرور الأولية' },
                  { label: 'البريد الإلكتروني', val: cuEmail, set: setCuEmail, placeholder: 'email@example.com', dir: 'ltr' },
                ].map(({ label, val, set, placeholder, dir }) => (
                  <div key={label}>
                    <label style={{ fontSize: 11, fontWeight: 900, color: '#64748b', display: 'block', marginBottom: 4 }}>{label}</label>
                    <input value={val} onChange={e => set(e.target.value)} placeholder={placeholder}
                      style={{ width: '100%', padding: '10px 12px', borderRadius: 10, border: '2px solid #e2e8f0', fontSize: 13, fontWeight: 700, outline: 'none', boxSizing: 'border-box', direction: dir as any || 'rtl' }} />
                  </div>
                ))}
                <div>
                  <label style={{ fontSize: 11, fontWeight: 900, color: '#64748b', display: 'block', marginBottom: 4 }}>الولاية *</label>
                  <select value={cuWilaya} onChange={e => { setCuWilaya(e.target.value); setCuCommune('') }}
                    style={{ width: '100%', padding: '10px 12px', borderRadius: 10, border: '2px solid #e2e8f0', fontSize: 13, fontWeight: 700, outline: 'none' }}>
                    <option value="">-- اختر الولاية --</option>
                    {WILAYA_NAMES.map(w => <option key={w} value={w}>{w}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: 11, fontWeight: 900, color: '#64748b', display: 'block', marginBottom: 4 }}>البلدية</label>
                  <select value={cuCommune} onChange={e => setCuCommune(e.target.value)}
                    style={{ width: '100%', padding: '10px 12px', borderRadius: 10, border: '2px solid #e2e8f0', fontSize: 13, fontWeight: 700, outline: 'none' }}>
                    <option value="">-- اختر البلدية --</option>
                    {(WILAYA_LIST.find(w => w.nameAr === cuWilaya)?.communes || []).map((c: any) => <option key={c.code} value={c.nameAr}>{c.nameAr}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: 11, fontWeight: 900, color: '#64748b', display: 'block', marginBottom: 4 }}>الدور *</label>
                  <select value={cuRole} onChange={e => setCuRole(e.target.value)} style={{ width: '100%', padding: '10px 12px', borderRadius: 10, border: '2px solid #e2e8f0', fontSize: 13, fontWeight: 700, outline: 'none' }}>
                    <option value="farmer">فلاح</option>
                    <option value="agent">وسيط</option>
                    <option value="buyer">مشتري</option>
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: 11, fontWeight: 900, color: '#64748b', display: 'block', marginBottom: 6 }}>📷 الصورة الشخصية</label>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    {cuProfileImage ? (
                      <div style={{ position: 'relative' }}>
                        <img src={cuProfileImage} style={{ width: 64, height: 64, borderRadius: '50%', objectFit: 'cover', border: '2px solid #e2e8f0' }} />
                        <button onClick={() => setCuProfileImage('')} style={{ position: 'absolute', top: -4, right: -4, width: 18, height: 18, borderRadius: '50%', background: '#dc2626', color: 'white', border: 'none', cursor: 'pointer', fontSize: 10 }}>✕</button>
                      </div>
                    ) : (
                      <label style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '8px 14px', background: cuImgUploading ? '#94a3b8' : '#2563eb', color: 'white', borderRadius: 8, fontSize: 12, fontWeight: 700, cursor: cuImgUploading ? 'not-allowed' : 'pointer' }}>
                        {cuImgUploading ? '⏳ جارٍ الرفع...' : '📷 رفع صورة'}
                        <input type="file" accept="image/*" style={{ display: 'none' }} disabled={cuImgUploading}
                          onChange={async e => {
                            const file = e.target.files?.[0]; if (!file) return
                            setCuImgUploading(true)
                            try { const url = await apiUploadImage(file); setCuProfileImage(url) }
                            catch { setCreateError('فشل رفع الصورة') } finally { setCuImgUploading(false); e.target.value = '' }
                          }} />
                      </label>
                    )}
                  </div>
                </div>
                {createError && <p style={{ color: '#dc2626', fontSize: 12, fontWeight: 700 }}>{createError}</p>}
                <button onClick={handleCreateUser} disabled={createLoading} style={{ padding: '12px', background: '#16a34a', color: 'white', border: 'none', borderRadius: 12, fontWeight: 900, cursor: 'pointer', fontSize: 14, marginTop: 4 }}>
                  {createLoading ? '...' : '✅ إنشاء الحساب'}
                </button>
              </div>
            )}

            {showCreateModal === 'crop' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <div>
                  <label style={{ fontSize: 11, fontWeight: 900, color: '#64748b', display: 'block', marginBottom: 4 }}>الفلاح *</label>
                  <select value={ccFarmerId} onChange={e => setCcFarmerId(e.target.value)} style={{ width: '100%', padding: '10px 12px', borderRadius: 10, border: '2px solid #e2e8f0', fontSize: 13, fontWeight: 700, outline: 'none' }}>
                    <option value="">-- اختر فلاحاً --</option>
                    {farmersList.map((f: any) => <option key={f.id} value={f.id}>{f.name} — {f.wilaya}</option>)}
                  </select>
                </div>
                {/* Crop type custom dropdown with images */}
                <div style={{ position: 'relative' }}>
                  <label style={{ fontSize: 11, fontWeight: 900, color: '#64748b', display: 'block', marginBottom: 4 }}>نوع المحصول *</label>
                  <div
                    onClick={() => setCcTypeOpen(v => !v)}
                    style={{ width: '100%', padding: '9px 12px', borderRadius: 10, border: `2px solid ${ccTypeOpen ? '#16a34a' : '#e2e8f0'}`, fontSize: 13, fontWeight: 700, cursor: 'pointer', background: 'white', display: 'flex', alignItems: 'center', gap: 8, boxSizing: 'border-box' }}
                  >
                    {ccType ? (() => { const item = ccCropTypes.find(c => c.key === ccType); return item ? <><img src={item.image} style={{ width: 28, height: 28, borderRadius: 6, objectFit: 'cover' }} onError={e => { (e.target as any).style.display='none' }} /><span>{item.emoji} {item.labelAr}</span></> : <span>{ccType}</span> })() : <span style={{ color: '#94a3b8' }}>-- اختر نوع المحصول --</span>}
                    <span style={{ marginRight: 'auto', color: '#94a3b8', fontSize: 11 }}>▼</span>
                  </div>
                  {ccTypeOpen && (
                    <div style={{ position: 'absolute', top: '100%', right: 0, left: 0, background: 'white', border: '2px solid #e2e8f0', borderRadius: 10, boxShadow: '0 8px 24px rgba(0,0,0,.12)', zIndex: 1000, maxHeight: 260, overflowY: 'auto' }}>
                      {ccCropTypes.map(item => (
                        <div key={item.key}
                          onClick={() => { setCcType(item.key); setCcTypeOpen(false) }}
                          style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '9px 12px', cursor: 'pointer', background: ccType === item.key ? '#f0fdf4' : 'white', borderBottom: '1px solid #f1f5f9' }}
                          onMouseEnter={e => { if (ccType !== item.key) (e.currentTarget as any).style.background = '#f8fafc' }}
                          onMouseLeave={e => { if (ccType !== item.key) (e.currentTarget as any).style.background = 'white' }}
                        >
                          {item.image && <img src={item.image} style={{ width: 32, height: 32, borderRadius: 6, objectFit: 'cover', flexShrink: 0 }} onError={e => { (e.target as any).style.display='none' }} />}
                          <span style={{ fontSize: 13, fontWeight: 700, color: '#1e293b' }}>{item.emoji} {item.labelAr}</span>
                        </div>
                      ))}
                      {ccCropTypes.length === 0 && <div style={{ padding: '12px', color: '#94a3b8', fontSize: 12, textAlign: 'center' }}>جارٍ التحميل...</div>}
                    </div>
                  )}
                </div>
                {[
                  { label: 'الكمية (كغ) *', val: ccQty, set: setCcQty, placeholder: '1000', type: 'number' },
                  { label: 'السعر (دج/كغ)', val: ccPrice, set: setCcPrice, placeholder: '50', type: 'number' },
                ].map(({ label, val, set, placeholder, type }) => (
                  <div key={label}>
                    <label style={{ fontSize: 11, fontWeight: 900, color: '#64748b', display: 'block', marginBottom: 4 }}>{label}</label>
                    <input type={type || 'text'} value={val} onChange={e => set(e.target.value)} placeholder={placeholder}
                      style={{ width: '100%', padding: '10px 12px', borderRadius: 10, border: '2px solid #e2e8f0', fontSize: 13, fontWeight: 700, outline: 'none', boxSizing: 'border-box' }} />
                  </div>
                ))}
                {/* Show planting date only if the selected crop doesn't hide it */}
                {!ccCropTypes.find(c => c.key === ccType)?.hidePlantingDate && (
                  <div>
                    <label style={{ fontSize: 11, fontWeight: 900, color: '#64748b', display: 'block', marginBottom: 4 }}>تاريخ الغرس</label>
                    <input type="date" value={ccDate} onChange={e => setCcDate(e.target.value)}
                      style={{ width: '100%', padding: '10px 12px', borderRadius: 10, border: '2px solid #e2e8f0', fontSize: 13, fontWeight: 700, outline: 'none', boxSizing: 'border-box' }} />
                  </div>
                )}
                <div>
                  <label style={{ fontSize: 11, fontWeight: 900, color: '#64748b', display: 'block', marginBottom: 4 }}>📅 تاريخ الجاهزية المتوقع</label>
                  <input type="date" value={ccHarvestDate} onChange={e => setCcHarvestDate(e.target.value)}
                    style={{ width: '100%', padding: '10px 12px', borderRadius: 10, border: '2px solid #e2e8f0', fontSize: 13, fontWeight: 700, outline: 'none', boxSizing: 'border-box' }} />
                </div>
                <div>
                  <label style={{ fontSize: 11, fontWeight: 900, color: '#64748b', display: 'block', marginBottom: 4 }}>الولاية *</label>
                  <select value={ccWilaya} onChange={e => { setCcWilaya(e.target.value); setCcCommune('') }}
                    style={{ width: '100%', padding: '10px 12px', borderRadius: 10, border: '2px solid #e2e8f0', fontSize: 13, fontWeight: 700, outline: 'none' }}>
                    <option value="">-- اختر الولاية --</option>
                    {WILAYA_NAMES.map(w => <option key={w} value={w}>{w}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: 11, fontWeight: 900, color: '#64748b', display: 'block', marginBottom: 4 }}>البلدية</label>
                  <select value={ccCommune} onChange={e => setCcCommune(e.target.value)}
                    style={{ width: '100%', padding: '10px 12px', borderRadius: 10, border: '2px solid #e2e8f0', fontSize: 13, fontWeight: 700, outline: 'none' }}>
                    <option value="">-- اختر البلدية --</option>
                    {(WILAYA_LIST.find(w => w.nameAr === ccWilaya)?.communes || []).map((c: any) => <option key={c.code} value={c.nameAr}>{c.nameAr}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: 11, fontWeight: 900, color: '#64748b', display: 'block', marginBottom: 4 }}>المرحلة</label>
                  <select value={ccStage} onChange={e => setCcStage(e.target.value)} style={{ width: '100%', padding: '10px 12px', borderRadius: 10, border: '2px solid #e2e8f0', fontSize: 13, fontWeight: 700, outline: 'none' }}>
                    <option value="seeds">🌱 بذرة</option>
                    <option value="growth">🌿 نمو</option>
                    <option value="flowering">🌸 إزهار</option>
                    <option value="ready">✅ جاهز</option>
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: 11, fontWeight: 900, color: '#64748b', display: 'block', marginBottom: 4 }}>وصف</label>
                  <textarea value={ccDescription} onChange={e => setCcDescription(e.target.value)} placeholder="وصف المحصول..." rows={2}
                    style={{ width: '100%', padding: '10px 12px', borderRadius: 10, border: '2px solid #e2e8f0', fontSize: 13, fontWeight: 700, outline: 'none', boxSizing: 'border-box', resize: 'vertical' }} />
                </div>
                {/* Images */}
                <div>
                  <label style={{ fontSize: 11, fontWeight: 900, color: '#64748b', display: 'block', marginBottom: 6 }}>📷 الصور</label>
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 8 }}>
                    {ccImages.map((img, i) => (
                      <div key={i} style={{ position: 'relative', width: 64, height: 64 }}>
                        <img src={img} style={{ width: 64, height: 64, borderRadius: 8, objectFit: 'cover', border: '1px solid #e2e8f0' }} />
                        <button onClick={() => setCcImages(prev => prev.filter((_, j) => j !== i))} style={{ position: 'absolute', top: -6, right: -6, width: 18, height: 18, borderRadius: '50%', background: '#dc2626', color: 'white', border: 'none', cursor: 'pointer', fontSize: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>✕</button>
                      </div>
                    ))}
                    <label style={{ width: 64, height: 64, borderRadius: 8, border: '2px dashed #cbd5e1', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: ccImgUploading ? 'not-allowed' : 'pointer', background: '#f8fafc', flexShrink: 0 }}>
                      {ccImgUploading ? <span style={{ fontSize: 10, color: '#94a3b8' }}>...</span> : <span style={{ fontSize: 24, color: '#94a3b8' }}>+</span>}
                      <input type="file" accept="image/*" multiple style={{ display: 'none' }} disabled={ccImgUploading}
                        onChange={async e => {
                          const files = Array.from(e.target.files || [])
                          if (!files.length) return
                          setCcImgUploading(true)
                          try { const urls = await apiUploadImages(files); setCcImages(prev => [...prev, ...urls]) }
                          catch { setCreateError('فشل رفع الصور') } finally { setCcImgUploading(false); e.target.value = '' }
                        }} />
                    </label>
                  </div>
                </div>
                {/* Video */}
                <div>
                  <label style={{ fontSize: 11, fontWeight: 900, color: '#64748b', display: 'block', marginBottom: 6 }}>🎥 فيديو</label>
                  {ccVideo ? (
                    <div style={{ position: 'relative', display: 'inline-block' }}>
                      <video src={ccVideo} style={{ width: 120, height: 80, borderRadius: 8, objectFit: 'cover', border: '1px solid #e2e8f0' }} muted />
                      <button onClick={() => setCcVideo('')} style={{ position: 'absolute', top: -6, right: -6, width: 18, height: 18, borderRadius: '50%', background: '#dc2626', color: 'white', border: 'none', cursor: 'pointer', fontSize: 10 }}>✕</button>
                    </div>
                  ) : (
                    <label style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '8px 14px', background: ccVidUploading ? '#94a3b8' : '#7c3aed', color: 'white', borderRadius: 8, fontSize: 12, fontWeight: 700, cursor: ccVidUploading ? 'not-allowed' : 'pointer' }}>
                      {ccVidUploading ? '⏳ جارٍ الرفع...' : '🎥 رفع فيديو'}
                      <input type="file" accept="video/*" style={{ display: 'none' }} disabled={ccVidUploading}
                        onChange={async e => {
                          const file = e.target.files?.[0]; if (!file) return
                          setCcVidUploading(true)
                          try { const url = await apiUploadVideo(file); setCcVideo(url) }
                          catch { setCreateError('فشل رفع الفيديو') } finally { setCcVidUploading(false); e.target.value = '' }
                        }} />
                    </label>
                  )}
                </div>
                {createError && <p style={{ color: '#dc2626', fontSize: 12, fontWeight: 700 }}>{createError}</p>}
                <button onClick={handleCreateCrop} disabled={createLoading} style={{ padding: '12px', background: '#16a34a', color: 'white', border: 'none', borderRadius: 12, fontWeight: 900, cursor: 'pointer', fontSize: 14, marginTop: 4 }}>
                  {createLoading ? '...' : '✅ إضافة المحصول'}
                </button>
              </div>
            )}

            {showCreateModal === 'equipment' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <div>
                  <label style={{ fontSize: 11, fontWeight: 900, color: '#64748b', display: 'block', marginBottom: 4 }}>المالك (وسيط/مستخدم) *</label>
                  <select value={ceAgentId} onChange={e => setCeAgentId(e.target.value)} style={{ width: '100%', padding: '10px 12px', borderRadius: 10, border: '2px solid #e2e8f0', fontSize: 13, fontWeight: 700, outline: 'none' }}>
                    <option value="">-- اختر مستخدماً --</option>
                    {usersList.map((u: any) => <option key={u.id} value={u.id}>{u.name} ({u.role}) — {u.wilaya}</option>)}
                  </select>
                </div>
                {[
                  { label: 'اسم المعدة *', val: ceName, set: setCeName, placeholder: 'مثال: جرار زراعي' },
                  { label: 'الفئة *', val: ceCategory, set: setCeCategory, placeholder: 'مثال: tractors' },
                  { label: 'السعر (دج/يوم)', val: cePrice, set: setCePrice, placeholder: '5000', type: 'number' },
                  { label: 'رقم الهاتف', val: cePhone, set: setCePhone, placeholder: '0555000000', dir: 'ltr' },
                ].map(({ label, val, set, placeholder, type, dir }) => (
                  <div key={label}>
                    <label style={{ fontSize: 11, fontWeight: 900, color: '#64748b', display: 'block', marginBottom: 4 }}>{label}</label>
                    <input type={type || 'text'} value={val} onChange={e => set(e.target.value)} placeholder={placeholder}
                      style={{ width: '100%', padding: '10px 12px', borderRadius: 10, border: '2px solid #e2e8f0', fontSize: 13, fontWeight: 700, outline: 'none', boxSizing: 'border-box', direction: dir as any || 'rtl' }} />
                  </div>
                ))}
                <div>
                  <label style={{ fontSize: 11, fontWeight: 900, color: '#64748b', display: 'block', marginBottom: 4 }}>الولاية *</label>
                  <select value={ceWilaya} onChange={e => setCeWilaya(e.target.value)}
                    style={{ width: '100%', padding: '10px 12px', borderRadius: 10, border: '2px solid #e2e8f0', fontSize: 13, fontWeight: 700, outline: 'none' }}>
                    <option value="">-- اختر الولاية --</option>
                    {WILAYA_NAMES.map(w => <option key={w} value={w}>{w}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: 11, fontWeight: 900, color: '#64748b', display: 'block', marginBottom: 4 }}>وصف</label>
                  <textarea value={ceDescription} onChange={e => setCeDescription(e.target.value)} placeholder="وصف المعدة..." rows={2}
                    style={{ width: '100%', padding: '10px 12px', borderRadius: 10, border: '2px solid #e2e8f0', fontSize: 13, fontWeight: 700, outline: 'none', boxSizing: 'border-box', resize: 'vertical' }} />
                </div>
                <div>
                  <label style={{ fontSize: 11, fontWeight: 900, color: '#64748b', display: 'block', marginBottom: 6 }}>📷 الصور</label>
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 4 }}>
                    {ceImages.map((img, i) => (
                      <div key={i} style={{ position: 'relative', width: 64, height: 64 }}>
                        <img src={img} style={{ width: 64, height: 64, borderRadius: 8, objectFit: 'cover', border: '1px solid #e2e8f0' }} />
                        <button onClick={() => setCeImages(prev => prev.filter((_, j) => j !== i))} style={{ position: 'absolute', top: -6, right: -6, width: 18, height: 18, borderRadius: '50%', background: '#dc2626', color: 'white', border: 'none', cursor: 'pointer', fontSize: 10 }}>✕</button>
                      </div>
                    ))}
                    <label style={{ width: 64, height: 64, borderRadius: 8, border: '2px dashed #cbd5e1', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', background: '#f8fafc' }}>
                      {ceImgUploading ? <span style={{ fontSize: 10, color: '#94a3b8' }}>...</span> : <span style={{ fontSize: 24, color: '#94a3b8' }}>+</span>}
                      <input type="file" accept="image/*" multiple style={{ display: 'none' }} disabled={ceImgUploading}
                        onChange={async e => {
                          const files = Array.from(e.target.files || []); if (!files.length) return
                          setCeImgUploading(true)
                          try { const urls = await apiUploadImages(files); setCeImages(prev => [...prev, ...urls]) }
                          catch { setCreateError('فشل رفع الصور') } finally { setCeImgUploading(false); e.target.value = '' }
                        }} />
                    </label>
                  </div>
                </div>
                <div>
                  <label style={{ fontSize: 11, fontWeight: 900, color: '#64748b', display: 'block', marginBottom: 6 }}>🎥 فيديو</label>
                  {ceVideo ? (
                    <div style={{ position: 'relative', display: 'inline-block' }}>
                      <video src={ceVideo} style={{ width: 120, height: 80, borderRadius: 8, objectFit: 'cover', border: '1px solid #e2e8f0' }} muted />
                      <button onClick={() => setCeVideo('')} style={{ position: 'absolute', top: -6, right: -6, width: 18, height: 18, borderRadius: '50%', background: '#dc2626', color: 'white', border: 'none', cursor: 'pointer', fontSize: 10 }}>✕</button>
                    </div>
                  ) : (
                    <label style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '8px 14px', background: ceVidUploading ? '#94a3b8' : '#7c3aed', color: 'white', borderRadius: 8, fontSize: 12, fontWeight: 700, cursor: 'pointer' }}>
                      {ceVidUploading ? '⏳ جارٍ الرفع...' : '🎥 رفع فيديو'}
                      <input type="file" accept="video/*" style={{ display: 'none' }} disabled={ceVidUploading}
                        onChange={async e => {
                          const file = e.target.files?.[0]; if (!file) return
                          setCeVidUploading(true)
                          try { const url = await apiUploadVideo(file); setCeVideo(url) }
                          catch { setCreateError('فشل رفع الفيديو') } finally { setCeVidUploading(false); e.target.value = '' }
                        }} />
                    </label>
                  )}
                </div>
                {createError && <p style={{ color: '#dc2626', fontSize: 12, fontWeight: 700 }}>{createError}</p>}
                <button onClick={handleCreateEquipment} disabled={createLoading} style={{ padding: '12px', background: '#16a34a', color: 'white', border: 'none', borderRadius: 12, fontWeight: 900, cursor: 'pointer', fontSize: 14, marginTop: 4 }}>
                  {createLoading ? '...' : '✅ إضافة المعدة'}
                </button>
              </div>
            )}

            {showCreateModal === 'land' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <div>
                  <label style={{ fontSize: 11, fontWeight: 900, color: '#64748b', display: 'block', marginBottom: 4 }}>المالك *</label>
                  <select value={clAgentId} onChange={e => setClAgentId(e.target.value)} style={{ width: '100%', padding: '10px 12px', borderRadius: 10, border: '2px solid #e2e8f0', fontSize: 13, fontWeight: 700, outline: 'none' }}>
                    <option value="">-- اختر مستخدماً --</option>
                    {usersList.map((u: any) => <option key={u.id} value={u.id}>{u.name} ({u.role}) — {u.wilaya}</option>)}
                  </select>
                </div>
                {[
                  { label: 'المساحة (هكتار) *', val: clArea, set: setClArea, placeholder: '5', type: 'number' },
                  { label: 'السعر (دج)', val: clPrice, set: setClPrice, placeholder: '500000', type: 'number' },
                  { label: 'رقم الهاتف', val: clPhone, set: setClPhone, placeholder: '0555000000', dir: 'ltr' },
                ].map(({ label, val, set, placeholder, type, dir }: any) => (
                  <div key={label}>
                    <label style={{ fontSize: 11, fontWeight: 900, color: '#64748b', display: 'block', marginBottom: 4 }}>{label}</label>
                    <input type={type || 'text'} value={val} onChange={e => set(e.target.value)} placeholder={placeholder}
                      style={{ width: '100%', padding: '10px 12px', borderRadius: 10, border: '2px solid #e2e8f0', fontSize: 13, fontWeight: 700, outline: 'none', boxSizing: 'border-box', direction: dir || 'rtl' }} />
                  </div>
                ))}
                <div>
                  <label style={{ fontSize: 11, fontWeight: 900, color: '#64748b', display: 'block', marginBottom: 4 }}>الولاية *</label>
                  <select value={clWilaya} onChange={e => { setClWilaya(e.target.value); setClCommune('') }}
                    style={{ width: '100%', padding: '10px 12px', borderRadius: 10, border: '2px solid #e2e8f0', fontSize: 13, fontWeight: 700, outline: 'none' }}>
                    <option value="">-- اختر الولاية --</option>
                    {WILAYA_NAMES.map(w => <option key={w} value={w}>{w}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: 11, fontWeight: 900, color: '#64748b', display: 'block', marginBottom: 4 }}>البلدية</label>
                  <select value={clCommune} onChange={e => setClCommune(e.target.value)}
                    style={{ width: '100%', padding: '10px 12px', borderRadius: 10, border: '2px solid #e2e8f0', fontSize: 13, fontWeight: 700, outline: 'none' }}>
                    <option value="">-- اختر البلدية --</option>
                    {(WILAYA_LIST.find(w => w.nameAr === clWilaya)?.communes || []).map((c: any) => <option key={c.code} value={c.nameAr}>{c.nameAr}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: 11, fontWeight: 900, color: '#64748b', display: 'block', marginBottom: 4 }}>الهدف</label>
                  <select value={clGoal} onChange={e => setClGoal(e.target.value)} style={{ width: '100%', padding: '10px 12px', borderRadius: 10, border: '2px solid #e2e8f0', fontSize: 13, fontWeight: 700, outline: 'none' }}>
                    <option value="بيع">بيع</option>
                    <option value="إيجار">إيجار</option>
                    <option value="شراكة">شراكة</option>
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: 11, fontWeight: 900, color: '#64748b', display: 'block', marginBottom: 4 }}>نوع السعر</label>
                  <select value={clPriceType} onChange={e => setClPriceType(e.target.value)} style={{ width: '100%', padding: '10px 12px', borderRadius: 10, border: '2px solid #e2e8f0', fontSize: 13, fontWeight: 700, outline: 'none' }}>
                    <option value="ثابت">ثابت</option>
                    <option value="قابل للتفاوض">قابل للتفاوض</option>
                    <option value="عرض">عرض</option>
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: 11, fontWeight: 900, color: '#64748b', display: 'block', marginBottom: 4 }}>وصف</label>
                  <textarea value={clDescription} onChange={e => setClDescription(e.target.value)} placeholder="وصف الأرض..." rows={2}
                    style={{ width: '100%', padding: '10px 12px', borderRadius: 10, border: '2px solid #e2e8f0', fontSize: 13, fontWeight: 700, outline: 'none', boxSizing: 'border-box', resize: 'vertical' }} />
                </div>
                <div>
                  <label style={{ fontSize: 11, fontWeight: 900, color: '#64748b', display: 'block', marginBottom: 6 }}>📷 الصور</label>
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 4 }}>
                    {clImages.map((img, i) => (
                      <div key={i} style={{ position: 'relative', width: 64, height: 64 }}>
                        <img src={img} style={{ width: 64, height: 64, borderRadius: 8, objectFit: 'cover', border: '1px solid #e2e8f0' }} />
                        <button onClick={() => setClImages(prev => prev.filter((_, j) => j !== i))} style={{ position: 'absolute', top: -6, right: -6, width: 18, height: 18, borderRadius: '50%', background: '#dc2626', color: 'white', border: 'none', cursor: 'pointer', fontSize: 10 }}>✕</button>
                      </div>
                    ))}
                    <label style={{ width: 64, height: 64, borderRadius: 8, border: '2px dashed #cbd5e1', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: clImgUploading ? 'not-allowed' : 'pointer', background: '#f8fafc' }}>
                      {clImgUploading ? <span style={{ fontSize: 10, color: '#94a3b8' }}>...</span> : <span style={{ fontSize: 24, color: '#94a3b8' }}>+</span>}
                      <input type="file" accept="image/*" multiple style={{ display: 'none' }} disabled={clImgUploading}
                        onChange={async e => {
                          const files = Array.from(e.target.files || []); if (!files.length) return
                          setClImgUploading(true)
                          try { const urls = await apiUploadImages(files); setClImages(prev => [...prev, ...urls]) }
                          catch { setCreateError('فشل رفع الصور') } finally { setClImgUploading(false); e.target.value = '' }
                        }} />
                    </label>
                  </div>
                </div>
                <div>
                  <label style={{ fontSize: 11, fontWeight: 900, color: '#64748b', display: 'block', marginBottom: 6 }}>🎥 فيديو</label>
                  {clVideo ? (
                    <div style={{ position: 'relative', display: 'inline-block' }}>
                      <video src={clVideo} style={{ width: 120, height: 80, borderRadius: 8, objectFit: 'cover', border: '1px solid #e2e8f0' }} muted />
                      <button onClick={() => setClVideo('')} style={{ position: 'absolute', top: -6, right: -6, width: 18, height: 18, borderRadius: '50%', background: '#dc2626', color: 'white', border: 'none', cursor: 'pointer', fontSize: 10 }}>✕</button>
                    </div>
                  ) : (
                    <label style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '8px 14px', background: clVidUploading ? '#94a3b8' : '#7c3aed', color: 'white', borderRadius: 8, fontSize: 12, fontWeight: 700, cursor: clVidUploading ? 'not-allowed' : 'pointer' }}>
                      {clVidUploading ? '⏳ جارٍ الرفع...' : '🎥 رفع فيديو'}
                      <input type="file" accept="video/*" style={{ display: 'none' }} disabled={clVidUploading}
                        onChange={async e => {
                          const file = e.target.files?.[0]; if (!file) return
                          setClVidUploading(true)
                          try { const url = await apiUploadVideo(file); setClVideo(url) }
                          catch { setCreateError('فشل رفع الفيديو') } finally { setClVidUploading(false); e.target.value = '' }
                        }} />
                    </label>
                  )}
                </div>
                {createError && <p style={{ color: '#dc2626', fontSize: 12, fontWeight: 700 }}>{createError}</p>}
                <button onClick={handleCreateLand} disabled={createLoading} style={{ padding: '12px', background: '#16a34a', color: 'white', border: 'none', borderRadius: 12, fontWeight: 900, cursor: 'pointer', fontSize: 14, marginTop: 4 }}>
                  {createLoading ? '...' : '✅ إضافة الأرض'}
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {editUser && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
          <div style={{ background: 'white', borderRadius: 20, padding: 24, width: '100%', maxWidth: 440, boxShadow: '0 20px 60px rgba(0,0,0,0.3)' }} dir="rtl">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <h3 style={{ fontWeight: 900, fontSize: 16, color: '#1e293b', margin: 0 }}>✏️ تعديل المستخدم</h3>
              <button onClick={() => setEditUser(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8' }}><X size={20} /></button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {[
                { label: 'الاسم', field: 'name', type: 'text' },
                { label: 'رقم الهاتف', field: 'phone', type: 'tel' },
                { label: 'الولاية', field: 'wilaya', type: 'text' },
              ].map(({ label, field, type }) => (
                <div key={field}>
                  <label style={{ fontSize: 11, fontWeight: 900, color: '#64748b', display: 'block', marginBottom: 4 }}>{label}</label>
                  <input
                    type={type}
                    value={(editForm as any)[field]}
                    onChange={e => setEditForm(f => ({ ...f, [field]: e.target.value }))}
                    style={{ width: '100%', padding: '10px 12px', borderRadius: 10, border: '2px solid #e2e8f0', fontSize: 13, fontWeight: 700, outline: 'none', boxSizing: 'border-box' }}
                  />
                </div>
              ))}
              <div>
                <label style={{ fontSize: 11, fontWeight: 900, color: '#64748b', display: 'block', marginBottom: 4 }}>الدور</label>
                <select value={editForm.role} onChange={e => setEditForm(f => ({ ...f, role: e.target.value }))}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: 10, border: '2px solid #e2e8f0', fontSize: 13, fontWeight: 700, outline: 'none' }}>
                  <option value="farmer">فلاح</option>
                  <option value="agent">وسيط</option>
                  <option value="buyer">مشتري</option>
                </select>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 10, marginTop: 20 }}>
              <button onClick={handleSaveUser} disabled={editLoading}
                style={{ flex: 1, padding: '12px', background: '#2D6A4F', color: 'white', border: 'none', borderRadius: 12, fontWeight: 900, cursor: 'pointer', fontSize: 14 }}>
                {editLoading ? '...' : '💾 حفظ التعديلات'}
              </button>
              <button onClick={() => setEditUser(null)}
                style={{ padding: '12px 20px', background: '#f1f5f9', color: '#64748b', border: 'none', borderRadius: 12, fontWeight: 700, cursor: 'pointer' }}>
                إلغاء
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// ── Helpers ─────────────────────────────────────────────────────────────────
function Spinner() {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', padding: 40 }}>
      <div style={{ width: 36, height: 36, border: '3px solid #f1f5f9', borderTop: '3px solid #f59e0b', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
    </div>
  )
}

function ActionBtn({ onClick, color, title, children }: { onClick: () => void; color: string; title: string; children: React.ReactNode }) {
  return (
    <button onClick={onClick} title={title} style={{ width: 28, height: 28, borderRadius: 7, background: color + '15', border: `1px solid ${color}30`, color, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      {children}
    </button>
  )
}

function Pagination({ page, total, limit, onPage }: { page: number; total: number; limit: number; onPage: (p: number) => void }) {
  const pages = Math.ceil(total / limit)
  if (pages <= 1) return null
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, padding: '16px 0' }}>
      <button onClick={() => onPage(page + 1)} disabled={page >= pages} style={{ padding: '6px 12px', borderRadius: 8, background: 'white', border: '1px solid #e2e8f0', cursor: 'pointer', color: '#475569', fontWeight: 700, fontSize: 13 }}>
        <ChevronLeft size={16} />
      </button>
      <span style={{ fontSize: 13, fontWeight: 700, color: '#64748b' }}>{page} / {pages} — {total} نتيجة</span>
      <button onClick={() => onPage(page - 1)} disabled={page <= 1} style={{ padding: '6px 12px', borderRadius: 8, background: 'white', border: '1px solid #e2e8f0', cursor: 'pointer', color: '#475569', fontWeight: 700, fontSize: 13 }}>
        <ChevronRight size={16} />
      </button>
    </div>
  )
}
