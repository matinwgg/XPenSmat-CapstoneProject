import Icon from 'react-native-vector-icons/Ionicons';
import Ionicons from '@expo/vector-icons/Ionicons';



const expenseCategories = {
    "Food & Dining": {
        icon: "🍔",
        subcategories: {
            "Groceries": "🛒",
            "Restaurants": "🍽️",
            "Cafes": "☕"
        }
    },
    "Transportation": {
        icon: "🚗",
        subcategories: {
            "Gas": "⛽",
            "Public Transport": "🚌",
            "Taxi": "🚕"
        }
    },
    "Utilities": {
        icon: "💡",
        subcategories: {
            "Electricity": "🔌",
            "Water": "🚰",
            "Internet": "🌐"
        }
    },
    "Healthcare": {
        icon: "🏥",
        subcategories: {
            "Medicine": "💊",
            "Doctor": "👨‍⚕️",
            "Dental": "🦷"
        }
    },
    "Entertainment": {
        icon: "🎉",
        subcategories: {
            "Movies": "🎬",
            "Concerts": "🎤",
            "Games": "🎮"
        }
    },
    "Shopping": {
        icon: "🛍️",
        subcategories: {
            "Clothing": "👗",
            "Electronics": "📱",
            "Accessories": "👜"
        }
    },
    "Personal Care": {
        icon: "💅",
        subcategories: {
            "Haircuts": "💇",
            "Spa": "💆",
            "Makeup": "💄"
        }
    },
    "Education": {
        icon: "🎓",
        subcategories: {
            "Books": "📚",
            "Courses": "📖",
            "Supplies": "✏️"
        }
    },
    "Insurance": {
        icon: "🛡️",
        subcategories: {
            "Health Insurance": "🏥",
            "Car Insurance": "🚗",
            "Home Insurance": "🏡"
        }
    },
    "Housing": {
        icon: "🏠",
        subcategories: {
            "Rent": "🏘️",
            "Mortgage": "🏡",
            "Repairs": "🔧"
        }
    },
    "Travel": {
        icon: "✈️",
        subcategories: {
            "Flights": "🛫",
            "Hotels": "🏨",
            "Tours": "🗺️"
        }
    },
    "Savings": {
        icon: "💰",
        subcategories: {
            "Emergency Fund": "🚨",
            "Investments": "📈",
            "Retirement": "🏦"
        }
    },
    "Gifts & Donations": {
        icon: "🎁",
        subcategories: {
            "Charity": "🙏",
            "Gifts": "🎀",
            "Donations": "👐"
        }
    },
    "Others": {
        icon: "🔖",
        subcategories: {
            "Miscellaneous": "🔄",
            "Uncategorized": "❓"
        }
    },
    "Fitness & Sports": {
        icon: "🏋️",
        subcategories: {
            "Gym Membership": "🏋️‍♂️",
            "Sports Equipment": "⚽",
            "Yoga": "🧘",
            "Fitness Classes": "🧘‍♀️",
            "Sports Events": "🏅"
        }
    },
    "Pets": {
        icon: "🐾",
        subcategories: {
            "Pet Food": "🍖",
            "Vet Visits": "🩺",
            "Grooming": "✂️",
            "Toys": "🧸",
            "Pet Insurance": "🐕"
        }
    },
    "Family": {
        icon: "👪",
        subcategories: {
            "Childcare": "🧒",
            "Baby Supplies": "🍼",
            "School Fees": "🏫",
            "Allowance": "💵",
            "Family Activities": "🎨"
        }
    },
    "Home Maintenance": {
        icon: "🏠",
        subcategories: {
            "Cleaning Supplies": "🧹",
            "Repairs": "🔧",
            "Furniture": "🛋️",
            "Gardening": "🌿",
            "Security": "🔒"
        }
    },
    "Hobbies": {
        icon: "🎨",
        subcategories: {
            "Arts & Crafts": "🖌️",
            "Music": "🎸",
            "Photography": "📷",
            "Collectibles": "🖼️",
            "Books & Magazines": "📚"
        }
    },
    "Events & Celebrations": {
        icon: "🎊",
        subcategories: {
            "Birthdays": "🎂",
            "Weddings": "💒",
            "Holidays": "🎄",
            "Parties": "🥳",
            "Gifts": "🎁"
        }
    },
    "Technology": {
        icon: "💻",
        subcategories: {
            "Gadgets": "📱",
            "Software": "💽",
            "Repairs": "🔧",
            "Subscriptions": "📄",
            "Accessories": "🎧"
        }
    },
    "Legal & Financial": {
        icon: "⚖️",
        subcategories: {
            "Legal Fees": "📜",
            "Financial Services": "💼",
            "Taxes": "💸",
            "Loans": "🏦",
            "Investment Fees": "📈"
        }
    },
    "Professional Services": {
        icon: "🛠️",
        subcategories: {
            "Consulting": "💼",
            "Freelancers": "👨‍💻",
            "Tutoring": "👨‍🏫",
            "Coaching": "🧑‍🏫",
            "Other Services": "🛠️"
        }
    },
    "Miscellaneous": {
        icon: "🔖",
        subcategories: {
            "Unexpected Expenses": "🚨",
            "Fees": "💳",
            "Penalties": "⚠️",
            "Fines": "🚫",
            "Miscellaneous": "🔄"
        }
    },
    "Automotive": {
        icon: "🚗",
        subcategories: {
            "Fuel": "⛽",
            "Maintenance": "🔧",
            "Insurance": "🛡️",
            "Parking": "🅿️",
            "Tolls": "🚧"
        }
    },
    "Household Supplies": {
        icon: "🧻",
        subcategories: {
            "Cleaning Products": "🧼",
            "Laundry Supplies": "🧺",
            "Paper Goods": "📄",
            "Trash Bags": "🗑️",
            "Light Bulbs": "💡"
        }
    },
    "Office Supplies": {
        icon: "📎",
        subcategories: {
            "Stationery": "🖊️",
            "Printer Supplies": "🖨️",
            "Office Furniture": "🪑",
            "Computer Accessories": "💻",
            "Organizers": "📁"
        }
    },
    "Public Services": {
        icon: "🏛️",
        subcategories: {
            "Postage": "✉️",
            "Library Fees": "📚",
            "Public Transport": "🚌",
            "Government Fees": "🏢",
            "Parking Meters": "🅿️"
        }
    },
    "Gifts & Donations": {
        icon: "🎁",
        subcategories: {
            "Charity": "🙏",
            "Gifts": "🎀",
            "Donations": "👐",
            "Fundraisers": "📅",
            "Crowdfunding": "🌐"
        }
    },
    "Personal Development": {
        icon: "🌱",
        subcategories: {
            "Books": "📚",
            "Online Courses": "💻",
            "Workshops": "🛠️",
            "Seminars": "🎤",
            "Certifications": "📜"
        }
    },
    "Garden & Outdoor": {
        icon: "🌿",
        subcategories: {
            "Plants": "🌱",
            "Seeds": "🌾",
            "Garden Tools": "🛠️",
            "Outdoor Furniture": "🪑",
            "Landscaping": "🌳"
        }
    },
    "Beauty & Grooming": {
        icon: "💅",
        subcategories: {
            "Hair Products": "💇",
            "Skincare": "🧴",
            "Makeup": "💄",
            "Nail Care": "💅",
            "Fragrances": "🌸"
        }
    },
    "Home Improvement": {
        icon: "🔨",
        subcategories: {
            "Tools": "🛠️",
            "Paint": "🎨",
            "Hardware": "🔩",
            "Electrical": "💡",
            "Plumbing": "🚰"
        }
    },
    "Emergency": {
        icon: "🚨",
        subcategories: {
            "Medical Emergency": "🏥",
            "Vehicle Breakdown": "🚗",
            "Home Repairs": "🔧",
            "Travel Emergency": "✈️",
            "Unexpected Expenses": "⚠️"
        }
    },
    "Electronics & Gadgets": {
        icon: "📱",
        subcategories: {
            "Smartphones": "📱",
            "Computers": "💻",
            "Tablets": "📱",
            "Wearables": "⌚",
            "Home Electronics": "📺"
        }
    }

    
};

// Example usage:
console.log(expenseCategories);
