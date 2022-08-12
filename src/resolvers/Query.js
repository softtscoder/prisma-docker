const { forwardTo } = require('prisma-binding')
const { getUserId, clearLog } = require('../utils')

const Query = {
  messages: async (parent, args, ctx, info) => {
    return forwardTo("db")(parent, args, ctx, info);
  },
  rediss: async (parent, args, ctx, info) => {
    //clearLog('hello snippits query context', ctx);
    let stringThing
    const returnItem = await ctx.client.getAsync("mytestkey")
    // const testHgetall = await ctx.client.hgetallAsync("myhashkey");
    clearLog('rediss Query: returnItem', returnItem)
    // clearLog('rediss Query: typeof returnItem', typeof returnItem)

    return JSON.parse(returnItem)
  },
  users: forwardTo("db"),
  // snippits: forwardTo("db"),
  snippits: async (parent, args, ctx, info) => {
    // clearLog('args', args)
    //clearLog('hello shppits query resolver', null)
    ctx.client.hmset(
      "myhashkey", 
      ["test keys 1", "test val 1", "test keys 2", "test val 2"], 
      function (err, res) {
        clearLog('HMSET res', res)
      }
    );
    // clearLog('testHgetall', testHgetall)
    // clearLog('inspect testHgetall', testHgetall['test keys 1'])
    const snippits = await ctx.db.query.snippits()
    //JSON.stringify(snippits)
    ctx.client.set("mytestkey", JSON.stringify(snippits), (error) => {
      if(error) {throw error}
    })


    //clearLog('hello snippits query context', ctx);
    // const tempVar = ctx.client.get("testkey", (err, thing) => {
    //   if(err) {throw er}
    //   if(thing) {
    //     //clearLog('snippits query: thing', thing)
    //   }
    // })
    return forwardTo("db")(parent, args, ctx, info);
  },
  me(parent, args, ctx, info) {
    const id = getUserId(ctx)
    return ctx.db.query.user({ where: { id } }, info)
  },
  snippitsConnection: (parent, args, ctx, info) => {
    getUserId(ctx)
    return forwardTo("db")(parent, args, ctx, info);
  },
}

module.exports = { Query }


// const returnItem = await ctx.client.getAsync("testkey", (err, thing) => {
//   if (err) {
//     throw er
//   }
//   if (thing) {
//     clearLog('typeof thing', typeof thing)

//     stringThing = thing
//     clearLog('type of stringThing', typeof stringThing)
//     // parsedThing = JSON.parse(thing)
//     //notParsedThing = thing
//     //clearLog('notParsedThing', notParsedThing)
//     console.log('xxxxxxxxxxxffff', stringThing);

//     return stringThing;
//   } else {
//     return 'else block'
//   }
// })