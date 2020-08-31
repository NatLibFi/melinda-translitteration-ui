/**
*
* @licstart  The following is the entire license notice for the JavaScript code in this file.
*
* UI for transliterating MARC records in Melinda
*
* Copyright (c) 2016-2019 University Of Helsinki (The National Library Of Finland)
*
* This file is part of melinda-cyrillux
*
* melinda-cyrillux program is free software: you can redistribute it and/or modify
* it under the terms of the GNU Affero General Public License as
* published by the Free Software Foundation, either version 3 of the
* License, or (at your option) any later version.
*
* melinda-cyrillux is distributed in the hope that it will be useful,
* but WITHOUT ANY WARRANTY; without even the implied warranty of
* MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
* GNU Affero General Public License for more details.
*
* You should have received a copy of the GNU Affero General Public License
* along with this program.  If not, see <http://www.gnu.org/licenses/>.
*
* @licend  The above is the entire license notice
* for the JavaScript code in this file.
*
*/
'use strict';
import express from 'express';
import {createLogger, readEnvironmentVariable} from '@natlibfi/melinda-backend-commons';
import {expressWinston} from 'server/logger';
import cookieParser from 'cookie-parser';
import {sessionController} from 'server/session-controller';
import {marcIOController} from 'server/marc-io-controller';
import {conversionController} from 'server/conversion-controller';
import path from 'path';

const logger = createLogger();
const PORT = readEnvironmentVariable('HTTP_PORT', {defaultValue: 3001});
const app = express();

app.use(expressWinston);
app.use(cookieParser());

app.use('/api', marcIOController);
app.use('/session', sessionController);
app.use('/conversion', conversionController);

app.use(express.static(path.resolve(__dirname, 'public')));

app.get('/:id', function (req, res) {
  res.sendFile(path.resolve(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => logger.log('info', `Application started on port ${PORT}`));
