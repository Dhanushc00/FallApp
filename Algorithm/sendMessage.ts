import { SendDirectSms } from 'react-native-send-direct-sms';
export const sendSms = (phoneNumber: string, message: string, router: any) => {
        SendDirectSms(phoneNumber, message)
        .then(response => {
          router.dismissAll();
          console.log('SMS sent successfully');
          router.replace('/');
        })
        .catch(error => {
          router.dismissAll();
          router.replace('/');
          console.error('Error sending SMS:', error);
        });

}
