from telegram import Update
from telegram.ext import Application, MessageHandler, CommandHandler, ContextTypes, filters

# Define the trigger message
TRIGGER_MESSAGE = "how far are you"

# Store the chat ID of the friend dynamically
friend_chat_id = None

async def start(update: Update, context: ContextTypes.DEFAULT_TYPE):
    """Respond to the /start command."""
    global friend_chat_id
    user_id = update.message.from_user.id
    if friend_chat_id is None:
        friend_chat_id = user_id  # Set your friend's chat ID when they send /start
        await update.message.reply_text(f"Hi {update.message.from_user.first_name}, I'm activated!")
    else:
        await update.message.reply_text("Bot is already ready!")

async def detect_trigger(update: Update, context: ContextTypes.DEFAULT_TYPE):
    """Detect trigger messages in public chat and send a private message to the friend."""
    message = update.message.text.lower()  # Convert message to lowercase for consistent matching

    if TRIGGER_MESSAGE in message and friend_chat_id:
        # Send a private message to the friend (who triggered the message)
        try:
            # Send a private message to the friend using their stored chat ID
            await context.bot.send_message(
                chat_id=friend_chat_id,  # Send to your friend's chat ID
                text=f"{update.effective_user.first_name} mentioned: '{update.message.text}'"
            )
            # Optionally, confirm in the group chat
            await update.message.reply_text(f"I've notified {update.message.from_user.first_name}!")
        except Exception as e:
            await update.message.reply_text(f"Could not send a message to the friend: {e}")
    else:
        await update.message.reply_text(f"Trigger message detected, but no friend chat ID set.")

def main():
    """Main function to run the bot."""
    # Replace 'YOUR_BOT_TOKEN' with your bot token
    application = Application.builder().token('7843853659:AAFrFq3Tpl-x9dPTf5qMF-t-7Jl0Ljq5NiM').build()

    # Command handler
    application.add_handler(CommandHandler("start", start))

    # Message handler for triggers in group/public chats
    application.add_handler(MessageHandler(filters.TEXT & ~filters.COMMAND, detect_trigger))

    # Start the bot
    application.run_polling()

if __name__ == '__main__':
    main()
