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
    dispatchName: 'ПС-110кВ Северная - оп.1',
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
    dispatchName: 'ПС-110кВ Северная - оп.2',
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
    dispatchName: 'Пролёт ПС-110кВ Северная 1-2',
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
    dispatchName: 'ПС-110кВ Северная - оп.3',
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
    dispatchName: 'ПС-110кВ Северная - оп.4',
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
    dispatchName: 'ПС Центральная - Т1',
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
    dispatchName: 'ПС Центральная - Т2',
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
    dispatchName: 'ПС Центральная - Яч.1',
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

// Наборы материалов и оборудования по типам технических мест
export const equipmentSets = [
  // Наборы для опор
  {
    id: 1,
    name: 'Опора одностоечная деревянная',
    technicalPlaceType: technicalPlaceTypes.POLE,
    materials: [
      { id: 101, name: 'Столб деревянный', quantity: 1, unit: 'шт' },
      { id: 102, name: 'Пасынок деревянный', quantity: 1, unit: 'шт' },
      { id: 103, name: 'Траверса', quantity: 1, unit: 'шт' },
      { id: 104, name: 'Изолятор ПС-120', quantity: 3, unit: 'шт' },
      { id: 105, name: 'Арматура линейная', quantity: 6, unit: 'шт' },
      { id: 106, name: 'Заземление (уголок)', quantity: 1, unit: 'шт' }
    ]
  },
  {
    id: 2,
    name: 'Опора анкерная металлическая 35 кВ и выше',
    technicalPlaceType: technicalPlaceTypes.POLE,
    materials: [
      { id: 201, name: 'Опора металлическая анкерная', quantity: 1, unit: 'шт' },
      { id: 202, name: 'Фундаментный блок', quantity: 4, unit: 'шт' },
      { id: 203, name: 'Траверса анкерная', quantity: 3, unit: 'шт' },
      { id: 204, name: 'Изолятор ПС-120', quantity: 12, unit: 'шт' },
      { id: 205, name: 'Арматура линейная', quantity: 24, unit: 'шт' },
      { id: 206, name: 'Грозозащитный трос', quantity: 50, unit: 'м' },
      { id: 207, name: 'Заземление (стержень)', quantity: 3, unit: 'шт' }
    ]
  },
  {
    id: 3,
    name: 'Опора железобетонная промежуточная',
    technicalPlaceType: technicalPlaceTypes.POLE,
    materials: [
      { id: 301, name: 'Стойка железобетонная', quantity: 1, unit: 'шт' },
      { id: 302, name: 'Оголовник', quantity: 1, unit: 'шт' },
      { id: 303, name: 'Траверса', quantity: 1, unit: 'шт' },
      { id: 304, name: 'Изолятор ПС-70', quantity: 6, unit: 'шт' },
      { id: 305, name: 'Арматура линейная', quantity: 8, unit: 'шт' },
      { id: 306, name: 'Грозотрос', quantity: 30, unit: 'м' }
    ]
  },
  // Наборы для пролётов
  {
    id: 4,
    name: 'Пролёт воздушной линии 35 кВ',
    technicalPlaceType: technicalPlaceTypes.SPAN,
    materials: [
      { id: 401, name: 'Провод АС-70/11', quantity: 150, unit: 'м' },
      { id: 402, name: 'Грозозащитный трос', quantity: 150, unit: 'м' },
      { id: 403, name: 'Зажим натяжной', quantity: 6, unit: 'шт' },
      { id: 404, name: 'Соединитель проводов', quantity: 3, unit: 'шт' },
      { id: 405, name: 'Дистанционный спейсер', quantity: 4, unit: 'шт' }
    ]
  },
  {
    id: 5,
    name: 'Пролёт воздушной линии 110 кВ',
    technicalPlaceType: technicalPlaceTypes.SPAN,
    materials: [
      { id: 501, name: 'Провод АС-120/19', quantity: 200, unit: 'м' },
      { id: 502, name: 'Грозозащитный трос ОКГ', quantity: 200, unit: 'м' },
      { id: 503, name: 'Зажим натяжной НИК', quantity: 6, unit: 'шт' },
      { id: 504, name: 'Соединитель проводов', quantity: 6, unit: 'шт' },
      { id: 505, name: 'Дистанционный спейсер', quantity: 6, unit: 'шт' },
      { id: 506, name: 'Виброгаситель', quantity: 12, unit: 'шт' }
    ]
  },
  // Наборы для трансформаторов
  {
    id: 6,
    name: 'Трансформатор масляный',
    technicalPlaceType: technicalPlaceTypes.TRANSFORMER,
    materials: [
      { id: 601, name: 'Трансформатор масляный', quantity: 1, unit: 'шт' },
      { id: 602, name: 'Масло трансформаторное', quantity: 200, unit: 'л' },
      { id: 603, name: 'Расширитель масла', quantity: 1, unit: 'шт' },
      { id: 604, name: 'Термометр', quantity: 1, unit: 'шт' },
      { id: 605, name: 'Кран масляный', quantity: 2, unit: 'шт' },
      { id: 606, name: 'Силикагель', quantity: 10, unit: 'кг' }
    ]
  },
  {
    id: 7,
    name: 'Трансформатор сухой',
    technicalPlaceType: technicalPlaceTypes.TRANSFORMER,
    materials: [
      { id: 701, name: 'Трансформатор сухой', quantity: 1, unit: 'шт' },
      { id: 702, name: 'Ограждение', quantity: 1, unit: 'компл' },
      { id: 703, name: 'Термодатчик', quantity: 1, unit: 'шт' },
      { id: 704, name: 'Вентилятор', quantity: 2, unit: 'шт' }
    ]
  },
  {
    id: 8,
    name: 'Трансформатор тока',
    technicalPlaceType: technicalPlaceTypes.CURRENT_TRANSFORMER,
    materials: [
      { id: 801, name: 'Трансформатор тока', quantity: 1, unit: 'шт' },
      { id: 802, name: 'Клеммник', quantity: 1, unit: 'шт' },
      { id: 803, name: 'Коробка зажимов', quantity: 1, unit: 'шт' }
    ]
  },
  {
    id: 9,
    name: 'Трансформатор напряжения',
    technicalPlaceType: technicalPlaceTypes.VOLTAGE_TRANSFORMER,
    materials: [
      { id: 901, name: 'Трансформатор напряжения', quantity: 1, unit: 'шт' },
      { id: 902, name: 'Предохранитель', quantity: 3, unit: 'шт' },
      { id: 903, name: 'Разрядник', quantity: 1, unit: 'шт' }
    ]
  },
  // Наборы для ячеек и коммутационных аппаратов
  {
    id: 10,
    name: 'Ячейка КРУ 6-10 кВ',
    technicalPlaceType: technicalPlaceTypes.SWITCHGEAR,
    materials: [
      { id: 1001, name: 'Ячейка КРУ', quantity: 1, unit: 'шт' },
      { id: 1002, name: 'Выключатель вакуумный', quantity: 1, unit: 'шт' },
      { id: 1003, name: 'Трансформатор тока', quantity: 3, unit: 'шт' },
      { id: 1004, name: 'Измерительный прибор', quantity: 1, unit: 'шт' },
      { id: 1005, name: 'Кабель контрольный', quantity: 20, unit: 'м' },
      { id: 1006, name: 'Шина медная', quantity: 5, unit: 'м' }
    ]
  },
  {
    id: 11,
    name: 'Выключатель масляный',
    technicalPlaceType: technicalPlaceTypes.CIRCUIT_BREAKER,
    materials: [
      { id: 1101, name: 'Выключатель масляный', quantity: 1, unit: 'шт' },
      { id: 1102, name: 'Масло трансформаторное', quantity: 50, unit: 'л' },
      { id: 1103, name: 'Привод выключателя', quantity: 1, unit: 'шт' },
      { id: 1104, name: 'Контакты', quantity: 3, unit: 'компл' }
    ]
  },
  {
    id: 12,
    name: 'Выключатель вакуумный',
    technicalPlaceType: technicalPlaceTypes.CIRCUIT_BREAKER,
    materials: [
      { id: 1201, name: 'Выключатель вакуумный', quantity: 1, unit: 'шт' },
      { id: 1202, name: 'Привод пружинный', quantity: 1, unit: 'шт' },
      { id: 1203, name: 'Контакты дугогасительные', quantity: 1, unit: 'компл' },
      { id: 1204, name: 'Изолятор опорный', quantity: 3, unit: 'шт' }
    ]
  },
  {
    id: 13,
    name: 'Разъединитель 35-110 кВ',
    technicalPlaceType: technicalPlaceTypes.DISCONNECTOR,
    materials: [
      { id: 1301, name: 'Разъединитель', quantity: 1, unit: 'шт' },
      { id: 1302, name: 'Привод', quantity: 1, unit: 'шт' },
      { id: 1303, name: 'Нож заземления', quantity: 1, unit: 'шт' },
      { id: 1304, name: 'Изолятор колонковый', quantity: 3, unit: 'шт' }
    ]
  },
  // Наборы для кабельных секций
  {
    id: 14,
    name: 'Кабельная секция 10 кВ',
    technicalPlaceType: technicalPlaceTypes.CABLE_SECTION,
    materials: [
      { id: 1401, name: 'Кабель АПвПу2г 3х95', quantity: 100, unit: 'м' },
      { id: 1402, name: 'Муфта концевая', quantity: 2, unit: 'шт' },
      { id: 1403, name: 'Муфта соединительная', quantity: 1, unit: 'шт' },
      { id: 1404, name: 'Зажим кабельный', quantity: 4, unit: 'шт' },
      { id: 1405, name: 'Плита перекрытия', quantity: 6, unit: 'шт' }
    ]
  },
  {
    id: 15,
    name: 'Кабельная секция 0.4 кВ',
    technicalPlaceType: technicalPlaceTypes.CABLE_SECTION,
    materials: [
      { id: 1501, name: 'Кабель АВВГ 4х50', quantity: 50, unit: 'м' },
      { id: 1502, name: 'Муфта концевая', quantity: 2, unit: 'шт' },
      { id: 1503, name: 'Гильза кабельная', quantity: 8, unit: 'шт' },
      { id: 1504, name: 'Зажим ответвительный', quantity: 4, unit: 'шт' }
    ]
  }
];

