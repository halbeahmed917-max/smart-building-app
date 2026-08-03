import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  Building, 
  Unit, 
  SmartAppliance, 
  GardenSystemState, 
  Invoice, 
  CameraFeed, 
  UserRole,
  ApplianceType,
  ConnectionType,
  ConsumptionTier,
  EmergencyAlert,
  EmergencyType,
  MaintenanceTicket,
  FacilityBooking,
  PredictiveDiagnostic,
  SystemUser,
  SecurityAuditLog,
  SecuritySettings,
  PaymentMethodType,
  PaymentReceipt
} from '../types';
import { 
  INITIAL_BUILDINGS, 
  INITIAL_UNITS, 
  INITIAL_APPLIANCES, 
  INITIAL_GARDEN_STATE, 
  INITIAL_INVOICES, 
  INITIAL_CAMERAS,
  INITIAL_EMERGENCY_ALERTS,
  INITIAL_MAINTENANCE_TICKETS,
  INITIAL_FACILITY_BOOKINGS,
  INITIAL_PREDICTIVE_DIAGNOSTICS,
  INITIAL_SYSTEM_USERS,
  INITIAL_SECURITY_LOGS,
  INITIAL_SECURITY_SETTINGS
} from '../data/initialData';

interface AppContextType {
  // User & Auth Role & System Users
  userRole: UserRole;
  setUserRole: (role: UserRole) => void;
  currentUser: SystemUser;
  setCurrentUser: (user: SystemUser) => void;
  systemUsers: SystemUser[];
  addSystemUser: (newUser: Omit<SystemUser, 'id' | 'lastLogin'>) => SystemUser;
  updateUserStatus: (userId: string, status: 'active' | 'suspended') => void;
  loginWithEmail: (email: string, pass?: string) => { success: boolean; message: string; user?: SystemUser };

  activeTenantUnitId: string;
  setActiveTenantUnitId: (unitId: string) => void;
  
  // Active Navigation Tab
  activeTab: number;
  setActiveTab: (tabIndex: number) => void;

  // Selected Building Filter
  selectedBuildingId: string | 'all';
  setSelectedBuildingId: (id: string | 'all') => void;

  // Buildings Data & Actions
  buildings: Building[];
  addBuilding: (newBuilding: Omit<Building, 'id' | 'createdAt'>) => Building;

  // Units Data & Actions
  units: Unit[];
  addUnit: (newUnit: Omit<Unit, 'id' | 'createdAt'>) => Unit;
  updateUnitLease: (unitId: string, tenantName: string, tenantEmail: string, startDate: string, endDate: string, status: 'active' | 'expired') => void;

  // Smart Appliances & Actions
  appliances: SmartAppliance[];
  addAppliance: (newAppliance: Omit<SmartAppliance, 'id'>) => SmartAppliance;
  addApplianceSimple: (name: string, type: ApplianceType, unitId?: string) => SmartAppliance;
  toggleAppliance: (id: string) => void;
  updateApplianceSchedule: (id: string, autoScheduleEnabled: boolean, onTime?: string, offTime?: string) => void;
  toggleAiAutomation: (id: string) => void;
  executeVoiceApplianceControl: (textCommand: string) => { success: boolean; message: string; applianceName?: string; newState?: boolean };

  // Garden & Wokwi Simulator State
  gardenState: GardenSystemState;
  setSoilMoisture: (moisture: number) => void;
  setTemperature: (temp: number) => void;
  setHumidity: (hum: number) => void;
  toggleRainSensor: () => void;
  toggleGardenPump: () => void;
  toggleGardenFountain: () => void;
  setGardenAutoSchedule: (time: string) => void;
  resetGardenSimulation: () => void;

  // Invoices & Multi-Method Payment System
  invoices: Invoice[];
  paymentReceipts: PaymentReceipt[];
  generateInvoiceForUnit: (unitId: string, period: string) => Invoice;
  toggleInvoiceStatus: (invoiceId: string) => void;
  payInvoice: (invoiceId: string, method: PaymentMethodType, cardLastFour?: string) => PaymentReceipt;

  // CCTV Privacy & Theft Incident Emergency Policy
  cameras: CameraFeed[];
  addCameraLog: (cameraId: string, event: string) => void;
  hasCameraAccess: (camera: CameraFeed) => { allowed: boolean; reason: string };
  reportedTheftUnits: string[];
  reportTheftIncident: (unitId: string, description?: string) => void;

  // Emergency & Integrated Sensors System
  emergencyAlerts: EmergencyAlert[];
  triggerEmergency: (type: EmergencyType, locationName?: string, unitId?: string) => EmergencyAlert;
  resolveEmergency: (alertId: string) => void;
  activeEmergencyCount: number;

  // Maintenance Tickets & Tech Dispatch
  maintenanceTickets: MaintenanceTicket[];
  addMaintenanceTicket: (newTicket: Omit<MaintenanceTicket, 'id' | 'createdAt' | 'status'>) => MaintenanceTicket;
  updateTicketStatus: (ticketId: string, status: 'open' | 'in_progress' | 'completed', techName?: string) => void;

  // Facility Booking
  facilityBookings: FacilityBooking[];
  addFacilityBooking: (booking: Omit<FacilityBooking, 'id' | 'status'>) => FacilityBooking;

  // AI Predictive Maintenance & Anomaly Diagnostics
  predictiveDiagnostics: PredictiveDiagnostic[];
  runPredictiveCheck: (applianceId: string) => PredictiveDiagnostic;

  // Zero-Trust Cybersecurity Audit Logs & E2EE Settings
  securityLogs: SecurityAuditLog[];
  addSecurityLog: (action: string, severity?: 'info' | 'warning' | 'security_alert') => void;
  securitySettings: SecuritySettings;
  updateSecuritySettings: (newSettings: Partial<SecuritySettings>) => void;
  rotateMasterEncryptionKey: () => string;
  clearSecurityLogs: () => void;

