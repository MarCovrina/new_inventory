import React, { useState, useEffect } from 'react';
import { 
  Modal, 
  Card, 
  Row, 
  Col, 
  Typography, 
  Tag, 
  Button, 
  Space, 
  Form, 
  Input, 
  InputNumber, 
  Select, 
  Checkbox,
  Divider,
  Upload,
  message,
  Tabs
} from 'antd';
import { 
  PlusOutlined, 
  DeleteOutlined, 
  CheckCircleOutlined, 
  ClockCircleOutlined,
  ArrowLeftOutlined,
  UploadOutlined,
  EnvironmentOutlined,
  EditOutlined,
  FormOutlined,
  ToolOutlined,
  CameraOutlined,
  MessageOutlined
} from '@ant-design/icons';
import { getTechnicalPlacesByObjectId, technicalPlaceCharacteristics } from '../data/mockData';

const { Title, Text } = Typography;
const { TextArea } = Input;

// Coordinate Picker Modal Component - Mobile Optimized
const CoordinatePickerModal = ({ open, value, onSave, onCancel }) => {
  const [lat, setLat] = useState(value?.lat || 53.3548);
  const [lon, setLon] = useState(value?.lon || 83.7698);

  const handleMapClick = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const newLat = 53.4 + (1 - y / rect.height) * 0.2;
    const newLon = 83.5 + (x / rect.width) * 0.8;
    setLat(parseFloat(newLat.toFixed(6)));
    setLon(parseFloat(newLon.toFixed(6)));
  };

  return (
    <Modal
      title="📍 Выбор координат"
      open={open}
      onCancel={onCancel}
      onOk={() => onSave({ lat, lon })}
      okText="Применить"
      width="95%"
      style={{ maxWidth: 500 }}
      styles={{ body: { padding: 16 } }}
    >
      <div 
        style={{ 
          width: '100%', 
          height: 250, 
          background: '#e6f7ff',
          border: '2px solid #91d5ff',
          borderRadius: 12,
          position: 'relative',
          overflow: 'hidden',
          cursor: 'crosshair',
          touchAction: 'none'
        }}
        onClick={handleMapClick}
      >
        <div style={{
          width: '100%',
          height: '100%',
          background: `linear-gradient(to right, #f0f0f0 1px, transparent 1px),
                       linear-gradient(to bottom, #f0f0f0 1px, transparent 1px),
                       linear-gradient(to right, #e0e0e0 40px, transparent 40px),
                       linear-gradient(to bottom, #e0e0e0 40px, transparent 40px)`,
          backgroundSize: '20px 20px, 20px 20px, 80px 80px, 80px 80px'
        }}>
          <div style={{ 
            position: 'absolute', 
            top: '50%', 
            left: '50%', 
            transform: 'translate(-50%, -50%)',
            fontSize: 48,
            color: '#1890ff'
          }}>
            <EnvironmentOutlined spin />
          </div>
        </div>
      </div>
      
      <div style={{ marginTop: 16 }}>
        <Row gutter={12}>
          <Col span={12}>
            <Text type="secondary" style={{ fontSize: 12, marginBottom: 4, display: 'block' }}>Широта</Text>
            <InputNumber
              value={lat}
              onChange={v => setLat(v || 0)}
              precision={6}
              style={{ width: '100%' }}
              size="large"
            />
          </Col>
          <Col span={12}>
            <Text type="secondary" style={{ fontSize: 12, marginBottom: 4, display: 'block' }}>Долгота</Text>
            <InputNumber
              value={lon}
              onChange={v => setLon(v || 0)}
              precision={6}
              style={{ width: '100%' }}
              size="large"
            />
          </Col>
        </Row>
      </div>
      <div style={{ marginTop: 12, textAlign: 'center' }}>
        <Text type="secondary" style={{ fontSize: 13 }}>👆 Кликните на карту для выбора</Text>
      </div>
    </Modal>
  );
};

