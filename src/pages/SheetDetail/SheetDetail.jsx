import React, { useState, useEffect } from 'react';
import { 
  Card, Typography, Button, Space, Tag, Divider, 
  Descriptions, Collapse, Form, Input, Modal, 
  message, Badge, Steps, Alert, Tabs, Row, Col, Popconfirm
} from 'antd';
import { 
  ArrowLeftOutlined, SaveOutlined, SendOutlined, 
  CheckCircleOutlined, CloseCircleOutlined, EditOutlined,
  PlusOutlined, DeleteOutlined, EyeOutlined, CameraOutlined,
  UserOutlined, ClockCircleOutlined, FileTextOutlined,
  EnvironmentOutlined, SyncOutlined, RollbackOutlined
} from '@ant-design/icons';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  getSheetById, updateSheet, submitSheet, 
  returnSheet, approveSheet, acceptSheet 
} from '../../store/storage';
import { STATUS_CONFIG, TECH_LOCATION_TYPE_CONFIG } from '../../types';
import PhotoUpload from '../../components/PhotoUpload/PhotoUpload';
import MaterialManager from '../../components/MaterialManager/MaterialManager';

const { Title, Text, Paragraph } = Typography;
const { Panel } = Collapse;
const { TextArea } = Input;

const SheetDetail = ({ currentUser }) => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [sheet, setSheet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [returnModalVisible, setReturnModalVisible] = useState(false);
  const [returnComment, setReturnComment] = useState('');
  const [activeTab, setActiveTab] = useState('info');

  useEffect(() => {
    loadSheet();
  }, [id]);

  const loadSheet = () => {
    setLoading(true);
    const data = getSheetById(id);
    setSheet(data);
    setLoading(false);
  };

  // Проверка прав на редактирование
  const canEdit = () => {
    if (!sheet || !currentUser) return false;
    // Исполнитель может редактировать когда лист в работе или возвращен
    if (currentUser.role === 'executor' && 
        (sheet.status === 'in_work' || sheet.status === 'returned') &&
        sheet.executorId === currentUser.id) {
      return true;
    }
    // Мастер может редактировать когда лист на проверке
    if (currentUser.role === 'master' && sheet.status === 'under_review') {
      return true;
    }
    return false;
  };

  // Проверка прав на принятие в работу
  const canAccept = () => {
    if (!sheet || !currentUser) return false;
    return sheet.status === 'draft' && 
           currentUser.role === 'executor' && 
           sheet.executorId === currentUser.id;
  };

  // Проверка прав на сдачу
  const canSubmit = () => {
    if (!sheet || !currentUser) return false;
    return (sheet.status === 'in_work' || sheet.status === 'returned') &&
           currentUser.role === 'executor' &&
           sheet.executorId === currentUser.id;
  };

  // Проверка прав на возврат
  const canReturn = () => {
    if (!sheet || !currentUser) return false;
    return sheet.status === 'under_review' && currentUser.role === 'master';
  };

  // Проверка прав на согласование
  const canApprove = () => {
    if (!sheet || !currentUser) return false;
    return sheet.status === 'under_review' && currentUser.role === 'master';
  };

  // Проверка можно ли только просматривать
  const isReadOnly = () => {
    if (!sheet) return true;
    return sheet.status === 'approved' || sheet.status === 'under_review';
  };

  const handleAccept = () => {
    const updated = acceptSheet(sheet.id, currentUser.id);
    if (updated) {
      setSheet(updated);
      message.success('Лист принят в работу');
    }
  };

  const handleSubmitForReview = () => {
    const updated = submitSheet(sheet.id);
    if (updated) {
      setSheet(updated);
      message.success('Лист сдан на проверку');
    }
  };

  const handleReturn = () => {
    if (!returnComment.trim()) {
      message.error('Введите комментарий');
      return;
    }
    const updated = returnSheet(sheet.id, returnComment);
    if (updated) {
      setSheet(updated);
      setReturnModalVisible(false);
      setReturnComment('');
      message.success('Лист возвращен на доработку');
    }
  };

  const handleApprove = () => {
    const updated = approveSheet(sheet.id, currentUser.id);
    if (updated) {
      setSheet(updated);
      message.success('Лист согласован');
    }
  };

  const handleSave = () => {
    setSaving(true);
    updateSheet(sheet);
    setTimeout(() => {
      setSaving(false);
      message.success('Изменения сохранены');
    }, 500);
  };

  // Обновление технического места
  const updateTechLocation = (techLocationId, updates) => {
    const newTechLocations = sheet.techLocations.map(tl => 
      tl.id === techLocationId ? { ...tl, ...updates } : tl
    );
    setSheet({ ...sheet, techLocations: newTechLocations });
  };

  // Удаление технического места
  const deleteTechLocation = (techLocationId) => {
    const newTechLocations = sheet.techLocations.filter(tl => tl.id !== techLocationId);
    setSheet({ ...sheet, techLocations: newTechLocations });
  };

  // Добавление нового технического места
  const addTechLocation = () => {
    const newLocation = {
      id: `new-${Date.now()}`,
      objectId: sheet.objectId,
      type: sheet.object?.availableTechLocationTypes[0] || 'support',
      name: `Новое техническое место ${sheet.techLocations.length + 1}`,
      characteristics: TECH_LOCATION_TYPE_CONFIG[sheet.object?.availableTechLocationTypes[0] || 'support'].defaultCharacteristics.map(c => ({ ...c })),
      inspected: false,
      photos: [],
      materials: []
    };
    setSheet({ 
      ...sheet, 
      techLocations: [...sheet.techLocations, newLocation] 
    });
  };

  // Отметить как осмотренное
  const toggleInspected = (techLocationId) => {
    const techLocation = sheet.techLocations.find(tl => tl.id === techLocationId);
    if (techLocation) {
      updateTechLocation(techLocationId, {
        inspected: !techLocation.inspected,
        inspectedAt: !techLocation.inspected ? new Date().toISOString() : undefined
      });
    }
  };

  if (loading || !sheet) {
    return <div>Загрузка...</div>;
  }

  const statusConfig = STATUS_CONFIG[sheet.status];

  const renderSheetInfo = () => (
    <Card className="sheet-info-card">
      <Descriptions title="Информация о листе" column={{ xs: 1, sm: 2, md: 3 }} bordered size="small">
        <Descriptions.Item label="Номер">{sheet.number}</Descriptions.Item>
        <Descriptions.Item label="Статус">
          <Tag color={statusConfig.color}>{statusConfig.label}</Tag>
        </Descriptions.Item>
        <Descriptions.Item label="Объект">
          <Space>
            <EnvironmentOutlined />
            {sheet.object?.name}
          </Space>
        </Descriptions.Item>
        <Descriptions.Item label="Тип объекта">
          {sheet.object?.type}
        </Descriptions.Item>
        <Descriptions.Item label="Исполнитель">
          <Space>
            <UserOutlined />
            {sheet.executor?.name || '-'}
          </Space>
        </Descriptions.Item>
        <Descriptions.Item label="Создатель">
          {sheet.creator?.name || '-'}
        </Descriptions.Item>
        <Descriptions.Item label="Дата создания">
          {new Date(sheet.createdAt).toLocaleDateString('ru-RU')}
        </Descriptions.Item>
        {sheet.acceptedAt && (
          <Descriptions.Item label="Принят в работу">
            {new Date(sheet.acceptedAt).toLocaleDateString('ru-RU')}
          </Descriptions.Item>
        )}
        {sheet.submittedAt && (
          <Descriptions.Item label="Сдан на проверку">
            {new Date(sheet.submittedAt).toLocaleDateString('ru-RU')}
          </Descriptions.Item>
        )}
        {sheet.returnedAt && (
          <Descriptions.Item label="Возвращен">
            {new Date(sheet.returnedAt).toLocaleDateString('ru-RU')}
          </Descriptions.Item>
        )}
        {sheet.returnComment && (
          <Descriptions.Item label="Комментарий при возврате" span={3}>
            {sheet.returnComment}
          </Descriptions.Item>
        )}
        {sheet.approvedAt && (
          <Descriptions.Item label="Согласовано">
            {new Date(sheet.approvedAt).toLocaleDateString('ru-RU')}
          </Descriptions.Item>
        )}
        {sheet.approver && (
          <Descriptions.Item label="Кем согласован">
            {sheet.approver.name}
          </Descriptions.Item>
        )}
      </Descriptions>
    </Card>
  );

  const renderTechLocation = (techLocation) => {
    const canModify = canEdit();
    const typeConfig = TECH_LOCATION_TYPE_CONFIG[techLocation.type];
    
    return (
      <Card 
        key={techLocation.id}
        className={`tech-location-card ${techLocation.inspected ? 'inspected' : ''}`}
        style={{ 
          marginBottom: 16,
          borderColor: techLocation.inspected ? '#52c41a' : undefined,
          backgroundColor: techLocation.inspected ? '#f6ffed' : undefined
        }}
        title={
          <Space>
            <Badge status={techLocation.inspected ? 'success' : 'default'} />
            <span>{techLocation.name}</span>
            <Tag>{typeConfig?.label || techLocation.type}</Tag>
            {techLocation.inspected && (
              <Tag color="green">Осмотрено</Tag>
            )}
          </Space>
        }
        extra={
          canModify && (
            <Space>
              <Button 
                type={techLocation.inspected ? 'default' : 'primary'}
                size="small"
                onClick={() => toggleInspected(techLocation.id)}
              >
                {techLocation.inspected ? 'Отменить осмотр' : 'Отметить осмотренным'}
              </Button>
              <Popconfirm
                title="Удалить техническое место?"
                onConfirm={() => deleteTechLocation(techLocation.id)}
                okText="Да"
                cancelText="Нет"
              >
                <Button 
                  type="text" 
                  danger 
                  icon={<DeleteOutlined />}
                />
              </Popconfirm>
            </Space>
          )
        }
      >
        <Collapse defaultActiveKey={['characteristics']} ghost>
          <Panel header="Характеристики" key="characteristics">
            <Row gutter={[16, 8]}>
              {techLocation.characteristics.map((char, idx) => (
                <Col xs={24} sm={12} md={8} key={idx}>
                  <div className="characteristic-item">
                    <Text type="secondary">{char.label}:</Text>
                    {canModify ? (
                      <Input
                        value={char.value}
                        onChange={(e) => {
                          const newChars = [...techLocation.characteristics];
                          newChars[idx] = { ...char, value: e.target.value };
                          updateTechLocation(techLocation.id, { characteristics: newChars });
                        }}
                        style={{ marginTop: 4 }}
                        size="small"
                      />
                    ) : (
                      <div style={{ fontWeight: 500 }}>
                        {char.value} {char.unit}
                      </div>
                    )}
                  </div>
                </Col>
              ))}
            </Row>
          </Panel>

          <Panel header={`Фотографии (${techLocation.photos.length}/8)`} key="photos">
            <PhotoUpload
              photos={techLocation.photos}
              onChange={(photos) => updateTechLocation(techLocation.id, { photos })}
              maxPhotos={8}
              disabled={!canModify}
              techLocationName={techLocation.name}
            />
          </Panel>

          <Panel header={`Материалы и оборудование (${techLocation.materials.length})`} key="materials">
            <MaterialManager
              materials={techLocation.materials}
              onChange={(materials) => updateTechLocation(techLocation.id, { materials })}
              techLocationType={techLocation.type}
              disabled={!canModify}
              techLocationName={techLocation.name}
            />
          </Panel>

          <Panel header="Комментарий" key="comment">
            {canModify ? (
              <TextArea
                value={techLocation.comment || ''}
                onChange={(e) => updateTechLocation(techLocation.id, { comment: e.target.value })}
                placeholder="Введите комментарий"
                rows={3}
              />
            ) : (
              <Paragraph>
                {techLocation.comment || <Text type="secondary">Нет комментария</Text>}
              </Paragraph>
            )}
          </Panel>
        </Collapse>
      </Card>
    );
  };

  const renderActions = () => (
    <Card className="actions-card">
      <Space wrap>
        {/* Кнопка принятия в работу */}
        {canAccept() && (
          <Button 
            type="primary" 
            icon={<CheckCircleOutlined />}
            onClick={handleAccept}
            size="large"
          >
            Принять в работу
          </Button>
        )}

        {/* Кнопка сохранения (для исполнителя и мастера) */}
        {canEdit() && (
          <Button 
            icon={<SaveOutlined />}
            onClick={handleSave}
            loading={saving}
            size="large"
          >
            Сохранить
          </Button>
        )}

        {/* Кнопка сдачи на проверку */}
        {canSubmit() && (
          <Button 
            type="primary"
            icon={<SendOutlined />}
            onClick={handleSubmitForReview}
            size="large"
          >
            Сдать на проверку
          </Button>
        )}

        {/* Кнопка возврата на доработку */}
        {canReturn() && (
          <Popconfirm
            title="Вернуть лист на доработку?"
            description={
              <TextArea
                placeholder="Введите комментарий"
                value={returnComment}
                onChange={(e) => setReturnComment(e.target.value)}
                rows={2}
                style={{ marginTop: 8 }}
              />
            }
            onConfirm={handleReturn}
            okText="Вернуть"
            cancelText="Отмена"
          >
            <Button 
              danger 
              icon={<RollbackOutlined />}
              size="large"
            >
              Вернуть на доработку
            </Button>
          </Popconfirm>
        )}

        {/* Кнопка согласования */}
        {canApprove() && (
          <Button 
            type="primary"
            icon={<CheckCircleOutlined />}
            onClick={handleApprove}
            size="large"
            style={{ backgroundColor: '#52c41a', borderColor: '#52c41a' }}
          >
            Согласовать
          </Button>
        )}

        {/* Кнопка добавления тех.места */}
        {canEdit() && (
          <Button 
            icon={<PlusOutlined />}
            onClick={addTechLocation}
            size="large"
          >
            Добавить тех.место
          </Button>
        )}
      </Space>
    </Card>
  );

  const inspectedCount = sheet.techLocations.filter(tl => tl.inspected).length;
  const totalCount = sheet.techLocations.length;

  return (
    <div className="sheet-detail">
      <Button 
        type="text" 
        icon={<ArrowLeftOutlined />} 
        onClick={() => navigate('/')}
        style={{ marginBottom: 16 }}
      >
        Назад к реестру
      </Button>

      {/* Заголовок и статус */}
      <div className="sheet-header" style={{ marginBottom: 16 }}>
        <Row justify="space-between" align="middle" wrap>
          <Col>
            <Title level={3} style={{ margin: 0 }}>
              <FileTextOutlined /> Лист инвентаризации {sheet.number}
            </Title>
          </Col>
          <Col>
            <Tag color={statusConfig.color} style={{ fontSize: 14, padding: '4px 12px' }}>
              {statusConfig.label}
            </Tag>
          </Col>
        </Row>
      </div>

      {/* Прогресс осмотра */}
      <Card style={{ marginBottom: 16 }}>
        <Row align="middle" gutter={16}>
          <Col flex="auto">
            <Text>Прогресс осмотра:</Text>
            <div style={{ marginTop: 8 }}>
              <Steps
                current={inspectedCount}
                total={totalCount}
                size="small"
                items={[
                  { title: 'Осмотрено' },
                  { title: 'Осталось' }
                ]}
              />
            </div>
          </Col>
          <Col>
            <Title level={2} style={{ margin: 0, color: '#52c41a' }}>
              {inspectedCount}/{totalCount}
            </Title>
          </Col>
        </Row>
      </Card>

      {/* Информация о листе */}
      {renderSheetInfo()}

      {/* Действия */}
      {renderActions()}

      {/* Список технических мест */}
      <Card 
        title={
          <Space>
            <CameraOutlined />
            Технические места
            <Tag>{sheet.techLocations.length}</Tag>
          </Space>
        }
        style={{ marginTop: 16 }}
      >
        {sheet.techLocations.length > 0 ? (
          sheet.techLocations.map(renderTechLocation)
        ) : (
          <Empty description="Нет технических мест" />
        )}
      </Card>
    </div>
  );
};

export default SheetDetail;
