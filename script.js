document.addEventListener('DOMContentLoaded', function() {
    // Initialize AOS (Animate on Scroll)
    AOS.init({
        duration: 1000,
        once: true,
    });

    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                window.scrollTo({
                    top: target.offsetTop - 50, 
                    behavior: 'smooth'
                });
            }
        });
    });

    // Form submission handling with success message
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Create success message
            const successMsg = document.createElement('p');
            successMsg.textContent = 'Thank you for your message! I will get back to you soon.';
            successMsg.classList.add('success-message');

            // Append message to form and remove after 3 seconds
            contactForm.appendChild(successMsg);
            setTimeout(() => successMsg.remove(), 3000);

            this.reset();
        });
    }

    // Responsive navigation menu
    const navToggle = document.querySelector('.nav-toggle');
    const navLinks = document.querySelector('.nav-links');

    if (navToggle) {
        navToggle.addEventListener('click', function() {
            navLinks.classList.toggle('active');
            this.classList.toggle('active');
        });
    }

    // Close menu when a link is clicked
    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
            navToggle.classList.remove('active');
        });
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!navLinks.contains(e.target) && !navToggle.contains(e.target) && navLinks.classList.contains('active')) {
            navLinks.classList.remove('active');
            navToggle.classList.remove('active');
        }
    });

    // Resize handler to remove active state on larger screens
    function handleResize() {
        if (window.innerWidth > 768) {
            navLinks.classList.remove('active');
            navToggle.classList.remove('active');
        }
    }

    window.addEventListener('resize', handleResize);
});
// function sendEmail(event) {
//                             event.preventDefault();

//                             // Get form elements
//                             const name = document.getElementById("name").value.trim();
//                             const phone = document.getElementById("phone").value.trim();
//                             const email = document.getElementById("from_mail").value.trim();
//                             const message = document.getElementById("message").value.trim();

//                             // Validation
//                             if (!name) {
//                                 alert("Name is required.");
//                                 return;
//                             }

//                             if (!email || !validateEmail(email)) {
//                                 alert("Please enter a valid email address.");
//                                 return;
//                             }

//                             if (phone && !validatePhone(phone)) {
//                                 alert("Please enter a valid phone number.");
//                                 return;
//                             }

//                             if (!message) {
//                                 alert("Message is required.");
//                                 return;
//                             }

//                             // Send email if validation passes
//                             emailjs.sendForm("service_dm6e05n", "template_241umha", document.getElementById("contact-Form"))
//                                 .then(
//                                     () => {
//                                         console.log("SUCCESS!");
//                                         alert("Email sent successfully!");
//                                         document.forms["contact-Form"].reset();
//                                     },
//                                     (error) => {
//                                         console.log("FAILED...", error);
//                                         alert("Failed to send email. Please try again later.");
//                                     }
//                                 );
//                         }

//                         function validateEmail(email) {
//                             const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//                             return emailPattern.test(email);
//                         }

//                         function validatePhone(phone) {
//                             const phonePattern = /^\+?[0-9\s]*$/; // Adjust this regex as needed
//                             return phonePattern.test(phone);
//                         }

