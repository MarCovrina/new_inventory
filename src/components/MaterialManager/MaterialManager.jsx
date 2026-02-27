import React, { useState } from 'react';
import { 
  Table, Button, Modal, Form, InputNumber, Select, 
  Space, Tag, Popconfirm, Typography, Card, Empty, message 
} from 'antd';
import { 
  PlusOutlined, DeleteOutlined, EditOutlined, 
  ToolOutlined, InfoCircleOutlined 
} from '@ant-design/icons';
import { MATERIAL_TYPE_CONFIG, TECH_LOCATION_TYPE_CONFIG } from '../../types';

const { Text } = Typography;
const { Option } = Select;

const MaterialManager = ({ 
  materials = [], 
  onChange, 
  techLocationType,
  disabled = false,
  techLocationName = ''
}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [editingMaterial, setEditingMaterial] = useState(null);
  const [form] = Form.useForm();

  // Получаем доступные типы материалов для данного типа технического места
  const availableMaterialTypes = techLocationType 
    ? TECH_LOCATION_TYPE_CONFIG[techLocationType]?.availableMaterials || []
    : Object.keys(MATERIAL_TYPE_CONFIG);

  const handleAdd = () => {
    setEditingMaterial(null);
    form.resetFields();
    setModalVisible(true);
  };

  const handleEdit = (material) => {
    setEditingMaterial(material);
    form.setFieldsValue(material);
    setModalVisible(true);
  };

  const handleDelete = (materialId) => {
    const newMaterials = materials.filter(m => m.id !== materialId);
    onChange(newMaterials);
  };

  const handleSubmit = (values) => {
    const materialConfig = MATERIAL_TYPE_CONFIG[values.type];
    
    if (editingMaterial) {
      // Редактирование
      const newMaterials = materials.map(m => 
        m.id === editingMaterial.id 
          ? { ...m, ...values, unit: materialConfig.unit }
          : m
      );
      onChange(newMaterials);
    } else {
      // Добавление
      const newMaterial = {
        id: Date.now().toString(),
        type: values.type,
        name: materialConfig.label,
        quantity: values.quantity,
        unit: materialConfig.unit,
        addedDuringInventory: true
      };
      onChange([...materials, newMaterial]);
    }
    
    setModalVisible(false);
    form.resetFields();
  };

  const columns = [
    {
      title: 'Тип',
      dataIndex: 'type',
      key: 'type',
      render: (type) => MATERIAL_TYPE_CONFIG[type]?.label || type,
      width: 150
    },
    {
      title: 'Количество',
      dataIndex: 'quantity',
      key: 'quantity',
      render: (qty, record) => `${qty} ${record.unit}`,
      width: 100
    },
    {
      title: 'Статус',
      dataIndex: 'addedDuringInventory',
      key: 'addedDuringInventory',
      render: (added) => added 
        ? <Tag color="blue">Добавлен при инвентаризации</Tag>
        : <Tag>Исходный</Tag>,
      width: 180
    },
    {
      title: 'Действия',
      key: 'actions',
      render: (_, record) => (
        <Space>
          {!disabled && (
            <>
              <Button 
                type="text" 
                icon={<EditOutlined />} 
                onClick={() => handleEdit(record)}
              />
              <Popconfirm
                title="Удалить материал?"
                onConfirm={() => handleDelete(record.id)}
                okText="Да"
                cancelText="Нет"
              >
                <Button 
                  type="text" 
                  icon={<DeleteOutlined style={{ color: '#ff4d4f' }} />} 
                />
              </Popconfirm>
            </>
          )}
        </Space>
      ),
      width: 100
    }
  ];

  return (
    <div className="material-manager">
      {!disabled && (
        <div className="material-actions" style={{ marginBottom: 16 }}>
          <Button 
            type="primary" 
            icon={<PlusOutlined />}
            onClick={handleAdd}
          >
            Добавить материал/оборудование
          </Button>
        </div>
      )}

      {materials.length > 0 ? (
        <Table
          columns={columns}
          dataSource={materials}
          rowKey="id"
          pagination={false}
          size="small"
        />
      ) : (
        <Card>
          <Empty 
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description={
              disabled 
                ? "Нет материалов и оборудования" 
                : "Нажмите 'Добавить материал' для добавления оборудования"
            }
          >
            {!disabled && (
              <Button 
                type="primary" 
                icon={<PlusOutlined />}
                onClick={handleAdd}
              >
                Добавить материал/оборудование
              </Button>
            )}
          </Empty>
        </Card>
      )}

      <Modal
        title={editingMaterial ? 'Редактирование материала' : 'Добавление материала'}
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
        width={400}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={{
            quantity: 1
          }}
        >
          <Form.Item
            name="type"
            label="Тип материала/оборудования"
            rules={[{ required: true, message: 'Выберите тип' }]}
          >
            <Select
              placeholder="Выберите тип"
              disabled={!!editingMaterial}
              showSearch
              optionFilterProp="children"
            >
              {availableMaterialTypes.map(type => (
                <Option key={type} value={type}>
                  {MATERIAL_TYPE_CONFIG[type].label}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="quantity"
            label="Количество"
            rules={[{ required: true, message: 'Введите количество' }]}
          >
            <InputNumber 
              min={1} 
              max={9999}
              style={{ width: '100%' }} 
            />
          </Form.Item>

          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">
                {editingMaterial ? 'Сохранить' : 'Добавить'}
              </Button>
              <Button onClick={() => setModalVisible(false)}>
                Отмена
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default MaterialManager;
