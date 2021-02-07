import { info } from '@actions/core';
import simpleGit, { Response } from 'simple-git';

info('Starting Git Merge');
const git = simpleGit();
