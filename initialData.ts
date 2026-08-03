import { 
  Building, 
  Unit, 
  SmartAppliance, 
  GardenSystemState, 
  Invoice, 
  CameraFeed,
  EmergencyAlert,
  MaintenanceTicket,
  FacilityBooking,
  PredictiveDiagnostic,
  SystemUser,
  SecurityAuditLog,
  SecuritySettings
} from '../types';

export const INITIAL_SYSTEM_USERS: SystemUser[] = [
  {
    id: 'usr-super-admin',
    name: 'أحمد المدير الرئيسي (Super Admin)',
    email: 'halbeahmed917@gmail.com',
    role: 'super_admin',
    assignedBuildingIds: ['b-1', 'b-2', 'b-3'],
    status: 'active',
    mfaEnabled: true,
    lastLogin: 'اليوم at 00:20',
  },
  {
    id: 'usr-owner-1',
    name: 'الشيخ سلمان العتيبي (مالك العقارات)',
    email: 'owner@smartbuilding.sa',
    role: 'owner',
    assignedBuildingIds: ['b-1', 'b-2'],
    status: 'active',
    mfaEnabled: true,
    lastLogin: 'أمس at 22:15',
  },
  {
    id: 'usr-tenant-101',
    name: 'عبدالله السلمان (مستأجر شقة 101)',
    email: 'tenant101@smartbuilding.sa',
    role: 'tenant',
    assignedBuildingIds: ['b-1'],
    assignedUnitId: 'u-101',
    status: 'active',
    magicLinkCode: 'LNK-9921',
    mfaEnabled: false,
    lastLogin: 'اليوم at 00:15',
  },
  {
    id: 'usr-tenant-202',
    name: 'محمد الدوسري (مستأجر شقة 202)',
    email: 'tenant202@smartbuilding.sa',
    role: 'tenant',
    assignedBuildingIds: ['b-1'],
    assignedUnitId: 'u-202',
    status: 'active',
    magicLinkCode: 'LNK-7741',
    mfaEnabled: false,
    lastLogin: '2026-08-01',
  }
];

export const INITIAL_SECURITY_LOGS: SecurityAuditLog[] = [
  {
    id: 'sec-1',
    timestamp: '2026-08-03 00:18:42',
    action: 'تسجيل دخول آمن مشفر (Zero-Trust Session Issued)',
    userEmail: 'halbeahmed917@gmail.com',
    ipHash: 'IP: 185.190.x.x (Riyadh, SA)',
    encryptedDigest: 'SHA256: e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
    severity: 'info'
  },
  {
    id: 'sec-2',
    timestamp: '2026-08-03 00:10:05',
    action: 'تشفير استعلامات قاعدة البيانات وتطهير رسائل الأخطاء من SQLi / XSS',
    userEmail: 'system-firewall@smartbuilding.sa',
    ipHash: 'INTERNAL-SHIELD',
    encryptedDigest: 'SHA256: 8f4e2c1a90b7d6e5f432109876543210fedcba98765432109876543210fedcba',
    severity: 'info'
  },
  {
    id: 'sec-3',
    timestamp: '2026-08-02 23:45:11',
    action: 'تفعيل نظام خصوصية كاميرات المستأجر وحجب بث الفيديو عن غير المخولين',
    userEmail: 'owner@smartbuilding.sa',
    ipHash: 'IP: 92.166.x.x',
    encryptedDigest: 'SHA256: 7d6c5b4a3f2e1d0c9b8a7f6e5d4c3b2a1f0e9d8c7b6a5f4e3d2c1b0a9f8e7d6c',
    severity: 'info'
  }
];