  // Helper getters
  getBuildingStats: (buildingId: string) => { totalUnits: number; totalElectricityKWh: number; perUnitWater: Array<{ unitNumber: string; waterLiters: number; tenantName?: string }> };
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load initial states from localStorage if present
  const [userRole, setUserRole] = useState<UserRole>(() => {
    return (localStorage.getItem('user_role') as UserRole) || 'owner';
  });

  const [activeTenantUnitId, setActiveTenantUnitId] = useState<string>(() => {
    return localStorage.getItem('active_tenant_unit_id') || 'u-101';
  });

  const [activeTab, setActiveTab] = useState<number>(0);
  const [selectedBuildingId, setSelectedBuildingId] = useState<string | 'all'>('all');

  const [buildings, setBuildings] = useState<Building[]>(() => {
    const saved = localStorage.getItem('smart_buildings');
    return saved ? JSON.parse(saved) : INITIAL_BUILDINGS;
  });

  const [units, setUnits] = useState<Unit[]>(() => {
    const saved = localStorage.getItem('smart_units');
    return saved ? JSON.parse(saved) : INITIAL_UNITS;
  });

  const [appliances, setAppliances] = useState<SmartAppliance[]>(() => {
    const saved = localStorage.getItem('smart_appliances');
    return saved ? JSON.parse(saved) : INITIAL_APPLIANCES;
  });

  const [gardenState, setGardenState] = useState<GardenSystemState>(() => {
    const saved = localStorage.getItem('smart_garden_state');
    return saved ? JSON.parse(saved) : INITIAL_GARDEN_STATE;
  });

  const [invoices, setInvoices] = useState<Invoice[]>(() => {
    const saved = localStorage.getItem('smart_invoices');
    return saved ? JSON.parse(saved) : INITIAL_INVOICES;
  });

  const [cameras, setCameras] = useState<CameraFeed[]>(() => {
    const saved = localStorage.getItem('smart_cameras');
    return saved ? JSON.parse(saved) : INITIAL_CAMERAS;
  });

  const [emergencyAlerts, setEmergencyAlerts] = useState<EmergencyAlert[]>(() => {
    const saved = localStorage.getItem('smart_emergency_alerts');
    return saved ? JSON.parse(saved) : INITIAL_EMERGENCY_ALERTS;
  });

  const [maintenanceTickets, setMaintenanceTickets] = useState<MaintenanceTicket[]>(() => {
    const saved = localStorage.getItem('smart_maintenance_tickets');
    return saved ? JSON.parse(saved) : INITIAL_MAINTENANCE_TICKETS;
  });

  const [facilityBookings, setFacilityBookings] = useState<FacilityBooking[]>(() => {
    const saved = localStorage.getItem('smart_facility_bookings');
    return saved ? JSON.parse(saved) : INITIAL_FACILITY_BOOKINGS;
  });

  const [predictiveDiagnostics, setPredictiveDiagnostics] = useState<PredictiveDiagnostic[]>(() => {
    const saved = localStorage.getItem('smart_predictive_diagnostics');
    return saved ? JSON.parse(saved) : INITIAL_PREDICTIVE_DIAGNOSTICS;
  });

  const [systemUsers, setSystemUsers] = useState<SystemUser[]>(() => {
    const saved = localStorage.getItem('smart_system_users');
    return saved ? JSON.parse(saved) : INITIAL_SYSTEM_USERS;
  });

  const [securityLogs, setSecurityLogs] = useState<SecurityAuditLog[]>(() => {
    const saved = localStorage.getItem('smart_security_logs');
    return saved ? JSON.parse(saved) : INITIAL_SECURITY_LOGS;
  });

  const [securitySettings, setSecuritySettings] = useState<SecuritySettings>(() => {
    const saved = localStorage.getItem('smart_security_settings');
    return saved ? JSON.parse(saved) : INITIAL_SECURITY_SETTINGS;
  });

  const [paymentReceipts, setPaymentReceipts] = useState<PaymentReceipt[]>(() => {
    const saved = localStorage.getItem('smart_payment_receipts');
    return saved ? JSON.parse(saved) : [];
  });

  const [reportedTheftUnits, setReportedTheftUnits] = useState<string[]>(() => {
    const saved = localStorage.getItem('smart_theft_units');
    return saved ? JSON.parse(saved) : [];
  });

  const [currentUser, setCurrentUser] = useState<SystemUser>(() => {
    return systemUsers.find(u => u.role === userRole) || systemUsers[0];
  });

  // Save changes to LocalStorage
  useEffect(() => {
    localStorage.setItem('user_role', userRole);
  }, [userRole]);

  useEffect(() => {
    localStorage.setItem('smart_system_users', JSON.stringify(systemUsers));
  }, [systemUsers]);

  useEffect(() => {
    localStorage.setItem('smart_security_logs', JSON.stringify(securityLogs));
  }, [securityLogs]);

  useEffect(() => {
    localStorage.setItem('smart_security_settings', JSON.stringify(securitySettings));
  }, [securitySettings]);

  useEffect(() => {
    localStorage.setItem('smart_payment_receipts', JSON.stringify(paymentReceipts));
  }, [paymentReceipts]);

  useEffect(() => {
    localStorage.setItem('smart_theft_units', JSON.stringify(reportedTheftUnits));
  }, [reportedTheftUnits]);

  useEffect(() => {
    localStorage.setItem('active_tenant_unit_id', activeTenantUnitId);
  }, [activeTenantUnitId]);

  useEffect(() => {
    localStorage.setItem('smart_buildings', JSON.stringify(buildings));
  }, [buildings]);

  useEffect(() => {
    localStorage.setItem('smart_units', JSON.stringify(units));
  }, [units]);

