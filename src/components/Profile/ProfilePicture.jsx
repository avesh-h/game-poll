'use client';

import React from 'react';

import CameraAltIcon from '@mui/icons-material/CameraAlt';
import Image from 'next/image';

import styles from './profile.module.css';

const ProfilePicture = ({ setValue, profilePicture }) => {
  const changeHandler = (e) => {
    if (e?.target?.files) {
      setValue('profileImage', e?.target?.files?.[0]);
    }
  };
  return (
    <div className={styles.profilePic}>
      <label className={styles.label} htmlFor="file">
        <CameraAltIcon />
        <span className={styles.spanText}>Change Image</span>
      </label>
      <input
        className={styles.inputField}
        id="file"
        type="file"
        onChange={changeHandler}
        name="profileImg"
      />
      <Image
        src={profilePicture}
        className={styles.imageComponent}
        id="output"
        alt="profile"
        width="200"
        height="200"
      />
    </div>
  );
};

export default ProfilePicture;
