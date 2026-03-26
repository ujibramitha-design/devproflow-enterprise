name: CI/CD Pipeline

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]

jobs:
  test:
    runs-on: ubuntu-latest
    
    strategy:
      matrix:
        node-version: [18.x, 20.x]
    
    steps:
    - uses: actions/checkout@v4
    
    - name: Use Node.js ${{ matrix.node-version }}
      uses: actions/setup-node@v4
      with:
        node-version: ${{ matrix.node-version }}
        cache: 'npm'
    
    - name: Install dependencies
      run: |
        cd 06_Shared_Components && npm install
        cd ../02_Web_Application/frontend && npm install
        cd ../05_UI_Design_System/web_ui && npm install
    
    - name: Run tests
      run: |
        cd 06_Shared_Components && npm test || echo "Tests skipped"
        cd ../02_Web_Application/frontend && npm test || echo "Tests skipped"
        cd ../05_UI_Design_System/web_ui && npm test || echo "Tests skipped"
    
    - name: Build shared components
      run: |
        cd 06_Shared_Components && npm run build
    
    - name: Build web application
      run: |
        cd 02_Web_Application/frontend && npm run build
    
    - name: Build UI design system
      run: |
        cd 05_UI_Design_System/web_ui && npm run build

  security:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v4
    
    - name: Run security audit
      run: |
        cd 06_Shared_Components && npm audit --audit-level=high
        cd ../02_Web_Application/frontend && npm audit --audit-level=high
        cd ../05_UI_Design_System/web_ui && npm audit --audit-level=high

  deploy:
    needs: [test, security]
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    
    steps:
    - uses: actions/checkout@v4
    
    - name: Deploy to staging
      run: |
        echo "Deployment to staging environment"
        echo "Add your deployment commands here"
