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

    if (memberData?.isNewMember) {
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
      const createMember = await memberDao.createMember(memberData);
      //Add case of getting error while create new member here
      const accessToken = generateTokenForMember(createMember);

      const response = NextResponse.json(
        { member: createMember, status: 'success' },
        { status: httpStatusCode.CREATED }
      );
      //Set token in cookie
      response.cookies.set('accessToken', accessToken);
      return response;
    } else {
      //For existing account
      const existMember = await gameDao.findMemberWithEmailOrName(
        memberData?.gameId,
        memberData?.email,
        memberData?.name
      );
      if (!existMember) {
        return NextResponse.json(
          { error: 'Player does not exist!', status: 'failed' },
          { status: httpStatusCode.NOT_FOUND }
        );
      }
      const accessToken = generateTokenForMember(existMember);

      const response = NextResponse.json(
        { member: existMember, status: 'success' },
        { status: httpStatusCode.OK }
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
