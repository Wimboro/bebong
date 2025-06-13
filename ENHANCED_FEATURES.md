# Enhanced WhatsApp Financial Bot Features

## 🚀 New Features Overview

The WhatsApp Financial Bot has been enhanced with intelligent query understanding and personal assistant capabilities. The bot now uses **two different Gemini models** for optimal performance:

- **Gemini 2.5 Flash** - For transaction extraction from text and images
- **Gemini 1.5 Pro** - For query understanding and monthly report generation

## 🔍 Query Understanding Feature

### What It Does
The bot can now understand and respond to natural language questions about your financial data in Indonesian.

### Supported Query Types

#### 1. **Daily Queries**
- "transaksi hari ini"
- "pengeluaran hari ini"
- "pendapatan hari ini"

#### 2. **Weekly Queries**
- "transaksi minggu ini"
- "pengeluaran minggu lalu"
- "pendapatan minggu ini"

#### 3. **Monthly Queries**
- "transaksi bulan ini"
- "pengeluaran bulan lalu"
- "total pendapatan bulan ini"

#### 4. **Category Queries**
- "transaksi makanan"
- "pengeluaran transportasi"
- "semua transaksi kesehatan"

#### 5. **Recent Transactions**
- "5 transaksi terakhir"
- "10 transaksi terbaru"
- "transaksi terakhir"

#### 6. **Summary Queries**
- "ringkasan keuangan"
- "total pendapatan"
- "total pengeluaran"

### How It Works

1. **Time Context**: The bot gets accurate current time from TimeService (Jakarta timezone)
2. **Intent Analysis**: The bot analyzes your message using Gemini 2.0 Flash with time context
3. **Query Classification**: Determines if it's a query, transaction, or other message
4. **Data Filtering**: Filters your transaction data based on the query parameters using accurate time
5. **Response Generation**: Compiles and formats the financial data response with timestamp

### Example Conversations

```
User: "Transaksi hari ini"
Bot: 📊 *Hari Ini*
🕐 Diambil pada: 15 Januari 2024, 14:30 WIB

💰 Total Pendapatan: Rp 0
💸 Total Pengeluaran: Rp 75.000
📈 Jumlah Bersih: -Rp 75.000
📝 Total Transaksi: 3

*Detail Transaksi:*
1. -Rp 25.000 - Makanan
   Makan siang di warung
   📅 2024-01-15

2. -Rp 30.000 - Transportasi
   Bensin motor
   📅 2024-01-15

3. -Rp 20.000 - Makanan
   Kopi dan snack
   📅 2024-01-15
```

## 📊 Personal Assistant Feature

### Monthly Reports (`/report`)

The bot now includes an AI-powered personal assistant that generates comprehensive monthly financial reports.

#### Usage
- `/report` - Generate report for current month
- `/report 12` - Generate report for December (current year)
- `/report 12 2023` - Generate report for December 2023
- `/report 2024-01` - Generate report for January 2024

#### What's Included

1. **Financial Summary**
   - Total income and expenses
   - Net amount and transaction count
   - Category breakdown

2. **AI Analysis**
   - Spending pattern analysis
   - Largest expense categories
   - Trends and comparisons
   - Financial insights

3. **Recommendations**
   - Suggestions for next month
   - Budget optimization tips
   - Spending habit improvements

4. **Highlights**
   - Important transactions
   - Notable patterns
   - Achievement recognition

### Example Monthly Report

```
📊 *Laporan Bulanan Januari 2024*

## 💰 Ringkasan Keuangan
- Total Pendapatan: Rp 8.500.000
- Total Pengeluaran: Rp 6.200.000
- Saldo Bersih: Rp 2.300.000
- Jumlah Transaksi: 45

## 📈 Analisis Pola Pengeluaran
Pengeluaran terbesar Anda di bulan ini adalah kategori Makanan (35% dari total pengeluaran), diikuti oleh Transportasi (20%) dan Rumah Tangga (15%).

## 🎯 Rekomendasi untuk Februari
1. Pertimbangkan untuk meal prep untuk mengurangi pengeluaran makanan
2. Evaluasi penggunaan transportasi online vs transportasi umum
3. Tetap pertahankan disiplin dalam kategori hiburan

## ⭐ Highlight Bulan Ini
- Berhasil menghemat 27% dibanding bulan lalu
- Konsisten dalam pencatatan transaksi harian
- Pendapatan meningkat dari bonus proyek
```

## 🤖 Technical Implementation

### New Services

#### QueryService (`src/services/queryService.js`)
- **Model**: Gemini 2.0 Flash
- **Purpose**: Query analysis and data compilation with time awareness
- **Methods**:
  - `analyzeQuery()` - Analyze user intent with time context
  - `compileFinancialData()` - Filter and format data using accurate time
  - `generateMonthlyReport()` - AI-powered reports with time context
  - `formatResponse()` - Format responses with timestamp

#### Enhanced WhatsAppService
- **New Methods**:
  - `handleFinancialQuery()` - Process financial queries
  - `handleReportCommand()` - Generate monthly reports
- **Updated Logic**: Query detection before transaction processing

### Model Usage Strategy

1. **Gemini 2.5 Flash** (Fast & Efficient)
   - Transaction extraction from text
   - Receipt/image processing
   - Quick financial data parsing

2. **Gemini 2.0 Flash** (Advanced & Time-Aware)
   - Natural language understanding with time context
   - Complex query analysis with accurate temporal understanding
   - Monthly report generation with insights and time awareness

## 🔧 Configuration

### Environment Variables
No additional environment variables needed. The system uses the existing `GEMINI_API_KEY`.

### Dependencies
All required dependencies are already included in the existing `package.json`.

### TimeService Integration
The bot now uses TimeService for accurate time understanding:
- **Timezone**: Asia/Jakarta (WIB)
- **Time Source**: timeapi.io with fallback to local time
- **Caching**: 1-minute cache for performance
- **Context**: Provides real-time context to AI models

## 📱 User Experience

### Improved Help Message
The `/help` command now includes information about:
- Query capabilities
- Monthly report features
- Personal assistant functions

### Intelligent Message Processing
1. **Query Detection**: Automatically detects financial questions
2. **Fallback Processing**: If not a query, processes as transaction
3. **Error Handling**: Graceful degradation if query service unavailable

### Response Formatting
- **Structured Data**: Clear financial summaries
- **Visual Elements**: Emojis and formatting for readability
- **Contextual Information**: Relevant details based on query type

## 🚀 Getting Started

### For Existing Users
1. Restart your bot to load the new features
2. Try asking questions like "transaksi hari ini"
3. Generate your first monthly report with `/report`

### For New Users
Follow the existing setup instructions in `README.md`. All new features are automatically available.

## 🔮 Future Enhancements

Potential future improvements:
- Voice message processing
- Predictive spending alerts
- Budget goal tracking
- Multi-language support
- Advanced analytics dashboard

## 🐛 Troubleshooting

### Common Issues

1. **Query not recognized**
   - Try rephrasing your question
   - Use Indonesian language
   - Check spelling and grammar

2. **Monthly report empty**
   - Ensure you have transactions for the requested month
   - Check date format in your data

3. **Service unavailable**
   - Verify Gemini API key is valid
   - Check internet connection
   - Restart the bot if needed

### Debug Mode
Enable debug logging by checking console output for query analysis results.