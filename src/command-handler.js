export class CommandHandler {
  lastMessageByUser = {};

  canExecute(command) {
    console.info({command});

    if (command.badges && command.badges.broadcaster === "1") {
      return true;
    }

    // extract to handler
    const lastMessage =  this.lastMessageByUser[command.username];

    if (lastMessage) {
      const now = new Date();
      var dif = now.getTime() - lastMessage.getTime();

      if (dif < 10000) {
        return false;
      }
    }

    this.lastMessageByUser[command.username] = new Date();

    return true;
  }
}
