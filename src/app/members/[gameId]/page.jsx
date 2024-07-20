'use client';

import React from 'react';

import { useParams } from 'next/navigation';

import MemberForm from '@/components/Form/MemberForm';
import Loader from '@/components/Loader/loader';
import { useGetSingleGameQuery } from '@/lib/actions/gameActions';

const MemberPage = () => {
  const param = useParams();
  const { data, isLoading } = useGetSingleGameQuery(param?.['gameId']);

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <>
          {data ? (
            <div>
              <MemberForm />
            </div>
          ) : (
            <>404 page not found!</>
          )}
        </>
      )}
    </>
  );
};

export default MemberPage;
