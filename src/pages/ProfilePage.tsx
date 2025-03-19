
import React from 'react';
import { Helmet } from 'react-helmet-async';
import AppLayout from '@/components/AppLayout';
import ProfileForm from '@/components/profile/ProfileForm';

const ProfilePage: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>Profile - AI Ad Guru</title>
      </Helmet>
      <AppLayout activePage="profile">
        <div className="container p-6 mx-auto max-w-4xl">
          <h1 className="text-3xl font-bold mb-8">Your Profile</h1>
          <ProfileForm />
        </div>
      </AppLayout>
    </>
  );
};

export default ProfilePage;
