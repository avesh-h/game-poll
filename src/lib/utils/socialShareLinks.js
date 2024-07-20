import MailIcon from '@mui/icons-material/Mail';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import { Button } from '@mui/material';
import { EmailShareButton, WhatsappShareButton } from 'react-share';

export const socialShareLinks = (copyText, content) => {
  return (
    <>
      <Button variant="contained" sx={{ bgcolor: '#34B7F1' }}>
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
      </Button>
      <Button variant="contained" sx={{ bgcolor: '#25D366' }}>
        <WhatsappShareButton
          url={copyText}
          style={{ display: 'flex', alignItems: 'center' }}
        >
          <WhatsAppIcon sx={{ pr: 0.5 }} />
          {content?.whatsappBtnText}
        </WhatsappShareButton>
      </Button>
    </>
  );
};