  useEffect(() => {
    localStorage.setItem('smart_appliances', JSON.stringify(appliances));
  }, [appliances]);

  useEffect(() => {
    localStorage.setItem('smart_garden_state', JSON.stringify(gardenState));
  }, [gardenState]);

  useEffect(() => {
    localStorage.setItem('smart_invoices', JSON.stringify(invoices));
  }, [invoices]);

  useEffect(() => {
    localStorage.setItem('smart_cameras', JSON.stringify(cameras));
  }, [cameras]);

  useEffect(() => {
    localStorage.setItem('smart_emergency_alerts', JSON.stringify(emergencyAlerts));
  }, [emergencyAlerts]);

  useEffect(() => {
    localStorage.setItem('smart_maintenance_tickets', JSON.stringify(maintenanceTickets));
  }, [maintenanceTickets]);

  useEffect(() => {
    localStorage.setItem('smart_facility_bookings', JSON.stringify(facilityBookings));
  }, [facilityBookings]);

  useEffect(() => {
    localStorage.setItem('smart_predictive_diagnostics', JSON.stringify(predictiveDiagnostics));
  }, [predictiveDiagnostics]);

  // Requirement 2: Add New Building
  const addBuilding = (newB: Omit<Building, 'id' | 'createdAt'>): Building => {
    const created: Building = {
      ...newB,
      id: `b-${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0],
    };
    setBuildings((prev) => [...prev, created]);

    // Also add default camera for new building
    const newCam: CameraFeed = {
      id: `cam-${created.id}-entrance`,
      buildingId: created.id,
      buildingName: created.name,
      locationName: `المدخل الرئيسي (${created.name})`,
      type: 'public',
      isLive: true,
      logs: [{ id: `log-${Date.now()}`, timestamp: new Date().toLocaleTimeString('ar-SA'), event: 'تم ربط البوابة بالكاميرا والداتا بيز' }]
    };
    setCameras(prev => [...prev, newCam]);

    return created;
  };

  // Requirement 3: Add New Unit
  const addUnit = (newU: Omit<Unit, 'id' | 'createdAt'>): Unit => {
    const created: Unit = {
      ...newU,
      id: `u-${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0],
    };
    setUnits((prev) => [...prev, created]);

    // Update total building unit count
    setBuildings((prev) =>
      prev.map((b) =>
        b.id === created.buildingId
          ? { ...b, totalUnitsCount: b.totalUnitsCount + 1 }
          : b
      )
    );

    return created;
  };

  const updateUnitLease = (
    unitId: string,
    tenantName: string,
    tenantEmail: string,
    startDate: string,
    endDate: string,
    status: 'active' | 'expired'
  ) => {
    setUnits((prev) =>
      prev.map((u) => {
        if (u.id === unitId) {
          return {
            ...u,
            status: status === 'active' ? 'rented' : 'vacant',
            tenant: {
              tenantName,
              tenantEmail,
              startDate,
              endDate,
              status,
            },
          };
        }
        return u;
      })
    );
  };

  // Requirement 3 & 5: Add Smart Appliance to Unit
  const addAppliance = (newDev: Omit<SmartAppliance, 'id'>): SmartAppliance => {
    const created: SmartAppliance = {
      ...newDev,
      id: `dev-${Date.now()}`,
    };
    setAppliances((prev) => [...prev, created]);

    // Re-calculate unit energy tier based on power watts
    updateUnitTier(created.unitId);

    return created;
  };

  const updateUnitTier = (unitId: string) => {
    setUnits((prev) =>
      prev.map((u) => {
        if (u.id === unitId) {
          const unitDevs = appliances.filter((a) => a.unitId === unitId);
          const totalWatts = unitDevs.reduce((sum, d) => sum + (d.isOn ? d.powerWatts : 0), 0);
          let newTier: ConsumptionTier = 'low';
          if (totalWatts > 4000 || u.monthlyElectricityKWh > 600) {
            newTier = 'high';
          } else if (totalWatts > 1500 || u.monthlyElectricityKWh > 300) {
            newTier = 'normal';
          }
          return { ...u, energyTier: newTier };
        }
        return u;
      })
    );
  };

  // Requirement 5: Remote Control Toggle
  const toggleAppliance = (id: string) => {
    setAppliances((prev) =>
      prev.map((a) => (a.id === id ? { ...a, isOn: !a.isOn } : a))
    );
  };

  // Requirement 5: AI / Automatic Schedule Timers
  const updateApplianceSchedule = (
    id: string,
    autoScheduleEnabled: boolean,
    onTime?: string,
    offTime?: string
  ) => {
    setAppliances((prev) =>
      prev.map((a) =>
        a.id === id
          ? {
              ...a,
              autoScheduleEnabled,
              scheduledOnTime: onTime,
              scheduledOffTime: offTime,
            }
          : a
      )
    );
  };

  const toggleAiAutomation = (id: string) => {
    setAppliances((prev) =>
      prev.map((a) =>
        a.id === id
          ? {
              ...a,
              aiAutomationActive: !a.aiAutomationActive,
              aiNotes: !a.aiAutomationActive
                ? 'مفعل أوتوماتيكياً بواسطة الذكاء الاصطناعي لتوفير الطاقة'
                : undefined,
            }
          : a
      )
    );
  };

