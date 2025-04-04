import { APIGatewayProxyEvent, APIGatewayProxyResult, Context, Handler } from 'aws-lambda';
import serverless from 'serverless-http';
import app from '@/app';
import chirpRouter from '@/controller/chirp-controller';
import authRouter from '@/controller/auth-controller';
import userRouter from '@/controller/user-controller';
import followRouter from '@/controller/follow-controller';
import timelineRouter from '@/controller/timeline-controller';
import profileRouter from '@/controller/profile-controller';
import logger from '@/config/logging';
import { authenticate } from '@/middleware/auth';

// Register middleware and routes
app.use('/api', authenticate);
app.use('/auth', authRouter);
app.use('/api/chirps', chirpRouter);
app.use('/api/users', userRouter);
app.use('/api/follows', followRouter);
app.use('/api/timeline', timelineRouter);
app.use('/api/profiles', profileRouter);

// Create serverless handler
const handler = serverless(app);

// Lambda handler function
export const lambdaHandler: Handler = async (
  event: APIGatewayProxyEvent,
  context: Context
): Promise<APIGatewayProxyResult> => {
  // Log the incoming request
  logger.info({ 
    path: event.path,
    httpMethod: event.httpMethod,
    queryStringParameters: event.queryStringParameters
  }, 'chirper AWS lambda invocation');

  try {
    // Process the event with serverless-http
    const result = await handler(event, context) as APIGatewayProxyResult;
    return result;
  } catch (error) {
    logger.error(error, 'Error processing Lambda request');
    
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        error: 'Internal Server Error',
      }),
    };
  }
};
