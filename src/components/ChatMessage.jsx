import React, { useRef, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import { MarkdownParagraph } from './Markdown';
import { colorFromText, setBrightness, getDateTimeString } from '../core/utils';
import { selectIsDarkMode } from '../store/selectors/gui';
import { parseParagraph } from '../core/MarkdownParser';

function ChatMessage({ name, uid, country, msg, ts, openCm }) {
  const isDarkMode = useSelector(selectIsDarkMode);
  const refEmbed = useRef();

  const [avatar, setAvatar] = useState("/tile.png");
  const [isVip, setIsVip] = useState(false);

  useEffect(() => {
    if (name === 'info' || name === 'event') return;
    fetch(`/api/chatuserapi?id=${uid}`)
      .then(res => res.json())
      .then(data => {
        if (data?.basic?.avatar) setAvatar(data.basic.avatar);
        setIsVip(!!data?.basic?.isVip);
      })
      .catch(err => console.error("Avatar fetch error:", err));
  }, [uid, name]);

  const isInfo = (name === 'info');
  const isEvent = (name === 'event');

  const pArray = parseParagraph(msg);

  // Inline style
  const styles = {
    msgcont: {
      display: 'flex',
      flexDirection: isInfo || isEvent ? 'column' : 'row', // info/event column
      alignItems: isInfo || isEvent ? 'flex-start' : 'flex-start',
      width: '100%',
      position: 'relative',
      padding: 4,
      margin: 0,
    },
    chatavatar: {
      width: 32,
      height: 32,
      borderRadius: '50%',
      marginRight: 8,
      flexShrink: 0,
      display: isInfo || isEvent ? 'none' : 'block', // info/event gizle
    },
    msgRight: {
      display: 'flex',
      flexDirection: 'column',
      width: '100%',
    },
    messageHeader: {
      display: isInfo || isEvent ? 'none' : 'flex', // info/event gizle
      alignItems: 'center',
      marginBottom: 2,
      gap: 6,
    },
    chatname: {
      fontWeight: 700,
      fontSize: 12,
      color: setBrightness(colorFromText(name), isDarkMode),
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      background: '#eaf0ff',
      borderRadius: 5,
      padding: '2px 8px',
      display: 'flex',
      alignItems: 'center',
      gap: 6,
      cursor: 'pointer',
    },
    chatflag: {
      width: 20,
      height: 20,
      borderRadius: 3,
    },
    messageBodyContainer: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      width: '100%',
      marginTop: 2,
    },
    messageBody: {
      flex: 1,
      fontSize: 14,
      color: isInfo ? '#007bff' : isEvent ? '#ff7f50' : '#222', // özel renkler
      fontWeight: 600,
      lineHeight: 1.4,
      wordWrap: 'break-word',
    },
    chatts: {
      fontSize: 8,
      color: '#8a99b3',
      opacity: 0.7,
      fontWeight: 400,
      marginLeft: 8,
      whiteSpace: 'nowrap',
      flexShrink: 0,
    },
    vipTag: {
      color: '#FFD700',
      fontWeight: 'bold',
      textShadow: '0 0 4px #FFD700AA',
      marginLeft: 4,
    },
  };

  return (
    <li className="chatmsg">
      <div style={styles.msgcont}>
        {/* Avatar (gizle info/event) */}
        <img style={styles.chatavatar} src={avatar} alt="avatar" title={name} />

        <div style={styles.msgRight}>
          {/* İsim ve bayrak (gizle info/event) */}
          <div style={styles.messageHeader}>
            <span
              style={styles.chatname}
              onClick={(event) => openCm(event.clientX, event.clientY, name, uid)}
            >
              {name}
              {isVip && <span style={styles.vipTag}>[VIP]</span>}
            </span>
            <img style={styles.chatflag} src={`/cf/${country}.gif`} alt="" title={country} />
          </div>

          {/* Mesaj ve timestamp */}
          <div style={styles.messageBodyContainer}>
            <div style={styles.messageBody}>
              <MarkdownParagraph refEmbed={refEmbed} pArray={pArray} />
            </div>
            <span style={styles.chatts}>{getDateTimeString(ts)}</span>
          </div>
        </div>
      </div>
    </li>
  );
}

export default React.memo(ChatMessage);
