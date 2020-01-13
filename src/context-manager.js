const fs = require('fs')

class ContextManagerClass {

	constructor(){
		this.contexts = []
	}

	get_all_contexts(){
		// var contexts = []
		// fs.readFile('contexts.json', function(err, data){
		// 	contexts = data
		// })
		return this.contexts
	}

	save_all_contexts(contexts){
		// fs.writeFile('contexts.json', contexts, function(err){
		// 	if(err){
		// 		throw err
		// 	}
		// })
		this.contexts = contexts
	}

	add_channel(channel_uid, user_uid){
		var contexts = this.get_all_contexts()
		if(contexts.every((context) => context.channel !== channel_uid)){
			contexts.push({
				"channel": channel_uid,
				"user_contexts": [{
					"user": user_uid,
			        "user_context": {
			        	"admin": user_uid,
			        	"members": [
			            	user_uid
			          	]
			        }
				}]
			})
		}
		this.save_all_contexts(contexts)
	}

	add_user(channel_uid, user_uid, author_uid){
		var contexts = this.get_all_contexts()
		var channelContext = contexts.find((context) => context.channel === channel_uid)
		if(channelContext !== undefined){
			var authorContext = channelContext.find((userContext) => userContext.user = author_uid)
			if(authorContext !== undefined){
				if(authorContext.user_context.members.find(user_uid) === undefined){
					authorContext.user_context.members.push(user_uid)
					var userToAddContext = channelContext.user_contexts.find((userContext) => userContext.user === user_uid)
					if(userToAddContext !== undefined){
						userToAddContext.user_context = authorContext.user_context
					}
					else{
						channelContext.user_contexts.push({
							"user": user_uid,
							"user_context": authorContext.user_context
						})
					}					
				}
				this.get_relevant_user_contexts(channel_uid, author_uid).forEach((userContext) => {
					if(userContext.user !== authorContext.user){
						var isAdminMatch = userContext.user_context.admin === authorContext.user_context.admin
						var membersDiff = user_context.user_context.members
							.filter(member => !authorContext.user_context.members.includes(member))
							.concat(authorContext.user_context.members.filter(member => !userContext.user_context.members.includes(member)))
						if(isAdminMatch && membersDiff.length === 1 && membersDiff[0] === user_uid && authorContext.user_context.members.includes(user_uid)){
							userContext.user_context = authorContext.user_context
						}
					}					
				})
			}
		}
		this.save_all_contexts(contexts)
	}

	delete_user(channel_uid, user_uid, author_uid){
		var contexts = this.get_all_contexts()
		var channelContext = contexts.find((context) => context.channel === channel_uid)
		if(channelContext !== undefined){
			var authorContext = channelContext.find((userContext) => userContext.user = author_uid)
			if(authorContext !== undefined){
				if(authorContext.user_context.members.find(user_uid) !== undefined){
					var userMemberIndex = authorContext.user_context.members.findIndex((member) => member === user_uid)
					if(userMemberIndex !== -1){
						authorContext.user_context.members.splice(userMemberIndex, 1)
					}
					var userContextIndex = channelContext.user_contexts.findIndex((userContext) => userContext.user === user_uid)
					if(userContext !== -1){
						channelContext.user_contexts.splice(userContextIndex, 1)
					}
				}
				this.get_relevant_user_contexts(channel_uid, author_uid).forEach((userContext) => {
					if(userContext.user !== authorContext.user){
						var isAdminMatch = userContext.user_context.admin === authorContext.user_context.admin
						var membersDiff = user_context.user_context.members
							.filter(member => !authorContext.user_context.members.includes(member))
							.concat(authorContext.user_context.members.filter(member => !userContext.user_context.members.includes(member)))
						if(isAdminMatch && membersDiff.length === 1 && membersDiff[0] === user_uid && userContext.user_context.members.includes(user_uid)){
							userContext.user_context = authorContext.user_context
						}
					}					
				})
			}
		}
		this.save_all_contexts(contexts)
	}

