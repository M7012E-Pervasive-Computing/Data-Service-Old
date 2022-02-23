import { DataPointInterface } from './../../Interface/DataPointInterface';
import { Schema } from 'mongoose';

export const dataPointSchema = new Schema<DataPointInterface>({
    x: { type: Schema.Types.Number, required: true },
    y: { type: Schema.Types.Number, required: true },
    z: { type: Schema.Types.Number, required: true },
  });