export const INITIAL_BUILDINGS: Building[] = [
  {
    id: 'b-1',
    name: 'برج الواحة الذكي',
    code: 'OASIS-01',
    address: 'حي النخيل، طريق الملك فهد، الرياض',
    floorsCount: 6,
    totalUnitsCount: 12,
    createdAt: '2025-01-15',
  },
  {
    id: 'b-2',
    name: 'مجمع الياسمين السكني',
    code: 'JASMINE-02',
    address: 'حي الملقا، شارع الأمل، الرياض',
    floorsCount: 4,
    totalUnitsCount: 8,
    createdAt: '2025-03-10',
  },
  {
    id: 'b-3',
    name: 'أبراج الأندلس الذكية',
    code: 'ANDALUS-03',
    address: 'حي الزهراء، الكورنيش، جدة',
    floorsCount: 10,
    totalUnitsCount: 20,
    createdAt: '2025-06-01',
  }
];

export const INITIAL_UNITS: Unit[] = [
  {
    id: 'u-101',
    buildingId: 'b-1',
    unitNumber: '101',
    floor: 1,
    rooms: 3,
    status: 'rented',
    tenant: {
      tenantName: 'عبدالله السلمان',
      tenantEmail: 'abdullah@example.com',
      startDate: '2026-01-01',
      endDate: '2026-12-31',
      status: 'active',
    },
    energyTier: 'normal',
    monthlyElectricityKWh: 385,
    monthlyWaterLiters: 4200,
    createdAt: '2025-01-16',
  },
  {
    id: 'u-102',
    buildingId: 'b-1',
    unitNumber: '102',
    floor: 1,
    rooms: 4,
    status: 'rented',
    tenant: {
      tenantName: 'سارة خالد العتيبي',
      tenantEmail: 'sara@example.com',
      startDate: '2025-08-01',
      endDate: '2026-07-31', // Expired!
      status: 'expired',
    },
    energyTier: 'high',
    monthlyElectricityKWh: 720,
    monthlyWaterLiters: 8900,
    createdAt: '2025-01-16',
  },
  {
    id: 'u-201',
    buildingId: 'b-1',
    unitNumber: '201',
    floor: 2,
    rooms: 2,
    status: 'vacant',
    energyTier: 'low',
    monthlyElectricityKWh: 45,
    monthlyWaterLiters: 600,
    createdAt: '2025-01-16',
  },
  {
    id: 'u-202',
    buildingId: 'b-1',
    unitNumber: '202',
    floor: 2,
    rooms: 5,
    status: 'rented',
    tenant: {
      tenantName: 'محمد الدوسري',
      tenantEmail: 'mohammed@example.com',
      startDate: '2026-03-01',
      endDate: '2027-02-28',
      status: 'active',
    },
    energyTier: 'high',
    monthlyElectricityKWh: 810,
    monthlyWaterLiters: 9500,
    createdAt: '2025-01-16',
  },
  {
    id: 'u-301',
    buildingId: 'b-2',
    unitNumber: 'شقة الفيلا 1',
    floor: 1,
    rooms: 4,
    status: 'rented',
    tenant: {
      tenantName: 'عمر القحطاني',
      tenantEmail: 'omar@example.com',
      startDate: '2026-02-01',
      endDate: '2027-01-31',
      status: 'active',
    },
    energyTier: 'normal',
    monthlyElectricityKWh: 490,
    monthlyWaterLiters: 5300,
    createdAt: '2025-03-11',
  },
  {
    id: 'u-302',
    buildingId: 'b-2',
    unitNumber: 'شقة الفيلا 2',
    floor: 2,
    rooms: 3,
    status: 'vacant',
    energyTier: 'low',
    monthlyElectricityKWh: 60,
    monthlyWaterLiters: 750,
    createdAt: '2025-03-11',
  }
];

