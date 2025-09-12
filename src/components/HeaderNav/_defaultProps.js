import logo1 from '../../components/background/c.png';
import logo2 from '../../components/background/d.png';
import logo3 from '../../components/background/3.png';
import logo4 from '../../components/background/4.png';
import logo5 from '../../components/background/5.png';

// eslint-disable-next-line import/no-anonymous-default-export
export default {
  route: {
    path: '/',
    routes: [
     
      {
        path: '/registration_en',
        name: <span style={{ color: 'white', }}>registration</span>,
        // icon: <img src={logo3} style={{ width: '20px', height: '20px' }} alt="registration" />, 
      },
      {
        path: '/payment_en',
        name: <span style={{ color: 'white', }}>payment</span>,
        // icon: <img src={logo4} style={{ width: '20px', height: '20px' }} alt="payment" />, 
      },
      {
        path: '/registration_ch',
        name: <span style={{ color: 'white', }}>挂号</span>,
      },
      {
        path: '/payment_ch',
        name: <span style={{ color: 'white', }}>支付</span>,
        // icon: <img src={logo4} style={{ width: '20px', height: '20px' }} alt="payment" />, 
      },
      {
        path: '/registration_ala',
        name: <span style={{ color: 'white', }}>تسجيل</span>,
        // icon: <img src={logo3} style={{ width: '20px', height: '20px' }} alt="registration" />, 
      },
      {
        path: '/payment_ala',
        name: <span style={{ color: 'white', }}>دفع</span>,
        // icon: <img src={logo4} style={{ width: '20px', height: '20px' }} alt="payment" />, 
      },
      // {
      //   path: '/5',
      //   name: <span style={{ color: 'white', }}>Other Function 3</span>,
      //   icon: <img src={logo5} style={{ width: '20px', height: '20px' }} alt="Other Function 3" />, 
      // },
      
      
    ],
  },
  location: {
    pathname: '/',
  },
  
};