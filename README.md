# 🌱 AGRISENSE

### Smart Crop Recommendation & Farm Management

AGRISENSE is a farmer-focused web application designed to help farmers make better crop-selection decisions using information such as **soil type, location, season, and farm size**.

The application provides crop recommendations along with suitability information, water requirements, growing time, weather information, and mandi price information.

---

##  Features

### Smart Crop Recommendation
- Select the soil type of the farm.
- Select the farming location/region.
- Select the current season.
- Enter the farm size.
- Get the **Top 3 recommended crops**.
- View crop suitability percentage.
- View the reason for the recommendation.
- View water requirements.
- View expected growing time.

###  Crop Suitability Comparison
The application provides a visual comparison of recommended crops based on their suitability.

### Location Support
- State and district/region selection.
- Live location option for obtaining the farmer's location.

### Weather & Agricultural Advisory
The application includes a weather section containing:
- Temperature
- Humidity
- Rainfall
- Wind information
- Agricultural weather advisory

### Mandi Prices
The application provides an APMC/Mandi section containing indicative market prices for selected crops.

###  Farmer Login & Registration
Farmers can:
- Login using mobile number and password/PIN.
- Create a farmer account.
- Enter farmer and farm-related information during registration.

###  Multilingual Interface
The interface provides language options for:
- English
- Hindi
- Marathi

###  Recommendation History
Previous crop recommendations can be viewed through the history section.

### Farmer Profile
A dedicated farmer profile section is included for displaying farmer and farm information.

---

## Technologies Used

- **HTML5** — Website structure
- **CSS3** — Styling and responsive interface
- **JavaScript** — Application functionality and recommendation interaction
- **Tailwind CSS** — UI styling
- **Chart.js** — Crop suitability visualization
- **Google Fonts** — Typography
- **LocalStorage** — Storing recommendation history

---

## Project Structure
AGRISENSE/
│
├── index.html
├── package.json
│
├── css/
│   └── styles.css
│
└── js/
    ├── app.js
    ├── crops-data.js
    └── model.js
