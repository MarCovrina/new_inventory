// Mock data for inventory application

// Типы технических мест
export const technicalPlaceTypes = {
  POLE: 'Опора',
  SPAN: 'Пролёт',
  TRANSFORMER: 'Трансформатор',
  SWITCHGEAR: 'Ячейка',
  CIRCUIT_BREAKER: 'Выключатель',
  DISCONNECTOR: 'Разъединитель',
  CURRENT_TRANSFORMER: 'ТТ',
  VOLTAGE_TRANSFORMER: 'ТН',
  CABLE_SECTION: 'Кабельная секция'
};

// Характеристики технических мест по типам
export const technicalPlaceCharacteristics = {
  [technicalPlaceTypes.POLE]: [
    { key: 'poleNumber', label: 'Номер опоры', type: 'string' },
    { key: 'poleType', label: 'Тип опоры', type: 'string' },
    { key: 'constructionYear', label: 'Год постройки', type: 'number' },
    { key: 'material', label: 'Материал', type: 'select', options: ['Металлическая', 'Железобетонная', 'Деревянная'] },
    { key: 'height', label: 'Высота, м', type: 'number' },
    { key: 'foundationType', label: 'Тип фундамента', type: 'string' },
    { key: 'groundingExists', label: 'Заземление', type: 'boolean' },
    { key: 'coordinates', label: 'Координаты', type: 'coordinates' }
  ],
  [technicalPlaceTypes.SPAN]: [
    { key: 'spanNumber', label: 'Номер пролёта', type: 'string' },
    { key: 'length', label: 'Длина пролёта, м', type: 'number' },
    { key: 'wireType', label: 'Тип провода', type: 'string' },
    { key: 'wireCrossSection', label: 'Сечение провода, мм²', type: 'number' },
    { key: 'cableCount', label: 'Количество проводов', type: 'number' },
    { key: 'sag', label: 'Стрела провеса, м', type: 'number' },
    { key: 'groundWireExists', label: 'Грозотрос', type: 'boolean' }
  ],
  [technicalPlaceTypes.TRANSFORMER]: [
    { key: 'transformerNumber', label: 'Номер трансформатора', type: 'string' },
    { key: 'type', label: 'Тип трансформатора', type: 'string' },
    { key: 'power', label: 'Мощность, кВА', type: 'number' },
    { key: 'voltageHV', label: 'Напряжение ВН, кВ', type: 'number' },
    { key: 'voltageLV', label: 'Напряжение НН, кВ', type: 'number' },
    { key: 'manufactureYear', label: 'Год выпуска', type: 'number' },
    { key: 'oilLevel', label: 'Уровень масла', type: 'select', options: ['Нормальный', 'Пониженный', 'Критически низкий'] },
    { key: 'temperature', label: 'Температура, °C', type: 'number' }
  ],
  [technicalPlaceTypes.SWITCHGEAR]: [
    { key: 'cellNumber', label: 'Номер ячейки', type: 'string' },
    { key: 'voltage', label: 'Напряжение, кВ', type: 'number' },
    { key: 'ratedCurrent', label: 'Номинальный ток, А', type: 'number' },
    { key: '断路器Type', label: 'Тип выключателя', type: 'string' }
  ]
};