// Функция получения набора оборудования по типу технического места
export const getEquipmentSetByType = (type) => {
  return equipmentSets.filter(set => set.technicalPlaceType === type);
};

// Допустимые типы технических мест по типу объекта
export const allowedTechnicalPlaceTypesByObjectType = {
  'ЛЭП': [technicalPlaceTypes.POLE, technicalPlaceTypes.SPAN, technicalPlaceTypes.CABLE_SECTION],
  'Подстанция': [technicalPlaceTypes.TRANSFORMER, technicalPlaceTypes.SWITCHGEAR, technicalPlaceTypes.CIRCUIT_BREAKER, technicalPlaceTypes.DISCONNECTOR, technicalPlaceTypes.CURRENT_TRANSFORMER, technicalPlaceTypes.VOLTAGE_TRANSFORMER],
  'Трансформаторная подстанция': [technicalPlaceTypes.TRANSFORMER, technicalPlaceTypes.SWITCHGEAR, technicalPlaceTypes.CIRCUIT_BREAKER, technicalPlaceTypes.CABLE_SECTION],
  'Распределительный пункт': [technicalPlaceTypes.SWITCHGEAR, technicalPlaceTypes.CIRCUIT_BREAKER, technicalPlaceTypes.DISCONNECTOR, technicalPlaceTypes.CABLE_SECTION]
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
  DRAFT: 'Назначен',
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
