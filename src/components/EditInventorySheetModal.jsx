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
  message 
} from 'antd';
import { 
  EditOutlined, 
  PlusOutlined, 
  DeleteOutlined, 
  CheckCircleOutlined, 
  ClockCircleOutlined,
  ArrowLeftOutlined 
} from '@ant-design/icons';
import { getTechnicalPlacesByObjectId, technicalPlaceCharacteristics } from '../data/mockData';

const { Title, Text } = Typography;
const { TextArea } = Input;

const TechnicalPlaceCard = ({ place, onClick, isSelected }) => {
  const statusIcon = place.isInspected 
    ? <CheckCircleOutlined style={{ color: '#52c41a' }} /> 
    : <ClockCircleOutlined style={{ color: '#faad14' }} />;

  return (
    <Card
      hoverable
      onClick={() => onClick(place)}
      style={{ 
        borderColor: isSelected ? '#1890ff' : '#d9d9d9',
        backgroundColor: place.isInspected ? '#f6ffed' : '#fffbf0'
      }}
      styles={{ body: { padding: 16 } }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <Text strong style={{ fontSize: 16 }}>{place.name}</Text>
          <br />
          <Tag color="blue">{place.type}</Tag>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {statusIcon}
          <Text type={place.isInspected ? 'success' : 'warning'}>
            {place.isInspected ? 'Осмотрено' : 'Не осмотрено'}
          </Text>
        </div>
      </div>
      {place.comment && (
        <div style={{ marginTop: 8 }}>
          <Text type="secondary" ellipsis style={{ fontSize: 12 }}>
            Комментарий: {place.comment}
          </Text>
        </div>
      )}
    </Card>
  );
};

const TechnicalPlaceForm = ({ place, onSave, onBack }) => {
  const [form] = Form.useForm();
  const [characteristics, setCharacteristics] = useState(place.characteristics || {});
  
  const charDefinitions = technicalPlaceCharacteristics[place.type] || [];

  useEffect(() => {
    form.setFieldsValue({
      ...place.characteristics,
      comment: place.comment || ''
    });
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
      isInspected: true
    });
    message.success('Изменения сохранены');
  };

  const renderCharacteristicField = (char, index) => {
    const commonProps = {
      key: char.key,
      label: char.label,
      name: char.key,
      rules: char.type === 'number' ? [{ type: 'number', message: 'Введите число' }] : []
    };

    switch (char.type) {
      case 'string':
        return (
          <Col span={12} key={char.key}>
            <Form.Item {...commonProps}>
              <Input placeholder={`Введите ${char.label.toLowerCase()}`} />
            </Form.Item>
          </Col>
        );
      case 'number':
        return (
          <Col span={12} key={char.key}>
            <Form.Item {...commonProps}>
              <InputNumber 
                style={{ width: '100%' }} 
                placeholder={`Введите ${char.label.toLowerCase()}`}
              />
            </Form.Item>
          </Col>
        );
      case 'select':
        return (
          <Col span={12} key={char.key}>
            <Form.Item {...commonProps} name={char.key}>
              <Select placeholder="Выберите значение">
                {char.options.map(opt => (
                  <Select.Option key={opt} value={opt}>{opt}</Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
        );
      case 'boolean':
        return (
          <Col span={12} key={char.key}>
            <Form.Item 
              label={char.label} 
              name={char.key} 
              valuePropName="checked"
            >
              <Checkbox />
            </Form.Item>
          </Col>
        );
      default:
        return null;
    }
  };

  return (
    <div>
      <Button 
        icon={<ArrowLeftOutlined />} 
        onClick={onBack}
        style={{ marginBottom: 16 }}
      >
        К списку технических мест
      </Button>

      <Card>
        <Title level={4}>{place.name}</Title>
        <Tag color="blue" style={{ marginBottom: 16 }}>{place.type}</Tag>

        <Divider>Характеристики технического места</Divider>

        <Form
          form={form}
          layout="horizontal"
          onValuesChange={handleValuesChange}
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
        >
          <Row gutter={16}>
            {charDefinitions.map((char, index) => renderCharacteristicField(char, index))}
          </Row>

          <Divider>Комментарий</Divider>

          <Form.Item label="Комментарий" name="comment">
            <TextArea 
              rows={3} 
              placeholder="Введите комментарий к техническому месту"
            />
          </Form.Item>
        </Form>

        <div style={{ marginTop: 24, textAlign: 'right' }}>
          <Space>
            <Button onClick={onBack}>Отмена</Button>
            <Button type="primary" icon={<CheckCircleOutlined />} onClick={handleSave}>
              Сохранить изменения
            </Button>
          </Space>
        </div>
      </Card>
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
      type: technicalPlaceCharacteristics[Object.keys(technicalPlaceCharacteristics)[0]] ? Object.keys(technicalPlaceCharacteristics)[0] : 'Опора',
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
          onBack={handleBackToList}
        />
      );
    }

    return (
      <div>
        <div style={{ marginBottom: 16 }}>
          <Space>
            <Text strong>Объект:</Text>
            <Text>{sheet.object.name}</Text>
            <Tag>{sheet.object.type}</Tag>
          </Space>
        </div>
        <div style={{ marginBottom: 16 }}>
          <Space>
            <Text strong>Исполнитель:</Text>
            <Text>{sheet.executor?.name}</Text>
          </Space>
        </div>
        <div style={{ marginBottom: 24 }}>
          <Space>
            <Text strong>Статус:</Text>
            <Tag color={
              sheet.status === 'Согласован' ? 'success' :
              sheet.status === 'В работе' ? 'processing' :
              sheet.status === 'Сдан на проверку' ? 'warning' :
              sheet.status === 'Возвращен на доработку' ? 'error' : 'default'
            }>
              {sheet.status}
            </Tag>
          </Space>
        </div>

        <Divider>Технические места</Divider>

        <Row gutter={[16, 16]} style={{ maxHeight: '60vh', overflowY: 'auto' }}>
          {technicalPlaces.map(place => (
            <Col xs={24} key={place.id}>
              <TechnicalPlaceCard 
                place={place} 
                onClick={handlePlaceClick}
                isSelected={false}
              />
            </Col>
          ))}
        </Row>

        <div style={{ marginTop: 16, textAlign: 'right' }}>
          <Button 
            type="dashed" 
            icon={<PlusOutlined />} 
            onClick={handleAddPlace}
          >
            Добавить техническое место
          </Button>
        </div>
      </div>
    );
  };

  return (
    <Modal
      title={
        selectedPlace 
          ? `Редактирование: ${selectedPlace.name}` 
          : `Лист инвентаризации ${sheet.number}`
      }
      open={open}
      onCancel={onClose}
      width={900}
      footer={selectedPlace ? null : [
        <Button key="close" onClick={onClose}>
          Закрыть
        </Button>
      ]}
    >
      {renderContent()}
    </Modal>
  );
};

export default EditInventorySheetModal;
