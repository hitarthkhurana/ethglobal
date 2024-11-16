from telegram.ext import Application, MessageHandler, CommandHandler, ContextTypes, filters
from telegram import Update
from dotenv import load_dotenv 
import os         

load_dotenv()

TELEGRAM_BOT_KEY = os.getenv('TOKEN')

# Define the trigger messages
TRIGGER_MESSAGES = ["how far are you", "where are you", "what's your eta", "yo wya", "wya"]

# Store the chat ID of the friend dynamically
friend_chat_id = None

async def start(update: Update, context: ContextTypes.DEFAULT_TYPE):
    """Respond to the /start command."""
    global friend_chat_id
    user_id = update.message.from_user.id
    friend_chat_id = user_id  # Always set the latest user's chat ID
    user_first_name = update.message.from_user.first_name

    # Send a confirmation message to the user
    await update.message.reply_text(f"Hi {user_first_name}, you're now the active contact!")

    # Log the updated friend_chat_id for debugging
    print(f"Updated friend_chat_id to: {friend_chat_id}")

async def detect_trigger(update: Update, context: ContextTypes.DEFAULT_TYPE):
    """Detect trigger messages in public chat and send a private message to the friend."""
    global friend_chat_id
    message = update.message.text.lower()  # Convert message to lowercase for consistent matching

    # Check if the message matches any of the triggers
    if any(trigger in message for trigger in TRIGGER_MESSAGES) and friend_chat_id:
        # Correctly format the clickable link
        link_text = "Click Here to send your ETA"
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
        await update.message.reply_text(f"Message detected, but no friend chat ID set or not a trigger message.")

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
