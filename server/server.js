import express from 'express';
import morgan from 'morgan';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import helmet from 'helmet';
import userRoutes from './routes/userRoutes';
import contributionRoutes from './routes/contributionRoutes';
import publicationRoutes from './routes/publicationRoutes';
import galleryRoutes from './routes/galleryRoutes';
import eventRoutes from './routes/eventRoutes';
import obituaryRoutes from './routes/obituaryRoutes';
import newsRoutes from './routes/newsRoutes';
import cloudinaryRoutes from './routes/cloudinaryRoutes';


// const cloudinary = require('cloudinary').v2;
// const fs = require('fs');
// const feedparser = require('feedparser-promised');
// var nodemailer = require('nodemailer');


// config = JSON.parse(fs.readFileSync('./.env.json', 'utf8'));

// cloudinary.config({
//   cloud_name: config.cloudinary_name,
//   api_key: config.cloudinary_api_key,
//   api_secret: config.cloudinary_api_secret,
// });

// var transporter = nodemailer.createTransport({
//   service: 'gmail',
//   auth: {
//     user: config.admin_email_user,
//     pass: config.admin_email_pass
//   }
// });

// const baseURL = 'https://res.cloudinary.com/nainativucds/raw/upload/';

const app = express();

// MongoDB
mongoose.connect('mongodb://localhost/ncds');
mongoose.Promise = global.Promise;

// Enable CORS
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  next();
});

// Middlewares
app.use(helmet());
app.use(morgan('dev'));
app.use(bodyParser.json({limit: '1000mb'}));

// Routes
app.use('/api/auth', userRoutes);
app.use('/api/contributions', contributionRoutes);
app.use('/api/publications', publicationRoutes);
app.use('/api/galleries', galleryRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/obituaries', obituaryRoutes);
app.use('/api/news', newsRoutes);
app.use('/api/cloudinary', cloudinaryRoutes);

// Catch 404 Errors
app.use((req, res, next) => {
  const err = new Error('Not found');
  err.status = 404;
  next(err);
});

// Error handler function
app.use((err, req, res, next) => {
  const error = app.get('env') === 'development' ? err : { message: "Something went wrong. We're working on it."};
  const status = err.status || 500;
  res.status(status).json({
    error: {
      message: error.message
    }
  });
});

// Serve ReactJS at '/' url
app.use('/', express.static(`../build`));
app.get('*', function (req, res) {
  res.sendFile('index.html');
});


// Start the server
const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});


// app.get('/api/deleteDerived', (req, res) => {
//   cloudinary.api.delete_all_resources({ keep_original: true }, function (error, result) {
//     if (error) res.send(error);
//     else res.send(result);
//   });
// });

// app.get('/api/news', (req, res) => {
//   result = JSON.parse(fs.readFileSync('./data/news.json', 'utf8'));
//   res.send(shuffle(result));
// });

// app.get('/api/updateNews', (req, res) => {
//   const news_channels = [
//     'http://www.jvpnews.com/rss.xml',
//     'http://news.lankasri.com/rss.xml',
//     'http://www.canadamirror.com/rss.xml',
//     'http://www.tamilwin.com/rss.xml',
//     'http://www.cineulagam.com/rss.xml',
//     'http://www.manithan.com/rss.xml'
//   ];
//   let promises = [];
//   for (var channel of news_channels) {
//     promises.push(feedparser.parse(channel));
//   }
//   Promise.all(promises)
//     .then((items) => {
//       try {
//         var allNews = Array.prototype.concat.apply([], items);
//         fs.writeFileSync('./data/news.json', JSON.stringify(allNews, null, 4));
//         res.send({ success: allNews });
//       } catch (err) {
//         res.send(err);
//       }
//     })
//     .catch((e) => {
//       res.send(e);
//     });
// });







// app.post('/api/mail', (req, res) => {
//   let html = '<h1> Message from NainativuCDS.org </h1>';
//   html += '<p>' + req.body.message + '</p>';
//   if (req.body.hasOwnProperty('name')) html += '<br/><br/><p> Name: ' + req.body.name + '</p>';
//   if (req.body.hasOwnProperty('email')) html += '<br/><p> Email: ' + req.body.email + '</p>';
//   if (req.body.hasOwnProperty('phone')) html += '<br/><p> Contact No: ' + req.body.phone + '</p>';
//   var mailOptions = {
//     from: 'admin@nainativucds.org',
//     to: 'admin@nainativucds.org',
//     subject: req.body.subject,
//     html
//   };
//   transporter.sendMail(mailOptions, function (error, info) {
//     if (error) {
//       res.send({ result: error });
//       console.log(error);
//     } else {
//       res.send({ result: info.response });
//       console.log('Email sent: ' + info.response);
//     }
//   });
// });







/**
 * Shuffles array in place.
 * @param {Array} a items An array containing the items.
 */
function shuffle(a) {
  var j, x, i;
  for (i = a.length - 1; i > 0; i--) {
    j = Math.floor(Math.random() * (i + 1));
    x = a[i];
    a[i] = a[j];
    a[j] = x;
  }
  return a;
}
