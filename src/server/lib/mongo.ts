import {Types, connect} from 'mongoose';
export {Document, model, Types, Schema} from 'mongoose';
import config from '@/config';

const mongo = connect(config.mongo.connect, {useNewUrlParser: true, useUnifiedTopology: true});
export default mongo;

export const ObjectId = Types.ObjectId;
