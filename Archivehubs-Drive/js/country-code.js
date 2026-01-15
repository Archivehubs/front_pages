const countryData = [
    { name: "United States", code: "+1", flag: "🇺🇸" },
    { name: "United Kingdom", code: "+44", flag: "🇬🇧" },
    { name: "India", code: "+91", flag: "🇮🇳" },
    { name: "Nigeria", code: "+234", flag: "🇳🇬" },
    { name: "Canada", code: "+1", flag: "🇨🇦" },
    { name: "Australia", code: "+61", flag: "🇦🇺" },
    { name: "Germany", code: "+49", flag: "🇩🇪" },
    { name: "France", code: "+33", flag: "🇫🇷" },
    { name: "Italy", code: "+39", flag: "🇮🇹" },
    { name: "Spain", code: "+34", flag: "🇪🇸" },
    { name: "Brazil", code: "+55", flag: "🇧🇷" },
    { name: "Mexico", code: "+52", flag: "🇲🇽" },
    { name: "China", code: "+86", flag: "🇨🇳" },
    { name: "Japan", code: "+81", flag: "🇯🇵" },
    { name: "South Korea", code: "+82", flag: "🇰🇷" },
    { name: "Russia", code: "+7", flag: "🇷🇺" },
    { name: "South Africa", code: "+27", flag: "🇿🇦" },
    { name: "Kenya", code: "+254", flag: "🇰🇪" },
    { name: "Ghana", code: "+233", flag: "🇬🇭" },
    { name: "Egypt", code: "+20", flag: "🇪🇬" },
    { name: "Saudi Arabia", code: "+966", flag: "🇸🇦" },
    { name: "UAE", code: "+971", flag: "🇦🇪" },
    { name: "Pakistan", code: "+92", flag: "🇵🇰" },
    { name: "Bangladesh", code: "+880", flag: "🇧🇩" },
    { name: "Philippines", code: "+63", flag: "🇵🇭" },
    { name: "Singapore", code: "+65", flag: "🇸🇬" },
    { name: "Malaysia", code: "+60", flag: "🇲🇾" },
    { name: "Indonesia", code: "+62", flag: "🇮🇩" },
    { name: "Thailand", code: "+66", flag: "🇹🇭" },
    { name: "Vietnam", code: "+84", flag: "🇻🇳" }
];

const countrySelect = document.getElementById('countrySelect');
const phoneInput = document.getElementById('phone');
const phoneError = document.getElementById('phoneError');

// Populate country select
function populateCountries() {
    countryData.sort((a, b) => a.name.localeCompare(b.name));
    
    countryData.forEach(country => {
        const option = document.createElement('option');
        option.value = country.code;
        option.innerHTML = `${country.flag} ${country.name} (${country.code})`;
        countrySelect.appendChild(option);
    });
}

// Basic phone number validation
function validatePhoneNumber() {
    const phoneNumber = phoneInput.value;
    const phoneRegex = /^\d{6,15}$/; // Basic regex for 6-15 digits

    if (!phoneRegex.test(phoneNumber)) {
        phoneError.textContent = 'Please enter a valid phone number';
        return false;
    }

    phoneError.textContent = '';
    return true;
}

// Event listeners
phoneInput.addEventListener('input', validatePhoneNumber);

// Initialize
populateCountries();

// Form submission
document.querySelector('form').addEventListener('submit', function(e) {
    if (!validatePhoneNumber()) {
        e.preventDefault();
    }
});
