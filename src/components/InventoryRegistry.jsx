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
  message 
} from 'antd';
import { PlusOutlined, EyeOutlined, EditOutlined } from '@ant-design/icons';
import { inventorySheets, inventoryObjects, users, inventorySheetStatuses } from '../data/mockData';
import EditInventorySheetModal from './EditInventorySheetModal';

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
  const [selectedSheet, setSelectedSheet] = useState(null);
  const [form] = Form.useForm();
  const [sheets, setSheets] = useState(inventorySheets);

  const handleCreateSheet = (values) => {
    const newSheet = {
      id: sheets.length + 1,
      number: `ИЛ-2026-${String(sheets.length + 1).padStart(3, '0')}`,
      object: inventoryObjects.find(obj => obj.id === values.objectId),
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
      title: 'Тех. места',
      key: 'technicalPlaces',
      render: (_, record) => (
        <Text>
          {record.inspectedPlacesCount} / {record.technicalPlacesCount}
        </Text>
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
          <Button 
            type="text" 
            icon={<EditOutlined />} 
            disabled={record.status === inventorySheetStatuses.SUBMITTED || record.status === inventorySheetStatuses.APPROVED}
            onClick={() => {
              setSelectedSheet(record);
              setIsEditModalOpen(true);
            }}
          />
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
    </div>
  );
};

export default InventoryRegistry;
