🌿 ReWear – Community Clothing Exchange

> A MERN-stack platform to promote sustainable fashion through direct swaps and point-based redemptions.

---

## #️⃣ Overview

**ReWear** is a web-based community platform that reduces textile waste by making it easy to exchange clothes. Users can swap items directly with others or redeem them using earned points, extending the life cycle of garments and promoting sustainable fashion choices.  

This project was developed as part of a hackathon to address real-world sustainability challenges using technology.

---

## #️⃣ Problem Statement

> Fast fashion generates massive textile waste. Many people discard perfectly usable clothing because there's no easy way to exchange it.

**ReWear** addresses this by providing:

- A **community-powered exchange** where users swap clothing directly  
- A **points-based system** to redeem clothing fairly  
- **Admin moderation** to keep the platform safe and trusted  

By encouraging reuse, ReWear helps divert clothing from landfills and makes sustainable choices accessible to everyone.

---

## #️⃣ Key Features

✅ **User Authentication (Passport.js)**  
- Secure email/password signup and login  
- Session management  

✅ **Landing Page**  
- Platform introduction  
- Calls to Action: Start Swapping, Browse Items, List an Item  
- Responsive featured items carousel  

✅ **User Dashboard**  
- Profile details with points balance  
- Uploaded items overview  
- Ongoing and completed swaps list  

✅ **Item Detail Page**  
- Responsive image gallery  
- Full item description with category, size, condition, and tags  
- Uploader info  
- Options: Request Swap or Redeem with Points  
- Live availability status  

✅ **Add New Item Page**  
- Upload multiple images (local filesystem storage)  
- Input title, description, category, type, size, condition, tags  
- Client-side validation and submission  

✅ **Admin Panel**  
- Approve or reject item listings  
- Remove inappropriate or spam items  
- Lightweight, easy-to-use moderation dashboard  

---

## #️⃣ Tech Stack

🖥 **Frontend**  
- React  
- React Router  
- HTML, CSS, JavaScript  
- Responsive CSS design  

🗄 **Backend**  
- Node.js  
- Express  
- MongoDB (Mongoose)  

🔐 **Authentication**  
- Passport.js  

🗂 **File Storage**  
- Local filesystem (/uploads folder for development)  

⚙ **State Management**  
- Context API or Redux  
