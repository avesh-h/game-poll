import { NextResponse } from 'next/server';

// import client from '@/lib/redisConfig';

import { sendMessageToQueue } from '@/lib/queue';

//This is redis testing route for queue
export const GET = async () => {
  console.log('API called!');
  // return NextResponse.json({ message: 'Message queue' });

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
  // try {
  //   const res = await client.publish(
  //     'messageQueue',
  //     JSON.stringify({ id: 123, name: 'famous', age: 22 })
  //   );
  //   console.log('res', res);
  //   return NextResponse.json({ message: 'success' });
  // } catch (error) {
  //   console.error('Error pushing to Redis:', error);
  //   return NextResponse.json({ message: 'error', error: error.message });
  // }

  // rabbit mq

  try {
    // amqp.connect(process.env.AMQ_URL, function (err, connection) {
    //   if (err) {
    //     throw new Error(err);
    //   }
    //   //Create channel
    //   connection.createChannel(function (err1, channel) {
    //     if (err1) {
    //       throw new Error(err1);
    //     }
    //     //declare the queue
    //     channel.assertQueue(
    //       queue,
    //       {
    //         durable: true,
    //       },
    //       (err2, _ok) => {
    //         console.error('Queue assertion error:', err2);
    //         channel.close();
    //         connection.close();
    //         return NextResponse.json(
    //           { message: 'Failed to assert queue' },
    //           { status: 500 }
    //         );
    //       }
    //     );
    //     //Send to queue
    //     channel.sendToQueue(
    //       queue,
    //       Buffer.from('Hello from Rabbit mq sender'),
    //       () => {
    //         if (err) {
    //           console.error('Send to queue error:', err);
    //           channel.close();
    //           connection.close();
    //           return NextResponse.json(
    //             { message: 'Failed to send message' },
    //             { status: 500 }
    //           );
    //         }
    //         //After sent the message close the channel
    //         channel.close(() => {
    //           connection.close();
    //           return NextResponse.json({
    //             message: 'Message sent successfully',
    //           });
    //         });
    //       }
    //     );
    //   });
    // });

    //Rabbit mq common
    sendMessageToQueue('messageQueue', 'Hello from Rabbit mq sender');
  } catch (err) {
    console.error('Failed to send message:', err);
  }
  return NextResponse.json({ message: 'Message queue' });
};
