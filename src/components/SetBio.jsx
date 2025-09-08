import React, { useState } from 'react';
import { t } from 'ttag';
import { requestUpdateProfile } from '../store/actions/fetch';

const SetBio = ({ done }) => {
    const [bio, setBio] = useState('');
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setSuccess(false);

        try {
            const response = await requestUpdateProfile({ bio });
            console.log('Bio update response:', response); // Debug log

            if (response.success) {
                setSuccess(true);
                setTimeout(() => {
                    done();
                }, 1500);
            } else if (response.errors) {
                throw new Error(response.errors[0]);
            }
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div style={{
            background: 'linear-gradient(145deg, #1a1a1a, #2a2a2a)',
            padding: '2rem',
            borderRadius: '12px',
            maxWidth: '500px',
            margin: '2rem auto',
            color: '#fff',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)'
        }}>
            <h2 style={{ marginBottom: '1.5rem', fontSize: '1.5rem', fontWeight: '600' }}>{t`Update Bio`}</h2>
            
            <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: '1.5rem' }}>
                    <label style={{ display: 'block', marginBottom: '0.5rem', color: '#888' }}>
                        {t`Your Bio`}
                    </label>
                    <textarea
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                        style={{
                            width: '100%',
                            minHeight: '120px',
                            padding: '1rem',
                            background: 'rgba(255, 255, 255, 0.05)',
                            border: '1px solid rgba(255, 255, 255, 0.1)',
                            borderRadius: '8px',
                            color: '#fff',
                            fontSize: '1rem',
                            resize: 'vertical'
                        }}
                        placeholder={t`Write something about yourself...`}
                    />
                </div>

                {error && (
                    <div style={{
                        background: 'rgba(231, 76, 60, 0.1)',
                        border: '1px solid #e74c3c',
                        padding: '1rem',
                        borderRadius: '8px',
                        color: '#e74c3c',
                        marginBottom: '1rem'
                    }}>
                        {error}
                    </div>
                )}

                {success && (
                    <div style={{
                        background: 'rgba(46, 204, 113, 0.1)',
                        border: '1px solid #2ecc71',
                        padding: '1rem',
                        borderRadius: '8px',
                        color: '#2ecc71',
                        marginBottom: '1rem'
                    }}>
                        {t`Bio updated successfully!`}
                    </div>
                )}

                <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                    <button
                        type="button"
                        onClick={done}
                        style={{
                            padding: '0.75rem 1.5rem',
                            background: 'rgba(255, 255, 255, 0.1)',
                            border: 'none',
                            borderRadius: '6px',
                            color: '#fff',
                            cursor: 'pointer',
                            transition: 'all 0.3s ease'
                        }}
                    >
                        {t`Cancel`}
                    </button>
                    <button
                        type="submit"
                        style={{
                            padding: '0.75rem 1.5rem',
                            background: 'linear-gradient(145deg, #4a90e2, #357abd)',
                            border: 'none',
                            borderRadius: '6px',
                            color: '#fff',
                            cursor: 'pointer',
                            transition: 'all 0.3s ease'
                        }}
                    >
                        {t`Update Bio`}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default SetBio; 