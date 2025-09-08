import React, { useState, useCallback, useEffect } from 'react';
import { useSelector, shallowEqual, useDispatch } from 'react-redux';
import { t } from 'ttag';
import io from 'socket.io-client';
import debounce from 'lodash/debounce';
import { requestResendVerify } from '../store/actions/fetch';
import { FaShoppingBag } from 'react-icons/fa';

import ChangePassword from './ChangePassword';
import ChangeName from './ChangeName';
import ChangeMail from './ChangeMail';
import DeleteAccount from './DeleteAccount';
import SocialSettings from './SocialSettings';
import SetAvatar from './SetAvatar'; // sex
import SetBio from './SetBio';
import { logoutUser } from '../store/actions';
import { requestLogOut } from '../store/actions/fetch';

import { numberToString } from '../core/utils';

const AREAS = {
    CHANGE_NAME: ChangeName,
    CHANGE_MAIL: ChangeMail,
    CHANGE_PASSWORD: ChangePassword,
    DELETE_ACCOUNT: DeleteAccount,
    SOCIAL_SETTINGS: SocialSettings,
    SET_AVATAR: SetAvatar, // sex
    SET_BIO: SetBio,
};

const RANK_TIERS = [
    { name: 'Newbie', requiredPixels: 0, image: '/ranks/newbie.gif' },
    { name: 'Bronze', requiredPixels: 5000, image: '/ranks/bronze.gif' },
    { name: 'Silver', requiredPixels: 25000, image: '/ranks/silver.gif' },
    { name: 'Gold', requiredPixels: 100000, image: '/ranks/gold.gif' },
    { name: 'Platinum', requiredPixels: 500000, image: '/ranks/platinum.gif' },
    { name: 'Diamond', requiredPixels: 1000000, image: '/ranks/diamond.gif' },
    { name: 'Master', requiredPixels: 5000000, image: '/ranks/master.gif' },
    { name: 'Legend', requiredPixels: 10000000, image: '/ranks/legend.gif' }
];

const getCurrentRank = (totalPixels) => 
    RANK_TIERS.reduce((current, tier) => 
        totalPixels >= tier.requiredPixels ? tier : current, 
    RANK_TIERS[0]);

const Stat = ({ text, value, rank }) => (
    <p className="stat">
        <span className="stat-text">{rank ? `${text}: #` : `${text}: `}</span>
        <span className="stat-value">{numberToString(value)}</span>
    </p>
);

