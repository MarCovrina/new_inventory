import React, { useState, useEffect } from 'react';
import { 
  Table, Tag, Button, Space, Card, Typography, 
  Input, Select, Empty, Statistic, Row, Col, Badge, Tooltip
} from 'antd';
import { 
  PlusOutlined, EyeOutlined, EditOutlined, 
  CheckCircleOutlined, ClockCircleOutlined, 
  ExclamationCircleOutlined, SyncOutlined, SearchOutlined,
  FileTextOutlined, UserOutlined, EnvironmentOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { getSheets, deleteSheet, acceptSheet, MOCK_OBJECTS, MOCK_USERS } from '../../store/storage';
import { STATUS_CONFIG } from '../../types';

const { Title, Text } = Typography;
const { Option } = Select;

const SheetRegistry = ({ currentUser }) => {
  const navigate = useNavigate();
  const [sheets, setSheets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: '',
    status: 'all',
    objectType: 'all',
    executor: 'all'
  });

  useEffect(() => {
    loadSheets();
  }, []);

  const loadSheets = () => {
    setLoading(true);
    const data = getSheets();
    setSheets(data);
    setLoading(false);
  };

  const handleDelete = (id) => {
    deleteSheet(id);
    loadSheets();
  };

  const handleAccept = (id) => {
    acceptSheet(id, currentUser.id);
    loadSheets();
  };

  const filteredSheets = sheets.filter(sheet => {
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      const matchNumber = sheet.number.toLowerCase().includes(searchLower);
      const matchObject = sheet.object?.name.toLowerCase().includes(searchLower);
      if (!matchNumber && !matchObject) return false;
    }
    if (filters.status !== 'all' && sheet.status !== filters.status) return false;
    if (filters.objectType !== 'all' && sheet.object?.type !== filters.objectType) return false;
    if (filters.executor !== 'all' && sheet.executorId !== filters.executor) return false;
    return true;
  });

  const getStatusTag = (status) => {
    const config = STATUS_CONFIG[status];
    return <Tag color={config.color}>{config.label}</Tag>;
  };

  // Статистика
  const stats = {
    total: sheets.length,
    draft: sheets.filter(s => s.status === 'draft').length,
    inWork: sheets.filter(s => s.status === 'in_work').length,
    underReview: sheets.filter(s => s.status === 'under_review').length,
    approved: sheets.filter(s => s.status === 'approved').length,
    returned: sheets.filter(s => s.status === 'returned').length
  };

  const columns = [
    {
      title: 'Номер',
      dataIndex: 'number',
      key: 'number',
      render: (text, record) => (
        <Button 
          type="link" 
          onClick={() => navigate(`/sheet/${record.id}`)}
          style={{ padding: 0, fontWeight: 500 }}
        >
          {text}
        </Button>
      ),
      width: 140
    },
    {
      title: 'Объект',
      dataIndex: ['object', 'name'],
      key: 'objectName',
      render: (text, record) => (
        <div>
          <div style={{ fontWeight: 500 }}>{text}</div>
          <Text type="secondary" style={{ fontSize: 12 }}>{record.object?.address}</Text>
        </div>
      ),
      ellipsis: true
    },
    {
      title: 'Исполнитель',
      dataIndex: ['executor', 'name'],
      key: 'executor',
      render: (text) => text || '-',
      width: 150
    },
    {
      title: 'Статус',
      dataIndex: 'status',
      key: 'status',
      render: (status) => getStatusTag(status),
      width: 160
    },
    {
      title: 'Тех. места',
      dataIndex: 'techLocations',
      key: 'techLocations',
      render: (locations, record) => {
        const inspected = locations.filter(l => l.inspected).length;
        return (
          <Tooltip title={`Осмотрено: ${inspected} / ${locations.length}`}>
            <div className="tech-locations-progress">
              <ProgressBar 
                current={inspected} 
                total={locations.length} 
                inspected={inspected === locations.length}
              />
            </div>
          </Tooltip>
        );
      },
      width: 100
    },
    {
      title: 'Дата',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date) => new Date(date).toLocaleDateString('ru-RU'),
      width: 100
    },
    {
      title: 'Действия',
      key: 'actions',
      render: (_, record) => (
        <Space size="small">
          <Tooltip title="Просмотр">
            <Button
              type="text"
              icon={<EyeOutlined />}
              onClick={() => navigate(`/sheet/${record.id}`)}
            />
          </Tooltip>
          {currentUser?.role === 'master' && record.status === 'draft' && (
            <Tooltip title="Редактировать">
              <Button
                type="text"
                icon={<EditOutlined />}
                onClick={() => navigate(`/sheet/${record.id}/edit`)}
              />
            </Tooltip>
          )}
          {currentUser?.role === 'executor' && record.status === 'draft' && record.executorId === currentUser.id && (
            <Tooltip title="Принять в работу">
              <Button
                type="text"
                icon={<CheckCircleOutlined />}
                onClick={() => handleAccept(record.id)}
                style={{ color: '#52c41a' }}
              />
            </Tooltip>
          )}
        </Space>
      ),
      width: 100
    }
  ];

  const ProgressBar = ({ current, total, inspected }) => {
    const percentage = total > 0 ? (current / total) * 100 : 0;
    return (
      <div className="progress-bar-container">
        <div 
          className="progress-bar-fill"
          style={{ 
            width: `${percentage}%`,
            backgroundColor: inspected ? '#52c41a' : '#1890ff'
          }}
        />
        <span className="progress-bar-text">{current}/{total}</span>
      </div>
    );
  };

  return (
    <div className="sheet-registry">
      {/* Статистика */}
      <Row gutter={[16, 16]} className="stats-row">
        <Col xs={12} sm={8} md={4}>
          <Card className="stat-card">
            <Statistic 
              title="Всего" 
              value={stats.total} 
              prefix={<FileTextOutlined />} 
            />
          </Card>
        </Col>
        <Col xs={12} sm={8} md={4}>
          <Card className="stat-card">
            <Statistic 
              title="Черновик" 
              value={stats.draft} 
              valueStyle={{ color: '#8c8c8c' }}
            />
          </Card>
        </Col>
        <Col xs={12} sm={8} md={4}>
          <Card className="stat-card">
            <Statistic 
              title="В работе" 
              value={stats.inWork} 
              valueStyle={{ color: '#1890ff' }}
              prefix={<SyncOutlined spin />}
            />
          </Card>
        </Col>
        <Col xs={12} sm={8} md={4}>
          <Card className="stat-card">
            <Statistic 
              title="На проверке" 
              value={stats.underReview} 
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
        <Col xs={12} sm={8} md={4}>
          <Card className="stat-card">
            <Statistic 
              title="Возвращено" 
              value={stats.returned} 
              valueStyle={{ color: '#ff4d4f' }}
              prefix={<ExclamationCircleOutlined />}
            />
          </Card>
        </Col>
        <Col xs={12} sm={8} md={4}>
          <Card className="stat-card">
            <Statistic 
              title="Согласовано" 
              value={stats.approved} 
              valueStyle={{ color: '#52c41a' }}
              prefix={<CheckCircleOutlined />}
            />
          </Card>
        </Col>
      </Row>

      {/* Фильтры */}
      <Card className="filters-card">
        <Row gutter={[16, 16]} align="middle">
          <Col xs={24} sm={24} md={8}>
            <Input
              placeholder="Поиск по номеру или объекту"
              prefix={<SearchOutlined />}
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              allowClear
            />
          </Col>
          <Col xs={12} sm={8} md={4}>
            <Select
              style={{ width: '100%' }}
              value={filters.status}
              onChange={(value) => setFilters({ ...filters, status: value })}
            >
              <Option value="all">Все статусы</Option>
              <Option value="draft">Черновик</Option>
              <Option value="in_work">В работе</Option>
              <Option value="under_review">На проверке</Option>
              <Option value="returned">Возвращен</Option>
              <Option value="approved">Согласовано</Option>
            </Select>
          </Col>
          <Col xs={12} sm={8} md={4}>
            <Select
              style={{ width: '100%' }}
              value={filters.objectType}
              onChange={(value) => setFilters({ ...filters, objectType: value })}
            >
              <Option value="all">Все типы объектов</Option>
              <Option value="line">ЛЭП</Option>
              <Option value="substation">Подстанция</Option>
              <Option value="transformer_substation">ТП</Option>
              <Option value="distribution_point">РП</Option>
            </Select>
          </Col>
          <Col xs={12} sm={8} md={4}>
            <Select
              style={{ width: '100%' }}
              value={filters.executor}
              onChange={(value) => setFilters({ ...filters, executor: value })}
            >
              <Option value="all">Все исполнители</Option>
              {MOCK_USERS.filter(u => u.role === 'executor').map(user => (
                <Option key={user.id} value={user.id}>{user.name}</Option>
              ))}
            </Select>
          </Col>
        </Row>
      </Card>

      {/* Таблица */}
      <Card className="table-card">
        <Table
          columns={columns}
          dataSource={filteredSheets}
          rowKey="id"
          loading={loading}
          locale={{
            emptyText: (
              <Empty
                description="Нет листов инвентаризации"
                image={Empty.PRESENTED_IMAGE_SIMPLE}
              >
                {currentUser?.role === 'master' && (
                  <Button 
                    type="primary" 
                    icon={<PlusOutlined />}
                    onClick={() => navigate('/create')}
                  >
                    Создать лист инвентаризации
                  </Button>
                )}
              </Empty>
            )
          }}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total, range) => `${range[0]}-${range[1]} из ${total}`
          }}
          scroll={{ x: 800 }}
        />
      </Card>
    </div>
  );
};

export default SheetRegistry;
