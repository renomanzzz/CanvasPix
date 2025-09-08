/*
 * Admintools
 */

import React, { useState, useEffect } from 'react';
import { t } from 'ttag';

import { parseInterval } from '../core/utils';
import { shardOrigin } from '../store/actions/fetch';
import {
  requestCreateBadge,
  requestUpdateBadge,
  requestDeleteBadge,
  requestBadgeList,
  requestGrantBadge,
} from '../store/actions/fetch';

async function submitIIDAction(
  action,
  iid,
  reason,
  duration,
  callback,
) {
  let time = parseInterval(duration);
  if (time === 0 && duration !== '0') {
    callback(t`You must enter a duration`);
    return;
  }
  if (!iid) {
    callback(t`You must enter an IID`);
    return;
  }
  if (time > 0) {
    time += Date.now();
  }
  const data = new FormData();
  data.append('iidaction', action);
  data.append('reason', reason);
  data.append('time', time);
  data.append('iid', iid);
  const resp = await fetch(`${shardOrigin}/api/modtools`, {
    credentials: 'include',
    method: 'POST',
    body: data,
  });
  callback(await resp.text());
}

function ModIIDtools() {
  const [iIDAction, selectIIDAction] = useState('givecaptcha');
  const [iid, selectIid] = useState('');
  const [reason, setReason] = useState('');
  const [duration, setDuration] = useState('1d');
  const [resp, setResp] = useState('');
  const [submitting, setSubmitting] = useState(false);
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

  useEffect(() => {
    loadBadges();
  }, []);

  const loadBadges = async () => {
    const response = await requestBadgeList();
    if (!response.errors) {
      setBadges(response);
    }
  };

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

  const handleGrantBadge = async (userId, badgeId) => {
    if (submitting) return;
    setSubmitting(true);

    try {
      const response = await requestGrantBadge(userId, badgeId);
      if (response.errors) {
        setResp(response.errors[0]);
      } else {
        setResp(t`Badge granted successfully`);
      }
    } catch (err) {
      setResp(err.message);
    }
    setSubmitting(false);
  };

  return (
    <div style={{ textAlign: 'center', paddingLeft: '5%', paddingRight: '5%' }}>
      {resp && (
        <div className="respbox">
          {resp.split('\n').map((line) => (
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

      <h3>{t`IID Actions`}</h3>
      <select
        value={iIDAction}
        onChange={(e) => {
          const sel = e.target;
          selectIIDAction(sel.options[sel.selectedIndex].value);
        }}
      >
        {['status', 'givecaptcha', 'ban', 'unban', 'whitelist', 'unwhitelist', 'givevip', 'removevip']
          .map((opt) => (
            <option
              key={opt}
              value={opt}
            >
              {opt === 'givevip' ? t`Give VIP` : 
               opt === 'removevip' ? t`Remove VIP` :
               opt}
            </option>
          ))}
      </select>
      {(iIDAction === 'ban' || iIDAction === 'givevip') && (
        <React.Fragment key={iIDAction}>
          <p>{t`Reason`}</p>
          <input
            maxLength="200"
            style={{
              width: '100%',
            }}
            value={reason}
            placeholder={t`Enter Reason`}
            onChange={(evt) => setReason(evt.target.value)}
          />
          {iIDAction === 'ban' && (
          <p>
            {`${t`Duration`}: `}
            <input
              style={{
                display: 'inline-block',
                width: '100%',
                maxWidth: '7em',
              }}
              value={duration}
              placeholder="1d"
              onChange={(evt) => {
                setDuration(evt.target.value.trim());
              }}
            />
            {t`(0 = infinite)`}
          </p>
          )}
        </React.Fragment>
      )}
      <p>
        {' IID: '}
        <input
          value={iid}
          style={{
            display: 'inline-block',
            width: '100%',
            maxWidth: '10em',
          }}
          type="text"
          placeholder="xxxx-xxxxx-xxxx"
          onChange={(evt) => {
            selectIid(evt.target.value.trim());
          }}
        />
        <button
          type="button"
          onClick={() => {
            if (submitting) {
              return;
            }
            setSubmitting(true);
            submitIIDAction(
              iIDAction,
              iid,
              reason,
              duration,
              (ret) => {
                setSubmitting(false);
                setResp(ret);
              },
            );
          }}
        >
          {(submitting) ? '...' : t`Submit`}
        </button>
      </p>
      <textarea
        style={{
          width: '100%',
        }}
        rows={(resp) ? resp.split('\n').length : 10}
        value={resp}
        readOnly
      />

      <div className="modaldivider" />
      <h3>{t`Badge Management`}</h3>
      
      {/* Rozet Listesi */}
      <div className="badge-list" style={{ marginBottom: '20px' }}>
        <h4>{t`Existing Badges`}</h4>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '10px' }}>
          {badges.map(badge => (
            <div key={badge.id} style={{ 
              padding: '10px', 
              background: '#2a2a2a', 
              borderRadius: '4px',
              display: 'flex',
              flexDirection: 'column',
              gap: '5px'
            }}>
              <img src={badge.image} alt={badge.name} style={{ width: '32px', height: '32px' }} />
              <span style={{ fontWeight: 'bold' }}>{badge.name}</span>
              <span style={{ fontSize: '0.8em', color: '#888' }}>{badge.description}</span>
              <span style={{ fontSize: '0.8em' }}>Rarity: {badge.rarity}</span>
              <span style={{ fontSize: '0.8em', color: '#aaa', fontFamily: 'monospace' }}>ID: {badge.id}</span>
              <div style={{ display: 'flex', gap: '5px', marginTop: '5px' }}>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedBadge(badge);
                    setBadgeForm({
                      name: badge.name,
                      description: badge.description,
                      rarity: badge.rarity,
                      image: badge.image,
                      requirements: badge.requirements,
                      category: badge.category
                    });
                  }}
                >
                  {t`Edit`}
                </button>
                <button
                  type="button"
                  onClick={() => handleDeleteBadge(badge.id)}
                  style={{ background: '#ff4444' }}
                >
                  {t`Delete`}
                </button>
                <button
                  type="button"
                  onClick={() => handleGrantBadge(iid, badge.id)}
                  style={{ background: '#44ff44' }}
                >
                  {t`Grant`}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Rozet Formu */}
      <form onSubmit={handleBadgeSubmit} style={{ marginTop: '20px' }}>
        <h4>{selectedBadge ? t`Edit Badge` : t`Create New Badge`}</h4>
        
        <div style={{ marginBottom: '10px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>{t`Name`}</label>
          <input
            type="text"
            value={badgeForm.name}
            onChange={(e) => setBadgeForm({ ...badgeForm, name: e.target.value })}
            required
            style={{ width: '100%', padding: '5px' }}
          />
        </div>

        <div style={{ marginBottom: '10px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>{t`Description`}</label>
          <textarea
            value={badgeForm.description}
            onChange={(e) => setBadgeForm({ ...badgeForm, description: e.target.value })}
            required
            style={{ width: '100%', padding: '5px', minHeight: '60px' }}
          />
        </div>

        <div style={{ marginBottom: '10px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>{t`Rarity`}</label>
          <select
            value={badgeForm.rarity}
            onChange={(e) => setBadgeForm({ ...badgeForm, rarity: e.target.value })}
            style={{ width: '100%', padding: '5px' }}
          >
            <option value="common">{t`Common`}</option>
            <option value="rare">{t`Rare`}</option>
            <option value="epic">{t`Epic`}</option>
            <option value="legendary">{t`Legendary`}</option>
          </select>
        </div>

        <div style={{ marginBottom: '10px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>{t`Image URL`}</label>
          <input
            type="text"
            value={badgeForm.image}
            onChange={(e) => setBadgeForm({ ...badgeForm, image: e.target.value })}
            required
            style={{ width: '100%', padding: '5px' }}
          />
        </div>

        <div style={{ marginBottom: '10px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>{t`Category`}</label>
          <select
            value={badgeForm.category}
            onChange={(e) => setBadgeForm({ ...badgeForm, category: e.target.value })}
            style={{ width: '100%', padding: '5px' }}
          >
            <option value="activity">{t`Activity`}</option>
            <option value="community">{t`Community`}</option>
            <option value="achievement">{t`Achievement`}</option>
            <option value="special">{t`Special`}</option>
            <option value="seasonal">{t`Seasonal`}</option>
            <option value="technical">{t`Technical`}</option>
            <option value="social">{t`Social`}</option>
            <option value="milestone">{t`Milestone`}</option>
          </select>
        </div>

        <div style={{ marginBottom: '10px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>{t`Requirements (JSON)`}</label>
          <textarea
            value={JSON.stringify(badgeForm.requirements, null, 2)}
            onChange={(e) => {
              try {
                const requirements = JSON.parse(e.target.value);
                setBadgeForm({ ...badgeForm, requirements });
              } catch (err) {
                // JSON parse hatası durumunda sadece değeri güncelle
                setBadgeForm({ ...badgeForm, requirements: e.target.value });
              }
            }}
            style={{ width: '100%', padding: '5px', minHeight: '100px', fontFamily: 'monospace' }}
          />
        </div>

        <button
          type="submit"
          disabled={submitting}
          style={{ marginTop: '10px' }}
        >
          {submitting ? '...' : (selectedBadge ? t`Update Badge` : t`Create Badge`)}
        </button>

        {selectedBadge && (
          <button
            type="button"
            onClick={() => {
              setSelectedBadge(null);
              setBadgeForm({
                name: '',
                description: '',
                rarity: 'common',
                image: '',
                requirements: {},
                category: 'activity'
              });
            }}
            style={{ marginLeft: '10px' }}
          >
            {t`Cancel Edit`}
          </button>
        )}
      </form>
    </div>
  );
}

export default React.memo(ModIIDtools);
