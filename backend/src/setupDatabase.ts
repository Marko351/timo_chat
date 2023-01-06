import mongoose from 'mongoose';
import { config } from './config';

export default () => {
  const connect = () => {
    mongoose.set('strictQuery', true);
    mongoose
      .connect(`${config.DATABASE_URL}`)
      .then(() => {
        console.log('DB connected!');
      })
      .catch((err) => {
        console.log('Error connecting to database ', err);
        return process.exit(1);
      });
  };
  connect();

  mongoose.connection.on('disconnected', connect);
};