  // Requirement 6: Wokwi Garden Simulator Logic with Rain Sensor Inhibition & 5:00 AM Irrigation
  const setSoilMoisture = (moisture: number) => {
    setGardenState((prev) => {
      // Auto logic check: If soil moisture < 35% and NOT raining and autoMode is on, start pumps
      let pumps = prev.pumpsActive;
      let fountains = prev.fountainsActive;
      const logs = [...prev.logs];
      const timeStr = new Date().toLocaleTimeString('ar-SA');

      if (prev.isRaining) {
        // Rain sensor detects rain -> ALWAYS INHIBIT watering!
        pumps = false;
        fountains = false;
      } else if (prev.autoMode) {
        if (moisture < 35 && !prev.pumpsActive) {
          pumps = true;
          fountains = true;
          logs.unshift({
            id: `g-${Date.now()}`,
            timestamp: timeStr,
            message: `انخفاض رطوبة التربة إلى ${moisture}% - تم تشغيل مضخات الري والنوافير أوتوماتيكياً`,
            type: 'pump',
          });
        } else if (moisture >= 75 && prev.pumpsActive) {
          pumps = false;
          fountains = false;
          logs.unshift({
            id: `g-${Date.now()}`,
            timestamp: timeStr,
            message: `وصول رطوبة التربة إلى ${moisture}% - تم إيقاف الري أوتوماتيكياً لمنع الفائض`,
            type: 'info',
          });
        }
      }

      return {
        ...prev,
        soilMoisture: moisture,
        pumpsActive: pumps,
        fountainsActive: fountains,
        logs: logs.slice(0, 15),
      };
    });
  };

  const setTemperature = (temp: number) => {
    setGardenState((prev) => ({ ...prev, temperature: temp }));
  };

  const setHumidity = (hum: number) => {
    setGardenState((prev) => ({ ...prev, humidity: hum }));
  };

  // Requirement 6: Rain Sensor Trigger Logic
  const toggleRainSensor = () => {
    setGardenState((prev) => {
      const nextRaining = !prev.isRaining;
      const logs = [...prev.logs];
      const timeStr = new Date().toLocaleTimeString('ar-SA');

      if (nextRaining) {
        logs.unshift({
          id: `g-${Date.now()}`,
          timestamp: timeStr,
          message: '🌧️ كشف هطول الأمطار بواسطة حساس Wokwi! تم إلغاء الري وإغلاق المضخات لمنع الري الفائض.',
          type: 'rain',
        });
        return {
          ...prev,
          isRaining: true,
          pumpsActive: false,
          fountainsActive: false,
          rainInhibitedCount: prev.rainInhibitedCount + 1,
          logs: logs.slice(0, 15),
        };
      } else {
        logs.unshift({
          id: `g-${Date.now()}`,
          timestamp: timeStr,
          message: 'توقف الأمطار - إعادة تفعيل وضع مراقبة حساس رطوبة التربة',
          type: 'info',
        });
        return {
          ...prev,
          isRaining: false,
          logs: logs.slice(0, 15),
        };
      }
    });
  };

  const toggleGardenPump = () => {
    setGardenState((prev) => {
      if (prev.isRaining && !prev.pumpsActive) {
        alert('لا يمكن تشغيل الري يدوياً أثناء هطول الأمطار لحماية المزروعات من الري الفائض!');
        return prev;
      }
      return { ...prev, pumpsActive: !prev.pumpsActive };
    });
  };

  const toggleGardenFountain = () => {
    setGardenState((prev) => ({ ...prev, fountainsActive: !prev.fountainsActive }));
  };

  const setGardenAutoSchedule = (time: string) => {
    setGardenState((prev) => ({ ...prev, scheduledTime: time }));
  };

  const resetGardenSimulation = () => {
    setGardenState(INITIAL_GARDEN_STATE);
  };

  // Requirement 7: Invoicing System
  const generateInvoiceForUnit = (unitId: string, period: string): Invoice => {
    const unit = units.find((u) => u.id === unitId);
    const building = buildings.find((b) => b.id === unit?.buildingId);

    if (!unit) throw new Error('الشقة غير موجودة');

    // Calculate costs based on consumption rates
    const eKWh = unit.monthlyElectricityKWh || 350;
    const wLiters = unit.monthlyWaterLiters || 4000;
    const eRate = 0.18; // 0.18 SAR per kWh
    const wRate = 0.006; // 0.006 SAR per Liter
    const eTotal = parseFloat((eKWh * eRate).toFixed(2));
    const wTotal = parseFloat((wLiters * wRate).toFixed(2));
    const grandTotal = parseFloat((eTotal + wTotal).toFixed(2));

    const newInv: Invoice = {
      id: `inv-${Date.now()}`,
      unitId: unit.id,
      buildingId: unit.buildingId,
      buildingName: building?.name || 'مبنى ذكي',
      unitNumber: unit.unitNumber,
      tenantName: unit.tenant?.tenantName || 'غير مسجل',
      billingPeriod: period,
      electricityKWh: eKWh,
      electricityRatePerKWh: eRate,
      electricityTotalCost: eTotal,
      waterLiters: wLiters,
      waterRatePerLiter: wRate,
      waterTotalCost: wTotal,
      totalCost: grandTotal,
      status: 'unpaid',
      dueDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      createdAt: new Date().toISOString().split('T')[0],
    };

    setInvoices((prev) => [newInv, ...prev]);
    return newInv;
  };

  const toggleInvoiceStatus = (invoiceId: string) => {
    setInvoices((prev) =>
      prev.map((inv) =>
        inv.id === invoiceId
          ? { ...inv, status: inv.status === 'paid' ? 'unpaid' : 'paid' }
          : inv
      )
    );
  };

