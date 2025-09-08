/*
 * Admintools
 */

import React, { useState, useEffect, useRef } from 'react';
import { t } from 'ttag';

import { shardOrigin } from '../store/actions/fetch';
import {
  requestCreateBadge,
  requestUpdateBadge,
  requestDeleteBadge,
  requestBadgeList,
  requestGrantBadge,
  requestGrantVIP,
  requestRevokeVIP,
  requestVIPList,
  requestMe,
  requestUserInfo,
} from '../store/actions/fetch';

async function submitIPAction(
  action,
  vallist,
  callback,
) {
  const data = new FormData();
  data.append('ipaction', action);
  data.append('ip', vallist);
  const resp = await fetch(`${shardOrigin}/api/modtools`, {
    credentials: 'include',
    method: 'POST',
    body: data,
  });
  callback(await resp.text());
}

async function getModList(
  callback,
) {
  const data = new FormData();
  data.append('modlist', true);
  const resp = await fetch(`${shardOrigin}/api/modtools`, {
    credentials: 'include',
    method: 'POST',
    body: data,
  });
  if (resp.ok) {
    callback(await resp.json());
  } else {
    callback([]);
  }
}

async function getAdminList(callback) {
  const data = new FormData();
  data.append('adminlist', true);
  const resp = await fetch(`${shardOrigin}/api/modtools`, {
    credentials: 'include',
    method: 'POST',
    body: data,
  });
  if (resp.ok) {
    const result = await resp.json();
    callback(Array.isArray(result) ? result : []);
  } else {
    callback([]);
  }
}

async function getOwnerList(callback) {
  const data = new FormData();
  data.append('ownerlist', true);
  const resp = await fetch(`${shardOrigin}/api/modtools`, {
    credentials: 'include',
    method: 'POST',
    body: data,
  });
  if (resp.ok) {
    const result = await resp.json();
    callback(Array.isArray(result) ? result : []);
  } else {
    callback([]);
  }
}

async function submitRemMod(
  userId,
  callback,
) {
  const data = new FormData();
  data.append('remmod', userId);
  const resp = await fetch(`${shardOrigin}/api/modtools`, {
    credentials: 'include',
    method: 'POST',
    body: data,
  });
  callback(resp.ok, await resp.text());
}

async function submitMakeMod(
  userName,
  callback,
) {
  const data = new FormData();
  data.append('makemod', userName);
  const resp = await fetch(`${shardOrigin}/api/modtools`, {
    credentials: 'include',
    method: 'POST',
    body: data,
  });
  if (resp.ok) {
    callback(await resp.json());
  } else {
    callback(await resp.text());
  }
}

async function submitGrantBadge(userIds, badgeId, callback) {
  try {
    // Her bir kullanıcı ID'si için badge verme işlemini yap
    const userIdList = userIds.split('\n').map(id => id.trim()).filter(id => id);
    const badgeIdNum = parseInt(badgeId, 10);

    if (!badgeIdNum || isNaN(badgeIdNum)) {
      callback(false, 'Invalid badge ID. Please enter a number.');
      return;
    }

    const results = [];
    for (const userId of userIdList) {
      const userIdNum = parseInt(userId, 10);
      if (!userIdNum || isNaN(userIdNum)) {
        results.push(`Invalid user ID: ${userId}`);
        continue;
      }

      try {
        const response = await requestGrantBadge(userIdNum, badgeIdNum);
        if (response.errors) {
          results.push(`Error for user ${userId}: ${response.errors[0]}`);
        } else {
          results.push(`Successfully granted badge to user ${userId}`);
        }
      } catch (err) {
        results.push(`Error for user ${userId}: ${err.message}`);
      }
    }

    callback(true, results.join('\n'));
  } catch (err) {
    callback(false, err.message);
  }
}

async function submitGrantVIP(userIds, reason, level, callback) {
  try {
    const userIdList = userIds.split('\n').map(id => id.trim()).filter(id => id);
    if (!reason) {
      callback(false, 'Please provide a reason for granting VIP status');
      return;
    }

    if (!level || level < 1 || level > 3) {
      callback(false, 'Please select a valid VIP level (1-3)');
      return;
    }

    const results = [];
    for (const userId of userIdList) {
      const userIdNum = parseInt(userId, 10);
      if (!userIdNum || isNaN(userIdNum)) {
        results.push(`Invalid user ID: ${userId}`);
        continue;
      }

      try {
        const response = await requestGrantVIP(userIdNum, reason, level);
        if (response.errors) {
          results.push(`Error for user ${userId}: ${response.errors[0]}`);
        } else {
          results.push(`Successfully granted VIP to user ${userId}`);
        }
      } catch (err) {
        results.push(`Error for user ${userId}: ${err.message}`);
      }
    }

    callback(true, results.join('\n'));
  } catch (err) {
    callback(false, err.message);
  }
}

