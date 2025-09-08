import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { t } from 'ttag';
import { FaUsers, FaCrown, FaShieldAlt, FaTrophy, FaChartLine, FaUserPlus, FaUserMinus, FaFlag, FaMedal, FaMapMarkerAlt, FaCog, FaBell, FaPlus, FaSignInAlt, FaEdit, FaTrash, FaSpinner } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

const styles = {
  container: {
    padding: '20px',
    color: '#fff',
    fontFamily: 'Arial, sans-serif',
    maxWidth: '1200px',
    margin: '0 auto',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    marginBottom: '20px',
    padding: '15px',
    background: 'rgba(255, 255, 255, 0.05)',
    borderRadius: '10px',
  },
  title: {
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#fff',
    margin: 0,
  },
  factionCard: {
    background: 'rgba(255, 255, 255, 0.05)',
    borderRadius: '10px',
    padding: '20px',
    marginBottom: '20px',
    border: '1px solid #ececec',
    transition: 'all 0.3s ease',
    '&:hover': {
      transform: 'translateY(-5px)',
      boxShadow: '0 5px 15px rgba(0, 0, 0, 0.3)',
    },
  },
  factionInfo: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '15px',
  },
  factionStats: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
    gap: '15px',
    marginTop: '20px',
  },
  statBox: {
    background: 'rgba(255, 255, 255, 0.03)',
    padding: '15px',
    borderRadius: '8px',
    textAlign: 'center',
    transition: 'all 0.3s ease',
    '&:hover': {
      background: 'rgba(255, 255, 255, 0.05)',
    },
  },
  memberList: {
    marginTop: '20px',
  },
  memberItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '10px',
    background: 'rgba(255, 255, 255, 0.02)',
    marginBottom: '5px',
    borderRadius: '5px',
    transition: 'all 0.2s ease',
    '&:hover': {
      background: 'rgba(255, 255, 255, 0.05)',
    },
  },
  button: {
    background: '#4a90e2',
    color: 'white',
    border: 'none',
    padding: '8px 16px',
    borderRadius: '5px',
    cursor: 'pointer',
    transition: 'background 0.2s ease',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    '&:hover': {
      background: '#357abd',
    },
  },
  createFactionForm: {
    background: 'rgba(255, 255, 255, 0.05)',
    padding: '20px',
    borderRadius: '10px',
    marginTop: '20px',
  },
  input: {
    width: '100%',
    padding: '10px',
    marginBottom: '10px',
    background: 'rgba(255, 255, 255, 0.1)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    borderRadius: '5px',
    color: '#fff',
  },
  textarea: {
    width: '100%',
    padding: '10px',
    marginBottom: '10px',
    background: 'rgba(255, 255, 255, 0.1)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    borderRadius: '5px',
    color: '#fff',
    minHeight: '100px',
  },
  achievements: {
    marginTop: '20px',
  },
  achievementItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '10px',
    background: 'rgba(255, 255, 255, 0.02)',
    marginBottom: '5px',
    borderRadius: '5px',
  },
  territory: {
    marginTop: '20px',
    padding: '15px',
    background: 'rgba(255, 255, 255, 0.03)',
    borderRadius: '8px',
  },
  tabs: {
    display: 'flex',
    gap: '10px',
    marginBottom: '20px',
  },
  tab: {
    padding: '10px 20px',
    background: 'rgba(255, 255, 255, 0.1)',
    border: 'none',
    borderRadius: '5px',
    color: '#fff',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    '&:hover': {
      background: 'rgba(255, 255, 255, 0.2)',
    },
  },
  activeTab: {
    background: 'rgba(255, 255, 255, 0.2)',
    boxShadow: '0 0 10px rgba(255, 255, 255, 0.1)',
  },
  notification: {
    position: 'fixed',
    bottom: '20px',
    right: '20px',
    padding: '15px',
    background: '#4a90e2',
    color: 'white',
    borderRadius: '5px',
    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.2)',
    zIndex: 1000,
  },
  modalOverlay: {
    position: 'fixed',
    top: 0, left: 0, right: 0, bottom: 0,
    background: 'rgba(0,0,0,0.55)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
  },
  modalContent: {
    background: '#fff',
    borderRadius: '14px',
    boxShadow: '0 2px 24px rgba(80,90,120,0.13)',
    padding: '32px 24px',
    minWidth: '340px',
    maxWidth: '95vw',
    maxHeight: '90vh',
    overflowY: 'auto',
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  createFactionForm: {
    background: 'none',
    border: 'none',
    boxShadow: 'none',
    padding: '0',
    margin: '0',
    borderRadius: '0',
  },
};

