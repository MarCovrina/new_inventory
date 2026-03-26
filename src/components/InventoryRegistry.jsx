import React, { useState } from 'react';
import { 
  Table, 
  Button, 
  Modal, 
  Form, 
  Select, 
  Space, 
  Tag, 
  Typography, 
  Card,
  Divider,
  Checkbox,
  message 
} from 'antd';
import { PlusOutlined, EyeOutlined, EditOutlined, CarryOutOutlined, DeleteOutlined } from '@ant-design/icons';
import { inventorySheets, inventoryObjects, users, inventorySheetStatuses } from '../data/mockData';
import EditInventorySheetModal from './EditInventorySheetModal';
import ReviewInventorySheetModal from './ReviewInventorySheetModal';

const { Title, Text } = Typography;

const statusColors = {
  'Черновик': 'default',
  'В работе': 'processing',
  'Сдан на проверку': 'warning',
  'Возвращен на доработку': 'error',
  'Согласован': 'success'
};

const InventoryRegistry = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [selectedSheet, setSelectedSheet] = useState(null);
  const [form] = Form.useForm();
  const [sheets, setSheets] = useState(inventorySheets);
  const [jointObjects, setJointObjects] = useState([]);
  const [isObjectSelectModalOpen, setIsObjectSelectModalOpen] = useState(false);
  const [selectedObjectIds, setSelectedObjectIds] = useState([]);

  const handleCreateSheet = (values) => {
    const newSheet = {
      id: sheets.length + 1,
      number: `ИЛ-2026-${String(sheets.length + 1).padStart(3, '0')}`,
      object: inventoryObjects.find(obj => obj.id === values.objectId),
      jointObjects: jointObjects,
      executor: users.find(user => user.id === values.executorId),
      master: users[0], // First user is master
      status: inventorySheetStatuses.DRAFT,
      createdAt: new Date().toISOString().split('T')[0],
      submittedAt: null,
      approvedAt: null,
      technicalPlacesCount: 0,
      inspectedPlacesCount: 0
    };
    
    setSheets([newSheet, ...sheets]);
    setIsModalOpen(false);
    setJointObjects([]);
    form.resetFields();
    message.success('Лист инвентаризации успешно создан');
  };

  const columns = [
    {
      title: '№',
      dataIndex: 'number',
      key: 'number',
      width: 120,
    },
    {
      title: 'Объект',
      dataIndex: 'object',
      key: 'object',
      render: (object) => (
        <Space direction="vertical" size={0}>
          <Text strong>{object.name}</Text>
          <Text type="secondary" style={{ fontSize: 12 }}>{object.type}</Text>
        </Space>
      ),
    },
    {
      title: 'Исполнитель',
      dataIndex: 'executor',
      key: 'executor',
      render: (executor) => executor?.name || '-',
    },
    {
      title: 'Статус',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag color={statusColors[status]}>{status}</Tag>
      ),
    },
    
    {
      title: 'Дата создания',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 120,
    },
    {
      title: 'Действия',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Button 
            type="text" 
            icon={<EyeOutlined />} 
            onClick={() => message.info(`Просмотр листа ${record.number}`)}
          />
          {record.status === inventorySheetStatuses.SUBMITTED ? (
            <Button 
              type="text" 
              icon={<CarryOutOutlined />}
              onClick={() => {
                setSelectedSheet(record);
                setIsReviewModalOpen(true);
              }}
            />
          ) : (
            <Button 
              type="text" 
              icon={<EditOutlined />} 
              disabled={record.status === inventorySheetStatuses.APPROVED}
              onClick={() => {
                setSelectedSheet(record);
                setIsEditModalOpen(true);
              }}
            />
          )}
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      <Card>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <div>
            <Title level={2} style={{ margin: 0 }}>Реестр листов инвентаризации</Title>
            <Text type="secondary">Список всех листов инвентаризации объектов энергоснабжения</Text>
          </div>
          <Button 
            type="primary" 
            icon={<PlusOutlined />} 
            size="large"
            onClick={() => setIsModalOpen(true)}
          >
            Создать новый лист инвентаризации
          </Button>
        </div>

        <Table
          columns={columns}
          dataSource={sheets}
          rowKey="id"
          pagination={{ pageSize: 10 }}
        />
      </Card>

      <Modal
        title="Создание листа инвентаризации"
        open={isModalOpen}
        onCancel={() => {
          setIsModalOpen(false);
          form.resetFields();
          setJointObjects([]);
        }}
        footer={null}
        width={600}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleCreateSheet}
          style={{ marginTop: 24 }}
        >
          <Form.Item
            label="Объект инвентаризации"
            name="objectId"
            rules={[{ required: true, message: 'Выберите объект инвентаризации' }]}
          >
            <Select 
              placeholder="Выберите объект"
              showSearch
              optionFilterProp="children"
            >
              {inventoryObjects.map(obj => (
                <Select.Option key={obj.id} value={obj.id}>
                  <Space direction="vertical" size={0}>
                    <Text>{obj.name}</Text>
                    <Text type="secondary" style={{ fontSize: 12 }}>{obj.type} • {obj.address}</Text>
                  </Space>
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <div style={{ marginBottom: 16 }}>
            <Text strong style={{ display: 'block', marginBottom: 12 }}>Объекты для совместного подвеса</Text>
            {jointObjects.length > 0 && (
              <div style={{ marginBottom: 12 }}>
                {jointObjects.map(obj => (
                  <Card size="small" key={obj.id} style={{ marginBottom: 8 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Space direction="vertical" size={0}>
                        <Text>{obj.name}</Text>
                        <Text type="secondary" style={{ fontSize: 12 }}>{obj.type} • {obj.address}</Text>
                      </Space>
                      <Button 
                        type="text" 
                        danger 
                        icon={<DeleteOutlined />} 
                        onClick={() => setJointObjects(prev => prev.filter(j => j.id !== obj.id))}
                      />
                    </div>
                  </Card>
                ))}
              </div>
            )}
            <Button 

              icon={<PlusOutlined />} 
              onClick={() => {
                setSelectedObjectIds([]);
                setIsObjectSelectModalOpen(true);
              }}
              block
              size="large"
            >
              Добавить
            </Button>
          </div>

          <Form.Item
            label="Исполнитель"
            name="executorId"
            rules={[{ required: true, message: 'Выберите исполнителя' }]}
          >
            <Select 
              placeholder="Выберите исполнителя"
              showSearch
              optionFilterProp="children"
            >
              {users.filter(u => u.role === 'executor').map(user => (
                <Select.Option key={user.id} value={user.id}>
                  <Space direction="vertical" size={0}>
                    <Text>{user.name}</Text>
                    <Text type="secondary" style={{ fontSize: 12 }}>{user.position}</Text>
                  </Space>
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item style={{ marginBottom: 0, marginTop: 24 }}>
            <Space style={{ width: '100%', justifyContent: 'flex-end' }}>
              <Button onClick={() => {
                setIsModalOpen(false);
                form.resetFields();
                setJointObjects([]);
              }}>
                Отмена
              </Button>
              <Button type="primary" htmlType="submit">
                Создать лист инвентаризации
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title="Выбор объектов для совместного подвеса"
        open={isObjectSelectModalOpen}
        onCancel={() => setIsObjectSelectModalOpen(false)}
        onOk={() => {
          const selectedObjs = inventoryObjects.filter(obj => selectedObjectIds.includes(obj.id));
          // Add new objects, avoid duplicates
          setJointObjects(prev => {
            const existingIds = prev.map(p => p.id);
            const newObjs = selectedObjs.filter(obj => !existingIds.includes(obj.id));
            return [...prev, ...newObjs];
          });
          setIsObjectSelectModalOpen(false);
        }}
        okText="Добавить"
        width={500}
      >
        <div style={{ maxHeight: 400, overflowY: 'auto' }}>
          {inventoryObjects.map(obj => (
            <div 
              key={obj.id} 
              style={{ 
                padding: '12px 8px', 
                borderBottom: '1px solid #f0f0f0',
                cursor: 'pointer',
                background: selectedObjectIds.includes(obj.id) ? '#e6f7ff' : 'transparent'
              }}
              onClick={() => {
                setSelectedObjectIds(prev => 
                  prev.includes(obj.id) 
                    ? prev.filter(id => id !== obj.id)
                    : [...prev, obj.id]
                );
              }}
            >
              <Space>
                <Checkbox checked={selectedObjectIds.includes(obj.id)} />
                <Space direction="vertical" size={0}>
                  <Text>{obj.name}</Text>
                  <Text type="secondary" style={{ fontSize: 12 }}>{obj.type} • {obj.address}</Text>
                </Space>
              </Space>
            </div>
          ))}
        </div>
      </Modal>

      <EditInventorySheetModal
        open={isEditModalOpen}
        sheet={selectedSheet}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedSheet(null);
        }}
        onSave={(updatedSheet) => {
          setSheets(prev => prev.map(s => 
            s.id === updatedSheet.id ? { ...s, ...updatedSheet } : s
          ));
          setSelectedSheet(updatedSheet);
        }}
      />

      <ReviewInventorySheetModal
        open={isReviewModalOpen}
        sheet={selectedSheet}
        onClose={() => {
          setIsReviewModalOpen(false);
          setSelectedSheet(null);
        }}
        onApprove={(sheet) => {
          message.success(`Лист ${sheet.number} утверждён`);
          setIsReviewModalOpen(false);
          setSelectedSheet(null);
        }}
        onReturn={(sheet) => {
          message.info(`Лист ${sheet.number} возвращён на доработку`);
          setIsReviewModalOpen(false);
          setSelectedSheet(null);
        }}
      />
    </div>
  );
};

export default InventoryRegistry;
