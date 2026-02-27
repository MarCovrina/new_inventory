import React, { useState } from 'react';
import { 
  Form, Input, Select, Button, Card, Typography, 
  Space, Divider, List, Checkbox, Alert, Transfer
} from 'antd';
import { 
  ArrowLeftOutlined, SaveOutlined, 
  EnvironmentOutlined, UserOutlined, FileTextOutlined 
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { createSheet, getAllObjects, MOCK_USERS, generateInitialTechLocations } from '../../store/storage';
import { OBJECT_TYPE_CONFIG } from '../../types';

const { Title, Text } = Typography;
const { Option } = Select;

const CreateSheet = ({ currentUser }) => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [selectedObject, setSelectedObject] = useState(null);
  const [selectedTechLocations, setSelectedTechLocations] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  const objects = getAllObjects();
  const executors = MOCK_USERS.filter(u => u.role === 'executor');

  // Получаем технические места для выбранного объекта
  const availableTechLocations = selectedObject 
    ? generateInitialTechLocations(selectedObject.id, selectedObject.type)
    : [];

  const handleObjectChange = (objectId) => {
    const obj = objects.find(o => o.id === objectId);
    setSelectedObject(obj);
    setSelectedTechLocations([]);
    form.setFieldValue('selectedTechLocations', []);
  };

  const handleSubmit = async (values) => {
    setSubmitting(true);
    try {
      const sheet = createSheet(
        values.objectId,
        values.executorId,
        currentUser.id,
        values.selectAllTechLocations ? undefined : values.selectedTechLocations
      );
      navigate(`/sheet/${sheet.id}`);
    } catch (error) {
      console.error('Error creating sheet:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleSelectAllTechLocations = (checked) => {
    if (checked) {
      setSelectedTechLocations(availableTechLocations.map(tl => tl.id));
      form.setFieldValue('selectedTechLocations', availableTechLocations.map(tl => tl.id));
    } else {
      setSelectedTechLocations([]);
      form.setFieldValue('selectedTechLocations', []);
    }
  };

  const handleTechLocationChange = (checkedValues) => {
    setSelectedTechLocations(checkedValues);
  };

  return (
    <div className="create-sheet">
      <Button 
        type="text" 
        icon={<ArrowLeftOutlined />} 
        onClick={() => navigate('/')}
        style={{ marginBottom: 16 }}
      >
        Назад к реестру
      </Button>

      <Card className="create-card">
        <Title level={4}>
          <FileTextOutlined /> Создание листа инвентаризации
        </Title>
        <Text type="secondary">
          Заполните данные для создания нового листа инвентаризации
        </Text>

        <Divider />

        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={{
            selectAllTechLocations: true
          }}
        >
          {/* Выбор объекта */}
          <Form.Item
            name="objectId"
            label="Объект для инвентаризации"
            rules={[{ required: true, message: 'Выберите объект' }]}
          >
            <Select
              placeholder="Выберите объект"
              size="large"
              onChange={handleObjectChange}
              showSearch
              optionFilterProp="children"
            >
              {objects.map(obj => (
                <Option key={obj.id} value={obj.id}>
                  <Space>
                    <EnvironmentOutlined />
                    <span>{obj.name}</span>
                    <Text type="secondary">({OBJECT_TYPE_CONFIG[obj.type].label})</Text>
                  </Space>
                </Option>
              ))}
            </Select>
          </Form.Item>

          {selectedObject && (
            <Alert
              message={selectedObject.name}
              description={
                <div>
                  <div>Тип: {OBJECT_TYPE_CONFIG[selectedObject.type].label}</div>
                  {selectedObject.address && <div>Адрес: {selectedObject.address}</div>}
                  {selectedObject.description && <div>Описание: {selectedObject.description}</div>}
                </div>
              }
              type="info"
              showIcon
              style={{ marginBottom: 24 }}
            />
          )}

          {/* Выбор исполнителя */}
          <Form.Item
            name="executorId"
            label="Исполнитель"
            rules={[{ required: true, message: 'Выберите исполнителя' }]}
          >
            <Select
              placeholder="Выберите исполнителя"
              size="large"
              showSearch
              optionFilterProp="children"
            >
              {executors.map(executor => (
                <Option key={executor.id} value={executor.id}>
                  <Space>
                    <UserOutlined />
                    <span>{executor.name}</span>
                  </Space>
                </Option>
              ))}
            </Select>
          </Form.Item>

          {/* Выбор технических мест */}
          {selectedObject && (
            <Form.Item
              label="Технические места"
              required
            >
              <div className="tech-locations-select">
                <Checkbox
                  checked={selectedTechLocations.length === availableTechLocations.length}
                  onChange={(e) => handleSelectAllTechLocations(e.target.checked)}
                  style={{ marginBottom: 16 }}
                >
                  Все технические места ({availableTechLocations.length})
                </Checkbox>

                <Form.Item
                  name="selectedTechLocations"
                  valuePropName="value"
                  style={{ marginBottom: 0 }}
                >
                  <Checkbox.Group
                    value={selectedTechLocations}
                    onChange={handleTechLocationChange}
                  >
                    <List
                      size="small"
                      bordered
                      dataSource={availableTechLocations}
                      style={{ maxHeight: 300, overflow: 'auto' }}
                      renderItem={(item) => (
                        <List.Item>
                          <Checkbox value={item.id}>
                            {item.name} ({item.type})
                          </Checkbox>
                        </List.Item>
                      )}
                    />
                  </Checkbox.Group>
                </Form.Item>

                {selectedTechLocations.length > 0 && selectedTechLocations.length < availableTechLocations.length && (
                  <Text type="secondary" style={{ marginTop: 8, display: 'block' }}>
                    Выбрано: {selectedTechLocations.length} из {availableTechLocations.length} технических мест
                  </Text>
                )}
              </div>
            </Form.Item>
          )}

          <Divider />

          {/* Кнопки */}
          <Form.Item>
            <Space>
              <Button 
                type="primary" 
                htmlType="submit" 
                icon={<SaveOutlined />}
                loading={submitting}
                disabled={!selectedObject}
              >
                Создать лист
              </Button>
              <Button 
                onClick={() => navigate('/')}
              >
                Отмена
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default CreateSheet;