  // Requirement 8 & 9 & Privacy Matrix: CCTV Access Control Matrix Database Policy
  const hasCameraAccess = (camera: CameraFeed): { allowed: boolean; reason: string } => {
    // 1. Super Admin has full access to system cameras
    if (userRole === 'super_admin') {
      return { allowed: true, reason: 'صلاحية المدير الرئيسي (Super Admin) للرقابة البرمجية' };
    }

    // 2. Owner Access Rules (المالك):
    if (userRole === 'owner') {
      if (camera.type === 'public') {
        return { allowed: true, reason: 'حق المالك في مشاهدة المرافق العامة للمبنى' };
      }
      // If private unit camera:
      const unit = units.find((u) => u.id === camera.unitId);
      if (!unit) return { allowed: false, reason: 'الوحدة غير موجودة في الداتا بيز' };

      // Check if there is an active emergency or theft incident in this unit
      const isTheftOrEmergencyActive = emergencyAlerts.some(
        a => a.unitId === unit.id && a.status === 'active'
      ) || reportedTheftUnits.includes(unit.id);

      if (isTheftOrEmergencyActive) {
        return { 
          allowed: true, 
          reason: `🚨 تفعيل الاستثناء الأمني للمالك: تم فتح بث البث المباشر للشقة ${unit.unitNumber} مؤقتاً لوجود إنذار سرقة أو حالة طوارئ نشطة!` 
        };
      }

      // If unit is rented and lease is active -> Strict Privacy Shield
      if (unit.status === 'rented' && unit.tenant?.status === 'active') {
        return { 
          allowed: false, 
          reason: `🔒 تم حجب البث عن المالك لحماية خصوصية المستأجر: الشقة ${unit.unitNumber} مؤجرة. لا يحق للمالك مشاهدة التسجيلات إلا عند انتهاء العقد أو حدوث سرقة أو مشكلة طارئة.` 
        };
      }
      return { allowed: true, reason: 'الشقة غير مؤجرة حالياً (عقد منتهي أو شاغرة) - يحق للمالك المعاينة' };
    }

    // 3. Tenant Access Rules (المستأجر):
    if (userRole === 'tenant') {
      const activeUnit = units.find((u) => u.id === activeTenantUnitId);

      // Check if lease has expired
      if (!activeUnit || activeUnit.tenant?.status === 'expired') {
        return { 
          allowed: false, 
          reason: '⛔ انتهت فترة الإيجار الخاصة بحسابك! تم سحب صلاحية الوصول للكاميرات والنظام تلقائياً بانتهاء العقد.' 
        };
      }

      // If camera is public (entrance, garden, garage)
      if (camera.type === 'public' && camera.buildingId === activeUnit.buildingId) {
        return { allowed: true, reason: 'صلاحية المستأجر لمشاهدة مدخل ومرافق مبناه' };
      }

      // If camera belongs to tenant's unit
      if (camera.unitId === activeUnit.id) {
        return { allowed: true, reason: 'حق المستأجر الكامل في مشاهدة كاميرا شقته الخاصة' };
      }

      return { allowed: false, reason: '🔒 غير مصرح: هذه الكاميرا تابعة لشقة مستأجر آخر!' };
    }

    return { allowed: false, reason: 'نوع المستخدم غير معروف' };
  };

  const addCameraLog = (cameraId: string, event: string) => {
    setCameras((prev) =>
      prev.map((c) =>
        c.id === cameraId
          ? {
              ...c,
              logs: [
                {
                  id: `cl-${Date.now()}`,
                  timestamp: new Date().toLocaleTimeString('ar-SA'),
                  event,
                },
                ...c.logs,
              ],
            }
          : c
      )
    );
  };

  // Requirement 2: Helper stats calculation per building
  const getBuildingStats = (buildingId: string) => {
    const bUnits = units.filter((u) => u.buildingId === buildingId);
    const totalUnits = bUnits.length;
    const totalElectricityKWh = bUnits.reduce((sum, u) => sum + u.monthlyElectricityKWh, 0);
    const perUnitWater = bUnits.map((u) => ({
      unitNumber: u.unitNumber,
      waterLiters: u.monthlyWaterLiters,
      tenantName: u.tenant?.tenantName,
    }));

    return { totalUnits, totalElectricityKWh, perUnitWater };
  };