	change_admin(channel_uid, user_uid, author_uid){
		var contexts = this.get_all_contexts()
		var channelContext = contexts.find((context) => context.channel === channel_uid)
		if(channelContext !== undefined){
			var authorContext = channelContext.find((userContext) => userContext.user = author_uid)
			if(authorContext !== undefined){
				if(authorContext.user_context.members.includes(user_uid)){
					authorContext.user_context.admin = user_uid
				}
				this.get_relevant_user_contexts(channel_uid, author_uid).forEach((userContext) => {
					if(userContext.user !== authorContext.user){
						var isAdminMatch = userContext.user_context.admin === authorContext.user_context.admin
						var membersDiff = user_context.user_context.members
							.filter(member => !authorContext.user_context.members.includes(member))
							.concat(authorContext.user_context.members.filter(member => !userContext.user_context.members.includes(member)))
						if(!isAdminMatch && membersDiff.length === 0){
							userContext.user_context = authorContext.user_context
						}
					}
				})
			}
		}
		this.save_all_contexts(contexts)
	}

	change_users_user_context(channel_uid, user_uid, user_context){
		var contexts = this.get_all_contexts()
		var channelContext = contexts.find((context) => context.channel === channel_uid)
		if(channelContext !== undefined){
			var userContext = channelContext.user_contexts.find((currentUserContext) => currentUserContext.user === user_uid)
			if(userContext !== undefined && user_context.admin !== undefined && Array.isArray(user_context.members)){
				userContext.user_context = user_context
			}
		}
		this.save_all_contexts(contexts)
	}

	get_relevant_user_contexts(channel_uid, author_uid){
		var contexts = this.get_all_contexts()
		var channelContext = contexts.find((context) => context.channel === channel_uid)
		if(channelContext !== undefined){
			var authorContext = channelContext.user_contexts.find((currentUserContext) => currentUserContext.user === author_uid)
			if(authorContext !== undefined){
				return channelContext.user_contexts.filter((userContext) => authorContext.user_context.members.includes(userContext.user))
			}
		}
		return []
	}

	get_user_context(channel_uid, user_uid){
		var contexts = this.get_all_contexts()
		var channelContext = contexts.find((context) => context.channel === channel_uid)
		if(channelContext !== undefined){
			return channelContext.user_contexts.find((currentUserContext) => currentUserContext.user === user_uid)
		}
		return undefined
	}

}

// let ContextManager = {

// 	get_all_contexts: function(){
// 		var contexts = []
// 		fs.readFile('contexts.json', function(err, data){
// 			contexts = data
// 		})
// 		return contexts
// 	},

// 	save_all_contexts: function(contexts){
// 		fs.writeFile('contexts.json', contexts, function(err){
// 			if(err){
// 				throw err
// 			}
// 		})
// 	},

// 	add_channel: function(channel_uid, user_uid){
// 		var contexts = get_all_contexts()
// 		if(contexts.every((context) => context.channel !== channel_uid)){
// 			contexts.push({
// 				"channel": channel_uid,
// 				"user_contexts": [{
// 					"user": user_uid,
// 			        "user_context": {
// 			        	"admin": user_uid,
// 			        	"members": [
// 			            	user_uid
// 			          	]
// 			        }
// 				}]
// 			})
// 		}
// 		save_all_contexts(contexts)
// 	},

// 	add_user: function(channel_uid, user_uid, author_uid){
// 		var contexts = get_all_contexts()
// 		var channelContext = contexts.find((context) => context.channel === channel_uid)
// 		if(channelContext !== undefined){
// 			var authorContext = channelContext.find((userContext) => userContext.user = author_uid)
// 			if(authorContext !== undefined){
// 				if(authorContext.user_context.members.find(user_uid) === undefined){
// 					authorContext.user_context.members.push(user_uid)
// 					var userToAddContext = channelContext.user_contexts.find((userContext) => userContext.user === user_uid)
// 					if(userToAddContext !== undefined){
// 						userToAddContext.user_context = authorContext.user_context
// 					}
// 					else{
// 						channelContext.user_contexts.push({
// 							"user": user_uid,
// 							"user_context": authorContext.user_context
// 						})
// 					}					
// 				}
// 				get_relevant_user_contexts(channel_uid, author_uid).forEach((userContext) => {
// 					if(userContext.user !== authorContext.user){
// 						var isAdminMatch = userContext.user_context.admin === authorContext.user_context.admin
// 						var membersDiff = user_context.user_context.members
// 							.filter(member => !authorContext.user_context.members.includes(member))
// 							.concat(authorContext.user_context.members.filter(member => !userContext.user_context.members.includes(member)))
// 						if(isAdminMatch && membersDiff.length === 1 && membersDiff[0] === user_uid && authorContext.user_context.members.includes(user_uid)){
// 							userContext.user_context = authorContext.user_context
// 						}
// 					}					
// 				})
// 			}
// 		}
// 		save_all_contexts(contexts)
// 	},

