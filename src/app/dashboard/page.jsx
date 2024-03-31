'use client';

import MuiButton from '@/components/Buttons/Button';
import { useRouter } from 'next/navigation';

const content = {
  title: 'Create Game',
  buttonText: 'Create',
};

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
