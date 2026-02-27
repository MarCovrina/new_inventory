// Типы объектов электроснабжения
export type ObjectType = 'line' | 'substation' | 'transformer_substation' | 'distribution_point';

// Типы технических мест
export type TechnicalLocationType = 
  | 'support'      // Опора (для ЛЭП)
  | 'span'         // Пролет (для ЛЭП)
  | 'bay'          // Ячейка (для подстанций)
  | 'unit'         // Блок (для подстанций)
  | 'feeder'       // Фидер (для распределительных пунктов)
  | 'transformer'; // Трансформатор

// Типы материалов и оборудования
export type MaterialType = 
  | 'insulator'        // Изолятор
  | 'wire'             // Провод
  | 'cable'            // Кабель
  | 'pole'             // Стойка
  | 'crossarm'         // Траверса
  | 'lightning_rod'    // Грозозащитный трос
  | 'transformer'      // Трансформатор
  | 'circuit_breaker'  // Выключатель
  | 'disconnector'     // Разъединитель
  | 'current_transformer' // Трансформатор тока
  | 'voltage_transformer'  // Трансформатор напряжения
  | 'surge_arrester'   // ОПН
  | 'busbar'           // Шина
  | 'support_insulator'; // Опорный изолятор

// Статус листа инвентаризации
export type InventorySheetStatus = 
  | 'draft'           // Черновик - создан мастером, не принят
  | 'in_work'         // В работе - принят исполнителем
  | 'under_review'    // На проверке - сдан исполнителем
  | 'returned'        // Возвращен на доработку
  | 'approved';       // Согласовано - завершен

// Роль пользователя
export type UserRole = 'master' | 'executor';

// Пользователь
export interface User {
  id: string;
  name: string;
  role: UserRole;
}

// Объект электроснабжения
export interface PowerObject {
  id: string;
  name: string;
  type: ObjectType;
  address?: string;
  description?: string;
  // Доступные типы технических мест для данного объекта
  availableTechLocationTypes: TechnicalLocationType[];
  // Характеристики объекта
  characteristics: Record<string, string | number>;
}

// Характеристика технического места
export interface TechLocationCharacteristic {
  key: string;
  label: string;
  value: string | number;
  unit?: string;
  editable: boolean;
}

// Техническое место
export interface TechnicalLocation {
  id: string;
  objectId: string;
  type: TechnicalLocationType;
  name: string;
  // Характеристики
  characteristics: TechLocationCharacteristic[];
  // Комментарий
  comment?: string;
  // Признак осмотренного
  inspected: boolean;
  // Дата осмотра
  inspectedAt?: string;
  // Фотографии
  photos: Photo[];
  // Материалы и оборудование
  materials: MaterialOnLocation[];
}

// Фотография
export interface Photo {
  id: string;
  url: string;
  description?: string;
  createdAt: string;
}

// Материал/оборудование на техническом месте
export interface MaterialOnLocation {
  id: string;
  type: MaterialType;
  name: string;
  quantity: number;
  unit: string;
  // Дополнительные характеристики
  characteristics?: Record<string, string | number>;
  // Признак добавлен при инвентаризации
  addedDuringInventory: boolean;
}

// Лист инвентаризации
export interface InventorySheet {
  id: string;
  number: string;
  // Объект для инвентаризации
  objectId: string;
  object?: PowerObject;
  // Выбранные технические места (если не выбраны - все)
  selectedTechLocationIds?: string[];
  // Исполнитель
  executorId: string;
  executor?: User;
  // Создатель (мастер)
  creatorId: string;
  creator?: User;
  // Статус
  status: InventorySheetStatus;
  // Технические места с результатами осмотра
  techLocations: TechnicalLocation[];
  // Дата создания
  createdAt: string;
  // Дата принятия в работу
  acceptedAt?: string;
  // Дата сдачи на проверку
  submittedAt?: string;
  // Дата возврата на доработку
  returnedAt?: string;
  // Комментарий при возврате
  returnComment?: string;
  // Дата согласования
  approvedAt?: string;
  // Кто согласовал
  approvedBy?: string;
  approver?: User;
}

// Конфигурация типов объектов и их технических мест
export const OBJECT_TYPE_CONFIG: Record<ObjectType, {
  label: string;
  availableTechLocationTypes: TechnicalLocationType[];
}> = {
  line: {
    label: 'ЛЭП',
    availableTechLocationTypes: ['support', 'span']
  },
  substation: {
    label: 'Подстанция',
    availableTechLocationTypes: ['bay', 'unit']
  },
  transformer_substation: {
    label: 'Трансформаторная подстанция',
    availableTechLocationTypes: ['transformer', 'bay']
  },
  distribution_point: {
    label: 'Распределительный пункт',
    availableTechLocationTypes: ['feeder', 'bay']
  }
};