const Faction = () => {
  const [factions, setFactions] = useState([]);
  const [selectedFaction, setSelectedFaction] = useState(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [notification, setNotification] = useState(null);
  const [newFaction, setNewFaction] = useState({
    name: '',
    description: '',
    tag: '',
    color: '#ffffff',
  });
  const userId = useSelector(state => state.user?.id);
  const [loading, setLoading] = useState(true);
  const [myFaction, setMyFaction] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    tag: '',
    description: '',
    color: '#ffffff'
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showEditForm, setShowEditForm] = useState(false);
  const [showInviteForm, setShowInviteForm] = useState(false);
  const [showMembersList, setShowMembersList] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [editFormData, setEditFormData] = useState({
    name: '',
    tag: '',
    description: '',
    color: '#5865f2'
  });
  const [inviteFormData, setInviteFormData] = useState({
    username: ''
  });
  const [promoteLoading, setPromoteLoading] = useState(false);
  const [promoteError, setPromoteError] = useState('');
  const [promoteSuccess, setPromoteSuccess] = useState('');
  const [showTerritoryForm, setShowTerritoryForm] = useState(false);
  const [territoryForm, setTerritoryForm] = useState({
    name: '',
    description: '',
    startX: '',
    startY: '',
    endX: '',
    endY: '',
    color: '#000000'
  });
  const [territoryLoading, setTerritoryLoading] = useState(false);
  const [territoryError, setTerritoryError] = useState('');
  const [territorySuccess, setTerritorySuccess] = useState('');
  const [sortBy, setSortBy] = useState('pixels');

  const userName = useSelector((state) => state.user.name);

  useEffect(() => {
    fetchFactionData();
  }, []);

  const fetchFactionData = async () => {
    try {
      setLoading(true);
      setError('');
      
      // Fetch user's faction
      const myFactionResponse = await fetch('/api/faction/my-faction', {
        credentials: 'include'
      });
      
      if (!myFactionResponse.ok) {
        throw new Error('Failed to fetch user faction');
      }
      
      const myFactionData = await myFactionResponse.json();
      
      if (myFactionData.success) {
        setMyFaction(myFactionData.faction);
      }

      // Fetch all factions
      const factionsResponse = await fetch('/api/faction', {
        credentials: 'include'
      });
      
      if (!factionsResponse.ok) {
        throw new Error('Failed to fetch factions list');
      }
      
      const factionsData = await factionsResponse.json();
      
      if (factionsData.success) {
        setFactions(factionsData.factions || []);
      } else {
        setError(factionsData.message || t`Failed to load factions`);
      }
    } catch (err) {
      console.error('Error fetching faction data:', err);
      setError(err.message || t`An error occurred while loading factions`);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateFaction = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const response = await fetch('/api/faction/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (data.success) {
        setSuccess('Faction created successfully!');
        setShowCreateForm(false);
        setFormData({
          name: '',
          tag: '',
          description: '',
          color: '#ffffff'
        });
        fetchFactionData();
      } else {
        setError(data.errors[0]);
      }
    } catch (err) {
      setError('An error occurred while creating the faction');
    }
  };

  const handleJoinFaction = async (factionId) => {
    try {
      const response = await fetch('/api/faction/join', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ factionId }),
        credentials: 'include'
      });

      const data = await response.json();
      if (data.success) {
        setSuccess('Successfully joined the faction!');
        fetchFactionData();
      } else {
        setError(data.errors[0]);
      }
    } catch (err) {
      setError('An error occurred while joining the faction');
    }
  };

  const handleLeaveFaction = async () => {
    try {
      const response = await fetch('/api/faction/leave', {
        method: 'POST',
        credentials: 'include'
      });
      if (response.ok) {
        fetchFactionData();
        showNotification('Successfully left faction');
      }
    } catch (err) {
      setError('An error occurred while leaving the faction');
    }
  };

  const showNotification = (message) => {
    setNotification(message);
    setTimeout(() => setNotification(null), 3000);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setEditFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleInviteInputChange = (e) => {
    const { name, value } = e.target;
    setInviteFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleEditFaction = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/faction/edit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editFormData),
        credentials: 'include'
      });

      const data = await response.json();
      if (data.success) {
        setShowEditForm(false);
        fetchFactionData();
        showNotification('Faction updated successfully');
      } else {
        setError(data.errors[0]);
      }
    } catch (err) {
      setError('An error occurred while updating the faction');
    }
  };

  const handleInviteMember = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/faction/invite', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(inviteFormData),
        credentials: 'include'
      });

      const data = await response.json();
      if (data.success) {
        setShowInviteForm(false);
        setInviteFormData({ username: '' });
        showNotification('Invite sent successfully');
      } else {
        setError(data.errors[0]);
      }
    } catch (err) {
      setError('An error occurred while sending the invite');
    }
  };

  const handleKickMember = async (memberId) => {
    try {
      const response = await fetch('/api/faction/kick', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ memberId }),
        credentials: 'include'
      });

      const data = await response.json();
      if (data.success) {
        fetchFactionData();
        showNotification('Member kicked successfully');
      } else {
        setError(data.errors[0]);
      }
    } catch (err) {
      setError('An error occurred while kicking the member');
    }
  };

  const handleDeleteFaction = async () => {
    try {
      const response = await fetch('/api/faction/delete', {
        method: 'POST',
        credentials: 'include'
      });

      const data = await response.json();
      if (data.success) {
        setShowDeleteConfirm(false);
        fetchFactionData();
        showNotification('Faction deleted successfully');
      } else {
        setError(data.errors[0]);
      }
    } catch (err) {
      setError('An error occurred while deleting the faction');
    }
  };

  const handlePromoteDemote = async (memberId, action) => {
    setPromoteLoading(true);
    setPromoteError('');
    setPromoteSuccess('');
    try {
      const response = await fetch('/api/faction/promote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ memberId, action }),
        credentials: 'include',
      });
      const data = await response.json();
      if (data.success) {
        setPromoteSuccess(data.message);
        fetchFactionData();
      } else {
        setPromoteError(data.message || 'Failed');
      }
    } catch (err) {
      setPromoteError('Network error');
    } finally {
      setPromoteLoading(false);
    }
  };

  const handleTerritoryInput = (e) => {
    const { name, value } = e.target;
    setTerritoryForm(prev => ({ ...prev, [name]: value }));
  };

  const handleTerritorySubmit = async (e) => {
    e.preventDefault();
    setTerritoryLoading(true);
    setTerritoryError('');
    setTerritorySuccess('');
    try {
      const response = await fetch('/api/faction/claim-territory', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...territoryForm,
          startX: Number(territoryForm.startX),
          startY: Number(territoryForm.startY),
          endX: Number(territoryForm.endX),
          endY: Number(territoryForm.endY)
        }),
        credentials: 'include',
      });
      const data = await response.json();
      if (data.success) {
        setTerritorySuccess('Territory başarıyla eklendi!');
        setShowTerritoryForm(false);
        setTerritoryForm({ name: '', description: '', startX: '', startY: '', endX: '', endY: '', color: '#000000' });
        fetchFactionData();
      } else {
        setTerritoryError(data.message || 'Hata oluştu');
      }
    } catch (err) {
      setTerritoryError('Network error');
    } finally {
      setTerritoryLoading(false);
    }
  };

  const sortedFactions = [...factions].sort((a, b) => {
    if (sortBy === 'pixels') return (b.totalPixels || 0) - (a.totalPixels || 0);
    if (sortBy === 'members') return (b.memberCount || 0) - (a.memberCount || 0);
    return 0;
  });
  const topFactions = sortedFactions.slice(0, 3);
  const restFactions = sortedFactions.slice(3);

  const renderFactionCard = (faction) => (
    <motion.div
      key={faction.id}
      style={styles.factionCard}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      {faction.banner ? (
        <img src={faction.banner} alt="Faction Banner" style={{ width: '100%', maxHeight: 120, objectFit: 'cover', borderRadius: 8, marginBottom: 8 }} />
      ) : (
        <img src="/static/defaultbanner.png" alt="Default Banner" style={{ width: '100%', maxHeight: 120, objectFit: 'cover', borderRadius: 8, marginBottom: 8, background: '#f3f4f6' }} />
      )}
      <div style={styles.factionInfo}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          {faction.avatar ? (
            <img src={faction.avatar} alt="Faction Avatar" style={{ width: 78, height: 78, borderRadius: '30%', objectFit: 'cover', marginRight: 10, border: '2px solid #fff' }} />
          ) : (
            <img src="/static/defaultavatar.png" alt="Default Avatar" style={{ width: 78, height: 78, borderRadius: '30%', objectFit: 'cover', marginRight: 10, border: '2px solid #fff', background: '#e0e0e0' }} />
          )}
          <div>
            <h3 style={{ margin: 0 }}>{faction.name} [{faction.tag}]</h3>
            <p style={{ color: 'rgba(255, 255, 255, 0.7)' }}>{faction.description}</p>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          {!faction.members?.includes(userId) ? (
            <button
              style={styles.button}
              onClick={() => handleJoinFaction(faction.id)}
            >
              <FaUserPlus /> Join
            </button>
          ) : (
            <button
              style={{ ...styles.button, background: '#e74c3c' }}
              onClick={() => handleLeaveFaction()}
            >
              <FaUserMinus /> Leave
            </button>
          )}
        </div>
      </div>

      <div style={styles.tabs}>
        <button
          style={{ ...styles.tab, ...(activeTab === 'overview' ? styles.activeTab : {}) }}
          onClick={() => setActiveTab('overview')}
        >
          Overview
        </button>
        <button
          style={{ ...styles.tab, ...(activeTab === 'members' ? styles.activeTab : {}) }}
          onClick={() => setActiveTab('members')}
        >
          Members
        </button>
        <button
          style={{ ...styles.tab, ...(activeTab === 'achievements' ? styles.activeTab : {}) }}
          onClick={() => setActiveTab('achievements')}
        >
          Achievements
        </button>
        <button
          style={{ ...styles.tab, ...(activeTab === 'territory' ? styles.activeTab : {}) }}
          onClick={() => setActiveTab('territory')}
        >
          Territory
        </button>
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'overview' && (
          <motion.div
            key="overview"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div style={styles.factionStats}>
              <div style={styles.statBox}>
                <FaUsers /> Members: {faction.memberCount}
              </div>
              <div style={styles.statBox}>
                <FaTrophy /> Pixels: {faction.totalPixels}
              </div>
              <div style={styles.statBox}>
                <FaChartLine /> Rank: #{faction.rank}
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'members' && (
          <motion.div
            key="members"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div style={styles.memberList}>
              {faction.members?.map(member => {
                if (!member || !member.User || !member.User.id) return null;
                return (
                  <div key={member.User.id} className="member-item">
                    <span className="member-name">{member.User.name}</span>
                    <span className="member-role">
                      {member.User.id === faction.leaderId ? (
                        <span className="role-badge leader"><FaCrown /> {t`Leader`}</span>
                      ) : (
                        <span className="role-badge member"><FaShieldAlt /> {member.role === 'officer' ? t`Officer` : t`Member`}</span>
                      )}
                    </span>
                    {member.User.id !== faction.leaderId && (
                      <>
                        <button 
                          className="kick-btn"
                          onClick={() => handleKickMember(member.User.id)}
                          disabled={promoteLoading}
                        >
                          <FaUserMinus /> {t`Kick`}
                        </button>
                        {/* Promote/Demote buttons */}
                        {faction.leaderId === userId && member.role === 'member' && (
                          <button
                            className="kick-btn"
                            style={{ background: '#3ba55c' }}
                            onClick={() => handlePromoteDemote(member.User.id, 'promote')}
                            disabled={promoteLoading}
                          >
                            ⬆️ {t`Promote`}
                          </button>
                        )}
                        {faction.leaderId === userId && member.role === 'officer' && (
                          <button
                            className="kick-btn"
                            style={{ background: '#edb845' }}
                            onClick={() => handlePromoteDemote(member.User.id, 'demote')}
                            disabled={promoteLoading}
                          >
                            ⬇️ {t`Demote`}
                          </button>
                        )}
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}

        {activeTab === 'achievements' && (
          <motion.div
            key="achievements"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div style={styles.achievements}>
              {faction.achievements?.map(achievement => (
                <div key={achievement.id} style={styles.achievementItem}>
                  <FaMedal />
                  <div>
                    <strong>{achievement.name}</strong>
                    <p>{achievement.description}</p>
                    <small>Earned: {new Date(achievement.earnedAt).toLocaleDateString()}</small>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {activeTab === 'territory' && (
          <motion.div
            key="territory"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div style={styles.territory}>
              <h4><FaMapMarkerAlt /> Territory</h4>
              {faction.territoryX && faction.territoryY ? (
                <p>Coordinates: ({faction.territoryX}, {faction.territoryY})</p>
              ) : (
                <p>No territory claimed yet</p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );

  return (
    <div className="faction-container">
      <style jsx>{`
        .faction-container {
          padding: 20px;
          margin: 0 auto;
          color: var(--text-color, #000000);
        }

        .error-message {
          color: var(--error-color, #ed4245);
          margin: 10px 0;
          padding: 10px;
          background: var(--error-bg, rgba(237, 66, 69, 0.1));
          border-radius: 4px;
          border: 1px solid var(--error-border, rgba(237, 66, 69, 0.2));
        }

        .success-message {
          color: var(--success-color, #3ba55c);
          margin: 10px 0;
          padding: 10px;
          background: var(--success-bg, rgba(59, 165, 92, 0.1));
          border-radius: 4px;
          border: 1px solid var(--success-border, rgba(59, 165, 92, 0.2));
        }

        .faction-card {
          background: var(--card-bg, #ffffff);
          border: 2px solid;
          border-radius: 8px;
          padding: 15px;
          margin: 10px 0;
          box-shadow: var(--card-shadow, 0 2px 4px rgba(0, 0, 0, 0.1));
          transition: transform 0.2s ease;
        }

        .faction-card:hover {
          transform: translateY(-2px);
        }

        .faction-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 10px;
        }

        .faction-header h4 {
          margin: 0;
          color: var(--heading-color, #000000);
          font-size: 1.2em;
        }

        .role-badge {
          display: flex;
          align-items: center;
          gap: 5px;
          padding: 4px 8px;
          border-radius: 4px;
          font-size: 0.9em;
        }

        .role-badge.leader {
          background: var(--leader-bg, rgba(255, 215, 0, 0.2));
          color: var(--leader-color, #ffd700);
        }

        .role-badge.member {
          background: var(--member-bg, rgba(88, 101, 242, 0.2));
          color: var(--member-color, #5865f2);
        }

        .faction-description {
          color: var(--text-secondary, #666666);
          margin: 10px 0;
          line-height: 1.4;
        }

        .faction-stats {
          display: flex;
          gap: 20px;
          margin-top: 15px;
        }

        .stat {
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .stat-label {
          color: var(--text-secondary, #666666);
          font-size: 0.9em;
        }

        .stat-value {
          color: var(--text-color, #000000);
          font-size: 1.2em;
          font-weight: bold;
        }

        .create-faction-form, .faction-form {
          display: flex;
          flex-direction: column;
          gap: 16px;
          background: #fff;
          border: none;
          box-shadow: 0 2px 16px rgba(80,90,120,0.08);
          padding: 32px 24px;
          margin: 24px 0;
          border-radius: 14px;
        }
        .create-faction-form input,
        .create-faction-form textarea,
        .faction-form input,
        .faction-form textarea {
          padding: 12px;
          border-radius: 8px;
          border: 1px solid #e0e0e0;
          font-size: 15px;
          background: #fafbfc;
          color: #222;
          outline: none;
          transition: border 0.2s;
        }
        .create-faction-form input:focus,
        .create-faction-form textarea:focus,
        .faction-form input:focus,
        .faction-form textarea:focus {
          border: 1.5px solid #5865f2;
          background: #fff;
        }
        .color-picker {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-top: 4px;
        }
        .color-picker label {
          color: #888;
          font-size: 14px;
        }
        .color-picker input[type="color"] {
          width: 40px;
          height: 28px;
          border: none;
          border-radius: 8px;
          background: none;
          padding: 0;
          margin-left: 8px;
        }
        .submit-btn {
          background: #5865f2;
          color: #fff;
          border: none;
          border-radius: 8px;
          padding: 12px 0;
          font-weight: 600;
          font-size: 16px;
          cursor: pointer;
          transition: background 0.2s;
          margin-right: 8px;
        }
        .submit-btn:hover {
          background: #4752c4;
        }
        .cancel-btn {
          background: #f3f4f6;
          color: #444;
          border: none;
          border-radius: 8px;
          padding: 12px 0;
          font-weight: 500;
          font-size: 16px;
          cursor: pointer;
          transition: background 0.2s;
        }
        .cancel-btn:hover {
          background: #e0e1e4;
        }
        .form-buttons {
          display: flex;
          gap: 12px;
          margin-top: 8px;
        }
        .modal-content > h3, .create-faction-form > h3 {
          font-size: 1.3em;
          font-weight: 600;
          margin-bottom: 8px;
          color: #222;
          letter-spacing: 0.5px;
        }
        .modal-overlay, .create-faction-modal-overlay {
          position: fixed;
          top: 0; left: 0; right: 0; bottom: 0;
          background: rgba(0,0,0,0.55);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
        }
        .modal-content, .create-faction-modal-content {
          background: #fff;
          border-radius: 14px;
          box-shadow: 0 2px 24px rgba(80,90,120,0.13);
          padding: 32px 24px;
          min-width: 340px;
          max-width: 95vw;
          max-height: 90vh;
          overflow-y: auto;
          position: relative;
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        .create-faction-form {
          background: none;
          border: 'none';
          box-shadow: none;
          padding: 0;
          margin: 0;
          border-radius: 0;
        }
        .top-factions-row {
          display: flex;
          gap: 24px;
          margin: 32px 0 24px 0;
          justify-content: center;
        }
        @media (max-width: 700px) {
          .top-factions-row {
            flex-direction: column;
            gap: 16px;
            align-items: stretch;
          }
          .top-faction-card {
            min-width: unset !important;
            max-width: 100% !important;
            width: 100% !important;
          }
        }
        .sort-row {
          display: flex;
          gap: 12px;
          align-items: center;
          margin: 0 0 18px 0;
          flex-wrap: wrap;
        }
      `}</style>

      <h2>{t`Factions`}</h2>
      
      {error && (
        <div className="error-container">
          <div className="error-icon">⚠️</div>
          <div className="error-text">{error}</div>
          <button className="retry-button" onClick={fetchFactionData}>
            {t`Retry`}
          </button>
        </div>
      )}

      {loading ? (
        <div className="loading-container">
          <FaSpinner className="loading-spinner" />
          <div className="loading-text">{t`Loading factions...`}</div>
        </div>
      ) : (
        <>
          {myFaction ? (
            <div className="my-faction">
              <h3>{t`My Faction`}</h3>
              <div className="faction-card" style={{ borderColor: myFaction.color }}>
                {myFaction.banner ? (
                  <img src={myFaction.banner} alt="Faction Banner" style={{ width: '100%', maxHeight: 120, objectFit: 'cover', borderRadius: 8, marginBottom: 8 }} />
                ) : (
                  <img src="/static/defaultbanner.png" alt="Default Banner" style={{ width: '100%', maxHeight: 120, objectFit: 'cover', borderRadius: 8, marginBottom: 8, background: '#f3f4f6' }} />
                )}
                <div className="faction-header">
                  {myFaction.avatar ? (
                    <img src={myFaction.avatar} alt="Faction Avatar" style={{ width: 78, height: 78, borderRadius: '30%', objectFit: 'cover', marginRight: 12, border: '2px solid #fff' }} />
                  ) : (
                    <img src="/static/defaultavatar.png" alt="Default Avatar" style={{ width: 78, height: 78, borderRadius: '30%', objectFit: 'cover', marginRight: 12, border: '2px solid #fff', background: '#e0e0e0' }} />
                  )}
                  <h4>{myFaction.name} [{myFaction.tag}]</h4>
                  <div className="faction-role">
                    {myFaction.leaderId === userId ? (
                      <span className="role-badge leader"><FaCrown /> {t`Leader`}</span>
                    ) : (
                      <span className="role-badge member"><FaShieldAlt /> {t`Member`}</span>
                    )}
                  </div>
                  {/* Leave Faction button (sadece lider değilse) */}
                  {myFaction.leaderId !== userId && (
                    <button
                      className="leave-faction-btn"
                      style={{ marginLeft: 16, background: '#e74c3c', color: '#fff', border: 'none', borderRadius: 8, padding: '8px 18px', fontWeight: 600, fontSize: 15, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}
                      onClick={handleLeaveFaction}
                    >
                      <FaUserMinus /> {t`Leave Faction`}
                    </button>
                  )}
                </div>
                <p className="faction-description">{myFaction.description}</p>
                <div className="faction-stats">
                  <div className="stat">
                    <span className="stat-label">{t`Members`}</span>
                    <span className="stat-value">{myFaction.memberCount}</span>
                  </div>
                  <div className="stat">
                    <span className="stat-label">{t`Pixels`}</span>
                    <span className="stat-value">{myFaction.totalPixels}</span>
                  </div>
                </div>

                {myFaction.leaderId === userId && (
                  <div className="faction-management">
                    <h4 className="management-title">
                      <FaCog /> {t`Faction Management`}
                    </h4>
                    <div className="management-actions">
                      <button
                        className="management-btn edit"
                        onClick={() => setShowEditForm(true)}
                      >
                        <FaEdit /> {t`Edit Faction`}
                      </button>
                      <button 
                        className="management-btn invite"
                        onClick={() => setShowInviteForm(true)}
                      >
                        <FaUserPlus /> {t`Invite Member`}
                      </button>
                      <button 
                        className="management-btn members"
                        onClick={() => setShowMembersList(true)}
                      >
                        <FaUsers /> {t`Manage Members`}
                      </button>
                      <button 
                        className="management-btn delete"
                        onClick={() => setShowDeleteConfirm(true)}
                      >
                        <FaTrash /> {t`Delete Faction`}
                      </button>
                    </div>
                  </div>
                )}

                {/* Members listesi (modal dışında, ana kartta) */}
                {myFaction.members && myFaction.members.length > 0 && (
                  <div style={{ marginTop: 10 }}>
                    <strong>{t`Members`}:</strong>
                    <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                      {myFaction.members.map(member =>
                        member && member.User ? (
                          <li key={member.User.id} style={{ background: 'rgba(255,255,255,0.07)', borderRadius: 4, padding: '2px 8px', fontSize: 13 }}>
                            {member.User.name}
                            {member.role === 'officer' && <span style={{ marginLeft: 4, color: '#edb845' }}>★</span>}
                            {member.User.id === myFaction.leaderId && <span style={{ marginLeft: 4, color: '#ffd700' }}>👑</span>}
                          </li>
                        ) : null
                      )}
                    </ul>
                  </div>
                )}
              </div>

              {/* Edit Faction Form */}
              {showEditForm && (
                <div className="modal-overlay">
                  <div className="modal-content">
                    <h3>{t`Edit Faction`}</h3>
                    <form onSubmit={handleEditFaction} className="faction-form">
                      <input
                        type="text"
                        name="name"
                        placeholder={t`Faction Name`}
                        value={editFormData.name}
                        onChange={handleEditInputChange}
                        required
                      />
                      <input
                        type="text"
                        name="tag"
                        placeholder={t`Tag (2-4 chars)`}
                        value={editFormData.tag}
                        onChange={handleEditInputChange}
                        required
                      />
                      <textarea
                        name="description"
                        placeholder={t`Description`}
                        value={editFormData.description}
                        onChange={handleEditInputChange}
                      />
                      <input
                        type="text"
                        name="avatar"
                        placeholder={t`Avatar URL`}
                        value={editFormData.avatar || ''}
                        onChange={handleEditInputChange}
                      />
                      <input
                        type="text"
                        name="banner"
                        placeholder={t`Banner URL`}
                        value={editFormData.banner || ''}
                        onChange={handleEditInputChange}
                      />
                      <div className="color-picker">
                        <label>{t`Faction Color`}</label>
                        <input
                          type="color"
                          name="color"
                          value={editFormData.color}
                          onChange={handleEditInputChange}
                        />
                      </div>
                      <div className="form-buttons">
                        <button type="submit" className="submit-btn">{t`Save Changes`}</button>
                        <button type="button" className="cancel-btn" onClick={() => setShowEditForm(false)}>
                          {t`Cancel`}
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}

              {/* Invite Member Form */}
              {showInviteForm && (
                <div className="modal-overlay">
                  <div className="modal-content">
                    <h3>{t`Invite Member`}</h3>
                    <form onSubmit={handleInviteMember} className="faction-form">
                      <input
                        type="text"
                        name="username"
                        placeholder={t`Username`}
                        value={inviteFormData.username}
                        onChange={handleInviteInputChange}
                        required
                      />
                      <div className="form-buttons">
                        <button type="submit" className="submit-btn">{t`Send Invite`}</button>
                        <button type="button" className="cancel-btn" onClick={() => setShowInviteForm(false)}>
                          {t`Cancel`}
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}

              {/* Members List */}
              {showMembersList && (
                <div className="modal-overlay">
                  <div className="modal-content">
                    <h3>{t`Manage Members`}</h3>
                    {promoteError && <div className="error-message">{promoteError}</div>}
                    {promoteSuccess && <div className="success-message">{promoteSuccess}</div>}
                    <div className="members-list">
                      {myFaction.members?.map(member => {
                        if (!member || !member.User || !member.User.id) return null;
                        return (
                          <div key={member.User.id} className="member-item">
                            <span className="member-name">{member.User.name}</span>
                            <span className="member-role">
                              {member.User.id === myFaction.leaderId ? (
                                <span className="role-badge leader"><FaCrown /> {t`Leader`}</span>
                              ) : (
                                <span className="role-badge member"><FaShieldAlt /> {member.role === 'officer' ? t`Officer` : t`Member`}</span>
                              )}
                            </span>
                            {member.User.id !== myFaction.leaderId && (
                              <>
                                <button 
                                  className="kick-btn"
                                  onClick={() => handleKickMember(member.User.id)}
                                  disabled={promoteLoading}
                                >
                                  <FaUserMinus /> {t`Kick`}
                                </button>
                                {/* Promote/Demote buttons */}
                                {myFaction.leaderId === userId && member.role === 'member' && (
                                  <button
                                    className="kick-btn"
                                    style={{ background: '#3ba55c' }}
                                    onClick={() => handlePromoteDemote(member.User.id, 'promote')}
                                    disabled={promoteLoading}
                                  >
                                    ⬆️ {t`Promote`}
                                  </button>
                                )}
                                {myFaction.leaderId === userId && member.role === 'officer' && (
                                  <button
                                    className="kick-btn"
                                    style={{ background: '#edb845' }}
                                    onClick={() => handlePromoteDemote(member.User.id, 'demote')}
                                    disabled={promoteLoading}
                                  >
                                    ⬇️ {t`Demote`}
                                  </button>
                                )}
                              </>
                            )}
                          </div>
                        );
                      })}
                    </div>
                    <button 
                      className="close-btn"
                      onClick={() => setShowMembersList(false)}
                    >
                      {t`Close`}
                    </button>
                  </div>
                </div>
              )}

              {/* Delete Confirmation */}
              {showDeleteConfirm && (
                <div className="modal-overlay">
                  <div className="modal-content">
                    <h3>{t`Delete Faction`}</h3>
                    <p className="warning-text">
                      {t`Are you sure you want to delete this faction? This action cannot be undone.`}
                    </p>
                    <div className="form-buttons">
                      <button 
                        className="delete-btn"
                        onClick={handleDeleteFaction}
                      >
                        {t`Delete Faction`}
                      </button>
                      <button 
                        className="cancel-btn"
                        onClick={() => setShowDeleteConfirm(false)}
                      >
                        {t`Cancel`}
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* My Faction Detayında Territory Ekle ve Listele */}
              <div className="territory-section">
                <h4>{t`Territories`}</h4>
                {(myFaction.leaderId === userId || myFaction.members?.find(m => m && m.User && m.User.id === userId && m.role === 'officer')) && (
                  <button className="create-faction-btn" onClick={() => setShowTerritoryForm(true)}>
                    {t`Add Territory`}
                  </button>
                )}
                {showTerritoryForm && (
                  <div className="modal-overlay">
                    <div className="modal-content">
                      <h3>{t`Add Territory`}</h3>
                      <form onSubmit={handleTerritorySubmit} className="faction-form">
                        <input type="text" name="name" placeholder={t`Name`} value={territoryForm.name} onChange={handleTerritoryInput} required />
                        <textarea name="description" placeholder={t`Description`} value={territoryForm.description} onChange={handleTerritoryInput} />
                        <input type="number" name="startX" placeholder={t`Start X`} value={territoryForm.startX} onChange={handleTerritoryInput} required />
                        <input type="number" name="startY" placeholder={t`Start Y`} value={territoryForm.startY} onChange={handleTerritoryInput} required />
                        <input type="number" name="endX" placeholder={t`End X`} value={territoryForm.endX} onChange={handleTerritoryInput} required />
                        <input type="number" name="endY" placeholder={t`End Y`} value={territoryForm.endY} onChange={handleTerritoryInput} required />
                        <div className="color-picker">
                          <label>{t`Color`}</label>
                          <input type="color" name="color" value={territoryForm.color} onChange={handleTerritoryInput} />
                        </div>
                        <div className="form-buttons">
                          <button type="submit" className="submit-btn" disabled={territoryLoading}>{territoryLoading ? t`Adding...` : t`Add`}</button>
                          <button type="button" className="cancel-btn" onClick={() => setShowTerritoryForm(false)}>{t`Cancel`}</button>
                        </div>
                        {territoryError && <div className="error-message">{territoryError}</div>}
                        {territorySuccess && <div className="success-message">{territorySuccess}</div>}
                      </form>
                    </div>
                  </div>
                )}
                <div className="territory-list">
                  {myFaction.territories && myFaction.territories.length > 0 ? (
                    myFaction.territories.map(ter => (
                      <div key={ter.id} className="territory-item" style={{ borderLeft: `6px solid ${ter.color}` }}>
                        <strong>{ter.name}</strong> ({ter.startX},{ter.startY}) - ({ter.endX},{ter.endY})<br/>
                        <span style={{ fontSize: '0.9em', color: '#888' }}>{ter.description}</span>
                      </div>
                    ))
                  ) : (
                    <div style={{ color: '#888', marginTop: 8 }}>{t`No territories yet.`}</div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <>
            <div className="faction-actions">
              <button 
                className="create-faction-btn"
                onClick={() => setShowCreateForm(!showCreateForm)}
              >
                <FaPlus /> {t`Create Faction`}
              </button>

              {showCreateForm && (
                  <div className="create-faction-modal-overlay" onClick={e => { if (e.target.className.includes('modal-overlay')) setShowCreateForm(false); }}>
                    <div className="create-faction-modal-content">
                <form onSubmit={handleCreateFaction} className="create-faction-form">
                        <h3>{t`Create Faction`}</h3>
                  <input
                    type="text"
                    name="name"
                    placeholder={t`Faction Name`}
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                  />
                  <input
                    type="text"
                    name="tag"
                    placeholder={t`Tag (2-4 chars)`}
                    value={formData.tag}
                    onChange={handleInputChange}
                    required
                  />
                  <textarea
                    name="description"
                    placeholder={t`Description`}
                    value={formData.description}
                    onChange={handleInputChange}
                  />
                        <input
                          type="text"
                          name="avatar"
                          placeholder={t`Avatar URL`}
                          value={formData.avatar || ''}
                          onChange={handleInputChange}
                        />
                        <input
                          type="text"
                          name="banner"
                          placeholder={t`Banner URL`}
                          value={formData.banner || ''}
                          onChange={handleInputChange}
                        />
                  <div className="color-picker">
                    <label>{t`Faction Color`}</label>
                    <input
                      type="color"
                      name="color"
                      value={formData.color}
                      onChange={handleInputChange}
                    />
                  </div>
                        <div className="form-buttons">
                          <button type="submit" className="submit-btn">{t`Save`}</button>
                          <button type="button" className="cancel-btn" onClick={() => setShowCreateForm(false)}>{t`Cancel`}</button>
                        </div>
                </form>
                    </div>
            </div>
          )}
              </div>
              {/* Top 3 Factions */}
              <div className="top-factions-row">
                {topFactions.map((faction, idx) => (
                  <div key={faction.id} className="top-faction-card" style={{
                    background: '#fff',
                    borderRadius: 16,
                    boxShadow: '0 2px 16px rgba(80,90,120,0.10)',
                    border: idx === 0 ? '2.5px solid #ffd700' : idx === 1 ? '2px solid #b4b4b4' : '2px solid #cd7f32',
                    minWidth: 260,
                    maxWidth: 320,
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    padding: 24,
                    position: 'relative',
                  }}>
                    {/* Top badge */}
                    <div style={{
                      position: 'absolute',
                      top: -18,
                      left: '50%',
                      transform: 'translateX(-50%)',
                      background: idx === 0 ? '#ffd700' : idx === 1 ? '#b4b4b4' : '#cd7f32',
                      color: '#fff',
                      borderRadius: '50%',
                      width: 36,
                      height: 36,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 700,
                      fontSize: 18,
                      boxShadow: '0 2px 8px rgba(0,0,0,0.10)'
                    }}>{idx + 1}</div>
                    {/* Banner */}
                    {faction.banner ? (
                      <img src={faction.banner} alt="Banner" style={{ width: '100%', maxHeight: 80, objectFit: 'cover', borderRadius: 10, marginBottom: 12 }} />
                    ) : (
                      <img src="/static/defaultbanner.png" alt="Default Banner" style={{ width: '100%', maxHeight: 80, objectFit: 'cover', borderRadius: 10, marginBottom: 12, background: '#f3f4f6' }} />
                    )}
                    {/* Avatar */}
                    {faction.avatar ? (
                      <img src={faction.avatar} alt="Avatar" style={{ width: 64, height: 64, borderRadius: '30%', objectFit: 'cover', marginTop: -32, border: '2px solid #fff', background: '#e0e0e0' }} />
                    ) : (
                      <img src="/static/defaultavatar.png" alt="Default Avatar" style={{ width: 64, height: 64, borderRadius: '30%', objectFit: 'cover', marginTop: -32, border: '2px solid #fff', background: '#e0e0e0' }} />
                    )}
                    <h4 style={{ margin: '16px 0 4px 0', fontWeight: 700, fontSize: 20 }}>{faction.name} [{faction.tag}]</h4>
                    <div style={{ color: '#888', fontSize: 15, marginBottom: 8, textAlign: 'center' }}>{faction.description}</div>
                    <div style={{ display: 'flex', gap: 16, marginBottom: 12 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontWeight: 600 }}>
                        <FaTrophy style={{ color: '#ffd700' }} /> {faction.totalPixels}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontWeight: 600 }}>
                        <FaUsers style={{ color: '#5865f2' }} /> {faction.memberCount}
                      </div>
                    </div>
                    <button style={{ background: '#5865f2', color: '#fff', border: 'none', borderRadius: 8, padding: '10px 24px', fontWeight: 600, fontSize: 15, cursor: 'pointer', marginTop: 8 }} onClick={() => handleJoinFaction(faction.id)}>
                      <FaUserPlus /> {t`Join`}
                    </button>
                  </div>
                ))}
              </div>
              {/* Sıralama seçici */}
              <div className="sort-row">
                <span style={{ color: '#888', fontWeight: 500 }}>{t`Sort by`}:</span>
                <button onClick={() => setSortBy('pixels')} style={{ background: sortBy === 'pixels' ? '#5865f2' : '#f3f4f6', color: sortBy === 'pixels' ? '#fff' : '#444', border: 'none', borderRadius: 7, padding: '7px 18px', fontWeight: 600, fontSize: 15, cursor: 'pointer', transition: 'background 0.2s' }}>{t`Most Pixels`}</button>
                <button onClick={() => setSortBy('members')} style={{ background: sortBy === 'members' ? '#5865f2' : '#f3f4f6', color: sortBy === 'members' ? '#fff' : '#444', border: 'none', borderRadius: 7, padding: '7px 18px', fontWeight: 600, fontSize: 15, cursor: 'pointer', transition: 'background 0.2s' }}>{t`Most Members`}</button>
              </div>
              {/* Diğer factionlar */}
              <div className="all-factions-list">
                {restFactions.length === 0 ? (
                  <div style={{ color: '#888', marginTop: 8 }}>{t`No factions found.`}</div>
                ) : (
                  restFactions.map(faction => (
                    <motion.div
                      key={faction.id}
                      style={styles.factionCard}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                    >
                      {faction.banner ? (
                        <img src={faction.banner} alt="Faction Banner" style={{ width: '100%', maxHeight: 120, objectFit: 'cover', borderRadius: 8, marginBottom: 8 }} />
                      ) : (
                        <img src="/static/defaultbanner.png" alt="Default Banner" style={{ width: '100%', maxHeight: 120, objectFit: 'cover', borderRadius: 8, marginBottom: 8, background: '#f3f4f6' }} />
                      )}
                      <div style={styles.factionInfo}>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                          {faction.avatar ? (
                            <img src={faction.avatar} alt="Faction Avatar" style={{ width: 78, height: 78, borderRadius: '30%', objectFit: 'cover', marginRight: 10, border: '2px solid #fff' }} />
                          ) : (
                            <img src="/static/defaultavatar.png" alt="Default Avatar" style={{ width: 78, height: 78, borderRadius: '30%', objectFit: 'cover', marginRight: 10, border: '2px solid #fff', background: '#e0e0e0' }} />
                          )}
                          <div>
                            <h3 style={{ margin: 0 }}>{faction.name} [{faction.tag}]</h3>
                            <p style={{ color: 'rgba(255, 255, 255, 0.7)' }}>{faction.description}</p>
                          </div>
                        </div>
                        <div style={{ display: 'flex', gap: '10px' }}>
                          <button
                            style={styles.button}
                            onClick={() => handleJoinFaction(faction.id)}
                          >
                            <FaUserPlus /> {t`Join`}
                          </button>
                        </div>
                      </div>
                      <div style={styles.factionStats}>
                        <div style={styles.statBox}>
                          <FaUsers /> {t`Members`}: {faction.memberCount}
                        </div>
                        <div style={styles.statBox}>
                          <FaTrophy /> {t`Pixels`}: {faction.totalPixels}
                        </div>
                        <div style={styles.statBox}>
                          <FaChartLine /> {t`Rank`}: #{faction.rank}
                        </div>
                      </div>
                      {/* Members listesi */}
                      {faction.members && faction.members.length > 0 && (
                        <div style={{ marginTop: 10 }}>
                          <strong>{t`Members`}:</strong>
                          <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                            {faction.members.map(member =>
                              member && member.User ? (
                                <li key={member.User.id} style={{ background: 'rgba(255,255,255,0.07)', borderRadius: 4, padding: '2px 8px', fontSize: 13 }}>
                                  {member.User.name}
                                  {member.role === 'officer' && <span style={{ marginLeft: 4, color: '#edb845' }}>★</span>}
                                  {member.User.id === faction.leaderId && <span style={{ marginLeft: 4, color: '#ffd700' }}>👑</span>}
                                </li>
                              ) : null
                            )}
                          </ul>
                        </div>
                      )}
                    </motion.div>
                  ))
                )}
              </div>
            </>
          )}
        </>
      )}

      {notification && (
        <motion.div
          style={styles.notification}
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
        >
          {notification}
        </motion.div>
      )}
    </div>
  );
};

export default Faction; 