// Технические места для разных объектов
export const technicalPlaces = [
  // Для ЛЭП-110кВ "Северная" (id объекта = 1)
  {
    id: 1,
    objectId: 1,
    type: technicalPlaceTypes.POLE,
    name: 'Опора №1',
    isInspected: true,
    characteristics: {
      poleNumber: '1',
      poleType: 'ПМ-110-1',
      constructionYear: 1985,
      material: 'Железобетонная',
      height: 26.5,
      foundationType: 'Монолитный',
      groundingExists: true
    },
    comment: 'Необходим ремонт заземления',
    photos: [],
    equipment: [
      { id: 1, name: 'Изолятор ПС-120', quantity: 6, unit: 'шт', markedForDeletion: false },
      { id: 2, name: 'Грозозащитный трос', quantity: 1, unit: 'м', markedForDeletion: false },
      { id: 3, name: 'Арматура линейная', quantity: 12, unit: 'шт', markedForDeletion: false }
    ]
  },
  {
    id: 2,
    objectId: 1,
    type: technicalPlaceTypes.POLE,
    name: 'Опора №2',
    isInspected: true,
    characteristics: {
      poleNumber: '2',
      poleType: 'ПМ-110-1',
      constructionYear: 1985,
      material: 'Железобетонная',
      height: 26.5,
      foundationType: 'Монолитный',
      groundingExists: true
    },
    comment: '',
    photos: [],
    equipment: [
      { id: 4, name: 'Изолятор ПС-120', quantity: 6, unit: 'шт', markedForDeletion: false },
      { id: 5, name: 'Арматура линейная', quantity: 12, unit: 'шт', markedForDeletion: false }
    ]
  },
  {
    id: 3,
    objectId: 1,
    type: technicalPlaceTypes.SPAN,
    name: 'Пролёт 1-2',
    isInspected: true,
    characteristics: {
      spanNumber: '1-2',
      length: 150,
      wireType: 'АС-120/19',
      wireCrossSection: 120,
      cableCount: 3,
      sag: 8.5,
      groundWireExists: true
    },
    comment: 'Обнаружен повреждение грозотроса',
    photos: [],
    equipment: []
  },
  {
    id: 4,
    objectId: 1,
    type: technicalPlaceTypes.POLE,
    name: 'Опора №3',
    isInspected: false,
    characteristics: {
      poleNumber: '3',
      poleType: 'ПМ-110-2',
      constructionYear: 1985,
      material: 'Железобетонная',
      height: 26.5,
      foundationType: 'Монолитный',
      groundingExists: true
    },
    comment: '',
    photos: [],
    equipment: [
      { id: 6, name: 'Изолятор ПС-120', quantity: 6, unit: 'шт', markedForDeletion: false }
    ]
  },
  {
    id: 5,
    objectId: 1,
    type: technicalPlaceTypes.POLE,
    name: 'Опора №4',
    isInspected: false,
    characteristics: {
      poleNumber: '4',
      poleType: 'ПМ-110-2',
      constructionYear: 1986,
      material: 'Железобетонная',
      height: 26.5,
      foundationType: 'Монолитный',
      groundingExists: false
    },
    comment: '',
    photos: [],
    equipment: []
  },
  // Для Подстанции "Центральная" (id объекта = 2)
  {
    id: 6,
    objectId: 2,
    type: technicalPlaceTypes.TRANSFORMER,
    name: 'Трансформатор Т1',
    isInspected: false,
    characteristics: {
      transformerNumber: 'Т1',
      type: 'ТДН-40000/110',
      power: 40000,
      voltageHV: 110,
      voltageLV: 10,
      manufactureYear: 1990,
      oilLevel: 'Нормальный',
      temperature: 65
    },
    comment: '',
    photos: [],
    equipment: [
      { id: 7, name: 'Расширитель масла', quantity: 1, unit: 'шт', markedForDeletion: false },
      { id: 8, name: 'Термометр', quantity: 1, unit: 'шт', markedForDeletion: false }
    ]
  },
  {
    id: 7,
    objectId: 2,
    type: technicalPlaceTypes.TRANSFORMER,
    name: 'Трансформатор Т2',
    isInspected: false,
    characteristics: {
      transformerNumber: 'Т2',
      type: 'ТДН-40000/110',
      power: 40000,
      voltageHV: 110,
      voltageLV: 10,
      manufactureYear: 1990,
      oilLevel: 'Пониженный',
      temperature: 72
    },
    comment: 'Требуется долив масла',
    photos: [],
    equipment: []
  },
  {
    id: 8,
    objectId: 2,
    type: technicalPlaceTypes.SWITCHGEAR,
    name: 'Ячейка №1 (ВН)',
    isInspected: false,
    characteristics: {
      cellNumber: '1',
      voltage: 110,
      ratedCurrent: 1000,
      断路器Type: 'ВМТ-110'
    },
    comment: '',
    photos: [],
    equipment: []
  }
];

// Функция получения технических мест по ID объекта
export const getTechnicalPlacesByObjectId = (objectId) => {
  return technicalPlaces.filter(tp => tp.objectId === objectId);
};

// Типы объектов энергоснабжения
export const objectTypes = {
  LEP: 'ЛЭП',
  SUBSTATION: 'Подстанция',
  TRANSFORMER_SUBSTATION: 'Трансформаторная подстанция',
  DISTRIBUTION_POINT: 'Распределительный пункт'
};

