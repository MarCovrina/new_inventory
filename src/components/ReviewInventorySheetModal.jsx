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
  Descriptions,
  Progress,
  Divider,
  Image,
  Empty
} from 'antd';
import { 
  ArrowLeftOutlined, 
  CheckCircleOutlined, 
  ClockCircleOutlined,
  EnvironmentOutlined,
  UserOutlined,
  CalendarOutlined,
  FileTextOutlined
} from '@ant-design/icons';
import { getTechnicalPlacesByObjectId, technicalPlaceCharacteristics, technicalPlaceTypes, inventorySheetStatuses } from '../data/mockData';

const { Title, Text } = Typography;

const ReviewInventorySheetModal = ({ open, sheet, onClose, onApprove, onReturn }) => {
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [technicalPlaces, setTechnicalPlaces] = useState([]);

  useEffect(() => {
    if (open && sheet) {
      // Загружаем технические места для данного листа
      const places = getTechnicalPlacesByObjectId(sheet.object?.id);
      setTechnicalPlaces(places || []);
      
      // Выбираем первое место по умолчанию
      if (places && places.length > 0) {
        setSelectedPlace(places[0]);
      } else {
        setSelectedPlace(null);
      }
    }
  }, [open, sheet]);

  if (!sheet) return null;

  // Прогресс проверки
  const inspectedCount = sheet.inspectedPlacesCount || 0;
  const totalCount = sheet.technicalPlacesCount || 0;
  const progressPercent = totalCount > 0 ? Math.round((inspectedCount / totalCount) * 100) : 0;

  // Статусы технических мест
  const getPlaceStatusIcon = (place) => {
    if (place.isVerified) {
      return <CheckCircleOutlined style={{ color: '#52c41a', fontSize: 16 }} />;
    }
    if (place.isInspected) {
      return <CheckCircleOutlined style={{ color: '#1890ff', fontSize: 16 }} />;
    }
    return <ClockCircleOutlined style={{ color: '#bfbfbf', fontSize: 16 }} />;
  };

  const getPlaceStatusColor = (place) => {
    if (place.isVerified) return '#52c41a';
    if (place.isInspected) return '#1890ff';
    return '#bfbfbf';
  };

  // Рендер характеристик технического места
  const renderCharacteristics = (place) => {
    const characteristics = technicalPlaceCharacteristics[place.type] || [];
    return characteristics.map(char => {
      const value = place.characteristics?.[char.key];
      if (value === undefined || value === null || value === '') return null;
      
      let displayValue = value;
      if (char.type === 'boolean') {
        displayValue = value ? 'Да' : 'Нет';
      } else if (char.type === 'select') {
        displayValue = char.options?.[value] || value;
      }
      
      return (
        <Descriptions.Item key={char.key} label={char.label}>
          {displayValue}
        </Descriptions.Item>
      );
    });
  };

  // Рендер оборудования
  const renderEquipment = (place) => {
    if (!place.equipment || place.equipment.length === 0) {
      return <Text type="secondary">Оборудование не добавлено</Text>;
    }
    
    return (
      <ul style={{ margin: 0, paddingLeft: 20 }}>
        {place.equipment.map((item, index) => (
          <li key={index} style={{ marginBottom: 4 }}>
            <Text>{item.name}</Text>
            <Text type="secondary"> — {item.quantity} {item.unit}</Text>
            {item.markedForDeletion && (
              <Tag color="error" style={{ marginLeft: 8 }}>На удаление</Tag>
            )}
          </li>
        ))}
      </ul>
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
              <Text type="secondary">
                <CalendarOutlined /> Сдан: <Text strong>{sheet.submittedAt || '-'}</Text>
              </Text>
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
        {/* Левая колонка - Список технических мест (1 часть) */}
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
                <Card
                  key={place.id}
                  size="small"
                  hoverable
                  onClick={() => setSelectedPlace(place)}
                  style={{ 
                    cursor: 'pointer',
                    borderLeft: `3px solid ${getPlaceStatusColor(place)}`,
                    background: selectedPlace?.id === place.id ? '#e6f7ff' : '#fff'
                  }}
                  bodyStyle={{ padding: 12 }}
                >
                  <Space>
                    {getPlaceStatusIcon(place)}
                    <div>
                      <Text strong style={{ display: 'block', fontSize: 13 }}>
                        {place.name}
                      </Text>
                      <Text type="secondary" style={{ fontSize: 11 }}>
                        {technicalPlaceTypes[place.type]}
                      </Text>
                    </div>
                  </Space>
                </Card>
              ))}
            </Space>
          )}
        </div>

        {/* Правая колонка - Карточка выбранного места (4 части) */}
        <div style={{ 
          width: '80%', 
          overflow: 'auto',
          padding: 24,
          background: '#fff'
        }}>
          {selectedPlace ? (
            <Card>
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
                    {selectedPlace.isInspected && (
                      <Tag color="blue">Осмотрено</Tag>
                    )}
                    {selectedPlace.isVerified && (
                      <Tag color="green">Проверено</Tag>
                    )}
                  </Space>
                </Col>
              </Row>

              <Divider style={{ margin: '16px 0' }} />

              {/* Характеристики */}
              <Title level={5}>Характеристики</Title>
              <Descriptions 
                column={2} 
                bordered 
                size="small"
                style={{ marginBottom: 24 }}
              >
                {renderCharacteristics(selectedPlace)}
              </Descriptions>

              {/* Оборудование */}
              <Title level={5}>Материалы и оборудование</Title>
              <Card size="small" style={{ marginBottom: 24, background: '#fafafa' }}>
                {renderEquipment(selectedPlace)}
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

              {/* Поле для решения проверяющего */}
              <Divider style={{ margin: '24px 0 16px' }} />
              <Title level={5}>Решение проверяющего</Title>
              <Text type="secondary" style={{ display: 'block', marginBottom: 8 }}>
                Проверьте данные и примите решение по данному техническому месту
              </Text>
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
    </Modal>
  );
};

export default ReviewInventorySheetModal;