const TechnicalPlaceCard = ({ place, onClick, isSelected }) => {
  const statusIcon = place.isInspected 
    ? <CheckCircleOutlined style={{ color: '#52c41a', fontSize: 18 }} /> 
    : <ClockCircleOutlined style={{ color: '#faad14', fontSize: 18 }} />;

  return (
    <Card
      hoverable
      onClick={() => onClick(place)}
      style={{ 
        borderColor: isSelected ? '#1890ff' : '#d9d9d9',
        backgroundColor: place.isInspected ? '#f6ffed' : '#fffbf0',
        borderRadius: 12,
        marginBottom: 12
      }}
      styles={{ body: { padding: 16 } }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ flex: 1 }}>
          <Text strong style={{ fontSize: 16, display: 'block' }}>{place.name}</Text>
          <Tag color="blue" style={{ marginTop: 4 }}>{place.type}</Tag>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 100, justifyContent: 'flex-end' }}>
          {statusIcon}
          <Text style={{ fontSize: 13 }} type={place.isInspected ? 'success' : 'warning'}>
            {place.isInspected ? 'Осмотрено' : 'Не осмотрено'}
          </Text>
        </div>
      </div>
      {place.comment && (
        <div style={{ marginTop: 8 }}>
          <Text type="secondary" ellipsis style={{ fontSize: 12 }}>
            💬 {place.comment}
          </Text>
        </div>
      )}
    </Card>
  );
};

