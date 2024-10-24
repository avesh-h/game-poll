'use client';

import React from 'react';

import { notFound, useParams } from 'next/navigation';

import MemberForm from '@/components/Form/MemberForm';
import Loader from '@/components/Loader/loader';
import { useGetSingleGameQuery } from '@/lib/actions/gameActions';

const MemberPage = () => {
  const param = useParams();
  const { data, isLoading } = useGetSingleGameQuery(param?.['gameId']);

  if (!data && !isLoading) {
    // If no data is returned, trigger the 404 error page
    return notFound();
  }

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <>
          <div>
            <MemberForm />
          </div>
        </>
      )}
    </>
  );
};

export default MemberPage;
