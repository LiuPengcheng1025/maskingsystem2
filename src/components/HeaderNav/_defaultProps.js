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
        path: '/1',
        name: <span style={{ color: 'white', }}>Information Entry</span>,
        icon: <img src={logo1} style={{ width: '20px', height: '20px' }} alt="Information Entry" />, 
      },
      {
        path: '/2',
        name: <span style={{ color: 'white', }}>Information Query</span>,
        icon: <img src={logo2} style={{ width: '20px', height: '20px' }} alt="Information Query" />, 
      },
      // {
      //   path: '/3',
      //   name: <span style={{ color: 'white', }}>Other Function 1</span>,
      //   icon: <img src={logo3} style={{ width: '20px', height: '20px' }} alt="Other Function 1" />, 
      // },
      // {
      //   path: '/4',
      //   name: <span style={{ color: 'white', }}>Other Function 2</span>,
      //   icon: <img src={logo4} style={{ width: '20px', height: '20px' }} alt="Other Function 2" />, 
      // },
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