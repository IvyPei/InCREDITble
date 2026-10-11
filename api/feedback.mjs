import {put} from '@vercel/blob';
import {createFeedbackHandler} from '../lib/feedback.mjs';
export default {fetch:createFeedbackHandler({save:put})};