const UserAreaContent = ({ targetUserId = null }) => {
    const [area, setArea] = useState(null);
    const [avatar, setAvatar] = useState('https://pixuniversal.xyz/tile.png');
    const [isOnline, setIsOnline] = useState(false);
    const [lastActive, setLastActive] = useState(null);
    const [showSocial, setShowSocial] = useState(false);
    const [showProfile, setShowProfile] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [loading, setLoading] = useState(false);
    const [visibilitySettings, setVisibilitySettings] = useState({
        showOnlineStatus: true,
        showLastSeen: true,
        showPixelCount: true,
        showBadges: true,
        showRank: true
    });
    const [privacySettings, setPrivacySettings] = useState({
        isPrivate: false,
        hideProfile: false,
        hideStats: false,
        hideLastSeen: false,
        hideOnlineStatus: false
    });
    const [editingBio, setEditingBio] = useState('');
    const [isEditingBio, setIsEditingBio] = useState(false);
    const dispatch = useDispatch();
    const logout = useCallback(async () => {
        const ret = await requestLogOut();
        if (ret) {
            dispatch(logoutUser());
        }
    }, [dispatch]);

    const mailreg = useSelector((state) => state.user.mailreg);
    const name = useSelector((state) => state.user.name);
    const userID = useSelector((state) => state.user.id);
    const myFlag = useSelector((state) => state.user.flag);
    let reData = useSelector((state) => state.user.createdAt);
    const stats = useSelector((state) => ({
        totalPixels: state.ranks.totalPixels,
        dailyTotalPixels: state.ranks.dailyTotalPixels,
        ranking: state.ranks.ranking,
        dailyRanking: state.ranks.dailyRanking,
    }), shallowEqual);

    const currentRank = getCurrentRank(stats.totalPixels);
    const nextRank = RANK_TIERS[RANK_TIERS.findIndex(t => t.name === currentRank.name) + 1];
    const rankProgress = nextRank
        ? Math.min(((stats.totalPixels - currentRank.requiredPixels) / (nextRank.requiredPixels - currentRank.requiredPixels)) * 100, 100)
        : 100;

    if (reData) {
        const dateT = new Date(reData);
        reData = dateT.toLocaleString();
    }
    
    const Area = AREAS[area];

    const searchUsers = useCallback(
        debounce(async (query) => {
            if (!query) {
                setSearchResults([]);
                return;
            }
            try {
                setLoading(true);
                const response = await fetch(`/api/users/search?q=${encodeURIComponent(query)}`);
                const data = await response.json();
                setSearchResults(data);
            } catch (error) {
                console.error('Error searching users:', error);
            } finally {
                setLoading(false);
            }
        }, 300),
        []
    );

    useEffect(() => {
        if (searchQuery) {
            searchUsers(searchQuery);
        }
    }, [searchQuery, searchUsers]);

    const fetchUserInfo = async (userId) => {
        try {
            setLoading(true);
            const response = await fetch(`/api/userinfo?id=${userId}`);
            const data = await response.json();
            if (data.avatar) {
                setAvatar(data.avatar);
            }
            setIsOnline(data.basic.status === 'online');
            setLastActive(data.basic.lastActivity);
            setSelectedUser(data);
        } catch (error) {
            console.error('Error fetching user info:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (targetUserId) {
            fetchUserInfo(targetUserId);
        } else if (userID) {
            fetchUserInfo(userID);
        }

        // Set up periodic refresh every 30 seconds
        const refreshInterval = setInterval(() => {
            if (targetUserId) {
                fetchUserInfo(targetUserId);
            } else if (userID) {
                fetchUserInfo(userID);
            }
        }, 300000);

        // Cleanup interval on component unmount
        return () => clearInterval(refreshInterval);
    }, [targetUserId, userID]);

    const getStatusText = () => {
        if (isOnline) {
            return t`Online`;
        }
        if (lastActive) {
            const minutes = Math.floor((new Date() - new Date(lastActive)) / 60000);
            if (minutes < 1) return t`Just now`;
            if (minutes < 60) return t`${minutes} minutes ago`;
            const hours = Math.floor(minutes / 60);
            if (hours < 24) return t`${hours} hours ago`;
            const days = Math.floor(hours / 24);
            return t`${days} days ago`;
        }
        return t`Offline`;
    };

    const styles = {
        container: {
            background: '#1c1c1c',
            borderRadius: '12px',
            padding: '2rem',
            maxWidth: '1200px',
            margin: '2rem auto',
            color: '#fff',
            fontFamily: 'Montserrat, sans-serif',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            overflow: 'hidden'
        },
        profileCard: {
            background: 'linear-gradient(145deg, #2a2a2a, #252525)',
            padding: '1.5rem',
            borderRadius: '12px',
            marginBottom: '1rem',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            border: '1px solid rgba(255, 255, 255, 0.1)'
        },
        avatar: {
            width: '100%',
            borderRadius: '12px',
            marginBottom: '1rem',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.2)',
            transition: 'transform 0.3s ease',
            '&:hover': {
                transform: 'scale(1.02)'
            }
        },
        statusText: {
            color: '#888',
            fontSize: '0.9em',
            marginTop: '0.5rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
        },
        statusIndicator: {
            display: 'inline-block',
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            backgroundColor: isOnline ? '#4CAF50' : '#9e9e9e',
            boxShadow: isOnline ? '0 0 8px #4CAF50' : 'none'
        },
        infoText: {
            color: '#fff',
            margin: '0.5rem 0',
            fontSize: '0.95rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
        },
        infoLabel: {
            color: '#888',
            minWidth: '80px'
        },
        infoValue: {
            color: '#fff',
            fontWeight: '500'
        },
        bioCard: {
            background: 'linear-gradient(145deg, #2a2a2a, #252525)',
            padding: '1.5rem',
            borderRadius: '12px',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            border: '1px solid rgba(255, 255, 255, 0.1)'
        },
        bioHeader: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '1rem',
            paddingBottom: '0.5rem',
            borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
        },
        bioTitle: {
            color: '#fff',
            margin: 0,
            fontSize: '1.2rem',
            fontWeight: '600'
        },
        editButton: {
            padding: '6px 12px',
            background: 'linear-gradient(145deg, #3a3a3a, #2a2a2a)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '6px',
            color: '#fff',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            '&:hover': {
                background: 'linear-gradient(145deg, #4a4a4a, #3a3a3a)',
                transform: 'translateY(-1px)'
            }
        },
        bioText: {
            color: '#ccc',
            margin: 0,
            lineHeight: '1.6',
            fontSize: '0.95rem'
        },
        bioTextarea: {
            width: '100%',
            minHeight: '120px',
            padding: '12px',
            background: '#333',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '8px',
            color: '#fff',
            marginBottom: '1rem',
            fontSize: '0.95rem',
            lineHeight: '1.6',
            resize: 'vertical',
            '&:focus': {
                outline: 'none',
                borderColor: '#4a90e2',
                boxShadow: '0 0 0 2px rgba(74, 144, 226, 0.2)'
            }
        },
        buttonGroup: {
            display: 'flex',
            gap: '0.75rem',
            justifyContent: 'flex-end'
        },
        cancelButton: {
            padding: '8px 16px',
            background: 'linear-gradient(145deg, #444, #333)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '6px',
            color: '#fff',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            '&:hover': {
                background: 'linear-gradient(145deg, #555, #444)',
                transform: 'translateY(-1px)'
            }
        },
        saveButton: {
            padding: '8px 16px',
            background: 'linear-gradient(145deg, #4a90e2, #357abd)',
            border: 'none',
            borderRadius: '6px',
            color: '#fff',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            '&:hover': {
                background: 'linear-gradient(145deg, #5a9fe2, #458bcd)',
                transform: 'translateY(-1px)'
            }
        },
        statsCard: {
            background: 'linear-gradient(145deg, #2a2a2a, #252525)',
            padding: '1.5rem',
            borderRadius: '12px',
            marginBottom: '1rem',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            border: '1px solid rgba(255, 255, 255, 0.1)'
        },
        statsGrid: {
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '1rem'
        },
        statItem: {
            background: 'rgba(255, 255, 255, 0.05)',
            padding: '1rem',
            borderRadius: '8px',
            textAlign: 'center'
        },
        statValue: {
            color: '#4a90e2',
            fontSize: '1.2rem',
            fontWeight: '600',
            marginBottom: '0.25rem'
        },
        statLabel: {
            color: '#888',
            fontSize: '0.9rem'
        },
        badgesCard: {
            background: 'linear-gradient(145deg, #2a2a2a, #252525)',
            padding: '1.5rem',
            borderRadius: '12px',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            border: '1px solid rgba(255, 255, 255, 0.1)'
        },
        badgeGrid: {
            display: 'flex',
            flexWrap: 'wrap',
            gap: '0.75rem'
        },
        badgeItem: {
            background: 'rgba(255, 255, 255, 0.05)',
            padding: '0.75rem',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            transition: 'all 0.3s ease',
            '&:hover': {
                background: 'rgba(255, 255, 255, 0.1)',
                transform: 'translateY(-2px)'
            }
        },
        badgeImage: {
            height: '24px',
            width: '24px',
            objectFit: 'contain'
        },
        badgeName: {
            color: '#fff',
            fontSize: '0.9rem'
        },
        scrollable: {
            overflowY: 'auto',
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
            '&::-webkit-scrollbar': {
                display: 'none'
            }
        },
        nav: {
            display: 'flex',
            gap: '1rem',
            padding: '1rem',
            background: '#1c1c1c',
            borderRadius: '12px',
            marginTop: '1rem',
            flexWrap: 'wrap',
            justifyContent: 'center'
        },
        navLink: {
            color: '#fff',
            cursor: 'pointer',
            padding: '0.75rem 1.25rem',
            borderRadius: '8px',
            background: 'linear-gradient(145deg, #2a2a2a, #252525)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            transition: 'all 0.3s ease',
            fontSize: '0.95rem',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            '&:hover': {
                background: 'linear-gradient(145deg, #3a3a3a, #2a2a2a)',
                transform: 'translateY(-2px)',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)'
            }
        },
        navLinkHover: {
            background: 'linear-gradient(145deg, #3a3a3a, #2a2a2a)',
            transform: 'translateY(-2px)',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)'
        },
        socialButton: {
            color: '#fff',
            cursor: 'pointer',
            padding: '0.75rem 1.25rem',
            borderRadius: '8px',
            background: 'linear-gradient(145deg, #4a90e2, #357abd)',
            border: 'none',
            transition: 'all 0.3s ease',
            fontSize: '0.95rem',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            '&:hover': {
                background: 'linear-gradient(145deg, #5a9fe2, #458bcd)',
                transform: 'translateY(-2px)',
                boxShadow: '0 4px 12px rgba(74, 144, 226, 0.3)'
            }
        },
        tabs: {
            display: 'flex',
            gap: '1rem',
            padding: '1rem',
            background: '#1c1c1c',
            borderRadius: '12px',
            marginBottom: '1rem',
        },
        tab: {
            color: '#fff',
            cursor: 'pointer',
            padding: '0.75rem 1.25rem',
            borderRadius: '8px',
            background: 'linear-gradient(145deg, #2a2a2a, #252525)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            transition: 'all 0.3s ease',
            fontSize: '0.95rem',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            '&:hover': {
                background: 'linear-gradient(145deg, #3a3a3a, #2a2a2a)',
                transform: 'translateY(-2px)',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)'
            }
        },
        activeTab: {
            background: 'linear-gradient(145deg, #3a3a3a, #2a2a2a)',
            transform: 'translateY(-2px)',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)'
        },
        inventoryContainer: {
            padding: '20px',
        },
        inventoryGrid: {
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
            gap: '20px',
        },
        inventoryItem: {
            border: '1px solid #ccc',
            borderRadius: '8px',
            padding: '15px',
            backgroundColor: '#fff',
        },
        itemName: {
            margin: '0 0 10px 0',
            color: '#333',
        },
        itemDescription: {
            margin: '0 0 10px 0',
            color: '#666',
        },
        expiryDate: {
            margin: '5px 0',
            color: '#e74c3c',
            fontSize: '0.9em',
        },
        purchaseDate: {
            margin: '5px 0',
            color: '#7f8c8d',
            fontSize: '0.9em',
        },
        emptyInventory: {
            textAlign: 'center',
            color: '#7f8c8d',
            padding: '40px',
        },
    };

    const renderProfilePopup = () => {
        if (!showProfile || !selectedUser) return null;

        if (privacySettings.hideProfile && selectedUser.basic?.id !== userID) {
            return (
                <>
                    <div className="overlay" onClick={() => setShowProfile(false)} />
                    <div className="profile-popup">
                        <button className="close-button" onClick={() => setShowProfile(false)}>×</button>
                        <div style={{ textAlign: 'center', padding: '20px' }}>
                            <h3 style={{ color: '#fff' }}>This profile is private</h3>
                            <p style={{ color: '#888' }}>This user has chosen to keep their profile private.</p>
                        </div>
                    </div>
                </>
            );
        }

        return (
            <>
                <div className="overlay" onClick={() => setShowProfile(false)} />
                <div className="profile-popup">
                    <button className="close-button" onClick={() => setShowProfile(false)}>×</button>
                    
                    <div className="profile-header">
                        <img 
                            src={selectedUser.basic?.avatar || '/tile.png'} 
                            alt="Profile" 
                            className="profile-avatar-large"
                        />
                        <div className="profile-info">
                            <div className="profile-name">{selectedUser.basic?.name}</div>
                            {!privacySettings.hideOnlineStatus && (
                                <div className="profile-status">
                                    <span className={`status-indicator ${isOnline ? 'online' : ''}`}></span>
                                    {getStatusText()}
                                </div>
                            )}
                            <div style={{ color: '#888', fontSize: '14px' }}>
                                ID: {selectedUser.basic?.id}
                            </div>
                        </div>
                    </div>

                    {!privacySettings.hideStats && visibilitySettings.showPixelCount && (
                        <div className="profile-stats">
                            <div className="stat-card">
                                <div className="stat-value">
                                    {numberToString(selectedUser.stats?.totalPixels || 0)}
                                </div>
                                <div className="stat-label">Total Pixels</div>
                            </div>
                            <div className="stat-card">
                                <div className="stat-value">
                                    {numberToString(selectedUser.stats?.dailyPixels || 0)}
                                </div>
                                <div className="stat-label">Today's Pixels</div>
                            </div>
                            {visibilitySettings.showRank && (
                                <>
                                    <div className="stat-card">
                                        <div className="stat-value">
                                            #{numberToString(selectedUser.stats?.totalRank || 0)}
                                        </div>
                                        <div className="stat-label">Total Rank</div>
                                    </div>
                                    <div className="stat-card">
                                        <div className="stat-value">
                                            #{numberToString(selectedUser.stats?.dailyRank || 0)}
                                        </div>
                                        <div className="stat-label">Daily Rank</div>
                                    </div>
                                </>
                            )}
                        </div>
                    )}

                    {!privacySettings.hideProfile && visibilitySettings.showBadges && selectedUser.badges?.all?.length > 0 && (
                        <div style={{ marginTop: '20px' }}>
                            <h3 style={{ color: '#fff', marginBottom: '10px' }}>Badges</h3>
                            <div className="badge-grid">
                                {selectedUser.badges.all.map((badge) => (
                                    <div key={badge.id} className="badge-item">
                                        <img src={badge.image} alt={badge.name} className="badge-image" />
                                        <span className="badge-name">{badge.name}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {!targetUserId && (
                        <>
                            <div className="visibility-settings">
                                <h3 style={{ color: '#fff', marginBottom: '15px' }}>Visibility Settings</h3>
                                {Object.entries(visibilitySettings).map(([key, value]) => (
                                    <div key={key} className="setting-item">
                                        <span>{key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}</span>
                                        <label className="toggle-switch">
                                            <input
                                                type="checkbox"
                                                checked={value}
                                                onChange={(e) => setVisibilitySettings(prev => ({
                                                    ...prev,
                                                    [key]: e.target.checked
                                                }))}
                                                className="toggle-input"
                                            />
                                            <span className={`toggle-slider ${value ? 'active' : ''}`}></span>
                                        </label>
                                    </div>
                                ))}
                            </div>
                            <div className="privacy-settings">
                                <h3 style={{ color: '#fff', marginBottom: '15px' }}>Privacy Settings</h3>
                                <div className="setting-item">
                                    <span>Private Profile</span>
                                    <label className="toggle-switch">
                                        <input
                                            type="checkbox"
                                            checked={privacySettings.hideProfile}
                                            onChange={() => handlePrivacyToggle('hideProfile')}
                                            className="toggle-input"
                                        />
                                        <span className={`toggle-slider ${privacySettings.hideProfile ? 'active' : ''}`}></span>
                                    </label>
                                </div>
                                <div className="setting-item">
                                    <span>Hide Statistics</span>
                                    <label className="toggle-switch">
                                        <input
                                            type="checkbox"
                                            checked={privacySettings.hideStats}
                                            onChange={() => handlePrivacyToggle('hideStats')}
                                            className="toggle-input"
                                        />
                                        <span className={`toggle-slider ${privacySettings.hideStats ? 'active' : ''}`}></span>
                                    </label>
                                </div>
                                <div className="setting-item">
                                    <span>Hide Last Seen</span>
                                    <label className="toggle-switch">
                                        <input
                                            type="checkbox"
                                            checked={privacySettings.hideLastSeen}
                                            onChange={() => handlePrivacyToggle('hideLastSeen')}
                                            className="toggle-input"
                                        />
                                        <span className={`toggle-slider ${privacySettings.hideLastSeen ? 'active' : ''}`}></span>
                                    </label>
                                </div>
                                <div className="setting-item">
                                    <span>Hide Online Status</span>
                                    <label className="toggle-switch">
                                        <input
                                            type="checkbox"
                                            checked={privacySettings.hideOnlineStatus}
                                            onChange={() => handlePrivacyToggle('hideOnlineStatus')}
                                            className="toggle-input"
                                        />
                                        <span className={`toggle-slider ${privacySettings.hideOnlineStatus ? 'active' : ''}`}></span>
                                    </label>
                                </div>
                                {privacySettings.hideProfile && (
                                    <div className="privacy-warning">
                                        Your profile is now private. Other users will only see your name and ID.
                                    </div>
                                )}
                            </div>
                        </>
                    )}
                </div>
            </>
        );
    };

    const handleUserSelect = async (user) => {
        setSelectedUser(user);
        setShowSocial(false);
        setShowProfile(true);
        await fetchUserInfo(user.id);
    };

    const renderSocialPanel = () => {
        if (!showSocial) return null;

        return (
            <>
                <div className="overlay" onClick={() => setShowSocial(false)} />
                <div className="social-panel">
                    <button className="close-button" onClick={() => setShowSocial(false)}>×</button>
                    <h2 style={{ color: '#fff', marginBottom: '20px' }}>Find Users</h2>
                    <div className="search-container">
                        <input
                            type="text"
                            placeholder="Search users..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="search-input"
                        />
                        <div className="search-results">
                            {searchResults.map((user) => (
                                <div
                                    key={user.id}
                                    className="user-card"
                                    onClick={() => handleUserSelect(user)}
                                >
                                    <img
                                        src={user.avatar || '/tile.png'}
                                        alt=""
                                        className="user-avatar"
                                    />
                                    <div className="user-info">
                                        <div className="user-name">{user.name}</div>
                                        <div className="user-status">
                                            {user.flag && (
                                                <img
                                                    src={`/cf/${user.flag}.gif`}
                                                    alt=""
                                                    style={{ height: '1em', marginRight: '5px' }}
                                                />
                                            )}
                                            ID: {user.id}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </>
        );
    };

    const updatePrivacySettings = async (newSettings) => {
        try {
            const response = await fetch('/api/privacy', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    privacySettings: newSettings
                })
            });

            if (!response.ok) {
                throw new Error('Failed to update privacy settings');
            }

            const data = await response.json();
            setPrivacySettings(data.privacySettings);
            return true;
        } catch (error) {
            console.error('Error updating privacy settings:', error);
            return false;
        }
    };

    const handlePrivacyToggle = async (setting) => {
        const newSettings = {
            ...privacySettings,
            [setting]: !privacySettings[setting]
        };

        const success = await updatePrivacySettings(newSettings);
        if (success) {
            setPrivacySettings(newSettings);
        }
    };

    const handleUpdateBio = async () => {
        try {
            const formData = new FormData();
            formData.append('bio', editingBio);

            const response = await fetch(`${shardOrigin}/api/modtools/bio`, {
                method: 'POST',
                credentials: 'include',
                body: formData
            });

            if (!response.ok) {
                throw new Error('Failed to update bio');
            }

            setIsEditingBio(false);
            setEditingBio('');
            await fetchUserInfo(userID);
        } catch (error) {
            console.error('Error updating bio:', error);
        }
    };

    const messages = useSelector((state) => state.user.messages);

    const requestResendVerify = async () => {
        try {
            const response = await fetch('/api/auth/verify_email', { 
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include'
            });
            if (!response.ok) {
                throw new Error('Failed to resend verification email');
            }
            const data = await response.json();
            if (data.success) {
                alert('Verification email sent!');
            } else {
                throw new Error(data.errors?.[0] || 'Failed to resend verification email');
            }
        } catch (error) {
            console.error('Error resending verification email:', error);
            alert(error.message || 'Failed to resend verification email');
        }
    };

    const [activeTab, setActiveTab] = useState('profile');
    const [inventory, setInventory] = useState([]);

    useEffect(() => {
        if (activeTab === 'inventory' && selectedUser?.id) {
            fetchInventory();
        }
    }, [activeTab, selectedUser]);

    const fetchInventory = async () => {
        setLoading(true);
        try {
            const response = await fetch(`/inventory/${selectedUser.id}`, {
                credentials: 'include'
            });
            const data = await response.json();
            if (data.success) {
                setInventory(data.items);
            }
        } catch (error) {
            console.error('Error fetching inventory:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <div className="user-area-container">
                <div className="user-area-tabs">
                    <button
                        className={`tab-button ${activeTab === 'profile' ? 'active' : ''}`}
                        onClick={() => setActiveTab('profile')}
                    >
                        {t`Profile`}
                    </button>

                </div>

                {activeTab === 'profile' && (
                    <div style={{ display: 'flex', gap: '2rem' }}>
                        <div style={{ flex: '0 0 300px' }}>
                            <div className="profile-card">
                                <img 
                                    src={selectedUser?.basic?.avatar || avatar} 
                                    alt="User Avatar" 
                                    className="profile-avatar"
                                />
                                <div className="status-text">
                                    <span className={`status-indicator ${isOnline ? 'online' : ''}`}></span>
                                    {getStatusText()}
                                </div>
                                <p className="info-text">
                                    <span className="info-label">{t`Id:`}</span>
                                    <span className="info-value">{selectedUser?.basic?.id || userID}</span>
                                </p>
                                <p className="info-text">
                                    <span className="info-label">{t`Name:`}</span>
                                    <span className="info-value">{selectedUser?.basic?.name || name}</span>
                                </p>
                                <p className="info-text">
                                    <span className="info-label">{t`Country:`}</span>
                                    <img
                                        style={{ height: '1em', imageRendering: 'crisp-edges', verticalAlign: 'middle' }}
                                        alt={selectedUser?.basic?.flag || myFlag}
                                        src={`${window.location.origin}/cf/${selectedUser?.basic?.flag || myFlag}.gif`}
                                    />
                                </p>
                                <p className="info-text">
                                    <span className="info-label">{t`Joined:`}</span>
                                    <span className="info-value">
                                        {selectedUser?.basic?.joinDate ? new Date(selectedUser.basic.joinDate).toLocaleString() : reData}
                                    </span>
                                </p>
                            </div>

                            <div className="bio-card">
                                <div className="bio-header">
                                    <h3 className="bio-title">{t`Bio`}</h3>
                                    {!targetUserId && (
                                        <button
                                            onClick={() => setArea('SET_BIO')}
                                            className="edit-button"
                                        >
                                            {t`Edit`}
                                        </button>
                                    )}
                                </div>
                                <p className="bio-text">
                                    {selectedUser?.basic?.bio || t`No bio available`}
                                </p>
                            </div>
                        </div>

                        <div style={{ flex: 1 }}>
                            <div className="stats-card">
                                <h3 className="bio-title">{t`Statistics`}</h3>
                                <div className="stats-grid">
                                    <div className="stat-item">
                                        <div className="stat-value">
                                            {numberToString(selectedUser?.stats?.dailyPixels || stats.dailyTotalPixels)}
                                        </div>
                                        <div className="stat-label">{t`Today's Pixels`}</div>
                                    </div>
                                    <div className="stat-item">
                                        <div className="stat-value">
                                            #{numberToString(selectedUser?.stats?.dailyRank || stats.dailyRanking)}
                                        </div>
                                        <div className="stat-label">{t`Daily Rank`}</div>
                                    </div>
                                    <div className="stat-item">
                                        <div className="stat-value">
                                            {numberToString(selectedUser?.stats?.totalPixels || stats.totalPixels)}
                                        </div>
                                        <div className="stat-label">{t`Total Pixels`}</div>
                                    </div>
                                    <div className="stat-item">
                                        <div className="stat-value">
                                            #{numberToString(selectedUser?.stats?.totalRank || stats.ranking)}
                                        </div>
                                        <div className="stat-label">{t`Total Rank`}</div>
                                    </div>
                                </div>
                            </div>

                            {selectedUser?.badges?.all?.length > 0 && (
                                <div className="badges-card">
                                    <h3 className="bio-title">{t`Badges`}</h3>
                                    <div className="badge-grid">
                                        {selectedUser.badges.all.map((badge) => (
                                            <div key={badge.id} className="badge-item">
                                                <img src={badge.image} alt={badge.name} className="badge-image" />
                                                <span className="badge-name">{badge.name}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                

            </div>
            {!targetUserId && (
                <div className="user-area-nav">
                    <button
                        className="social-button"
                        onClick={() => setShowSocial(true)}
                    >
                        {t`Social`}
                    </button>
                    <span
                        className="nav-link"
                        onClick={logout}
                    >
                        {t`Log out`}
                    </span>
                    <span
                        className="nav-link"
                        onClick={() => setArea('CHANGE_NAME')}
                    >
                        {t`Change Username`}
                    </span>
                    {mailreg && (
                        <React.Fragment>
                            <span
                                className="nav-link"
                                onClick={() => setArea('CHANGE_MAIL')}
                            >
                                {t`Change Mail`}
                            </span>
                            {messages.includes('not_verified') && (
                                <span
                                    className="nav-link"
                                    onClick={() => requestResendVerify()}
                                >
                                    {t`Resend Verification Email`}
                                </span>
                            )}
                        </React.Fragment>
                    )}
                    <span
                        className="nav-link"
                        onClick={() => setArea('CHANGE_PASSWORD')}
                    >
                        {t`Change Password`}
                    </span>
                    <span
                        className="nav-link"
                        onClick={() => setArea('SET_AVATAR')}
                    >
                        {t`Set Avatar`}
                    </span>
                    <span
                        className="nav-link"
                        onClick={() => setArea('SET_BIO')}
                    >
                        {t`Set Bio`}
                    </span>
                    <span
                        className="nav-link"
                        onClick={() => setArea('DELETE_ACCOUNT')}
                    >
                        {t`Delete Account`}
                    </span>
                    <span
                        className="nav-link"
                        onClick={() => setArea('SOCIAL_SETTINGS')}
                    >
                        {t`Social Settings`}
                    </span>
                </div>
            )}
            {renderSocialPanel()}
            {renderProfilePopup()}
            {Area && <Area done={() => setArea(null)} />}
        </>
    );
};

export default React.memo(UserAreaContent);