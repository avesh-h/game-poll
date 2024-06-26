'use client';

import { useRouter } from 'next/navigation';

import MuiButton from '@/components/Buttons/Button';

//TODO:Need to design user profile dashboard page.
const Dashboard = () => {
  const router = useRouter();
  return (
    <div>
      <MuiButton
        title={'Create Game'}
        onClick={() => router.push('/create-game')}
      />
    </div>
  );
};

export default Dashboard;
