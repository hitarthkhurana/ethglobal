import { useState, useEffect } from 'react';
import { Client } from '@xmtp/xmtp-js';
import { useAccount, useConnect, useDisconnect } from 'wagmi';
import { InjectedConnector } from 'wagmi/connectors/injected';
import { ethers } from 'ethers';

function Messaging() {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [recipient, setRecipient] = useState('');
  const [xmtp, setXmtp] = useState(null);
  const { address, isConnected } = useAccount();
  const { connect } = useConnect({
    connector: new InjectedConnector(),
  });
  const { disconnect } = useDisconnect();

  // Initialize XMTP client
  const initXmtp = async () => {
    if (!address) return;
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const xmtpClient = await Client.create(signer);
    setXmtp(xmtpClient);
  };

  // Send message
  const sendMessage = async () => {
    if (!xmtp || !recipient || !newMessage) return;
    
    try {
      const conversation = await xmtp.conversations.newConversation(recipient);
      await conversation.send(newMessage);
      setNewMessage('');
      // Refresh messages
      loadMessages();
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  // Load messages
  const loadMessages = async () => {
    if (!xmtp || !recipient) return;
    
    try {
      const conversation = await xmtp.conversations.newConversation(recipient);
      const msgs = await conversation.messages();
      setMessages(msgs);
    } catch (error) {
      console.error('Error loading messages:', error);
    }
  };

  return (
    <div className="messaging-container">
      {!isConnected ? (
        <button onClick={() => connect()} className="connect-button">
          Connect Wallet
        </button>
      ) : (
        <>
          <div className="messaging-header">
            <input
              type="text"
              placeholder="Enter ENS or address"
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              className="recipient-input"
            />
          </div>
          <div className="messages-list">
            {messages.map((msg, idx) => (
              <div key={idx} className={`message ${msg.senderAddress === address ? 'sent' : 'received'}`}>
                {msg.content}
              </div>
            ))}
          </div>
          <div className="message-input">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type a message..."
            />
            <button onClick={sendMessage}>Send</button>
          </div>
        </>
      )}
    </div>
  );
}

export default Messaging;