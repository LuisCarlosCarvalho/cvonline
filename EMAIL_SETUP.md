# 📧 Configuração EmailJS - Guia Completo

## 🎯 O que é EmailJS?
Serviço que permite enviar emails diretamente do frontend, sem backend. Perfeito para formulários de contato!

## 📋 Passo 1: Criar conta EmailJS

1. Acesse: https://www.emailjs.com/
2. Clique em **"Sign Up"**
3. Crie sua conta gratuita
4. Confirme seu email

## 🔧 Passo 2: Configurar Email Service

1. No dashboard, clique em **"Email Services"**
2. Clique **"Add New Service"**
3. Escolha **"Outlook"** (para Hotmail)
4. Preencha:
   - **Service ID**: `outlook_service` (ou outro nome)
   - **User ID**: `carvalho.c.c@hotmail.com`
   - **Access Token**: Sua senha do Hotmail

## 📝 Passo 3: Criar Template de Email

1. Vá em **"Email Templates"**
2. Clique **"Create New Template"**
3. Configure:

**Template ID**: `contact_form`

**Subject**: `[PORTFÓLIO] {{subject}}`

**Content**:
```
🔔 Nova mensagem do portfólio

👤 Nome: {{from_name}}
📧 Email: {{from_email}}
📱 Contato: {{contact_number}}
📋 Assunto: {{subject}}

💬 Mensagem:
{{message}}

⏰ Enviado em: {{sent_date}}

---
Para responder, use: {{reply_to}}
```

**Settings**:
- **To Email**: `carvalho.c.c@hotmail.com`
- **From Name**: `{{from_name}}`
- **Reply To**: `{{reply_to}}`

## 🔑 Passo 4: Pegar as chaves

1. Vá em **"Account"** → **"General"**
2. Copie sua **Public Key**

3. Vá em **"Email Services"**
4. Copie o **Service ID**

5. Vá em **"Email Templates"**  
6. Copie o **Template ID**

## 📝 Passo 5: Configurar no código

No arquivo `script.js`, substitua:

```javascript
// Substitua estas linhas:
emailjs.init("YOUR_PUBLIC_KEY");           // Sua Public Key
'YOUR_SERVICE_ID',                         // Seu Service ID  
'YOUR_TEMPLATE_ID',                        // Seu Template ID
```

**Exemplo:**
```javascript
emailjs.init("user_abc123def456");
'outlook_service',
'contact_form',
```

## ✅ Passo 6: Testar

1. Salve o arquivo
2. Abra o site
3. Preencha o formulário
4. Clique "Enviar Mensagem"
5. Verifique seu email: carvalho.c.c@hotmail.com

## 💰 Limites Gratuitos

- ✅ **200 emails/mês** grátis
- ✅ Sem necessidade de backend
- ✅ Funciona em qualquer hospedagem
- ✅ Muito confiável

## 🆘 Problemas comuns

1. **"Invalid public key"**: Verifique se copiou a Public Key correta
2. **"Service not found"**: Verifique o Service ID
3. **"Template not found"**: Verifique o Template ID
4. **Email não chega**: Verifique spam/lixo eletrônico

## 🔄 Alternativa Simples (Fallback)

Se der problema, o sistema tem um fallback que abre o cliente de email padrão com a mensagem já formatada.

---

**🎯 Resultado final:**
- Usuário preenche formulário
- Vê "Mensagem enviada com sucesso!"
- Você recebe email formatado no carvalho.c.c@hotmail.com
- Pode responder diretamente pelo email