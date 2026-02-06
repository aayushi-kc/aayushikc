// Simple JavaScript for interactivity
console.log("Portfolio loaded!");

// Mobile menu toggle (if you add a mobile menu)
document.addEventListener('DOMContentLoaded', function() {
    // Add click animation to tags
    const tags = document.querySelectorAll('.tag');
    tags.forEach(tag => {
        tag.addEventListener('click', function() {
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = 'scale(1)';
            }, 200);
        });
    });

    // Add current year to footer if you have one
    const yearSpan = document.getElementById('current-year');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }
});

// Download portfolio as text
function downloadPortfolio() {
    const portfolioData = {
        name: document.querySelector('h1').textContent.replace("Hello, I'm ", ""),
        age: document.querySelector('p:nth-child(2)').textContent.replace("Age: ", ""),
        address: document.querySelector('p:nth-child(3)').textContent.replace("Address: ", ""),
        school: document.querySelector('p:nth-child(4)').textContent.replace("School: ", ""),
        grade: document.querySelector('p:nth-child(5)').textContent.replace("Grade: ", "")
    };

    const content = `Portfolio\n\nName: ${portfolioData.name}\nAge: ${portfolioData.age}\nAddress: ${portfolioData.address}\nSchool: ${portfolioData.school}\nGrade: ${portfolioData.grade}`;

    const blob = new Blob([content], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'portfolio.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);

    alert('Portfolio downloaded!');
}