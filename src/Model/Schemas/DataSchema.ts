import { DataPointInterface } from './../../Interface/DataPointInterface';
import { dataPointSchema } from './DataPointSchema';
import { DataInterface } from './../../Interface/DataInterface';
import { Schema } from 'mongoose';

export const dataSchema = new Schema<DataInterface>({
    timestamp: { type: Schema.Types.Date, required: true },
    data: { type: [dataPointSchema], required: true },
    name: { type: Schema.Types.String, required: true },
  });
