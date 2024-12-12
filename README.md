## Author ----- Fullstack Developer - TMP ( Michael Tran)
- These projects build serve for practice of learning path becomes to Fullstack Developer 
    - Stacks:
        Front-end: Typescript, Angular 18, PrimeNg
        Backend: NodeJs, NestJs, TypeORM, Microservice, JWT, OAuth, Real-time SocketIo
        Database: PostgresSQL, Redis
        Tools: Nx - Monorepo, Git, Docker

## Structure

```
.
└── root
    ├── apps
    │   ├── api                       <-- nestjs
    │   └── client                    <-- angular
    └── libs (1)
        ├── api                       <-- grouping folder (dir)
        │   ├── core                  <-- grouping folder (dir)
        │   │   └── feature           <-- nest:lib (2)
        │   ├── feature-1             <-- grouping folder (dir)
        │   │   ├── data-access       <-- nest:lib, service + entities
        │   │   ├── feature           <-- nest:lib, module + controller
        │   │   └── utils             <-- nest:lib, things like interceptors, guards, pipes etc...
        │   └── feature-2             <-- grouping folder (dir)
        │       ├── data-access       <-- nest:lib, service + entities
        │       ├── feature           <-- nest:lib, module + controller
        │       └── utils             <-- nest:lib, things like interceptors, guards, pipes etc...
        ├── client                    <-- grouping folder (dir)
        │   ├── shell                 <-- grouping folder (dir) 
        │   │   └── feature           <-- angular:lib (3)
        │   ├── feature-1             <-- grouping folder (dir)
        │   │   ├── data-access       <-- angular:lib, service, API calls, state management)
        │   │   ├── feature           <-- grouping folder (dir) or lib (4)
        │   │   │   ├── list          <-- angular:lib e.g. ProductList
        │   │   │   └── detail        <-- angular:lib e.g. ProductDetail
        │   │   └── ui                <-- grouping folder (dir)
        │   │       ├── comp-1        <-- angular:lib, SCAM for Component
        │   │       └── pipe-1        <-- angular:lib, SCAM for Pipe
        │   └── shared                <-- grouping folder (dir)
        │       ├── data-access       <-- angular:lib, any Service or State management to share across the Client app)
        │       ├── ui                <-- grouping folder (dir) (5)
        │       └── utils             <-- angular:lib, usually shared Guards, Interceptors, Validators...)
        └── shared                    <-- grouping folder (dir), most libs in here are buildable @nrwl/angular:lib)
            ├── data-access           <-- my shared data-access is usually models, so it is a lib
            ├── ui                    <-- optional grouping folder (dir), if I have multiple client apps
            └── utils                 <-- optional grouping folder (dir), usually validation logic or shared utilities
                ├── util1             <-- lib
                └── util2             <-- lib
```

## FEATURES
- Sign In/ Sign Up
- Add friend
- Chat

## FUTURE FEATURES
- Group Conversation
- Multiple message type
- Notification
- Message interation

## ENHANCEMENT - DOCUMENTS
- Notification
    - Add friend
        - Need implement redis cache to know how many user is connecting to socket ( online )
    - Show new message alert when user in current conversation, just show alert -> user click -> scrolling to new message (bottom)
- Conversation
    - Load conversation filter by updated time 
    - Filter conversation Unread/Read
    - Remove conversation (Remove all messages related to this one)
    - Last message/interaction time/ status of last message for conversation
    - Animation typing... when user type the message
    - User online status
- Upgrade Message Conversation
    - This feature need to make ui beautifully for each type of message
    - Send multiple message type: Code type, image, voice, url, 
    - Apply Reaction Icon for conversation
- Multiple profile on a account, they can switch between them
- Channel/Group conversation for everyone 
    - Owner
    - Members
    - Permissions
    - Message type look like Chat Covnersation Between 2 members.
- Update user profile like: avatar, bio, change password....



Client 1
-> Connect Socket -> Init covnersations (conversationId + userId, friendId) -> Created channel message
    - receive incomming message
        - add to msg list -> show on UI
    - sending message
        - add to msg list -> show on UI

Client 2
-> Connect socket -> Init conversations, if existing -> join current user to that conversation 
    - receive incomming message
        - add to msg list -> show on UI
    - sending message
        - add to msg list -> show on UI


Conversation Store Management: (manage all conversations)
- Socket:
    - New conversation has been created (when add friends) => put it on top list conversation sidebar
    - New messages of another people chat -> put that conversation to top
- Manage many conversations:
    - Messages for each conversation
    - Conversation of users - left sidebar
- Init:
    - Register socket for conversation's action: connect socket, init chat-room for conversation, channel for new conversation
    - Load conversation detail
    - Load 20 recently messages of each conversation
- Destroy: 
    - Reset State
    - Disconnect all channels,
    - Disconnect socket


Chat Store Management: (manage just detail current conversation)
- Manage actions: Send, reply, delete....
    - Send message with socket when another online, if no just add message to conversation
- Socket:
    - add to messages list in store
    - update interaction of messages in store
- Init
    - Clone all message of this conversation from conversations store
- Destroy
    - Update all mesages to conversations message.
    - Reset all state





# **Store Management for Conversations and Chat*
## **Feature Overview**  
- **Conversations List (Sidebar)**:  
  - Manages the overall list of conversations and their interactions.  

- **Detail Conversation (Chatting)**:  
  - Focuses on the details of a specific conversation and its associated actions.

## **Conversation Store Management**  
Manages the overall state and interactions of all conversations.

### **Socket Events**  
1. **New Conversation Created**  
   - When a new conversation (e.g., adding friends) is created, it is added to the top of the conversation list in the sidebar.
2. **Incoming Messages**  
   - If a new message is received from another user, the corresponding conversation is moved to the top of the conversation list.

### **Conversation Management**  
1. **Conversation List**  
   - Manages the list of conversations displayed in the sidebar.  
2. **Messages Per Conversation**  
   - Tracks all messages associated with each conversation.

### **Initialization Tasks**  
1. **Socket Registration**  
   - Register sockets for conversation-related actions:
     - Connect to the socket.
     - Initialize chat rooms for conversations.
     - Create channels for new conversations.  
2. **Load Data**  
   - Fetch conversation details (Just some field: name, avatar, lastMessage, time, UnRead?)
   - Load the 20 most recent messages for each conversation.

### **Cleanup Tasks (Destroy)**  
1. **Reset State**  
   - Clears all stored data and resets the state.  
2. **Socket Management**  
   - Disconnects all channels.  
   - Disconnects from the socket.

------------------ ## CHAT STORE AREA  ## --------------------
## **Chat Store Management**  
Focuses on managing the details of a specific conversation.

### **Actions**  
1. **Manage Message Actions**  
   - Handles actions like sending, replying, and deleting messages.  
2. **Send Message**  
   - Uses sockets to send messages in real-time if the other user is online.  
   - Adds messages to the conversation without sending if the user is offline.

### **Socket Events**  
1. **Message Management**  
   - Adds new incoming messages to the message list in the store.  
2. **Update Message Interactions**  
   - Updates message details like read receipts, reactions, or edits.

### **Initialization Tasks**  
1. **Clone Messages**  
   - Clones all messages for the current conversation from the **Conversation Store**.

### **Cleanup Tasks (Destroy)**  
1. **Sync Messages**  
   - Syncs the updated message list back to the **Conversation Store**.  
2. **Reset State**  
   - Clears all stored data and resets the state.

