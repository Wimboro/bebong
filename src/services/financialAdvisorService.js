const { GoogleGenAI } = require('@google/genai');
const TimeService = require('../utils/timeService');
const { formatRupiahSimple } = require('../utils/currencyUtils');
const moment = require('moment');

class FinancialAdvisorService {
    constructor(apiKey) {
        this.genAI = new GoogleGenAI({ apiKey: apiKey });
        this.timeService = new TimeService();
    }

    async analyzeAndRespond(userMessage, userTransactions) {
        try {
            // Get current time context
            const timeContext = await this.timeService.formatTimeForPrompt();
            
            // Prepare financial context from user's transaction data
            const financialContext = await this.prepareFinancialContext(userTransactions);
            
            const prompt = `${timeContext}

Anda adalah asisten keuangan personal yang cerdas dan membantu. Tugas Anda adalah menjawab pertanyaan atau permintaan pengguna tentang keuangan menggunakan data keuangan mereka sebagai konteks.

KONTEKS KEUANGAN PENGGUNA:
${financialContext}

INSTRUKSI PENTING:
1. SELALU gunakan Bahasa Indonesia yang ramah dan mudah dipahami
2. Gunakan data keuangan pengguna di atas sebagai konteks untuk memberikan jawaban yang personal dan relevan
3. Jika pertanyaan tidak terkait keuangan, arahkan kembali ke topik keuangan dengan sopan
4. Berikan saran yang praktis dan dapat ditindaklanjuti
5. Gunakan emoji yang sesuai untuk membuat respons lebih menarik
6. Jika data keuangan tidak mencukupi untuk menjawab, jelaskan dengan jujur
7. Hindari memberikan nasihat investasi spesifik, fokus pada pengelolaan keuangan umum
8. Selalu positif dan mendorong dalam nada komunikasi

Pertanyaan pengguna: "${userMessage}"

Berikan jawaban yang komprehensif, personal, dan membantu berdasarkan data keuangan mereka.`;

            const result = await this.genAI.models.generateContent({
                model: 'gemini-2.0-flash',
                contents: prompt,
            });

            return result.text;

        } catch (error) {
            console.error('Error in financial advisor service:', error);
            return 'Maaf, saya mengalami kesulitan memberikan saran keuangan saat ini. Silakan coba lagi dalam beberapa saat. 😊';
        }
    }

    async prepareFinancialContext(transactions) {
        try {
            if (!transactions || transactions.length === 0) {
                return 'TIDAK ADA DATA TRANSAKSI\nPengguna belum memiliki riwayat transaksi yang tercatat dalam sistem.';
            }

            // Get time data for accurate analysis
            const timeData = await this.timeService.getCurrentTime();
            const currentTime = moment(timeData.currentTime);

            // Calculate basic statistics
            const totalTransactions = transactions.length;
            const totalIncome = transactions.filter(t => t.amount > 0).reduce((sum, t) => sum + t.amount, 0);
            const totalExpenses = transactions.filter(t => t.amount < 0).reduce((sum, t) => sum + Math.abs(t.amount), 0);
            const netAmount = totalIncome - totalExpenses;

            // Category analysis
            const incomeCategories = {};
            const expenseCategories = {};

            transactions.forEach(t => {
                if (t.amount > 0) {
                    if (!incomeCategories[t.category]) {
                        incomeCategories[t.category] = 0;
                    }
                    incomeCategories[t.category] += t.amount;
                } else {
                    if (!expenseCategories[t.category]) {
                        expenseCategories[t.category] = 0;
                    }
                    expenseCategories[t.category] += Math.abs(t.amount);
                }
            });

            // Time-based analysis
            const thisMonth = currentTime.format('YYYY-MM');
            const lastMonth = currentTime.clone().subtract(1, 'month').format('YYYY-MM');
            
            const thisMonthTransactions = transactions.filter(t => 
                moment(t.date).format('YYYY-MM') === thisMonth
            );
            const lastMonthTransactions = transactions.filter(t => 
                moment(t.date).format('YYYY-MM') === lastMonth
            );

            const thisMonthExpenses = thisMonthTransactions
                .filter(t => t.amount < 0)
                .reduce((sum, t) => sum + Math.abs(t.amount), 0);
            const lastMonthExpenses = lastMonthTransactions
                .filter(t => t.amount < 0)
                .reduce((sum, t) => sum + Math.abs(t.amount), 0);

            // Format context
            let context = `📊 STATISTIK UMUM:
• Total Transaksi: ${totalTransactions}
• Total Pendapatan: ${formatRupiahSimple(totalIncome)}
• Total Pengeluaran: ${formatRupiahSimple(totalExpenses)}
• Saldo Bersih: ${formatRupiahSimple(netAmount)}

📈 ANALISIS BULANAN:
• Pengeluaran Bulan Ini: ${formatRupiahSimple(thisMonthExpenses)}
• Pengeluaran Bulan Lalu: ${formatRupiahSimple(lastMonthExpenses)}

💰 KATEGORI PENDAPATAN:`;

            Object.entries(incomeCategories)
                .sort(([,a], [,b]) => b - a)
                .forEach(([category, amount]) => {
                    context += `\n• ${category}: ${formatRupiahSimple(amount)}`;
                });

            context += `\n\n💸 KATEGORI PENGELUARAN:`;
            Object.entries(expenseCategories)
                .sort(([,a], [,b]) => b - a)
                .forEach(([category, amount]) => {
                    context += `\n• ${category}: ${formatRupiahSimple(amount)}`;
                });

            return context;

        } catch (error) {
            console.error('Error preparing financial context:', error);
            return 'Error menganalisis data keuangan pengguna.';
        }
    }

    async isFinancialQuestion(message) {
        try {
            const prompt = `Analisis apakah pertanyaan berikut berkaitan dengan keuangan, pengelolaan uang, investasi, budgeting, atau topik finansial lainnya.

Pertanyaan: "${message}"

Kembalikan hanya "YA" jika berkaitan dengan keuangan, atau "TIDAK" jika tidak berkaitan.`;

            const result = await this.genAI.models.generateContent({
                model: 'gemini-2.0-flash',
                contents: prompt,
            });

            const response = result.text.trim().toUpperCase();
            return response === 'YA';

        } catch (error) {
            console.error('Error checking if financial question:', error);
            return true; // Default to treating as financial if unsure
        }
    }
}

module.exports = FinancialAdvisorService; 