async function submitRevokeVIP(userIds, reason, callback) {
  try {
    const userIdList = userIds.split('\n').map(id => id.trim()).filter(id => id);

    const results = [];
    for (const userId of userIdList) {
      const userIdNum = parseInt(userId, 10);
      if (!userIdNum || isNaN(userIdNum)) {
        results.push(`Invalid user ID: ${userId}`);
        continue;
      }

      try {
        const response = await requestRevokeVIP(userIdNum, reason);
        if (response.errors) {
          results.push(`Error for user ${userId}: ${response.errors[0]}`);
        } else {
          results.push(`Successfully revoked VIP from user ${userId}`);
        }
      } catch (err) {
        results.push(`Error for user ${userId}: ${err.message}`);
      }
    }

    callback(true, results.join('\n'));
  } catch (err) {
    callback(false, err.message);
  }
}

async function submitMakeAdmin(
  userName,
  callback,
) {
  const data = new FormData();
  data.append('makeadmin', userName);
  const resp = await fetch(`${shardOrigin}/api/modtools`, {
    credentials: 'include',
    method: 'POST',
    body: data,
  });
  if (resp.ok) {
    callback(await resp.json());
  } else {
    callback(await resp.text());
  }
}

async function submitMakeOwner(
  userName,
  callback,
) {
  const data = new FormData();
  data.append('makeowner', userName);
  const resp = await fetch(`${shardOrigin}/api/modtools`, {
    credentials: 'include',
    method: 'POST',
    body: data,
  });
  if (resp.ok) {
    callback(await resp.json());
  } else {
    callback(await resp.text());
  }
}

async function submitRemAdmin(
  userId,
  callback,
) {
  const data = new FormData();
  data.append('remadmin', userId);
  const resp = await fetch(`${shardOrigin}/api/modtools`, {
    credentials: 'include',
    method: 'POST',
    body: data,
  });
  callback(resp.ok, await resp.text());
}

async function submitRemOwner(
  userId,
  callback,
) {
  const data = new FormData();
  data.append('remowner', userId);
  const resp = await fetch(`${shardOrigin}/api/modtools`, {
    credentials: 'include',
    method: 'POST',
    body: data,
  });
  callback(resp.ok, await resp.text());
}

