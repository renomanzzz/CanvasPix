import React, { useState, useEffect } from 'react';
import { requestUserInfo, requestUpdateProfile } from '../store/actions/fetch';
import { useSelector } from 'react-redux';
import { t } from 'ttag';

const Profile = () => {
  const [userData, setUserData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [bio, setBio] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const currentUser = useSelector(state => state.user);

  const isOnline = (lastActivity) => {
    if (!lastActivity) return false;
    const lastActivityTime = new Date(lastActivity).getTime();
    const currentTime = new Date().getTime();
    const fiveMinutes = 5 * 60 * 1000; // 5 minutes in milliseconds
    return (currentTime - lastActivityTime) < fiveMinutes;
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleString();
  };

  useEffect(() => {
    const watchedProfileId = sessionStorage.getItem('watchedprofileid');
    const profileId = watchedProfileId;

    if (watchedProfileId) {
      sessionStorage.removeItem('watchedprofileid');
    }

    const fetchUserData = async () => {
      try {
        setIsLoading(true);
        const response = await requestUserInfo(profileId);
        setUserData(response);
        setBio(response.basic.bio || '');
        setError(null);
      } catch (err) {
        setError('Failed to load user data');
        console.error('Error fetching user data:', err);
      } finally {
        setIsLoading(false);
      }
    };

    if (profileId) {
      fetchUserData();

      // Set up periodic refresh every 30 seconds
      const refreshInterval = setInterval(fetchUserData, 30000);

      // Cleanup interval on component unmount
      return () => clearInterval(refreshInterval);
    }
  }, []);

  const handleBioSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      const response = await requestUpdateProfile({ bio });
      if (response.success) {
        setUserData(prev => ({
          ...prev,
          basic: {
            ...prev.basic,
            bio: bio
          }
        }));
        setIsEditing(false);
        setError(null);
      } else if (response.errors) {
        setError(response.errors[0]);
      }
    } catch (err) {
      setError('Failed to update bio');
      console.error('Error updating bio:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const profileContainerStyle = {
    maxWidth: '800px',
    margin: '0 auto',
    padding: '24px',
    backgroundColor: 'rgba(30, 30, 40, 0.95)',
    borderRadius: '16px',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
    backdropFilter: 'blur(8px)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    color: 'rgba(255, 255, 255, 0.9)',
  };

  const profileHeaderStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '24px',
    marginBottom: '32px',
    padding: '20px',
    backgroundColor: 'rgba(100, 100, 255, 0.1)',
    borderRadius: '12px',
    position: 'relative',
  };

  const avatarContainerStyle = {
    position: 'relative',
    width: '120px',
    height: '120px',
  };

  const avatarStyle = {
    width: '100%',
    height: '100%',
    borderRadius: '50%',
    border: '4px solid rgba(255, 255, 255, 0.2)',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
  };

  const onlineIndicatorStyle = {
    position: 'absolute',
    bottom: '8px',
    right: '8px',
    width: '16px',
    height: '16px',
    backgroundColor: '#4CAF50',
    borderRadius: '50%',
    border: '2px solid rgba(30, 30, 40, 0.95)',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
  };

  const profileTitleStyle = {
    flex: 1,
  };

  const nameStyle = {
    fontSize: '28px',
    fontWeight: 'bold',
    margin: '0 0 8px 0',
    color: 'rgba(255, 255, 255, 0.95)',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  };

  const flagStyle = {
    width: '24px',
    height: '24px',
    borderRadius: '4px',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
  };

  const verifiedBadgeStyle = {
    color: '#4CAF50',
    fontSize: '20px',
    marginLeft: '8px',
  };

  const profileStatusStyle = {
    fontSize: '14px',
    color: 'rgba(255, 255, 255, 0.7)',
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  };

  const lastSeenStyle = {
    fontSize: '12px',
    color: 'rgba(255, 255, 255, 0.5)',
  };

  const bioSectionStyle = {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: '12px',
    padding: '20px',
    marginBottom: '24px',
  };

  const bioTextareaStyle = {
    width: '100%',
    minHeight: '100px',
    padding: '12px',
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '8px',
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: '14px',
    resize: 'vertical',
    marginBottom: '12px',
  };

  const buttonStyle = {
    padding: '8px 16px',
    borderRadius: '6px',
    border: 'none',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500',
    transition: 'all 0.2s ease',
  };

  const saveButtonStyle = {
    ...buttonStyle,
    backgroundColor: 'rgba(100, 100, 255, 0.8)',
    color: 'white',
    marginRight: '8px',
  };

  const cancelButtonStyle = {
    ...buttonStyle,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    color: 'rgba(255, 255, 255, 0.9)',
  };

  const editButtonStyle = {
    ...buttonStyle,
    backgroundColor: 'rgba(100, 100, 255, 0.2)',
    color: 'rgba(255, 255, 255, 0.9)',
  };

  const statsSectionStyle = {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: '12px',
    padding: '20px',
    marginBottom: '24px',
  };

  const statsGridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '16px',
    marginTop: '16px',
  };

  const statItemStyle = {
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    padding: '16px',
    borderRadius: '8px',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  };

  const statLabelStyle = {
    fontSize: '14px',
    color: 'rgba(255, 255, 255, 0.6)',
  };

  const statValueStyle = {
    fontSize: '24px',
    fontWeight: 'bold',
    color: 'rgba(255, 255, 255, 0.9)',
  };

  const badgesSectionStyle = {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: '12px',
    padding: '20px',
    marginBottom: '24px',
  };

  const badgesGridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
    gap: '16px',
    marginTop: '16px',
  };

  const badgeItemStyle = {
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    padding: '12px',
    borderRadius: '8px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '8px',
  };

  const badgeImageStyle = {
    width: '64px',
    height: '64px',
    borderRadius: '8px',
  };

  const badgeInfoStyle = {
    textAlign: 'center',
  };

  const badgeNameStyle = {
    fontSize: '14px',
    fontWeight: '500',
    color: 'rgba(255, 255, 255, 0.9)',
  };

  const badgeRarityStyle = {
    fontSize: '12px',
    color: 'rgba(255, 255, 255, 0.6)',
  };

  if (isLoading) {
    return <div style={{ textAlign: 'center', padding: '40px', color: 'rgba(255, 255, 255, 0.7)' }}>{t`Loading...`}</div>;
  }

  if (error) {
    return <div style={{ textAlign: 'center', padding: '40px', color: '#ff4444' }}>{error}</div>;
  }

  if (!userData) {
    return <div style={{ textAlign: 'center', padding: '40px', color: '#ff4444' }}>{t`User not found`}</div>;
  }

  const isOwnProfile = currentUser && currentUser.id === parseInt(userData.basic.id);
  const online = isOnline(userData.basic.lastActivity);
  const lastSeen = userData.basic.lastActivity ? formatDate(userData.basic.lastActivity) : '';
  const joinDate = formatDate(userData.basic.joinDate);
  const lastLogin = formatDate(userData.basic.lastLogin);
  const banExpiration = userData.moderation.banExpiration ? formatDate(userData.moderation.banExpiration) : '';
  const banReason = userData.moderation.banReason || '';

  return (
    <div style={profileContainerStyle}>
      <div style={profileHeaderStyle}>
        <div style={avatarContainerStyle}>
          <img src={userData.basic.avatar} alt={userData.basic.name} style={avatarStyle} />
          {online && <div style={onlineIndicatorStyle} />}
        </div>
        <div style={profileTitleStyle}>
          <h1 style={nameStyle}>
            {userData.basic.name}
            {userData.basic.flag && <img src={userData.basic.flag} alt="Country flag" style={flagStyle} />}
            {userData.moderation.isVerified && <span style={verifiedBadgeStyle} title={t`Verified User`}>✓</span>}
          </h1>
          <div style={profileStatusStyle}>
            {online ? t`Online` : t`Offline`}
            {userData.basic.lastActivity && !online && (
              <span style={lastSeenStyle}>
                {t`Last seen`}: {lastSeen}
              </span>
            )}
          </div>
        </div>
      </div>

      <div style={bioSectionStyle}>
        {isOwnProfile ? (
          isEditing ? (
            <form onSubmit={handleBioSubmit}>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                maxLength={500}
                placeholder={t`Write something about yourself...`}
                style={bioTextareaStyle}
              />
              <div>
                <button type="submit" style={saveButtonStyle}>{t`Save`}</button>
                <button type="button" onClick={() => setIsEditing(false)} style={cancelButtonStyle}>{t`Cancel`}</button>
              </div>
            </form>
          ) : (
            <div>
              <p>{userData.basic.bio || t`No bio yet`}</p>
              <button onClick={() => setIsEditing(true)} style={editButtonStyle}>{t`Edit Bio`}</button>
            </div>
          )
        ) : (
          <p>{userData.basic.bio || t`No bio yet`}</p>
        )}
      </div>

      {userData.stats && (
        <div style={statsSectionStyle}>
          <h2>{t`Statistics`}</h2>
          <div style={statsGridStyle}>
            <div style={statItemStyle}>
              <span style={statLabelStyle}>{t`Total Pixels`}</span>
              <span style={statValueStyle}>{userData.stats.totalPixels.toLocaleString()}</span>
            </div>
            <div style={statItemStyle}>
              <span style={statLabelStyle}>{t`Daily Pixels`}</span>
              <span style={statValueStyle}>{userData.stats.dailyPixels.toLocaleString()}</span>
            </div>
            <div style={statItemStyle}>
              <span style={statLabelStyle}>{t`Total Rank`}</span>
              <span style={statValueStyle}>#{userData.stats.totalRank.toLocaleString()}</span>
            </div>
            <div style={statItemStyle}>
              <span style={statLabelStyle}>{t`Daily Rank`}</span>
              <span style={statValueStyle}>#{userData.stats.dailyRank.toLocaleString()}</span>
            </div>
            <div style={statItemStyle}>
              <span style={statLabelStyle}>{t`Total Badges`}</span>
              <span style={statValueStyle}>{userData.stats.totalBadges}</span>
            </div>
          </div>
        </div>
      )}

      {userData.badges && (
        <div style={badgesSectionStyle}>
          <h2>{t`Badges`}</h2>
          {userData.badges.featured && (
            <div style={{ marginBottom: '24px' }}>
              <h3>{t`Featured Badge`}</h3>
              <div style={{ ...badgeItemStyle, flexDirection: 'row', padding: '16px' }}>
                <img src={userData.badges.featured.icon} alt={userData.badges.featured.name} style={{ ...badgeImageStyle, width: '80px', height: '80px' }} />
                <div style={{ ...badgeInfoStyle, textAlign: 'left', marginLeft: '16px' }}>
                  <div style={badgeNameStyle}>{userData.badges.featured.name}</div>
                  <div style={{ color: 'rgba(255, 255, 255, 0.7)', marginBottom: '8px' }}>{userData.badges.featured.description}</div>
                  <div style={badgeRarityStyle}>{userData.badges.featured.rarity}</div>
                </div>
              </div>
            </div>
          )}
          <div style={badgesGridStyle}>
            {userData.badges.all.map(badge => (
              <div key={badge.id} style={badgeItemStyle}>
                <img src={badge.icon} alt={badge.name} style={badgeImageStyle} />
                <div style={badgeInfoStyle}>
                  <div style={badgeNameStyle}>{badge.name}</div>
                  <div style={badgeRarityStyle}>{badge.rarity}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div style={statsSectionStyle}>
        <h3>{t`Account Information`}</h3>
        <div style={statsGridStyle}>
          <div style={statItemStyle}>
            <span style={statLabelStyle}>{t`Join Date`}</span>
            <span style={statValueStyle}>{joinDate}</span>
          </div>
          <div style={statItemStyle}>
            <span style={statLabelStyle}>{t`Last Login`}</span>
            <span style={statValueStyle}>{lastLogin}</span>
          </div>
        </div>
      </div>

      {userData.moderation.banned && (
        <div style={{ ...statsSectionStyle, backgroundColor: 'rgba(255, 68, 68, 0.1)' }}>
          <h3>{t`Account Status`}</h3>
          <div>
            <p style={{ color: '#ff4444', marginBottom: '8px' }}>{t`This account is banned`}</p>
            {userData.moderation.banReason && (
              <p style={{ color: 'rgba(255, 255, 255, 0.7)', marginBottom: '4px' }}>
                {t`Reason`}: {banReason}
              </p>
            )}
            {userData.moderation.banExpiration && (
              <p style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                {t`Expires`}: {banExpiration}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile; 