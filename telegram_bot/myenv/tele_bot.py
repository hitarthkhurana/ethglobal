from telegram import Update
from telegram.ext import Application, MessageHandler, CommandHandler, ContextTypes, filters
from dotenv import load_dotenv 
import os         

load_dotenv()

TELEGRAM_BOT_KEY = os.getenv('TELEGRAM_BOT_KEY')
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
        # Correctly format the clickable link
        link_text = "Click Here!"
        link_url = "https://www.google.com"  # Replace with your desired URL
        clickable_message = (
            f"{update.effective_user.first_name} mentioned: '{update.message.text}'.\n\n"
            f"[{link_text}]({link_url})"
        )

        # Send a private message to the friend
        try:
            await context.bot.send_message(
                chat_id=friend_chat_id,  # Send to your friend's chat ID
                text=clickable_message,
                parse_mode="Markdown"  # Use Markdown for formatting
            )
        except Exception as e:
            await update.message.reply_text(f"Could not send a message to the friend: {e}")
    else:
        await update.message.reply_text(f"Trigger message detected, but no friend chat ID set.")


def main():
    """Main function to run the bot."""
    # Replace 'YOUR_BOT_TOKEN' with your bot token
    application = Application.builder().token(TELEGRAM_BOT_KEY).build()

    # Command handler
    application.add_handler(CommandHandler("start", start))

    # Message handler for triggers in group/public chats
    application.add_handler(MessageHandler(filters.TEXT & ~filters.COMMAND, detect_trigger))

    # Start the bot
    application.run_polling()

if __name__ == '__main__':
    main()
