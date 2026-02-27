import { User, PowerObject, InventorySheet, InventorySheetStatus, TechnicalLocation } from '../types';
import { TECH_LOCATION_TYPE_CONFIG } from '../types';

// Генератор ID
export const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

// Генератор номера листа инвентаризации
export const generateSheetNumber = (): string => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return `ИНВ-${year}${month}-${random}`;
};

// Моковые пользователи
export const MOCK_USERS: User[] = [
  { id: 'user-1', name: 'Иванов А.А.', role: 'master' },
  { id: 'user-2', name: 'Петров С.С.', role: 'executor' },
  { id: 'user-3', name: 'Сидоров В.В.', role: 'executor' },
  { id: 'user-4', name: 'Козлов М.Н.', role: 'master' }
];

// Моковые объекты электроснабжения
export const MOCK_OBJECTS: PowerObject[] = [
  {
    id: 'obj-1',
    name: 'ВЛ-10кВ Филипенко',
    type: 'line',
    address: 'с. Филипенко',
    description: 'Воздушная линия 10кВ',
    availableTechLocationTypes: ['support', 'span'],
    characteristics: {
      voltage: '10 кВ',
      length: '5.2 км'
    }
  },
  {
    id: 'obj-2',
    name: 'ПС 35/10кВ Центральная',
    type: 'substation',
    address: 'г. Энергодар, ул. Промышленная, 1',
    description: 'Подстанция 35/10кВ',
    availableTechLocationTypes: ['bay', 'unit'],
    characteristics: {
      voltageHigh: '35 кВ',
      voltageLow: '10 кВ',
      power: '2х16 МВА'
    }
  },
  {
    id: 'obj-3',
    name: 'ТП-127',
    type: 'transformer_substation',
    address: 'г. Энергодар, ул. Ленина, 45',
    description: 'Трансформаторная подстанция',
    availableTechLocationTypes: ['transformer', 'bay'],
    characteristics: {
      voltage: '10/0.4 кВ',
      power: '400 кВА'
    }
  },
  {
    id: 'obj-4',
    name: 'РП-5',
    type: 'distribution_point',
    address: 'г. Энергодар, ул. Промышленная, 15',
    description: 'Распределительный пункт',
    availableTechLocationTypes: ['feeder', 'bay'],
    characteristics: {
      voltage: '10 кВ',
      feederCount: 6
    }
  }
];

// Генерирует начальные технические места для объекта
export const generateInitialTechLocations = (objectId: string, objectType: string): TechnicalLocation[] => {
  const locations: TechnicalLocation[] = [];
  
  if (objectType === 'line') {
    // Генерируем опоры для ЛЭП
    for (let i = 1; i <= 10; i++) {
      locations.push({
        id: `${objectId}-support-${i}`,
        objectId,
        type: 'support',
        name: `Опора №${i}`,
        characteristics: TECH_LOCATION_TYPE_CONFIG.support.defaultCharacteristics.map(c => ({ ...c })),
        inspected: false,
        photos: [],
        materials: []
      });
    }
    // Генерируем пролеты
    for (let i = 1; i <= 9; i++) {
      locations.push({
        id: `${objectId}-span-${i}`,
        objectId,
        type: 'span',
        name: `Пролет №${i}`,
        characteristics: TECH_LOCATION_TYPE_CONFIG.span.defaultCharacteristics.map(c => ({ ...c })),
        inspected: false,
        photos: [],
        materials: []
      });
    }
  } else if (objectType === 'substation') {
    // Ячейки подстанции
    ['ВЛ-35кВ', 'ВЛ-10кВ', 'Секция 1', 'Секция 2', 'ТСН'].forEach((name, i) => {
      locations.push({
        id: `${objectId}-bay-${i + 1}`,
        objectId,
        type: 'bay',
        name: `Ячейка ${name}`,
        characteristics: TECH_LOCATION_TYPE_CONFIG.bay.defaultCharacteristics.map(c => ({ ...c })),
        inspected: false,
        photos: [],
        materials: []
      });
    });
  } else if (objectType === 'transformer_substation') {
    // Трансформаторы
    ['Т1', 'Т2'].forEach((name, i) => {
      locations.push({
        id: `${objectId}-transformer-${i + 1}`,
        objectId,
        type: 'transformer',
        name: `Трансформатор ${name}`,
        characteristics: TECH_LOCATION_TYPE_CONFIG.transformer.defaultCharacteristics.map(c => ({ ...c })),
        inspected: false,
        photos: [],
        materials: []
      });
    });
    // Ячейки
    for (let i = 1; i <= 6; i++) {
      locations.push({
        id: `${objectId}-bay-${i}`,
        objectId,
        type: 'bay',
        name: `Ячейка №${i}`,
        characteristics: TECH_LOCATION_TYPE_CONFIG.bay.defaultCharacteristics.map(c => ({ ...c })),
        inspected: false,
        photos: [],
        materials: []
      });
    }
  } else if (objectType === 'distribution_point') {
    // Фидеры
    for (let i = 1; i <= 6; i++) {
      locations.push({
        id: `${objectId}-feeder-${i}`,
        objectId,
        type: 'feeder',
        name: `Фидер Ф-${i}`,
        characteristics: TECH_LOCATION_TYPE_CONFIG.feeder.defaultCharacteristics.map(c => ({ ...c })),
        inspected: false,
        photos: [],
        materials: []
      });
    }
  }
  
  return locations;
};

