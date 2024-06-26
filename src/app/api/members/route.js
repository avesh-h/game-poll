import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

import { GAME_ORGANIZER } from '@/constants/role';
import gameDao from '@/lib/daos/gameDao';
import memberDao from '@/lib/daos/memberDao';
import { connectToDB } from '@/lib/dbHandler';
import { httpStatusCode } from '@/lib/httpStatusCode';
import { generateToken } from '@/lib/utils/generateToken';

export const POST = async (req) => {
  const memberData = await req.json();
  try {
    await connectToDB();
    const game = await gameDao.getSingleGame(memberData?.gameId);

    //For new member
    if (memberData?.email && memberData?.isNewMember) {
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
        const isSameMemberNameExist = game?.members?.find(
          (member) => member?.playerName === memberData?.name
        );
        if (isSameMemberNameExist) {
          return NextResponse.json(
            { error: 'Same name with player already exist!', status: 'failed' },
            { status: httpStatusCode.BAD_REQUEST }
          );
        }
        member = await memberDao.createMember(memberData);
      } else {
        //existed member login for edit the details
        member = await gameDao.findMemberWithEmailOrName(
          memberData?.gameId,
          memberData?.email,
          memberData?.name
        );
        if (member?.role === GAME_ORGANIZER) {
          //If Organizer logged through member form
          return NextResponse.json(
            { error: 'Invalid username or password!', status: 'failed' },
            { status: httpStatusCode.NOT_FOUND }
          );
        }
        if (member?.message) {
          return NextResponse.json(
            { error: member, status: 'failed' },
            { status: httpStatusCode.NOT_FOUND }
          );
        }
      }
      //Create payload for token
      const payload = {
        id: member?._id,
        ...(member?.email && { email: member?.email }),
        gameId: member?.gameId,
      };
      const accessToken = await generateToken(payload);

      if (accessToken) {
        cookies().set('accessToken', accessToken, { maxAge: 60 * 1000 });
        return NextResponse.json(
          { member, status: 'success' },
          { status: httpStatusCode.CREATED }
        );
      }
    }
  } catch (error) {
    return NextResponse.json({ error }, { status: httpStatusCode.FORBIDDEN });
  }
};

//Check access token is expiring or not or it also need to be delete from the cookie after the expired
