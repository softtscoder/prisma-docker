const { getUserId } = require('../../utils')
const { forwardTo } = require('prisma-binding')
const { clearLog } = require('../../utils')
const { PUBSUB_NEW_MESSAGE } = require('../../constants')

const message = {
  deleteMessage: forwardTo("db"),
  updateMessage: forwardTo("db"),
  createMessage: async (parent, args, ctx, info) => {
    
    clearLog('createMessageResolverArgs', args)

    const createMessageArgs = args.data 
    const newMessage = await ctx.db.mutation.createMessage({
      data: {
        ...createMessageArgs
      }
    },
      `{
        __typename 
        id
        createdAt
        text
        author { id name }
      }`
    )
    const { pubsub } = ctx
    clearLog('CTX.pubsub message', pubsub)

    // alerts all subscribed that a new snippit is being created
    pubsub.publish(PUBSUB_NEW_MESSAGE, {
      message: newMessage
    })
    // getUserId(ctx)
    // return forwardTo("db")(parent, args, ctx, info);
    return newMessage
  },
}

module.exports = { message }


// EXAMPLE FROM PREVIOUS PROJECT OF HITTING THE PRISMA API 
// BEFORE RETURNING 

// createFriendship: async (parent, args, ctx, info) => {
//     // Destructure incoming args and also rename 
//     // each id var to identify who the id belongs to.
//     const { 
//       data: { 
//         friendsBecause: { set },  
//         offerAllowance, 
//         friend: { connect: {  id: sellerId } }  
//       } 
//     } = args

//     const createFriendshipArgs = args.data
    
    
//     const newFriendship = await ctx.db.mutation.createFriendship({
//       data: {
//         ...createFriendshipArgs
//       }
//     },
//       `{
//         __typename 
//         id
//         friendsBecause
//         offerAllowance
//         friend { id name }
//       }`
//     )
  
      
//     clearLog('newFriendShip', newFriendship)

       
   
    
//     //getUserId makes sure sender of requset has a valid token
//     //in the HTTP Headers thereby protecting the route
//     const userId = getUserId(ctx)
    
//     response = await ctx.db.mutation.updateUser({
//       data: {
//         friends: { connect: {id: newFriendship.id } }
//       },
//       where: { 
//         id: userId 
//       }}, 
//       `{ id name friends { id friend { name id } } }`
//     )

//     const user = await ctx.db.query.user(
//       { where: { id: userId } }, 
//       '{ __typename id name email about  }'
//     )
//     clearLog('FRIENDSHIP_RESOLVER user', user)

//     return newFriendship
//   },
// }