const TechnicalPlaceForm = ({ place, onSave, onClose }) => {
  const [form] = Form.useForm();
  const [characteristics, setCharacteristics] = useState(place.characteristics || {});
  const [photos, setPhotos] = useState(place.photos || []);
  
  const charDefinitions = technicalPlaceCharacteristics[place.type] || [];

  useEffect(() => {
    form.setFieldsValue({
      ...place.characteristics,
      comment: place.comment || ''
    });
    setPhotos(place.photos || []);
    setEquipment(place.equipment || []);
  }, [place, form]);

  const handleValuesChange = (changedValues, allValues) => {
    setCharacteristics(allValues);
  };

  const handleSave = () => {
    const values = form.getFieldsValue();
    onSave({
      ...place,
      characteristics: values,
      comment: values.comment,
      photos: photos,
      equipment: equipment,
      isInspected: true
    });
    message.success('Изменения сохранены');
  };

  const handlePhotoUpload = ({ fileList: newFileList }) => {
    if (newFileList.length > 8) {
      message.warning('Максимум 8 фото');
      return;
    }
    setPhotos(newFileList);
  };

  const handleRemovePhoto = (file) => {
    setPhotos(prev => prev.filter(p => p.uid !== file.uid));
  };

  // Equipment management
  const [equipment, setEquipment] = useState([]);
  const [newEquipment, setNewEquipment] = useState({ name: '', quantity: 1, unit: 'шт' });
  const [quantityEditModal, setQuantityEditModal] = useState({ open: false, item: null, value: 1 });

  const handleAddEquipment = () => {
    if (!newEquipment.name.trim()) {
      message.warning('Введите название оборудования/материала');
      return;
    }
    const newItem = {
      id: Date.now(),
      name: newEquipment.name,
      quantity: newEquipment.quantity,
      unit: newEquipment.unit,
      markedForDeletion: false,
      isNew: true
    };
    setEquipment([...equipment, newItem]);
    setNewEquipment({ name: '', quantity: 1, unit: 'шт' });
  };

  const handleToggleDelete = (id) => {
    const item = equipment.find(e => e.id === id);
    if (item.isNew) {
      // New items are completely removed when delete is clicked
      setEquipment(prev => prev.filter(e => e.id !== id));
    } else {
      // Original items are marked for deletion
      setEquipment(prev => prev.map(item => 
        item.id === id ? { ...item, markedForDeletion: !item.markedForDeletion } : item
      ));
    }
  };

  const handleDeleteEquipment = (id) => {
    handleToggleDelete(id);
  };

  const handleOpenQuantityEdit = (item) => {
    setQuantityEditModal({ open: true, item: item, value: item.quantity });
  };

  const handleSaveQuantity = () => {
    setEquipment(prev => prev.map(item => 
      item.id === quantityEditModal.item.id 
        ? { ...item, quantity: quantityEditModal.value } 
        : item
    ));
    setQuantityEditModal({ open: false, item: null, value: 1 });
    message.success('Количество обновлено');
  };

  // Mobile-optimized Coordinate Picker
  const CoordinatePicker = ({ value, onChange }) => {
    const [open, setOpen] = useState(false);
    const [coords, setCoords] = useState(value || null);

    const handleSave = (newCoords) => {
      setCoords(newCoords);
      onChange(newCoords);
      setOpen(false);
    };

    return (
      <>
        <Button 
          type={coords ? 'default' : 'primary'}
          icon={<EnvironmentOutlined />} 
          onClick={() => setOpen(true)}
          size="large"
          block
          style={{ height: 48, marginBottom: 8 }}
        >
          {coords ? `📍 ${coords.lat.toFixed(5)}, ${coords.lon.toFixed(5)}` : '📍 Выбрать на карте'}
        </Button>
        {coords && (
          <Button 
            type="text" 
            danger
            icon={<DeleteOutlined />} 
            onClick={() => {
              setCoords(null);
              onChange(null);
            }}
            size="small"
          >
            Очистить
          </Button>
        )}
        <CoordinatePickerModal
          open={open}
          value={coords}
          onSave={handleSave}
          onCancel={() => setOpen(false)}
        />
      </>
    );
  };

  const renderCharacteristicField = (char) => {
    const commonProps = {
      key: char.key,
      label: char.label,
      name: char.key,
      rules: char.type === 'number' ? [{ type: 'number', message: 'Введите число' }] : [],
      style: { marginBottom: 16 }
    };

    switch (char.type) {
      case 'string':
        return (
          <Col xs={24} sm={12} key={char.key}>
            <Form.Item {...commonProps}>
              <Input 
                placeholder={char.label} 
                size="large"
              />
            </Form.Item>
          </Col>
        );
      case 'number':
        return (
          <Col xs={24} sm={12} key={char.key}>
            <Form.Item {...commonProps}>
              <InputNumber 
                style={{ width: '100%' }} 
                placeholder={char.label}
                size="large"
              />
            </Form.Item>
          </Col>
        );
      case 'select':
        return (
          <Col xs={24} sm={12} key={char.key}>
            <Form.Item {...commonProps} name={char.key}>
              <Select 
                placeholder="Выберите"
                size="large"
              >
                {char.options.map(opt => (
                  <Select.Option key={opt} value={opt}>{opt}</Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
        );
      case 'boolean':
        return (
          <Col xs={24} key={char.key}>
            <Form.Item 
              label={char.label} 
              name={char.key} 
              valuePropName="checked"
              style={{ marginBottom: 16 }}
            >
              <Checkbox style={{ transform: 'scale(1.3)', marginLeft: 8 }} />
            </Form.Item>
          </Col>
        );
      case 'coordinates':
        return (
          <Col xs={24} key={char.key}>
            <Form.Item 
              label={char.label} 
              name={char.key}
              style={{ marginBottom: 16 }}
            >
              <CoordinatePicker 
                value={characteristics[char.key]} 
                onChange={(coords) => {
                  form.setFieldValue(char.key, coords);
                  setCharacteristics(prev => ({ ...prev, [char.key]: coords }));
                }}
              />
            </Form.Item>
          </Col>
        );
      default:
        return null;
    }
  };

  return (
    <div style={{ padding: '0 4px' }}>
      <Card style={{ borderRadius: 12 }}>
        <Tabs
          defaultActiveKey="1"
          size="large"
          animated={false}
          style={{ width: '100%' }}
          items={[
            {
              key: '1',
              label: (
                <span style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                  <FormOutlined style={{ fontSize: 20 }} />
                  <span style={{ fontSize: 10 }}>Характеристики</span>
                </span>
              ),
              children: (
                <>
                  <Form
                    form={form}
                    layout="vertical"
                    onValuesChange={handleValuesChange}
                  >
                    <Row gutter={[12, 0]}>
                      {charDefinitions.map(char => renderCharacteristicField(char))}
                    </Row>
                  </Form>
                </>
              )
            },
            {
              key: '2',
              label: (
                <span style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                  <ToolOutlined style={{ fontSize: 20 }} />
                  <span style={{ fontSize: 10 }}>Оборудование</span>
                </span>
              ),
              children: (
                <>
                  {/* Equipment and Materials Section */}
                  <div style={{ marginBottom: 16 }}>
                    {equipment.length === 0 ? (
                      <Text type="secondary">Оборудование и материалы не добавлены</Text>
                    ) : (
                      equipment.map((item) => (
                        <Card 
                          key={item.id} 
                          size="small" 
                          style={{ 
                            marginBottom: 8, 
                            opacity: item.markedForDeletion ? 0.5 : 1,
                            backgroundColor: item.markedForDeletion ? '#fff1f0' : '#f6ffed'
                          }}
                        >
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                            <div style={{ flex: 1 }}>
                              <Text delete={item.markedForDeletion}>{item.name}</Text>
                              <Text type="secondary" style={{ marginLeft: 8 }}>
                                ({item.quantity} {item.unit})
                              </Text>
                              {item.isNew && (
                                <Tag color="green" style={{ marginLeft: 8 }}>Новое</Tag>
                              )}
                              {item.markedForDeletion && (
                                <Tag color="red" style={{ marginLeft: 8 }}>На удаление</Tag>
                              )}
                            </div>
                            <Space>
                              {!item.markedForDeletion && (
                                <Button 
                                  type="link" 
                                  icon={<EditOutlined />}
                                  onClick={() => handleOpenQuantityEdit(item)}
                                  size="small"
                                >
                                  Изменить количество
                                </Button>
                              )}
                              {item.isNew ? (
                                <Button 
                                  type="text" 
                                  danger
                                  icon={<DeleteOutlined />}
                                  onClick={() => handleToggleDelete(item.id)}
                                  size="small"
                                >
                                  Удалить
                                </Button>
                              ) : (
                                <Button 
                                  type="text" 
                                  danger={!item.markedForDeletion}
                                  icon={item.markedForDeletion ? <CheckCircleOutlined /> : <DeleteOutlined />}
                                  onClick={() => handleToggleDelete(item.id)}
                                  size="small"
                                >
                                  {item.markedForDeletion ? 'Отменить' : 'Удалить'}
                                </Button>
                              )}
                            </Space>
                          </div>
                        </Card>
                      ))
                    )}
                  </div>

                  {/* Add Equipment Form */}
                  <div style={{ 
                    background: '#f5f5f5', 
                    padding: 12, 
                    borderRadius: 8,
                    marginBottom: 16 
                  }}>
                    <Text strong style={{ display: 'block', marginBottom: 8 }}>Добавить оборудование/материал</Text>
                    <Space direction="vertical" style={{ width: '100%' }}>
                      <Input 
                        placeholder="Название (например: Изолятор ПС-120)"
                        value={newEquipment.name}
                        onChange={e => setNewEquipment({ ...newEquipment, name: e.target.value })}
                        size="large"
                      />
                      <Space>
                        <InputNumber
                          min={1}
                          value={newEquipment.quantity}
                          onChange={v => setNewEquipment({ ...newEquipment, quantity: v || 1 })}
                          size="large"
                          style={{ width: 80 }}
                        />
                        <Select
                          value={newEquipment.unit}
                          onChange={v => setNewEquipment({ ...newEquipment, unit: v })}
                          size="large"
                          style={{ width: 100 }}
                        >
                          <Select.Option value="шт">шт</Select.Option>
                          <Select.Option value="м">м</Select.Option>
                          <Select.Option value="кг">кг</Select.Option>
                          <Select.Option value="компл">компл</Select.Option>
                        </Select>
                        <Button 
                          type="primary" 
                          icon={<PlusOutlined />}
                          onClick={handleAddEquipment}
                          size="large"
                        >
                          Добавить
                        </Button>
                      </Space>
                    </Space>
                  </div>
                </>
              )
            },
            {
              key: '3',
              label: (
                <span style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                  <CameraOutlined style={{ fontSize: 20 }} />
                  <span style={{ fontSize: 10 }}>Фотографии ({photos.length}/8)</span>
                </span>
              ),
              children: (
                <>
                  <div style={{ 
                    minHeight: photos.length >= 5 ? 200 : 120, 
                    transition: 'min-height 0.3s ease'
                  }}>
                    <Upload
                      listType="picture-card"
                      fileList={photos}
                      onChange={handlePhotoUpload}
                      onRemove={handleRemovePhoto}
                      beforeUpload={(file) => {
                        const isImage = file.type.startsWith('image/');
                        if (!isImage) {
                          message.error('Можно загружать только изображения!');
                          return Upload.LIST_IGNORE;
                        }
                        return false;
                      }}
                      maxCount={8}
                      multiple
                      accept="image/*"
                    >
                      {photos.length < 8 && (
                        <div>
                          <UploadOutlined style={{ fontSize: 24 }} />
                          <div style={{ marginTop: 4, fontSize: 12 }}>Добавить</div>
                        </div>
                      )}
                    </Upload>
                  </div>
                </>
              )
            },
            {
              key: '4',
              label: (
                <span style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                  <MessageOutlined style={{ fontSize: 20 }} />
                  <span style={{ fontSize: 10 }}>Комментарий</span>
                </span>
              ),
              children: (
                <>
                  <Form form={form} layout="vertical">
                    <Form.Item label="" name="comment" style={{ marginBottom: 16 }}>
                      <TextArea 
                        rows={6} 
                        placeholder="Введите комментарий к техническому месту..."
                        size="large"
                      />
                    </Form.Item>
                  </Form>
                </>
              )
            }
          ]}
        />
      </Card>

      {/* Quantity Edit Modal */}
      <Modal
          title="Изменить количество"
          open={quantityEditModal.open}
          onCancel={() => setQuantityEditModal({ open: false, item: null, value: 1 })}
          onOk={handleSaveQuantity}
          okText="Сохранить"
        >
          <div style={{ padding: '16px 0' }}>
            <Text style={{ display: 'block', marginBottom: 8 }}>
              {quantityEditModal.item?.name}
            </Text>
            <Space>
              <InputNumber
                min={1}
                value={quantityEditModal.value}
                onChange={v => setQuantityEditModal({ ...quantityEditModal, value: v || 1 })}
                size="large"
                style={{ width: 100 }}
              />
              <Text>{quantityEditModal.item?.unit}</Text>
            </Space>
          </div>
        </Modal>

      {/* Sticky Footer with Action Buttons */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'flex-end', 
        gap: 12,
        padding: '16px 0'
      }}>
        <Button onClick={onClose} size="large">
          Назад к списку
        </Button>
        <Button 
          type="primary" 
          icon={<CheckCircleOutlined />} 
          onClick={handleSave}
          size="large"
        >
          Сохранить
        </Button>
      </div>
    </div>
  );
};

const EditInventorySheetModal = ({ open, sheet, onClose, onSave }) => {
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [technicalPlaces, setTechnicalPlaces] = useState([]);

  useEffect(() => {
    if (sheet && sheet.object) {
      const places = getTechnicalPlacesByObjectId(sheet.object.id);
      setTechnicalPlaces(places);
    } else {
      setTechnicalPlaces([]);
    }
    setSelectedPlace(null);
  }, [sheet, open]);

  const handlePlaceClick = (place) => {
    setSelectedPlace(place);
  };

  const handlePlaceSave = (updatedPlace) => {
    setTechnicalPlaces(prev => 
      prev.map(p => p.id === updatedPlace.id ? updatedPlace : p)
    );
    setSelectedPlace(null);
  };

  const handleAddPlace = () => {
    const newPlace = {
      id: Date.now(),
      objectId: sheet.object.id,
      type: Object.keys(technicalPlaceCharacteristics)[0] || 'Опора',
      name: `Новое тех. место`,
      isInspected: false,
      characteristics: {},
      comment: '',
      photos: []
    };
    setTechnicalPlaces(prev => [...prev, newPlace]);
    setSelectedPlace(newPlace);
  };

  const handleBackToList = () => {
    setSelectedPlace(null);
  };

  if (!sheet) return null;

  const renderContent = () => {
    if (selectedPlace) {
      return (
        <TechnicalPlaceForm 
          place={selectedPlace} 
          onSave={handlePlaceSave}
          onClose={handleBackToList}
        />
      );
    }

    return (
      <div style={{ padding: '0 4px' }}>
        {/* Sheet Info */}
        <Card style={{ borderRadius: 12, marginBottom: 16 }}>
          <Space direction="vertical" size={8} style={{ width: '100%' }}>
            <div>
              <Text type="secondary">Объект</Text>
              <br />
              <Text strong style={{ fontSize: 15 }}>{sheet.object.name}</Text>
              <Tag style={{ marginLeft: 8 }}>{sheet.object.type}</Tag>
            </div>
            <div>
              <Text type="secondary">Исполнитель</Text>
              <br />
              <Text>{sheet.executor?.name}</Text>
            </div>
            <div>
              <Text type="secondary">Статус</Text>
              <br />
              <Tag color={
                sheet.status === 'Согласован' ? 'success' :
                sheet.status === 'В работе' ? 'processing' :
                sheet.status === 'Сдан на проверку' ? 'warning' :
                sheet.status === 'Возвращен на доработку' ? 'error' : 'default'
              }>
                {sheet.status}
              </Tag>
            </div>
          </Space>
        </Card>

        <Divider style={{ margin: '16px 0' }}>📋 Технические места ({technicalPlaces.length})</Divider>

        {/* Technical Places List */}
        <div style={{ maxHeight: '50vh', overflowY: 'auto' }}>
          {technicalPlaces.map(place => (
            <TechnicalPlaceCard 
              key={place.id}
              place={place} 
              onClick={handlePlaceClick}
              isSelected={false}
            />
          ))}
        </div>

        <Button 
          type="dashed" 
          icon={<PlusOutlined />} 
          onClick={handleAddPlace}
          size="large"
          block
          style={{ marginTop: 16, height: 48 }}
        >
          Добавить тех. место
        </Button>
      </div>
    );
  };

  return (
    <Modal
      title={selectedPlace ? `${selectedPlace.name}` : `Лист ${sheet.number}`}
      open={open}
      onCancel={onClose}
      width="95%"
      style={{ maxWidth: 600 }}
      footer={selectedPlace ? null : [
        <Button key="close" onClick={onClose} size="large">
          Закрыть
        </Button>
      ]}
    >
      {renderContent()}
    </Modal>
  );
};

export default EditInventorySheetModal;
