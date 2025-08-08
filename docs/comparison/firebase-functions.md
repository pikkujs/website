---
sidebar_position: 11
title: Pikku vs Firebase Functions
---

:::note
Disclaimer: This has been generated using AI deep research and will likely have some mistakes. I have fixed parts that were glaring, and this will be improved with time.
:::

# **Firebase Functions vs. Pikku: A Feature Comparison**

## **Introduction**
Choosing the right framework depends on your project's needs. **Firebase Functions** is Google's **serverless compute platform** tightly integrated with Firebase services, providing event-driven functions and easy mobile/web app backends. **Pikku**, on the other hand, is a **backend framework** that provides **transport-agnostic functions** with built-in services and deployment flexibility.

Below is a **side-by-side comparison** to help you decide which one fits your use case.

---

## **Key Differences at a Glance**

| Feature                  | **Firebase Functions** 🎯                | **Pikku** ⚡                          |
|--------------------------|-------------------------------------------|--------------------------------------|
| **Core Philosophy**       | Google Cloud serverless with Firebase integration | Functions-first, transport-agnostic framework |
| **Primary Use Case**      | Mobile/web app backends with Firebase services | Backend APIs with deployment flexibility |
| **Vendor Lock-in**       | High (Google/Firebase ecosystem)        | **Zero (deploy anywhere)** |
| **Architecture**         | Event-driven Firebase-specific functions | **Transport-agnostic functions** |
| **Learning Curve**      | Gentle (Firebase ecosystem)             | **Moderate (functional approach)** |
| **Transport Support**     | HTTP functions + Firebase events        | **HTTP, WebSockets, RPC, schedulers** |
| **Database Integration** | Firestore/Realtime Database built-in    | **Any database with service injection** |
| **Authentication**       | Firebase Auth integration               | **Built-in session management** |
| **Real-time**            | Firestore real-time listeners          | **WebSocket channels with pub/sub** |
| **File Storage**         | Firebase Storage integration            | **Custom storage solutions** |
| **Validation**           | Manual implementation                   | **Automatic from TypeScript types** |
| **Testing**              | Firebase emulators                      | **Direct function testing** |
| **Background Jobs**      | Pub/Sub and scheduled functions         | **Built-in schedulers** |
| **Local Development**    | Firebase emulators                      | **Full local development environment** |
| **Pricing Model**        | Firebase/Google Cloud pricing          | **Infrastructure costs only** |

---

## **Core Philosophies**

### **Firebase Functions: Mobile-First Backend-as-a-Service**
Firebase Functions provides **serverless compute** tightly integrated with the Firebase ecosystem. It's designed for **mobile and web applications** that need **managed backend services** without infrastructure management.

- ✅ **Tight integration with Firebase services**  
- ✅ **Event-driven architecture with Firebase events**  
- ✅ **Mobile-optimized with offline capabilities**  
- ✅ **Managed infrastructure and scaling**  

### **Pikku: Platform-Agnostic Backend Framework**
Pikku focuses on **functions as the core abstraction** that work across **multiple transports and deployment targets**. It provides **built-in services** while maintaining **platform independence**.

- ✅ **Functions work across HTTP, WebSockets, RPC, schedulers**  
- ✅ **Deploy anywhere (your choice of infrastructure)**  
- ✅ **Built-in authentication, validation, and services**  
- ✅ **Platform independence and vendor neutrality**  

---

## **Feature Breakdown**

### **🏗️ Platform Integration**
Different approaches to backend services and platform coupling.

| Aspect                 | **Firebase Functions** 🏛️      | **Pikku** 🏗️                     |
|------------------------|---------------------------------|---------------------------------|
| **Platform Coupling** | Tightly coupled to Firebase/GCP | **Platform agnostic** |
| **Service Integration** | Built-in Firebase services     | **Service injection pattern** |
| **Data Storage**       | Firestore/Realtime Database    | **Any database (your choice)** |
| **Vendor Independence** | Firebase/Google ecosystem only  | **Deploy to any platform** |

### **📊 Data & Real-time**
Different approaches to data management and real-time features.

| Feature                | **Firebase Functions** 🔄      | **Pikku** 📊                     |
|------------------------|---------------------------------|---------------------------------|
| **Database**           | Firestore/Realtime Database    | **Any database with service injection** |
| **Real-time Updates**  | Firestore real-time listeners  | **WebSocket channels with pub/sub** |
| **Offline Support**    | Built-in offline sync           | **Client-side responsibility** |
| **Data Validation**    | Firebase Security Rules         | **Automatic from TypeScript types** |

### **🔗 Function Architecture**
Different approaches to organizing and executing serverless functions.

| Architecture Aspect    | **Firebase Functions** 🌐      | **Pikku** 🔥                     |
|------------------------|---------------------------------|---------------------------------|
| **Function Types**     | HTTP + Firebase event triggers  | **Transport-agnostic functions** |
| **Event Sources**      | Firebase services (Auth, Firestore, etc.) | **Custom events + built-in schedulers** |
| **Code Organization**  | Function-per-file pattern       | **Function definitions + wiring** |
| **Deployment Unit**    | Individual functions             | **Application-level deployment** |

