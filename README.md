
# 🌱 NPK Soil Analysis & Fertilizer Recommendation App

This app connects to a soil-scanning rover to:

* Trigger **Soil Scans** via the mobile app
* Receive **real-time NPK (Nitrogen, Phosphorus, Potassium) data**
* Provide **fertilizer recommendations** instantly

---

## 🚀 Features

* **Live GPS Tracking** → See your bot's location on the map
* **Soil Scanning** → Trigger scans directly from your phone
* **Fertilizer Recommendations** → Based on real-time NPK readings

---

## 🖥️ How It Works

1. **Soil Scan** → Press the *Scan Soil* button in the app
2. **Bot Scan** → The rover reads NPK sensor data
3. **Data Processing** → Bot sends NPK values back to the app
4. **Fertilizer Prediction** → App shows recommendations based on thresholds

---

## 📱 App Screens

### 🗺 Map Screen

* Displays the rover’s **current location**
* Manual **forward, backward, left, right** controls

### 🌾 Data Prediction Screen

* Shows **NPK readings**
* Provides **fertilizer recommendations** in a neat card view

---

## 🧠 Fertilizer Recommendation Logic

| Condition            | Recommendation                         |
| -------------------- | -------------------------------------- |
| Nitrogen < 20        | Add Nitrogen-rich fertilizer (Urea)    |
| Phosphorus < 15      | Add Phosphorus-rich fertilizer (DAP)   |
| Potassium < 25       | Add Potassium-rich fertilizer (MOP)    |
| All above thresholds | Soil is balanced, no fertilizer needed |

---

## 📡 App Setup

1️⃣ Install dependencies

```bash
npm install
```

2️⃣ Start the app

```bash
npx expo start
```

3️⃣ Open the app using **Expo Go** on your phone.

---

## 📷 Example UI

| Map Screen           | Fertilizer Prediction Screen |
| -------------------- | ---------------------------- |
| ![Map](docs/map.png) | ![Prediction](docs/data.png) |

---

## ⚡ Future Improvements

?

---

