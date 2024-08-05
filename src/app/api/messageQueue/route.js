import { NextResponse } from 'next/server';

import client from '@/lib/redisConfig';

//This is redis testing route for queue
export const GET = async () => {
  console.log('API called!');

  //REDIS MESSAGE QUEUES
  // try {
  //   await client.lPush(
  //     'messageQueue',
  //     JSON.stringify({ id: 123, name: 'famous', age: 22 })
  //   );
  //   return NextResponse.json({ message: 'success' });
  // } catch (error) {
  //   console.error('Error pushing to Redis:', error);
  //   return NextResponse.json({ message: 'error', error: error.message });
  // }

  // REDIS PUB SUB
  try {
    const res = await client.publish(
      'messageQueue',
      JSON.stringify({ id: 123, name: 'famous', age: 22 })
    );
    console.log('res', res);
    return NextResponse.json({ message: 'success' });
  } catch (error) {
    console.error('Error pushing to Redis:', error);
    return NextResponse.json({ message: 'error', error: error.message });
  }
};
