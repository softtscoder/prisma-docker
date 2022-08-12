const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { getUserId, clearLog } = require('../../utils')

function createToken(userId) {
  return jwt.sign({ userId, expiresIn: "7d" }, process.env.APP_SECRET)
}

const auth = {
  async refreshToken(parent, args, ctx, info) {

    const userId = getUserId(ctx)

    return {
      token: createToken(userId),
      userId,
    }
  },
  async signup(parent, args, ctx, info) {
    const password = await bcrypt.hash(args.password, 5)

    const user = await ctx.db.mutation.createUser({
      data: { ...args, password },
    })

    return {
      token: createToken(user.id),
      user,
    }
  },
  async login(parent, { email, password }, ctx, info) {
    
    const user = await ctx.db.query.user({ where: { email } })
    clearLog('hello from LOGIN', user)
    if (!user) {
      return {
        error: {
          field: 'email',
          msg: 'No user found'
        }
      }
    }
    

    const valid = await bcrypt.compare(password, user.password)
    //clearLog('VALID ', valid)

    if (!valid) {
      return {
        error: {
          field: 'email',
          msg: 'Invalid Password'
        }
      }
    }

    return {
      payload: {
        token: createToken(user.id),
        user,
      }
    }
  },
}

module.exports = { auth }
