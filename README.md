# 📧 Portfólio Luis Carlos Carvalho - Sistema Email

Sistema de portfólio profissional com envio de mensagens de contato via email.

## 🚀 Funcionalidades

- ✅ Portfólio profissional completo
- ✅ Calculadora logística interativa
- ✅ Formulário de contato com envio por email
- ✅ Envio automático de mensagens via Nodemailer
- ✅ Interface responsiva e moderna

## 📧 Como funciona o sistema de contato

1. **Usuário preenche** o formulário com:
   - Nome
   - Email
   - Contato
   - Assunto
   - Mensagem

2. **Sistema processa** e envia email para carvalho.c.c@hotmail.com

3. **Usuário vê apenas**: "Mensagem enviada com sucesso!"

4. **Você recebe** email formatado na caixa de entrada

## 🔧 Configuração

### 1. Instalar dependências
```bash
npm install
```

### 2. Configurar arquivo .env
```env
EMAIL_USER=carvalho.c.c@hotmail.com
EMAIL_PASS=sua_senha_do_hotmail
PORT=3001
```

### 3. Executar
```bash
# Frontend
npm run dev

# Backend (nova aba do terminal)
node server.cjs
```

## 📧 Formato do email recebido

```
🔔 Nova mensagem do portfólio

👤 Nome: [Nome da pessoa]
📧 Email: [Email da pessoa]
📱 Contato: [Contato dela]
📋 Assunto: [Assunto]

💬 Mensagem:
[Mensagem completa]

⏰ Enviado em: [Data e hora]
```

## 🛠️ Tecnologias utilizadas

- **Frontend**: HTML5, CSS3, JavaScript
- **Backend**: Node.js, Express
- **Email**: Nodemailer
- **Styling**: CSS Grid, Flexbox, Animations

## 📁 Estrutura do projeto

```
├── index.html              # Página principal
├── calculadora-logistica.html # Calculadora dedicada
├── styles.css              # Estilos principais
├── calculator-styles.css   # Estilos da calculadora
├── script.js              # JavaScript principal
├── calculator-script.js   # JavaScript da calculadora
├── server.cjs             # Servidor backend
├── package.json           # Dependências
├── .env                   # Configurações (não commitado)
├── .env.example          # Exemplo de configurações
└── README.md             # Documentação
```

## 🔒 Segurança

- ✅ Credenciais em arquivo .env
- ✅ Validação de dados no frontend e backend
- ✅ CORS configurado
- ✅ Sanitização de inputs

## 📞 Contato

- **Telefone**: +351 964 300 708
- **Email**: carvalho.c.c@hotmail.com
- **LinkedIn**: linkedin.com/in/luiscarvalhoti
- **GitHub**: github.com/LuisCarlosCarvalho

---

Sistema desenvolvido para Luis Carlos Carvalho - Gestor de Logística e TI