export const INITIAL_APPLIANCES: SmartAppliance[] = [
  // Unit 101
  {
    id: 'dev-101-1',
    unitId: 'u-101',
    buildingId: 'b-1',
    name: 'مكيف انفرتر الصالة الذكي',
    type: 'ac',
    connection: 'wifi',
    isOn: true,
    powerWatts: 1800,
    waterLitersPerMin: 0,
    dailyHoursUsed: 9.5,
    autoScheduleEnabled: true,
    scheduledOnTime: '13:00',
    scheduledOffTime: '23:30',
    aiAutomationActive: true,
    aiNotes: 'تم ضبط درجة الحرارة على 24°C أوتوماتيكياً بواسطة AI',
  },
  {
    id: 'dev-101-2',
    unitId: 'u-101',
    buildingId: 'b-1',
    name: 'سخان المياه الذكي (الحمام الرئيسي)',
    type: 'water_heater',
    connection: 'wifi',
    isOn: false,
    powerWatts: 2200,
    waterLitersPerMin: 12,
    dailyHoursUsed: 2.0,
    autoScheduleEnabled: true,
    scheduledOnTime: '06:00',
    scheduledOffTime: '08:00',
    aiAutomationActive: true,
    aiNotes: 'يعمل قبل الاستيقاظ بـ 30 دقيقة فقط لتقليل الاستهلاك',
  },
  {
    id: 'dev-101-3',
    unitId: 'u-101',
    buildingId: 'b-1',
    name: 'ثلاجة ذكية مزودة بحساس حرارة',
    type: 'fridge',
    connection: 'bluetooth',
    isOn: true,
    powerWatts: 160,
    waterLitersPerMin: 0,
    dailyHoursUsed: 24,
    autoScheduleEnabled: false,
    aiAutomationActive: true,
    aiNotes: 'وضع التبريد الاقتصادي مستقر',
  },
  {
    id: 'dev-101-4',
    unitId: 'u-101',
    buildingId: 'b-1',
    name: 'غسالة ملابس أوتوماتيك بالإنترنت',
    type: 'washing_machine',
    connection: 'wifi',
    isOn: false,
    powerWatts: 1400,
    waterLitersPerMin: 25,
    dailyHoursUsed: 1.2,
    autoScheduleEnabled: false,
    aiAutomationActive: false,
  },
  {
    id: 'dev-101-5',
    unitId: 'u-101',
    buildingId: 'b-1',
    name: 'شاحن سيارة كهربائية (EV Charger)',
    type: 'ev_charger',
    connection: 'wifi',
    isOn: false,
    powerWatts: 7400,
    waterLitersPerMin: 0,
    dailyHoursUsed: 3.5,
    autoScheduleEnabled: true,
    scheduledOnTime: '01:00',
    scheduledOffTime: '05:00',
    aiAutomationActive: true,
    aiNotes: 'الشحن التلقائي في ساعات انخفاض تعرفة الكهرباء',
  },

  // Unit 102 (High consumption unit)
  {
    id: 'dev-102-1',
    unitId: 'u-102',
    buildingId: 'b-1',
    name: 'مكيف غرفة المعيشة VRF',
    type: 'ac',
    connection: 'wifi',
    isOn: true,
    powerWatts: 3200,
    waterLitersPerMin: 0,
    dailyHoursUsed: 18.0,
    autoScheduleEnabled: false,
    aiAutomationActive: false,
  },
  {
    id: 'dev-102-2',
    unitId: 'u-102',
    buildingId: 'b-1',
    name: 'سخان ماء مركزي كبير',
    type: 'water_heater',
    connection: 'bluetooth',
    isOn: true,
    powerWatts: 3000,
    waterLitersPerMin: 20,
    dailyHoursUsed: 14.0,
    autoScheduleEnabled: false,
    aiAutomationActive: false,
  },
  {
    id: 'dev-102-3',
    unitId: 'u-102',
    buildingId: 'b-1',
    name: 'فرن كهربائي مدمج',
    type: 'oven',
    connection: 'wifi',
    isOn: false,
    powerWatts: 2800,
    waterLitersPerMin: 0,
    dailyHoursUsed: 2.5,
    autoScheduleEnabled: false,
    aiAutomationActive: false,
  },

  // Unit 202
  {
    id: 'dev-202-1',
    unitId: 'u-202',
    buildingId: 'b-1',
    name: 'تلفزيون 4K OLED ذكي',
    type: 'tv',
    connection: 'wifi',
    isOn: true,
    powerWatts: 240,
    waterLitersPerMin: 0,
    dailyHoursUsed: 6.0,
    autoScheduleEnabled: true,
    scheduledOffTime: '00:00',
    aiAutomationActive: true,
  },
  {
    id: 'dev-202-2',
    unitId: 'u-202',
    buildingId: 'b-1',
    name: 'منقي هواء ذكي مع مستشعر جودة الهواء',
    type: 'purifier',
    connection: 'bluetooth',
    isOn: true,
    powerWatts: 45,
    waterLitersPerMin: 0,
    dailyHoursUsed: 24,
    autoScheduleEnabled: true,
    aiAutomationActive: true,
  }
];