// Конфигурация типов технических мест
export const TECH_LOCATION_TYPE_CONFIG: Record<TechnicalLocationType, {
  label: string;
  defaultCharacteristics: TechLocationCharacteristic[];
  availableMaterials: MaterialType[];
}> = {
  support: {
    label: 'Опора',
    defaultCharacteristics: [
      { key: 'height', label: 'Высота', value: '', unit: 'м', editable: true },
      { key: 'type', label: 'Тип', value: '', editable: true },
      { key: 'material', label: 'Материал', value: '', editable: true },
      { key: 'yearInstalled', label: 'Год установки', value: '', editable: true }
    ],
    availableMaterials: ['pole', 'crossarm', 'insulator', 'lightning_rod']
  },
  span: {
    label: 'Пролет',
    defaultCharacteristics: [
      { key: 'length', label: 'Длина', value: '', unit: 'м', editable: true },
      { key: 'wireType', label: 'Тип провода', value: '', editable: true },
      { key: 'wireCrossSection', label: 'Сечение провода', value: '', unit: 'мм²', editable: true }
    ],
    availableMaterials: ['wire', 'insulator']
  },
  bay: {
    label: 'Ячейка',
    defaultCharacteristics: [
      { key: 'number', label: 'Номер', value: '', editable: true },
      { key: 'voltage', label: 'Напряжение', value: '', unit: 'кВ', editable: true },
      { key: 'circuitName', label: 'Наименование присоединения', value: '', editable: true }
    ],
    availableMaterials: ['circuit_breaker', 'disconnector', 'current_transformer', 'voltage_transformer', 'surge_arrester', 'busbar', 'support_insulator']
  },
  unit: {
    label: 'Блок',
    defaultCharacteristics: [
      { key: 'name', label: 'Наименование', value: '', editable: true },
      { key: 'voltage', label: 'Напряжение', value: '', unit: 'кВ', editable: true }
    ],
    availableMaterials: ['transformer', 'circuit_breaker', 'disconnector']
  },
  feeder: {
    label: 'Фидер',
    defaultCharacteristics: [
      { key: 'number', label: 'Номер', value: '', editable: true },
      { key: 'voltage', label: 'Напряжение', value: '', unit: 'кВ', editable: true },
      { key: 'load', label: 'Нагрузка', value: '', unit: 'А', editable: true }
    ],
    availableMaterials: ['cable', 'circuit_breaker', 'disconnector']
  },
  transformer: {
    label: 'Трансформатор',
    defaultCharacteristics: [
      { key: 'power', label: 'Мощность', value: '', unit: 'кВА', editable: true },
      { key: 'voltageHigh', label: 'Напряжение ВН', value: '', unit: 'кВ', editable: true },
      { key: 'voltageLow', label: 'Напряжение НН', value: '', unit: 'кВ', editable: true },
      { key: 'yearInstalled', label: 'Год установки', value: '', editable: true }
    ],
    availableMaterials: ['transformer']
  }
};

// Конфигурация типов материалов
export const MATERIAL_TYPE_CONFIG: Record<MaterialType, {
  label: string;
  unit: string;
}> = {
  insulator: { label: 'Изолятор', unit: 'шт' },
  wire: { label: 'Провод', unit: 'м' },
  cable: { label: 'Кабель', unit: 'м' },
  pole: { label: 'Стойка', unit: 'шт' },
  crossarm: { label: 'Траверса', unit: 'шт' },
  lightning_rod: { label: 'Грозозащитный трос', unit: 'м' },
  transformer: { label: 'Трансформатор', unit: 'шт' },
  circuit_breaker: { label: 'Выключатель', unit: 'шт' },
  disconnector: { label: 'Разъединитель', unit: 'шт' },
  current_transformer: { label: 'Трансформатор тока', unit: 'шт' },
  voltage_transformer: { label: 'Трансформатор напряжения', unit: 'шт' },
  surge_arrester: { label: 'ОПН', unit: 'шт' },
  busbar: { label: 'Шина', unit: 'м' },
  support_insulator: { label: 'Опорный изолятор', unit: 'шт' }
};

// Статус с лейблами
export const STATUS_CONFIG: Record<InventorySheetStatus, {
  label: string;
  color: string;
}> = {
  draft: { label: 'Черновик', color: 'default' },
  in_work: { label: 'В работе', color: 'processing' },
  under_review: { label: 'На проверке', color: 'warning' },
  returned: { label: 'Возвращен на доработку', color: 'error' },
  approved: { label: 'Согласовано', color: 'success' }
};
