// 🔖 BOOKMARKLET VERSION
// Create a bookmark with this URL for one-click autofill:

javascript:(function(){const data={name:"Your Name",email:"your@email.com",phone:"(555) 123-4567",location:"Your City, State",org:"Your Company"};document.querySelectorAll('input').forEach(i=>{const f=(i.name+i.placeholder).toLowerCase();if(f.includes('name'))i.value=data.name;else if(f.includes('email'))i.value=data.email;else if(f.includes('phone'))i.value=data.phone;else if(f.includes('location'))i.value=data.location;else if(f.includes('org')||f.includes('company'))i.value=data.org;});document.querySelector('input[value*="she" i],input[value*="her" i]')?.click();alert('🎊 Job application auto-filled!');})();

// HOW TO USE:
// 1. Copy the javascript: URL above
// 2. Create new bookmark in your browser
// 3. Paste as the URL
// 4. Name it "Autofill Job App 🚀"
// 5. Click the bookmark on any job page!