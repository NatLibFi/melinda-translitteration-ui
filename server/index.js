'use strict';
import express from 'express';
import { logger, expressWinston } from 'server/logger';
import { readEnvironmentVariable } from 'server/utils';
import cookieParser from 'cookie-parser';
import { sessionController } from 'server/session-controller';
import { marcIOController } from 'server/marc-io-controller';
import path from 'path';

const PORT = readEnvironmentVariable('HTTP_PORT', 3001);

const app = express();

app.use(expressWinston);
app.use(cookieParser());

app.use('/api', marcIOController);
app.use('/session', sessionController);

app.use(express.static(path.resolve(__dirname, 'public')));

app.listen(PORT, () => logger.log('info', `Application started on port ${PORT}`));
