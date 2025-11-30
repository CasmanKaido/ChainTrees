# ChainTrees - Security Policy

## Reporting Security Vulnerabilities

We take the security of ChainTrees seriously. If you discover a security vulnerability, please follow these steps:

### 1. **Do Not** Publicly Disclose

Please do not create public GitHub issues for security vulnerabilities. This could put users at risk.

### 2. Report Privately

Send details to: **security@chaintrees.io** (or create a private security advisory on GitHub)

Include:
- Description of the vulnerability
- Steps to reproduce
- Potential impact
- Suggested fix (if any)

### 3. Response Time

- We will acknowledge your report within **48 hours**
- We aim to provide a fix within **7 days** for critical issues
- You will be credited in our security acknowledgments (unless you prefer to remain anonymous)

## Security Best Practices

### Smart Contract Security

- All contracts undergo thorough testing
- External audits before mainnet deployment
- Use of established patterns (OpenZeppelin, etc.)
- Timelock on critical functions
- Multi-sig for admin operations

### Frontend Security

- Input validation on all user inputs
- XSS protection via sanitization
- CSRF protection
- Secure wallet connection handling
- No storage of private keys

### Data Security

- Sensitive data encrypted at rest
- HTTPS/TLS for all communications
- No logging of sensitive information
- Regular security audits

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 1.x.x   | :white_check_mark: |
| < 1.0   | :x:                |

## Known Issues

We maintain a list of known security considerations:

1. **LocalStorage**: Used for non-sensitive data only
2. **Mock Data**: Development environment uses mock blockchain data
3. **Wallet Connection**: Always verify transaction details before signing

## Security Features

### Implemented

- ✅ WalletConnect v2 for secure wallet connections
- ✅ Input validation and sanitization
- ✅ Error boundary for graceful failure handling
- ✅ HTTPS enforcement in production
- ✅ Content Security Policy headers
- ✅ Rate limiting on API endpoints

### Planned

- 🔄 Two-factor authentication
- 🔄 Hardware wallet support
- 🔄 Transaction simulation before signing
- 🔄 Bug bounty program

## Responsible Disclosure

We follow responsible disclosure practices:

1. Researcher reports vulnerability privately
2. We confirm and develop a fix
3. Fix is deployed to production
4. Public disclosure after users have had time to update
5. Researcher receives credit and potential bounty

## Bug Bounty

We're planning to launch a bug bounty program. Stay tuned for details!

Severity levels:
- **Critical**: Up to $5,000
- **High**: Up to $2,500
- **Medium**: Up to $1,000
- **Low**: Up to $500

## Security Checklist for Contributors

Before submitting code:

- [ ] Input validation implemented
- [ ] No hardcoded secrets or keys
- [ ] Dependencies are up to date
- [ ] No console.log of sensitive data
- [ ] Error messages don't leak sensitive info
- [ ] SQL injection prevention (if applicable)
- [ ] XSS prevention implemented
- [ ] CSRF tokens used (if applicable)

## Contact

For security-related questions: **security@chaintrees.io**

For general questions: Create a GitHub issue

## Acknowledgments

We thank the following security researchers:

- (List will be updated as vulnerabilities are reported and fixed)

---

**Last Updated**: 2025-11-30

Thank you for helping keep ChainTrees secure! 🔒🌳
