# Quick Start Guide - Design to Template Automation

## 🚀 Get Started in 3 Minutes

### 1. Setup Environment

```bash
# Navigate to project directory
cd Templates-automation-

# Copy environment template
cp .env.example .env

# Edit .env and add your Anthropic API key
# ANTHROPIC_API_KEY=sk-ant-xxxxxxxxxxxxx
```

### 2. Start Development Server

```bash
npm run dev
```

Expected output:
```
[timestamp] [INFO] 🚀 Server running on http://localhost:3000
[timestamp] [INFO] 📝 API Health: http://localhost:3000/api/health
[timestamp] [INFO] 🎨 Frontend: http://localhost:3000
```

### 3. Open in Browser

```
http://localhost:3000
```

## ✨ What You'll See

**Left Panel**: Form for uploading design and configuring template
**Center Panel**: Live preview of generated template
**Right Panel**: Generated HTML, CSS, JavaScript, and variables

## 🔄 Available Commands

```bash
npm run dev              # Start with auto-reload
npm run build            # Compile TypeScript
npm start                # Start production server
npm run lint             # Check code style
npm run format           # Auto-format code
```

## 📡 Test API Endpoints

### Health Check
```bash
curl http://localhost:3000/api/health
```

Response:
```json
{
  "status": "ok",
  "timestamp": "2026-03-10T...",
  "uptime": 123.45
}
```

### Available Section Types
```bash
curl http://localhost:3000/api/section-types
```

## 🎯 Current Status

**Phase 1**: ✅ Complete
- Project structure initialized
- Express server running
- Frontend UI ready
- All basic endpoints working
- Form validation functional

**Phase 2**: ⏳ Coming Next
- Claude API integration
- Image processing
- Template generation
- SOP validation

## 📚 Documentation

- **[README.md](./README.md)** - Project overview and features
- **[DEVELOPMENT.md](./DEVELOPMENT.md)** - Complete development guide
- **[docs/PHASE1_SUMMARY.md](./docs/PHASE1_SUMMARY.md)** - Phase 1 details
- **[docs/](./docs/)** - Additional documentation (coming in Phase 2)

## 🛠️ Common Tasks

### Change Port
```bash
PORT=3001 npm run dev
```

### View Logs in Detail
```bash
LOG_LEVEL=debug npm run dev
```

### Build for Production
```bash
npm run build
npm start
```

## ⚙️ Project Structure

```
├── backend/src/          # Backend application
│   ├── config/           # Configuration files
│   ├── types/            # TypeScript types
│   ├── utils/            # Utility functions
│   └── index.ts          # Server entry point
├── frontend/             # Frontend application
│   ├── index.html        # Main page
│   ├── css/              # Stylesheets
│   └── js/               # JavaScript
├── docs/                 # Documentation
├── package.json          # Dependencies
├── tsconfig.json         # TypeScript config
└── README.md             # Project readme
```

## 🔐 Security Notes

- ✅ API keys stored in `.env` (not in repo)
- ✅ `.env` is in `.gitignore`
- ✅ Node modules excluded from git
- ✅ Secrets never logged

## 🆘 Troubleshooting

### Port Already in Use
```bash
# Kill process on port 3000
lsof -i :3000
kill -9 <PID>

# Or use different port
PORT=3001 npm run dev
```

### Dependencies Not Installed
```bash
rm -rf node_modules
npm install
npm run dev
```

### API Key Not Working
1. Check `.env` file exists
2. Verify key is set: `ANTHROPIC_API_KEY=sk-ant-...`
3. No quotes around the key
4. Restart `npm run dev`

### TypeScript Errors
```bash
npm run build  # See detailed error messages
```

## 📞 Support

- Check [DEVELOPMENT.md](./DEVELOPMENT.md) for detailed help
- Review error messages in browser console (F12)
- Check server logs in terminal running `npm run dev`
- Read [docs/](./docs/) folder for more details

## 🎓 Learning Path

1. **Understand the System**
   - Read [README.md](./README.md)
   - Review project structure

2. **Setup Development Environment**
   - Follow [DEVELOPMENT.md](./DEVELOPMENT.md)
   - Run `npm run dev`

3. **Explore the Code**
   - Check `backend/src/index.ts` - Server setup
   - Check `frontend/index.html` - UI structure
   - Check `frontend/js/main.js` - Application logic

4. **Next Phase**
   - Claude API integration coming in Phase 2
   - Watch the console for updates

## 🚀 What's Next?

**Phase 2** will add:
- Claude AI integration
- Design image analysis
- Template generation
- SOP validation
- Advanced features

**Stay tuned!**

---

**Need Help?** Check the [docs/](./docs/) folder or run `npm run dev` and check the browser console.

**Happy building! 🎨**