### **🔑 Authentication & Security**
Different approaches to user authentication and security.

| Feature                | **Firebase Functions** 🔐      | **Pikku** 🔒                   |
|------------------------|---------------------------------|--------------------------------|
| **Authentication**     | Firebase Auth integration       | **Built-in session management** |
| **User Management**    | Firebase Auth user management   | **Custom user management** |
| **Security Rules**     | Firestore Security Rules        | **Custom permission system** |
| **Token Validation**   | Firebase Auth tokens            | **Built-in JWT service** |

---

## **Code Examples**

### **Firebase Functions Implementation**
```typescript
import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'

admin.initializeApp()
const db = admin.firestore()

// HTTP function
export const getUser = functions.https.onRequest(async (req, res) => {
  try {
    const { id } = req.params
    
    if (!id) {
      return res.status(400).json({ error: 'User ID required' })
    }

    const userDoc = await db.collection('users').doc(id).get()
    
    if (!userDoc.exists) {
      return res.status(404).json({ error: 'User not found' })
    }

    res.cors(req, res, () => {
      res.json(userDoc.data())
    })
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' })
  }
})

// Firestore trigger function
export const onUserCreate = functions.firestore
  .document('users/{userId}')
  .onCreate(async (snap, context) => {
    const userData = snap.data()
    const userId = context.params.userId
    
    // Send welcome email
    await admin.messaging().send({
      token: userData.fcmToken,
      notification: {
        title: 'Welcome!',
        body: 'Thanks for joining our app!'
      }
    })
    
    // Create user profile
    await db.collection('profiles').doc(userId).set({
      userId,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      displayName: userData.displayName || 'Anonymous'
    })
  })

// Authentication trigger
export const onUserSignUp = functions.auth.user().onCreate(async (user) => {
  // Create user document in Firestore
  await db.collection('users').doc(user.uid).set({
    email: user.email,
    displayName: user.displayName,
    photoURL: user.photoURL,
    createdAt: admin.firestore.FieldValue.serverTimestamp()
  })
})

// Scheduled function
export const dailyUserCleanup = functions.pubsub
  .schedule('0 2 * * *')
  .timeZone('America/New_York')
  .onRun(async (context) => {
    const cutoff = admin.firestore.Timestamp.fromDate(
      new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) // 30 days ago
    )
    
    const inactiveUsers = await db.collection('users')
      .where('lastActive', '<', cutoff)
      .get()
    
    const batch = db.batch()
    inactiveUsers.docs.forEach(doc => {
      batch.delete(doc.ref)
    })
    
    await batch.commit()
    console.log(`Cleaned up ${inactiveUsers.size} inactive users`)
  })

// Pub/Sub function
export const processUserAnalytics = functions.pubsub
  .topic('user-events')
  .onPublish(async (message) => {
    const eventData = message.json
    
    await db.collection('analytics').add({
      ...eventData,
      processedAt: admin.firestore.FieldValue.serverTimestamp()
    })
  })
```

### **Pikku Function-Based Approach**
```typescript
// user.functions.ts
export const getUser = pikkuFunc<{ id: string }, User>()
.func(async (services, data) => {
  return await services.database.getUser(data.id)
})

export const createUser = pikkuFunc<CreateUserInput, User>()
.func(async (services, data) => {
  const user = await services.database.createUser(data)
  
  // Trigger welcome flow
  await services.events?.publish('user.created', user)
  
  // Send real-time update
  await services.channel?.broadcast('user-updates', {
    type: 'user-created',
    user
  })
  
  return user
})

export const onUserCreate = pikkuFunc<User, void>()
.func(async (services, user) => {
  // Send welcome notification
  await services.notifications?.send({
    userId: user.id,
    title: 'Welcome!',
    message: 'Thanks for joining our app!'
  })
  
  // Create user profile
  await services.database.createProfile({
    userId: user.id,
    displayName: user.displayName || 'Anonymous',
    createdAt: new Date()
  })
})

export const dailyUserCleanup = pikkuFunc<{}, CleanupResult>()
.func(async (services) => {
  const cutoffDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
  return await services.database.cleanupInactiveUsers(cutoffDate)
})

export const processUserAnalytics = pikkuFunc<AnalyticsEvent, void>()
.func(async (services, eventData) => {
  await services.database.saveAnalyticsEvent({
    ...eventData,
    processedAt: new Date()
  })
})

// user.wiring.ts
wireHTTP({
  method: 'get',
  route: '/users/:id',
  func: getUser
})

wireHTTP({
  method: 'post',
  route: '/users',
  func: createUser
})

// Event-driven processing
wireEvent({
  event: 'user.created',
  func: onUserCreate
})

// Scheduled cleanup
wireScheduler({
  name: 'daily-cleanup',
  schedule: '0 2 * * *',
  func: dailyUserCleanup
})

// Pub/Sub processing
wireEvent({
  event: 'user-analytics',
  func: processUserAnalytics
})

// Real-time WebSocket channel
wireChannel({
  name: 'user-updates',
  onMessageWiring: {
    action: {
      getUser,
      createUser
    }
  }
})
```