  // Emergency & SOS Sensor Hub System
  const triggerEmergency = (type: EmergencyType, locationName?: string, targetUnitId?: string): EmergencyAlert => {
    const targetUnit = units.find(u => u.id === (targetUnitId || activeTenantUnitId)) || units[0];
    const targetBuilding = buildings.find(b => b.id === targetUnit.buildingId) || buildings[0];

    const actionsTaken: string[] = [];
    let title = 'إنذار طوارئ';
    let sensorVal = '';

    if (type === 'sos_manual') {
      title = '🚨 نداء استغاثة وطوارئ يدوي (SOS Button)';
      actionsTaken.push('تم تفعيل صافرة الإنذار الصوتية الضوئية بالمبنى');
      actionsTaken.push('تم توجيه اتصال طوارئ فوري للدفاع المدني وإدارة المبنى');
      actionsTaken.push('تم إرسال موقع وتحديد الغرفة تلقائياً للشرطة والإسعاف');
      actionsTaken.push('تم فتح القفل الذكي للباب الرئيسي لتسهيل دخول المنقذين');
    } else if (type === 'smoke_fire') {
      title = '🔥 كشف حريق ودخان متصاعد (حساس الدخان)';
      sensorVal = 'دخان 450 PPM - حرارة 68°C';
      actionsTaken.push('تم إرسال إشعار طوارئ للدفاع المدني');
      actionsTaken.push('إغلاق صمام الغاز الرئيسي تلقائياً');
      actionsTaken.push('فتح أقفال جميع الشقق ومخارج الطوارئ بالمبنى');
      actionsTaken.push('تشغيل مراوح الشفط ومرافق الإخلاء الذكية');
    } else if (type === 'gas_leak') {
      title = '⚠️ تسريب غاز قابل للإشتعال (حساس الغاز LPG)';
      sensorVal = 'غاز 1800 PPM (خطر إشتعال)';
      actionsTaken.push('قطع امدادات صمام الغاز الرئيسي فوراً');
      actionsTaken.push('فصل الشرارة والكهرباء عن المطبخ لمنع الانفجار');
      actionsTaken.push('تشغيل التهوية الذكية المقاومة للانفجار');
    } else if (type === 'water_flood') {
      title = '💧 تسرب مياه وانغمار (حساس الفيضان والماء)';
      sensorVal = 'تدفق مائي غمر الأرضية 2.5 cm';
      actionsTaken.push('إغلاق صمام المياه الكهرومغناطيسي الرئيسي');
      actionsTaken.push('فصل مقابس الكهرباء السفلية لمنع الماس الكهربائي');
    } else if (type === 'intrusion') {
      title = '🛡️ كشف اقتحام أو كسر الباب (حساس السطو والحركة)';
      sensorVal = 'رصد حركة مفاجئة + فتح الباب بالقوة';
      actionsTaken.push('التقاط صور فورية من كاميرا المدخل وحفظها بالداتا بيز');
      actionsTaken.push('إرسال تنبيه للمالك والأمن مع كشافات الإضاءة التحذيرية');
    } else if (type === 'seismic') {
      title = '🌋 اهتزاز وهزة أرضية (حساس الزلازل)';
      sensorVal = 'شدة اهتزاز 4.2 ريختر';
      actionsTaken.push('إيقاف المصاعد تلقائياً عند أقرب دور وفتح أبوابها');
      actionsTaken.push('إضاءة مسارات الإخلاء في الممرات والسلالم');
    } else if (type === 'fall_detected') {
      title = '🚑 رصد سقوط أو توقف حركة كبار السن';
      sensorVal = 'سقوط فجائي مع انعدام الحركة لـ 60 ثانية';
      actionsTaken.push('إرسال نداء استغاثة عاجل للإسعاف وأقارب المستأجر');
      actionsTaken.push('فتح باب الشقة للفرق الطبية');
    }

    const alert: EmergencyAlert = {
      id: `emg-${Date.now()}`,
      type,
      title,
      buildingId: targetBuilding.id,
      buildingName: targetBuilding.name,
      unitId: targetUnit.id,
      unitNumber: targetUnit.unitNumber,
      locationName: locationName || `شقة ${targetUnit.unitNumber} - ${targetBuilding.name}`,
      tenantName: targetUnit.tenant?.tenantName || 'ساكن المبنى',
      status: 'active',
      timestamp: new Date().toLocaleTimeString('ar-SA'),
      actionsTaken,
      sensorValue: sensorVal,
      severity: 'critical',
    };

    setEmergencyAlerts(prev => [alert, ...prev]);
    return alert;
  };

  const resolveEmergency = (alertId: string) => {
    setEmergencyAlerts(prev =>
      prev.map(a => (a.id === alertId ? { ...a, status: 'resolved' } : a))
    );
  };

  const activeEmergencyCount = emergencyAlerts.filter(a => a.status === 'active').length;

  // Maintenance Tickets & Tech Dispatch
  const addMaintenanceTicket = (newTicket: Omit<MaintenanceTicket, 'id' | 'createdAt' | 'status'>): MaintenanceTicket => {
    const created: MaintenanceTicket = {
      ...newTicket,
      id: `t-${Date.now()}`,
      status: 'open',
      createdAt: new Date().toISOString().split('T')[0],
      smartLockCodeGranted: `رمز مؤقت (${Math.floor(100000 + Math.random() * 900000)})`
    };
    setMaintenanceTickets(prev => [created, ...prev]);
    return created;
  };

  const updateTicketStatus = (ticketId: string, status: 'open' | 'in_progress' | 'completed', techName?: string) => {
    setMaintenanceTickets(prev =>
      prev.map(t =>
        t.id === ticketId
          ? {
              ...t,
              status,
              technicianAssigned: techName || t.technicianAssigned
            }
          : t
      )
    );
  };

  // Facility Bookings
  const addFacilityBooking = (booking: Omit<FacilityBooking, 'id' | 'status'>): FacilityBooking => {
    const created: FacilityBooking = {
      ...booking,
      id: `fb-${Date.now()}`,
      status: 'confirmed'
    };
    setFacilityBookings(prev => [created, ...prev]);
    return created;
  };

  // Predictive AI Check
  const runPredictiveCheck = (applianceId: string): PredictiveDiagnostic => {
    const app = appliances.find(a => a.id === applianceId);
    const unit = units.find(u => u.id === app?.unitId);
    const building = buildings.find(b => b.id === app?.buildingId);

    const health = Math.floor(60 + Math.random() * 38);
    const faultProb = 100 - health;
    const days = Math.floor(5 + Math.random() * 120);

    const diag: PredictiveDiagnostic = {
      id: `pred-${Date.now()}`,
      applianceId: applianceId,
      applianceName: app?.name || 'جهاز ذكي',
      unitNumber: unit?.unitNumber || '101',
      buildingName: building?.name || 'المبنى الذكي',
      healthScore: health,
      faultProbability: faultProb,
      estimatedDaysToFailure: days,
      anomalyDetected: faultProb > 30 ? 'تم رصد ارتفاع حرارة طفيف وتذبذب في الفولتية' : 'كفاءة التشغيل ممتازة وضغط مستقر',
      recommendation: faultProb > 30 ? 'جدولة صيانة وقائية قبل الصيف' : 'استمرار الاستخدام الطبيعي مع الصيانة الدورية',
      severity: faultProb > 50 ? 'critical' : faultProb > 25 ? 'warning' : 'good'
    };

    setPredictiveDiagnostics(prev => [diag, ...prev.filter(p => p.applianceId !== applianceId)]);
    return diag;
  };