// 	delete_user: function(channel_uid, user_uid, author_uid){
// 		var contexts = get_all_contexts()
// 		var channelContext = contexts.find((context) => context.channel === channel_uid)
// 		if(channelContext !== undefined){
// 			var authorContext = channelContext.find((userContext) => userContext.user = author_uid)
// 			if(authorContext !== undefined){
// 				if(authorContext.user_context.members.find(user_uid) !== undefined){
// 					var userMemberIndex = authorContext.user_context.members.findIndex((member) => member === user_uid)
// 					if(userMemberIndex !== -1){
// 						authorContext.user_context.members.splice(userMemberIndex, 1)
// 					}
// 					var userContextIndex = channelContext.user_contexts.findIndex((userContext) => userContext.user === user_uid)
// 					if(userContext !== -1){
// 						channelContext.user_contexts.splice(userContextIndex, 1)
// 					}
// 				}
// 				get_relevant_user_contexts(channel_uid, author_uid).forEach((userContext) => {
// 					if(userContext.user !== authorContext.user){
// 						var isAdminMatch = userContext.user_context.admin === authorContext.user_context.admin
// 						var membersDiff = user_context.user_context.members
// 							.filter(member => !authorContext.user_context.members.includes(member))
// 							.concat(authorContext.user_context.members.filter(member => !userContext.user_context.members.includes(member)))
// 						if(isAdminMatch && membersDiff.length === 1 && membersDiff[0] === user_uid && userContext.user_context.members.includes(user_uid)){
// 							userContext.user_context = authorContext.user_context
// 						}
// 					}					
// 				})
// 			}
// 		}
// 		save_all_contexts(contexts)
// 	},

// 	change_admin: function(channel_uid, user_uid, author_uid){
// 		var contexts = get_all_contexts()
// 		var channelContext = contexts.find((context) => context.channel === channel_uid)
// 		if(channelContext !== undefined){
// 			var authorContext = channelContext.find((userContext) => userContext.user = author_uid)
// 			if(authorContext !== undefined){
// 				if(authorContext.user_context.members.includes(user_uid)){
// 					authorContext.user_context.admin = user_uid
// 				}
// 				get_relevant_user_contexts(channel_uid, author_uid).forEach((userContext) => {
// 					if(userContext.user !== authorContext.user){
// 						var isAdminMatch = userContext.user_context.admin === authorContext.user_context.admin
// 						var membersDiff = user_context.user_context.members
// 							.filter(member => !authorContext.user_context.members.includes(member))
// 							.concat(authorContext.user_context.members.filter(member => !userContext.user_context.members.includes(member)))
// 						if(!isAdminMatch && membersDiff.length === 0){
// 							userContext.user_context = authorContext.user_context
// 						}
// 					}
// 				})
// 			}
// 		}
// 		save_all_contexts(contexts)
// 	},

// 	change_users_user_context: function(channel_uid, user_uid, user_context){
// 		var contexts = get_all_contexts()
// 		var channelContext = contexts.find((context) => context.channel === channel_uid)
// 		if(channelContext !== undefined){
// 			var userContext = channelContext.user_contexts.find((currentUserContext) => currentUserContext.user === user_uid)
// 			if(userContext !== undefined && user_context.admin !== undefined && Array.isArray(user_context.members)){
// 				userContext.user_context = user_context
// 			}
// 		}
// 		save_all_contexts(contexts)
// 	},

// 	get_relevant_user_contexts: function(channel_uid, author_uid){
// 		var contexts = get_all_contexts()
// 		var channelContext = contexts.find((context) => context.channel === channel_uid)
// 		if(channelContext !== undefined){
// 			var authorContext = channelContext.user_contexts.find((currentUserContext) => currentUserContext.user === author_uid)
// 			if(authorContext !== undefined){
// 				return channelContext.user_contexts.filter((userContext) => authorContext.user_context.members.includes(userContext.user))
// 			}
// 		}
// 		return []
// 	},

// 	get_user_context: function(channel_uid, user_uid){
// 		var contexts = get_all_contexts()
// 		var channelContext = contexts.find((context) => context.channel === channel_uid)
// 		if(channelContext !== undefined){
// 			return channelContext.user_contexts.find((currentUserContext) => currentUserContext.user === user_uid)
// 		}
// 		return undefined
// 	}
// }

const ContextManager = new ContextManagerClass()

module.exports = ContextManager;