// Моковые листы инвентаризации
export const MOCK_SHEETS: InventorySheet[] = [
  {
    id: 'sheet-1',
    number: 'ИНВ-202602-001',
    objectId: 'obj-1',
    object: MOCK_OBJECTS[0],
    executorId: 'user-2',
    executor: MOCK_USERS[1],
    creatorId: 'user-1',
    creator: MOCK_USERS[0],
    status: 'in_work',
    techLocations: generateInitialTechLocations('obj-1', 'line'),
    createdAt: '2026-02-20T10:00:00Z',
    acceptedAt: '2026-02-20T14:30:00Z'
  },
  {
    id: 'sheet-2',
    number: 'ИНВ-202602-002',
    objectId: 'obj-2',
    object: MOCK_OBJECTS[1],
    executorId: 'user-3',
    executor: MOCK_USERS[2],
    creatorId: 'user-1',
    creator: MOCK_USERS[0],
    status: 'under_review',
    techLocations: generateInitialTechLocations('obj-2', 'substation').map((loc, i) => ({
      ...loc,
      inspected: true,
      inspectedAt: '2026-02-21T16:00:00Z',
      comment: i === 0 ? 'Требует ремонта' : undefined,
      materials: i === 0 ? [{
        id: 'mat-1',
        type: 'insulator',
        name: 'Изолятор ШФ-10',
        quantity: 3,
        unit: 'шт',
        addedDuringInventory: true
      }] : []
    })),
    createdAt: '2026-02-19T09:00:00Z',
    acceptedAt: '2026-02-19T10:00:00Z',
    submittedAt: '2026-02-22T11:00:00Z'
  },
  {
    id: 'sheet-3',
    number: 'ИНВ-202602-003',
    objectId: 'obj-3',
    object: MOCK_OBJECTS[2],
    executorId: 'user-2',
    executor: MOCK_USERS[1],
    creatorId: 'user-4',
    creator: MOCK_USERS[3],
    status: 'approved',
    techLocations: generateInitialTechLocations('obj-3', 'transformer_substation').map(loc => ({
      ...loc,
      inspected: true,
      inspectedAt: '2026-02-18T10:00:00Z'
    })),
    createdAt: '2026-02-15T08:00:00Z',
    acceptedAt: '2026-02-15T12:00:00Z',
    submittedAt: '2026-02-17T15:00:00Z',
    approvedAt: '2026-02-18T09:00:00Z',
    approvedBy: 'user-4',
    approver: MOCK_USERS[3]
  },
  {
    id: 'sheet-4',
    number: 'ИНВ-202602-004',
    objectId: 'obj-4',
    object: MOCK_OBJECTS[3],
    executorId: 'user-3',
    executor: MOCK_USERS[2],
    creatorId: 'user-1',
    creator: MOCK_USERS[0],
    status: 'returned',
    techLocations: generateInitialTechLocations('obj-4', 'distribution_point'),
    createdAt: '2026-02-21T08:00:00Z',
    acceptedAt: '2026-02-21T09:00:00Z',
    submittedAt: '2026-02-23T16:00:00Z',
    returnedAt: '2026-02-24T10:00:00Z',
    returnComment: 'Недостаточно фотографий технических мест'
  }
];

// LocalStorage ключи
const SHEETS_KEY = 'inventory_sheets';
const CURRENT_USER_KEY = 'current_user';

// Получение текущего пользователя
export const getCurrentUser = (): User | null => {
  const stored = localStorage.getItem(CURRENT_USER_KEY);
  return stored ? JSON.parse(stored) : null;
};

// Установка текущего пользователя
export const setCurrentUser = (user: User): void => {
  localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
};