  // User management & auth functions
  const addSystemUser = (newUser: Omit<SystemUser, 'id' | 'lastLogin'>): SystemUser => {
    const created: SystemUser = {
      ...newUser,
      id: `usr-${Date.now()}`,
      lastLogin: 'لم يدخل بعد',
      magicLinkCode: `LNK-${Math.floor(1000 + Math.random() * 9000)}`
    };
    setSystemUsers(prev => [created, ...prev]);
    addSecurityLog(`إضافة مستخدم جديد للنظام: ${created.name} (${created.email}) بصلاحية (${created.role})`, 'info');
    return created;
  };

  const updateUserStatus = (userId: string, status: 'active' | 'suspended') => {
    setSystemUsers(prev => prev.map(u => u.id === userId ? { ...u, status } : u));
    addSecurityLog(`تحديث حالة حساب المستخدم ${userId} إلى (${status})`, 'warning');
  };

  const addSecurityLog = (action: string, severity: 'info' | 'warning' | 'security_alert' = 'info') => {
    const newLog: SecurityAuditLog = {
      id: `sec-${Date.now()}`,
      timestamp: new Date().toLocaleString('ar-SA'),
      action,
      userEmail: currentUser?.email || 'system@smartbuilding.sa',
      ipHash: `IP: 185.190.${Math.floor(Math.random()*255)}.x (Zero-Trust Shield)`,
      encryptedDigest: `SHA256: ${Math.random().toString(36).substring(2)}${Math.random().toString(36).substring(2)}`,
      severity
    };
    setSecurityLogs(prev => [newLog, ...prev.slice(0, 49)]);
  };

  const updateSecuritySettings = (newSettings: Partial<SecuritySettings>) => {
    setSecuritySettings(prev => ({ ...prev, ...newSettings }));
    addSecurityLog('تعديل إعدادات الأمان والتشفير الشامل وسياسات الوصول بالنظام', 'warning');
  };

  const rotateMasterEncryptionKey = (): string => {
    const newFingerprint = `SHA256:${Math.random().toString(36).substring(2)}${Math.random().toString(36).substring(2)}${Math.random().toString(36).substring(2)}`.toUpperCase();
    const nowStr = new Date().toLocaleString('ar-SA');
    setSecuritySettings(prev => ({
      ...prev,
      masterKeyFingerprint: newFingerprint,
      lastKeyRotation: nowStr
    }));
    addSecurityLog(`🚨 إعادة تدوير وتحديث مفتاح التشفير الرئيسي Master Key (${newFingerprint.slice(0, 18)}...)`, 'security_alert');
    return newFingerprint;
  };

  const clearSecurityLogs = () => {
    setSecurityLogs([]);
    addSecurityLog('إعادة ضبط وتفرير سجلات التدقيق المشفرة بالكامل', 'warning');
  };

  const loginWithEmail = (email: string, pass?: string) => {
    const found = systemUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (found) {
      if (found.status === 'suspended') {
        return { success: false, message: 'هذا الحساب معطل مؤقتاً من قبل مدير النظام الرئيسي!' };
      }
      setCurrentUser(found);
      setUserRole(found.role);
      if (found.assignedUnitId) {
        setActiveTenantUnitId(found.assignedUnitId);
      }
      addSecurityLog(`تسجيل دخول ناجح للمستخدم (${found.name}) عبر البريد الإلكتروني`, 'info');
      return { success: true, message: `أهلاً بك مجدداً ${found.name}!`, user: found };
    } else {
      return { success: false, message: 'البريد الإلكتروني غير مسجل في الداتا بيز.' };
    }
  };

  // Direct Voice/Text Appliance Control (Gemini Assistant Integration)
  const executeVoiceApplianceControl = (textCommand: string): { success: boolean; message: string; applianceName?: string; newState?: boolean } => {
    const text = textCommand.trim().toLowerCase();

    const turnOnKeywords = ['شغل', 'تشغيل', 'شغلي', 'افتح', 'فتح', 'ولع', 'شغل المكيف', 'شغل الأنوار'];
    const turnOffKeywords = ['اطفئ', 'أطفئ', 'إطفاء', 'اطفي', 'اقفل', 'إغلاق', 'سكر', 'طفي', 'طف'];

    const isTurnOn = turnOnKeywords.some(kw => text.includes(kw));
    const isTurnOff = turnOffKeywords.some(kw => text.includes(kw));

    const availableAppliances = appliances.filter(a => {
      if (userRole === 'tenant') return a.unitId === activeTenantUnitId;
      if (selectedBuildingId !== 'all') return a.buildingId === selectedBuildingId;
      return true;
    });

    let matchedAppliance: SmartAppliance | undefined;

    if (text.includes('مكيف') || text.includes('تكييف') || text.includes('تبريد')) {
      matchedAppliance = availableAppliances.find(a => a.type === 'ac');
    } else if (text.includes('سخان') || text.includes('ماء')) {
      matchedAppliance = availableAppliances.find(a => a.type === 'water_heater');
    } else if (text.includes('إضاءة') || text.includes('انوار') || text.includes('أنوار') || text.includes('لمبة') || text.includes('ضوء')) {
      matchedAppliance = availableAppliances.find(a => a.type === 'lighting');
    } else if (text.includes('قفل') || text.includes('باب')) {
      matchedAppliance = availableAppliances.find(a => a.type === 'smart_lock');
    } else if (text.includes('غسالة')) {
      matchedAppliance = availableAppliances.find(a => a.type === 'washing_machine');
    } else if (text.includes('شاحن') || text.includes('سيارة')) {
      matchedAppliance = availableAppliances.find(a => a.type === 'ev_charger');
    } else if (text.includes('ثلاجة')) {
      matchedAppliance = availableAppliances.find(a => a.type === 'fridge');
    } else if (text.includes('تلفزيون') || text.includes('شاشة')) {
      matchedAppliance = availableAppliances.find(a => a.type === 'tv');
    }

    if (!matchedAppliance && availableAppliances.length > 0) {
      matchedAppliance = availableAppliances[0];
    }

    if (!matchedAppliance) {
      return { success: false, message: 'لم نتمكن من العثور على جهاز مطابق في وحدتك الذكية.' };
    }

    const newState = isTurnOff ? false : isTurnOn ? true : !matchedAppliance.isOn;

    setAppliances(prev =>
      prev.map(a =>
        a.id === matchedAppliance!.id
          ? { ...a, isOn: newState }
          : a
      )
    );

    addSecurityLog(
      `أمر تفاعلي صوتي/نصي: ${newState ? 'تشغيل' : 'إطفاء'} جهاز (${matchedAppliance.name})`,
      'info'
    );

    return {
      success: true,
      message: `تم تنفيذ الأمر أوتوماتيكياً: ${newState ? 'تم تشغيل' : 'تم إطفاء'} (${matchedAppliance.name}) بنجاح ✨`,
      applianceName: matchedAppliance.name,
      newState
    };
  };

