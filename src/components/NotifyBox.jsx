import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { FaBell } from 'react-icons/fa';

const NotifyBox = () => {
  const [className, setClassName] = useState('notifybox');
  const notification = useSelector((state) => state.user.notification);

  useEffect(() => {
    if (notification) {
      let newClassName = 'notifybox';
      if (notification && typeof notification !== 'string') {
        if (notification > 0) newClassName += ' green';
        else newClassName += ' red';
      }
      if (newClassName !== className) {
        setClassName(newClassName);
      }
    }
  }, [notification, className]);

  return (
    <div className={(notification) ? `${className} show` : className}>
      <FaBell className="notify-icon" />
      {notification}
    </div>
  );
};

export default React.memo(NotifyBox);

// CSS
const styles = `
.notifybox {
  background-color: rgba(199, 206, 36, .8);
  position: fixed;
  top: 57px;
  left: 50%;
  right: 50%;
  transform: translateX(-50%);
  min-height: 30px;
  width: 330px;
  color: #000;
  font-size: 14px;
  line-height: 30px;
  text-align: center;
  vertical-align: middle;
  border: solid #000;
  border-width: thin;
  z-index: 8;
  transition: visibility .5s, opacity .5s linear;
  visibility: hidden;
  opacity: 0;
  border-radius: 5px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.4);
}

.notifybox.show {
  visibility: visible;
  opacity: 1;
}

.notifybox.green {
  background-color: rgba(76, 175, 80, .8);
}

.notifybox.red {
  background-color: rgba(244, 67, 54, .8);
}

.notify-icon {
  margin-right: 10px;
  color: #fff;
}
`;

// CSS'i sayfaya ekle
const styleSheet = document.createElement('style');
styleSheet.type = 'text/css';
styleSheet.innerText = styles;
document.head.appendChild(styleSheet);