export const INITIAL_GARDEN_STATE: GardenSystemState = {
  soilMoisture: 28, // Below threshold -> requires watering
  temperature: 36.5,
  humidity: 42,
  isRaining: false,
  pumpsActive: true,
  fountainsActive: true,
  scheduledTime: '05:00',
  autoMode: true,
  lastIrrigationTime: 'اليوم at 05:00 صباحاً',
  rainInhibitedCount: 4,
  logs: [
    { id: 'g-log-1', timestamp: '05:00:00 AM', message: 'تشغيل الري الأوتوماتيكي المجدول (05:00 صباحاً)', type: 'pump' },
    { id: 'g-log-2', timestamp: '05:01:15 AM', message: 'قراءة حساس رطوبة التربة: 28% (الحد الأدنى المطلوب 35%)', type: 'info' },
    { id: 'g-log-3', timestamp: '05:02:00 AM', message: 'تنشيط مضخة الري ونوافير الحديقة بنجاح', type: 'pump' },
    { id: 'g-log-4', timestamp: 'أمس 04:15 PM', message: 'تم كشف أمطار بواسطة حساس المطر Wokwi - إيقاف الري الفائض تلقائياً', type: 'rain' },
  ]
};

export const INITIAL_INVOICES: Invoice[] = [
  {
    id: 'inv-2026-101',
    unitId: 'u-101',
    buildingId: 'b-1',
    buildingName: 'برج الواحة الذكي',
    unitNumber: '101',
    tenantName: 'عبدالله السلمان',
    billingPeriod: 'يوليو 2026',
    electricityKWh: 385,
    electricityRatePerKWh: 0.18,
    electricityTotalCost: 69.30,
    waterLiters: 4200,
    waterRatePerLiter: 0.006,
    waterTotalCost: 25.20,
    totalCost: 94.50,
    status: 'paid',
    dueDate: '2026-08-05',
    createdAt: '2026-08-01',
  },
  {
    id: 'inv-2026-102',
    unitId: 'u-102',
    buildingId: 'b-1',
    buildingName: 'برج الواحة الذكي',
    unitNumber: '102',
    tenantName: 'سارة خالد العتيبي',
    billingPeriod: 'يوليو 2026',
    electricityKWh: 720,
    electricityRatePerKWh: 0.18,
    electricityTotalCost: 129.60,
    waterLiters: 8900,
    waterRatePerLiter: 0.006,
    waterTotalCost: 53.40,
    totalCost: 183.00,
    status: 'unpaid',
    dueDate: '2026-08-10',
    createdAt: '2026-08-01',
  },
  {
    id: 'inv-2026-202',
    unitId: 'u-202',
    buildingId: 'b-1',
    buildingName: 'برج الواحة الذكي',
    unitNumber: '202',
    tenantName: 'محمد الدوسري',
    billingPeriod: 'يوليو 2026',
    electricityKWh: 810,
    electricityRatePerKWh: 0.18,
    electricityTotalCost: 145.80,
    waterLiters: 9500,
    waterRatePerLiter: 0.006,
    waterTotalCost: 57.00,
    totalCost: 202.80,
    status: 'unpaid',
    dueDate: '2026-08-12',
    createdAt: '2026-08-01',
  }
];

