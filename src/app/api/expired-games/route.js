import axios from 'axios';

import { getDateIntoCronExpression } from '@/lib/utils/common';

export async function POST(request) {
  try {
    const { endTime } = await request.json();

    // Convert the endTime to a cron expression
    const cronExpression = getDateIntoCronExpression(endTime);

    // Create a new cron job on cron-job.org
    const response = await axios.post(
      'https://api.cron-job.org/jobs',
      {
        schedule: cronExpression,
        url: `${process.env.NEXTAUTH_URL}/api/execute-cron`,
        method: 'POST',
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'X-Auth-Token': process.env.CRON_JOB_API_KEY,
        },
      }
    );

    return new Response(JSON.stringify(response.data), { status: 200 });
  } catch (error) {
    console.error('Error scheduling cron job:', error);
    return new Response(
      JSON.stringify({ error: 'Error scheduling cron job' }),
      { status: 500 }
    );
  }
}
