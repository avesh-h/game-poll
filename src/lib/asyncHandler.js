//Try to create common async handler function in next js 14
import { NextResponse } from 'next/server';

import { httpStatusCode } from './httpStatusCode';

export const asyncHandler = (fn) => async (req, res, next) => {
  try {
    await fn(req, res, next);
  } catch (error) {
    NextResponse.json(
      { error: error?.message },
      { status: httpStatusCode.FORBIDDEN }
    );
  }
};
