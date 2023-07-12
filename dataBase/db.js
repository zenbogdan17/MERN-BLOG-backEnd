import mongoose from 'mongoose';

const dbUrl = process.env.DB_URL;

mongoose
  .connect(
    dbUrl ||
      'mongodb+srv://bogdanzinkiwskuy2:+01102002@cluster0.ibuvy3g.mongodb.net/blog?retryWrites=true&w=majority'
  )
  .then(() => {
    console.log('DB ok');
  })
  .catch((e) => {
    console.log('DB ' + e);
  });