function Admintools() {
  const [iPAction, selectIPAction] = useState('iidtoip');
  const [modName, selectModName] = useState('');
  const [adminName, setAdminName] = useState('');
  const [ownerName, setOwnerName] = useState('');
  const [txtval, setTxtval] = useState('');
  const [resp, setResp] = useState(null);
  const [modlist, setModList] = useState([]);
  const [adminlist, setAdminList] = useState([]);
  const [ownerlist, setOwnerList] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [badgeId, setBadgeId] = useState("");
  const [badges, setBadges] = useState([]);
  const [selectedBadge, setSelectedBadge] = useState(null);
  const [badgeForm, setBadgeForm] = useState({
    name: '',
    description: '',
    rarity: 'common',
    image: '',
    requirements: {},
    category: 'activity'
  });
  const [vipAction, setVipAction] = useState('grant');
  const [vipReason, setVipReason] = useState('');
  const [vipLevel, setVipLevel] = useState(1);
  const [vipUsers, setVipUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [grantReason, setGrantReason] = useState('');
  const [revokeReason, setRevokeReason] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [showBioModal, setShowBioModal] = useState(false);
  const [editingBio, setEditingBio] = useState('');
  const [editingUserId, setEditingUserId] = useState(null);
  const [vipState, setVipState] = useState({ loading: false, error: null });
  const [musicPlayer, setMusicPlayer] = useState({
    isPlaying: localStorage.getItem('musicPlaying') === 'true',
    volume: parseFloat(localStorage.getItem('musicVolume')) || 0.5,
    currentTrack: parseInt(localStorage.getItem('currentTrack')) || 0
  });
  const audioRef = useRef(null);
  const [userRole, setUserRole] = useState(null);
  const [announceTitle, setAnnounceTitle] = useState('');
  const [announceMessage, setAnnounceMessage] = useState('');
  const [announceTargetUserId, setAnnounceTargetUserId] = useState('');
  const [announceResp, setAnnounceResp] = useState(null);
  const [announceLoading, setAnnounceLoading] = useState(false);

  const playlist = [
    {
      title: "Track 1",
      url: "/music/track1.mp3"
    },
    {
      title: "Track 2",
      url: "/music/track2.mp3"
    },
    {
      title: "Track 3",
      url: "/music/track3.mp3"
    }
  ];

  useEffect(() => {
    getModList((mods) => setModList(mods));
    getAdminList((admins) => setAdminList(admins));
    getOwnerList((owners) => setOwnerList(owners));
    loadBadges();
    loadVIPUsers();
    // Müzik çalar durumunu localStorage'dan yükle
    const savedState = {
      isPlaying: localStorage.getItem('musicPlaying') === 'true',
      volume: parseFloat(localStorage.getItem('musicVolume')) || 0.5,
      currentTrack: parseInt(localStorage.getItem('currentTrack')) || 0
    };
    setMusicPlayer(savedState);

    // Audio elementini oluştur
    const audio = new Audio(playlist[savedState.currentTrack].url);
    audio.volume = savedState.volume;
    audio.loop = true;
    audioRef.current = audio;

    if (savedState.isPlaying) {
      audio.play().catch(err => console.log('Auto-play prevented:', err));
    }

    // Sayfa kapatıldığında müziği durdur
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    // Get user role when component mounts
    const fetchUserRole = async () => {
      try {
        const response = await requestMe();
        if (!response.errors) {
          // MySQL'den gelen roles değerini Redux'taki userlvl'e eşleştir
          const userlvl = response.roles;
          console.log('User level from MySQL roles:', userlvl); // Debug için
          setUserRole(userlvl);
        }
      } catch (err) {
        console.error('Error fetching user level:', err);
      }
    };
    fetchUserRole();
  }, []);

  const loadBadges = async () => {
    const response = await requestBadgeList();
    if (!response.errors) {
      setBadges(response);
    }
  };

  const loadVIPUsers = async () => {
    try {
      setLoading(true);
      console.log('Loading VIP users... Current user role:', userRole);
      
      // API isteği öncesi yetki kontrolü
      if (!userRole || (userRole !== 1 && userRole !== 2 && userRole !== 3)) {
        console.error('Unauthorized: Invalid user role', userRole);
        setError('Unauthorized: Invalid user role');
        setVipUsers([]);
        return;
      }

      const response = await requestVIPList();
      console.log('VIP List API Response:', response);
      
      if (response && response.errors) {
        console.error('VIP List API Error:', response.errors);
        setError(response.errors[0]);
        setVipUsers([]);
      } else if (response && Array.isArray(response)) {
        console.log('VIP List loaded successfully:', response.length, 'users');
        setVipUsers(response);
        setError(null);
      } else {
        console.error('Invalid VIP List response format:', response);
        setVipUsers([]);
        setError('Invalid response format');
      }
    } catch (err) {
      console.error('Error loading VIP users:', err);
      setError('Failed to load VIP users');
      setVipUsers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log('Component mounted. Current user role:', userRole);
    if (userRole) {
      loadVIPUsers();
      const interval = setInterval(loadVIPUsers, 30000);
      return () => clearInterval(interval);
    }
  }, [userRole]);

  const handleBadgeSubmit = async (e) => {
    e.preventDefault();
    if (submitting) return;
    setSubmitting(true);

    try {
      const response = selectedBadge
        ? await requestUpdateBadge(selectedBadge.id, badgeForm)
        : await requestCreateBadge(badgeForm);

      if (response.errors) {
        setResp(response.errors[0]);
      } else {
        await loadBadges();
        setBadgeForm({
          name: '',
          description: '',
          rarity: 'common',
          image: '',
          requirements: {},
          category: 'activity'
        });
        setSelectedBadge(null);
        const action = selectedBadge ? t`updated` : t`created`;
        setResp(t`Badge ${action} successfully`);
      }
    } catch (err) {
      setResp(err.message);
    }
    setSubmitting(false);
  };

  const handleDeleteBadge = async (badgeId) => {
    if (submitting) return;
    setSubmitting(true);

    try {
      const response = await requestDeleteBadge(badgeId);
      if (response.errors) {
        setResp(response.errors[0]);
      } else {
        await loadBadges();
        setResp(t`Badge deleted successfully`);
      }
    } catch (err) {
      setResp(err.message);
    }
    setSubmitting(false);
  };

  const handleVIPAction = async () => {
    if (submitting) return;
    setSubmitting(true);
    setVipState({ loading: true, error: null });

    try {
      if (vipAction === 'grant') {
        if (!vipReason.trim()) {
          setVipState({ loading: false, error: 'Please provide a reason for granting VIP status' });
          setSubmitting(false);
          return;
        }
        if (!vipLevel || vipLevel < 1 || vipLevel > 3) {
          setVipState({ loading: false, error: 'Please select a valid VIP level (1-3)' });
          setSubmitting(false);
          return;
        }
        await submitGrantVIP(txtval, vipReason, vipLevel, (success, ret) => {
          setSubmitting(false);
          setVipState({ loading: false, error: null });
          setResp(ret);
          if (success) {
            loadVIPUsers();
            setTxtval('');
            setVipReason('');
            setVipLevel(1);
          }
        });
      } else {
        // Revoke işlemi için
        const userIdList = txtval.split('\n').map(id => id.trim()).filter(id => id);
        if (userIdList.length === 0) {
          setVipState({ loading: false, error: 'Please enter at least one user ID' });
          setSubmitting(false);
          return;
        }

        const results = [];
        for (const userId of userIdList) {
          const userIdNum = parseInt(userId, 10);
          if (!userIdNum || isNaN(userIdNum)) {
            results.push(`Invalid user ID: ${userId}`);
            continue;
          }

          try {
            const response = await requestRevokeVIP(userIdNum, 'No reason provided');
            if (response.error) {
              results.push(`Error for user ${userId}: ${response.error}`);
            } else {
              results.push(`Successfully revoked VIP from user ${userId}`);
            }
          } catch (err) {
            results.push(`Error for user ${userId}: ${err.message}`);
          }
        }

        setSubmitting(false);
        setVipState({ loading: false, error: null });
        setResp(results.join('\n'));
        if (results.some(r => r.includes('Successfully'))) {
          loadVIPUsers();
          setTxtval('');
        }
      }
    } catch (err) {
      console.error('VIP action error:', err);
      setVipState({ loading: false, error: err.message });
      setResp(`Error: ${err.message}`);
      setSubmitting(false);
    }
  };

  const handleGrantVIP = async (userId) => {
    if (!grantReason.trim()) {
      setError('Please provide a reason for granting VIP status');
      return;
    }

    try {
      const response = await requestGrantVIP(userId, grantReason);
      if (response.error) {
        setError(response.error);
        return;
      }
      setShowModal(false);
      setGrantReason('');
      loadVIPUsers();
    } catch (err) {
      setError('Failed to grant VIP status');
      console.error('Error granting VIP:', err);
    }
  };

  const handleRevokeVIP = async (user) => {
    if (!user || !user.id) {
      setError('Invalid user data');
      return;
    }

    try {
      setVipState({ loading: true, error: null });
      const response = await requestRevokeVIP(user.id, revokeReason || 'VIP status revoked by admin');
      
      if (response.error) {
        setError(response.error);
        setVipState({ loading: false, error: response.error });
        return;
      }
      
      // Refresh the VIP users list
      await loadVIPUsers();
      
      // Show success message
      setResp(`Successfully revoked VIP status from user ${user.name}`);
      
      // Close modal if it's open
      setShowModal(false);
      setRevokeReason('');
      setVipState({ loading: false, error: null });
    } catch (err) {
      console.error('Error revoking VIP:', err);
      setError('Failed to revoke VIP status');
      setVipState({ loading: false, error: err.message });
    }
  };

  // VIP kullanıcıları filtreleme
  const filteredUsers = Array.isArray(vipUsers) ? vipUsers.filter(user => 
    user && user.name && user.name.toLowerCase().includes(searchTerm.toLowerCase())
  ) : [];

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'online': return 'text-green-500';
      case 'away': return 'text-yellow-500';
      default: return 'text-gray-500';
    }
  };

  const styles = {
    container: {
        maxWidth: '1200px',
        margin: '2rem auto',
        padding: '2rem',
        background: 'linear-gradient(145deg, #1a1a1a, #2a2a2a)',
        borderRadius: '16px',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
        color: '#fff',
        fontFamily: 'Montserrat, sans-serif'
    },
    searchBar: {
        width: '100%',
        padding: '1rem',
        marginBottom: '2rem',
        background: 'rgba(255, 255, 255, 0.05)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        borderRadius: '12px',
        color: '#fff',
        fontSize: '1rem',
        transition: 'all 0.3s ease',
        '&:focus': {
            outline: 'none',
            borderColor: '#4a90e2',
            boxShadow: '0 0 0 2px rgba(74, 144, 226, 0.2)'
        }
    },
    userGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
        gap: '1.25rem',
        marginTop: '1.5rem',
        width: '100%',
    },
    userCard: {
        background: 'linear-gradient(135deg, #232526 0%, #414345 100%)',
        borderRadius: '14px',
        padding: '1.25rem',
        display: 'flex',
        gap: '1rem',
        alignItems: 'center',
        boxShadow: '0 4px 16px rgba(0,0,0,0.18)',
        border: '1px solid rgba(255,255,255,0.07)',
        transition: 'transform 0.2s, box-shadow 0.2s',
        minHeight: '140px',
        position: 'relative',
        overflow: 'hidden',
    },
    avatarSection: {
        flex: '0 0 72px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    avatar: {
        width: '72px',
        height: '72px',
        borderRadius: '50%',
        objectFit: 'cover',
        boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
        border: '2px solid #333',
        background: '#222',
    },
    userInfo: {
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        gap: '0.5rem',
        minWidth: 0,
    },
    userName: {
        fontSize: '1.1rem',
        fontWeight: 600,
        color: '#fff',
        margin: 0,
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
    },
    userStats: {
        display: 'flex',
        gap: '1.2rem',
        fontSize: '0.95rem',
        color: '#bbb',
        flexWrap: 'wrap',
    },
    stat: {
        display: 'flex',
        alignItems: 'center',
        gap: '0.3rem',
    },
    statusIndicator: {
        display: 'inline-block',
        width: '8px',
        height: '8px',
        borderRadius: '50%',
        marginRight: '4px',
        background: '#bbb',
    },
    statusOnline: {
        background: '#4CAF50',
    },
    statusOffline: {
        background: '#757575',
    },
    vipStatus: {
        display: 'inline-block',
        padding: '0.25rem 0.75rem',
        borderRadius: '6px',
        fontSize: '0.85rem',
        fontWeight: '500',
        marginTop: '0.5rem'
    },
    vipActive: {
        background: 'linear-gradient(145deg, #4CAF50, #45a049)',
        color: '#fff'
    },
    vipInactive: {
        background: 'linear-gradient(145deg, #9e9e9e, #757575)',
        color: '#fff'
    },
    actionButtons: {
        display: 'flex',
        gap: '0.75rem',
        marginTop: '1rem'
    },
    grantButton: {
        padding: '0.5rem 1rem',
        background: 'linear-gradient(145deg, #4a90e2, #357abd)',
        border: 'none',
        borderRadius: '6px',
        color: '#fff',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        '&:hover': {
            background: 'linear-gradient(145deg, #5a9fe2, #458bcd)',
            transform: 'translateY(-2px)'
        }
    },
    revokeButton: {
        padding: '0.5rem 1rem',
        background: 'linear-gradient(145deg, #e74c3c, #c0392b)',
        border: 'none',
        borderRadius: '6px',
        color: '#fff',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        '&:hover': {
            background: 'linear-gradient(145deg, #f74c3c, #d0392b)',
            transform: 'translateY(-2px)'
        }
    },
    modal: {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0, 0, 0, 0.8)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000
    },
    modalContent: {
        background: 'linear-gradient(145deg, #2a2a2a, #252525)',
        padding: '2rem',
        borderRadius: '12px',
        width: '90%',
        maxWidth: '500px',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)'
    },
    modalTitle: {
        fontSize: '1.5rem',
        fontWeight: '600',
        marginBottom: '1.5rem',
        color: '#fff'
    },
    textarea: {
        width: '100%',
        minHeight: '120px',
        padding: '1rem',
        background: 'rgba(255, 255, 255, 0.05)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        borderRadius: '8px',
        color: '#fff',
        fontSize: '1rem',
        marginBottom: '1.5rem',
        resize: 'vertical',
        '&:focus': {
            outline: 'none',
            borderColor: '#4a90e2',
            boxShadow: '0 0 0 2px rgba(74, 144, 226, 0.2)'
        }
    },
    modalButtons: {
        display: 'flex',
        gap: '1rem',
        justifyContent: 'flex-end'
    },
    cancelButton: {
        padding: '0.75rem 1.5rem',
        background: 'rgba(255, 255, 255, 0.1)',
        border: 'none',
        borderRadius: '6px',
        color: '#fff',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        '&:hover': {
            background: 'rgba(255, 255, 255, 0.15)'
        }
    },
    confirmButton: {
        padding: '0.75rem 1.5rem',
        background: 'linear-gradient(145deg, #4a90e2, #357abd)',
        border: 'none',
        borderRadius: '6px',
        color: '#fff',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        '&:hover': {
            background: 'linear-gradient(145deg, #5a9fe2, #458bcd)'
        }
    },
    loading: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '200px'
    },
    error: {
        background: 'rgba(231, 76, 60, 0.1)',
        border: '1px solid #e74c3c',
        padding: '1rem',
        borderRadius: '8px',
        color: '#e74c3c',
        marginBottom: '1rem'
    }
  };

  const toggleMusic = () => {
    if (audioRef.current) {
      if (musicPlayer.isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch(err => console.log('Play prevented:', err));
      }
      const newState = { ...musicPlayer, isPlaying: !musicPlayer.isPlaying };
      setMusicPlayer(newState);
      localStorage.setItem('musicPlaying', newState.isPlaying);
    }
  };

  const changeVolume = (e) => {
    const newVolume = parseFloat(e.target.value);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
      const newState = { ...musicPlayer, volume: newVolume };
      setMusicPlayer(newState);
      localStorage.setItem('musicVolume', newVolume);
    }
  };

  const changeTrack = (index) => {
    if (audioRef.current) {
      audioRef.current.src = playlist[index].url;
      if (musicPlayer.isPlaying) {
        audioRef.current.play().catch(err => console.log('Play prevented:', err));
      }
      const newState = { ...musicPlayer, currentTrack: index };
      setMusicPlayer(newState);
      localStorage.setItem('currentTrack', index);
    }
  };

  // Admin ve Owner yönetimi sadece Owner'a açık
  const showAdminManagement = userRole === 3; // 3 = Owner
  const showOwnerManagement = userRole === 3; // 3 = Owner

  // VIP yönetimi Admin ve Owner'a açık
  const showVIPManagement = userRole >= 1; // 1: Admin, 2: Mod, 3: Owner

  // Badge yönetimi Admin ve Owner'a açık
  const showBadgeManagement = userRole >= 1; // 1: Admin, 2: Mod, 3: Owner

  const handleAnnounceSubmit = async (e) => {
    e.preventDefault();
    if (!announceTitle.trim() || !announceMessage.trim()) {
      setAnnounceResp('Başlık ve mesaj zorunlu!');
      return;
    }
    setAnnounceLoading(true);
    setAnnounceResp(null);
    try {
      const resp = await fetch('/api/announce', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          title: announceTitle,
          message: announceMessage,
          targetUserId: announceTargetUserId.trim() ? parseInt(announceTargetUserId, 10) : null
        })
      });
      if (resp.ok) {
        const data = await resp.json();
        setAnnounceData(data);
        setAnnounceResp('Duyuru başarıyla gönderildi!');
        setAnnounceTitle('');
        setAnnounceMessage('');
        setAnnounceTargetUserId('');
      } else {
        const data = await resp.json();
        setAnnounceResp(data.error || 'Duyuru gönderilemedi!');
      }
    } catch (err) {
      setAnnounceResp('Sunucu hatası!');
    }
    setAnnounceLoading(false);
  };

  return (
    <div style={styles.container}>
      {/* DUYURU GÖNDERME FORMU */}
      <div style={{ background: '#232526', padding: '1rem', borderRadius: 10, marginBottom: 24 }}>
        <h2 style={{ margin: 0, marginBottom: 8 }}>Duyuru Gönder</h2>
        <form onSubmit={handleAnnounceSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <input
            type="text"
            placeholder="Başlık"
            value={announceTitle}
            onChange={e => setAnnounceTitle(e.target.value)}
            style={{ padding: 8, borderRadius: 6, border: '1px solid #444', marginBottom: 4 }}
            maxLength={100}
          />
          <textarea
            placeholder="Mesaj"
            value={announceMessage}
            onChange={e => setAnnounceMessage(e.target.value)}
            style={{ padding: 8, borderRadius: 6, border: '1px solid #444', minHeight: 60, marginBottom: 4 }}
            maxLength={1000}
          />
          <input
            type="text"
            placeholder="Hedef Kullanıcı ID (boş bırakılırsa herkese gönderilir)"
            value={announceTargetUserId}
            onChange={e => setAnnounceTargetUserId(e.target.value)}
            style={{ padding: 8, borderRadius: 6, border: '1px solid #444', marginBottom: 4 }}
          />
          <button type="submit" disabled={announceLoading} style={{ padding: 8, borderRadius: 6, background: '#4a90e2', color: '#fff', border: 'none', fontWeight: 'bold' }}>
            {announceLoading ? 'Gönderiliyor...' : 'Duyuru Gönder'}
          </button>
          {announceResp && <div style={{ marginTop: 8, color: announceResp.includes('başarı') ? 'lightgreen' : 'salmon' }}>{announceResp}</div>}
        </form>
      </div>
      {/* Music Player */}
      <div style={{
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        background: 'rgba(0, 0, 0, 0.8)',
        padding: '15px',
        borderRadius: '10px',
        zIndex: 1000,
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        minWidth: '250px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button
            onClick={toggleMusic}
            style={{
              background: 'none',
              border: 'none',
              color: '#fff',
              cursor: 'pointer',
              fontSize: '24px'
            }}
          >
            {musicPlayer.isPlaying ? '⏸️' : '▶️'}
          </button>
          <span style={{ color: '#fff' }}>{playlist[musicPlayer.currentTrack].title}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ color: '#fff' }}>🔈</span>
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={musicPlayer.volume}
            onChange={changeVolume}
            style={{ width: '100px' }}
          />
          <span style={{ color: '#fff' }}>🔊</span>
        </div>
        <div style={{ display: 'flex', gap: '5px' }}>
          {playlist.map((track, index) => (
            <button
              key={index}
              onClick={() => changeTrack(index)}
              style={{
                background: musicPlayer.currentTrack === index ? '#4a90e2' : '#333',
                border: 'none',
                color: '#fff',
                padding: '5px 10px',
                borderRadius: '5px',
                cursor: 'pointer'
              }}
            >
              {index + 1}
            </button>
          ))}
        </div>
      </div>

      {resp && (
        <div className="respbox">
          {(typeof resp === 'string' ? resp.split('\n') : [resp]).map((line) => (
            <p key={line.slice(0, 3)}>
              {line}
            </p>
          ))}
          <span
            role="button"
            tabIndex={-1}
            className="modallink"
            onClick={() => setResp(null)}
          >
            {t`Close`}
          </span>
        </div>
      )}
      <div>
        <br />
        <h3>{t`IP Actions`}</h3>
        <p>
          {t`Do stuff with IPs (one IP per line)`}
        </p>
        <select
          value={iPAction}
          onChange={(e) => {
            const sel = e.target;
            selectIPAction(sel.options[sel.selectedIndex].value);
          }}
        >
          {['iidtoip', 'iptoiid']
            .map((opt) => (
              <option
                key={opt}
                value={opt}
              >
                {opt}
              </option>
            ))}
        </select>
        <br />
        <textarea
          rows="10"
          cols="17"
          value={txtval}
          onChange={(e) => setTxtval(e.target.value)}
        /><br />
        <button
          type="button"
          onClick={() => {
            if (submitting) {
              return;
            }
            setSubmitting(true);
            submitIPAction(
              iPAction,
              txtval,
              (ret) => {
                setSubmitting(false);
                setTxtval(ret);
              },
            );
          }}
        >
          {(submitting) ? '...' : t`Submit`}
        </button>
        <br />
        <div className="modaldivider" />
        <h3>{t`Manage Moderators`}</h3>
        <p>
          {t`Remove Moderator`}
        </p>
        {(modlist.length) ? (
          <span
            className="unblocklist"
          >
            {modlist.map((mod) => (
              <div
                role="button"
                tabIndex={0}
                key={mod[0]}
                onClick={() => {
                  if (submitting) {
                    return;
                  }
                  setSubmitting(true);
                  submitRemMod(mod[0], (success, ret) => {
                    if (success) {
                      setModList(
                        modlist.filter((modl) => (modl[0] !== mod[0])),
                      );
                    }
                    setSubmitting(false);
                    setResp(ret);
                  });
                }}
              >
                {`⦸ ${mod[0]} ${mod[1]}`}
              </div>
            ))}
          </span>
        )
          : (
            <p>{t`There are no mods`}</p>
          )}
        <br />

        <p>
          {t`Assign new Mod`}
        </p>
        <p>
          {t`Enter UserName of new Mod`}:&nbsp;
          <input
            value={modName}
            style={{
              display: 'inline-block',
              width: '100%',
              maxWidth: '20em',
            }}
            type="text"
            placeholder={t`User Name`}
            onChange={(evt) => {
              const co = evt.target.value.trim();
              selectModName(co);
            }}
          />
        </p>
        <button
          type="button"
          onClick={() => {
            if (submitting) {
              return;
            }
            setSubmitting(true);
            submitMakeMod(
              modName,
              (ret) => {
                if (typeof ret === 'string') {
                  setResp(ret);
                } else {
                  setResp(`Made ${ret[1]} mod successfully.`);
                  setModList([...modlist, ret]);
                }
                setSubmitting(false);
              },
            );
          }}
        >
          {(submitting) ? '...' : t`Submit`}
        </button>

        {showAdminManagement && (
          <>
            <div className="modaldivider" />
            <h3>{t`Admin Management`}</h3>
            <p>{t`Current Admins`}</p>
            {(adminlist.length) ? (
              <span className="unblocklist">
                {adminlist.map((admin) => (
                  <div
                    role="button"
                    tabIndex={0}
                    key={admin[0]}
                    onClick={() => {
                      if (submitting) return;
                      setSubmitting(true);
                      submitRemAdmin(admin[0], (success, ret) => {
                        if (success) {
                          setAdminList(adminlist.filter((a) => a[0] !== admin[0]));
                        }
                        setSubmitting(false);
                        setResp(ret);
                      });
                    }}
                  >
                    {`⦸ ${admin[0]} ${admin[1]}`}
                  </div>
                ))}
              </span>
            ) : (
              <p>{t`There are no admins`}</p>
            )}
            <br />
            <p>{t`Assign new Admin`}</p>
            <p>
              {t`Enter UserName of new Admin`}:&nbsp;
              <input
                value={adminName}
                style={{
                  display: 'inline-block',
                  width: '100%',
                  maxWidth: '20em',
                }}
                type="text"
                placeholder={t`User Name`}
                onChange={(evt) => {
                  const co = evt.target.value.trim();
                  setAdminName(co);
                }}
              />
            </p>
            <button
              type="button"
              onClick={() => {
                if (submitting) return;
                setSubmitting(true);
                submitMakeAdmin(adminName, (ret) => {
                  setSubmitting(false);
                  setResp(ret);
                  if (Array.isArray(ret)) {
                    setAdminList([...adminlist, ret]);
                    setAdminName('');
                  }
                });
              }}
            >
              {t`Make Admin`}
            </button>
          </>
        )}

        {showOwnerManagement && (
          <>
            <div className="modaldivider" />
            <h3>{t`Owner Management`}</h3>
            <p>{t`Current Owners`}</p>
            {(ownerlist.length) ? (
              <span className="unblocklist">
                {ownerlist.map((owner) => (
                  <div
                    role="button"
                    tabIndex={0}
                    key={owner[0]}
                    onClick={() => {
                      if (submitting) return;
                      setSubmitting(true);
                      submitRemOwner(owner[0], (success, ret) => {
                        if (success) {
                          setOwnerList(ownerlist.filter((o) => o[0] !== owner[0]));
                        }
                        setSubmitting(false);
                        setResp(ret);
                      });
                    }}
                  >
                    {`⦸ ${owner[0]} ${owner[1]}`}
                  </div>
                ))}
              </span>
            ) : (
              <p>{t`There are no owners`}</p>
            )}
            <br />
            <p>{t`Assign new Owner`}</p>
            <p>
              {t`Enter UserName of new Owner`}:&nbsp;
              <input
                value={ownerName}
                style={{
                  display: 'inline-block',
                  width: '100%',
                  maxWidth: '20em',
                }}
                type="text"
                placeholder={t`User Name`}
                onChange={(evt) => {
                  const co = evt.target.value.trim();
                  setOwnerName(co);
                }}
              />
            </p>
            <button
              type="button"
              onClick={() => {
                if (submitting) return;
                setSubmitting(true);
                submitMakeOwner(ownerName, (ret) => {
                  setSubmitting(false);
                  setResp(ret);
                  if (Array.isArray(ret)) {
                    setOwnerList([...ownerlist, ret]);
                    setOwnerName('');
                  }
                });
              }}
            >
              {t`Make Owner`}
            </button>
          </>
        )}

        {showVIPManagement && (
          <>
            <div className="modaldivider" />
            <h3>{t`VIP Management`}</h3>
            <div style={{ marginBottom: '20px' }}>
              <div className="flex flex-col space-y-4">
                <div className="flex items-center space-x-4">
                  <label className="text-white">Action:</label>
                  <select
                    value={vipAction}
                    onChange={(e) => setVipAction(e.target.value)}
                    className="bg-gray-700 text-white px-3 py-2 rounded"
                  >
                    <option value="grant">Grant VIP</option>
                    <option value="revoke">Revoke VIP</option>
                  </select>
                </div>

                <div className="flex flex-col space-y-2">
                  <label className="text-white">User ID(s):</label>
                  <textarea
                    value={txtval}
                    onChange={(e) => setTxtval(e.target.value)}
                    className="bg-gray-700 text-white px-3 py-2 rounded"
                    placeholder="Enter user ID(s), one per line"
                    rows="3"
                  />
                </div>

                {vipAction === 'grant' && (
                  <>
                    <div className="flex items-center space-x-4">
                      <label className="text-white">VIP Level:</label>
                      <select
                        value={vipLevel}
                        onChange={(e) => setVipLevel(Number(e.target.value))}
                        className="bg-gray-700 text-white px-3 py-2 rounded"
                      >
                        <option value={1}>VIP (Level 1)</option>
                        <option value={2}>VIP+ (Level 2)</option>
                        <option value={3}>VIP Premium (Level 3)</option>
                      </select>
                    </div>
                    <div className="flex items-center space-x-4">
                      <label className="text-white">Reason:</label>
                      <input
                        type="text"
                        value={vipReason}
                        onChange={(e) => setVipReason(e.target.value)}
                        className="bg-gray-700 text-white px-3 py-2 rounded flex-grow"
                        placeholder="Enter reason for granting VIP"
                      />
                    </div>
                  </>
                )}

                <button
                  onClick={handleVIPAction}
                  disabled={submitting}
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:bg-gray-500"
                >
                  {submitting ? 'Processing...' : vipAction === 'grant' ? 'Grant VIP' : 'Revoke VIP'}
                </button>

                {vipState.error && (
                  <div className="text-red-500 mt-2">
                    {vipState.error}
                  </div>
                )}

                {resp && (
                  <div className="mt-4 p-4 bg-gray-800 rounded">
                    <pre className="text-white whitespace-pre-wrap">{resp}</pre>
                  </div>
                )}
              </div>

              {/* VIP Users List */}
              <div style={{ 
                display: 'grid', 
                gap: '10px',
                maxHeight: '300px',
                overflowY: 'auto',
                padding: '10px',
                background: '#1a1a1a',
                borderRadius: '4px',
                scrollbarWidth: 'thin',
                scrollbarColor: '#4a90e2 #232526',
              }} className="vip-scrollbar">
                {loading ? (
                  <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                  </div>
                ) : filteredUsers.length === 0 ? (
                  <div className="text-center text-gray-500 py-8">
                    {t`No VIP users found`}
                  </div>
                ) : (
                  <div style={styles.userGrid}>
                    {filteredUsers.map((user) => (
                      <div key={user.id} style={styles.userCard}>
                        <div style={styles.avatarSection}>
                          <img
                            src={user.avatar || '/tile.png'}
                            alt={user.name}
                            style={styles.avatar}
                          />
                        </div>
                        <div style={styles.userInfo}>
                          <h3 style={styles.userName}>{user.name}</h3>
                          <div style={styles.userStats}>
                            <div style={styles.stat}>
                              <span style={styles.statusIndicator} className={user.status === 'online' ? styles.statusOnline : styles.statusOffline}></span>
                              {user.status}
                            </div>
                            <div style={styles.stat}>
                              {user.totalPixels} pixels
                            </div>
                            <div style={styles.stat}>
                              {user.totalBadges} badges
                            </div>
                          </div>
                          <div style={styles.vipStatus} className={styles.vipActive}>
                            VIP Active
                          </div>
                          {user.vipReason && (
                            <div style={{ color: '#888', fontSize: '0.9rem' }}>
                              Reason: {user.vipReason}
                            </div>
                          )}
                          <div style={styles.actionButtons}>
                            <button
                              onClick={() => handleRevokeVIP(user)}
                              style={styles.revokeButton}
                            >
                              Revoke VIP
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="modaldivider" />
            <h3>{t`Grant Badge`}</h3>
            <div style={{ marginBottom: '20px' }}>
              <p>{t`Enter user IDs (one per line) and a badge ID to grant a badge.`}</p>
              <textarea
                rows="5"
                cols="17"
                value={txtval}
                onChange={(e) => setTxtval(e.target.value)}
                style={{ marginBottom: '10px' }}
              />
              <input
                type="number"
                placeholder="Badge ID"
                value={badgeId}
                onChange={(e) => setBadgeId(e.target.value)}
                style={{ marginBottom: '10px', width: '100%' }}
              />
              <button
                type="button"
                onClick={() => {
                  if (submitting) return;
                  setSubmitting(true);
                  submitGrantBadge(txtval, badgeId, (success, ret) => {
                    setSubmitting(false);
                    setResp(ret);
                    if (success) {
                      loadBadges();
                    }
                  });
                }}
              >
                {(submitting) ? "..." : t`Grant Badge`}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default Admintools;