/* 
  user sub plan
  1. type=standard: There will only be 1, and each team will have one
  2. type=extraDatasetSize/extraPoints: Can buy multiple
*/
import { connectionMongo, getMongoModel } from '../../../common/mongo';
const { Schema } = connectionMongo;
import { TeamCollectionName } from '@fastgpt/global/support/user/team/constant';
import {
  standardSubLevelMap,
  subModeMap,
  subStatusMap,
  subTypeMap
} from '@fastgpt/global/support/wallet/sub/constants';
import type { TeamSubSchema } from '@fastgpt/global/support/wallet/sub/type';

export const subCollectionName = 'team_subscriptions';

const SubSchema = new Schema({
  teamId: {
    type: Schema.Types.ObjectId,
    ref: TeamCollectionName,
    required: true
  },
  type: {
    type: String,
    enum: Object.keys(subTypeMap),
    required: true
  },
  status: {
    type: String,
    enum: Object.keys(subStatusMap),
    required: true
  },
  startTime: {
    type: Date,
    default: () => new Date()
  },
  expiredTime: {
    type: Date,
    required: true
  },
  price: {
    // last sub pay price(total price)
    type: Number,
    required: true
  },

  // standard sub
  currentMode: {
    type: String,
    enum: Object.keys(subModeMap)
  },
  nextMode: {
    type: String,
    enum: Object.keys(subModeMap)
  },
  currentSubLevel: {
    type: String,
    enum: Object.keys(standardSubLevelMap)
  },
  nextSubLevel: {
    type: String,
    enum: Object.keys(standardSubLevelMap)
  },

  // stand sub and extra points sub. Plan total points
  totalPoints: {
    type: Number
  },
  pointPrice: {
    // stand level point total price
    type: Number
  },
  surplusPoints: {
    // plan surplus points
    type: Number
  },

  // extra dataset size
  currentExtraDatasetSize: {
    type: Number
  }
});

try {
  // Get plan by expiredTime
  SubSchema.index({ expiredTime: -1, currentSubLevel: 1 });

  // Get team plan
  SubSchema.index({ teamId: 1, type: 1, expiredTime: -1 });
  // timer task. Get standard plan;Get free plan;Clear expired extract plan
  SubSchema.index({ type: 1, expiredTime: -1, currentSubLevel: 1 });
} catch (error) {
  console.log(error);
}

export const MongoTeamSub = getMongoModel<TeamSubSchema>(subCollectionName, SubSchema);
