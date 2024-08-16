import amqp from 'amqplib';

async function connect() {
  try {
    const connection = await amqp.connect(process.env.AMQ_URL);
    const channel = await connection.createChannel();
    return { channel, connection };
  } catch (error) {
    console.error('Connection error:', error);
    throw error;
  }
}

async function assertQueue(channel, queue, options) {
  try {
    await channel.assertQueue(queue, options);
  } catch (error) {
    console.error('Queue assertion error:', error);
    throw error;
  }
}

async function sendMessageToQueue(queue, message, options = { durable: true }) {
  try {
    const { channel, connection } = await connect();
    await assertQueue(channel, queue, options);

    channel.sendToQueue(queue, Buffer.from(JSON.stringify(message)));

    await channel.close();
    await connection.close();
  } catch (error) {
    console.error('Send message error:', error);
    throw error;
  }
}

export { sendMessageToQueue };
