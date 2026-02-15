import { ModalCard, Button } from '@vkontakte/vkui';
import { Icon28QrCodeOutline } from '@vkontakte/icons';
import QRCode from 'qrcode.react';

interface QrModalProps {
  open: boolean;
  onClose: () => void;
  qrValue: string; // ссылка или текст для QR
}

const QrModal: React.FC<QrModalProps> = ({ open, onClose, qrValue }) => {
  return (
    <ModalCard
      open={open}
      onClose={onClose}
      icon={<Icon28QrCodeOutline />}
      header="Запись к врачу"
      subheader="Отсканируйте QR-код для перехода в приложение Макс"
      actions={
        <Button size="l" mode="secondary" onClick={onClose}>
          Закрыть
        </Button>
      }
    >
      <div style={{ display: 'flex', justifyContent: 'center', padding: '16px 0' }}>
        <QRCode value={qrValue} size={200} />
      </div>
    </ModalCard>
  );
};

export default QrModal;