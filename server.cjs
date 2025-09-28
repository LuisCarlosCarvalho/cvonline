const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3001;

if (!process.env.EMAIL_PASS) {
    console.warn('⚠️  AVISO: Senha do email não configurada. Verifique o arquivo .env');
}

// Middleware
app.use(cors());
app.use(express.json());

// Configuração do Nodemailer para Hotmail
let transporter = null;
if (process.env.EMAIL_PASS) {
    transporter = nodemailer.createTransport({
        service: 'hotmail',
        auth: {
            user: process.env.EMAIL_USER || 'carvalho.c.c@hotmail.com',
            pass: process.env.EMAIL_PASS
        }
    });
}

// Endpoint para enviar mensagem via Email
app.post('/send-email', async (req, res) => {
    try {
        const { name, email, contact, subject, message } = req.body;

        // Validação básica
        if (!name || !email || !contact || !subject || !message) {
            return res.status(400).json({ 
                success: false, 
                error: 'Todos os campos são obrigatórios' 
            });
        }

        // Enviar por email
        if (transporter) {
            const emailOptions = {
                from: process.env.EMAIL_USER || 'carvalho.c.c@hotmail.com',
                to: 'carvalho.c.c@hotmail.com',
                subject: `[PORTFÓLIO] ${subject}`,
                html: `
                    <h2>🔔 Nova mensagem do portfólio</h2>
                    <p><strong>👤 Nome:</strong> ${name}</p>
                    <p><strong>📧 Email:</strong> ${email}</p>
                    <p><strong>📱 Contato:</strong> ${contact}</p>
                    <p><strong>📋 Assunto:</strong> ${subject}</p>
                    <br>
                    <p><strong>💬 Mensagem:</strong></p>
                    <p>${message.replace(/\n/g, '<br>')}</p>
                    <br>
                    <p><strong>⏰ Enviado em:</strong> ${new Date().toLocaleString('pt-BR')}</p>
                    <hr>
                    <p><em>Para responder, use: ${email}</em></p>
                `
            };

            try {
                await transporter.sendMail(emailOptions);
                console.log('Email enviado com sucesso para carvalho.c.c@hotmail.com');
                
                res.json({ 
                    success: true, 
                    message: 'Email enviado com sucesso!'
                });
            } catch (emailError) {
                console.error('Erro ao enviar email:', emailError);
                res.status(500).json({ 
                    success: false, 
                    error: 'Erro ao enviar email. Verifique as configurações.' 
                });
                return;
            }
        } else {
            console.log('Email não configurado - simulando envio');
            res.json({ 
                success: true, 
                message: 'Mensagem recebida! (Configure EMAIL_PASS no .env para envio real)'
            });
            return;
        }

        // Armazenar dados do contato para resposta futura
        const contactData = {
            name,
            email,
            contact: contact,
            subject,
            message,
            timestamp: new Date().toISOString()
        };

        // Aqui você pode salvar no banco de dados se quiser
        console.log('Dados do contato armazenados:', contactData);


    } catch (error) {
        console.error('Erro ao enviar mensagem:', error);
        res.status(500).json({ 
            success: false, 
            error: 'Erro interno do servidor. Tente novamente.' 
        });
    }
});

// Health check
app.get('/health', (req, res) => {
    res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.listen(port, () => {
    console.log(`🚀 Servidor rodando na porta ${port}`);
    console.log(`📧 Email configurado para: carvalho.c.c@hotmail.com`);
    if (transporter) {
        console.log('✅ Transporter de email configurado');
    } else {
        console.log('⚠️  Transporter de email NÃO configurado (modo simulação)');
    }
});