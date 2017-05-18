const CONFIG = require('config');

const BugZapperModel = require(CONFIG.Models('bugZapper'));

exports.addCapture = async (ctx, next) => {
  let bugZapper = await BugZapperModel.findOne({
    bugZapperId: ctx.request.body.bugZapperId
  });

  if(bugZapper == null) {
    bugZapper = await new BugZapperModel({
      bugZapperId: ctx.request.body.bugZapperId
    }).save();
  }

  bugZapper.captures.push({
    lng: ctx.request.body.lng,
    lat: ctx.request.body.lat,
    cnt: ctx.request.body.cnt || 1
  });
  await bugZapper.save();

  let broadcastData = {
    bugZapperId: bugZapper.bugZapperId,
    lng: ctx.request.body.lng,
    lat: ctx.request.body.lat,
    cnt: ctx.request.body.cnt || 1,
    createdAt: bugZapper.createdAt
  };
  global.iot.broadcast('data', broadcastData);
  return ctx.status = 200;
};

exports.getCapture = async (ctx, next) => {
  let bugZapper = await BugZapperModel.findOne({
    bugZapperId: ctx.request.query.bugZapperId
  });

  if(bugZapper == null) {
    return ctx.status = 404;
  }

  return ctx.body = bugZapper;
};