  // Simplified 1-click Appliance creation
  const addApplianceSimple = (name: string, type: ApplianceType, unitId?: string): SmartAppliance => {
    const targetUnit = units.find(u => u.id === (unitId || activeTenantUnitId)) || units[0];
    let powerWatts = 1200;
    let waterLitersPerMin = 0;

    if (type === 'ac') powerWatts = 2200;
    if (type === 'water_heater') { powerWatts = 1800; waterLitersPerMin = 4; }
    if (type === 'lighting') powerWatts = 45;
    if (type === 'smart_lock') powerWatts = 10;
    if (type === 'washing_machine') { powerWatts = 850; waterLitersPerMin = 8; }
    if (type === 'ev_charger') powerWatts = 7400;

    const newApp: SmartAppliance = {
      id: `dev-${Date.now()}`,
      unitId: targetUnit.id,
      buildingId: targetUnit.buildingId,
      name: name || 'جهاز ذكي جديد',
      type,
      connection: 'wifi',
      isOn: true,
      powerWatts,
      waterLitersPerMin,
      dailyHoursUsed: 4,
      autoScheduleEnabled: false,
      aiAutomationActive: true,
      aiNotes: 'تم الإضافة والتوصيل بالشبكة الذكية تلقائياً'
    };

    setAppliances(prev => [newApp, ...prev]);
    addSecurityLog(`إضافة جهاز جديد بنجاح: ${name} (الشقة ${targetUnit.unitNumber})`, 'info');
    return newApp;
  };

  // Multi-method payment processing
  const payInvoice = (invoiceId: string, method: PaymentMethodType, cardLastFour?: string): PaymentReceipt => {
    const inv = invoices.find(i => i.id === invoiceId);
    if (!inv) throw new Error('الفاتورة غير موجودة');

    const receipt: PaymentReceipt = {
      invoiceId,
      paymentMethod: method,
      transactionId: `TXN-${Math.floor(10000000 + Math.random() * 90000000)}`,
      amount: inv.totalCost,
      timestamp: new Date().toLocaleString('ar-SA'),
      cardLastFour: cardLastFour || '4321'
    };

    setInvoices(prev => prev.map(i => i.id === invoiceId ? { ...i, status: 'paid' } : i));
    setPaymentReceipts(prev => [receipt, ...prev]);

    addSecurityLog(
      `تسديد فاتورة بقيمة ${inv.totalCost} ريال بطريقة (${method}) للشقة ${inv.unitNumber}`,
      'info'
    );

    return receipt;
  };

  // Theft & Emergency incident reporting (unlocks CCTV for owner under emergency exception)
  const reportTheftIncident = (unitId: string, description?: string) => {
    setReportedTheftUnits(prev => Array.from(new Set([...prev, unitId])));
    const unit = units.find(u => u.id === unitId);

    triggerEmergency('intrusion', description || `بلاغ سرقة واقتحام في الشقة ${unit?.unitNumber}`);

    addSecurityLog(
      `🚨 بلاغ عن حادثة سرقة/مشكلة في الشقة ${unit?.unitNumber} - تم استثناء حجب الكاميرات أوتوماتيكياً لدواعي الأمن.`,
      'security_alert'
    );
  };

  return (
    <AppContext.Provider
      value={{
        userRole,
        setUserRole,
        currentUser,
        setCurrentUser,
        systemUsers,
        addSystemUser,
        updateUserStatus,
        loginWithEmail,
        activeTenantUnitId,
        setActiveTenantUnitId,
        activeTab,
        setActiveTab,
        selectedBuildingId,
        setSelectedBuildingId,
        buildings,
        addBuilding,
        units,
        addUnit,
        updateUnitLease,
        appliances,
        addAppliance,
        addApplianceSimple,
        toggleAppliance,
        updateApplianceSchedule,
        toggleAiAutomation,
        executeVoiceApplianceControl,
        gardenState,
        setSoilMoisture,
        setTemperature,
        setHumidity,
        toggleRainSensor,
        toggleGardenPump,
        toggleGardenFountain,
        setGardenAutoSchedule,
        resetGardenSimulation,
        invoices,
        paymentReceipts,
        generateInvoiceForUnit,
        toggleInvoiceStatus,
        payInvoice,
        cameras,
        addCameraLog,
        hasCameraAccess,
        reportedTheftUnits,
        reportTheftIncident,
        emergencyAlerts,
        triggerEmergency,
        resolveEmergency,
        activeEmergencyCount,
        maintenanceTickets,
        addMaintenanceTicket,
        updateTicketStatus,
        facilityBookings,
        addFacilityBooking,
        predictiveDiagnostics,
        runPredictiveCheck,
        securityLogs,
        addSecurityLog,
        securitySettings,
        updateSecuritySettings,
        rotateMasterEncryptionKey,
        clearSecurityLogs,
        getBuildingStats,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
