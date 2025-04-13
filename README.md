🧠 KnowledgeBridge: AI-Powered Craft Knowledge Preservation

Submission for SD-1: Building a system that preserves and transfers specialized knowledge across generations.
🚀 Problem Statement

    SD-1
    Build a system that preserves and transfers specialized knowledge across generations:

        ✅ AI-assisted documentation of craft techniques from retiring professionals

        ✅ Interactive learning modules combining video, text, and 3D models

        ✅ Remote mentorship matching with availability scheduling

        ✅ Progress verification through uploaded work samples

        ✅ Specialized forums for technique questions

        ✅ Marketplace for completed projects/products made by learners

🌉 Project Overview

KnowledgeBridge is a solution for lifelong learning, skill preservation, and generational knowledge transfer using AI, modern web tech, and interactive education tools.
🧰 Technologies Used
Category	Tools / Frameworks
Frontend	Tailwind CSS, HTML, JS/TS, Replit IDE
Backend	PHP, Node.js, Drizzle ORM
AI Services	GPT (for document generation & Q&A)
Database	MySQL, ORM Layer
Dev Tools	Composer, npm, TypeScript, Replit
Styling	Tailwind CSS, PostCSS
3D & Media	Integration-ready for WebGL, Video, PDF
Collaboration	Remote scheduling, forums, mentorship
🧑‍🏫 Learning & Teaching Approach
🎥 Interactive Learning Modules

    Blend of text, video, and 3D content.

    Auto-generated documentation via GPT-based AI Assist.

    Modules like Intractive_learning.php serve dynamic learning flows.

🧓 Knowledge from Experts

    Retiring professionals upload videos or walk through AI-generated documentation templates.

    PHP backend handles content ingestion, AI querying, and dynamic rendering.

🧑‍🏫 Mentorship Matching

    Learners schedule sessions with mentors.

    Availability logic & scheduling handled via database hooks (custom PHP logic).

📸 Progress Verification

    Upload work samples (image, text, video).

    Submissions can be verified or peer-reviewed through platform tools.

🛍️ Marketplace

    Completed projects are sold through integrated commerce modules (insert_marketplace.php, purchase_project.php).

    Opportunity to showcase skills and earn.

💬 Specialized Forums

    Technique-specific discussion rooms.

    Future-ready for AI-powered answers via GPT APIs.

📁 Project Structure (Combined)

KnowledgeBridge/
├── .replit                        # Replit deployment config
├── drizzle.config.ts              # ORM config
├── tailwind.config.ts             # Tailwind UI setup
├── package.json                   # Node dependencies
└── src/                           # Main app code (React, APIs)

├── AI_Assist_documnt.php          # GPT-based documentation tool
├── apis.php                       # API Used
├── database.php                   # DB connection logic
├── insert_marketplace.php         # Marketplace feature
├── Intractive_learning.php        # Learning module engine
├── purchase_project.php           # Purchase flow
└── debug_api_response.json        # Sample GPT response

🧪 How to Run
KnowledgeBridge (Frontend)

cd KnowledgeBridge
npm install
npm run dev

    Visit http://localhost:3000 or the Replit live link.

GPT Backend (PHP)

composer install
php -S localhost:8000

    Access http://localhost:8000/AI_Assist_documnt.php to see the GPT-assisted tool.

📄 Submission Checklist ✅

AI-assisted documentation of craft techniques

Interactive learning modules

Remote mentorship & scheduling

Progress verification via uploads

Specialized forums (API-ready)

    Marketplace integration

🪪 License

Currently under internal development — please add a license before public release.

Let me know if you want this saved to a file, or zipped along with the source code for submission.
You said:
add you have to add the the user to make uploads folder for storing the data like image 
ChatGPT said:

Got it! Here's the updated README.md with instructions to create an uploads/ folder for storing data like images or user submissions. I've added this under both the setup and backend sections.
🧠 KnowledgeBridge: AI-Powered Craft Knowledge Preservation

Submission for SD-1: Building a system that preserves and transfers specialized knowledge across generations.
🚀 Problem Statement

    SD-1
    Build a system that preserves and transfers specialized knowledge across generations:

        ✅ AI-assisted documentation of craft techniques from retiring professionals

        ✅ Interactive learning modules combining video, text, and 3D models

        ✅ Remote mentorship matching with availability scheduling

        ✅ Progress verification through uploaded work samples

        ✅ Specialized forums for technique questions

        ✅ Marketplace for completed projects/products made by learners

🌉 Project Overview

KnowledgeBridge solution for lifelong learning, skill preservation, and generational knowledge transfer using AI, modern web tech, and interactive education tools.
🧰 Technologies Used
Category	Tools / Frameworks
Frontend	Tailwind CSS, HTML, JS/TS, Replit IDE
Backend	PHP, Node.js, Drizzle ORM
AI Services	GPT (for document generation & Q&A)
Database	MySQL, ORM Layer
Dev Tools	Composer, npm, TypeScript, Replit
Styling	Tailwind CSS, PostCSS
3D & Media	Integration-ready for WebGL, Video, PDF
Collaboration	Remote scheduling, forums, mentorship
🧑‍🏫 Learning & Teaching Approach
🎥 Interactive Learning Modules

    Blend of text, video, and 3D content.

    Auto-generated documentation via GPT-based AI Assist.

    Modules like Intractive_learning.php serve dynamic learning flows.

🧓 Knowledge from Experts

    Retiring professionals upload videos or walk through AI-generated documentation templates.

    PHP backend handles content ingestion, AI querying, and dynamic rendering.

🧑‍🏫 Mentorship Matching

    Learners schedule sessions with mentors.

    Availability logic & scheduling handled via database hooks (custom PHP logic).

📸 Progress Verification

    Upload work samples (image, text, video).

    Submissions can be verified or peer-reviewed through platform tools.

🛍️ Marketplace

    Completed projects are sold through integrated commerce modules (insert_marketplace.php, purchase_project.php).

    Opportunity to showcase skills and earn.

💬 Specialized Forums

    Technique-specific discussion rooms.

    Future-ready for AI-powered answers via GPT APIs.

📁 Project Structure (Combined)

KnowledgeBridge/
├── .replit                        # Replit deployment config
├── drizzle.config.ts              # ORM config
├── tailwind.config.ts             # Tailwind UI setup
├── package.json                   # Node dependencies
└── src/                           # Main app code (React, APIs)
PHP_Code
├── AI_Assist_documnt.php          # GPT-based documentation tool
├── apis.php                       # API router
├── database.php                   # DB connection logic
├── insert_marketplace.php         # Marketplace feature
├── Intractive_learning.php        # Learning module engine
├── purchase_project.php           # Purchase flow
├── debug_api_response.json        # Sample GPT response
└── uploads/                       # 📂 Folder to store user-submitted files (images, videos)

🧪 How to Run
KnowledgeBridge (Frontend)

cd KnowledgeBridge
npm install
npm run dev

    Visit http://localhost:3000 or the Replit live link.


composer install
php -S localhost:8000

    Access http://localhost:8000/AI_Assist_documnt.php to see the GPT-assisted tool.

📂 Make Sure to Create the uploads/ Folder

Before running the backend:

mkdir uploads
chmod 755 uploads

This folder is used to store:

    Uploaded work samples (images, videos, documents)

    Marketplace assets

    Media from learning modules

Make sure this folder is writable by the web server.
📄 Submission Checklist ✅

AI-assisted documentation of craft techniques

Interactive learning modules

Remote mentorship & scheduling

Progress verification via uploads

Specialized forums (API-ready)

    Marketplace integration

🪪 License

Currently under internal development — please add a license before public release.
