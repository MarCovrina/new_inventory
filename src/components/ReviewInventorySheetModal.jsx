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
  Progress,
  Divider,
  Image,
  Empty,
  Table,
  Popconfirm,
  message
} from 'antd';
import { 
  ArrowLeftOutlined, 
  CheckCircleOutlined, 
  ClockCircleOutlined,
  EnvironmentOutlined,
  UserOutlined,
  CalendarOutlined,
  FileTextOutlined,
  EditOutlined,
  DeleteOutlined,
  SaveOutlined,
  ToolOutlined,
  AppstoreAddOutlined,
  PlusOutlined
} from '@ant-design/icons';
import { getTechnicalPlacesByObjectId, technicalPlaceCharacteristics, technicalPlaceTypes, inventorySheetStatuses, equipmentSets } from '../data/mockData';

const { Title, Text } = Typography;
const { TextArea } = Input;

const ReviewInventorySheetModal = ({ open, sheet, onClose, onApprove, onReturn }) => {
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [technicalPlaces, setTechnicalPlaces] = useState([]);
  const [editedCharacteristics, setEditedCharacteristics] = useState({});
  const [editedEquipment, setEditedEquipment] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [form] = Form.useForm();
  const [addItemModalOpen, setAddItemModalOpen] = useState(false);
  const [addSetModalOpen, setAddSetModalOpen] = useState(false);
  const [newEquipment, setNewEquipment] = useState({ name: '', quantity: 1, unit: 'шт' });

  useEffect(() => {
    if (open && sheet) {
      const places = getTechnicalPlacesByObjectId(sheet.object?.id);
      setTechnicalPlaces(places || []);
      
      if (places && places.length > 0) {
        setSelectedPlace(places[0]);
      } else {
        setSelectedPlace(null);
      }
    }
  }, [open, sheet]);

  useEffect(() => {
    if (selectedPlace) {
      setEditedCharacteristics({ ...selectedPlace.characteristics });
      setEditedEquipment(selectedPlace.equipment ? [...selectedPlace.equipment] : []);
    }
  }, [selectedPlace]);

  const handleEditStart = () => {
    setIsEditing(true);
  };

  const handleEditCancel = () => {
    setIsEditing(false);
    if (selectedPlace) {
      setEditedCharacteristics({ ...selectedPlace.characteristics });
      setEditedEquipment(selectedPlace.equipment ? [...selectedPlace.equipment] : []);
    }
  };

  const handleSave = () => {
    // Сохраняем изменения
    if (selectedPlace) {
      const updatedPlace = {
        ...selectedPlace,
        characteristics: editedCharacteristics,
        equipment: editedEquipment
      };
      setSelectedPlace(updatedPlace);
      setTechnicalPlaces(prev => prev.map(p => 
        p.id === updatedPlace.id ? updatedPlace : p
      ));
      message.success('Изменения сохранены');
    }
    setIsEditing(false);
  };

  const handleToggleVerified = () => {
    if (selectedPlace) {
      const updatedPlace = {
        ...selectedPlace,
        isVerified: !selectedPlace.isVerified
      };
      setSelectedPlace(updatedPlace);
      setTechnicalPlaces(prev => prev.map(p => 
        p.id === updatedPlace.id ? updatedPlace : p
      ));
      message.success(updatedPlace.isVerified ? 'Техническое место проверено' : 'Отметка о проверке снята');
    }
  };

  const handleCharacteristicChange = (key, value) => {
    setEditedCharacteristics(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleEquipmentQuantityChange = (index, quantity) => {
    setEditedEquipment(prev => prev.map((item, i) => 
      i === index ? { ...item, quantity } : item
    ));
  };

  const handleEquipmentDelete = (index) => {
    setEditedEquipment(prev => prev.map((item, i) => 
      i === index ? { ...item, markedForDeletion: !item.markedForDeletion } : item
    ));
  };

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
    setEditedEquipment([...editedEquipment, newItem]);
    setNewEquipment({ name: '', quantity: 1, unit: 'шт' });
    setAddItemModalOpen(false);
  };

  const handleAddEquipmentFromSet = (set) => {
    const newItems = set.materials.map(mat => ({
      id: Date.now() + Math.random(),
      name: mat.name,
      quantity: mat.quantity,
      unit: mat.unit,
      markedForDeletion: false,
      isNew: true
    }));
    setEditedEquipment([...editedEquipment, ...newItems]);
    setAddSetModalOpen(false);
    message.success(`Добавлен набор: ${set.name}`);
  };

  const getAvailableEquipmentSets = () => {
    if (!selectedPlace) return [];
    return equipmentSets.filter(set => set.technicalPlaceType === selectedPlace.type);
  };

  if (!sheet) return null;

  const inspectedCount = sheet.inspectedPlacesCount || 0;
  const totalCount = sheet.technicalPlacesCount || 0;
  const progressPercent = totalCount > 0 ? Math.round((inspectedCount / totalCount) * 100) : 0;

  const getPlaceStatusIcon = (place) => {
    return <ClockCircleOutlined style={{ color: '#bfbfbf', fontSize: 16 }} />;
  };

  const getPlaceStatusColor = (place) => {
    if (place.isVerified) return '#52c41a';
    return '#bfbfbf';
  };

  // Рендер редактируемых характеристик
  const renderEditableCharacteristics = () => {
    const characteristics = technicalPlaceCharacteristics[selectedPlace.type] || [];
    return (
      <Row gutter={[16, 16]}>
        {characteristics.map(char => {
          const value = editedCharacteristics[char.key];
          
          let inputComponent;
          if (char.type === 'boolean') {
            inputComponent = (
              <Checkbox 
                checked={value || false}
                onChange={(e) => handleCharacteristicChange(char.key, e.target.checked)}
              />
            );
          } else if (char.type === 'select') {
            inputComponent = (
              <Select
                value={value}
                onChange={(val) => handleCharacteristicChange(char.key, val)}
                style={{ width: '100%' }}
              >
                {char.options?.map((opt, idx) => (
                  <Select.Option key={idx} value={idx}>
                    {opt}
                  </Select.Option>
                ))}
              </Select>
            );
          } else if (char.type === 'number') {
            inputComponent = (
              <InputNumber
                value={value}
                onChange={(val) => handleCharacteristicChange(char.key, val)}
                style={{ width: '100%' }}
              />
            );
          } else {
            inputComponent = (
              <Input
                value={value}
                onChange={(e) => handleCharacteristicChange(char.key, e.target.value)}
              />
            );
          }
          
          return (
            <Col span={12} key={char.key}>
              <Form.Item label={char.label} style={{ marginBottom: 8 }}>
                {inputComponent}
              </Form.Item>
            </Col>
          );
        })}
      </Row>
    );
  };

  // Рендер редактируемого оборудования
  const renderEditableEquipment = () => {
    const columns = [
      {
        title: 'Наименование',
        dataIndex: 'name',
        key: 'name',
      },
      {
        title: 'Количество',
        dataIndex: 'quantity',
        key: 'quantity',
        width: 120,
        render: (quantity, record, index) => (
          <InputNumber
            value={quantity}
            onChange={(val) => handleEquipmentQuantityChange(index, val)}
            min={0}
            style={{ width: '100%' }}
          />
        )
      },
      {
        title: 'Ед. изм.',
        dataIndex: 'unit',
        key: 'unit',
        width: 80,
      },
      {
        title: '',
        key: 'actions',
        width: 80,
        render: (_, record, index) => (
          <Space>
            <Popconfirm
              title={record.markedForDeletion ? "Отменить удаление?" : "Пометить на удаление?"}
              onConfirm={() => handleEquipmentDelete(index)}
            >
              <Button 
                type="text" 
                danger={!record.markedForDeletion}
                icon={<DeleteOutlined />}
              />
            </Popconfirm>
          </Space>
        )
      }
    ];

    return (
      <>
        <Table
          dataSource={editedEquipment}
          columns={columns}
          rowKey="id"
          size="small"
          pagination={false}
          rowClassName={(record) => record.markedForDeletion ? 'ant-table-row-deleted' : ''}
          style={{ marginBottom: 12 }}
        />
        <div style={{ 
          background: '#f5f5f5', 
          padding: 12, 
          borderRadius: 8,
          display: 'flex',
          gap: 12
        }}>
          <Button
            type="default"
            icon={<ToolOutlined />}
            onClick={() => setAddItemModalOpen(true)}
            size="large"
          >
            Добавить поштучно
          </Button>
          <Button
            type="default"
            icon={<AppstoreAddOutlined />}
            onClick={() => setAddSetModalOpen(true)}
            size="large"
          >
            Добавить набор
          </Button>
        </div>
      </>
    );
  };

  return (
    <Modal
      title={null}
      open={open}
      onCancel={onClose}
      footer={null}
      width="100%"
      style={{ top: 0 }}
      styles={{ body: { padding: 0, height: 'calc(100vh - 2px)' }, mask: { backdropFilter: 'blur(2px)' } }}
    >
      {/* Шапка формы */}
      <div style={{ 
        background: '#f5f5f5', 
        padding: '16px 24px',
        borderBottom: '1px solid #e8e8e8'
      }}>
        <Row justify="space-between" align="middle" style={{ marginBottom: 16 }}>
          <Col>
            <Button 
              icon={<ArrowLeftOutlined />} 
              onClick={onClose}
            >
              Назад
            </Button>
          </Col>
          <Col>
            <Space size="large">
              <Text type="secondary">
                <FileTextOutlined /> Лист: <Text strong>{sheet.number}</Text>
              </Text>
              <Text type="secondary">
                <UserOutlined /> Исполнитель: <Text strong>{sheet.executor?.name || '-'}</Text>
              </Text>
              {/* <Text type="secondary">
                <CalendarOutlined /> Сдан: <Text strong>{sheet.submittedAt || '-'}</Text>
              </Text> */}
            </Space>
          </Col>
        </Row>
        
        <Row align="middle" gutter={16}>
          <Col flex="none">
            <Text strong>Проверено:</Text>
          </Col>
          <Col flex="auto">
            <Progress 
              percent={progressPercent} 
              format={() => `${inspectedCount} / ${totalCount}`}
              size="small"
              style={{ marginBottom: 0 }}
            />
          </Col>
        </Row>
      </div>

      {/* Область проверки - Master-Detail Layout */}
      <div style={{ display: 'flex', height: 'calc(100% - 180px)' }}>
        {/* Левая колонка - Список технических мест */}
        <div style={{ 
          width: '20%', 
          borderRight: '1px solid #e8e8e8',
          overflow: 'auto',
          padding: 16,
          background: '#fafafa'
        }}>
          <Title level={5} style={{ marginBottom: 16 }}>Технические места</Title>
          {technicalPlaces.length === 0 ? (
            <Empty description="Нет технических мест" />
          ) : (
            <Space direction="vertical" style={{ width: '100%' }} size="small">
              {technicalPlaces.map(place => (
                <div style={{ 
                  position: 'relative',
                  cursor: 'pointer',
                  borderLeft: `3px solid ${getPlaceStatusColor(place)}`,
                  background: selectedPlace?.id === place.id ? '#e6f7ff' : '#fff',
                  borderRadius: 8,
                  transition: 'all 0.2s'
                }}
                onClick={() => {
                  if (isEditing) {
                    handleSave();
                  }
                  setSelectedPlace(place);
                }}
              >
                <Card
                  key={place.id}
                  size="small"
                  hoverable
                  style={{ 
                    cursor: 'pointer',
                    background: 'transparent',
                    border: 'none'
                  }}
                  bodyStyle={{ padding: 12, paddingRight: place.isVerified ? 36 : 12 }}
                >
                  <div>
                    <Text strong style={{ display: 'block', fontSize: 13 }}>
                      {place.name}
                    </Text>
                    <Text type="secondary" style={{ fontSize: 11 }}>
                      {technicalPlaceTypes[place.type]}
                    </Text>
                  </div>
                </Card>
                {place.isVerified && (
                  <CheckCircleOutlined 
                    style={{ 
                      position: 'absolute', 
                      right: 12, 
                      top: '50%', 
                      transform: 'translateY(-50%)',
                      color: '#52c41a',
                      fontSize: 18
                    }} 
                  />
                )}
              </div>
              ))}
            </Space>
          )}
        </div>

        {/* Правая колонка - Карточка выбранного места */}
        <div style={{ 
          width: '80%', 
          overflow: 'auto',
          padding: 24,
          background: '#fff'
        }}>
          {selectedPlace ? (
            <Card
              extra={
                isEditing ? (
                  <Space>
                    <Button onClick={handleEditCancel}>Отмена</Button>
                    <Button type="primary" icon={<SaveOutlined />} onClick={handleSave}>
                      Сохранить
                    </Button>
                  </Space>
                ) : (
                  <Space>
                    <Button icon={<EditOutlined />} onClick={handleEditStart}>
                      Редактировать
                    </Button>
                    <Button 
                      type={selectedPlace?.isVerified ? 'primary' : 'default'}
                      icon={<CheckCircleOutlined />}
                      onClick={handleToggleVerified}
                      style={selectedPlace?.isVerified ? { background: '#52c41a', borderColor: '#52c41a' } : {}}
                    >
                      Проверено
                    </Button>
                  </Space>
                )
              }
            >
              <Row justify="space-between" align="top" style={{ marginBottom: 16 }}>
                <Col>
                  <Space align="center">
                    <EnvironmentOutlined style={{ fontSize: 24, color: '#1890ff' }} />
                    <div>
                      <Title level={4} style={{ margin: 0 }}>{selectedPlace.name}</Title>
                      <Text type="secondary">{selectedPlace.dispatchName}</Text>
                    </div>
                  </Space>
                </Col>
                <Col>
                  <Space>
                    {selectedPlace.isVerified && (
                      <Tag color="green">Проверено</Tag>
                    )}
                  </Space>
                </Col>
              </Row>

              <Divider style={{ margin: '16px 0' }} />

              {/* Характеристики */}
              <Title level={5}>Характеристики</Title>
              <Card size="small" style={{ marginBottom: 24 }}>
                {isEditing ? (
                  renderEditableCharacteristics()
                ) : (
                  <Row gutter={[16, 8]}>
                    {Object.entries(editedCharacteristics).map(([key, value]) => {
                      if (value === undefined || value === null || value === '') return null;
                      const char = technicalPlaceCharacteristics[selectedPlace.type]?.find(c => c.key === key);
                      const label = char?.label || key;
                      let displayValue = value;
                      if (char?.type === 'boolean') {
                        displayValue = value ? 'Да' : 'Нет';
                      } else if (char?.type === 'select') {
                        displayValue = char.options?.[value] || value;
                      }
                      return (
                        <Col span={12} key={key}>
                          <Text type="secondary">{label}: </Text>
                          <Text>{displayValue}</Text>
                        </Col>
                      );
                    })}
                  </Row>
                )}
              </Card>

              {/* Оборудование */}
              <Title level={5}>Материалы и оборудование</Title>
              <Card size="small" style={{ marginBottom: 24, background: '#fafafa' }}>
                {isEditing ? (
                  renderEditableEquipment()
                ) : (
                  <>
                    {editedEquipment.length > 0 ? (
                      <ul style={{ margin: 0, paddingLeft: 20 }}>
                        {editedEquipment.map((item, index) => (
                          <li key={index} style={{ marginBottom: 4, textDecoration: item.markedForDeletion ? 'line-through' : 'none' }}>
                            <Text>{item.name}</Text>
                            <Text type="secondary"> — {item.quantity} {item.unit}</Text>
                            {item.markedForDeletion && (
                              <Tag color="error" style={{ marginLeft: 8 }}>На удаление</Tag>
                            )}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <Text type="secondary">Оборудование не добавлено</Text>
                    )}
                  </>
                )}
              </Card>

              {/* Фотографии */}
              <Title level={5}>Фотографии</Title>
              {selectedPlace.photos && selectedPlace.photos.length > 0 ? (
                <Image.PreviewGroup>
                  <Space size="small" wrap>
                    {selectedPlace.photos.map((photo, index) => (
                      <Image 
                        key={index}
                        src={photo.url || photo}
                        width={120}
                        height={120}
                        style={{ objectFit: 'cover', borderRadius: 8 }}
                      />
                    ))}
                  </Space>
                </Image.PreviewGroup>
              ) : (
                <Text type="secondary">Фотографии отсутствуют</Text>
              )}

              {/* Комментарий исполнителя */}
              {selectedPlace.comment && (
                <>
                  <Title level={5} style={{ marginTop: 24 }}>Комментарий исполнителя</Title>
                  <Card size="small" style={{ background: '#fffbe6' }}>
                    <Text>{selectedPlace.comment}</Text>
                  </Card>
                </>
              )}

            </Card>
          ) : (
            <Empty description="Выберите техническое место из списка слева" />
          )}
        </div>
      </div>

      {/* Подвал с кнопками */}
      <div style={{ 
        padding: '16px 24px',
        borderTop: '1px solid #e8e8e8',
        background: '#f5f5f5',
        display: 'flex',
        justifyContent: 'flex-end',
        gap: 12
      }}>
        <Button 
          danger
          onClick={() => onReturn(sheet)}
        >
          Отклонить лист
        </Button>
        <Button 
          type="primary"
          onClick={() => onApprove(sheet)}
        >
          Утвердить лист
        </Button>
      </div>

      <style>{`
        .ant-table-row-deleted {
          opacity: 0.5;
          text-decoration: line-through;
        }
      `}</style>

      {/* Add Item Modal (for individual equipment/material) */}
      <Modal
        title="Добавить оборудование/материал"
        open={addItemModalOpen}
        onCancel={() => {
          setAddItemModalOpen(false);
          setNewEquipment({ name: '', quantity: 1, unit: 'шт' });
        }}
        footer={[
          <Button key="cancel" onClick={() => {
            setAddItemModalOpen(false);
            setNewEquipment({ name: '', quantity: 1, unit: 'шт' });
          }}>
            Отмена
          </Button>,
          <Button key="add" type="primary" icon={<PlusOutlined />} onClick={() => {
            handleAddEquipment();
          }}>
            Добавить
          </Button>
        ]}
      >
        <div style={{ padding: '16px 0' }}>
          <Text type="secondary" style={{ display: 'block', marginBottom: 16 }}>
            Введите название, количество и единицу измерения для нового оборудования или материала
          </Text>
          <Space direction="vertical" style={{ width: '100%' }}>
            <Input 
              placeholder="Название (например: Изолятор ПС-120)"
              value={newEquipment.name}
              onChange={e => setNewEquipment({ ...newEquipment, name: e.target.value })}
              size="large"
            />
            <Space>
              <Text>Кол-во:</Text>
              <InputNumber
                min={1}
                value={newEquipment.quantity}
                onChange={v => setNewEquipment({ ...newEquipment, quantity: v || 1 })}
                size="large"
                style={{ width: 80 }}
              />
              <Text>Ед. изм.:</Text>
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
            </Space>
          </Space>
        </div>
      </Modal>

      {/* Add Set Modal (for equipment sets) */}
      <Modal
        title="Выберите набор оборудования и материалов"
        open={addSetModalOpen}
        onCancel={() => setAddSetModalOpen(false)}
        footer={null}
        width={600}
      >
        <div style={{ padding: '16px 0' }}>
          <Text type="secondary" style={{ display: 'block', marginBottom: 16 }}>
            Выберите набор из списка. Все материалы и оборудование из набора будут добавлены к техническому месту.
          </Text>
          {getAvailableEquipmentSets().length === 0 ? (
            <Text type="warning">Нет доступных наборов для данного типа технического места</Text>
          ) : (
            <div style={{ maxHeight: 400, overflowY: 'auto' }}>
              {getAvailableEquipmentSets().map(set => (
                <Card
                  key={set.id}
                  size="small"
                  style={{ marginBottom: 12, cursor: 'pointer' }}
                  onClick={() => handleAddEquipmentFromSet(set)}
                  hoverable
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div style={{ flex: 1 }}>
                      <Text strong style={{ fontSize: 14 }}>{set.name}</Text>
                      <div style={{ marginTop: 8 }}>
                        {set.materials.slice(0, 3).map((mat, idx) => (
                          <Text key={idx} type="secondary" style={{ display: 'block', fontSize: 12 }}>
                            • {mat.name} ({mat.quantity} {mat.unit})
                          </Text>
                        ))}
                        {set.materials.length > 3 && (
                          <Text type="secondary" style={{ fontSize: 12 }}>
                            ... и ещё {set.materials.length - 3} поз.
                          </Text>
                        )}
                      </div>
                    </div>
                    <Button type="link" icon={<PlusOutlined />}>
                      Добавить
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </Modal>
    </Modal>
  );
};

export default ReviewInventorySheetModal;