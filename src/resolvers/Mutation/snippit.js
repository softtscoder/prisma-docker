const { getUserId } = require('../../utils')
const { forwardTo } = require('prisma-binding')
const { clearLog } = require('../../utils')
const { PUBSUB_NEW_SNIPPIT, PUBSUB_TEST_ALPHA } = require('../../constants')

const snippit = {
  deleteSnippit: forwardTo("db"),
  updateSnippit: forwardTo("db"),
  createSnippit: (parent, args, ctx, info) => {

    const { pubsub } = ctx
    clearLog('CTX.pubsub', pubsub)

    // alerts all subscribed that a new snippit is being created
    pubsub.publish(PUBSUB_TEST_ALPHA, {
      ttest: " hello ttest pubsub.publish()"
    })

    // TODO, add logic to check that Seller has an availble offer allowance
    // before creating offer and connecting offer to user's inbox and sellers offers

    // getUserId makes sure sender of requset has a valid token
    // in the HTTP Headers thereby protecting the route
    getUserId(ctx)
    return forwardTo("db")(parent, args, ctx, info);
  },
}

module.exports = { snippit }
