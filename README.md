# NEAR Todo App

A full-stack decentralized todo application built on NEAR Protocol with multiple smart contract implementations.

## 📋 Project Structure

```
todo/
├── todoContract-ts/     # Smart contract (TypeScript/AssemblyScript)
│   ├── src/
│   │   └── contract.ts  # Todo contract logic
│   ├── sandbox-test/    # Integration tests
│   ├── build/           # Compiled WASM files
│   ├── package.json
│   └── tsconfig.json
│
├── todoContract-py/     # Smart contract (Python)
│   ├── contract.py      # Todo contract logic
│   ├── tests/           # Unit tests
│   ├── build/           # Compiled WASM files
│   ├── .venv/           # Virtual environment
│   ├── pyproject.toml   # Python dependencies
│   └── uv.lock          # Lock file
│
├── todoContract-rs/     # Smart contract (Rust)
│   ├── src/
│   │   └── lib.rs       # Todo contract logic
│   ├── tests/           # Integration tests
│   ├── target/          # Build artifacts
│   ├── Cargo.toml       # Rust dependencies
│   └── rust-toolchain.toml
│
├── frontend/            # Next.js frontend application
│   ├── src/
│   │   ├── components/  # React components
│   │   ├── pages/       # Next.js pages
│   │   └── config.ts    # Contract configuration
│   ├── public/          # Static assets
│   ├── package.json
│   ├── next.config.js
│   └── tsconfig.json
│
├── .gitignore           # Git ignore patterns
└── README.md            # This file
```

## 🏗️ Architecture Overview

This repository contains a NEAR Protocol dApp with:

1. **Three Contract Implementations**: The same todo contract logic implemented in TypeScript, Python, and Rust
2. **Unified Frontend**: Single Next.js application that can interact with any contract deployment
3. **Modular Design**: Each contract is independent and can be deployed separately

### Contract Features
- User-specific task management
- CRUD operations (Create, Read, Update, Delete)
- Ownership-based authorization
- Completion status tracking

## 🚀 Contract Deployment


### Contract Methods

- **`add_task({ title })`** - Create a new task
- **`list_tasks()`** - Get all tasks (view only)
- **`delete_task({ task_id })`** - Delete a task (only owner)
- **`toggle_task({ task_id })`** - Toggle task completion status


## 🛠️ Development Setup

### Prerequisites

- **Node.js** >= 18.0.0
- **npm** or **yarn**
- **Python** >= 3.10 (for Python contract)
- **Rust** >= 1.70.0 (for Rust contract)
- **NEAR CLI** >= 4.0.0
- **Git**

Install NEAR CLI:
```bash
npm install -g near-cli
```

### TypeScript Contract

```bash
cd todoContract-ts

# Install dependencies
npm install

# Build contract
npm run build

# Run tests
npm test

# Deploy to testnet
near deploy --accountId YOUR_ACCOUNT.testnet --wasmFile build/contract.wasm
```

### Python Contract

```bash
cd todoContract-py

## 1. Build and Deploy the Contract

### Setup Virtual Environment

Creates a virtual environment with all required dependencies for building the contract.

```bash
uvx nearc contract.py --create-venv
```

### Build the Contract

Compile the contract to WebAssembly:

```bash
uvx nearc contract.py
```

This will create a `contract.wasm` file in the project root.

### Deploy to Testnet

```bash
near deploy <your-account-id>.testnet contract.wasm
```

### Initialize the Contract

After deployment, initialize the contract:

```bash
near call <your-account-id>.testnet initialize '{}' --accountId <your-account-id>.testnet
```


### Rust Contract

```bash
cd todoContract-rs

# Build contract (optimized for deployment)
cargo build --target wasm32-unknown-unknown --release

# Run tests
cargo test

# Deploy to testnet
cargo near deploy <account-id>
```

### Frontend

```bash
cd frontend

# Install dependencies
npm install

# Configure contract address (edit src/config.ts)
# Set CONTRACT_NAME to your deployed contract

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

## 🧪 Testing Guidelines

### Contract Testing

Each contract implementation should have:
- **Unit tests**: Test individual functions
- **Integration tests**: Test contract workflows
- **Coverage**: Aim for >80% code coverage

**Run all contract tests:**
```bash
# TypeScript
cd todoContract-ts && npm test

# Python
cd todoContract-py && pytest tests/ -v --cov=contract

# Rust
cd todoContract-rs && cargo test
```

### Frontend Testing

```bash
cd frontend
npm test                  # Run unit tests
npm run test:e2e         # Run end-to-end tests (if configured)
npm run lint             # Check code quality
npm run type-check       # TypeScript type checking
```

## 🚀 Deployment Procedures

### 1. Choose Contract Implementation
Select which contract implementation to deploy (TypeScript, Python, or Rust). All provide the same functionality.

### 2. Build Contract
```bash
# Build the chosen contract (see Development Setup above)
```

### 3. Deploy to Testnet
```bash
# Login to NEAR CLI
near login

# Deploy contract
near deploy --accountId YOUR_ACCOUNT.testnet --wasmFile path/to/contract.wasm

# Initialize if needed
near call YOUR_ACCOUNT.testnet new '{}' --accountId YOUR_ACCOUNT.testnet
```

### 4. Configure Frontend
Update `frontend/src/config.ts`:
```typescript
export const CONTRACT_NAME = 'YOUR_ACCOUNT.testnet';
```

### 5. Deploy Frontend
```bash
cd frontend
npm run build

# Deploy to Vercel, Netlify, or your hosting platform
```
## 🤝 Contributing


### Development Workflow
1. **Clone repository**
   ```bash
   git clone https://github.com/YOUR_USERNAME/todo.git
   cd todo
   ```

2. **Install dependencies**
   ```bash
   # Install all project dependencies
   npm install                        # Root dependencies
   cd frontend && npm install         # Frontend
   cd ../todoContract-ts && npm install  # TypeScript contract
   ```

3. **Make changes**
   - Write code following conventions
   - Add/update tests
   - Update documentation

4. **Test your changes**
   ```bash
   # Run relevant tests
   npm test              # In contract directories
   npm run lint          # Check code quality
   ```

5. **Commit and push**
   ```bash
   git add .
   git commit -m "feat: your feature description"
   git push origin feature/your-feature
   ```


## 📚 Additional Resources

- [NEAR Documentation](https://docs.near.org/)
- [NEAR SDK JS](https://github.com/near/near-sdk-js)
- [NEAR SDK RS](https://github.com/near/near-sdk-rs)
- [NEAR SDK Python](https://github.com/near/near-sdk-py)
- [Next.js Documentation](https://nextjs.org/docs)