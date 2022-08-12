const { clearLog } = require('../utils')
const { 
  PUBSUB_NEW_SNIPPIT, PUBSUB_TEST_ALPHA, PUBSUB_NEW_MESSAGE
} = require('../constants')

const Subscription = {
  snippit: {
    subscribe: (parent, args, { pubsub }) => {
      // pull pubsub out of the context
      clearLog('hello SUBSCRIPTION', 'sub sub sub')
      // PUBSUB_NEW_SNIPPIT constant serves as a "channel" for partitioning 
      // between different subscriptions.
      return pubsub.asyncIterator(PUBSUB_NEW_SNIPPIT)     
    },
  }, 
  ttest: {
    subscribe: (parent, args, { pubsub }) => {
      clearLog('hello T-TEST', 't-test sub')
      return pubsub.asyncIterator(PUBSUB_TEST_ALPHA)     
    },
  },
  message: {
    subscribe: (parent, args, { pubsub }) => {
      clearLog('hello T-TEST', 't-test sub')
      return pubsub.asyncIterator(PUBSUB_NEW_MESSAGE)
    },
  }   
}

module.exports = { Subscription }

// MAYBE INTRODUCE WITH FILTER TO ONLY GET MESSAGES 
// PERTAINING TO A GIVEN FRIENDSHIP ID

// import { withFilter } from "graphql-yoga";

// import { ResolverMap } from "../../../types/graphql-utils";
// import { PUBSUB_NEW_MESSAGE } from "../shared/constants";

// export const resolvers: ResolverMap = {
//   Subscription: {
//     newMessage: {
//       subscribe: withFilter(
//         (_, __, { pubsub }) => pubsub.asyncIterator(PUBSUB_NEW_MESSAGE),
//         (payload, variables) => {
//           return payload.newMessage.listingId === variables.listingId;
//         }
//       )
//     }
//   }
// };


// const { PubSub } = require('graphql-subscriptions')
// const pubsub = new PubSub()
// const payload = {
//   commentAdded: {
//     id: '1', 
//     content: 'Hello Sub'
//   }
// }
// pubsub.publish('commentAdded', payload)


// I DON'T THINK THIS WILL HELP ME ANYMORE/ IT'S DEPRECIATED
//
// feedSubscription: {
//   subscribe: (parent, args, ctx, info) => {
//     return ctx.db.subscription.post(
//       {
//         where: {
//           node: {
//             isPublished: true,
//           },
//         },
//       },
//       info,
//     )
//   },
// },