'use client';

import GameForm from '@/components/Form/GameForm';
import { useSession } from 'next-auth/react';

const content = {
  title: 'Create Game',
  buttonText: 'Create',
};

const page = () => {
  const session = useSession();
  return (
    <div>
      <GameForm content={content} />
    </div>
  );
};

export default page;
