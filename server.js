const app= require('./app');
const http = require('http');
const server = http.createServer(app);
// const cron = require('./common/crons/cronJobs');

// cron.deletingDailyPanFile.start();
server.listen(app.get('port'), function () {
  console.log('School ERP & Management System Server Started On Port: ' + app.get('port'));
});

// log uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('=== UNCAUGHT EXCEPTION', err);
  console.error('=== UNCAUGHT EXCEPTION STACK', err.stack);
  process.exit(1);
});

// log unhandled promise rejections
process.on('unhandledRejection', (reason, p) => {
  console.error(`=== Unhandled Promise Rejection: ${JSON.stringify(p)} reason: ${reason.stack || reason}`);
});

process.on('SIGINT', () => {
  server.close(() => {
    console.error('server has unexpectedly stopped.');
    process.exit(1);
  });
});