export const INITIAL_EMERGENCY_ALERTS: EmergencyAlert[] = [
  {
    id: 'emg-1',
    type: 'smoke_fire',
    title: 'حساس دخان وحريق - المطبخ الرئيسي',
    buildingId: 'b-1',
    buildingName: 'برج الواحة الذكي',
    unitId: 'u-101',
    unitNumber: '101',
    locationName: 'مطبخ الشقة 101',
    tenantName: 'عبدالله السلمان',
    status: 'resolved',
    timestamp: 'اليوم at 14:20:00',
    actionsTaken: [
      'تم إرسال إشعار فوري للدفاع المدني وإدارة المبنى',
      'تم فصل صمام الغاز المركزي للشقة أوتوماتيكياً',
      'تم فتح قفل الباب الذكي للشقة للطوارئ',
      'تم تشغيل مراوح سحب الدخان وإضاءة الإخلاء'
    ],
    sensorValue: 'دخان كثيف (340 PPM)',
    severity: 'critical'
  }
];

export const INITIAL_MAINTENANCE_TICKETS: MaintenanceTicket[] = [
  {
    id: 't-101',
    unitId: 'u-101',
    unitNumber: '101',
    buildingName: 'برج الواحة الذكي',
    tenantName: 'عبدالله السلمان',
    title: 'فحص تكييف الصالة قبل الصيف',
    category: 'hvac',
    priority: 'medium',
    status: 'in_progress',
    description: 'صوت خفيف في مراوح التكييف، مطلوب فحص الفريون والتنظيف الدوري',
    createdAt: '2026-08-01',
    technicianAssigned: 'مهندس أحمد الفني (شركة التكييف الذكي)',
    smartLockCodeGranted: 'رمز مؤقت 4 ساعات (883921)'
  },
  {
    id: 't-102',
    unitId: 'u-202',
    unitNumber: '202',
    buildingName: 'برج الواحة الذكي',
    tenantName: 'محمد الدوسري',
    title: 'تسريب بسيط في صنبور المغسلة',
    category: 'plumbing',
    priority: 'low',
    status: 'open',
    description: 'الحساس الكهرومغناطيسي للماء سجل تنقيط 0.5 لتر/ساعة',
    createdAt: '2026-08-02',
  }
];

export const INITIAL_FACILITY_BOOKINGS: FacilityBooking[] = [
  {
    id: 'fb-1',
    facilityName: 'شاحن السيارات الكهربائية السريع (EV Charger #1)',
    buildingName: 'برج الواحة الذكي',
    unitNumber: '101',
    tenantName: 'عبدالله السلمان',
    date: '2026-08-03',
    timeSlot: '01:00 AM - 05:00 AM (ساعات التوفير)',
    status: 'confirmed'
  },
  {
    id: 'fb-2',
    facilityName: 'النادي الرياضي والصالة المغلقة',
    buildingName: 'برج الواحة الذكي',
    unitNumber: '202',
    tenantName: 'محمد الدوسري',
    date: '2026-08-03',
    timeSlot: '06:00 PM - 08:00 PM',
    status: 'confirmed'
  }
];