// Объекты инвентаризации (объекты энергоснабжения)
export const inventoryObjects = [
  {
    id: 1,
    name: 'ЛЭП-110кВ "Северная"',
    type: objectTypes.LEP,
    address: 'Барнаул, Северный район',
    voltage: '110 кВ',
    length: '15.5 км',
    commissioningDate: '1985-06-15'
  },
  {
    id: 2,
    name: 'Подстанция "Центральная"',
    type: objectTypes.SUBSTATION,
    address: 'Барнаул, ул. Ленина, 45',
    voltage: '110/35/10 кВ',
    power: '2x40 МВА',
    commissioningDate: '1978-03-20'
  },
  {
    id: 3,
    name: 'ТП-127 "Западная"',
    type: objectTypes.TRANSFORMER_SUBSTATION,
    address: 'Барнаул, Западный район',
    voltage: '10/0.4 кВ',
    power: '2х630 кВА',
    commissioningDate: '1995-11-08'
  },
  {
    id: 4,
    name: 'РП-35 "Промышленная"',
    type: objectTypes.DISTRIBUTION_POINT,
    address: 'Барнаул, Промышленная зона',
    voltage: '35 кВ',
    circuits: 6,
    commissioningDate: '1990-07-22'
  },
  {
    id: 5,
    name: 'ЛЭП-35кВ "Южная"',
    type: objectTypes.LEP,
    address: 'Барнаул, Южный район',
    voltage: '35 кВ',
    length: '8.2 км',
    commissioningDate: '1992-04-10'
  },
  {
    id: 6,
    name: 'Подстанция "Восточная"',
    type: objectTypes.SUBSTATION,
    address: 'Барнаул, ул. Строителей, 12',
    voltage: '35/10 кВ',
    power: '2х16 МВА',
    commissioningDate: '2001-09-15'
  }
];

// Пользователи (исполнители)
export const users = [
  {
    id: 1,
    name: 'Иванов Иван Иванович',
    role: 'master',
    position: 'Мастер',
    department: 'Служба эксплуатации'
  },
  {
    id: 2,
    name: 'Петров Петр Петрович',
    role: 'executor',
    position: 'Монтер',
    department: 'Служба эксплуатации'
  },
  {
    id: 3,
    name: 'Сидоров Алексей Сергеевич',
    role: 'executor',
    position: 'Монтер',
    department: 'Служба эксплуатации'
  },
  {
    id: 4,
    name: 'Козлов Дмитрий Николаевич',
    role: 'executor',
    position: 'Старший монтер',
    department: 'Служба эксплуатации'
  },
  {
    id: 5,
    name: 'Смирнов Сергей Михайлович',
    role: 'executor',
    position: 'Монтер',
    department: 'Служба эксплуатации'
  }
];

// Статусы листа инвентаризации
export const inventorySheetStatuses = {
  DRAFT: 'Черновик',
  IN_WORK: 'В работе',
  SUBMITTED: 'Сдан на проверку',
  RETURNED: 'Возвращен на доработку',
  APPROVED: 'Согласован'
};

// Листы инвентаризации (реестр)
export const inventorySheets = [
  {
    id: 1,
    number: 'ИЛ-2026-001',
    object: inventoryObjects[0],
    executor: users[1],
    master: users[0],
    status: inventorySheetStatuses.IN_WORK,
    createdAt: '2026-03-10',
    submittedAt: null,
    approvedAt: null,
    technicalPlacesCount: 15,
    inspectedPlacesCount: 8
  },
  {
    id: 2,
    number: 'ИЛ-2026-002',
    object: inventoryObjects[1],
    executor: users[2],
    master: users[0],
    status: inventorySheetStatuses.DRAFT,
    createdAt: '2026-03-12',
    submittedAt: null,
    approvedAt: null,
    technicalPlacesCount: 0,
    inspectedPlacesCount: 0
  },
  {
    id: 3,
    number: 'ИЛ-2026-003',
    object: inventoryObjects[2],
    executor: users[3],
    master: users[0],
    status: inventorySheetStatuses.SUBMITTED,
    createdAt: '2026-03-05',
    submittedAt: '2026-03-15',
    approvedAt: null,
    technicalPlacesCount: 12,
    inspectedPlacesCount: 12
  },
  {
    id: 4,
    number: 'ИЛ-2026-004',
    object: inventoryObjects[3],
    executor: users[4],
    master: users[0],
    status: inventorySheetStatuses.APPROVED,
    createdAt: '2026-02-20',
    submittedAt: '2026-03-01',
    approvedAt: '2026-03-10',
    technicalPlacesCount: 8,
    inspectedPlacesCount: 8
  },
  {
    id: 5,
    number: 'ИЛ-2026-005',
    object: inventoryObjects[4],
    executor: users[1],
    master: users[0],
    status: inventorySheetStatuses.RETURNED,
    createdAt: '2026-03-08',
    submittedAt: '2026-03-14',
    approvedAt: null,
    technicalPlacesCount: 20,
    inspectedPlacesCount: 20
  }
];
