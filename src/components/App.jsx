/**
 * Main App
 */

import React, { useEffect } from 'react';
import { Provider } from 'react-redux';
import { createRoot } from 'react-dom/client';
import { IconContext } from 'react-icons';
import { useSelector, useDispatch } from 'react-redux';
import { notify } from '../store/actions/thunks';


import Style from './Style';
import CoordinatesBox from './CoordinatesBox';
import CanvasSwitchButton from './buttons/CanvasSwitchButton';
import ShopButton from './buttons/ShopButton';


import OnlineBox from './OnlineBox';
import ChatButton from './buttons/ChatButton';
import Menu from './Menu';
import UI from './UI';
import ExpandMenuButton from './buttons/ExpandMenuButton';
import WindowManager from './WindowManager';
import MusicPlayer from './MusicPlayer';



const iconContextValue = { style: { verticalAlign: 'middle' } };

const App = () => {
  const myuserID = useSelector((state) => state.user.id);
  const dispatch = useDispatch();

  // DUYURU KONTROLÜ İÇİN USEEFFECT
  useEffect(() => {
    const checkAnnouncement = async () => {
      try {
        const resp = await fetch('/api/announce');
        if (resp.ok) {
          const data = await resp.json();
          if (data) {
            const now = new Date();
            const announceTime = new Date(data.createdAt);
            const diffInMinutes = (now - announceTime) / (1000 * 60);
            if (diffInMinutes <= 2) {
              // Eğer targetUserId null ise herkese göster, değilse sadece myuserID ile eşleşen kullanıcıya göster
              if (data.targetUserId === null || data.targetUserId === myuserID) {
                const isPrivate = data.targetUserId !== null;
                dispatch(notify(`${data.title} - ${data.message} - ${isPrivate ? 'Özel Duyuru' : 'Genel Duyuru'} - Gönderen: ${data.createdBy}`));
              }
            }
          }
        }
      } catch (err) {
        console.error('Duyuru kontrolü sırasında hata:', err);
      }
    };

    // İlk kontrol
    checkAnnouncement();

    // Her 9 saniyede bir kontrol et
    const interval = setInterval(checkAnnouncement, 9000);

    return () => clearInterval(interval);
  }, [myuserID, dispatch]);



  return (
    <>
      <Style />
      <IconContext.Provider value={iconContextValue}>
        <CanvasSwitchButton />
        <Menu />
        <ChatButton />
        <OnlineBox />
        <CoordinatesBox />
        <ExpandMenuButton />

        <UI />
        <WindowManager />
        <MusicPlayer />
        <ShopButton />
      </IconContext.Provider>
    </>
  );
};

function renderApp(domParent, store) {
  const root = createRoot(domParent);
  root.render(
    <Provider store={store}>
      <App />
    </Provider>,
  );
}

export default renderApp;