export const INITIAL_CAMERAS: CameraFeed[] = [
  {
    id: 'cam-b1-entrance',
    buildingId: 'b-1',
    buildingName: 'برج الواحة الذكي',
    locationName: 'المدخل الرئيسي للبرج',
    type: 'public',
    isLive: true,
    logs: [
      { id: 'cl-1', timestamp: '22:45:10', event: 'تم رصد حركة عند البوابة الإلكترونية' },
      { id: 'cl-2', timestamp: '21:12:00', event: 'فتح البوابة الذكية بواسطة كرت الزائر' },
    ]
  },
  {
    id: 'cam-b1-garage',
    buildingId: 'b-1',
    buildingName: 'برج الواحة الذكي',
    locationName: 'موقف السيارات القبو B1',
    type: 'public',
    isLive: true,
    logs: [
      { id: 'cl-3', timestamp: '20:30:15', event: 'دخول سيارة الشقة 101 للموقف المخصص' }
    ]
  },
  {
    id: 'cam-b1-garden',
    buildingId: 'b-1',
    buildingName: 'برج الواحة الذكي',
    locationName: 'كاميرة الحديقة والنوافير',
    type: 'public',
    isLive: true,
    logs: [
      { id: 'cl-4', timestamp: '05:00:01', event: 'تشغيل أوتوماتيكي لمضخات الري والنوافير' }
    ]
  },
  {
    id: 'cam-u101',
    buildingId: 'b-1',
    buildingName: 'برج الواحة الذكي',
    unitId: 'u-101',
    unitNumber: '101',
    locationName: 'كاميرا مدخل شقة 101 (خاصة بالمستأجر)',
    type: 'private_unit',
    isLive: true,
    logs: [
      { id: 'cl-5', timestamp: '19:15:00', event: 'رصد حركة أمام باب الشقة 101' }
    ]
  },
  {
    id: 'cam-u102',
    buildingId: 'b-1',
    buildingName: 'برج الواحة الذكي',
    unitId: 'u-102',
    unitNumber: '102',
    locationName: 'كاميرا مدخل شقة 102 (انتهى عقد إيجارها)',
    type: 'private_unit',
    isLive: false,
    logs: [
      { id: 'cl-6', timestamp: '2026-07-31', event: 'انتهت عقد الإيجار - تم قفل الكاميرة وأرشفة السجل بالداتا بيز' }
    ]
  }
];

export const INITIAL_SECURITY_SETTINGS: SecuritySettings = {
  e2eeEnabled: true,
  e2eeAlgorithm: 'AES-256-GCM + ECDH (Curve25519)',
  masterKeyFingerprint: 'SHA256:7f8e12a99c43b8112e87a912f00902c3188a109',
  lastKeyRotation: '2026-08-01 00:00:00',
  autoKeyRotationDays: 30,
  
  mfaEnforced: true,
  sessionTimeoutMinutes: 30,
  maxFailedLoginAttempts: 3,
  ipWhitelistEnabled: false,
  allowedIpRanges: '192.168.1.0/24, 10.0.0.0/8',
  requireSpecialCharPassword: true,
  minPasswordLength: 12,

  auditLoggingEnabled: true,
  logRetentionDays: 90,
  obfuscateUserData: true
};

export const INITIAL_PREDICTIVE_DIAGNOSTICS: PredictiveDiagnostic[] = [
  {
    id: 'pred-1',
    applianceId: 'dev-101-1',
    applianceName: 'مكيف انفرتر الصالة الذكي',
    unitNumber: '101',
    buildingName: 'برج الواحة الذكي',
    healthScore: 92,
    faultProbability: 8,
    estimatedDaysToFailure: 180,
    anomalyDetected: 'استهلاك مستقر وبدون تذبذب في التيار',
    recommendation: 'تنظيف الفلتر بعد 30 يوماً',
    severity: 'good'
  },
  {
    id: 'pred-2',
    applianceId: 'dev-102-1',
    applianceName: 'مكيف غرفة المعيشة VRF',
    unitNumber: '102',
    buildingName: 'برج الواحة الذكي',
    healthScore: 54,
    faultProbability: 68,
    estimatedDaysToFailure: 12,
    anomalyDetected: 'ارتفاع حرارة المحرك + تذبذب في واط الطاقة بنسبة +35%',
    recommendation: 'تغيير مكثف محرك التبريد وفحص شحنة الفريون فوراً',
    severity: 'critical'
  },
  {
    id: 'pred-3',
    applianceId: 'dev-101-2',
    applianceName: 'سخان المياه الذكي',
    unitNumber: '101',
    buildingName: 'برج الواحة الذكي',
    healthScore: 78,
    faultProbability: 22,
    estimatedDaysToFailure: 65,
    anomalyDetected: 'تراكم خفيف للأملاح على عنصر التسخين',
    recommendation: 'عمل دورة تنظيف تفريغ أملاح شهرية',
    severity: 'warning'
  }
];

