export type UserRole = 'super_admin' | 'owner' | 'tenant';

export interface SystemUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  assignedBuildingIds: string[]; // For property owners
  assignedUnitId?: string;       // For tenants
  tempPassword?: string;
  magicLinkCode?: string;
  status: 'active' | 'suspended' | 'pending';
  mfaEnabled: boolean;
  lastLogin: string;
}

export interface SecurityAuditLog {
  id: string;
  timestamp: string;
  action: string;
  userEmail: string;
  ipHash: string;             // e.g. "192.168.x.x -> Sanitized"
  encryptedDigest: string;   // SHA-256 HMAC digest to obfuscate DB scheme from hackers
  severity: 'info' | 'warning' | 'security_alert';
}

export interface SecuritySettings {
  e2eeEnabled: boolean;
  e2eeAlgorithm: string; // e.g. "AES-256-GCM + ECDH (Curve25519)"
  masterKeyFingerprint: string;
  lastKeyRotation: string;
  autoKeyRotationDays: number;
  
  // Access Policies
  mfaEnforced: boolean;
  sessionTimeoutMinutes: number;
  maxFailedLoginAttempts: number;
  ipWhitelistEnabled: boolean;
  allowedIpRanges: string;
  requireSpecialCharPassword: boolean;
  minPasswordLength: number;

  // System Audit Logging
  auditLoggingEnabled: boolean;
  logRetentionDays: number;
  obfuscateUserData: boolean;
}

export type PaymentMethodType = 'visa_mastercard' | 'mada' | 'apple_pay' | 'sadad' | 'bank_transfer';

export interface PaymentReceipt {
  invoiceId: string;
  paymentMethod: PaymentMethodType;
  transactionId: string;
  amount: number;
  timestamp: string;
  cardLastFour?: string;
}

export interface LeaseInfo {
  tenantName: string;
  tenantEmail: string;
  startDate: string;
  endDate: string;
  status: 'active' | 'expired' | 'pending';
}

export interface Building {
  id: string;
  name: string;
  code: string;
  address: string;
  floorsCount: number;
  totalUnitsCount: number;
  imageUrl?: string;
  createdAt: string;
}

export type ConsumptionTier = 'low' | 'normal' | 'high';

export interface Unit {
  id: string;
  buildingId: string;
  unitNumber: string;
  floor: number;
  rooms: number;
  status: 'rented' | 'vacant' | 'maintenance';
  tenant?: LeaseInfo;
  energyTier: ConsumptionTier; // استهلاك منخفض أم عالي
  monthlyElectricityKWh: number; // إجمالي الكهرباء
  monthlyWaterLiters: number;   // إجمالي الماء لكل شقة منفصلة
  createdAt: string;
}

export type ApplianceType = 
  | 'ac' 
  | 'fridge' 
  | 'tv' 
  | 'water_heater' 
  | 'washing_machine' 
  | 'ev_charger' 
  | 'lighting' 
  | 'purifier' 
  | 'oven' 
  | 'smart_lock';

export type ConnectionType = 'wifi' | 'bluetooth' | 'hybrid';

export interface SmartAppliance {
  id: string;
  unitId: string;
  buildingId: string;
  name: string;
  type: ApplianceType;
  connection: ConnectionType;
  isOn: boolean;
  powerWatts: number;            // واط عند التشغيل
  waterLitersPerMin: number;     // لتر/دقيقة (للغسالة وسخان الماء)
  dailyHoursUsed: number;
  autoScheduleEnabled: boolean;
  scheduledOnTime?: string;      // مثلا "07:00"
  scheduledOffTime?: string;     // مثلا "23:00"
  aiAutomationActive: boolean;
  aiNotes?: string;
}

export interface GardenSystemState {
  soilMoisture: number;         // 0 - 100%
  temperature: number;          // Celsius
  humidity: number;             // %
  isRaining: boolean;           // حساس المطر
  pumpsActive: boolean;         // المضخات
  fountainsActive: boolean;     // النوافير
  scheduledTime: string;        // default "05:00"
  autoMode: boolean;
  lastIrrigationTime?: string;
  rainInhibitedCount: number;
  logs: Array<{ id: string; timestamp: string; message: string; type: 'info' | 'rain' | 'pump' | 'alert' }>;
}

export interface Invoice {
  id: string;
  unitId: string;
  buildingId: string;
  buildingName: string;
  unitNumber: string;
  tenantName: string;
  billingPeriod: string; // e.g., "أغسطس 2026"
  electricityKWh: number;
  electricityRatePerKWh: number; // e.g. 0.18 SAR
  electricityTotalCost: number;
  waterLiters: number;
  waterRatePerLiter: number;     // e.g. 0.005 SAR
  waterTotalCost: number;
  totalCost: number;
  status: 'paid' | 'unpaid' | 'overdue';
  dueDate: string;
  createdAt: string;
}

export interface CameraLog {
  id: string;
  timestamp: string;
  event: string;
  snapshotUrl?: string;
}

export interface CameraFeed {
  id: string;
  buildingId: string;
  buildingName: string;
  unitId?: string; // null IF public (entrance, garage, garden)
  unitNumber?: string;
  locationName: string; // e.g., "المدخل الرئيسي", "موقف السيارات", "حديقة المبنى", "صالة الشقة 101"
  type: 'public' | 'private_unit';
  isLive: boolean;
  streamUrl?: string;
  logs: CameraLog[];
}

export interface GeminiWellbeingTip {
  id: string;
  category: 'energy' | 'wellbeing' | 'automation' | 'maintenance';
  title: string;
  description: string;
  actionRequired?: string;
  potentialSavings?: string;
}

export type EmergencyType = 
  | 'sos_manual'        // زر الاستغاثة اليدوي
  | 'smoke_fire'         // حساس الدخان والحريق
  | 'gas_leak'          // حساس تسريب الغاز
  | 'water_flood'        // حساس تسرب المياه والفيضان
  | 'intrusion'          // حساس الاقتحام والسطو
  | 'seismic'            // حساس الهزات الأرضية
  | 'fall_detected';     // حساس سقوط وتوقف الحركة كبار السن

export interface EmergencyAlert {
  id: string;
  type: EmergencyType;
  title: string;
  buildingId: string;
  buildingName: string;
  unitId?: string;
  unitNumber?: string;
  locationName: string;
  tenantName?: string;
  status: 'active' | 'resolved';
  timestamp: string;
  actionsTaken: string[];
  sensorValue?: string;
  severity: 'high' | 'critical';
}

export interface MaintenanceTicket {
  id: string;
  unitId: string;
  unitNumber: string;
  buildingName: string;
  tenantName: string;
  title: string;
  category: 'plumbing' | 'electrical' | 'hvac' | 'appliance' | 'general';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'open' | 'in_progress' | 'completed';
  description: string;
  createdAt: string;
  technicianAssigned?: string;
  smartLockCodeGranted?: string;
}

export interface FacilityBooking {
  id: string;
  facilityName: string; // e.g., "نادي المبنى الرياضي", "شاحن السيارات الكهربائية السريع", "الحديقة والمجلس العلوي"
  buildingName: string;
  unitNumber: string;
  tenantName: string;
  date: string;
  timeSlot: string;
  status: 'confirmed' | 'cancelled';
}

export interface PredictiveDiagnostic {
  id: string;
  applianceId: string;
  applianceName: string;
  unitNumber: string;
  buildingName: string;
  healthScore: number; // 0 - 100%
  faultProbability: number; // %
  estimatedDaysToFailure: number;
  anomalyDetected: string;
  recommendation: string;
  severity: 'good' | 'warning' | 'critical';
}
