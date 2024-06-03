import MailIcon from '@mui/icons-material/Mail';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import { EmailShareButton, WhatsappShareButton } from 'react-share';

export const socialShareLinks = (copyText, content) => {
  return (
    <>
      <EmailShareButton
        subject="Game Timing"
        body={copyText}
        url={''}
        style={{
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <MailIcon sx={{ pr: 0.5 }} />
        {content?.emailBtnText}
      </EmailShareButton>
      <WhatsappShareButton
        url={copyText}
        style={{ display: 'flex', alignItems: 'center' }}
      >
        <WhatsAppIcon sx={{ pr: 0.5 }} />
        {content?.whatsappBtnText}
      </WhatsappShareButton>
    </>
  );
};
