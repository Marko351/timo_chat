import mongoose from 'mongoose';

export default () => {
  const connect = () => {
    mongoose.set('strictQuery', true);
    mongoose
      .connect('mongodb://127.0.0.1:27017/timo')
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