---

## **Client Integration Comparison**

### **Firebase SDK Integration**
```typescript
import { initializeApp } from 'firebase/app'
import { getFirestore, doc, getDoc, onSnapshot } from 'firebase/firestore'
import { getFunctions, httpsCallable } from 'firebase/functions'
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth'

const app = initializeApp(firebaseConfig)
const db = getFirestore(app)
const functions = getFunctions(app)
const auth = getAuth(app)

// Call HTTP function
const getUser = httpsCallable(functions, 'getUser')
const { data: user } = await getUser({ id: 'user123' })

// Real-time Firestore listener
const userRef = doc(db, 'users', 'user123')
const unsubscribe = onSnapshot(userRef, (doc) => {
  console.log('User updated:', doc.data())
})

// Authentication
await signInWithEmailAndPassword(auth, email, password)
```

### **Pikku Auto-Generated Client**
```typescript
import { pikkuFetch, pikkuWebSocket } from './api/pikku-client.gen'

// Type-safe REST API calls
const user = await pikkuFetch.get('/users/user123')

// Real-time WebSocket updates
const ws = pikkuWebSocket.connect('user-updates')
ws.on('user-created', (data) => {
  console.log('New user:', data.user)
})

// Custom authentication
await pikkuFetch.post('/auth/login', { email, password })
```

---

## **When to Use Firebase Functions vs. Pikku**

### **Choose Firebase Functions if…**
✔️ You're building **mobile or web applications** with Firebase  
✔️ You want **managed backend services** without infrastructure concerns  
✔️ You need **tight integration** with Firebase Auth, Firestore, Storage  
✔️ You want **real-time capabilities** with offline sync  
✔️ You prefer **event-driven architecture** with Firebase triggers  
✔️ You're comfortable with **vendor lock-in** for faster development  
✔️ You need **mobile push notifications** and **analytics**  
✔️ You want **managed scaling** without configuration  

### **Choose Pikku if…**
✔️ You need **platform independence** and **deployment flexibility**  
✔️ You want **transport-agnostic functions** (HTTP, WebSocket, RPC)  
✔️ You prefer **any database** over Firestore constraints  
✔️ You need **advanced backend logic** beyond Firebase capabilities  
✔️ You want **full local development** without cloud dependencies  
✔️ You prefer **TypeScript-first development** with automatic validation  
✔️ You need **multiple deployment targets** (Express, Lambda, etc.)  
✔️ You want to **avoid vendor lock-in**  

---

## **Migration Considerations**

### **Firebase Functions to Pikku Migration**
1. **Firebase Events** → **Custom Events** (define your own event system)
2. **Firestore** → **Any Database** (migrate data and queries)
3. **Firebase Auth** → **Custom Auth** (implement authentication system)
4. **Cloud Functions** → **Pikku Functions** (extract business logic)
5. **Firebase SDK** → **Auto-generated Client** (update client code)

### **Key Migration Challenges**
- **Database Migration**: Firestore → your chosen database
- **Authentication**: Firebase Auth → custom auth system
- **Real-time**: Firestore listeners → WebSocket channels
- **Mobile Integration**: Firebase SDK → custom API client
- **Push Notifications**: FCM → custom notification service

### **Migration Benefits**
- **Platform Independence**: Deploy anywhere
- **Cost Control**: Choose your infrastructure
- **Advanced Logic**: No Firebase limitations
- **Transport Flexibility**: HTTP + WebSocket + RPC

---

## **Cost Comparison**

### **Firebase Functions Pricing**
- **Compute**: $0.40 per million invocations + $0.0000025 per GB-second
- **Firestore**: $0.18 per 100K document reads, $0.18 per 100K writes
- **Firebase Auth**: Free up to 50K MAU, then $0.02 per additional user
- **Bandwidth**: $0.12 per GB
- **Lock-in Cost**: Difficult to migrate away

### **Pikku Infrastructure Costs**
- **Deployment**: Only infrastructure costs (server/Lambda/Cloudflare)
- **Database**: Your choice (PostgreSQL, MongoDB, etc.)
- **Authentication**: Custom implementation (free) or service
- **Freedom**: Easy to migrate between platforms

---

## **Final Thoughts**
Firebase Functions and Pikku serve **different development philosophies**:

- **Firebase Functions** is best for **mobile/web applications** that need **rapid development with managed Firebase services and tight ecosystem integration**.  
- **Pikku** is best for **platform-independent backends** that need **flexible deployment, transport-agnostic functions, and freedom from vendor lock-in**.

If **Firebase ecosystem, managed services, and rapid mobile development** are your priority, go with **Firebase Functions**. If you want **platform independence, deployment flexibility, and advanced backend capabilities**, **Pikku** is the way to go.

**Migration path**: Many teams start with **Firebase Functions for rapid prototyping**, then **migrate to Pikku for production systems** that need more control and flexibility!