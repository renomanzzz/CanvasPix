/*
    * Change Avatar Form
 */

import React, { useState } from 'react';
import { t } from 'ttag';
import { useDispatch } from 'react-redux';

import { validateAvatar } from '../utils/validation';
import { requestSetAvatar } from '../store/actions/fetch';
import { setAvatar } from '../store/actions';


function validate(avatar) {
  const errors = [];

  const avatarerror = validateAvatar(avatar);
  if (avatarerror) errors.push(avatarerror);

  return errors;
}

const SetAvatar = ({ done }) => {
  const [avatar, setStAvatar] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState([]);

  const dispatch = useDispatch();

  const handleSubmit = async (evt) => {
    evt.preventDefault();
    if (submitting) {
      return;
    }

    const valErrors = validate(avatar);
    if (valErrors.length > 0) {
      setErrors(valErrors);
      return;
    }

    setSubmitting(true);
    const { errors: respErrors } = await requestSetAvatar(avatar);
    setSubmitting(false);
    if (respErrors) {
      setErrors(respErrors);
      return;
    }
    dispatch(setAvatar(avatar));
    done();
  };

  return (
    <div className="inarea">
      <form onSubmit={handleSubmit}>
        {errors.map((error) => (
          <p key={error} className="errormessage">
            <span>{t`Error`}</span>:&nbsp;{error}</p>
        ))}
        <input
          value={avatar}
        onChange={(evt) => setStAvatar(evt.target.value)}
          type="text"
          placeholder={t`New Avatar`}
        />
        <br />
        <button type="submit">
          {(submitting) ? '...' : t`Save`}
        </button>
        <button type="button" onClick={done}>{t`Cancel`}</button>
      </form>
    </div>
  );
};

export default React.memo(SetAvatar);
