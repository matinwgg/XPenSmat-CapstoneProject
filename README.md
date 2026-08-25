# XPenSmat — Intelligent Expense Management for Ghanaian FinTech

## 📖 About

XPenSmat is a capstone project exploring intelligent personal-finance management in a Ghanaian/FinTech context. It combines financial-data ingestion, local storage, expense categorisation and prediction, natural-language interaction, export, synchronization, and a mobile application layer.

### Why it exists

Personal-finance software must combine useful intelligence with strong protection of highly sensitive financial data. XPenSmat explores how mobile engineering, machine learning, data modelling, and secure financial-data handling can work together.

## ✨ Features

- SMS and bank-transaction ingestion
- Expense categorisation and prediction
- Local financial-data storage
- ML/NLP-assisted interaction
- Data export
- Appwrite synchronization
- Android/mobile application layer
- Separate `ml/` research and training components

## 🛠 Tech Stack

- React Native / Expo mobile tooling
- JavaScript/TypeScript components present in the application
- Appwrite services
- Machine-learning components under `ml/`
- Android/Gradle build tooling

Consult the repository's package manifests for the exact version matrix.

## 🏗 Architecture

```text
Financial inputs
      ↓
Ingestion + normalization
      ↓
Local financial state
      ├── Expense analytics / ML
      ├── NLP interaction
      └── Export
      ↓
Authenticated synchronization
      ↓
Appwrite-backed services
```

## 📁 Project Structure

```text
.
├── existing_app_files/  # Mobile application source and Android project
├── ml/                  # ML/training/research components
├── android/             # Android build configuration where applicable
└── README.md
```

## 📋 Prerequisites

- Node.js compatible with the project's Expo/React Native version
- npm/yarn
- Android Studio for Android development
- Android SDK / emulator or physical device
- Appwrite project for synchronization features

## 🚀 Getting Started

```bash
git clone https://github.com/matinwgg/XPenSmat-CapstoneProject.git
cd XPenSmat-CapstoneProject
```

Install the dependencies using the package manager associated with the application package manifest, configure Appwrite/environment values through local configuration, and run the Expo/React Native development workflow defined by the project.

## 💻 Usage

A typical workflow is:

1. Configure the application and synchronization backend.
2. Run the mobile application on a development device/emulator.
3. Ingest or enter financial transactions.
4. Review categorisation, predictions, and analytics.
5. Export or synchronize data as required.

## 🔐 Security Considerations

Financial data is sensitive. The project therefore emphasizes least-privilege permissions, protected local state, secure authentication, safe synchronization, release signing, backup policy, and careful export handling. Production use would require a full mobile threat model, cryptographic storage review, privacy assessment, compliance review, and penetration testing.

## 🧪 Testing

Run the platform-specific tests and Android build checks supplied by the project. Security testing should include authentication/session handling, local storage, backup behavior, exported files, deep links, network traffic, and authorization boundaries.

## 🚧 Limitations & Future Work

- Strengthen encrypted local persistence
- Reduce unnecessary Android permissions
- Formalize ML evaluation and uncertainty
- Add privacy-preserving analytics
- Expand end-to-end tests
- Add production observability and crash/security monitoring

## 🤝 Contributing

Keep financial-data assumptions explicit, add regression tests for sensitive workflows, and never commit personal financial data or credentials.

## 📄 License

See repository license information.

## 👨‍💻 Author

**Matin Odoom**
