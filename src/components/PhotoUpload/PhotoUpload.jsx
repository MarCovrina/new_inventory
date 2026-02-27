import React, { useState, useRef } from 'react';
import { 
  Upload, Button, Modal,  
  Carousel, Card, Empty, message, Popconfirm 
} from 'antd';
import { 
  PlusOutlined, DeleteOutlined, EyeOutlined, 
  ZoomInOutlined, UploadOutlined 
} from '@ant-design/icons';

const { Dragger } = Upload;

const PhotoUpload = ({ 
  photos = [], 
  onChange, 
  maxPhotos = 8, 
  disabled = false,
  techLocationName = ''
}) => {
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewIndex, setPreviewIndex] = useState(0);
  const [uploading, setUploading] = useState(false);

  const handleUpload = ({ file, onProgress, onSuccess, onError }) => {
    if (photos.length >= maxPhotos) {
      message.error(`Максимальное количество фотографий: ${maxPhotos}`);
      onError(new Error(`Max photos: ${maxPhotos}`));
      return;
    }

    setUploading(true);

    // Имитация загрузки - в реальном приложении здесь был бы API
    const reader = new FileReader();
    reader.onload = (e) => {
      const newPhoto = {
        id: Date.now().toString(),
        url: e.target.result,
        createdAt: new Date().toISOString()
      };
      onChange([...photos, newPhoto]);
      setUploading(false);
      onSuccess();
    };
    reader.onerror = () => {
      setUploading(false);
      onError(new Error('Ошибка чтения файла'));
    };
    reader.readAsDataURL(file);
  };

  const handleDelete = (photoId) => {
    const newPhotos = photos.filter(p => p.id !== photoId);
    onChange(newPhotos);
  };

  const handlePreview = (index) => {
    setPreviewIndex(index);
    setPreviewVisible(true);
  };

  const uploadProps = {
    name: 'photo',
    multiple: false,
    customRequest: handleUpload,
    showUploadList: false,
    accept: 'image/*',
    disabled: disabled || photos.length >= maxPhotos
  };

  return (
    <div className="photo-upload">
      <div className="photo-grid">
        {photos.map((photo, index) => (
          <Card
            key={photo.id}
            className="photo-card"
            cover={
              <div className="photo-thumbnail" onClick={() => handlePreview(index)}>
                <img src={photo.url} alt={`Фото ${index + 1}`} />
                <div className="photo-overlay">
                  <EyeOutlined />
                </div>
              </div>
            }
            actions={disabled ? [] : [
              <Popconfirm
                title="Удалить фото?"
                onConfirm={() => handleDelete(photo.id)}
                okText="Да"
                cancelText="Нет"
              >
                <DeleteOutlined style={{ color: '#ff4d4f' }} />
              </Popconfirm>
            ]}
          >
            <Card.Meta
              title={`Фото ${index + 1}`}
              description={new Date(photo.createdAt).toLocaleDateString('ru-RU')}
            />
          </Card>
        ))}
        
        {!disabled && photos.length < maxPhotos && (
          <Upload {...uploadProps}>
            <Card className="upload-card">
              <div className="upload-placeholder">
                {uploading ? (
                  <span>Загрузка...</span>
                ) : (
                  <>
                    <PlusOutlined style={{ fontSize: 24, color: '#1890ff' }} />
                    <div>Добавить фото</div>
                    <Text type="secondary">
                      {photos.length}/{maxPhotos}
                    </Text>
                  </>
                )}
              </div>
            </Card>
          </Upload>
        )}
      </div>

      {!disabled && photos.length === 0 && (
        <Empty 
          image={Empty.PRESENTED_IMAGE_SIMPLE} 
          description="Нет фотографий"
          style={{ marginTop: 16 }}
        >
          <Upload {...uploadProps}>
            <Button type="primary" icon={<PlusOutlined />}>
              Добавить фото
            </Button>
          </Upload>
        </Empty>
      )}

      {/* Превью галерея */}
      <Modal
        open={previewVisible}
        footer={null}
        onCancel={() => setPreviewVisible(false)}
        width={800}
        centered
        title={`Фото ${previewIndex + 1} из ${photos.length}`}
      >
        <Carousel 
          initialSlide={previewIndex}
          afterChange={(index) => setPreviewIndex(index)}
        >
          {photos.map((photo, index) => (
            <div key={photo.id} className="gallery-slide">
              <img 
                src={photo.url} 
                alt={`Фото ${index + 1}`} 
                style={{ maxHeight: '70vh', margin: '0 auto', display: 'block' }}
              />
            </div>
          ))}
        </Carousel>
        <div style={{ textAlign: 'center', marginTop: 16 }}>
          <Button 
            type="text" 
            onClick={() => setPreviewIndex(Math.max(0, previewIndex - 1))}
            disabled={previewIndex === 0}
          >
            Предыдущее
          </Button>
          <span style={{ margin: '0 16px' }}>
            {previewIndex + 1} / {photos.length}
          </span>
          <Button 
            type="text" 
            onClick={() => setPreviewIndex(Math.min(photos.length - 1, previewIndex + 1))}
            disabled={previewIndex === photos.length - 1}
          >
            Следующее
          </Button>
        </div>
      </Modal>
    </div>
  );
};

export default PhotoUpload;
