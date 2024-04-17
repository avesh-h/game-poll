/* eslint-disable import/no-unresolved */
import { NextResponse } from 'next/server';

import gameDao from '@/lib/daos/gameDao';
import memberDao from '@/lib/daos/memberDao';
import { connectToDB } from '@/lib/dbHandler';
import { httpStatusCode } from '@/lib/httpStatusCode';
import { generateTokenForMember } from '@/lib/utils/generateMemberToken';

export const POST = async (req) => {
  const memberData = await req.json();
  try {
    await connectToDB();
    const game = await gameDao.getSingleGame(memberData?.gameId);

    //For new member
    if (memberData?.email) {
      const isSameMemberExist = game?.members?.find(
        (member) => member?.email === memberData?.email
      );
      if (isSameMemberExist) {
        return NextResponse.json(
          { error: 'Same email already exist!', status: 'failed' },
          { status: httpStatusCode.BAD_REQUEST }
        );
      }
    }
    if (memberData?.gamePassword !== game?.gamePassword) {
      return NextResponse.json(
        { error: 'Invalid password!', status: 'failed' },
        { status: httpStatusCode.BAD_REQUEST }
      );
    } else {
      let member;
      if (memberData?.isNewMember) {
        //We can add check here if user with same name is already exist in list than throw error from here
        //new member add
        member = await memberDao.createMember(memberData);
      } else {
        //existed member login for edit the details
        member = await gameDao.findMemberWithEmailOrName(
          memberData?.gameId,
          memberData?.email,
          memberData?.name
        );
        if (member?.message) {
          return NextResponse.json(
            { error: member, status: 'failed' },
            { status: httpStatusCode.NOT_FOUND }
          );
        }
      }
      const accessToken = generateTokenForMember(member);

      const response = NextResponse.json(
        { member, status: 'success' },
        { status: httpStatusCode.CREATED }
      );
      //Set token in cookie
      response.cookies.set('accessToken', accessToken);
      return response;
    }
  } catch (error) {
    return NextResponse.json({ error }, { status: httpStatusCode.FORBIDDEN });
  }
};

//Check access token is expiring or not or it also need to be delete from the cookie after the expired
