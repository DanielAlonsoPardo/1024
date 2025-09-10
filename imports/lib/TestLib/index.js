/// export test-only resources such as test user creation

const TestMethods = {
  //creates random user + logs in
  async createTempUser() {
    let userInfo = {
      username: "TestUser-" + (Math.random() + 1).toString(36).substring(7),
      password: "testuserpass"
    }
    let userId = await Accounts.createUser(userInfo)
    return userInfo
  },
  //deletes current user
  async deleteCurrentUser() {
    return Meteor.users.removeAsync({ _id: this.userId })
  },
  async deleteUser(username) {
    return Meteor.users.removeAsync({ username })
  },
  async deleteAllTempUsers() {
  }
}

Meteor.methods(TestMethods)

export const TestCalls = TestMethods