// Получение всех листов инвентаризации
export const getSheets = (): InventorySheet[] => {
  const stored = localStorage.getItem(SHEETS_KEY);
  if (!stored) {
    // Инициализируем моковыми данными
    localStorage.setItem(SHEETS_KEY, JSON.stringify(MOCK_SHEETS));
    return MOCK_SHEETS;
  }
  return JSON.parse(stored);
};

// Сохранение листов инвентаризации
export const saveSheets = (sheets: InventorySheet[]): void => {
  localStorage.setItem(SHEETS_KEY, JSON.stringify(sheets));
};

// Получение листа по ID
export const getSheetById = (id: string): InventorySheet | undefined => {
  const sheets = getSheets();
  return sheets.find(s => s.id === id);
};

// Создание нового листа инвентаризации
export const createSheet = (
  objectId: string,
  executorId: string,
  creatorId: string,
  selectedTechLocationIds?: string[]
): InventorySheet => {
  const sheets = getSheets();
  const object = MOCK_OBJECTS.find(o => o.id === objectId);
  const executor = MOCK_USERS.find(u => u.id === executorId);
  const creator = MOCK_USERS.find(u => u.id === creatorId);
  
  // Генерируем технические места
  let techLocations = generateInitialTechLocations(objectId, object?.type || 'line');
  
  // Фильтруем по выбранным, если указаны
  if (selectedTechLocationIds && selectedTechLocationIds.length > 0) {
    techLocations = techLocations.filter(tl => selectedTechLocationIds.includes(tl.id));
  }
  
  const newSheet: InventorySheet = {
    id: generateId(),
    number: generateSheetNumber(),
    objectId,
    object,
    selectedTechLocationIds,
    executorId,
    executor,
    creatorId,
    creator,
    status: 'draft',
    techLocations,
    createdAt: new Date().toISOString()
  };
  
  sheets.push(newSheet);
  saveSheets(sheets);
  return newSheet;
};

// Обновление листа инвентаризации
export const updateSheet = (updatedSheet: InventorySheet): void => {
  const sheets = getSheets();
  const index = sheets.findIndex(s => s.id === updatedSheet.id);
  if (index !== -1) {
    sheets[index] = updatedSheet;
    saveSheets(sheets);
  }
};

// Удаление листа инвентаризации
export const deleteSheet = (id: string): void => {
  const sheets = getSheets();
  const filtered = sheets.filter(s => s.id !== id);
  saveSheets(filtered);
};

// Принятие листа в работу
export const acceptSheet = (sheetId: string, userId: string): InventorySheet | undefined => {
  const sheets = getSheets();
  const sheet = sheets.find(s => s.id === sheetId);
  if (sheet && sheet.status === 'draft') {
    sheet.status = 'in_work';
    sheet.acceptedAt = new Date().toISOString();
    saveSheets(sheets);
    return sheet;
  }
  return undefined;
};

// Сдача листа на проверку
export const submitSheet = (sheetId: string): InventorySheet | undefined => {
  const sheets = getSheets();
  const sheet = sheets.find(s => s.id === sheetId);
  if (sheet && (sheet.status === 'in_work' || sheet.status === 'returned')) {
    sheet.status = 'under_review';
    sheet.submittedAt = new Date().toISOString();
    saveSheets(sheets);
    return sheet;
  }
  return undefined;
};

// Возврат листа на доработку
export const returnSheet = (sheetId: string, comment: string): InventorySheet | undefined => {
  const sheets = getSheets();
  const sheet = sheets.find(s => s.id === sheetId);
  if (sheet && sheet.status === 'under_review') {
    sheet.status = 'returned';
    sheet.returnedAt = new Date().toISOString();
    sheet.returnComment = comment;
    saveSheets(sheets);
    return sheet;
  }
  return undefined;
};

// Согласование листа
export const approveSheet = (sheetId: string, approverId: string): InventorySheet | undefined => {
  const sheets = getSheets();
  const sheet = sheets.find(s => s.id === sheetId);
  const approver = MOCK_USERS.find(u => u.id === approverId);
  if (sheet && sheet.status === 'under_review') {
    sheet.status = 'approved';
    sheet.approvedAt = new Date().toISOString();
    sheet.approvedBy = approverId;
    sheet.approver = approver;
    saveSheets(sheets);
    return sheet;
  }
  return undefined;
};

// Получение всех объектов
export const getAllObjects = (): PowerObject[] => {
  return MOCK_OBJECTS;
};

// Получение всех пользователей
export const getUsers = (): User[] => {
  return MOCK_USERS;
};
